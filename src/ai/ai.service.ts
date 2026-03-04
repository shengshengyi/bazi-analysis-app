import { generateText, streamText, type UIMessage } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import type { BaziData } from '../models/types.js';

// AI提供商类型
export type AIProvider = 'openai' | 'anthropic' | 'deepseek' | 'qwen' | 'qwen-coding' | 'custom';

// AI配置接口
export interface AIConfig {
  provider: AIProvider;
  apiKey?: string;
  baseUrl?: string;
  model: string;
  temperature: number;
  maxOutputTokens: number;
}

// 提供商配置定义
export interface ProviderConfig {
  id: AIProvider;
  name: string;
  description: string;
  defaultBaseUrl?: string;
  models: { id: string; name: string; description?: string }[];
  requireApiKey: boolean;
}

// 流派配置接口
export interface SchoolConfig {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  characteristics: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
}

// 对话请求接口
export interface AIChatRequest {
  baziData: BaziData;
  message: string;
  schoolId: string;
  conversationId?: string;
  history?: any[];
}

// 默认AI配置
export const defaultAIConfig: AIConfig = {
  provider: 'openai',
  model: 'gpt-4o-mini',
  temperature: 0.7,
  maxOutputTokens: 2000
};

// 提供商配置列表
export const providers: Record<AIProvider, ProviderConfig> = {
  openai: {
    id: 'openai',
    name: 'OpenAI',
    description: 'OpenAI官方API',
    defaultBaseUrl: 'https://api.openai.com/v1',
    requireApiKey: true,
    models: [
      { id: 'gpt-4o', name: 'GPT-4o', description: '最强大的多模态模型' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: '快速且经济实惠' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: '高性能模型' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: '性价比之选' }
    ]
  },
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic Claude',
    description: 'Claude系列模型',
    defaultBaseUrl: 'https://api.anthropic.com/v1',
    requireApiKey: true,
    models: [
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', description: '最智能的Claude模型' },
      { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', description: '快速响应' },
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', description: '复杂任务专家' }
    ]
  },
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    description: '深度求索大模型',
    defaultBaseUrl: 'https://api.deepseek.com/v1',
    requireApiKey: true,
    models: [
      { id: 'deepseek-chat', name: 'DeepSeek Chat', description: '通用对话模型' },
      { id: 'deepseek-coder', name: 'DeepSeek Coder', description: '代码专用模型' },
      { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner', description: '推理增强模型' }
    ]
  },
  qwen: {
    id: 'qwen',
    name: '通义千问',
    description: '阿里云通义千问大模型 - 千问百炼标准版',
    defaultBaseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    requireApiKey: true,
    models: [
      // 千问3系列
      { id: 'qwen3-max', name: 'Qwen3 Max', description: '千问3最强模型' },
      { id: 'qwen3.5-plus', name: 'Qwen3.5 Plus', description: '千问3.5增强版' },
      { id: 'qwen3-coder-next', name: 'Qwen3 Coder Next', description: '千问3编程下一代' },
      { id: 'qwen3-coder-plus', name: 'Qwen3 Coder Plus', description: '千问3编程增强版' },
      // 经典系列
      { id: 'qwen-max', name: 'Qwen Max', description: '通义千问最强模型' },
      { id: 'qwen-plus', name: 'Qwen Plus', description: '均衡性能与速度' },
      { id: 'qwen-turbo', name: 'Qwen Turbo', description: '快速响应' },
      { id: 'qwen-coder-plus', name: 'Qwen Coder Plus', description: '编程专用' },
      { id: 'qwen-coder-turbo', name: 'Qwen Coder Turbo', description: '快速编程助手' }
    ]
  },
  'qwen-coding': {
    id: 'qwen-coding',
    name: '通义千问 - Coding Plane',
    description: '阿里云千问百炼Coding Plane套餐（OpenAI兼容接口）',
    defaultBaseUrl: 'https://coding.dashscope.aliyuncs.com/v1',
    requireApiKey: true,
    models: [
      // 千问3系列（Coding Plane支持）
      { id: 'qwen3.5-plus', name: 'Qwen3.5-Plus', description: '文本生成、深度思考、视觉理解（推荐）' },
      { id: 'qwen3-max-2026-01-23', name: 'Qwen3-Max', description: '文本生成、深度思考' },
      { id: 'qwen3-coder-next', name: 'Qwen3-Coder-Next', description: '文本生成' },
      { id: 'qwen3-coder-plus', name: 'Qwen3-Coder-Plus', description: '文本生成' }
    ]
  },
  custom: {
    id: 'custom',
    name: '自定义',
    description: '自定义OpenAI兼容API',
    requireApiKey: true,
    models: [
      { id: 'custom-model', name: '自定义模型', description: '请输入模型名称' }
    ]
  }
};

