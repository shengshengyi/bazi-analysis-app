/**
 * 八字解析器（后端版本）
 * 支持多种格式的八字字符串解析
 */

export interface GanZhi {
  gan: string;
  zhi: string;
  ganIndex: number;
  zhiIndex: number;
}

export interface BaziParseResult {
  year: GanZhi;
  month: GanZhi;
  day: GanZhi;
  hour: GanZhi;
}

export interface ParseResponse {
  success: boolean;
  data?: BaziParseResult;
  error?: string;
}

export class BaziParser {
  // 天干
  private readonly tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  // 地支
  private readonly diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  // 六十甲子
  private readonly jiaZi60: string[];

  constructor() {
    this.jiaZi60 = this.generateJiaZi60();
  }

  /**
   * 生成六十甲子表
   */
  private generateJiaZi60(): string[] {
    const jiaZi: string[] = [];
    for (let i = 0; i < 60; i++) {
      const gan = this.tianGan[i % 10];
      const zhi = this.diZhi[i % 12];
      jiaZi.push(gan + zhi);
    }
    return jiaZi;
  }

  /**
   * 解析八字字符串
   * 支持格式：
   * - "甲子年丙寅月戊辰日庚午时"
   * - "甲子 丙寅 戊辰 庚午"
   * - "甲子,丙寅,戊辰,庚午"
   */
  parse(input: string): ParseResponse {
    if (!input || typeof input !== 'string') {
      return { success: false, error: '输入不能为空' };
    }

    // 清理输入
    const cleaned = input.trim().replace(/\s+/g, ' ');

    // 尝试不同格式解析
    let result = this.parseWithSuffix(cleaned);
    if (!result.success) {
      result = this.parseWithSpace(cleaned);
    }
    if (!result.success) {
      result = this.parseWithComma(cleaned);
    }
    if (!result.success) {
      result = this.parseContinuous(cleaned);
    }

    return result;
  }

  /**
   * 解析带后缀格式：甲子年丙寅月戊辰日庚午时
   */
  private parseWithSuffix(input: string): ParseResponse {
    const pattern = /([甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])年([甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])月([甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])日([甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])时/;
    const match = input.match(pattern);

    if (match) {
      return this.validateAndReturn({
        year: this.parseGanZhi(match[1]),
        month: this.parseGanZhi(match[2]),
        day: this.parseGanZhi(match[3]),
        hour: this.parseGanZhi(match[4])
      });
    }

    return { success: false, error: '无法解析带后缀格式' };
  }

  /**
   * 解析空格分隔格式：甲子 丙寅 戊辰 庚午
   */
  private parseWithSpace(input: string): ParseResponse {
    const parts = input.split(/\s+/);
    if (parts.length === 4) {
      return this.validateAndReturn({
        year: this.parseGanZhi(parts[0]),
        month: this.parseGanZhi(parts[1]),
        day: this.parseGanZhi(parts[2]),
        hour: this.parseGanZhi(parts[3])
      });
    }
    return { success: false, error: '无法解析空格分隔格式' };
  }

  /**
   * 解析逗号分隔格式：甲子,丙寅,戊辰,庚午
   */
  private parseWithComma(input: string): ParseResponse {
    const parts = input.split(',');
    if (parts.length === 4) {
      return this.validateAndReturn({
        year: this.parseGanZhi(parts[0]),
        month: this.parseGanZhi(parts[1]),
        day: this.parseGanZhi(parts[2]),
        hour: this.parseGanZhi(parts[3])
      });
    }
    return { success: false, error: '无法解析逗号分隔格式' };
  }

  /**
   * 解析连续字符格式：甲子丙寅戊辰庚午
   */
  private parseContinuous(input: string): ParseResponse {
    // 移除所有非干支字符
    const cleaned = input.replace(/[^甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥]/g, '');

    if (cleaned.length === 8) {
      return this.validateAndReturn({
        year: this.parseGanZhi(cleaned.substring(0, 2)),
        month: this.parseGanZhi(cleaned.substring(2, 4)),
        day: this.parseGanZhi(cleaned.substring(4, 6)),
        hour: this.parseGanZhi(cleaned.substring(6, 8))
      });
    }
    return { success: false, error: '无法解析连续字符格式' };
  }

  /**
   * 解析单个干支
   */
  private parseGanZhi(ganZhi: string): GanZhi | null {
    if (!ganZhi || ganZhi.length !== 2) {
      return null;
    }

    const gan = ganZhi[0];
    const zhi = ganZhi[1];

    const ganIndex = this.tianGan.indexOf(gan);
    const zhiIndex = this.diZhi.indexOf(zhi);

    if (ganIndex === -1 || zhiIndex === -1) {
      return null;
    }

    return { gan, zhi, ganIndex, zhiIndex };
  }

  /**
   * 验证并返回结果
   */
  private validateAndReturn(result: BaziParseResult): ParseResponse {
    // 验证所有柱都有值
    if (!result.year || !result.month || !result.day || !result.hour) {
      return { success: false, error: '八字解析不完整' };
    }

    // 验证干支组合合法性
    const validation = this.validateBazi(result);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    return {
      success: true,
      data: result
    };
  }

  /**
   * 验证八字合法性
   */
  private validateBazi(bazi: BaziParseResult): { valid: boolean; error?: string } {
    // 基本验证：检查天干地支是否存在
    for (const [key, value] of Object.entries(bazi)) {
      if (!value || !value.gan || !value.zhi) {
        return { valid: false, error: `${key}柱格式错误` };
      }
    }

    return { valid: true };
  }

  /**
   * 反推阳历日期（简化版）
   */
  estimateSolarDate(bazi: BaziParseResult): { year: number; month: number; day: number; note: string } | null {
    // 根据年柱估算年份
    const yearGanZhi = bazi.year.gan + bazi.year.zhi;
    const yearIndex = this.jiaZi60.indexOf(yearGanZhi);

    if (yearIndex === -1) {
      return null;
    }

    // 计算最近的年份（以1984甲子年为基准）
    const baseYear = 1984;
    const cycle = 60;
    let estimatedYear = baseYear + ((yearIndex - (baseYear % cycle)) + cycle) % cycle;

    // 如果估算年份太早，加60年
    if (estimatedYear < 1900) {
      estimatedYear += 60;
    }

    return {
      year: estimatedYear,
      month: 6,
      day: 15,
      note: '此为估算日期，仅供参考'
    };
  }

  /**
   * 格式化八字为字符串
   */
  format(bazi: BaziParseResult, style: 'full' | 'space' | 'comma' | 'compact' = 'full'): string {
    const year = bazi.year.gan + bazi.year.zhi;
    const month = bazi.month.gan + bazi.month.zhi;
    const day = bazi.day.gan + bazi.day.zhi;
    const hour = bazi.hour.gan + bazi.hour.zhi;

    switch (style) {
      case 'full':
        return `${year}年 ${month}月 ${day}日 ${hour}时`;
      case 'space':
        return `${year} ${month} ${day} ${hour}`;
      case 'comma':
        return `${year},${month},${day},${hour}`;
      case 'compact':
        return `${year}${month}${day}${hour}`;
      default:
        return `${year}年 ${month}月 ${day}日 ${hour}时`;
    }
  }
}

// 导出单例实例
export const baziParser = new BaziParser();
