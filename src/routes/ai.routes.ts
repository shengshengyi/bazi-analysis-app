import { Router } from 'express';
import { AIService, getAIService, initAIService, getAllSchools, getSchool, getAllProviders, type AIConfig } from '../ai/ai.service.js';
import type { ApiResponse } from '../models/types.js';

const router = Router();

/**
 * GET /api/ai/providers
 * 获取所有AI提供商列表
 */
router.get('/providers', (req, res) => {
  try {
    const providers = getAllProviders().map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      requireApiKey: p.requireApiKey,
      models: p.models
    }));

    res.json({
      success: true,
      data: providers
    } as ApiResponse<any>);
  } catch (error) {
    console.error('获取提供商列表错误:', error);
    res.status(500).json({
      success: false,
      error: '获取提供商列表失败'
    } as ApiResponse<never>);
  }
});

/**
 * POST /api/ai/chat
 * AI对话接口（非流式）
 */
router.post('/chat', async (req, res) => {
  try {
    const { baziData, message, schoolId, history } = req.body;

    if (!baziData || !message) {
      return res.status(400).json({
        success: false,
        error: '缺少必要参数: baziData, message'
      } as ApiResponse<never>);
    }

    const aiService = getAIService();
    const response = await aiService.chat({
      baziData,
      message,
      schoolId: schoolId || 'wangshuai',
      history: history || []
    });

    res.json({
      success: true,
      data: {
        message: response,
        schoolId: schoolId || 'wangshuai',
        timestamp: new Date().toISOString()
      }
    } as ApiResponse<any>);
  } catch (error) {
    console.error('AI对话错误:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'AI对话失败'
    } as ApiResponse<never>);
  }
});

/**
 * POST /api/ai/chat/stream
 * AI对话接口（流式）
 */
router.post('/chat/stream', async (req, res) => {
  try {
    const { baziData, message, schoolId, history } = req.body;

    if (!baziData || !message) {
      return res.status(400).json({
        success: false,
        error: '缺少必要参数: baziData, message'
      } as ApiResponse<never>);
    }

    // 设置SSE响应头
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const aiService = getAIService();
    const stream = aiService.chatStream({
      baziData,
      message,
      schoolId: schoolId || 'wangshuai',
      history: history || []
    });

    for await (const chunk of stream) {
      res.write(`data: ${JSON.stringify({ chunk }) }\n\n`);
    }

    res.write(`data: ${JSON.stringify({ done: true }) }\n\n`);
    res.end();
  } catch (error) {
    console.error('AI流式对话错误:', error);
    res.write(`data: ${JSON.stringify({ error: error instanceof Error ? error.message : 'AI对话失败' }) }\n\n`);
    res.end();
  }
});

/**
 * GET /api/ai/config
 * 获取当前AI配置
 */
router.get('/config', (req, res) => {
  try {
    const aiService = getAIService();
    const config = aiService.getConfig();

    // 不返回API Key
    const safeConfig = {
      provider: config.provider,
      model: config.model,
      temperature: config.temperature,
      maxOutputTokens: config.maxOutputTokens,
      hasApiKey: !!config.apiKey
    };

    res.json({
      success: true,
      data: safeConfig
    } as ApiResponse<any>);
  } catch (error) {
    console.error('获取AI配置错误:', error);
    res.status(500).json({
      success: false,
      error: '获取配置失败'
    } as ApiResponse<never>);
  }
});

/**
 * POST /api/ai/config
 * 更新AI配置
 */
router.post('/config', (req, res) => {
  try {
    const { provider, apiKey, baseUrl, model, temperature, maxOutputTokens } = req.body;

    const config: Partial<AIConfig> = {};
    if (provider) config.provider = provider;
    if (apiKey) config.apiKey = apiKey;
    if (baseUrl) config.baseUrl = baseUrl;
    if (model) config.model = model;
    if (temperature !== undefined) config.temperature = temperature;
    if (maxOutputTokens) config.maxOutputTokens = maxOutputTokens;

    // 如果有API Key则重新初始化，否则更新现有配置
    if (apiKey) {
      initAIService({
        provider: config.provider || 'openai',
        apiKey,
        baseUrl: config.baseUrl,
        model: config.model || 'gpt-4o-mini',
        temperature: config.temperature ?? 0.7,
        maxOutputTokens: config.maxOutputTokens || 2000
      });
    } else {
      const aiService = getAIService();
      aiService.updateConfig(config);
    }

    res.json({
      success: true,
      data: { message: '配置已更新' }
    } as ApiResponse<any>);
  } catch (error) {
    console.error('更新AI配置错误:', error);
    res.status(500).json({
      success: false,
      error: '更新配置失败'
    } as ApiResponse<never>);
  }
});

/**
 * GET /api/schools
 * 获取所有流派列表
 */
router.get('/schools', (req, res) => {
  try {
    const schools = getAllSchools().map(s => ({
      id: s.id,
      name: s.name,
      description: s.description,
      difficulty: s.difficulty,
      characteristics: s.characteristics
    }));

    res.json({
      success: true,
      data: schools
    } as ApiResponse<any>);
  } catch (error) {
    console.error('获取流派列表错误:', error);
    res.status(500).json({
      success: false,
      error: '获取流派列表失败'
    } as ApiResponse<never>);
  }
});

/**
 * GET /api/schools/:id
 * 获取指定流派详情
 */
router.get('/schools/:id', (req, res) => {
  try {
    const { id } = req.params;
    const school = getSchool(id);

    if (!school) {
      return res.status(404).json({
        success: false,
        error: '流派不存在'
      } as ApiResponse<never>);
    }

    res.json({
      success: true,
      data: {
        id: school.id,
        name: school.name,
        description: school.description,
        difficulty: school.difficulty,
        characteristics: school.characteristics
      }
    } as ApiResponse<any>);
  } catch (error) {
    console.error('获取流派详情错误:', error);
    res.status(500).json({
      success: false,
      error: '获取流派详情失败'
    } as ApiResponse<never>);
  }
});

export default router;
