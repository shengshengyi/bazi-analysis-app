// AI对话功能

// 状态管理
const aiState = {
  currentSchool: 'wangshuai',
  isLoading: false,
  conversationHistory: [],
  baziData: null
};

// DOM 元素
const aiElements = {
  schoolSelector: document.getElementById('school-selector'),
  schoolDesc: document.getElementById('school-desc'),
  messagesContainer: document.getElementById('ai-messages'),
  input: document.getElementById('ai-input'),
  sendBtn: document.getElementById('ai-send-btn'),
  quickQuestions: document.querySelectorAll('.quick-q'),
  configBtn: document.getElementById('ai-config-btn'),
  configModal: document.getElementById('ai-config-modal'),
  configSave: document.getElementById('ai-config-save'),
  configCancel: document.getElementById('ai-config-cancel'),
  modalClose: document.querySelector('.modal-close'),
  provider: document.getElementById('ai-provider'),
  apiKey: document.getElementById('ai-apikey'),
  baseUrl: document.getElementById('ai-baseurl'),
  model: document.getElementById('ai-model'),
  temperature: document.getElementById('ai-temperature'),
  tempValue: document.getElementById('temp-value')
};

// 流派描述
const schoolDescriptions = {
  wangshuai: '旺衰派：以日主强弱为核心，适合初学者入门',
  ziping: '子平派：传统经典格局论，重视月令和十神配置',
  blind: '盲派：重视做功和效率，口诀多，实战性强',
  geju: '格局派：专注格局成败，强调格局高低决定命运层次',
  xinpai: '新派：现代创新理论，百神论、反断论等'
};

// 初始化AI功能
function initAIFeature() {
  bindAIEvents();
  loadSchools();
  console.log('AI解盘功能已初始化');
}

// 绑定事件
function bindAIEvents() {
  // 流派切换
  if (aiElements.schoolSelector) {
    aiElements.schoolSelector.addEventListener('change', (e) => {
      aiState.currentSchool = e.target.value;
      updateSchoolDesc();
      addSystemMessage(`已切换到${aiElements.schoolSelector.options[e.target.selectedIndex].text.split(' - ')[0]}，该流派的分析风格已更新。`);
    });
  }

  // 发送消息
  if (aiElements.sendBtn) {
    aiElements.sendBtn.addEventListener('click', sendMessage);
  }

  if (aiElements.input) {
    aiElements.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }

  // 快捷问题
  aiElements.quickQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const question = btn.dataset.q;
      aiElements.input.value = question;
      sendMessage();
    });
  });

  // 配置弹窗
  if (aiElements.configBtn) {
    aiElements.configBtn.addEventListener('click', openConfigModal);
  }

  if (aiElements.modalClose) {
    aiElements.modalClose.addEventListener('click', closeConfigModal);
  }

  if (aiElements.configCancel) {
    aiElements.configCancel.addEventListener('click', closeConfigModal);
  }

  if (aiElements.configSave) {
    aiElements.configSave.addEventListener('click', saveAIConfig);
  }

  // 温度滑块
  if (aiElements.temperature) {
    aiElements.temperature.addEventListener('input', (e) => {
      aiElements.tempValue.textContent = e.target.value;
    });
  }

  // 提供商切换
  if (aiElements.provider) {
    aiElements.provider.addEventListener('change', (e) => {
      const customOnly = document.querySelectorAll('.custom-only');
      customOnly.forEach(el => {
        el.classList.toggle('hidden', e.target.value !== 'custom');
      });
    });
  }
}

// 更新流派描述
function updateSchoolDesc() {
  if (aiElements.schoolDesc) {
    aiElements.schoolDesc.textContent = schoolDescriptions[aiState.currentSchool];
  }
}

// 加载流派列表
async function loadSchools() {
  try {
    const response = await fetch('/api/ai/schools');
    const result = await response.json();
    if (result.success) {
      console.log('可用流派:', result.data);
    }
  } catch (error) {
    console.error('加载流派失败:', error);
  }
}

