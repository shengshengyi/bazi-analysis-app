// 前端应用逻辑

// 状态管理
const state = {
  inputType: 'solar',
  baziData: null,
  analysisReport: null,
  chart: null
};

// DOM 元素
const elements = {
  // 输入
  solarDate: document.getElementById('solar-date'),
  solarTime: document.getElementById('solar-time'),
  lunarYear: document.getElementById('lunar-year'),
  lunarMonth: document.getElementById('lunar-month'),
  lunarDay: document.getElementById('lunar-day'),
  lunarHour: document.getElementById('lunar-hour'),
  lunarLeap: document.getElementById('lunar-leap'),
  genderRadios: document.querySelectorAll('input[name="gender"]'),
  useTrueSolar: document.getElementById('use-true-solar'),
  longitude: document.getElementById('longitude'),
  analyzeBtn: document.getElementById('analyze-btn'),

  // 切换按钮
  toggleBtns: document.querySelectorAll('.toggle-btn'),
  solarInput: document.getElementById('solar-input'),
  lunarInput: document.getElementById('lunar-input'),
  longitudeInput: document.getElementById('longitude-input'),

  // 结果区域
  resultSection: document.getElementById('result-section'),
  resultGender: document.getElementById('result-gender'),
  resultSolar: document.getElementById('result-solar'),
  resultLunar: document.getElementById('result-lunar'),
  resultZodiac: document.getElementById('result-zodiac'),
  resultDayMaster: document.getElementById('result-daymaster'),

  // 四柱
  yearStem: document.getElementById('year-stem'),
  monthStem: document.getElementById('month-stem'),
  dayStem: document.getElementById('day-stem'),
  hourStem: document.getElementById('hour-stem'),
  yearShishen: document.getElementById('year-shishen'),
  monthShishen: document.getElementById('month-shishen'),
  dayShishen: document.getElementById('day-shishen'),
  hourShishen: document.getElementById('hour-shishen'),
  yearBranch: document.getElementById('year-branch'),
  monthBranch: document.getElementById('month-branch'),
  dayBranch: document.getElementById('day-branch'),
  hourBranch: document.getElementById('hour-branch'),
  yearHidden: document.getElementById('year-hidden'),
  monthHidden: document.getElementById('month-hidden'),
  dayHidden: document.getElementById('day-hidden'),
  hourHidden: document.getElementById('hour-hidden'),

  // 神煞
  shenshaList: document.getElementById('shensha-list'),

  // 大运
  dayunStart: document.getElementById('dayun-start'),
  dayunTable: document.querySelector('#dayun-table tbody'),

  // 分析
  dimensionsList: document.getElementById('dimensions-list'),
  adviceList: document.getElementById('advice-list')
};

// 初始化
function init() {
  bindEvents();
  console.log('八字分析应用已初始化');
}

// 绑定事件
function bindEvents() {
  // 输入类型切换
  elements.toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      state.inputType = type;

      elements.toggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (type === 'solar') {
        elements.solarInput.classList.remove('hidden');
        elements.lunarInput.classList.add('hidden');
      } else {
        elements.solarInput.classList.add('hidden');
        elements.lunarInput.classList.remove('hidden');
      }
    });
  });

  // 真太阳时开关
  elements.useTrueSolar.addEventListener('change', (e) => {
    if (e.target.checked) {
      elements.longitudeInput.classList.remove('hidden');
    } else {
      elements.longitudeInput.classList.add('hidden');
    }
  });

  // 分析按钮
  elements.analyzeBtn.addEventListener('click', handleAnalyze);
}

// 获取选中的分析维度
function getSelectedDimensions() {
  const checkboxes = document.querySelectorAll('.dim-checkbox:checked');
  return Array.from(checkboxes).map(cb => cb.value);
}

// 获取选中的性别
function getSelectedGender() {
  for (const radio of elements.genderRadios) {
    if (radio.checked) {
      return radio.value;
    }
  }
  return 'male';
}

// 处理分析请求
async function handleAnalyze() {
  const btnText = elements.analyzeBtn.querySelector('.btn-text');
  const btnLoading = elements.analyzeBtn.querySelector('.btn-loading');

  btnText.classList.add('hidden');
  btnLoading.classList.remove('hidden');
  elements.analyzeBtn.disabled = true;

  try {
    // 构建请求参数
    const request = buildRequest();
    const dimensions = getSelectedDimensions();

    console.log('分析请求:', request);

    // 调用快速分析API
    const response = await fetch('/api/analyze/quick', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || '分析失败');
    }

    state.baziData = result.data.bazi;
    state.analysisReport = result.data.report;

    // 显示结果
    displayResults();

  } catch (error) {
    console.error('分析错误:', error);
    alert('分析失败: ' + error.message);
  } finally {
    btnText.classList.remove('hidden');
    btnLoading.classList.add('hidden');
    elements.analyzeBtn.disabled = false;
  }
}

