/**
 * 历史记录管理
 * 管理用户的八字分析历史记录
 */

class HistoryManager {
  constructor(maxItems = 50) {
    this.maxItems = maxItems;
    this.history = [];
    this.listeners = [];
    this.loadHistory();
  }
  
  /**
   * 加载历史记录
   */
  loadHistory() {
    try {
      let data;
      if (typeof storage !== 'undefined') {
        data = storage.get('analysisHistory', []);
      } else {
        const saved = localStorage.getItem('bazi-analysis-history');
        data = saved ? JSON.parse(saved) : [];
      }
      this.history = Array.isArray(data) ? data : [];
    } catch (e) {
      console.error('加载历史记录失败:', e);
      this.history = [];
    }
  }
  
  /**
   * 保存历史记录
   */
  saveHistory() {
    try {
      if (typeof storage !== 'undefined') {
        storage.set('analysisHistory', this.history);
      } else {
        localStorage.setItem('bazi-analysis-history', JSON.stringify(this.history));
      }
    } catch (e) {
      console.error('保存历史记录失败:', e);
    }
  }
  
  /**
   * 添加历史记录
   */
  add(baziData, name = null) {
    const item = {
      id: this.generateId(),
      name: name || this.generateName(baziData),
      baziData: baziData,
      createdAt: new Date().toISOString()
    };
    
    // 检查是否已存在相同的八字
    const existingIndex = this.history.findIndex(h => 
      this.isSameBazi(h.baziData, baziData)
    );
    
    if (existingIndex !== -1) {
      // 移动到最前面
      const existing = this.history.splice(existingIndex, 1)[0];
      existing.createdAt = item.createdAt;
      this.history.unshift(existing);
    } else {
      this.history.unshift(item);
      
      // 限制数量
      if (this.history.length > this.maxItems) {
        this.history = this.history.slice(0, this.maxItems);
      }
    }
    
    this.saveHistory();
    this.notifyListeners();
    
    return item;
  }
  
  /**
   * 删除历史记录
   */
  remove(id) {
    const index = this.history.findIndex(h => h.id === id);
    if (index === -1) return false;
    
    this.history.splice(index, 1);
    this.saveHistory();
    this.notifyListeners();
    
    return true;
  }
  
  /**
   * 清空历史记录
   */
  clear() {
    this.history = [];
    this.saveHistory();
    this.notifyListeners();
  }
  
  /**
   * 获取所有历史记录
   */
  getAll() {
    return [...this.history];
  }
  
  /**
   * 根据ID获取历史记录
   */
  getById(id) {
    return this.history.find(h => h.id === id);
  }
  
  /**
   * 更新历史记录名称
   */
  updateName(id, newName) {
    const item = this.history.find(h => h.id === id);
    if (!item) return false;
    
    item.name = newName;
    item.updatedAt = new Date().toISOString();
    this.saveHistory();
    this.notifyListeners();
    
    return true;
  }
  
  /**
   * 搜索历史记录
   */
  search(keyword) {
    if (!keyword) return this.getAll();
    
    const lowerKeyword = keyword.toLowerCase();
    return this.history.filter(item => 
      item.name.toLowerCase().includes(lowerKeyword) ||
      item.baziData.dayMaster?.includes(keyword) ||
      item.baziData.solarDate?.includes(keyword)
    );
  }
  
  /**
   * 生成唯一ID
   */
  generateId() {
    return `hist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * 生成默认名称
   */
  generateName(baziData) {
    if (baziData.solarDate) {
      return baziData.solarDate.split('T')[0];
    }
    if (baziData.lunarDate) {
      return `农历${baziData.lunarDate.year}年${baziData.lunarDate.month}月${baziData.lunarDate.day}日`;
    }
    if (baziData.pillars) {
      const { year, month, day, hour } = baziData.pillars;
      return `${year.stem}${year.branch}年 ${month.stem}${month.branch}月`;
    }
    return '未知时间';
  }
  
  /**
   * 判断是否为相同的八字
   */
  isSameBazi(a, b) {
    if (!a || !b) return false;
    
    // 比较四柱
    if (a.pillars && b.pillars) {
      return (
        a.pillars.year.stem === b.pillars.year.stem &&
        a.pillars.year.branch === b.pillars.year.branch &&
        a.pillars.month.stem === b.pillars.month.stem &&
        a.pillars.month.branch === b.pillars.month.branch &&
        a.pillars.day.stem === b.pillars.day.stem &&
        a.pillars.day.branch === b.pillars.day.branch &&
        a.pillars.hour.stem === b.pillars.hour.stem &&
        a.pillars.hour.branch === b.pillars.hour.branch
      );
    }
    
    // 比较日期
    if (a.solarDate && b.solarDate) {
      return a.solarDate === b.solarDate;
    }
    
    return false;
  }
  
  /**
   * 格式化日期
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    // 小于1小时
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return minutes < 1 ? '刚刚' : `${minutes}分钟前`;
    }
    
    // 小于24小时
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}小时前`;
    }
    
    // 小于7天
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `${days}天前`;
    }
    
    // 默认格式
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  /**
   * 订阅变化
   */
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
  
  /**
   * 通知监听器
   */
  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.getAll());
      } catch (e) {
        console.error('History listener error:', e);
      }
    });
  }
  
  /**
   * 生成历史记录列表HTML
   */
  generateListHTML(items = null) {
    const history = items || this.getAll();
    
    if (history.length === 0) {
      return `
        <div class="history-empty">
          <p>暂无历史记录</p>
          <p class="hint">开始一次八字分析，记录将显示在这里</p>
        </div>
      `;
    }
    
    return `
      <div class="history-list">
        ${history.map(item => `
          <div class="history-item" data-id="${item.id}">
            <div class="history-main">
              <div class="history-name">${this.escapeHtml(item.name)}</div>
              <div class="history-meta">
                <span class="history-time">${this.formatDate(item.createdAt)}</span>
                ${item.baziData.dayMaster ? `<span class="history-daymaster">日主: ${item.baziData.dayMaster}</span>` : ''}
              </div>
            </div>
            <div class="history-actions">
              <button class="btn-load" data-id="${item.id}" title="加载">→</button>
              <button class="btn-delete" data-id="${item.id}" title="删除">×</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
  
  /**
   * 生成搜索界面HTML
   */
  generateSearchHTML() {
    return `
      <div class="history-search">
        <input type="text" id="history-search-input" placeholder="搜索历史记录...">
        <button id="history-search-btn">搜索</button>
      </div>
      <div id="history-search-results"></div>
    `;
  }
  
  /**
   * 转义HTML
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  /**
   * 导出历史记录
   */
  export() {
    return JSON.stringify(this.history, null, 2);
  }
  
  /**
   * 导入历史记录
   */
  import(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data)) {
        this.history = data.slice(0, this.maxItems);
        this.saveHistory();
        this.notifyListeners();
        return true;
      }
      return false;
    } catch (e) {
      console.error('导入历史记录失败:', e);
      return false;
    }
  }
}

// 创建全局实例
const historyManager = new HistoryManager();

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HistoryManager, historyManager };
}
