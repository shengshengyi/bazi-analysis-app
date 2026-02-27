import { Router } from 'express';
import { getBaziDetail } from '../services/bazi.service.js';
import type { BaziRequest, ApiResponse } from '../models/types.js';

const router = Router();

/**
 * POST /api/bazi/calculate
 * 八字排盘接口
 */
router.post('/calculate', async (req, res) => {
  try {
    const request: BaziRequest = req.body;

    // 验证必填参数
    if (!request.inputType || !request.gender) {
      return res.status(400).json({
        success: false,
        error: '缺少必填参数: inputType, gender'
      } as ApiResponse<never>);
    }

    // 验证日期参数
    if (request.inputType === 'solar' && (!request.solarDate || !request.solarTime)) {
      return res.status(400).json({
        success: false,
        error: '公历输入需要提供 solarDate 和 solarTime'
      } as ApiResponse<never>);
    }

    if (request.inputType === 'lunar' &&
        (request.lunarYear === undefined || request.lunarMonth === undefined || request.lunarDay === undefined)) {
      return res.status(400).json({
        success: false,
        error: '农历输入需要提供 lunarYear, lunarMonth, lunarDay'
      } as ApiResponse<never>);
    }

    // 设置默认值
    request.timezone = request.timezone || 'Asia/Shanghai';

    // 调用排盘服务
    const baziData = await getBaziDetail(request);

    const response: ApiResponse<typeof baziData> = {
      success: true,
      data: baziData
    };

    res.json(response);
  } catch (error) {
    console.error('排盘错误:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '排盘失败'
    } as ApiResponse<never>);
  }
});

export default router;
