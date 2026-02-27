import { Router } from 'express';
import { getBaziDetail } from '../services/bazi.service.js';
import { analyzeBazi, quickAnalyze } from '../services/analysis.service.js';
import type { BaziRequest, AnalyzeRequest, ApiResponse } from '../models/types.js';

const router = Router();

/**
 * POST /api/analyze
 * 详细分析接口
 */
router.post('/', async (req, res) => {
  try {
    const request: AnalyzeRequest = req.body;

    // 验证必填参数
    if (!request.baziData) {
      return res.status(400).json({
        success: false,
        error: '缺少 baziData 参数'
      } as ApiResponse<never>);
    }

    if (!request.dimensions || request.dimensions.length === 0) {
      return res.status(400).json({
        success: false,
        error: '请指定至少一个分析维度'
      } as ApiResponse<never>);
    }

    // 设置默认年份
    request.year = request.year || new Date().getFullYear();

    // 调用分析服务
    const report = analyzeBazi(request);

    const response: ApiResponse<typeof report> = {
      success: true,
      data: report
    };

    res.json(response);
  } catch (error) {
    console.error('分析错误:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '分析失败'
    } as ApiResponse<never>);
  }
});

/**
 * POST /api/analyze/quick
 * 快速分析接口（排盘+分析）
 */
router.post('/quick', async (req, res) => {
  try {
    const baziRequest: BaziRequest = req.body;

    // 验证必填参数
    if (!baziRequest.inputType || !baziRequest.gender) {
      return res.status(400).json({
        success: false,
        error: '缺少必填参数: inputType, gender'
      } as ApiResponse<never>);
    }

    // 先排盘
    const baziData = await getBaziDetail(baziRequest);

    // 再分析
    const year = new Date().getFullYear();
    const report = quickAnalyze(baziData, year);

    const response: ApiResponse<{ bazi: typeof baziData; report: typeof report }> = {
      success: true,
      data: {
        bazi: baziData,
        report
      }
    };

    res.json(response);
  } catch (error) {
    console.error('快速分析错误:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '分析失败'
    } as ApiResponse<never>);
  }
});

export default router;
