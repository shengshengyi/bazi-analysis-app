import { BaziRequest } from '../models/types.js';

/**
 * 计算真太阳时
 * @param standardTime 标准时间
 * @param longitude 经度
 * @param timezoneOffset 时区偏移（小时）
 * @returns 真太阳时
 */
export function calculateTrueSolarTime(
  standardTime: Date,
  longitude: number,
  timezoneOffset: number = 8
): Date {
  // 1. 计算经度时差（每度4分钟）
  // 时区中央经线 = 时区偏移 * 15
  const centralMeridian = timezoneOffset * 15;
  const longitudeDiff = longitude - centralMeridian;
  const longitudeTimeDiff = longitudeDiff * 4; // 分钟

  // 2. 计算均时差（Equation of Time）
  const dayOfYear = getDayOfYear(standardTime);
  const eotMinutes = calculateEOT(dayOfYear);

  // 3. 应用校正
  const totalDiffMinutes = longitudeTimeDiff + eotMinutes;

  return new Date(standardTime.getTime() + totalDiffMinutes * 60 * 1000);
}

/**
 * 获取一年中的第几天
 */
function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * 计算均时差（简化公式）
 * 基于地球轨道偏心率的影响
 */
function calculateEOT(dayOfYear: number): number {
  // 使用简化公式
  const B = (2 * Math.PI * (dayOfYear - 81)) / 365;
  return 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
}

/**
 * 将公历日期时间转换为 ISO 格式字符串
 */
export function toISODateTime(date: string, time: string, timezone: string = '+08:00'): string {
  return `${date}T${time}:00${timezone}`;
}

/**
 * 解析农历时间（简化处理，实际需要农历库）
 * 这里使用 bazi-mcp 的 lunarDatetime 格式
 */
export function parseLunarDate(
  year: number,
  month: number,
  day: number,
  hour: number,
  isLeap: boolean = false,
  minute: string = '00:00'
): string {
  // 格式: YYYY-MM-DD HH:mm:ss
  const hourStr = hour.toString().padStart(2, '0');
  const minuteStr = minute || '00:00';
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hourStr}:${minuteStr}:00`;
}

/**
 * 根据经度建议时区
 */
export function suggestTimezone(longitude: number): number {
  // 每15度一个时区
  return Math.round(longitude / 15);
}

/**
 * 处理排盘请求的时间转换
 */
export function processDateTime(request: BaziRequest): {
  solarDatetime?: string;
  lunarDatetime?: string;
} {
  if (request.inputType === 'solar') {
    let dateTime = toISODateTime(request.solarDate!, request.solarTime!);

    // 如果需要真太阳时校正
    if (request.useTrueSolarTime && request.longitude !== undefined) {
      const standardTime = new Date(dateTime);
      const trueSolarTime = calculateTrueSolarTime(
        standardTime,
        request.longitude,
        suggestTimezone(request.longitude)
      );
      dateTime = trueSolarTime.toISOString();
    }

    return { solarDatetime: dateTime };
  } else if (request.inputType === 'lunar') {
    // 农历输入
    const lunarDatetime = parseLunarDate(
      request.lunarYear!,
      request.lunarMonth!,
      request.lunarDay!,
      request.lunarHour!,
      request.isLeapMonth,
      request.lunarMinute
    );
    return { lunarDatetime };
  }
  
  return {};
}

/**
 * 转换性别为数字
 */
export function genderToNumber(gender: 'male' | 'female'): number {
  return gender === 'male' ? 1 : 0;
}
