/**
 * AI聊天功能
 * 处理AI解盘的对话功能
 */

class AIChat {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = {
      baziData: null,
      schoolId: 'wangshuai',
      maxHistory: 20,
      ...options
    };
    
    this.messages = [];
    this.isStreaming = false;
    this.abortController = null;
    
    if (this.container) {
      this.init();
    }
  }
  
  /**
   * 初始化
   */
  init() {
    this.render();
    this.bindEvents();
    this.addSystemMessage('您好！我是AI八字解盘助手。请向我提问关于八字的问题。');
  }
  
  /**
   * 渲染界面
   */
  render() {
    this.container.innerHTML = `
      <div class="ai-chat">
        <div class="ai-messages" id="ai-messages"></div>
        <div class="ai-input-area">
          <div class="quick-questions">
            <button class="quick-q" data-q="分析事业发展">事业发展</button>
            <button class="quick-q" data-q="分析财富运势">财富运势</button>
            <button class="quick-q" data-q="分析性格特点">性格特点</button>
            <button class="quick-q" data-q="分析健康状况">健康状况</button>
          </div>
          <div class="input-row">
            <input type="text" id="ai-input" placeholder="输入您的问题..." maxlength="500">
            <button id="ai-send-btn" class="send-btn">
              <span class="send-icon">➤</span>
            </button>
          </div>
          <div class="ai-disclaimer">
            <small>AI解盘仅供参考，八字命理需要结合实际情况综合分析</small>
          </div>
        </div>
      </div>
    `;
    
    this.messagesContainer = this.container.querySelector('#ai-messages');
    this.input = this.container.querySelector('#ai-input');
    this.sendBtn = this.container.querySelector('#ai-send-btn');
  }
  
  /**
   * 绑定事件
   */
  bindEvents() {
    // 发送按钮
    this.sendBtn.addEventListener('click', () => this.sendMessage());
    
    // 回车发送
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
    
    // 快捷问题
    this.container.querySelectorAll('.quick-q').forEach(btn => {
      btn.addEventListener('click', () => {
        this.input.value = btn.dataset.q;
        this.sendMessage();
      });
    });
  }
  
  /**
   * 发送消息
   */
  async sendMessage() {
    if (this.isStreaming) return;
    
    const message = this.input.value.trim();
    if (!message) return;
    
    // 清空输入
    this.input.value = '';
    
    // 添加用户消息
    this.addUserMessage(message);
    
    // 添加到历史
    this.messages.push({ role: 'user', content: message });
    
    // 发送请求
    await this.sendAIRequest();
  }
  
  /**
   * 发送AI请求
   */
  async sendAIRequest() {
    if (!this.options.baziData) {
      this.addSystemMessage('错误：没有八字数据');
      return;
    }
    
    this.isStreaming = true;
    this.setLoading(true);
    
    // 创建AI消息容器
    const messageId = 'ai-' + Date.now();
    this.addAIMessageContainer(messageId);
    
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          baziData: this.options.baziData,
          message: this.messages[this.messages.length - 1].content,
          schoolId: this.options.schoolId,
          history: this.messages.slice(-10) // 最近10条历史
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // 更新AI消息
        this.updateAIMessage(messageId, data.response);
        
        // 添加到历史
        this.messages.push({ role: 'assistant', content: data.response });
        
        // 限制历史长度
        if (this.messages.length > this.options.maxHistory) {
          this.messages = this.messages.slice(-this.options.maxHistory);
        }
      } else {
        throw new Error(data.error || '请求失败');
      }
    } catch (error) {
      console.error('AI请求失败:', error);
      this.updateAIMessage(messageId, '抱歉，请求失败，请稍后重试。');
    } finally {
      this.isStreaming = false;
      this.setLoading(false);
    }
  }
  
  /**
   * 添加用户消息
   */
  addUserMessage(content) {
    const messageEl = document.createElement('div');
    messageEl.className = 'ai-message user';
    messageEl.innerHTML = `
      <div class="message-avatar">👤</div>
      <div class="message-content">
        <div class="message-text">${this.escapeHtml(content)}</div>
      </div>
    `;
    this.messagesContainer.appendChild(messageEl);
    this.scrollToBottom();
  }
  
  /**
   * 添加系统消息
   */
  addSystemMessage(content) {
    const messageEl = document.createElement('div');
    messageEl.className = 'ai-message system';
    messageEl.innerHTML = `
      <div class="message-content">
        <div class="message-text">${content}</div>
      </div>
    `;
    this.messagesContainer.appendChild(messageEl);
    this.scrollToBottom();
  }
  
  /**
   * 添加AI消息容器（用于流式输出）
   */
  addAIMessageContainer(messageId) {
    const messageEl = document.createElement('div');
    messageEl.id = messageId;
    messageEl.className = 'ai-message ai';
    messageEl.innerHTML = `
      <div class="message-avatar">🤖</div>
      <div class="message-content">
        <div class="message-text">思考中...</div>
      </div>
    `;
    this.messagesContainer.appendChild(messageEl);
    this.scrollToBottom();
    return messageEl;
  }
  
  /**
   * 更新AI消息内容
   */
  updateAIMessage(messageId, content) {
    const messageEl = document.getElementById(messageId);
    if (messageEl) {
      const textEl = messageEl.querySelector('.message-text');
      if (textEl) {
        textEl.innerHTML = this.formatMessage(content);
      }
    }
    this.scrollToBottom();
  }
  
  /**
   * 格式化消息内容
   */
  formatMessage(content) {
    // 转义HTML
    let formatted = this.escapeHtml(content);
    
    // 支持简单的markdown格式
    // 粗体
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // 斜体
    formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');
    // 换行
    formatted = formatted.replace(/\n/g, '<br>');
    
    return formatted;
  }
  
  /**
   * 设置加载状态
   */
  setLoading(loading) {
    this.sendBtn.disabled = loading;
    this.sendBtn.classList.toggle('loading', loading);
    this.input.disabled = loading;
  }
  
  /**
   * 滚动到底部
   */
  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
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
   * 清空对话
   */
  clear() {
    this.messages = [];
    this.messagesContainer.innerHTML = '';
    this.addSystemMessage('对话已清空。请向我提问关于八字的问题。');
  }
  
  /**
   * 设置八字数据
   */
  setBaziData(baziData) {
    this.options.baziData = baziData;
  }
  
  /**
   * 设置流派
   */
  setSchool(schoolId) {
    this.options.schoolId = schoolId;
  }
  
  /**
   * 销毁
   */
  destroy() {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.container.innerHTML = '';
  }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AIChat };
}
