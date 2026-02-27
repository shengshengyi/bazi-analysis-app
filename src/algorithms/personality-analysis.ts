import { BaziData, DimensionAnalysis } from '../models/types.js';

/**
 * 性格分析
 * 分析日主五行属性 → 基本性格底色
 * 分析十神分布 → 行为模式
 * 分析阴阳比例 → 内外向倾向
 */
export function analyzePersonality(bazi: BaziData): DimensionAnalysis {
  const dayMaster = bazi.pillars.day.stem;
  const pillars = [bazi.pillars.year, bazi.pillars.month, bazi.pillars.day, bazi.pillars.hour];

  // 日主性格底色
  const baseCharacter = getElementCharacter(dayMaster.element, dayMaster.yinYang);

  // 统计十神分布
  const shiShenCount: Record<string, number> = {};
  const yinYangCount = { yin: 0, yang: 0 };

  for (const pillar of pillars) {
    // 统计阴阳
    if (pillar.stem.yinYang === '阳') yinYangCount.yang++;
    else yinYangCount.yin++;

    // 统计十神
    if (pillar.stem.shiShen) {
      shiShenCount[pillar.stem.shiShen] = (shiShenCount[pillar.stem.shiShen] || 0) + 1;
    }

    for (const hidden of pillar.branch.hiddenStems) {
      shiShenCount[hidden.shiShen] = (shiShenCount[hidden.shiShen] || 0) + 1;
    }
  }

  // 分析行为模式
  const behaviorPattern = analyzeBehaviorPattern(shiShenCount);

  // 分析内外向
  const extroversion = analyzeExtroversion(yinYangCount, shiShenCount);

  // 计算性格得分（综合各项指标）
  const stability = calculateStability(bazi);
  const adaptability = calculateAdaptability(shiShenCount);
  const sociability = calculateSociability(shiShenCount, yinYangCount);

  const totalScore = Math.round((stability + adaptability + sociability) / 3);

  // 生成分析文本
  const analysisText = generatePersonalityAnalysis({
    dayMaster: dayMaster.name + dayMaster.element,
    baseCharacter,
    behaviorPattern,
    extroversion,
    shiShenCount
  });

  // 关键词
  const keywords: string[] = [
    baseCharacter.type,
    extroversion.type,
    ...behaviorPattern.traits.slice(0, 2)
  ];

  // 机遇与挑战
  const opportunities: string[] = [];
  const challenges: string[] = [];

  opportunities.push(baseCharacter.strength);

  if (extroversion.score > 7) {
    opportunities.push('善于社交，人缘好，利于事业发展');
    challenges.push('可能过于外向，需注意独处和内省');
  } else if (extroversion.score < 4) {
    opportunities.push('善于思考，有深度');
    challenges.push('可能过于内向，建议多参与社交活动');
  }

  if (shiShenCount['比肩'] || shiShenCount['劫财']) {
    opportunities.push('独立自主，有主见');
  }

  if (shiShenCount['正印'] || shiShenCount['偏印']) {
    opportunities.push('好学深思，有智慧');
  }

  return {
    score: totalScore,
    level: scoreToLevel(totalScore),
    analysis: analysisText,
    keywords,
    opportunities,
    challenges
  };
}

function getElementCharacter(element: string, yinYang: string): { type: string; strength: string } {
  const characters: Record<string, { yang: { type: string; strength: string }; yin: { type: string; strength: string } }> = {
    '木': {
      yang: { type: '开拓型', strength: '有领导力，敢于创新，积极向上' },
      yin: { type: '柔韧型', strength: '适应力强，善解人意，有耐心' }
    },
    '火': {
      yang: { type: '热情型', strength: '热情洋溢，感染力强，行动派' },
      yin: { type: '温和型', strength: '温和有礼，注重细节，体贴入微' }
    },
    '土': {
      yang: { type: '稳重型', strength: '踏实可靠，有责任心，值得信赖' },
      yin: { type: '包容型', strength: '包容心强，善于协调，细腻温和' }
    },
    '金': {
      yang: { type: '果断型', strength: '果断坚决，有魄力，重情义' },
      yin: { type: '精致型', strength: '追求完美，有品位，重细节' }
    },
    '水': {
      yang: { type: '智慧型', strength: '聪明机智，善变通，有谋略' },
      yin: { type: '深沉型', strength: '深思熟虑，有内涵，感情丰富' }
    }
  };

  return characters[element]?.[yinYang.toLowerCase() as 'yang' | 'yin'] || { type: '平和型', strength: '性格平和，适应力强' };
}

