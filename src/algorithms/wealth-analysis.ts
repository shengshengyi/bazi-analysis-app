import { BaziData, DimensionAnalysis } from '../models/types.js';

/**
 * 财富分析
 * 分析日主强弱 vs 财星强弱 → 担财能力
 * 分析财星是否有根 → 财源稳定性
 * 分析比劫旺衰 → 破财风险
 * 分析食伤生财能力 → 财富创造力
 */
export function analyzeWealth(bazi: BaziData): DimensionAnalysis {
  const pillars = [bazi.pillars.year, bazi.pillars.month, bazi.pillars.day, bazi.pillars.hour];

  // 统计财星、比劫、食伤
  let zhengCai = 0;  // 正财
  let pianCai = 0;   // 偏财
  let biJian = 0;    // 比肩
  let jieCai = 0;    // 劫财
  let shiShen = 0;   // 食神
  let shangGuan = 0; // 伤官
  let zhengYin = 0;  // 正印
  let pianYin = 0;   // 偏印

  // 判断日主五行和阴阳
  const dayMaster = bazi.pillars.day.stem;
  const dayElement = dayMaster.element;
  const dayYinYang = dayMaster.yinYang;

  for (const pillar of pillars) {
    // 天干
    if (pillar.stem.shiShen) {
      categorizeShiShen(pillar.stem.shiShen);
    }
    // 地支藏干
    for (const hidden of pillar.branch.hiddenStems) {
      categorizeShiShen(hidden.shiShen);
    }
  }

  function categorizeShiShen(s: string) {
    switch (s) {
      case '正财': zhengCai++; break;
      case '偏财': pianCai++; break;
      case '比肩': biJian++; break;
      case '劫财': jieCai++; break;
      case '食神': shiShen++; break;
      case '伤官': shangGuan++; break;
      case '正印': zhengYin++; break;
      case '偏印': pianYin++; break;
    }
  }

  const totalCai = zhengCai + pianCai;
  const totalBiJie = biJian + jieCai;
  const totalShiShang = shiShen + shangGuan;
  const totalYin = zhengYin + pianYin;

  // 计算日主强弱（简化版）
  const seasonStrength = calculateSeasonStrength(dayElement, bazi.pillars.month.branch.element);
  const rootStrength = calculateRootStrength(bazi);
  const dayMasterStrength = Math.min(10, (seasonStrength + rootStrength) / 2);

  // 计算财富得分
  // 担财能力 = 日主强弱与财星的平衡
  const caiStrength = totalCai * 2;
  const burdenCapacity = calculateBurdenCapacity(dayMasterStrength, caiStrength);

  // 财源稳定性
  const stability = Math.min(10, totalCai * 2 + (zhengCai > 0 ? 2 : 0));

  // 财富创造力（食伤生财）
  const creationPower = Math.min(10, totalShiShang * 2);

  // 破财风险（比劫夺财）
  const riskScore = Math.max(0, 10 - totalBiJie * 2);

  // 综合财富得分
  const totalScore = Math.round((burdenCapacity + stability + creationPower + riskScore) / 4);

  // 分析文本
  const analysisText = generateWealthAnalysis({
    dayMasterStrength,
    totalCai,
    zhengCai,
    pianCai,
    totalBiJie,
    totalShiShang,
    burdenCapacity
  });

  // 财富等级
  let wealthLevel = '普通';
  if (totalScore >= 8) wealthLevel = '富贵';
  else if (totalScore >= 6) wealthLevel = '小康';
  else if (totalScore >= 4) wealthLevel = '平稳';
  else wealthLevel = '需努力';

  // 机遇与挑战
  const opportunities: string[] = [];
  const challenges: string[] = [];

  if (burdenCapacity >= 7) {
    opportunities.push('具备承担财富的能力，有机会获得较大财富');
  } else {
    challenges.push('担财能力有限，建议稳健理财，避免过度投资');
  }

  if (totalCai >= 3) {
    opportunities.push('财星旺，求财机会多');
  }

  if (totalBiJie >= 3) {
    challenges.push('比劫旺，需注意破财风险，避免借贷给他人');
  }

  if (totalShiShang >= 2) {
    opportunities.push('食伤生财，可以通过技能、创意获得财富');
  }

  if (pianCai > zhengCai) {
    opportunities.push('偏财旺，适合投资理财、副业等非固定收入');
  } else {
    opportunities.push('正财旺，适合稳定工作获取收入');
  }

  return {
    score: totalScore,
    level: scoreToLevel(totalScore),
    analysis: analysisText,
    keywords: [wealthLevel, pianCai > zhengCai ? '偏财型' : '正财型', totalShiShang > 0 ? '生财有道' : '稳健理财'],
    opportunities,
    challenges
  };
}

