import { BaziData, DimensionAnalysis, DaYunCycle } from '../models/types.js';

/**
 * 运势分析
 * 分析当前大运干支与原局关系
 * 分析流年干支与日主/用神关系
 * 分析刑冲合会
 * 分析神煞流年影响
 */
export function analyzeFortune(bazi: BaziData, year: number = new Date().getFullYear()): DimensionAnalysis {
  // 获取当前大运
  const currentDaYun = getCurrentDaYun(bazi.daYun, year);

  // 分析大运与原局关系
  const daYunAnalysis = analyzeDaYun(bazi, currentDaYun);

  // 分析流年
  const liuNianAnalysis = analyzeLiuNian(bazi, year);

  // 分析刑冲合会
  const relationImpact = analyzeRelations(bazi);

  // 分析神煞
  const shenShaImpact = analyzeShenSha(bazi);

  // 综合运势得分
  const totalScore = Math.round((daYunAnalysis.score + liuNianAnalysis.score + relationImpact.score + shenShaImpact.score) / 4);

  // 生成分析文本
  const analysisText = generateFortuneAnalysis({
    currentDaYun,
    year,
    daYunAnalysis,
    liuNianAnalysis,
    relationImpact
  });

  // 机遇与挑战
  const opportunities: string[] = [];
  const challenges: string[] = [];

  if (daYunAnalysis.score >= 7) {
    opportunities.push('当前大运有利，适合把握机遇发展事业');
  } else if (daYunAnalysis.score <= 4) {
    challenges.push('大运处于调整期，建议稳扎稳打，不宜冒进');
  }

  if (liuNianAnalysis.score >= 7) {
    opportunities.push(`${year}年流年运势较好，可以积极行动`);
  } else if (liuNianAnalysis.score <= 4) {
    challenges.push(`${year}年需谨慎行事，注意风险防范`);
  }

  if (shenShaImpact.hasJiXing) {
    opportunities.push('流年有吉星高照，贵人运佳');
  }
  if (shenShaImpact.hasXiongXing) {
    challenges.push('需注意健康问题，避免冒险行为');
  }

  return {
    score: totalScore,
    level: scoreToLevel(totalScore),
    analysis: analysisText,
    keywords: [currentDaYun?.ganZhi || '', `${year}流年`, daYunAnalysis.trend],
    opportunities: opportunities.length > 0 ? opportunities : ['保持平常心，把握当下'],
    challenges: challenges.length > 0 ? challenges : ['无重大风险，正常发展']
  };
}

function getCurrentDaYun(daYun: BaziData['daYun'], year: number): DaYunCycle | null {
  for (const cycle of daYun.cycles) {
    if (year >= cycle.startYear && year <= cycle.endYear) {
      return cycle;
    }
  }
  return daYun.cycles[0] || null;
}

function analyzeDaYun(bazi: BaziData, daYun: DaYunCycle | null): { score: number; trend: string } {
  if (!daYun) return { score: 5, trend: '平' };

  const dayMaster = bazi.pillars.day.stem.name;
  const dayElement = bazi.pillars.day.stem.element;

  // 分析大运天干与日主关系
  let score = 5;
  let trend = '平稳';

  // 如果大运天干是喜用神，加分
  const shiShen = daYun.stemShiShen;
  if (['正印', '偏印', '正官', '正财'].includes(shiShen)) {
    score += 2;
    trend = '上升';
  } else if (['食神', '伤官'].includes(shiShen)) {
    score += 1;
    trend = '活跃';
  }

  // 分析大运地支
  const branchShiShen = daYun.branchShiShen;
  if (branchShiShen.some(s => ['正财', '偏财'].includes(s))) {
    score += 1;
  }

  return { score: Math.min(10, score), trend };
}

function analyzeLiuNian(bazi: BaziData, year: number): { score: number } {
  // 计算流年干支
  const liuNianGanZhi = yearToGanZhi(year);

  const dayMaster = bazi.pillars.day.stem.name;
  const dayElement = bazi.pillars.day.stem.element;

  let score = 5;

  // 简单判断：流年天干生助日主为吉
  // 实际应该根据用神判断，这里简化处理
  const liuNianElement = getGanElement(liuNianGanZhi[0]);

  if (isShengZhu(dayElement, liuNianElement)) {
    score += 2;
  } else if (isKeZhu(dayElement, liuNianElement)) {
    score -= 1;
  }

  return { score: Math.max(1, Math.min(10, score)) };
}