function analyzeBehaviorPattern(shiShenCount: Record<string, number>): { traits: string[] } {
  const traits: string[] = [];

  const counts = Object.entries(shiShenCount).sort((a, b) => b[1] - a[1]);

  for (const [shiShen, count] of counts.slice(0, 3)) {
    if (count < 2) continue;

    switch (shiShen) {
      case '比肩':
      case '劫财':
        traits.push('独立性强', '竞争意识强');
        break;
      case '食神':
      case '伤官':
        traits.push('有创造力', '表达能力强');
        break;
      case '正财':
      case '偏财':
        traits.push('务实理性', '重视物质');
        break;
      case '正官':
      case '七杀':
        traits.push('自律守规', '有责任感');
        break;
      case '正印':
      case '偏印':
        traits.push('好学深思', '内敛稳重');
        break;
    }
  }

  return { traits: [...new Set(traits)] };
}

function analyzeExtroversion(yinYangCount: { yin: number; yang: number }, shiShenCount: Record<string, number>): { type: string; score: number } {
  // 阳多则外向，阴多则内向
  let score = 5;

  if (yinYangCount.yang > yinYangCount.yin) {
    score += 2;
  } else if (yinYangCount.yin > yinYangCount.yang) {
    score -= 2;
  }

  // 食伤多者外向
  if ((shiShenCount['食神'] || 0) + (shiShenCount['伤官'] || 0) >= 3) {
    score += 2;
  }

  // 印多者内向
  if ((shiShenCount['正印'] || 0) + (shiShenCount['偏印'] || 0) >= 3) {
    score -= 1;
  }

  score = Math.max(1, Math.min(10, score));

  let type = '平衡型';
  if (score >= 7) type = '外向型';
  else if (score <= 4) type = '内向型';

  return { type, score };
}

function calculateStability(bazi: BaziData): number {
  // 八字五行是否平衡
  const elements: Record<string, number> = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };

  const pillars = [bazi.pillars.year, bazi.pillars.month, bazi.pillars.day, bazi.pillars.hour];
  for (const p of pillars) {
    elements[p.stem.element]++;
    elements[p.branch.element]++;
  }

  const values = Object.values(elements);
  const max = Math.max(...values);
  const min = Math.min(...values.filter(v => v > 0));

  // 差距越小越稳定
  return Math.max(1, 10 - (max - min));
}

function calculateAdaptability(shiShenCount: Record<string, number>): number {
  // 食伤代表变通能力
  const shiShang = (shiShenCount['食神'] || 0) + (shiShenCount['伤官'] || 0);
  return Math.min(10, shiShang * 2 + 3);
}

function calculateSociability(shiShenCount: Record<string, number>, yinYangCount: { yin: number; yang: number }): number {
  // 财多、食伤多、阳多者善交际
  const cai = (shiShenCount['正财'] || 0) + (shiShenCount['偏财'] || 0);
  const shiShang = (shiShenCount['食神'] || 0) + (shiShenCount['伤官'] || 0);

  let score = 5;
  score += cai;
  score += shiShang;
  if (yinYangCount.yang > yinYangCount.yin) score += 1;

  return Math.min(10, score);
}

function generatePersonalityAnalysis(data: {
  dayMaster: string;
  baseCharacter: { type: string; strength: string };
  behaviorPattern: { traits: string[] };
  extroversion: { type: string; score: number };
  shiShenCount: Record<string, number>;
}): string {
  const parts: string[] = [];

  parts.push(`日主${data.dayMaster}，属于${data.baseCharacter.type}性格。`);
  parts.push(data.baseCharacter.strength + '。');

  parts.push(`整体倾向${data.extroversion.type}，`);
  if (data.extroversion.score >= 7) {
    parts.push('喜欢与人交流，善于表达自己。');
  } else if (data.extroversion.score <= 4) {
    parts.push('更喜欢独处思考，内心世界丰富。');
  } else {
    parts.push('内外平衡，既能社交也能独处。');
  }

  if (data.behaviorPattern.traits.length > 0) {
    parts.push(`性格特点包括：${data.behaviorPattern.traits.join('、')}。`);
  }

  return parts.join('');
}

function scoreToLevel(score: number): 'excellent' | 'good' | 'average' | 'weak' {
  if (score >= 8) return 'excellent';
  if (score >= 6) return 'good';
  if (score >= 4) return 'average';
  return 'weak';
}