// 五大流派配置
export const schools: Record<string, SchoolConfig> = {
  wangshuai: {
    id: 'wangshuai',
    name: '旺衰派',
    description: '以日主强弱为核心，通过扶抑调候来判断吉凶',
    difficulty: 2,
    characteristics: ['日主强弱', '扶抑用神', '五行平衡', '身旺身弱'],
    systemPrompt: `你是旺衰派八字命理大师。旺衰派以日主强弱为核心，讲究"扶抑"二字。

核心原则：
1. 先判断日主强弱：得令、得地、得势
2. 身旺宜克泄耗，身弱宜生扶
3. 用神选取以平衡五行为主
4. 注重调候：寒暖燥湿平衡

解盘风格：
- 先分析日主强弱，给出明确结论
- 指出喜用神和忌神
- 解释五行平衡状态
- 给出具体建议（颜色、方位、职业等）

术语习惯：身旺、身弱、得令、通根、扶抑、调候

请用通俗易懂的语言解释，适合初学者理解。`
  },

  ziping: {
    id: 'ziping',
    name: '子平派',
    description: '传统经典格局论，重视月令和十神配置',
    difficulty: 3,
    characteristics: ['月令定格', '十神生克', '格局成败', '贵贱贫富'],
    systemPrompt: `你是子平派八字命理大师。子平派是八字命理的正统，以《渊海子平》为经典。

核心原则：
1. 月令为提纲，定格取用神
2. 天干地支配合，看格局成败
3. 正格八格：官印财杀食伤禄刃
4. 注重格局清纯，忌混杂

解盘风格：
- 先看月令定格，确定格局类型
- 分析天干透出和地支藏干
- 判断格局成败：成格者贵，破格者贱
- 结合大运流年断吉凶

术语习惯：正官、七杀、正印、偏印、正财、偏财、食神、伤官、建禄、羊刃

请用传统术语，保持古典风格，适合有一定基础的学习者。`
  },

  blind: {
    id: 'blind',
    name: '盲派',
    description: '重视做功和效率，口诀多，实战性强',
    difficulty: 5,
    characteristics: ['做功效率', '宾主体用', '口诀象法', '实战为主'],
    systemPrompt: `你是盲派八字命理大师。盲派源于民间盲人算命，以实战为准，口诀众多。

核心原则：
1. 做功：八字中各要素之间的作用关系
2. 效率：做功是否有力，是否高效
3. 宾主：日干为主，其他为宾
4. 体用：日主和印比为体，财官食伤为用

解盘风格：
- 直接断事，不绕弯子
- 重视具体事件：婚姻、子女、财运、官运
- 用口诀快速定位
- 讲究"铁口直断"

术语习惯：做功、效率、宾主、体用、寻根基、看出处

请直接给出结论，少说理论，多说具体事情，适合专业人士交流。`
  },

  geju: {
    id: 'geju',
    name: '格局派',
    description: '专注格局成败，强调格局高低决定命运层次',
    difficulty: 4,
    characteristics: ['专研格局', '成格破格', '格局高低', '清浊纯杂'],
    systemPrompt: `你是格局派八字命理大师。格局派专注研究八字格局，以《子平真诠》为圭臬。

核心原则：
1. 格局为先：格局决定命运层次
2. 月令取格，定格用相
3. 成格者富或贵，破格者不贫则夭
4. 格局清纯为佳，混杂为病

解盘风格：
- 先定格局，再论成败
- 分析用神是否有力
- 看相神是否配合
- 判断格局层次：上中下三等

术语习惯：成格、破格、清格、浊格、正格、变格、从格

请深入分析格局成败原因，适合进阶学习者研究。`
  },

  xinpai: {
    id: 'xinpai',
    name: '新派',
    description: '现代创新理论，百神论、反断论等',
    difficulty: 3,
    characteristics: ['百神论', '反断论', '空亡论', '现代创新'],
    systemPrompt: `你是新派八字命理大师。新派是现代人创新的理论体系，有百神论、反断论等特色。

核心原则：
1. 百神论：一个十神可代表多个六亲
2. 反断论：有时喜忌与传统相反
3. 空亡论：空亡支的特殊处理
4. 量化思维：用神力量量化分析

解盘风格：
- 灵活运用各种新理论
- 重视空亡、墓库等特殊状态
- 反断时要说明原因
- 结合现代社会特点

术语习惯：百神、反断、空亡填实、实神虚神、月令受制

请用现代语言解释，结合现代社会情况，适合年轻用户。`
  }
};

// 获取默认流派
export function getDefaultSchool(): SchoolConfig {
  return schools.wangshuai;
}

// 获取所有流派列表
export function getAllSchools(): SchoolConfig[] {
  return Object.values(schools);
}

// 获取指定流派
export function getSchool(id: string): SchoolConfig | undefined {
  return schools[id];
}

// 获取所有提供商
export function getAllProviders(): ProviderConfig[] {
  return Object.values(providers);
}

// 获取指定提供商
export function getProvider(id: AIProvider): ProviderConfig | undefined {
  return providers[id];
}

