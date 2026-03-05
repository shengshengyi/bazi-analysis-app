/**
 * API请求封装
 * 统一处理后端API调用
 */

class ApiClient {
  constructor() {
    this.baseUrl = '';
    this.defaultHeaders = {
      'Content-Type': 'application/json'
    };
  }
  
  /**
   * 发送GET请求
   */
  async get(url, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    return this.request(fullUrl, { method: 'GET' });
  }
  
  /**
   * 发送POST请求
   */
  async post(url, data = {}) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
  
  /**
   * 发送通用请求
   */
  async request(url, options = {}) {
    const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;
    
    const config = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers
      }
    };
    
    try {
      const response = await fetch(fullUrl, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API请求失败:', error);
      throw error;
    }
  }
  
  // ==================== 排盘API ====================
  
  /**
   * 计算八字（阳历）
   */
  async calculateBaziSolar(date, time, gender, options = {}) {
    return this.post('/api/bazi/calculate', {
      inputType: 'solar',
      solarDate: date,
      solarTime: time,
      gender,
      ...options
    });
  }
  
  /**
   * 计算八字（农历）
   */
  async calculateBaziLunar(year, month, day, hour, gender, isLeapMonth = false, minute = '00:00') {
    return this.post('/api/bazi/calculate', {
      inputType: 'lunar',
      lunarYear: year,
      lunarMonth: month,
      lunarDay: day,
      lunarHour: hour,
      lunarMinute: minute,
      isLeapMonth,
      gender
    });
  }
  
  /**
   * 计算八字（直接输入八字）
   */
  async calculateBaziDirect(baziString, gender) {
    return this.post('/api/bazi/calculate', {
      inputType: 'bazi',
      baziString,
      gender
    });
  }
  
  // ==================== 分析API ====================
  
  /**
   * 获取五维分析
   */
  async analyzeFiveDimensions(baziData) {
    return this.post('/api/analyze', {
      baziData,
      dimensions: ['career', 'wealth', 'fortune', 'personality', 'health']
    });
  }
  
  /**
   * 获取大运流年
   */
  async analyzeLuckCycles(baziData, year) {
    return this.post('/api/analyze', {
      baziData,
      dimensions: ['luckCycle'],
      year
    });
  }
  
  /**
   * 获取神煞分析
   */
  async analyzeShenSha(baziData) {
    return this.post('/api/analyze', {
      baziData,
      dimensions: ['shenSha']
    });
  }
  
  // ==================== AI API ====================
  
  /**
   * 获取所有流派配置
   */
  async getSchools() {
    return this.get('/api/ai/schools');
  }
  
  /**
   * 发送AI消息
   */
  async sendAiMessage(baziData, message, schoolId, history = []) {
    return this.post('/api/ai/chat', {
      baziData,
      message,
      schoolId,
      history
    });
  }
  
  /**
   * 创建自定义流派
   */
  async createCustomSchool(config) {
    return this.post('/api/ai/schools/custom', config);
  }
  
  /**
   * 更新自定义流派
   */
  async updateCustomSchool(id, config) {
    return this.request(`/api/ai/schools/${id}`, {
      method: 'PUT',
      body: JSON.stringify(config)
    });
  }
  
  /**
   * 删除自定义流派
   */
  async deleteCustomSchool(id) {
    return this.request(`/api/ai/schools/${id}`, {
      method: 'DELETE'
    });
  }
}

// 创建全局API客户端实例
const api = new ApiClient();

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ApiClient, api };
}
