/**
 * 全局状态管理器
 * 管理应用的所有状态，包括当前八字、UI状态、用户配置等
 */

class StateManager {
  constructor() {
    this.state = {
      // 当前八字数据
      currentBazi: null,
      
      // UI状态
      ui: {
        activeModal: null,      // 当前打开的弹窗ID
        aiPanelOpen: false,     // AI面板是否展开
        selectedSchool: 'wangshuai', // 当前选中的流派
      },
      
      // 用户配置
      preferences: {
        defaultInputType: 'solar', // 默认输入类型
        customSchools: [],      // 自定义派别列表
        aiConfig: {
          provider: 'openai',
          model: 'gpt-4o',
        }
      },
      
      // 历史记录
      history: []
    };
    
    // 监听器映射
    this.listeners = new Map();
    
    // 从本地存储恢复状态
    this.loadFromStorage();
  }
  
  /**
   * 获取状态值
   */
  get(key) {
    if (key.includes('.')) {
      const keys = key.split('.');
      let value = this.state;
      for (const k of keys) {
        value = value?.[k];
      }
      return value;
    }
    return this.state[key];
  }
  
  /**
   * 设置状态值
   */
  set(key, value) {
    const oldValue = this.get(key);
    
    if (key.includes('.')) {
      const keys = key.split('.');
      let target = this.state;
      for (let i = 0; i < keys.length - 1; i++) {
        target = target[keys[i]];
      }
      target[keys[keys.length - 1]] = value;
    } else {
      this.state[key] = value;
    }
    
    // 通知监听器
    this.notify(key, value, oldValue);
    
    // 保存到本地存储
    this.saveToStorage();
  }
  
  /**
   * 订阅状态变化
   */
  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    this.listeners.get(key).push(callback);
    
    // 返回取消订阅函数
    return () => {
      const callbacks = this.listeners.get(key);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }
  
  /**
   * 通知监听器
   */
  notify(key, newValue, oldValue) {
    // 通知特定key的监听器
    const specificListeners = this.listeners.get(key);
    if (specificListeners) {
      specificListeners.forEach(cb => cb(newValue, oldValue, key));
    }
    
    // 通知通配符监听器
    const wildcardListeners = this.listeners.get('*');
    if (wildcardListeners) {
      wildcardListeners.forEach(cb => cb(newValue, oldValue, key));
    }
  }
  
  /**
   * 保存到本地存储
   */
  saveToStorage() {
    try {
      localStorage.setItem('bazi-v3-state', JSON.stringify({
        currentBazi: this.state.currentBazi,
        preferences: this.state.preferences,
        history: this.state.history
      }));
    } catch (e) {
      console.error('保存状态失败:', e);
    }
  }
  
  /**
   * 从本地存储恢复
   */
  loadFromStorage() {
    try {
      const saved = localStorage.getItem('bazi-v3-state');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.currentBazi) {
          this.state.currentBazi = data.currentBazi;
        }
        if (data.preferences) {
          this.state.preferences = { ...this.state.preferences, ...data.preferences };
        }
        if (data.history) {
          this.state.history = data.history;
        }
      }
    } catch (e) {
      console.error('加载状态失败:', e);
    }
  }
  
  /**
   * 添加历史记录
   */
  addHistory(baziData, name) {
    const item = {
      id: Date.now().toString(),
      name: name || this.generateHistoryName(baziData),
      baziData,
      createdAt: new Date().toISOString()
    };
    
    this.state.history.unshift(item);
    
    // 限制历史记录数量
    if (this.state.history.length > 50) {
      this.state.history = this.state.history.slice(0, 50);
    }
    
    this.saveToStorage();
    this.notify('history', this.state.history);
    
    return item;
  }
  
  /**
   * 删除历史记录
   */
  removeHistory(id) {
    this.state.history = this.state.history.filter(item => item.id !== id);
    this.saveToStorage();
    this.notify('history', this.state.history);
  }
  
  /**
   * 生成历史记录名称
   */
  generateHistoryName(baziData) {
    if (baziData.solarDate) {
      return baziData.solarDate.split('T')[0];
    }
    if (baziData.lunarDate) {
      return `农历${baziData.lunarDate.year}年${baziData.lunarDate.month}月${baziData.lunarDate.day}日`;
    }
    return '未知时间';
  }
}

// 创建全局状态管理器实例
const stateManager = new StateManager();

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StateManager, stateManager };
}
