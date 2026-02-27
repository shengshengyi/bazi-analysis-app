import { BaziData, DimensionAnalysis } from '../models/types.js';

/**
 * 健康分析
 * 分析五行偏枯 → 对应脏腑弱点
 * 分析日主强弱 → 整体体质
 * 分析寒暖燥湿 → 体质倾向
 * 分析刑冲合会 → 突发健康问题
 */
export function analyzeHealth(bazi: BaziData): DimensionAnalysis {
  // 统计五行分布
  const elements = countElements(bazi);

  // 分析脏腑弱点
  const organWeakness = analyzeOrganWeakness(elements);

  // 分析体质倾向
  const constitution = analyzeConstitution(bazi, elements);

  // 分析健康风险
  const healthRisks = analyzeHealthRisks(bazi);

  // 计算健康得分
  const balanceScore = calculateElementBalance(elements);
  const dayMasterStrength = calculateDayMasterStrength(bazi);

  const totalScore = Math.round((balanceScore + dayMasterStrength + constitution.score) / 3);

  // 生成分析文本
  const analysisText = generateHealthAnalysis({
    elements,
    organWeakness,
    constitution,
    healthRisks
  });

  // 关键词
  const keywords: string[] = [
    constitution.type,
    ...organWeakness.slice(0, 2).map(o => o.organ)
  ];

  // 机遇与挑战（养生建议）
  const opportunities: string[] = [];
  const challenges: string[] = [];

  if (balanceScore >= 7) {
    opportunities.push('五行相对平衡，整体健康状况良好');
  } else {
    challenges.push('五行偏枯，需注意相应脏腑保健');
  }

  for (const weakness of organWeakness) {
    challenges.push(`${weakness.organ}相对较弱，建议${weakness.advice}`);
  }

  opportunities.push(...constitution.recommendations);

  return {
    score: totalScore,
    level: scoreToLevel(totalScore),
    analysis: analysisText,
    keywords,
    opportunities,
    challenges
  };
}

function countElements(bazi: BaziData): Record<string, number> {
  const elements: Record<string, number> = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };

  const pillars = [bazi.pillars.year, bazi.pillars.month, bazi.pillars.day, bazi.pillars.hour];

  for (const pillar of pillars) {
    // 天干
    elements[pillar.stem.element]++;
    // 地支
    elements[pillar.branch.element]++;
  }

  return elements;
}

function analyzeOrganWeakness(elements: Record<string, number>): Array<{ organ: string; advice: string }> {
  const organMap: Record<string, { organ: string; advice: string }> = {
    '木': { organ: '肝胆', advice: '保持情绪舒畅，避免熬夜，少饮酒' },
    '火': { organ: '心脏、眼睛', advice: '避免过度劳累，注意血压，保护视力' },
    '土': { organ: '脾胃', advice: '饮食规律，避免生冷，细嚼慢咽' },
    '金': { organ: '肺、大肠', advice: '注意呼吸系统保养，预防便秘' },
    '水': { organ: '肾、膀胱', advice: '避免过度劳累腰部，注意保暖，适量饮水' }
  };

  const weaknesses: Array<{ organ: string; advice: string }> = [];
  const values = Object.values(elements);
  const avg = values.reduce((a, b) => a + b, 0) / 5;

  for (const [element, count] of Object.entries(elements)) {
    if (count < avg - 0.5) {
      weaknesses.push(organMap[element]);
    }
  }

  return weaknesses;
}