// 构建请求参数
function buildRequest() {
  const gender = getSelectedGender();
  const useTrueSolar = elements.useTrueSolar.checked;
  const longitude = useTrueSolar ? parseFloat(elements.longitude.value) : undefined;

  if (state.inputType === 'solar') {
    return {
      inputType: 'solar',
      solarDate: elements.solarDate.value,
      solarTime: elements.solarTime.value,
      gender,
      useTrueSolarTime: useTrueSolar,
      longitude
    };
  } else {
    return {
      inputType: 'lunar',
      lunarYear: parseInt(elements.lunarYear.value),
      lunarMonth: parseInt(elements.lunarMonth.value),
      lunarDay: parseInt(elements.lunarDay.value),
      lunarHour: parseInt(elements.lunarHour.value),
      isLeapMonth: elements.lunarLeap.checked,
      gender,
      useTrueSolarTime: false
    };
  }
}

// 显示结果
function displayResults() {
  const { baziData, analysisReport } = state;

  // 显示结果区域
  elements.resultSection.classList.remove('hidden');

  // 基本信息
  elements.resultGender.textContent = baziData.gender;
  elements.resultSolar.textContent = baziData.solarDatetime;
  elements.resultLunar.textContent = baziData.lunarDatetime;
  elements.resultZodiac.textContent = baziData.zodiac;
  elements.resultDayMaster.textContent = `${baziData.dayMaster} (${getElementOfStem(baziData.dayMaster)})`;

  // 四柱
  displayPillars(baziData.pillars);

  // 神煞
  displayShenSha(baziData.shenSha);

  // 大运
  displayDaYun(baziData.daYun);

  // 五维分析
  displayAnalysis(analysisReport);

  // 暴露数据给AI模块
  window.appState = { baziData, analysisReport };
  if (window.setAIBaziData) {
    window.setAIBaziData(baziData);
  }

  // 滚动到结果区域
  elements.resultSection.scrollIntoView({ behavior: 'smooth' });
}

// 显示四柱
function displayPillars(pillars) {
  // 天干
  elements.yearStem.textContent = pillars.year.stem.name;
  elements.monthStem.textContent = pillars.month.stem.name;
  elements.dayStem.textContent = pillars.day.stem.name;
  elements.hourStem.textContent = pillars.hour.stem.name;

  // 十神
  elements.yearShishen.textContent = pillars.year.stem.shiShen || '-';
  elements.monthShishen.textContent = pillars.month.stem.shiShen || '-';
  elements.dayShishen.textContent = '日主';
  elements.hourShishen.textContent = pillars.hour.stem.shiShen || '-';

  // 地支
  elements.yearBranch.textContent = pillars.year.branch.name;
  elements.monthBranch.textContent = pillars.month.branch.name;
  elements.dayBranch.textContent = pillars.day.branch.name;
  elements.hourBranch.textContent = pillars.hour.branch.name;

  // 藏干
  elements.yearHidden.textContent = formatHiddenStems(pillars.year.branch.hiddenStems);
  elements.monthHidden.textContent = formatHiddenStems(pillars.month.branch.hiddenStems);
  elements.dayHidden.textContent = formatHiddenStems(pillars.day.branch.hiddenStems);
  elements.hourHidden.textContent = formatHiddenStems(pillars.hour.branch.hiddenStems);

  // 设置五行颜色
  setElementColor(elements.yearStem, pillars.year.stem.element);
  setElementColor(elements.monthStem, pillars.month.stem.element);
  setElementColor(elements.dayStem, pillars.day.stem.element);
  setElementColor(elements.hourStem, pillars.hour.stem.element);
  setElementColor(elements.yearBranch, pillars.year.branch.element);
  setElementColor(elements.monthBranch, pillars.month.branch.element);
  setElementColor(elements.dayBranch, pillars.day.branch.element);
  setElementColor(elements.hourBranch, pillars.hour.branch.element);
}

