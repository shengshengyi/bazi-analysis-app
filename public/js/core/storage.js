/**
 * 本地存储封装
 * 提供统一的LocalStorage操作接口
 */

class StorageService {
  constructor(prefix = 'bazi-v3') {
    this.prefix = prefix;
  }

  /**
   * 获取完整key
   */
  getKey(key) {
    return `${this.prefix}:${key}`;
  }

  /**
   * 设置值
   */
  set(key, value) {
    try {
      const fullKey = this.getKey(key);
      const serialized = JSON.stringify(value);
      localStorage.setItem(fullKey, serialized);
      return true;
    } catch (e) {
      console.error('Storage set error:', e);
      return false;
    }
  }

  /**
   * 获取值
   */
  get(key, defaultValue = null) {
    try {
      const fullKey = this.getKey(key);
      const item = localStorage.getItem(fullKey);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item);
    } catch (e) {
      console.error('Storage get error:', e);
      return defaultValue;
    }
  }

  /**
   * 移除值
   */
  remove(key) {
    try {
      const fullKey = this.getKey(key);
      localStorage.removeItem(fullKey);
      return true;
    } catch (e) {
      console.error('Storage remove error:', e);
      return false;
    }
  }

  /**
   * 清空所有以prefix开头的数据
   */
  clear() {
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (e) {
      console.error('Storage clear error:', e);
      return false;
    }
  }

  /**
   * 获取所有键
   */
  keys() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        keys.push(key.slice(this.prefix.length + 1));
      }
    }
    return keys;
  }

  /**
   * 检查是否存在
   */
  has(key) {
    const fullKey = this.getKey(key);
    return localStorage.getItem(fullKey) !== null;
  }

  /**
   * 设置临时值（sessionStorage）
   */
  setSession(key, value) {
    try {
      const fullKey = this.getKey(key);
      sessionStorage.setItem(fullKey, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('SessionStorage set error:', e);
      return false;
    }
  }

  /**
   * 获取临时值
   */
  getSession(key, defaultValue = null) {
    try {
      const fullKey = this.getKey(key);
      const item = sessionStorage.getItem(fullKey);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item);
    } catch (e) {
      console.error('SessionStorage get error:', e);
      return defaultValue;
    }
  }

  /**
   * 移除临时值
   */
  removeSession(key) {
    try {
      const fullKey = this.getKey(key);
      sessionStorage.removeItem(fullKey);
      return true;
    } catch (e) {
      console.error('SessionStorage remove error:', e);
      return false;
    }
  }
}

// 创建全局存储服务实例
const storage = new StorageService();

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StorageService, storage };
}