function analyzeRelations(bazi: BaziData): { score: number } {
  let score = 5;

  // 检查刑冲合会
  const relations = bazi.relations;
  let hasHe = false;
  let hasChong = false;
  let hasXing = false;

  for (const pillar of Object.values(relations)) {
    const branch = pillar.branch;
    if (branch['六合'] || branch['三合'] || branch['半合']) hasHe = true;
    if (branch['冲']) hasChong = true;
    if (branch['刑']) hasXing = true;
  }

  if (hasHe) score += 1;
  if (hasChong) score -= 1;
  if (hasXing) score -= 1;

  return { score: Math.max(1, Math.min(10, score)) };
}

function analyzeShenSha(bazi: BaziData): { score: number; hasJiXing: boolean; hasXiongXing: boolean } {
  const jiXing = ['天乙贵人', '太极贵人', '福星贵人', '天德合', '月德合', '金舆'];
  const xiongXing = ['血刃', '元辰', '九丑', '童子煞'];

  let hasJiXing = false;
  let hasXiongXing = false;

  for (const [pillar, shenShas] of Object.entries(bazi.shenSha)) {
    for (const ss of shenShas) {
      if (jiXing.includes(ss)) hasJiXing = true;
      if (xiongXing.includes(ss)) hasXiongXing = true;
    }
  }

  let score = 5;
  if (hasJiXing) score += 1;
  if (hasXiongXing) score -= 1;

  return { score: Math.max(1, Math.min(10, score)), hasJiXing, hasXiongXing };
}

function generateFortuneAnalysis(data: {
  currentDaYun: DaYunCycle | null;
  year: number;
  daYunAnalysis: { score: number; trend: string };
  liuNianAnalysis: { score: number };
  relationImpact: { score: number };
}): string {
  const parts: string[] = [];

  if (data.currentDaYun) {
    parts.push(`当前行${data.currentDaYun.ganZhi}大运（${data.currentDaYun.startYear}-${data.currentDaYun.endYear}），`);
    parts.push(`大运天干为${data.currentDaYun.stemShiShen}，运势呈${data.daYunAnalysis.trend}趋势。`);
  }

  const liuNianGanZhi = yearToGanZhi(data.year);
  parts.push(`${data.year}年${liuNianGanZhi}流年，`);

  if (data.liuNianAnalysis.score >= 7) {
    parts.push('流年运势较好，适合积极进取，把握机遇。');
  } else if (data.liuNianAnalysis.score <= 4) {
    parts.push('流年需谨慎，建议守成，避免重大变动。');
  } else {
    parts.push('流年运势平稳，正常发展即可。');
  }

  return parts.join('');
}

function scoreToLevel(score: number): 'excellent' | 'good' | 'average' | 'weak' {
  if (score >= 8) return 'excellent';
  if (score >= 6) return 'good';
  if (score >= 4) return 'average';
  return 'weak';
}

// 辅助函数：年份转干支
function yearToGanZhi(year: number): string {
  const gan = ['庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己'];
  const zhi = ['申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未'];

  const ganIndex = year % 10;
  const zhiIndex = year % 12;

  return gan[ganIndex] + zhi[zhiIndex];
}

function getGanElement(gan: string): string {
  const map: Record<string, string> = {
    '甲': '木', '乙': '木',
    '丙': '火', '丁': '火',
    '戊': '土', '己': '土',
    '庚': '金', '辛': '金',
    '壬': '水', '癸': '水'
  };
  return map[gan] || '';
}

function isShengZhu(target: string, source: string): boolean {
  const sheng: Record<string, string> = { '木': '水', '火': '木', '土': '火', '金': '土', '水': '金' };
  return sheng[target] === source;
}

function isKeZhu(target: string, source: string): boolean {
  const ke: Record<string, string> = { '木': '金', '火': '水', '土': '木', '金': '火', '水': '土' };
  return ke[target] === source;
}
