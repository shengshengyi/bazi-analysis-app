import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { BaziData, BaziRequest } from '../models/types.js';
import { processDateTime, genderToNumber } from '../algorithms/true-solar-time.js';

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

    // 解析 JSON 结果
    const rawData = JSON.parse(textContent);

    // 转换为标准格式
    return normalizeBaziData(rawData);
  } catch (error) {
    console.error('Error calling getBaziDetail:', error);
    throw new Error(`排盘失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
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