// 构建系统提示词
export function buildSystemPrompt(school: SchoolConfig, baziData: BaziData): string {
  return `${school.systemPrompt}

当前八字信息：
- 八字：${baziData.bazi}
- 日主：${baziData.dayMaster}
- 性别：${baziData.gender}
- 生肖：${baziData.zodiac}

请基于${school.name}的理论体系进行分析和解答。`;
}

// AI服务类
export class AIService {
  private config: AIConfig;

  constructor(config: Partial<AIConfig> = {}) {
    this.config = { ...defaultAIConfig, ...config };
  }

  // 更新配置
  updateConfig(config: Partial<AIConfig>) {
    this.config = { ...this.config, ...config };
  }

  // 获取当前配置
  getConfig(): AIConfig {
    return { ...this.config };
  }

  // 生成AI回复（非流式）
  async chat(request: AIChatRequest): Promise<string> {
    const school = getSchool(request.schoolId) || getDefaultSchool();
    const systemPrompt = buildSystemPrompt(school, request.baziData);

    // 调试日志 - 在获取model之前
    console.log('[AI Service] Current config:', {
      provider: this.config.provider,
      model: this.config.model,
      baseUrl: this.config.baseUrl,
      hasApiKey: !!this.config.apiKey
    });

    const model = this.getModel();

    // 调试日志 - 获取model之后
    console.log('[AI Service] Model instance created');

    try {
      const { text } = await generateText({
        model,
        system: systemPrompt,
        messages: [
          ...(request.history || []),
          { role: 'user', content: request.message }
        ],
        temperature: this.config.temperature,
        maxOutputTokens: this.config.maxOutputTokens
      });

      return text;
    } catch (error: any) {
      console.error('[AI Service] Error details:', error);
      // 提供更详细的错误信息
      if (error.message?.includes('Not Found')) {
        throw new Error(`模型 "${this.config.model}" 未找到。请检查：1) 模型名称是否正确；2) 您的API套餐是否支持该模型；3) Base URL是否正确配置。当前配置: provider=${this.config.provider}, baseUrl=${this.config.baseUrl}。错误详情: ${error.message}`);
      }
      throw error;
    }
  }

  // 生成AI回复（流式）
  async *chatStream(request: AIChatRequest): AsyncGenerator<string> {
    const school = getSchool(request.schoolId) || getDefaultSchool();
    const systemPrompt = buildSystemPrompt(school, request.baziData);

    const model = this.getModel();

    const { textStream } = streamText({
      model,
      system: systemPrompt,
      messages: [
        ...(request.history || []),
        { role: 'user', content: request.message }
      ],
      temperature: this.config.temperature,
      maxOutputTokens: this.config.maxOutputTokens
    });

    for await (const chunk of textStream) {
      yield chunk;
    }
  }

  // 获取模型实例
  private getModel() {
    switch (this.config.provider) {
      case 'openai': {
        const openai = createOpenAI({
          apiKey: this.config.apiKey,
          baseURL: this.config.baseUrl
        });
        return openai(this.config.model);
      }
      case 'anthropic': {
        const anthropic = createAnthropic({
          apiKey: this.config.apiKey,
          baseURL: this.config.baseUrl
        });
        return anthropic(this.config.model);
      }
      case 'deepseek': {
        // DeepSeek兼容OpenAI接口
        const openai = createOpenAI({
          apiKey: this.config.apiKey,
          baseURL: this.config.baseUrl || 'https://api.deepseek.com/v1'
        });
        return openai(this.config.model);
      }
      case 'qwen': {
        // 千问百炼兼容OpenAI接口
        const openai = createOpenAI({
          apiKey: this.config.apiKey,
          baseURL: this.config.baseUrl || 'https://dashscope.aliyuncs.com/compatible-mode/v1'
        });
        return openai(this.config.model);
      }
      case 'qwen-coding': {
        // 千问百炼Coding Plane套餐 - 使用OpenAI标准适配器的chat方法
        // 显式使用 .chat() 方法确保使用 Chat Completions API，而不是 Responses API
        const openai = createOpenAI({
          apiKey: this.config.apiKey,
          baseURL: this.config.baseUrl || 'https://coding.dashscope.aliyuncs.com/v1'
        });
        return openai.chat(this.config.model);
      }
      case 'custom': {
        const openai = createOpenAI({
          apiKey: this.config.apiKey,
          baseURL: this.config.baseUrl
        });
        return openai(this.config.model);
      }
      default: {
        const openai = createOpenAI({
          apiKey: this.config.apiKey,
          baseURL: this.config.baseUrl
        });
        return openai(this.config.model);
      }
    }
  }
}

// 单例模式导出
let aiService: AIService | null = null;

export function getAIService(): AIService {
  if (!aiService) {
    aiService = new AIService();
  }
  return aiService;
}

export function initAIService(config: AIConfig): AIService {
  aiService = new AIService(config);
  return aiService;
}