// 格式化藏干
function formatHiddenStems(hiddenStems) {
  if (!hiddenStems || hiddenStems.length === 0) return '-';
  return hiddenStems.map(h => `${h.name}(${h.shiShen})`).join('\n');
}

// 设置五行颜色
function setElementColor(element, wuxing) {
  const colors = {
    '木': 'green',
    '火': 'red',
    '土': 'orange',
    '金': 'gold',
    '水': 'blue'
  };
  element.style.color = colors[wuxing] || 'inherit';
}

// 获取天干五行
function getElementOfStem(stem) {
  const map = {
    '甲': '木', '乙': '木',
    '丙': '火', '丁': '火',
    '戊': '土', '己': '土',
    '庚': '金', '辛': '金',
    '壬': '水', '癸': '水'
  };
  return map[stem] || '';
}

// 显示神煞
function displayShenSha(shenSha) {
  const allShenSha = [
    ...shenSha.year.map(s => `年:${s}`),
    ...shenSha.month.map(s => `月:${s}`),
    ...shenSha.day.map(s => `日:${s}`),
    ...shenSha.hour.map(s => `时:${s}`)
  ];

  elements.shenshaList.innerHTML = allShenSha.map(s =>
    `<span class="tag">${s}</span>`
  ).join('');
}

// 显示大运
function displayDaYun(daYun) {
  elements.dayunStart.innerHTML = `
    <p>起运年龄: <strong>${daYun.startAge}</strong>岁</p>
    <p>起运日期: ${daYun.startDate}</p>
  `;

  elements.dayunTable.innerHTML = daYun.cycles.map(cycle => `
    <tr>
      <td class="ganzhi">${cycle.ganZhi}</td>
      <td>${cycle.startAge}-${cycle.endAge}岁</td>
      <td>${cycle.startYear}-${cycle.endYear}</td>
      <td>${cycle.stemShiShen}</td>
    </tr>
  `).join('');
}

// 显示分析结果
function displayAnalysis(report) {
  const dims = report.dimensions;

  // 渲染雷达图
  renderRadarChart(dims);

  // 渲染各维度详情
  const dimNames = {
    career: { name: '职业', icon: '' },
    wealth: { name: '财富', icon: '' },
    fortune: { name: '运势', icon: '' },
    personality: { name: '性格', icon: '' },
    health: { name: '健康', icon: '' }
  };

  elements.dimensionsList.innerHTML = Object.entries(dims).map(([key, dim]) => `
    <div class="dimension-card">
      <div class="dim-header">
        <h4>${dimNames[key].name}</h4>
        <div class="dim-score">
          <span class="score-value">${dim.score}</span>
          <span class="score-level ${dim.level}">${getLevelText(dim.level)}</span>
        </div>
      </div>
      <p class="dim-analysis">${dim.analysis}</p>
      <div class="dim-keywords">
        ${dim.keywords.map(k => `<span class="keyword">${k}</span>`).join('')}
      </div>
      <div class="dim-details">
        <div class="detail-section">
          <h5>机遇</h5>
          <ul>${dim.opportunities.map(o => `<li>${o}</li>`).join('')}</ul>
        </div>
        <div class="detail-section">
          <h5>挑战</h5>
          <ul>${dim.challenges.map(c => `<li>${c}</li>`).join('')}</ul>
        </div>
      </div>
    </div>
  `).join('');

  // 显示建议
  elements.adviceList.innerHTML = report.advice.map(a => `<li>${a}</li>`).join('');
}

// 获取等级文字
function getLevelText(level) {
  const map = {
    'excellent': '优秀',
    'good': '良好',
    'average': '一般',
    'weak': '需努力'
  };
  return map[level] || level;
}

// 渲染雷达图
function renderRadarChart(dims) {
  const ctx = document.getElementById('radar-chart').getContext('2d');

  if (state.chart) {
    state.chart.destroy();
  }

  state.chart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['职业', '财富', '运势', '性格', '健康'],
      datasets: [{
        label: '五维评分',
        data: [
          dims.career.score,
          dims.wealth.score,
          dims.fortune.score,
          dims.personality.score,
          dims.health.score
        ],
        backgroundColor: 'rgba(139, 90, 43, 0.2)',
        borderColor: 'rgba(139, 90, 43, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(139, 90, 43, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(139, 90, 43, 1)'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          beginAtZero: true,
          max: 10,
          min: 0,
          ticks: {
            stepSize: 2
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

// 启动应用
document.addEventListener('DOMContentLoaded', init);
