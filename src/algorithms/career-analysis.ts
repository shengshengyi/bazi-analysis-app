import { BaziData, DimensionAnalysis } from '../models/types.js';

/**
 * 职业分析
 * 分析官杀星（正官、七杀）旺衰 → 管理能力
 * 分析财星（正财、偏财）旺衰 → 商业敏感度
 * 分析印星（正印、偏印）旺衰 → 学习能力
 * 分析食伤（食神、伤官）旺衰 → 创造力
 */
export function analyzeCareer(bazi: BaziData): DimensionAnalysis {
  const pillars = [bazi.pillars.year, bazi.pillars.month, bazi.pillars.day, bazi.pillars.hour];

  // 统计各类十神出现次数
  let guanSha = 0;  // 正官、七杀 - 管理能力
  let caiXing = 0;  // 正财、偏财 - 商业敏感度
  let yinXing = 0;  // 正印、偏印 - 学习能力
  let shiShang = 0; // 食神、伤官 - 创造力
  let biJie = 0;    // 比肩、劫财 - 竞争力

  const allShiShen: string[] = [];

  for (const pillar of pillars) {
    // 天干十神
    if (pillar.stem.shiShen) {
      allShiShen.push(pillar.stem.shiShen);
      categorizeShiShen(pillar.stem.shiShen);
    }

    // 地支藏干十神
    for (const hidden of pillar.branch.hiddenStems) {
      allShiShen.push(hidden.shiShen);
      categorizeShiShen(hidden.shiShen);
    }
  }

  function categorizeShiShen(s: string) {
    if (s === '正官' || s === '七杀') guanSha++;
    else if (s === '正财' || s === '偏财') caiXing++;
    else if (s === '正印' || s === '偏印') yinXing++;
    else if (s === '食神' || s === '伤官') shiShang++;
    else if (s === '比肩' || s === '劫财') biJie++;
  }

  // 计算各项得分（1-10分）
  const manageScore = Math.min(10, guanSha * 2 + 2);  // 管理能力
  const businessScore = Math.min(10, caiXing * 2 + 2); // 商业敏感度
  const learnScore = Math.min(10, yinXing * 2 + 2);    // 学习能力
  const createScore = Math.min(10, shiShang * 2 + 2);  // 创造力
  const competeScore = Math.min(10, biJie * 2 + 2);    // 竞争力

  // 综合职业得分
  const totalScore = Math.round((manageScore + businessScore + learnScore + createScore + competeScore) / 5);

  // 确定职业倾向
  const tendencies: string[] = [];
  if (guanSha >= 2) tendencies.push('管理型');
  if (caiXing >= 2) tendencies.push('商业型');
  if (yinXing >= 2) tendencies.push('学术型');
  if (shiShang >= 2) tendencies.push('创意型');
  if (biJie >= 2) tendencies.push('创业型');

  if (tendencies.length === 0) tendencies.push('稳健型');

  // 适合行业
  const industries: string[] = [];
  if (guanSha > 0) industries.push('管理岗位', '公务员', '企业管理');
  if (caiXing > 0) industries.push('金融投资', '贸易销售', '创业经商');
  if (yinXing > 0) industries.push('教育培训', '研究开发', '咨询顾问');
  if (shiShang > 0) industries.push('艺术设计', '文化传媒', '科技创新');
  if (biJie > 0) industries.push('自主创业', '合伙经营', '团队协作领域');

  // 分析文本
  const analysisText = generateCareerAnalysis(bazi.dayMaster, tendencies, {
    guanSha, caiXing, yinXing, shiShang, biJie
  });

  // 机遇与挑战
  const opportunities: string[] = [];
  const challenges: string[] = [];

  if (guanSha >= 2) {
    opportunities.push('具有领导才能，适合担任管理职位');
  } else {
    challenges.push('管理能力需培养，建议多学习领导力课程');
  }

  if (caiXing >= 2) {
    opportunities.push('对商机敏感，适合从事商业活动');
  } else {
    challenges.push('商业意识需提升，建议关注市场动态');
  }

  if (shiShang >= 2) {
    opportunities.push('创造力强，适合创新性工作');
  }

  return {
    score: totalScore,
    level: scoreToLevel(totalScore),
    analysis: analysisText,
    keywords: [...tendencies, ...industries.slice(0, 3)],
    opportunities,
    challenges
  };
}

function scoreToLevel(score: number): 'excellent' | 'good' | 'average' | 'weak' {
  if (score >= 8) return 'excellent';
  if (score >= 6) return 'good';
  if (score >= 4) return 'average';
  return 'weak';
}

function generateCareerAnalysis(
  dayMaster: string,
  tendencies: string[],
  counts: { guanSha: number; caiXing: number; yinXing: number; shiShang: number; biJie: number }
): string {
  const parts: string[] = [];

  parts.push(`日主为${dayMaster}，属于${tendencies.join('、')}人格。`);

  if (counts.guanSha >= 2) {
    parts.push('官杀星旺，具备良好的组织协调能力和责任心，适合管理岗位。');
  }

  if (counts.caiXing >= 2) {
    parts.push('财星旺，对金钱和商机有敏锐的嗅觉，适合从事商业、金融相关工作。');
  }

  if (counts.yinXing >= 2) {
    parts.push('印星旺，学习能力强，喜欢钻研，适合学术、教育、研究领域。');
  }

  if (counts.shiShang >= 2) {
    parts.push('食伤星旺，思维活跃，创意丰富，适合艺术、设计、创新类工作。');
  }

  if (counts.biJie >= 2) {
    parts.push('比劫旺，竞争意识强，有创业精神，适合自主创业或竞争性强的领域。');
  }

  if (Object.values(counts).every(c => c < 2)) {
    parts.push('八字平和，适合稳健型工作，建议在工作中积累经验，稳步发展。');
  }

  return parts.join('');
}