function analyzeConstitution(bazi: BaziData, elements: Record<string, number>): { type: string; score: number; recommendations: string[] } {
  // 分析寒暖燥湿
  const fire = elements['火'];
  const water = elements['水'];
  const wood = elements['木'];
  const metal = elements['金'];
  const earth = elements['土'];

  let type = '平和质';
  let score = 5;
  const recommendations: string[] = [];

  // 寒热判断
  if (fire > water + 1) {
    type = '偏热质';
    score = Math.max(1, 10 - (fire - water));
    recommendations.push('饮食宜清淡，多食凉性食物如绿豆、苦瓜');
    recommendations.push('避免辛辣燥热食物，保持充足睡眠');
  } else if (water > fire + 1) {
    type = '偏寒质';
    score = Math.max(1, 10 - (water - fire));
    recommendations.push('注意保暖，多食温性食物如姜、羊肉');
    recommendations.push('避免生冷食物，适量运动增强体质');
  }

  // 燥湿判断
  if (metal + fire > wood + water) {
    type += '偏燥';
    recommendations.push('注意补充水分，保持环境湿润');
  } else if (wood + water > metal + fire + 1) {
    type += '偏湿';
    recommendations.push('饮食宜健脾祛湿，如薏米、红豆');
  }

  return { type, score, recommendations };
}

function analyzeHealthRisks(bazi: BaziData): string[] {
  const risks: string[] = [];
  const relations = bazi.relations;

  // 检查刑冲
  for (const [pillar, rels] of Object.entries(relations)) {
    if (rels.branch['冲']) {
      risks.push(`${pillar}支有冲，需注意突发健康问题`);
    }
    if (rels.branch['刑']) {
      risks.push(`${pillar}支有刑，注意慢性疾病`);
    }
  }

  // 检查特定神煞
  for (const [pillar, shenShas] of Object.entries(bazi.shenSha)) {
    if (shenShas.includes('血刃')) {
      risks.push('有血刃，注意预防意外伤害');
    }
  }

  return risks;
}

function calculateElementBalance(elements: Record<string, number>): number {
  const values = Object.values(elements);
  const max = Math.max(...values);
  const min = Math.min(...values.filter(v => v > 0)) || 0;

  // 差距越小越平衡
  return Math.max(1, 10 - (max - min) * 2);
}

function calculateDayMasterStrength(bazi: BaziData): number {
  const dayMaster = bazi.pillars.day.stem;
  const monthBranch = bazi.pillars.month.branch;

  let score = 5;

  // 得令
  if (isSeasonStrength(dayMaster.element, monthBranch.element)) {
    score += 2;
  }

  // 得地（地支有根）
  const hasRoot = [bazi.pillars.year, bazi.pillars.month, bazi.pillars.hour].some(p =>
    p.branch.hiddenStems.some(h => h.name === dayMaster.name)
  );
  if (hasRoot) score += 1;

  return Math.min(10, score);
}

function isSeasonStrength(dayElement: string, monthElement: string): boolean {
  // 五行当令月份
  const seasonMap: Record<string, string[]> = {
    '木': ['木', '水'],
    '火': ['火', '木'],
    '土': ['土', '火'],
    '金': ['金', '土'],
    '水': ['水', '金']
  };

  return seasonMap[dayElement]?.includes(monthElement) || false;
}

function generateHealthAnalysis(data: {
  elements: Record<string, number>;
  organWeakness: Array<{ organ: string; advice: string }>;
  constitution: { type: string; recommendations: string[] };
  healthRisks: string[];
}): string {
  const parts: string[] = [];

  // 五行分布
  const elementDist = Object.entries(data.elements)
    .map(([e, c]) => `${e}${c}`)
    .join('、');
  parts.push(`八字五行分布为${elementDist}。`);

  // 体质类型
  parts.push(`属于${data.constitution.type}。`);

  // 脏腑弱点
  if (data.organWeakness.length > 0) {
    parts.push(`需注意${data.organWeakness.map(o => o.organ).join('、')}的保养。`);
  } else {
    parts.push('五行相对平衡，各脏腑功能较为协调。');
  }

  // 健康风险
  if (data.healthRisks.length > 0) {
    parts.push(data.healthRisks.join('；') + '。');
  }

  return parts.join('');
}

function scoreToLevel(score: number): 'excellent' | 'good' | 'average' | 'weak' {
  if (score >= 8) return 'excellent';
  if (score >= 6) return 'good';
  if (score >= 4) return 'average';
  return 'weak';
}
