/**
 * 悬浮面板组件
 * 用于AI对话悬浮窗
 */

class FloatingPanel {
  constructor(options = {}) {
    this.id = options.id || `floating-${Date.now()}`;
    this.position = options.position || 'right'; // 'right' | 'bottom'
    this.width = options.width || '380px';
    this.height = options.height || '500px';
    this.title = options.title || 'AI解盘';
    this.content = options.content || null;
    this.collapsed = options.collapsed !== false;
    this.onToggle = options.onToggle || null;
    
    this.element = null;
    this.toggleBtn = null;
    this.panel = null;
    this.isExpanded = false;
  }
  
  /**
   * 创建悬浮面板DOM
   */
  create() {
    // 创建容器
    this.element = document.createElement('div');
    this.element.className = `floating-panel floating-${this.position}`;
    this.element.id = this.id;
    
    // 创建切换按钮
    this.toggleBtn = document.createElement('button');
    this.toggleBtn.className = 'floating-toggle';
    this.toggleBtn.innerHTML = this.getToggleIcon();
    this.toggleBtn.onclick = () => this.toggle();
    
    // 创建面板
    this.panel = document.createElement('div');
    this.panel.className = 'floating-content';
    this.panel.style.width = this.width;
    this.panel.style.height = this.height;
    
    // 创建面板头部
    const header = document.createElement('div');
    header.className = 'floating-header';
    
    const title = document.createElement('span');
    title.className = 'floating-title';
    title.textContent = this.title;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'floating-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => this.collapse();
    
    header.appendChild(title);
    header.appendChild(closeBtn);
    
    // 创建面板内容区
    const body = document.createElement('div');
    body.className = 'floating-body';
    
    if (this.content) {
      if (typeof this.content === 'string') {
        body.innerHTML = this.content;
      } else if (this.content instanceof HTMLElement) {
        body.appendChild(this.content);
      }
    }
    
    // 组装
    this.panel.appendChild(header);
    this.panel.appendChild(body);
    this.element.appendChild(this.toggleBtn);
    this.element.appendChild(this.panel);
    
    // 初始状态
    if (this.collapsed) {
      this.panel.classList.add('collapsed');
    } else {
      this.isExpanded = true;
      this.toggleBtn.classList.add('active');
    }
    
    return this;
  }
  
  /**
   * 获取切换按钮图标
   */
  getToggleIcon() {
    return `
      <svg viewBox="0 0 24 24" width="24" height="24">
        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
      </svg>
    `;
  }
  
  /**
   * 展开面板
   */
  expand() {
    if (this.isExpanded) return;
    
    this.panel.classList.remove('collapsed');
    this.panel.classList.add('expanded');
    this.toggleBtn.classList.add('active');
    this.isExpanded = true;
    
    if (this.onToggle) {
      this.onToggle(true);
    }
    
    // 更新全局状态
    if (typeof stateManager !== 'undefined') {
      stateManager.set('ui.aiPanelOpen', true);
    }
    
    return this;
  }
  
  /**
   * 收起面板
   */
  collapse() {
    if (!this.isExpanded) return;
    
    this.panel.classList.remove('expanded');
    this.panel.classList.add('collapsed');
    this.toggleBtn.classList.remove('active');
    this.isExpanded = false;
    
    if (this.onToggle) {
      this.onToggle(false);
    }
    
    // 更新全局状态
    if (typeof stateManager !== 'undefined') {
      stateManager.set('ui.aiPanelOpen', false);
    }
    
    return this;
  }
  
  /**
   * 切换展开/收起
   */
  toggle() {
    if (this.isExpanded) {
      this.collapse();
    } else {
      this.expand();
    }
    return this;
  }
  
  /**
   * 挂载到DOM
   */
  mount(container = document.body) {
    if (!this.element) {
      this.create();
    }
    container.appendChild(this.element);
    return this;
  }
  
  /**
   * 卸载
   */
  unmount() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    return this;
  }
  
  /**
   * 设置内容
   */
  setContent(content) {
    this.content = content;
    if (this.element) {
      const body = this.element.querySelector('.floating-body');
      if (body) {
        body.innerHTML = '';
        if (typeof content === 'string') {
          body.innerHTML = content;
        } else if (content instanceof HTMLElement) {
          body.appendChild(content);
        }
      }
    }
    return this;
  }
  
  /**
   * 设置标题
   */
  setTitle(title) {
    this.title = title;
    if (this.element) {
      const titleEl = this.element.querySelector('.floating-title');
      if (titleEl) {
        titleEl.textContent = title;
      }
    }
    return this;
  }
  
  /**
   * 获取内容容器
   */
  getBody() {
    if (this.element) {
      return this.element.querySelector('.floating-body');
    }
    return null;
  }
  
  /**
   * 销毁
   */
  destroy() {
    this.unmount();
    this.element = null;
    this.toggleBtn = null;
    this.panel = null;
  }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FloatingPanel };
}
