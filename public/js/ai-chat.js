// AI对话功能

// 提供商和模型配置
const providerModels = {
  openai: {
    name: 'OpenAI',
    apiKeyPlaceholder: 'sk-...',
    apiKeyHelp: 'OpenAI API Key 格式: sk-...',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o', desc: '最强大的多模态模型' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', desc: '快速且经济实惠（推荐）' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', desc: '高性能模型' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', desc: '性价比之选' }
    ]
  },
  anthropic: {
    name: 'Anthropic Claude',
    apiKeyPlaceholder: 'sk-ant-...',
    apiKeyHelp: 'Claude API Key 格式: sk-ant-...',
    models: [
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', desc: '最智能的Claude模型' },
      { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', desc: '快速响应' },
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', desc: '复杂任务专家' }
    ]
  },
  deepseek: {
    name: 'DeepSeek',
    apiKeyPlaceholder: 'sk-...',
    apiKeyHelp: 'DeepSeek API Key',
    models: [
      { id: 'deepseek-chat', name: 'DeepSeek Chat', desc: '通用对话模型' },
      { id: 'deepseek-coder', name: 'DeepSeek Coder', desc: '代码专用模型' },
      { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner', desc: '推理增强模型' }
    ]
  },
  qwen: {
    name: '通义千问',
    apiKeyPlaceholder: 'sk-...',
    apiKeyHelp: '阿里云DashScope API Key，从百炼平台获取',
    models: [
      { id: 'qwen-max', name: 'Qwen Max', desc: '通义千问最强模型' },
      { id: 'qwen-plus', name: 'Qwen Plus', desc: '均衡性能与速度（推荐）' },
      { id: 'qwen-turbo', name: 'Qwen Turbo', desc: '快速响应' },
      { id: 'qwen-coder-plus', name: 'Qwen Coder Plus', desc: '编程专用' },
      { id: 'qwen-coder-turbo', name: 'Qwen Coder Turbo', desc: '快速编程助手' }
    ]
  },
  'qwen-coding': {
    name: '通义千问 - Coding Plane',
    apiKeyPlaceholder: 'sk-sp-...',
    apiKeyHelp: '千问百炼Coding Plane API Key（以sk-sp-开头）',
    models: [
      // 千问3系列（Coding Plane支持）
      { id: 'qwen3.5-plus', name: 'Qwen3.5-Plus', desc: '文本生成、深度思考、视觉理解（推荐）' },
      { id: 'qwen3-max-2026-01-23', name: 'Qwen3-Max', desc: '文本生成、深度思考' },
      { id: 'qwen3-coder-next', name: 'Qwen3-Coder-Next', desc: '文本生成' },
      { id: 'qwen3-coder-plus', name: 'Qwen3-Coder-Plus', desc: '文本生成' }
    ]
  },
  custom: {
    name: '自定义',
    apiKeyPlaceholder: 'your-api-key',
    apiKeyHelp: '自定义API的Key',
    models: [
      { id: 'custom-model', name: '自定义模型', desc: '请输入模型名称' }
    ]
  }
};

// 状态管理
const aiState = {
  currentSchool: 'wangshuai',
  isLoading: false,
  conversationHistory: [],
  baziData: null
};

// DOM 元素（延迟初始化）
let aiElements = {};

// 初始化DOM元素
function initElements() {
  aiElements = {
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
    apiKeyHelp: document.getElementById('apikey-help'),
    baseUrl: document.getElementById('ai-baseurl'),
    model: document.getElementById('ai-model'),
    temperature: document.getElementById('ai-temperature'),
    tempValue: document.getElementById('temp-value')
  };
}

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
  initElements(); // 先初始化DOM元素
  bindAIEvents();
  updateModelOptions('openai');
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

  // 提供商切换 - 更新模型列表和API Key提示
  if (aiElements.provider) {
    aiElements.provider.addEventListener('change', (e) => {
      const provider = e.target.value;
      updateModelOptions(provider);
      updateApiKeyHelp(provider);

      // 显示/隐藏自定义URL输入 (custom 和 qwen-coding 支持自定义baseUrl)
      const baseurlElements = document.querySelectorAll('.baseurl-config');
      const showBaseUrl = provider === 'custom' || provider === 'qwen-coding';
      baseurlElements.forEach(el => {
        el.classList.toggle('hidden', !showBaseUrl);
      });
    });
  }

  // 模型选择 - 处理自定义模型
  if (aiElements.model) {
    aiElements.model.addEventListener('change', (e) => {
      if (e.target.value === 'custom') {
        const customModel = prompt('请输入模型名称：');
        if (customModel && customModel.trim()) {
          // 添加自定义选项并选中
          const option = document.createElement('option');
          option.value = customModel.trim();
          option.textContent = customModel.trim() + ' (自定义)';
          option.selected = true;
          aiElements.model.insertBefore(option, aiElements.model.lastElementChild);
        } else {
          // 用户取消，恢复默认值
          e.target.value = e.target.options[0].value;
        }
      }
    });
  }
}

