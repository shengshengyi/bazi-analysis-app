/**
 * 八字排盘展示组件
 * 用于在主页面展示四柱八字信息
 */

class BaziDisplay {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = {
      showHiddenStems: true,
      showShiShen: true,
      showWuXing: true,
      ...options
    };
    
    // 五行颜色映射
    this.wuXingColors = {
      '木': 'var(--wood)',
      '火': 'var(--fire)',
      '土': 'var(--earth)',
      '金': 'var(--metal)',
      '水': 'var(--water)'
    };
    
    // 天干五行
    this.ganWuXing = {
      '甲': '木', '乙': '木',
      '丙': '火', '丁': '火',
      '戊': '土', '己': '土',
      '庚': '金', '辛': '金',
      '壬': '水', '癸': '水'
    };
    
    // 地支五行
    this.zhiWuXing = {
      '寅': '木', '卯': '木',
      '巳': '火', '午': '火',
      '辰': '土', '戌': '土', '丑': '土', '未': '土',
      '申': '金', '酉': '金',
      '亥': '水', '子': '水'
    };
  }
  
  /**
   * 渲染八字排盘
   */
  render(baziData) {
    if (!baziData || !baziData.pillars) {
      this.container.innerHTML = '<div class="bazi-empty">请先进行排盘</div>';
      return;
    }
    
    const { pillars, shishen, hiddenStems, dayMaster } = baziData;
    
    const html = `
      <div class="bazi-display">
        ${this.renderHeader(baziData)}
        ${this.renderPillarsTable(pillars, shishen, hiddenStems)}
        ${this.renderShenSha(baziData.shenSha)}
      </div>
    `;
    
    this.container.innerHTML = html;
  }
  
  /**
   * 渲染头部信息
   */
  renderHeader(data) {
    const { gender, solarDate, lunarDate, zodiac, dayMaster } = data;
    
    return `
      <div class="bazi-header">
        <div class="bazi-info-grid">
          <div class="info-item">
            <span class="info-label">性别</span>
            <span class="info-value">${gender === 'male' ? '男' : '女'}</span>
          </div>
          <div class="info-item">
            <span class="info-label">阳历</span>
            <span class="info-value">${solarDate || '-'}</span>
          </div>
          <div class="info-item">
            <span class="info-label">农历</span>
            <span class="info-value">${lunarDate || '-'}</span>
          </div>
          <div class="info-item">
            <span class="info-label">生肖</span>
            <span class="info-value">${zodiac || '-'}</span>
          </div>
          <div class="info-item">
            <span class="info-label">日主</span>
            <span class="info-value day-master">${dayMaster || '-'}</span>
          </div>
        </div>
      </div>
    `;
  }
  
  /**
   * 渲染四柱表格
   */
  renderPillarsTable(pillars, shishen, hiddenStems) {
    const positions = ['year', 'month', 'day', 'hour'];
    const labels = ['年柱', '月柱', '日柱', '时柱'];
    
    return `
      <div class="pillars-table-container">
        <div class="pillars-table">
          <div class="pillar-row header-row">
            <span class="row-label"></span>
            ${labels.map(label => `<span class="pillar-header">${label}</span>`).join('')}
          </div>
          
          <div class="pillar-row stem-row">
            <span class="row-label">天干</span>
            ${positions.map(pos => `
              <span class="pillar-cell stem-cell" style="color: ${this.getWuXingColor(pillars[pos].stem)}">
                ${pillars[pos].stem}
              </span>
            `).join('')}
          </div>
          
          ${this.options.showShiShen && shishen ? `
          <div class="pillar-row shishen-row">
            <span class="row-label">十神</span>
            ${positions.map(pos => `
              <span class="pillar-cell shishen-cell">
                ${shishen[pos] || '-'}
              </span>
            `).join('')}
          </div>
          ` : ''}
          
          <div class="pillar-row branch-row">
            <span class="row-label">地支</span>
            ${positions.map(pos => `
              <span class="pillar-cell branch-cell" style="color: ${this.getWuXingColor(pillars[pos].branch)}">
                ${pillars[pos].branch}
              </span>
            `).join('')}
          </div>
          
          ${this.options.showHiddenStems && hiddenStems ? `
          <div class="pillar-row hidden-stems-row">
            <span class="row-label">藏干</span>
            ${positions.map(pos => `
              <span class="pillar-cell hidden-stems-cell">
                ${hiddenStems[pos] ? hiddenStems[pos].join(' ') : '-'}
              </span>
            `).join('')}
          </div>
          ` : ''}
        </div>
      </div>
    `;
  }
  
  /**
   * 渲染神煞
   */
  renderShenSha(shenSha) {
    if (!shenSha || shenSha.length === 0) {
      return '';
    }
    
    return `
      <div class="shensha-section">
        <h4 class="section-title">神煞</h4>
        <div class="shensha-tags">
          ${shenSha.map(s => `<span class="shensha-tag">${s}</span>`).join('')}
        </div>
      </div>
    `;
  }
  
  /**
   * 获取五行颜色
   */
  getWuXingColor(char) {
    const wuXing = this.ganWuXing[char] || this.zhiWuXing[char];
    return wuXing ? this.wuXingColors[wuXing] : 'inherit';
  }
  
  /**
   * 更新选项
   */
  setOptions(options) {
    this.options = { ...this.options, ...options };
  }
  
  /**
   * 清空显示
   */
  clear() {
    this.container.innerHTML = '';
  }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BaziDisplay };
}
