import { BaziData, AnalysisReport, AnalyzeRequest, DimensionAnalysis } from '../models/types.js';
import { analyzeCareer } from '../algorithms/career-analysis.js';
import { analyzeWealth } from '../algorithms/wealth-analysis.js';
import { analyzeFortune } from '../algorithms/fortune-analysis.js';
import { analyzePersonality } from '../algorithms/personality-analysis.js';
import { analyzeHealth } from '../algorithms/health-analysis.js';

/**
 * 综合分析服务
 * 根据请求进行指定维度的分析
 */
export function analyzeBazi(request: AnalyzeRequest): AnalysisReport {
  const { baziData, dimensions, year } = request;

  // 初始化所有维度
  const allDimensions: Record<string, DimensionAnalysis> = {
    career: { score: 5, level: 'average', analysis: '未分析', keywords: [], opportunities: [], challenges: [] },
    wealth: { score: 5, level: 'average', analysis: '未分析', keywords: [], opportunities: [], challenges: [] },
    fortune: { score: 5, level: 'average', analysis: '未分析', keywords: [], opportunities: [], challenges: [] },
    personality: { score: 5, level: 'average', analysis: '未分析', keywords: [], opportunities: [], challenges: [] },
    health: { score: 5, level: 'average', analysis: '未分析', keywords: [], opportunities: [], challenges: [] }
  };

  // 执行请求的分析维度
  if (dimensions.includes('career')) {
    allDimensions.career = analyzeCareer(baziData);
  }

  if (dimensions.includes('wealth')) {
    allDimensions.wealth = analyzeWealth(baziData);
  }

  if (dimensions.includes('fortune')) {
    allDimensions.fortune = analyzeFortune(baziData, year);
  }

  if (dimensions.includes('personality')) {
    allDimensions.personality = analyzePersonality(baziData);
  }

  if (dimensions.includes('health')) {
    allDimensions.health = analyzeHealth(baziData);
  }

  // 生成综合建议
  const advice = generateAdvice(allDimensions);

  // 生成综述
  const summary = generateSummary(baziData, allDimensions, dimensions);

  return {
    summary,
    dimensions: {
      career: allDimensions.career,
      wealth: allDimensions.wealth,
      fortune: allDimensions.fortune,
      personality: allDimensions.personality,
      health: allDimensions.health
    },
    advice
  };
}

/**
 * 快速分析 - 分析所有维度
 */
export function quickAnalyze(baziData: BaziData, year?: number): AnalysisReport {
  return analyzeBazi({
    baziData,
    dimensions: ['career', 'wealth', 'fortune', 'personality', 'health'],
    year
  });
}

function generateAdvice(dimensions: Record<string, DimensionAnalysis>): string[] {
  const advice: string[] = [];

  // 从各维度提取建议
  for (const [key, dim] of Object.entries(dimensions)) {
    if (dim.opportunities.length > 0) {
      advice.push(...dim.opportunities.slice(0, 1));
    }
  }

  // 添加通用建议
  const avgScore = Object.values(dimensions).reduce((sum, d) => sum + d.score, 0) / 5;

  if (avgScore >= 7) {
    advice.push('整体运势较好，宜积极进取，把握机遇');
  } else if (avgScore <= 4) {
    advice.push('当前处于调整期，建议稳扎稳打，积累实力');
  } else {
    advice.push('保持平常心，扬长避短，顺势而为');
  }

  return [...new Set(advice)].slice(0, 5);
}

function generateSummary(
  baziData: BaziData,
  dimensions: Record<string, DimensionAnalysis>,
  requestedDims: string[]
): string {
  const parts: string[] = [];

  // 基本信息
  parts.push(`${baziData.gender}命，日主${baziData.dayMaster}。`);
  parts.push(`八字为${baziData.bazi}。`);

  // 分析维度概述
  const analyzedDims: string[] = [];
  const dimNames: Record<string, string> = {
    career: '事业', wealth: '财富', fortune: '运势', personality: '性格', health: '健康'
  };

  for (const dim of requestedDims) {
    const analysis = dimensions[dim];
    if (analysis && analysis.score >= 7) {
      analyzedDims.push(`${dimNames[dim]}运佳`);
    } else if (analysis && analysis.score <= 4) {
      analyzedDims.push(`${dimNames[dim]}需努力`);
    } else {
      analyzedDims.push(`${dimNames[dim]}平稳`);
    }
  }

  if (analyzedDims.length > 0) {
    parts.push(analyzedDims.join('，') + '。');
  }

  return parts.join('');
}