function calculateSeasonStrength(dayElement: string, monthElement: string): number {
  // 五行相生相克判断当令情况
  // 同五行得令得10分，生我者得8分，我生者得6分，克我者得4分，我克者得5分
  if (dayElement === monthElement) return 10;

  const shengWo: Record<string, string> = { '木': '水', '火': '木', '土': '火', '金': '土', '水': '金' };
  const woSheng: Record<string, string> = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
  const keWo: Record<string, string> = { '木': '金', '火': '水', '土': '木', '金': '火', '水': '土' };

  if (shengWo[dayElement] === monthElement) return 8;
  if (woSheng[dayElement] === monthElement) return 6;
  if (keWo[dayElement] === monthElement) return 4;
  return 5; // 我克
}

function calculateRootStrength(bazi: BaziData): number {
  // 查看日主在其他地支中是否有根（藏干中是否有与日主相同的天干）
  const dayMasterName = bazi.pillars.day.stem.name;
  let count = 0;

  const allBranches = [
    bazi.pillars.year.branch,
    bazi.pillars.month.branch,
    bazi.pillars.hour.branch
  ];

  for (const branch of allBranches) {
    for (const hidden of branch.hiddenStems) {
      if (hidden.name === dayMasterName) {
        count++;
      }
    }
  }

  return Math.min(10, count * 3 + 2);
}

function calculateBurdenCapacity(dayMasterStrength: number, caiStrength: number): number {
  // 最佳比例是日主略强于财星
  const ratio = dayMasterStrength / (caiStrength || 1);
  if (ratio >= 0.8 && ratio <= 1.5) return 9;
  if (ratio >= 0.5 && ratio <= 2) return 7;
  if (ratio > 2) return 5; // 日主太强，求财动力不足
  return 4; // 日主太弱，担不起财
}

function scoreToLevel(score: number): 'excellent' | 'good' | 'average' | 'weak' {
  if (score >= 8) return 'excellent';
  if (score >= 6) return 'good';
  if (score >= 4) return 'average';
  return 'weak';
}

function generateWealthAnalysis(data: {
  dayMasterStrength: number;
  totalCai: number;
  zhengCai: number;
  pianCai: number;
  totalBiJie: number;
  totalShiShang: number;
  burdenCapacity: number;
}): string {
  const parts: string[] = [];

  // 财星情况
  if (data.totalCai >= 3) {
    parts.push('财星旺盛，求财欲望强烈，有较好的财富机遇。');
  } else if (data.totalCai >= 1) {
    parts.push('财星适中，对财富有正常追求，通过努力可以积累财富。');
  } else {
    parts.push('财星较弱，求财需付出更多努力，建议以技能求财。');
  }

  // 正偏财
  if (data.pianCai > data.zhengCai) {
    parts.push('偏财强于正财，适合投资理财、副业、创业等非固定收入方式。');
  } else if (data.zhengCai > data.pianCai) {
    parts.push('正财强于偏财，适合稳定工作，通过职业发展获得财富。');
  }

  // 担财能力
  if (data.burdenCapacity >= 7) {
    parts.push('日主能担财，有机会掌握较大财富。');
  } else {
    parts.push('建议稳健理财，量入为出，逐步积累财富。');
  }

  // 食伤生财
  if (data.totalShiShang >= 2) {
    parts.push('食伤生财，可以通过专业技能、创意想法获得财富。');
  }

  // 比劫影响
  if (data.totalBiJie >= 3) {
    parts.push('需注意比劫夺财，避免借贷他人，投资需谨慎。');
  }

  return parts.join('');
}
