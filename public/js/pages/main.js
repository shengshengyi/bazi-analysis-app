/**
 * 主页面逻辑
 * 处理八字排盘结果的展示和交互
 */

(function() {
  // DOM元素
  const resultSection = document.getElementById('result-section');
  const backBtn = document.getElementById('back-btn');

  // 五行颜色映射
  const wuXingColors = {
    '木': '#4CAF50',
    '火': '#F44336', 
    '土': '#FF9800',
    '金': '#FFD700',
    '水': '#2196F3'
  };

  // 天干五行
  const ganWuXing = {
    '甲': '木', '乙': '木',
    '丙': '火', '丁': '火',
    '戊': '土', '己': '土',
    '庚': '金', '辛': '金',
    '壬': '水', '癸': '水'
  };

  // 地支五行
  const zhiWuXing = {
    '寅': '木', '卯': '木',
    '巳': '火', '午': '火',
    '辰': '土', '戌': '土', '丑': '土', '未': '土',
    '申': '金', '酉': '金',
    '亥': '水', '子': '水'
  };

  // 初始化
  function init() {
    // 检查是否有八字数据
    const baziData = stateManager.get('currentBazi');

    if (!baziData) {
      // 没有数据，重定向到入口页面
      window.location.href = 'entry.html';
      return;
    }

    // 显示结果区域
    resultSection.classList.remove('hidden');

    // 初始化八字展示
    initBaziDisplay(baziData);

    // 初始化雷达图
    initRadarChart(baziData);

    // 初始化大运表格
    initDayunTable(baziData);

    // 初始化神煞
    initShenSha(baziData);

    // 初始化纳音
    initNaYin(baziData);

    // 初始化命宫身宫
    initPalace(baziData);

    // 初始化分析卡片
    initAnalysisCards(baziData);

    // 初始化悬浮AI面板
    initFloatingAI(baziData);

    // 绑定事件
    bindEvents();
  }

  // 获取五行颜色
  function getWuXingColor(char) {
    const wuXing = ganWuXing[char] || zhiWuXing[char];
    return wuXing ? wuXingColors[wuXing] : '#333';
  }

  // 初始化八字展示
  function initBaziDisplay(baziData) {
    const container = document.getElementById('bazi-display');
    if (!container) return;

    // 获取四柱数据
    const pillars = baziData.pillars || {};
    const dayMaster = baziData.dayMaster || '';
    const gender = baziData.gender || '';
    const solarDate = baziData.solarDatetime || '';
    const lunarDate = baziData.lunarDatetime || '';
    const zodiac = baziData.zodiac || '';

    // 提取干支名称和五行
    const getStemInfo = (pillar) => {
      if (!pillar || !pillar.stem) return { name: '', element: '' };
      const name = pillar.stem.name || pillar.stem['天干'] || '';
      const element = pillar.stem.element || pillar.stem['五行'] || ganWuXing[name] || '';
      return { name, element };
    };

    const getBranchInfo = (pillar) => {
      if (!pillar || !pillar.branch) return { name: '', element: '' };
      const name = pillar.branch.name || pillar.branch['地支'] || '';
      const element = pillar.branch.element || pillar.branch['五行'] || zhiWuXing[name] || '';
      return { name, element };
    };

    const getShiShen = (pillar) => {
      if (!pillar || !pillar.stem) return '';
      return pillar.stem.shiShen || pillar.stem['十神'] || '';
    };

    // 获取藏干信息 - 支持多种数据格式
    const getHiddenStems = (pillar) => {
      if (!pillar || !pillar.branch) return [];
      
      const hiddenStems = pillar.branch.hiddenStems || pillar.branch['藏干'];
      if (!hiddenStems) return [];
      
      // 如果已经是数组格式，直接返回
      if (Array.isArray(hiddenStems)) {
        return hiddenStems.map(h => ({
          name: h.name || h['天干'] || '',
          shiShen: h.shiShen || h['十神'] || ''
        })).filter(h => h.name);
      }
      
      // 如果是对象格式 { '主气': {...}, '中气': {...}, '余气': {...} }
      const stems = [];
      const order = ['主气', '中气', '余气'];
      order.forEach(type => {
        const gan = hiddenStems[type];
        if (gan) {
          stems.push({
            name: gan['天干'] || gan.name || '',
            shiShen: gan['十神'] || gan.shiShen || ''
          });
        }
      });
      return stems;
    };

    // 构建四柱信息
    const yearInfo = { stem: getStemInfo(pillars.year), branch: getBranchInfo(pillars.year) };
    const monthInfo = { stem: getStemInfo(pillars.month), branch: getBranchInfo(pillars.month) };
    const dayInfo = { stem: getStemInfo(pillars.day), branch: getBranchInfo(pillars.day) };
    const hourInfo = { stem: getStemInfo(pillars.hour), branch: getBranchInfo(pillars.hour) };

    // 渲染八字表格
    container.innerHTML = `
      <div class="bazi-result">
        <div class="bazi-info">
          <div class="info-row">
            <span class="label">性别:</span> <span class="value">${gender}</span>
            <span class="label">日主:</span> <span class="value highlight">${dayMaster}</span>
            <span class="label">生肖:</span> <span class="value">${zodiac}</span>
          </div>
          <div class="info-row">
            <span class="label">阳历:</span> <span class="value">${solarDate}</span>
          </div>
          <div class="info-row">
            <span class="label">农历:</span> <span class="value">${lunarDate}</span>
          </div>
        </div>
        
        <div class="bazi-table">
          <div class="table-row header">
            <span class="cell"></span>
            <span class="cell">年柱</span>
            <span class="cell">月柱</span>
            <span class="cell">日柱</span>
            <span class="cell">时柱</span>
          </div>
          <div class="table-row">
            <span class="cell label">天干</span>
            <span class="cell stem" style="color:${getWuXingColor(yearInfo.stem.name)};font-weight:bold">${yearInfo.stem.name}</span>
            <span class="cell stem" style="color:${getWuXingColor(monthInfo.stem.name)};font-weight:bold">${monthInfo.stem.name}</span>
            <span class="cell stem day-master" style="color:${getWuXingColor(dayInfo.stem.name)};font-weight:bold">${dayInfo.stem.name}</span>
            <span class="cell stem" style="color:${getWuXingColor(hourInfo.stem.name)};font-weight:bold">${hourInfo.stem.name}</span>
          </div>
          <div class="table-row">
            <span class="cell label">十神</span>
            <span class="cell">${getShiShen(pillars.year)}</span>
            <span class="cell">${getShiShen(pillars.month)}</span>
            <span class="cell">日主</span>
            <span class="cell">${getShiShen(pillars.hour)}</span>
          </div>
          <div class="table-row">
            <span class="cell label">地支</span>
            <span class="cell branch" style="color:${getWuXingColor(yearInfo.branch.name)};font-weight:bold">${yearInfo.branch.name}</span>
            <span class="cell branch" style="color:${getWuXingColor(monthInfo.branch.name)};font-weight:bold">${monthInfo.branch.name}</span>
            <span class="cell branch" style="color:${getWuXingColor(dayInfo.branch.name)};font-weight:bold">${dayInfo.branch.name}</span>
            <span class="cell branch" style="color:${getWuXingColor(hourInfo.branch.name)};font-weight:bold">${hourInfo.branch.name}</span>
          </div>
          <div class="table-row hidden-stems-row">
            <span class="cell label">藏干</span>
            <span class="cell">${formatHiddenStems(getHiddenStems(pillars.year))}</span>
            <span class="cell">${formatHiddenStems(getHiddenStems(pillars.month))}</span>
            <span class="cell">${formatHiddenStems(getHiddenStems(pillars.day))}</span>
            <span class="cell">${formatHiddenStems(getHiddenStems(pillars.hour))}</span>
          </div>
        </div>
      </div>
    `;
  }

  // 格式化藏干
  function formatHiddenStems(stems) {
    if (!stems || stems.length === 0) return '-';
    return stems.map(s => `<span style="color:${getWuXingColor(s.name)};font-weight:bold">${s.name}</span><small>(${s.shiShen})</small>`).join('<br>');
  }

  // 初始化雷达图
  function initRadarChart(baziData) {
    const canvas = document.getElementById('radar-chart');
    if (!canvas) return;

    // 模拟五维数据
    const dimensionsData = {
      career: { score: 75, keywords: ['稳定', '上升'] },
      wealth: { score: 68, keywords: ['积累', '稳健'] },
      fortune: { score: 82, keywords: ['顺遂', '机遇'] },
      personality: { score: 70, keywords: ['坚韧', '务实'] },
      health: { score: 65, keywords: ['注意', '调养'] }
    };

    // 使用 Chart.js 绘制雷达图
    if (typeof Chart !== 'undefined') {
      new Chart(canvas, {
        type: 'radar',
        data: {
          labels: ['事业', '财富', '运势', '性格', '健康'],
          datasets: [{
            label: '五维分析',
            data: [
              dimensionsData.career.score,
              dimensionsData.wealth.score,
              dimensionsData.fortune.score,
              dimensionsData.personality.score,
              dimensionsData.health.score
            ],
            backgroundColor: 'rgba(139, 69, 19, 0.2)',
            borderColor: 'rgba(139, 69, 19, 1)',
            borderWidth: 2
          }]
        },
        options: {
          scales: {
            r: {
              beginAtZero: true,
              max: 100
            }
          }
        }
      });
    }

    // 渲染维度卡片
    renderDimensionCards(dimensionsData);
  }

  // 渲染维度卡片
  function renderDimensionCards(data) {
    const container = document.getElementById('dimensions-list');
    if (!container) return;

    const dimensions = [
      { key: 'career', name: '事业', icon: '💼' },
      { key: 'wealth', name: '财富', icon: '💰' },
      { key: 'fortune', name: '运势', icon: '🍀' },
      { key: 'personality', name: '性格', icon: '🧠' },
      { key: 'health', name: '健康', icon: '❤️' }
    ];

    container.innerHTML = dimensions.map(dim => {
      const score = data[dim.key]?.score || 0;
      const keywords = data[dim.key]?.keywords || [];

      return `
        <div class="dimension-card" data-dimension="${dim.key}">
          <div class="dimension-header">
            <span class="dimension-icon">${dim.icon}</span>
            <span class="dimension-name">${dim.name}</span>
            <span class="dimension-score">${score}分</span>
          </div>
          <div class="dimension-keywords">
            ${keywords.map(k => `<span class="keyword">${k}</span>`).join('')}
          </div>
        </div>
      `;
    }).join('');

    // 绑定点击事件 - 调用API获取详细分析
    container.querySelectorAll('.dimension-card').forEach(card => {
      card.addEventListener('click', async () => {
        const dimensionKey = card.dataset.dimension;
        const baziData = stateManager.get('currentBazi');
        if (!baziData) return;

        // 显示加载中
        const dimensionName = dimensions.find(d => d.key === dimensionKey)?.name || dimensionKey;
        
        modalManager.open({
          title: `${dimensionName}分析`,
          content: '<div class="modal-loading">分析中...</div>',
          width: '600px'
        });

        try {
          // 调用API获取分析
          const result = await api.analyzeFiveDimensions(baziData);
          
          if (result.success && result.data && result.data.dimensions && result.data.dimensions[dimensionKey]) {
            const analysis = result.data.dimensions[dimensionKey];
            showDimensionAnalysis(dimensionKey, dimensionName, analysis);
          } else {
            showDimensionFallback(dimensionKey, dimensionName, data[dimensionKey]);
          }
        } catch (error) {
          console.error('分析API调用失败:', error);
          showDimensionFallback(dimensionKey, dimensionName, data[dimensionKey]);
        }
      });
    });
  }

  // 显示维度分析结果
  function showDimensionAnalysis(key, name, analysis) {
    const levelColors = {
      'excellent': '#4CAF50',
      'good': '#8BC34A',
      'average': '#FF9800',
      'weak': '#F44336'
    };
    
    const levelText = {
      'excellent': '优秀',
      'good': '良好',
      'average': '一般',
      'weak': '较弱'
    };

    const level = analysis.level || 'average';
    const score = analysis.score || 0;
    const keywords = analysis.keywords || [];
    const opportunities = analysis.opportunities || [];
    const challenges = analysis.challenges || [];
    const analysisText = analysis.analysis || '';

    let html = `
      <div class="dimension-analysis">
        <div class="dimension-score-header">
          <span class="dimension-score-large" style="color: ${levelColors[level]}">${score}分</span>
          <span class="dimension-level" style="color: ${levelColors[level]}">${levelText[level]}</span>
        </div>
        ${analysisText ? `<div class="dimension-text">${analysisText}</div>` : ''}
        
        ${keywords.length > 0 ? `
          <div class="dimension-section">
            <h4>关键词</h4>
            <div class="dimension-tags">
              ${keywords.map(k => `<span class="dimension-tag">${k}</span>`).join('')}
            </div>
          </div>
        ` : ''}
        
        ${opportunities.length > 0 ? `
          <div class="dimension-section">
            <h4>优势</h4>
            <ul class="dimension-list">
              ${opportunities.map(o => `<li>${o}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        
        ${challenges.length > 0 ? `
          <div class="dimension-section">
            <h4>需要注意</h4>
            <ul class="dimension-list challenge">
              ${challenges.map(c => `<li>${c}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;

    modalManager.open({
      title: `${name}分析详情`,
      content: html,
      width: '600px'
    });
  }

  // 显示备用信息（当API调用失败时）
  function showDimensionFallback(key, name, data) {
    const score = data?.score || 0;
    const keywords = data?.keywords || [];

    let html = `
      <div class="dimension-analysis">
        <div class="dimension-score-header">
          <span class="dimension-score-large">${score}分</span>
        </div>
        
        ${keywords.length > 0 ? `
          <div class="dimension-section">
            <h4>关键词</h4>
            <div class="dimension-tags">
              ${keywords.map(k => `<span class="dimension-tag">${k}</span>`).join('')}
            </div>
          </div>
        ` : ''}
        
        <div class="dimension-section">
          <p>点击"AI解盘"按钮，询问关于${name}的详细分析</p>
        </div>
      </div>
    `;

    modalManager.open({
      title: `${name}分析`,
      content: html,
      width: '500px'
    });
  }

  // 初始化大运表格
  function initDayunTable(baziData) {
    const table = document.getElementById('dayun-table');
    const startInfo = document.getElementById('dayun-start');

    if (!table) return;

    const daYun = baziData.daYun || baziData.dayun || {};

    // 显示起运信息
    if (startInfo) {
      startInfo.innerHTML = `
        <p><strong>起运年龄:</strong> ${daYun.startAge || '-'}岁</p>
        <p><strong>起运日期:</strong> ${daYun.startDate || '-'}</p>
      `;
    }

    // 填充大运表格
    const tbody = table.querySelector('tbody');
    if (tbody) {
      const cycles = daYun.cycles || [];
      if (cycles.length > 0) {
        tbody.innerHTML = cycles.map(cycle => `
          <tr>
            <td>${cycle.ganZhi || cycle['干支'] || '-'}</td>
            <td>${cycle.startAge || cycle['开始年龄'] || '-'}-${cycle.endAge || cycle['结束年龄'] || '-'}</td>
            <td>${cycle.startYear || cycle['开始年份'] || '-'}-${cycle.endYear || cycle['结束'] || '-'}</td>
            <td>${cycle.stemShiShen || cycle['天干十神'] || '-'}</td>
          </tr>
        `).join('');
      } else {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#999;">暂无大运数据</td></tr>';
      }
    }
  }

  // 神煞分类定义
  const shenShaCategories = {
    '贵人': ['天乙贵人', '月德贵人', '德秀贵人', '福星贵人', '太极贵人', '国印贵人', '文昌贵人'],
    '桃花': ['桃花', '红鸾', '天喜'],
    '凶煞': ['劫煞', '灾煞', '亡神', '勾绞煞', '孤辰', '寡宿', '六厄', '元辰', '空亡'],
    '其他': ['将星', '华盖', '金舆', '羊刃', '禄神', '魁罡', '驿马', '童子煞', '血刃', '流霞']
  };

  // 获取神煞分类
  function getShenShaCategory(name) {
    for (const [category, list] of Object.entries(shenShaCategories)) {
      if (list.some(s => name.includes(s))) {
        return category;
      }
    }
    return '其他';
  }

  // 初始化神煞 - 按分类有序排列
  function initShenSha(baziData) {
    const container = document.getElementById('shensha-section');
    if (!container) return;

    const shenSha = baziData.shenSha || {};
    
    // 按柱分类收集神煞
    const shenShaByPillar = {
      '年柱': [],
      '月柱': [],
      '日柱': [],
      '时柱': []
    };

    // 收集各柱神煞
    const pillarMap = {
      'year': '年柱',
      'month': '月柱',
      'day': '日柱',
      'hour': '时柱'
    };

    Object.entries(pillarMap).forEach(([key, label]) => {
      const pillarShenSha = shenSha[key] || shenSha[label];
      if (Array.isArray(pillarShenSha)) {
        pillarShenSha.forEach(name => {
          if (!shenShaByPillar[label].some(s => s.name === name)) {
            shenShaByPillar[label].push({
              name,
              category: getShenShaCategory(name)
            });
          }
        });
      }
    });

    // 分类颜色
    const categoryColors = {
      '贵人': '#4CAF50',  // 绿色 - 吉
      '桃花': '#E91E63',  // 粉色 - 桃花
      '凶煞': '#F44336',  // 红色 - 凶
      '其他': '#8B4513'   // 棕色 - 中性
    };

    // 渲染神煞 - 按柱分组显示
    let html = '<div class="shensha-container">';
    
    Object.entries(shenShaByPillar).forEach(([pillar, list]) => {
      if (list.length === 0) return;
      
      // 按分类排序
      const order = ['贵人', '桃花', '凶煞', '其他'];
      list.sort((a, b) => {
        const orderA = order.indexOf(a.category);
        const orderB = order.indexOf(b.category);
        return orderA - orderB;
      });

      html += `
        <div class="shensha-pillar-group">
          <span class="shensha-pillar-label">${pillar}</span>
          <div class="shensha-tags">
            ${list.map(s => `
              <span class="shensha-tag" style="background: ${categoryColors[s.category]}" title="${s.category}">
                ${s.name}
              </span>
            `).join('')}
          </div>
        </div>
      `;
    });

    html += '</div>';

    // 如果没有神煞数据
    const hasShenSha = Object.values(shenShaByPillar).some(list => list.length > 0);
    if (!hasShenSha) {
      html = '<p style="color:#999;">暂无神煞数据</p>';
    }

    container.innerHTML = html;
  }

  // 初始化纳音
  function initNaYin(baziData) {
    const container = document.getElementById('nayin-section');
    if (!container) return;

    const pillars = baziData.pillars || {};
    const nayinList = [];

    ['year', 'month', 'day', 'hour'].forEach(pillar => {
      const p = pillars[pillar];
      if (p && p.naYin) {
        nayinList.push({ pillar: pillar === 'year' ? '年' : pillar === 'month' ? '月' : pillar === 'day' ? '日' : '时', nayin: p.naYin });
      }
    });

    if (nayinList.length > 0) {
      container.innerHTML = `
        <div class="nayin-list">
          ${nayinList.map(n => `<span class="nayin-tag">${n.pillar}柱: ${n.nayin}</span>`).join('')}
        </div>
      `;
    } else {
      container.innerHTML = '<p style="color:#999;">暂无纳音数据</p>';
    }
  }

  // 初始化命宫身宫
  function initPalace(baziData) {
    const container = document.getElementById('palace-section');
    if (!container) return;

    const lifePalace = baziData.lifePalace || '';
    const bodyPalace = baziData.bodyPalace || '';

    if (lifePalace || bodyPalace) {
      container.innerHTML = `
        <div class="palace-info">
          ${lifePalace ? `<p><strong>命宫:</strong> ${lifePalace}</p>` : ''}
          ${bodyPalace ? `<p><strong>身宫:</strong> ${bodyPalace}</p>` : ''}
        </div>
      `;
    } else {
      container.innerHTML = '<p style="color:#999;">暂无命宫身宫数据</p>';
    }
  }

  // 初始化分析卡片
  function initAnalysisCards(baziData) {
    const adviceList = document.getElementById('advice-list');
    if (!adviceList) return;

    const dayMaster = baziData.dayMaster || '';
    const wuXing = ganWuXing[dayMaster] || '';
    
    const advices = [
      `日主为${dayMaster}(${wuXing})，${getDayMasterDescription(dayMaster)}`,
      '建议结合实际情况，理性看待命理分析',
      '运势会随时间变化，保持积极心态很重要'
    ];

    adviceList.innerHTML = advices.map(a => `<li>${a}</li>`).join('');
  }

  // 获取日主描述
  function getDayMasterDescription(dayMaster) {
    const descriptions = {
      '甲': '为阳木，如参天大树，性格刚直，有领导才能',
      '乙': '为阴木，如花草藤蔓，性格柔和，善于适应',
      '丙': '为阳火，如太阳之光，性格热情，光明磊落',
      '丁': '为阴火，如灯烛之光，性格温和，心思细腻',
      '戊': '为阳土，如城墙之土，性格稳重，诚实守信',
      '己': '为阴土，如田园之土，性格包容，善于谋划',
      '庚': '为阳金，如刀剑之金，性格刚毅，果断决断',
      '辛': '为阴金，如珠玉之金，性格精致，追求完美',
      '壬': '为阳水，如江河之水，性格智慧，善于变通',
      '癸': '为阴水，如雨露之水，性格温柔，善于思考'
    };
    return descriptions[dayMaster] || '性格特点与五行属性相关';
  }

  // 初始化悬浮AI面板
  function initFloatingAI(baziData) {
    const container = document.getElementById('ai-floating-container');
    if (!container) return;

    // 流派选项
    const schools = [
      { id: 'wangshuai', name: '旺衰派' },
      { id: 'ziping', name: '子平派' },
      { id: 'geju', name: '格局派' },
      { id: 'blind', name: '盲派' },
      { id: 'xinpai', name: '新派' }
    ];

    // 创建AI悬浮按钮和面板
    container.innerHTML = `
      <div class="ai-float-btn" id="ai-float-btn">
        <span class="ai-icon">🤖</span>
        <span class="ai-text">AI解盘</span>
      </div>
      <div class="ai-panel" id="ai-panel" style="display:none;">
        <div class="ai-panel-header">
          <span>AI八字解盘</span>
          <div class="ai-header-actions">
            <button class="ai-config-btn" id="ai-config-btn" title="AI配置">⚙️</button>
            <button class="ai-close" id="ai-close">×</button>
          </div>
        </div>
        <div class="ai-school-selector">
          <select id="ai-school-select">
            ${schools.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
          </select>
          <button class="btn-add-school" id="btn-add-school" title="创建自定义派别">+</button>
        </div>
        <div class="ai-panel-content">
          <div class="ai-messages" id="ai-messages">
            <div class="ai-message system">您好！我是AI八字解盘助手。请向我提问关于八字的问题。</div>
          </div>
          <div class="ai-quick-questions">
            <button class="quick-q" data-q="分析事业发展">事业</button>
            <button class="quick-q" data-q="分析财富运势">财富</button>
            <button class="quick-q" data-q="分析婚姻感情">婚姻</button>
            <button class="quick-q" data-q="分析健康状况">健康</button>
          </div>
          <div class="ai-input-area">
            <input type="text" id="ai-input" placeholder="输入您的问题...">
            <button id="ai-send">发送</button>
          </div>
        </div>
      </div>
      <!-- AI配置弹窗 -->
      <div id="ai-config-modal" class="ai-config-modal" style="display:none;">
        <div class="ai-config-content">
          <div class="ai-config-header">
            <h3>AI配置</h3>
            <button class="ai-config-close" id="ai-config-close">×</button>
          </div>
          <div class="ai-config-body">
            <div class="config-group">
              <label>AI提供商</label>
              <select id="ai-provider">
                <option value="openai">OpenAI</option>
                <option value="deepseek">DeepSeek</option>
                <option value="qwen">通义千问</option>
                <option value="qwen-coding">通义千问(Coding)</option>
                <option value="anthropic">Claude</option>
              </select>
            </div>
            <div class="config-group">
              <label>API Key</label>
              <input type="password" id="ai-apikey" placeholder="输入API Key">
              <small class="api-help">请输入您的API Key</small>
            </div>
            <div class="config-group">
              <label>模型</label>
              <select id="ai-model">
                <option value="gpt-4o-mini">GPT-4o Mini (推荐)</option>
                <option value="gpt-4o">GPT-4o</option>
              </select>
            </div>
            <div class="config-group">
              <label>Temperature: <span id="temp-value">0.7</span></label>
              <input type="range" id="ai-temperature" min="0" max="1" step="0.1" value="0.7">
            </div>
          </div>
          <div class="ai-config-footer">
            <button class="btn-save" id="ai-config-save">保存配置</button>
          </div>
        </div>
      </div>
      <!-- 自定义派别弹窗 -->
      <div id="custom-school-modal" class="ai-config-modal" style="display:none;">
        <div class="ai-config-content">
          <div class="ai-config-header">
            <h3 id="custom-school-title">创建自定义派别</h3>
            <button class="ai-config-close" id="custom-school-close">×</button>
          </div>
          <div class="ai-config-body">
            <input type="hidden" id="custom-school-id" value="">
            <div class="config-group">
              <label>派别名称</label>
              <input type="text" id="custom-school-name" placeholder="例如：我的派别">
            </div>
            <div class="config-group">
              <label>描述</label>
              <textarea id="custom-school-desc" rows="2" placeholder="简单描述这个派别的特点"></textarea>
            </div>
            <div class="config-group">
              <label>分析侧重点</label>
              <select id="custom-school-emphasis">
                <option value="wangshuai">旺衰</option>
                <option value="ziping">子平</option>
                <option value="blind">盲派</option>
                <option value="geju">格局</option>
                <option value="xinpai">新派</option>
              </select>
            </div>
            <div class="config-group">
              <label>语气风格</label>
              <select id="custom-school-tone">
                <option value="professional">专业严谨</option>
                <option value="casual">通俗易懂</option>
                <option value="poetic">诗意优美</option>
              </select>
            </div>
            <div class="config-group">
              <label>详细程度</label>
              <select id="custom-school-detail">
                <option value="brief">简洁</option>
                <option value="standard" selected>标准</option>
                <option value="detailed">详细</option>
              </select>
            </div>
          </div>
          <div class="ai-config-footer">
            <button class="btn-delete" id="btn-delete-school" style="display:none;background:#F44336;">删除</button>
            <button class="btn-save" id="btn-save-school">保存派别</button>
          </div>
        </div>
      </div>
    `;

    // 绑定事件
    const floatBtn = document.getElementById('ai-float-btn');
    const aiPanel = document.getElementById('ai-panel');
    const aiClose = document.getElementById('ai-close');
    const aiSend = document.getElementById('ai-send');
    const aiInput = document.getElementById('ai-input');
    const aiMessages = document.getElementById('ai-messages');
    const aiSchoolSelect = document.getElementById('ai-school-select');
    const aiConfigBtn = document.getElementById('ai-config-btn');
    const aiConfigModal = document.getElementById('ai-config-modal');
    const aiConfigClose = document.getElementById('ai-config-close');
    const aiConfigSave = document.getElementById('ai-config-save');
    const aiProvider = document.getElementById('ai-provider');
    const aiApiKey = document.getElementById('ai-apikey');
    const aiModel = document.getElementById('ai-model');
    const aiTemp = document.getElementById('ai-temperature');
    const tempValue = document.getElementById('temp-value');

    // 加载保存的配置
    loadAIConfig(aiProvider, aiApiKey, aiModel, aiTemp, tempValue);

    floatBtn.addEventListener('click', () => {
      aiPanel.style.display = aiPanel.style.display === 'none' ? 'flex' : 'none';
    });

    aiClose.addEventListener('click', () => {
      aiPanel.style.display = 'none';
    });

    // 配置弹窗事件
    aiConfigBtn.addEventListener('click', () => {
      aiConfigModal.style.display = aiConfigModal.style.display === 'none' ? 'flex' : 'none';
    });

    aiConfigClose.addEventListener('click', () => {
      aiConfigModal.style.display = 'none';
    });

    aiConfigSave.addEventListener('click', async () => {
      const provider = aiProvider.value;
      const apiKey = aiApiKey.value;
      const model = aiModel.value;
      const temperature = parseFloat(aiTemp.value);

      if (!apiKey) {
        alert('请输入API Key');
        return;
      }

      try {
        await api.request('/api/ai/config', {
          method: 'POST',
          body: JSON.stringify({ provider, apiKey, model, temperature })
        });
        alert('配置保存成功！');
        aiConfigModal.style.display = 'none';
      } catch (error) {
        alert('配置保存失败: ' + error.message);
      }
    });

    // 温度滑块
    aiTemp.addEventListener('input', () => {
      tempValue.textContent = aiTemp.value;
    });

    // 提供商切换更新模型
    aiProvider.addEventListener('change', () => {
      updateProviderModels(aiProvider.value, aiModel);
    });

    // 流派切换
    aiSchoolSelect.addEventListener('change', () => {
      const school = aiSchoolSelect.value;
      addSchoolMessage(school);
    });

    // 自定义派别弹窗元素
    const customSchoolModal = document.getElementById('custom-school-modal');
    const customSchoolClose = document.getElementById('custom-school-close');
    const btnAddSchool = document.getElementById('btn-add-school');
    const btnSaveSchool = document.getElementById('btn-save-school');
    const btnDeleteSchool = document.getElementById('btn-delete-school');

    // 加载自定义派别列表
    let customSchools = loadCustomSchools();
    refreshSchoolSelect(aiSchoolSelect, customSchools);

    // 添加自定义派别按钮
    btnAddSchool.addEventListener('click', () => {
      document.getElementById('custom-school-id').value = '';
      document.getElementById('custom-school-title').textContent = '创建自定义派别';
      document.getElementById('custom-school-name').value = '';
      document.getElementById('custom-school-desc').value = '';
      document.getElementById('custom-school-emphasis').value = 'wangshuai';
      document.getElementById('custom-school-tone').value = 'professional';
      document.getElementById('custom-school-detail').value = 'standard';
      btnDeleteSchool.style.display = 'none';
      customSchoolModal.style.display = 'flex';
    });

    // 关闭自定义派别弹窗
    customSchoolClose.addEventListener('click', () => {
      customSchoolModal.style.display = 'none';
    });

    // 保存自定义派别
    btnSaveSchool.addEventListener('click', () => {
      const name = document.getElementById('custom-school-name').value.trim();
      const description = document.getElementById('custom-school-desc').value.trim();
      const emphasis = document.getElementById('custom-school-emphasis').value;
      const tone = document.getElementById('custom-school-tone').value;
      const detail = document.getElementById('custom-school-detail').value;
      const id = document.getElementById('custom-school-id').value;

      if (!name) {
        alert('请输入派别名称');
        return;
      }

      if (id) {
        // 更新现有
        const idx = customSchools.findIndex(s => s.id === id);
        if (idx !== -1) {
          customSchools[idx] = {
            ...customSchools[idx],
            name, description, emphasis, tone, detail
          };
        }
      } else {
        // 创建新的
        const newSchool = {
          id: 'custom-' + Date.now(),
          name,
          description,
          emphasis,
          tone,
          detail,
          isCustom: true
        };
        customSchools.push(newSchool);
      }

      saveCustomSchools(customSchools);
      refreshSchoolSelect(aiSchoolSelect, customSchools);
      aiSchoolSelect.value = id || customSchools[customSchools.length - 1].id;
      customSchoolModal.style.display = 'none';
      addSchoolMessage(aiSchoolSelect.value);
    });

    // 删除自定义派别
    btnDeleteSchool.addEventListener('click', () => {
      const id = document.getElementById('custom-school-id').value;
      if (!id) return;

      if (confirm('确定要删除这个自定义派别吗？')) {
        customSchools = customSchools.filter(s => s.id !== id);
        saveCustomSchools(customSchools);
        refreshSchoolSelect(aiSchoolSelect, customSchools);
        aiSchoolSelect.value = 'wangshuai';
        customSchoolModal.style.display = 'none';
      }
    });

    // 快捷问题
    container.querySelectorAll('.quick-q').forEach(btn => {
      btn.addEventListener('click', () => {
        aiInput.value = btn.dataset.q;
        aiSend.click();
      });
    });

    aiSend.addEventListener('click', async () => {
      const message = aiInput.value.trim();
      if (!message) return;

      const baziData = stateManager.get('currentBazi');
      if (!baziData) {
        alert('请先进行排盘');
        return;
      }

      // 添加用户消息
      const userMsg = document.createElement('div');
      userMsg.className = 'ai-message user';
      userMsg.textContent = message;
      aiMessages.appendChild(userMsg);

      // 添加AI正在输入的提示
      const typingMsg = document.createElement('div');
      typingMsg.className = 'ai-message ai';
      typingMsg.innerHTML = '<em>AI正在分析中...</em>';
      aiMessages.appendChild(typingMsg);
      aiMessages.scrollTop = aiMessages.scrollHeight;

      aiInput.value = '';

      try {
        // 获取当前选中的流派
        const currentSchool = document.getElementById('ai-school-select')?.value || 'wangshuai';
        
        // 获取对话历史
        const history = [];
        aiMessages.querySelectorAll('.ai-message').forEach((msg, idx) => {
          if (idx < aiMessages.children.length - 2 && msg.classList.contains('user')) {
            const nextMsg = aiMessages.children[idx + 1];
            if (nextMsg && nextMsg.classList.contains('ai')) {
              history.push({ role: 'user', content: msg.textContent });
              history.push({ role: 'assistant', content: nextMsg.innerHTML.replace(/<[^>]*>/g, '') });
            }
          }
        });

        // 调用API
        const result = await api.sendAiMessage(baziData, message, currentSchool, history);
        
        // 移除正在输入提示
        aiMessages.removeChild(typingMsg);
        
        // 显示AI回复
        const aiMsg = document.createElement('div');
        aiMsg.className = 'ai-message ai';
        aiMsg.innerHTML = result.data?.message || result.message || '分析完成';
        aiMessages.appendChild(aiMsg);
        aiMessages.scrollTop = aiMessages.scrollHeight;
      } catch (error) {
        console.error('AI对话错误:', error);
        aiMessages.removeChild(typingMsg);
        
        const errorMsg = document.createElement('div');
        errorMsg.className = 'ai-message ai';
        errorMsg.innerHTML = `<strong>分析失败</strong><br>${error.message || '请检查AI配置后重试'}`;
        aiMessages.appendChild(errorMsg);
        aiMessages.scrollTop = aiMessages.scrollHeight;
      }
    });

    aiInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') aiSend.click();
    });
  }

  // 绑定事件
  function bindEvents() {
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        window.location.href = 'entry.html';
      });
    }
  }

  // 全局弹窗打开函数 - 供HTML onclick调用
  window.openModal = function(type) {
    const baziData = stateManager.get('currentBazi');
    if (!baziData) return;

    let title = '';
    let content = '';
    let width = '90%';

    switch(type) {
      case 'shensha':
        title = '神煞详情';
        content = getShenShaDetail(baziData);
        width = '800px';
        break;
      case 'nayin':
        title = '纳音五行';
        content = getNaYinDetail(baziData);
        break;
      case 'palace':
        title = '命宫身宫';
        content = getPalaceDetail(baziData);
        break;
      case 'analysis':
        title = '五维分析详情';
        content = getAnalysisDetail(baziData);
        width = '90%';
        break;
      case 'dayun':
        title = '大运流年';
        content = getDayunDetail(baziData);
        width = '90%';
        break;
      case 'advice':
        title = '综合建议';
        content = getAdviceDetail(baziData);
        break;
      default:
        return;
    }

    modalManager.open({
      title,
      content,
      width
    });
  };

  // 获取神煞详情内容
  function getShenShaDetail(baziData) {
    const shenSha = baziData.shenSha || {};
    let html = '<div class="modal-detail-content">';

    const pillarMap = {
      'year': '年柱',
      'month': '月柱',
      'day': '日柱',
      'hour': '时柱'
    };

    Object.entries(pillarMap).forEach(([key, label]) => {
      const list = shenSha[key] || [];
      if (list.length > 0) {
        html += `<h4>${label}</h4><div class="tags-row">`;
        list.forEach(s => {
          html += `<span class="detail-tag">${s}</span>`;
        });
        html += '</div>';
      }
    });

    html += '</div>';
    return html;
  }

  // 获取纳音详情
  function getNaYinDetail(baziData) {
    const pillars = baziData.pillars || {};
    let html = '<div class="modal-detail-content"><table class="detail-table">';
    html += '<tr><th>柱</th><th>天干</th><th>地支</th><th>纳音</th></tr>';

    const pillarMap = {
      'year': '年柱',
      'month': '月柱',
      'day': '日柱',
      'hour': '时柱'
    };

    Object.entries(pillarMap).forEach(([key, label]) => {
      const p = pillars[key];
      html += `<tr>
        <td>${label}</td>
        <td>${p?.stem?.name || '-'}</td>
        <td>${p?.branch?.name || '-'}</td>
        <td>${p?.naYin || '-'}</td>
      </tr>`;
    });

    html += '</table></div>';
    return html;
  }

  // 获取命宫身宫详情
  function getPalaceDetail(baziData) {
    const lifePalace = baziData.lifePalace || '';
    const bodyPalace = baziData.bodyPalace || '';
    
    let html = '<div class="modal-detail-content">';
    if (lifePalace) {
      html += `<div class="detail-item"><h4>命宫</h4><p>${lifePalace}</p></div>`;
    }
    if (bodyPalace) {
      html += `<div class="detail-item"><h4>身宫</h4><p>${bodyPalace}</p></div>`;
    }
    if (baziData.fetal) {
      if (baziData.fetal.taiYuan) {
        html += `<div class="detail-item"><h4>胎元</h4><p>${baziData.fetal.taiYuan}</p></div>`;
      }
      if (baziData.fetal.taiXi) {
        html += `<div class="detail-item"><h4>胎息</h4><p>${baziData.fetal.taiXi}</p></div>`;
      }
    }
    html += '</div>';
    return html;
  }

  // 获取五维分析详情
  function getAnalysisDetail(baziData) {
    let html = '<div class="modal-detail-content">';
    html += '<p>五维分析包括事业、财富、运势、性格、健康五个维度。</p>';
    html += '<p>点击右侧维度卡片可查看详细分析。</p>';
    html += '</div>';
    return html;
  }

  // 获取大运详情
  function getDayunDetail(baziData) {
    const daYun = baziData.daYun || baziData.dayun || {};
    const cycles = daYun.cycles || [];

    let html = '<div class="modal-detail-content">';
    html += `<div class="detail-item"><h4>起运信息</h4>`;
    html += `<p>起运年龄: ${daYun.startAge || '-'}岁</p>`;
    html += `<p>起运日期: ${daYun.startDate || '-'}</p></div>`;

    if (cycles.length > 0) {
      html += '<h4>大运列表</h4>';
      html += '<table class="detail-table">';
      html += '<tr><th>大运</th><th>年龄</th><th>年份</th><th>天干十神</th></tr>';
      cycles.forEach(cycle => {
        html += `<tr>
          <td>${cycle.ganZhi || '-'}</td>
          <td>${cycle.startAge || '-'}-${cycle.endAge || '-'}</td>
          <td>${cycle.startYear || '-'}-${cycle.endYear || '-'}</td>
          <td>${cycle.stemShiShen || '-'}</td>
        </tr>`;
      });
      html += '</table>';
    }
    html += '</div>';
    return html;
  }

  // 获取综合建议详情
  function getAdviceDetail(baziData) {
    const dayMaster = baziData.dayMaster || '';
    const wuXing = ganWuXing[dayMaster] || '';

    let html = '<div class="modal-detail-content">';
    html += `<div class="detail-item"><h4>日主特性</h4>`;
    html += `<p>日主为 ${dayMaster} (${wuXing})</p>`;
    html += `<p>${getDayMasterDescription(dayMaster)}</p></div>`;
    html += '<div class="detail-item"><h4>建议</h4>';
    html += '<ul>';
    html += '<li>建议结合实际情况，理性看待命理分析</li>';
    html += '<li>运势会随时间变化，保持积极心态很重要</li>';
    html += '<li>八字分析仅供参考，不可作为重大决策的唯一依据</li>';
    html += '</ul></div>';
    html += '</div>';
    return html;
  }

  // 加载AI配置
  function loadAIConfig(providerSelect, apiKeyInput, modelSelect, tempInput, tempValueDisplay) {
    try {
      const saved = localStorage.getItem('ai-config');
      if (saved) {
        const config = JSON.parse(saved);
        if (config.provider) providerSelect.value = config.provider;
        if (config.model) modelSelect.value = config.model;
        if (config.temperature) {
          tempInput.value = config.temperature;
          tempValueDisplay.textContent = config.temperature;
        }
        updateProviderModels(config.provider || 'openai', modelSelect);
      }
    } catch (e) {
      console.error('加载AI配置失败:', e);
    }
  }

  // 更新提供商模型列表
  function updateProviderModels(provider, modelSelect) {
    const models = {
      openai: [
        { value: 'gpt-4o-mini', text: 'GPT-4o Mini (推荐)' },
        { value: 'gpt-4o', text: 'GPT-4o' },
        { value: 'gpt-4-turbo', text: 'GPT-4 Turbo' }
      ],
      deepseek: [
        { value: 'deepseek-chat', text: 'DeepSeek Chat' },
        { value: 'deepseek-reasoner', text: 'DeepSeek Reasoner' }
      ],
      qwen: [
        { value: 'qwen-plus', text: 'Qwen Plus (推荐)' },
        { value: 'qwen-max', text: 'Qwen Max' },
        { value: 'qwen-turbo', text: 'Qwen Turbo' }
      ],
      'qwen-coding': [
        { value: 'qwen3.5-plus', text: 'Qwen3.5-Plus (推荐)' },
        { value: 'qwen3-max-2026-01-23', text: 'Qwen3-Max' }
      ],
      anthropic: [
        { value: 'claude-3-5-sonnet-20241022', text: 'Claude 3.5 Sonnet' },
        { value: 'claude-3-5-haiku-20241022', text: 'Claude 3.5 Haiku' }
      ]
    };

    const list = models[provider] || models.openai;
    modelSelect.innerHTML = list.map(m => `<option value="${m.value}">${m.text}</option>`).join('');
  }

  // 流派切换提示
  function addSchoolMessage(school) {
    const messages = document.getElementById('ai-messages');
    if (!messages) return;

    const schoolDesc = {
      wangshuai: '已切换到旺衰派：以日主强弱为核心，适合初学者入门',
      ziping: '已切换到子平派：经典正统，注重格局与用神',
      geju: '已切换到格局派：注重格局成败，层次高低',
      blind: '已切换到盲派：实战口诀，简洁直接',
      xinpai: '已切换到新派：现代创新，融合新理论'
    };

    // 检查是否是自定义派别
    const customSchools = loadCustomSchools();
    const customSchool = customSchools.find(s => s.id === school);
    let desc = schoolDesc[school];
    if (customSchool) {
      desc = `已切换到「${customSchool.name}」：${customSchool.description || '自定义派别'}`;
    }

    const msg = document.createElement('div');
    msg.className = 'ai-message system';
    msg.textContent = desc || '流派已切换';
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  // 从localStorage加载自定义派别
  function loadCustomSchools() {
    try {
      const saved = localStorage.getItem('custom-schools');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  // 保存自定义派别到localStorage
  function saveCustomSchools(schools) {
    try {
      localStorage.setItem('custom-schools', JSON.stringify(schools));
    } catch (e) {
      console.error('保存自定义派别失败:', e);
    }
  }

  // 刷新流派选择下拉框
  function refreshSchoolSelect(selectEl, customSchools) {
    const defaultSchools = [
      { id: 'wangshuai', name: '旺衰派' },
      { id: 'ziping', name: '子平派' },
      { id: 'geju', name: '格局派' },
      { id: 'blind', name: '盲派' },
      { id: 'xinpai', name: '新派' }
    ];

    let html = defaultSchools.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    
    if (customSchools && customSchools.length > 0) {
      html += '<option value="">----- 自定义 -----</option>';
      html += customSchools.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    }

    selectEl.innerHTML = html;
  }

  // 启动
  init();
})();