// 更新模型选项
function updateModelOptions(provider) {
  if (!aiElements.model) return;

  const config = providerModels[provider];
  if (!config) return;

  // 生成模型选项
  let optionsHtml = config.models.map(m =>
    `<option value="${m.id}">${m.name} - ${m.desc}</option>`
  ).join('');

  // 添加自定义选项
  optionsHtml += `<option value="custom">➕ 自定义模型...</option>`;

  aiElements.model.innerHTML = optionsHtml;
}

// 更新API Key帮助文本
function updateApiKeyHelp(provider) {
  if (!aiElements.apiKeyHelp || !aiElements.apiKey) return;

  const config = providerModels[provider];
  if (!config) return;

  aiElements.apiKeyHelp.textContent = config.apiKeyHelp;
  aiElements.apiKey.placeholder = config.apiKeyPlaceholder;
}

// 更新流派描述
function updateSchoolDesc() {
  if (aiElements.schoolDesc) {
    aiElements.schoolDesc.textContent = schoolDescriptions[aiState.currentSchool];
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
    console.log('[AI Config] Loaded from server:', result);
    if (result.success) {
      const config = result.data;
      if (aiElements.provider) {
        aiElements.provider.value = config.provider;
        updateModelOptions(config.provider);
        updateApiKeyHelp(config.provider);
      }
      if (aiElements.model) aiElements.model.value = config.model;
      if (aiElements.temperature) {
        aiElements.temperature.value = config.temperature;
        aiElements.tempValue.textContent = config.temperature;
      }
      // 加载baseUrl（如果存在）
      if (aiElements.baseUrl && config.baseUrl) {
        aiElements.baseUrl.value = config.baseUrl;
        console.log('[AI Config] Base URL loaded:', config.baseUrl);
      }
    }
  } catch (error) {
    console.error('加载配置失败:', error);
  }
}

// 保存AI配置
async function saveAIConfig() {
  const provider = aiElements.provider.value;
  const modelValue = aiElements.model.value;

  // 处理自定义模型名称
  let model = modelValue;
  if (modelValue === 'custom') {
    const customModelName = prompt('请输入模型名称：');
    if (!customModelName) return; // 用户取消
    model = customModelName.trim();
  }

  // 构建配置对象
  const config = {
    provider: provider,
    apiKey: aiElements.apiKey.value || undefined,
    model: model,
    temperature: parseFloat(aiElements.temperature.value)
  };

  // 允许自定义baseUrl的情况：custom模式或qwen-coding
  if (provider === 'custom' || provider === 'qwen-coding') {
    if (aiElements.baseUrl && aiElements.baseUrl.value) {
      config.baseUrl = aiElements.baseUrl.value;
    } else if (provider === 'qwen-coding') {
      // 使用Coding Plane默认地址
      config.baseUrl = 'https://coding.dashscope.aliyuncs.com/v1';
    }
  }

  console.log('[AI Config] Sending to server:', JSON.stringify(config, null, 2));

  try {
    const response = await fetch('/api/ai/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });

    const result = await response.json();
    console.log('[AI Config] Server response:', result);

    if (result.success) {
      addSystemMessage('AI配置已更新：' + providerModels[config.provider].name + '，模型：' + config.model);
      closeConfigModal();
    } else {
      alert('配置保存失败：' + result.error);
    }
  } catch (error) {
    console.error('保存配置失败:', error);
    alert('保存配置失败：' + error.message);
  }
}

// 暴露给全局，供app.js调用
window.initAIFeature = initAIFeature;
window.setAIBaziData = (data) => {
  aiState.baziData = data;
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initAIFeature);
