// 八字排盘数据类型定义

// 天干
export interface Stem {
  name: string;           // 天干名称
  element: '木' | '火' | '土' | '金' | '水';  // 五行
  yinYang: '阳' | '阴';   // 阴阳
  shiShen?: string;       // 十神
}

// 地支藏干
export interface HiddenStem {
  name: string;
  shiShen: string;
  type: '主气' | '中气' | '余气';
}

// 地支
export interface Branch {
  name: string;
  element: '木' | '火' | '土' | '金' | '水';
  yinYang: '阳' | '阴';
  hiddenStems: HiddenStem[];
}

// 柱（年柱/月柱/日柱/时柱）
export interface Pillar {
  stem: Stem;
  branch: Branch;
  naYin: string;      // 纳音
  xun: string;        // 旬
  kongWang: string;   // 空亡
  xingYun: string;    // 星运
  ziZuo: string;      // 自坐
}

// 大运周期
export interface DaYunCycle {
  ganZhi: string;
  startYear: number;
  endYear: number;
  startAge: number;
  endAge: number;
  stemShiShen: string;
  branchShiShen: string[];
  hiddenStems: string[];
}

// 大运
export interface DaYun {
  startAge: number;
  startDate: string;
  cycles: DaYunCycle[];
}

// 神煞
export interface ShenSha {
  year: string[];
  month: string[];
  day: string[];
  hour: string[];
}

// 刑冲合会
export interface Relation {
  type: string;
  target: string;
  knowledge: string;
  element?: string;
}

export interface PillarRelations {
  stem: Record<string, unknown>;
  branch: Record<string, Relation[]>;
}

export interface Relations {
  year: PillarRelations;
  month: PillarRelations;
  day: PillarRelations;
  hour: PillarRelations;
}

// 完整八字数据
export interface BaziData {
  gender: string;
  solarDatetime: string;
  lunarDatetime: string;
  bazi: string;         // 完整八字字符串
  zodiac: string;       // 生肖
  dayMaster: string;    // 日主

  pillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar;
  };

  fetal: {
    taiYuan: string;
    taiXi: string;
  };

  lifePalace: string;
  bodyPalace: string;
  shenSha: ShenSha;
  daYun: DaYun;
  relations: Relations;
}

// 排盘请求
export interface BaziRequest {
  inputType: 'solar' | 'lunar';
  solarDate?: string;
  solarTime?: string;
  lunarYear?: number;
  lunarMonth?: number;
  lunarDay?: number;
  lunarHour?: number;
  isLeapMonth?: boolean;
  gender: 'male' | 'female';
  timezone?: string;
  longitude?: number;
  latitude?: number;
  useTrueSolarTime?: boolean;
}

// 单维度分析结果
export interface DimensionAnalysis {
  score: number;
  level: 'excellent' | 'good' | 'average' | 'weak';
  analysis: string;
  keywords: string[];
  opportunities: string[];
  challenges: string[];
}

// 分析报告
export interface AnalysisReport {
  summary: string;
  dimensions: {
    career: DimensionAnalysis;
    wealth: DimensionAnalysis;
    fortune: DimensionAnalysis;
    personality: DimensionAnalysis;
    health: DimensionAnalysis;
  };
  advice: string[];
}

// 分析请求
export interface AnalyzeRequest {
  baziData: BaziData;
  dimensions: ('career' | 'wealth' | 'fortune' | 'personality' | 'health')[];
  year?: number;
}

// API 响应包装
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
