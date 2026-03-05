/**
 * 入口页面逻辑
 */

(function() {
  // DOM元素
  const typeBtns = document.querySelectorAll('.type-btn');
  const inputForms = document.querySelectorAll('.input-form');
  const analyzeBtn = document.getElementById('analyze-btn');
  const loadingOverlay = document.getElementById('loading-overlay');
  const historyList = document.getElementById('history-list');
  const clearHistoryBtn = document.getElementById('clear-history');
  
  // 当前输入类型
  let currentType = 'solar';
  
  // 初始化
  function init() {
    initTypeSelector();
    initForms();
    initHistory();
    initExamples();
    
    // 检查是否有从主页返回的数据
    const returnData = router.getData();
    if (returnData && returnData.baziData) {
      // 可以在这里恢复之前的状态
    }
  }
  
  // 初始化输入类型选择器
  function initTypeSelector() {
    typeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        switchType(type);
      });
    });
  }
  
  // 切换输入类型
  function switchType(type) {
    currentType = type;
    
    // 更新按钮状态
    typeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.type === type);
    });
    
    // 更新表单显示
    inputForms.forEach(form => {
      form.classList.toggle('active', form.id === `${type}-form`);
    });
    
    // 验证表单
    validateForm();
  }
  
  // 初始化表单
  function initForms() {
    // 阳历表单
    const solarDate = document.getElementById('solar-date');
    const solarTime = document.getElementById('solar-time');
    const useTrueSolarTime = document.getElementById('use-true-solar-time');
    const longitudeGroup = document.getElementById('longitude-group');
    
    // 设置默认日期为今天
    const today = new Date();
    solarDate.value = today.toISOString().split('T')[0];
    solarTime.value = '12:00';
    
    // 真太阳时选项
    useTrueSolarTime.addEventListener('change', () => {
      longitudeGroup.classList.toggle('hidden', !useTrueSolarTime.checked);
    });
    
    // 农历表单初始化
    initLunarForm();
    
    // 八字表单监听
    const baziInput = document.getElementById('bazi-input');
    baziInput.addEventListener('input', validateForm);
    
    // 性别选择监听
    const genderInputs = document.querySelectorAll('input[name="gender"]');
    genderInputs.forEach(input => {
      input.addEventListener('change', validateForm);
    });
    
    // 阳历/农历输入监听
    [solarDate, solarTime].forEach(el => {
      el.addEventListener('change', validateForm);
    });
    
    ['lunar-year', 'lunar-month', 'lunar-day', 'lunar-hour'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', validateForm);
    });
    
    // 分析按钮点击
    analyzeBtn.addEventListener('click', handleAnalyze);
    
    // 初始验证
    validateForm();
  }
  
  // 初始化农历表单
  function initLunarForm() {
    const yearSelect = document.getElementById('lunar-year');
    const monthSelect = document.getElementById('lunar-month');
    const daySelect = document.getElementById('lunar-day');
    
    // 生成年份选项（1900-2100）
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1900; year--) {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = `${year}年`;
      yearSelect.appendChild(option);
    }
    
    // 生成月份选项
    for (let month = 1; month <= 12; month++) {
      const option = document.createElement('option');
      option.value = month;
      option.textContent = `${month}月`;
      monthSelect.appendChild(option);
    }
    
    // 生成日期选项
    function updateDays() {
      daySelect.innerHTML = '<option value="">请选择</option>';
      const year = parseInt(yearSelect.value) || 2024;
      const month = parseInt(monthSelect.value) || 1;
      const daysInMonth = new Date(year, month, 0).getDate();
      
      for (let day = 1; day <= daysInMonth; day++) {
        const option = document.createElement('option');
        option.value = day;
        option.textContent = `${day}日`;
        daySelect.appendChild(option);
      }
    }
    
    yearSelect.addEventListener('change', updateDays);
    monthSelect.addEventListener('change', updateDays);
    
    // 设置默认值
    yearSelect.value = currentYear;
    monthSelect.value = 6;
    updateDays();
    daySelect.value = 15;
  }
  
  // 初始化示例点击
  function initExamples() {
    const examples = document.querySelectorAll('.example');
    const baziInput = document.getElementById('bazi-input');
    
    examples.forEach(example => {
      example.addEventListener('click', () => {
        baziInput.value = example.dataset.example;
        validateForm();
      });
    });
  }
  
  // 验证表单
  function validateForm() {
    let isValid = false;
    const gender = document.querySelector('input[name="gender"]:checked');
    
    switch (currentType) {
      case 'solar':
        const solarDate = document.getElementById('solar-date').value;
        const solarTime = document.getElementById('solar-time').value;
        isValid = solarDate && solarTime && gender;
        break;
        
      case 'lunar':
        const lunarYear = document.getElementById('lunar-year').value;
        const lunarMonth = document.getElementById('lunar-month').value;
        const lunarDay = document.getElementById('lunar-day').value;
        const lunarHour = document.getElementById('lunar-hour').value;
        isValid = lunarYear && lunarMonth && lunarDay && lunarHour && gender;
        break;
        
      case 'bazi':
        const baziInput = document.getElementById('bazi-input').value.trim();
        isValid = baziInput && gender;
        break;
    }
    
    analyzeBtn.disabled = !isValid;
    return isValid;
  }
  
  // 处理分析按钮点击
  async function handleAnalyze() {
    if (!validateForm()) return;
    
    const gender = document.querySelector('input[name="gender"]:checked').value;
    
    showLoading();
    
    try {
      let result;
      
      switch (currentType) {
        case 'solar':
          const solarDate = document.getElementById('solar-date').value;
          const solarTime = document.getElementById('solar-time').value;
          const useTrueSolarTime = document.getElementById('use-true-solar-time').checked;
          const longitude = document.getElementById('longitude').value;
          
          result = await api.calculateBaziSolar(solarDate, solarTime, gender, {
            useTrueSolarTime,
            longitude: longitude ? parseFloat(longitude) : undefined
          });
          break;
          
        case 'lunar':
          const lunarYear = parseInt(document.getElementById('lunar-year').value);
          const lunarMonth = parseInt(document.getElementById('lunar-month').value);
          const lunarDay = parseInt(document.getElementById('lunar-day').value);
          const lunarHour = parseInt(document.getElementById('lunar-hour').value);
          const lunarMinute = document.getElementById('lunar-minute').value || '00:00';
          const isLeapMonth = document.getElementById('is-leap-month').checked;
          
          // 将具体时间（分钟）传递给后端
          result = await api.calculateBaziLunar(lunarYear, lunarMonth, lunarDay, lunarHour, gender, isLeapMonth, lunarMinute);
          break;
          
        case 'bazi':
          const baziInput = document.getElementById('bazi-input').value.trim();
          result = await api.calculateBaziDirect(baziInput, gender);
          break;
      }
      
      console.log('API result:', result);
      
      if (result.success && result.data) {
        console.log('Saving bazi data:', result.data);
        
        // 保存到状态
        stateManager.set('currentBazi', result.data);
        console.log('Data saved, currentBazi:', stateManager.get('currentBazi'));
        
        // 添加到历史记录
        try {
          stateManager.addHistory(result.data);
        } catch (e) {
          console.error('Failed to add history:', e);
        }
        
        // 跳转到主页面
        console.log('Redirecting to index.html...');
        window.location.href = 'index.html';
      } else {
        console.error('API error:', result.error);
        alert(result.error || '排盘失败，请检查输入');
      }
    } catch (error) {
      console.error('分析失败:', error);
      alert('分析失败: ' + error.message);
    } finally {
      hideLoading();
    }
  }
  
  // 显示加载
  function showLoading() {
    loadingOverlay.classList.remove('hidden');
    analyzeBtn.disabled = true;
  }
  
  // 隐藏加载
  function hideLoading() {
    loadingOverlay.classList.add('hidden');
    analyzeBtn.disabled = false;
  }
  
  // 初始化历史记录
  function initHistory() {
    renderHistory();
    
    // 监听历史记录变化
    stateManager.subscribe('history', () => {
      renderHistory();
    });
    
    // 清空历史
    clearHistoryBtn.addEventListener('click', () => {
      if (confirm('确定要清空所有历史记录吗？')) {
        stateManager.set('history', []);
      }
    });
  }
  
  // 渲染历史记录
  function renderHistory() {
    const history = stateManager.get('history');
    
    if (history.length === 0) {
      historyList.innerHTML = '<p class="no-history">暂无历史记录</p>';
      return;
    }
    
    historyList.innerHTML = history.map(item => `
      <div class="history-item" data-id="${item.id}">
        <div class="history-info">
          <div class="history-name">${escapeHtml(item.name)}</div>
          <div class="history-date">${formatDate(item.createdAt)}</div>
        </div>
        <div class="history-actions">
          <button class="history-btn load" title="加载">→</button>
          <button class="history-btn delete" title="删除">×</button>
        </div>
      </div>
    `).join('');
    
    // 绑定历史记录事件
    historyList.querySelectorAll('.history-item').forEach(item => {
      const id = item.dataset.id;
      const historyItem = history.find(h => h.id === id);
      
      // 点击加载
      item.addEventListener('click', (e) => {
        if (!e.target.closest('.history-btn')) {
          loadHistoryItem(historyItem);
        }
      });
      
      // 加载按钮
      item.querySelector('.history-btn.load').addEventListener('click', () => {
        loadHistoryItem(historyItem);
      });
      
      // 删除按钮
      item.querySelector('.history-btn.delete').addEventListener('click', () => {
        stateManager.removeHistory(id);
      });
    });
  }
  
  // 加载历史记录项
  function loadHistoryItem(item) {
    stateManager.set('currentBazi', item.baziData);
    window.location.href = 'index.html';
  }
  
  // 转义HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  // 格式化日期
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  // 启动
  init();
})();