// 发送消息
async function sendMessage() {
  const message = aiElements.input.value.trim();
  if (!message || aiState.isLoading) return;

  // 检查是否有八字数据
  if (!aiState.baziData && window.appState && window.appState.baziData) {
    aiState.baziData = window.appState.baziData;
  }

  if (!aiState.baziData) {
    addSystemMessage('请先进行八字排盘，然后才能使用AI解盘功能。');
    return;
  }

  // 添加用户消息
  addUserMessage(message);
  aiElements.input.value = '';

  // 显示加载状态
  aiState.isLoading = true;
  showLoading();

  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        baziData: aiState.baziData,
        message: message,
        schoolId: aiState.currentSchool,
        history: aiState.conversationHistory
      })
    });

    const result = await response.json();

    if (result.success) {
      addAIMessage(result.data.message);
      // 保存到历史记录
      aiState.conversationHistory.push(
        { role: 'user', content: message },
        { role: 'assistant', content: result.data.message }
      );
      // 限制历史记录长度
      if (aiState.conversationHistory.length > 20) {
        aiState.conversationHistory = aiState.conversationHistory.slice(-20);
      }
    } else {
      addSystemMessage('AI回复失败：' + result.error);
    }
  } catch (error) {
    console.error('AI对话错误:', error);
    addSystemMessage('网络错误，请检查连接后重试。');
  } finally {
    aiState.isLoading = false;
    hideLoading();
  }
}

// 添加用户消息
function addUserMessage(text) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'ai-message user';
  messageDiv.innerHTML = `
    <div class="message-avatar">👤</div>
    <div class="message-content">${escapeHtml(text)}</div>
  `;
  aiElements.messagesContainer.appendChild(messageDiv);
  scrollToBottom();
}

// 添加AI消息
function addAIMessage(text) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'ai-message assistant';
  messageDiv.innerHTML = `
    <div class="message-avatar">🔮</div>
    <div class="message-content">${formatMessage(text)}</div>
  `;
  aiElements.messagesContainer.appendChild(messageDiv);
  scrollToBottom();
}

// 添加系统消息
function addSystemMessage(text) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'ai-message system';
  messageDiv.innerHTML = `<div class="message-content">${text}</div>`;
  aiElements.messagesContainer.appendChild(messageDiv);
  scrollToBottom();
}

// 显示加载状态
function showLoading() {
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'ai-message assistant loading';
  loadingDiv.id = 'ai-loading';
  loadingDiv.innerHTML = `
    <div class="message-avatar">🔮</div>
    <div class="message-content">
      <span class="loading-dots">思考中<span>.</span><span>.</span><span>.</span></span>
    </div>
  `;
  aiElements.messagesContainer.appendChild(loadingDiv);
  scrollToBottom();
}

// 隐藏加载状态
function hideLoading() {
  const loading = document.getElementById('ai-loading');
  if (loading) loading.remove();
}

// 滚动到底部
function scrollToBottom() {
  aiElements.messagesContainer.scrollTop = aiElements.messagesContainer.scrollHeight;
}

// 格式化消息（支持Markdown简单语法）
function formatMessage(text) {
  return escapeHtml(text)
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

// HTML转义
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 打开配置弹窗
function openConfigModal() {
  aiElements.configModal.classList.remove('hidden');
  loadAIConfig();
}

// 关闭配置弹窗
function closeConfigModal() {
  aiElements.configModal.classList.add('hidden');
}

// 加载AI配置
async function loadAIConfig() {
  try {
    const response = await fetch('/api/ai/config');
    const result = await response.json();
    if (result.success) {
      const config = result.data;
      if (aiElements.provider) aiElements.provider.value = config.provider;
      if (aiElements.model) aiElements.model.value = config.model;
      if (aiElements.temperature) {
        aiElements.temperature.value = config.temperature;
        aiElements.tempValue.textContent = config.temperature;
      }
    }
  } catch (error) {
    console.error('加载配置失败:', error);
  }
}

// 保存AI配置
async function saveAIConfig() {
  const config = {
    provider: aiElements.provider.value,
    apiKey: aiElements.apiKey.value || undefined,
    baseUrl: aiElements.baseUrl.value || undefined,
    model: aiElements.model.value,
    temperature: parseFloat(aiElements.temperature.value)
  };

  try {
    const response = await fetch('/api/ai/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });

    const result = await response.json();
    if (result.success) {
      addSystemMessage('AI配置已更新');
      closeConfigModal();
    } else {
      alert('配置保存失败：' + result.error);
    }
  } catch (error) {
    console.error('保存配置失败:', error);
    alert('保存配置失败');
  }
}

// 暴露给全局，供app.js调用
window.initAIFeature = initAIFeature;
window.setAIBaziData = (data) => {
  aiState.baziData = data;
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initAIFeature);
