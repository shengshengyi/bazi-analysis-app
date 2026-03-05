/**
 * 简易前端路由系统
 * 处理页面间的导航和数据传递
 */

class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.beforeHooks = [];
    this.afterHooks = [];
  }
  
  /**
   * 注册路由
   */
  register(path, handler) {
    this.routes.set(path, handler);
    return this;
  }
  
  /**
   * 导航到指定路径
   */
  navigate(path, data = null) {
    // 执行前置钩子
    for (const hook of this.beforeHooks) {
      const result = hook(path, this.currentRoute);
      if (result === false) {
        return false; // 取消导航
      }
    }
    
    const handler = this.routes.get(path);
    if (!handler) {
      console.error(`路由未找到: ${path}`);
      return false;
    }
    
    // 保存当前路由
    const previousRoute = this.currentRoute;
    this.currentRoute = path;
    
    // 更新浏览器历史
    if (data) {
      sessionStorage.setItem('router-data', JSON.stringify(data));
    }
    
    // 执行路由处理器
    try {
      handler(data);
      
      // 执行后置钩子
      for (const hook of this.afterHooks) {
        hook(path, previousRoute);
      }
      
      return true;
    } catch (error) {
      console.error('路由导航失败:', error);
      this.currentRoute = previousRoute;
      return false;
    }
  }
  
  /**
   * 获取传递的数据
   */
  getData() {
    try {
      const data = sessionStorage.getItem('router-data');
      if (data) {
        sessionStorage.removeItem('router-data');
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('获取路由数据失败:', e);
    }
    return null;
  }
  
  /**
   * 添加前置钩子
   */
  beforeEach(hook) {
    this.beforeHooks.push(hook);
    return this;
  }
  
  /**
   * 添加后置钩子
   */
  afterEach(hook) {
    this.afterHooks.push(hook);
    return this;
  }
  
  /**
   * 获取当前路由
   */
  getCurrentRoute() {
    return this.currentRoute;
  }
  
  /**
   * 检查是否可以导航
   */
  canNavigate(path) {
    return this.routes.has(path);
  }
}

// 创建全局路由实例
const router = new Router();

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Router, router };
}
