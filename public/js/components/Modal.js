/**
 * 弹窗组件
 * 用于显示五维分析、大运流年等子页面内容
 */

class Modal {
  constructor(options = {}) {
    this.id = options.id || `modal-${Date.now()}`;
    this.title = options.title || '';
    this.content = options.content || '';
    this.width = options.width || '600px';
    this.height = options.height || 'auto';
    this.showClose = options.showClose !== false;
    this.closeOnOverlay = options.closeOnOverlay !== false;
    this.closeOnEsc = options.closeOnEsc !== false;
    this.onClose = options.onClose || null;
    this.onOpen = options.onOpen || null;
    
    this.element = null;
    this.overlay = null;
    this.isOpen = false;
  }
  
  /**
   * 创建弹窗DOM结构
   */
  create() {
    // 创建遮罩层
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';
    this.overlay.id = `${this.id}-overlay`;
    
    // 创建弹窗容器
    this.element = document.createElement('div');
    this.element.className = 'modal-container';
    this.element.id = this.id;
    this.element.style.width = this.width;
    this.element.style.maxHeight = '90vh';
    
    // 创建弹窗头部
    const header = document.createElement('div');
    header.className = 'modal-header';
    
    const title = document.createElement('h3');
    title.className = 'modal-title';
    title.textContent = this.title;
    header.appendChild(title);
    
    if (this.showClose) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'modal-close';
      closeBtn.innerHTML = '&times;';
      closeBtn.onclick = () => this.close();
      header.appendChild(closeBtn);
    }
    
    // 创建弹窗内容
    const body = document.createElement('div');
    body.className = 'modal-body';
    if (typeof this.content === 'string') {
      body.innerHTML = this.content;
    } else if (this.content instanceof HTMLElement) {
      body.appendChild(this.content);
    }
    
    // 组装弹窗
    this.element.appendChild(header);
    this.element.appendChild(body);
    this.overlay.appendChild(this.element);
    
    // 绑定事件
    this.bindEvents();
    
    return this;
  }
  
  /**
   * 绑定事件
   */
  bindEvents() {
    // 点击遮罩关闭
    if (this.closeOnOverlay) {
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) {
          this.close();
        }
      });
    }
    
    // ESC键关闭
    if (this.closeOnEsc) {
      this.escHandler = (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      };
    }
  }
  
  /**
   * 打开弹窗
   */
  open() {
    if (!this.element) {
      this.create();
    }
    
    document.body.appendChild(this.overlay);
    document.body.style.overflow = 'hidden'; // 禁止背景滚动
    
    // 添加动画类
    requestAnimationFrame(() => {
      this.overlay.classList.add('modal-open');
      this.element.classList.add('modal-slide-up');
    });
    
    // 绑定ESC事件
    if (this.closeOnEsc) {
      document.addEventListener('keydown', this.escHandler);
    }
    
    this.isOpen = true;
    
    // 触发打开回调
    if (this.onOpen) {
      this.onOpen();
    }
    
    // 更新全局状态
    if (typeof stateManager !== 'undefined') {
      stateManager.set('ui.activeModal', this.id);
    }
    
    return this;
  }
  
  /**
   * 关闭弹窗
   */
  close() {
    if (!this.isOpen) return;
    
    // 添加关闭动画
    this.element.classList.remove('modal-slide-up');
    this.element.classList.add('modal-slide-down');
    this.overlay.classList.remove('modal-open');
    
    // 动画结束后移除DOM
    setTimeout(() => {
      if (this.overlay.parentNode) {
        this.overlay.parentNode.removeChild(this.overlay);
      }
      document.body.style.overflow = ''; // 恢复背景滚动
    }, 300);
    
    // 移除ESC事件
    if (this.closeOnEsc) {
      document.removeEventListener('keydown', this.escHandler);
    }
    
    this.isOpen = false;
    
    // 触发关闭回调
    if (this.onClose) {
      this.onClose();
    }
    
    // 更新全局状态
    if (typeof stateManager !== 'undefined') {
      stateManager.set('ui.activeModal', null);
    }
    
    return this;
  }
  
  /**
   * 设置内容
   */
  setContent(content) {
    this.content = content;
    if (this.element) {
      const body = this.element.querySelector('.modal-body');
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
      const titleEl = this.element.querySelector('.modal-title');
      if (titleEl) {
        titleEl.textContent = title;
      }
    }
    return this;
  }
  
  /**
   * 销毁弹窗
   */
  destroy() {
    this.close();
    this.element = null;
    this.overlay = null;
  }
}

// 弹窗管理器
class ModalManager {
  constructor() {
    this.modals = new Map();
    this.activeModal = null;
  }
  
  /**
   * 创建并打开弹窗
   */
  open(options) {
    const modal = new Modal(options);
    this.modals.set(modal.id, modal);
    this.activeModal = modal;
    modal.open();
    return modal;
  }
  
  /**
   * 关闭指定弹窗
   */
  close(id) {
    const modal = this.modals.get(id);
    if (modal) {
      modal.close();
      this.modals.delete(id);
    }
  }
  
  /**
   * 关闭所有弹窗
   */
  closeAll() {
    this.modals.forEach(modal => modal.close());
    this.modals.clear();
    this.activeModal = null;
  }
  
  /**
   * 获取当前活动弹窗
   */
  getActive() {
    return this.activeModal;
  }
}

// 创建全局弹窗管理器
const modalManager = new ModalManager();

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Modal, ModalManager, modalManager };
}
