import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { BaziData, BaziRequest } from '../models/types.js';
import { processDateTime, genderToNumber } from '../algorithms/true-solar-time.js';
import { baziParser } from '../algorithms/bazi-parser.js';

// MCP 客户端实例
let mcpClient: Client | null = null;

/**
 * 初始化 MCP 客户端
 */
export async function initMcpClient(): Promise<Client> {
  if (mcpClient) {
    return mcpClient;
  }

  const transport = new StdioClientTransport({
    command: 'npx',
    args: ['bazi-mcp'],
    env: Object.fromEntries(
      Object.entries(process.env).filter(([, v]) => v !== undefined)
    ) as Record<string, string>
  });

  mcpClient = new Client({
    name: 'bazi-app',
    version: '1.0.0'
  }, {
    capabilities: {}
  });

  await mcpClient.connect(transport);
  console.log('MCP Client connected to bazi-mcp');

  return mcpClient;
}

/**
 * 调用 bazi-mcp 获取八字详情
 */
export async function getBaziDetail(request: BaziRequest): Promise<BaziData> {
  // 处理八字直接输入
  if (request.inputType === 'bazi' && request.baziString) {
    return getBaziFromString(request.baziString, request.gender);
  }

  const client = await initMcpClient();

  const { solarDatetime, lunarDatetime } = processDateTime(request);
  const gender = genderToNumber(request.gender);

  const params: Record<string, unknown> = {
    gender,
    eightCharProviderSect: 2  // 默认使用 23:00-23:59 为当天的配置
  };

  if (solarDatetime) {
    params.solarDatetime = solarDatetime;
  } else if (lunarDatetime) {
    params.lunarDatetime = lunarDatetime;
  }

  try {
    const result = await client.callTool({
      name: 'getBaziDetail',
      arguments: params
    });

    // 解析 MCP 返回结果
    const content = result.content as Array<{ type: string; text: string }>;
    const textContent = content.find(c => c.type === 'text')?.text || '';

    // 调试：打印原始响应
    console.log('MCP raw response:', textContent.substring(0, 200));

    // 检查响应是否有效
    if (!textContent || textContent.trim().length === 0) {
      throw new Error('MCP返回空数据');
    }

    // 尝试清理响应内容（去除可能的BOM标记或非JSON前缀）
    let cleanContent = textContent.trim();
    // 如果内容不以 { 或 [ 开头，尝试找到JSON开始位置
    if (!cleanContent.startsWith('{') && !cleanContent.startsWith('[')) {
      const jsonStart = cleanContent.indexOf('{');
      if (jsonStart !== -1) {
        cleanContent = cleanContent.substring(jsonStart);
      }
    }

    // 解析 JSON 结果
    let rawData;
    try {
      rawData = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('JSON parse error, content:', cleanContent.substring(0, 100));
      throw new Error(`JSON解析失败: ${parseError instanceof Error ? parseError.message : '未知错误'}`);
    }

    // 转换为标准格式
    return normalizeBaziData(rawData);
  } catch (error) {
    console.error('Error calling getBaziDetail:', error);
    throw new Error(`排盘失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

/**
 * 从八字字符串获取八字详情（简化版）
 * 注意：八字直接输入无法获取完整的神煞、大运等信息
 */
async function getBaziFromString(baziString: string, gender: 'male' | 'female'): Promise<BaziData> {
  const parseResult = baziParser.parse(baziString);
  
  if (!parseResult.success || !parseResult.data) {
    throw new Error(parseResult.error || '八字格式错误');
  }

  const bazi = parseResult.data;
  
  // 构建基本的八字数据
  // 注意：由于没有具体的阳历/农历日期，部分信息无法计算
  const yearGanZhi = bazi.year.gan + bazi.year.zhi;
  const monthGanZhi = bazi.month.gan + bazi.month.zhi;
  const dayGanZhi = bazi.day.gan + bazi.day.zhi;
  const hourGanZhi = bazi.hour.gan + bazi.hour.zhi;
  
  const estimatedDate = baziParser.estimateSolarDate(bazi);
  
  return {
    gender: gender === 'male' ? '男' : '女',
    solarDatetime: estimatedDate ? `${estimatedDate.year}-${estimatedDate.month}-${estimatedDate.day} 12:00:00` : '',
    lunarDatetime: '',
    bazi: `${yearGanZhi} ${monthGanZhi} ${dayGanZhi} ${hourGanZhi}`,
    zodiac: getZodiacFromBranch(bazi.year.zhi),
    dayMaster: bazi.day.gan,
    
    pillars: {
      year: {
        stem: { name: bazi.year.gan, element: getElementFromStem(bazi.year.gan), yinYang: getYinYangFromStem(bazi.year.gan) },
        branch: { name: bazi.year.zhi, element: getElementFromBranch(bazi.year.zhi), yinYang: getYinYangFromBranch(bazi.year.zhi), hiddenStems: [] },
        naYin: '', xun: '', kongWang: '', xingYun: '', ziZuo: ''
      },
      month: {
        stem: { name: bazi.month.gan, element: getElementFromStem(bazi.month.gan), yinYang: getYinYangFromStem(bazi.month.gan) },
        branch: { name: bazi.month.zhi, element: getElementFromBranch(bazi.month.zhi), yinYang: getYinYangFromBranch(bazi.month.zhi), hiddenStems: [] },
        naYin: '', xun: '', kongWang: '', xingYun: '', ziZuo: ''
      },
      day: {
        stem: { name: bazi.day.gan, element: getElementFromStem(bazi.day.gan), yinYang: getYinYangFromStem(bazi.day.gan) },
        branch: { name: bazi.day.zhi, element: getElementFromBranch(bazi.day.zhi), yinYang: getYinYangFromBranch(bazi.day.zhi), hiddenStems: [] },
        naYin: '', xun: '', kongWang: '', xingYun: '', ziZuo: ''
      },
      hour: {
        stem: { name: bazi.hour.gan, element: getElementFromStem(bazi.hour.gan), yinYang: getYinYangFromStem(bazi.hour.gan) },
        branch: { name: bazi.hour.zhi, element: getElementFromBranch(bazi.hour.zhi), yinYang: getYinYangFromBranch(bazi.hour.zhi), hiddenStems: [] },
        naYin: '', xun: '', kongWang: '', xingYun: '', ziZuo: ''
      }
    },
    
    fetal: { taiYuan: '', taiXi: '' },
    lifePalace: '',
    bodyPalace: '',
    shenSha: { year: [], month: [], day: [], hour: [] },
    daYun: { startAge: 0, startDate: '', cycles: [] },
    relations: { year: { stem: {}, branch: {} }, month: { stem: {}, branch: {} }, day: { stem: {}, branch: {} }, hour: { stem: {}, branch: {} } }
  };
}

// 辅助函数
function getZodiacFromBranch(branch: string): string {
  const zodiacMap: Record<string, string> = {
    '子': '鼠', '丑': '牛', '寅': '虎', '卯': '兔',
    '辰': '龙', '巳': '蛇', '午': '马', '未': '羊',
    '申': '猴', '酉': '鸡', '戌': '狗', '亥': '猪'
  };
  return zodiacMap[branch] || '';
}

function getElementFromStem(stem: string): '木' | '火' | '土' | '金' | '水' {
  const elementMap: Record<string, '木' | '火' | '土' | '金' | '水'> = {
    '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
    '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水'
  };
  return elementMap[stem] || '木';
}

function getElementFromBranch(branch: string): '木' | '火' | '土' | '金' | '水' {
  const elementMap: Record<string, '木' | '火' | '土' | '金' | '水'> = {
    '寅': '木', '卯': '木', '巳': '火', '午': '火', '辰': '土', '戌': '土',
    '丑': '土', '未': '土', '申': '金', '酉': '金', '亥': '水', '子': '水'
  };
  return elementMap[branch] || '木';
}

function getYinYangFromStem(stem: string): '阳' | '阴' {
  const yinYangMap: Record<string, '阳' | '阴'> = {
    '甲': '阳', '乙': '阴', '丙': '阳', '丁': '阴', '戊': '阳',
    '己': '阴', '庚': '阳', '辛': '阴', '壬': '阳', '癸': '阴'
  };
  return yinYangMap[stem] || '阳';
}

function getYinYangFromBranch(branch: string): '阳' | '阴' {
  const yinYangMap: Record<string, '阳' | '阴'> = {
    '子': '阳', '丑': '阴', '寅': '阳', '卯': '阴', '辰': '阳', '巳': '阴',
    '午': '阳', '未': '阴', '申': '阳', '酉': '阴', '戌': '阳', '亥': '阴'
  };
  return yinYangMap[branch] || '阳';
}

/**
 * 将 bazi-mcp 返回的数据转换为标准 BaziData 格式
 */
function normalizeBaziData(raw: Record<string, unknown>): BaziData {
  return {
    gender: String(raw['性别'] || '未知'),
    solarDatetime: String(raw['阳历'] || ''),
    lunarDatetime: String(raw['农历'] || ''),
    bazi: String(raw['八字'] || ''),
    zodiac: String(raw['生肖'] || ''),
    dayMaster: String(raw['日主'] || ''),

    pillars: {
      year: normalizePillar(raw['年柱'] as Record<string, unknown>),
      month: normalizePillar(raw['月柱'] as Record<string, unknown>),
      day: normalizePillar(raw['日柱'] as Record<string, unknown>),
      hour: normalizePillar(raw['时柱'] as Record<string, unknown>)
    },

    fetal: {
      taiYuan: String(raw['胎元'] || ''),
      taiXi: String(raw['胎息'] || '')
    },

    lifePalace: String(raw['命宫'] || ''),
    bodyPalace: String(raw['身宫'] || ''),

    shenSha: normalizeShenSha(raw['神煞'] as Record<string, string[]>),
    daYun: normalizeDaYun(raw['大运'] as Record<string, unknown>),
    relations: normalizeRelations(raw['刑冲合会'] as Record<string, unknown>)
  };
}

function normalizePillar(raw: Record<string, unknown>): any {
  if (!raw) return {};

  const stem = raw['天干'] as Record<string, unknown>;
  const branch = raw['地支'] as Record<string, unknown>;
  const hiddenGan = branch?.['藏干'] as Record<string, unknown>;

  return {
    stem: {
      name: String(stem?.['天干'] || ''),
      element: String(stem?.['五行'] || ''),
      yinYang: String(stem?.['阴阳'] || ''),
      shiShen: String(stem?.['十神'] || '')
    },
    branch: {
      name: String(branch?.['地支'] || ''),
      element: String(branch?.['五行'] || ''),
      yinYang: String(branch?.['阴阳'] || ''),
      hiddenStems: normalizeHiddenStems(hiddenGan)
    },
    naYin: String(raw['纳音'] || ''),
    xun: String(raw['旬'] || ''),
    kongWang: String(raw['空亡'] || ''),
    xingYun: String(raw['星运'] || ''),
    ziZuo: String(raw['自坐'] || '')
  };
}

function normalizeHiddenStems(hiddenGan: Record<string, unknown>): any[] {
  if (!hiddenGan) return [];

  const stems: any[] = [];
  const types = ['主气', '中气', '余气'];

  for (const type of types) {
    const gan = hiddenGan[type] as Record<string, unknown>;
    if (gan) {
      stems.push({
        name: String(gan['天干'] || ''),
        shiShen: String(gan['十神'] || ''),
        type
      });
    }
  }

  return stems;
}

function normalizeShenSha(raw: Record<string, string[]>): any {
  return {
    year: raw?.['年柱'] || [],
    month: raw?.['月柱'] || [],
    day: raw?.['日柱'] || [],
    hour: raw?.['时柱'] || []
  };
}

function normalizeDaYun(raw: Record<string, unknown>): any {
  if (!raw) return { startAge: 0, startDate: '', cycles: [] };

  const cycles = (raw['大运'] as any[] || []).map(cycle => ({
    ganZhi: String(cycle['干支'] || ''),
    startYear: Number(cycle['开始年份'] || 0),
    endYear: Number(cycle['结束'] || 0),
    startAge: Number(cycle['开始年龄'] || 0),
    endAge: Number(cycle['结束年龄'] || 0),
    stemShiShen: String(cycle['天干十神'] || ''),
    branchShiShen: (cycle['地支十神'] as string[]) || [],
    hiddenStems: (cycle['地支藏干'] as string[]) || []
  }));

  return {
    startAge: Number(raw['起运年龄'] || 0),
    startDate: String(raw['起运日期'] || ''),
    cycles
  };
}

function normalizeRelations(raw: Record<string, unknown>): any {
  const pillars = ['年', '月', '日', '时'];
  const result: Record<string, unknown> = {};

  for (const pillar of pillars) {
    const p = raw?.[pillar] as Record<string, unknown>;
    result[pillar] = {
      stem: p?.['天干'] || {},
      branch: normalizeBranchRelations(p?.['地支'] as Record<string, unknown>)
    };
  }

  return result;
}

function normalizeBranchRelations(raw: Record<string, unknown>): Record<string, any[]> {
  if (!raw) return {};

  const result: Record<string, any[]> = {};
  const relationTypes = ['半合', '三合', '六合', '冲', '刑', '害', '会'];

  for (const type of relationTypes) {
    if (raw[type]) {
      result[type] = (raw[type] as any[]).map(r => ({
        target: String(r['柱'] || ''),
        knowledge: String(r['知识点'] || ''),
        element: String(r['元素'] || '')
      }));
    }
  }

  return result;
}
