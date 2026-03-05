/**
 * 派别配置管理
 * 管理AI分析的命理流派配置
 */

class SchoolConfigManager {
  constructor() {
    this.defaultSchools = [
      {
        id: 'wangshuai',
        name: '旺衰派',
        description: '以日主强弱为核心，适合初学者入门',
        params: {
          emphasis: 'wangshuai',
          tone: 'professional',
          detailLevel: 'standard',
          focusAreas: ['strength', 'weakness', 'balance']
        }
      },
      {
        id: 'ziping',
        name: '子平派',
        description: '经典正统，注重格局与用神',
        params: {
          emphasis: 'ziping',
          tone: 'professional',
          detailLevel: 'detailed',
          focusAreas: ['pattern', 'useful-god', 'structure']
        }
      },
      {
        id: 'blind',
        name: '盲派',
        description: '实战口诀，简洁直接',
        params: {
          emphasis: 'blind',
          tone: 'casual',
          detailLevel: 'brief',
          focusAreas: ['practical', 'formula', 'quick-read']
        }
      },
      {
        id: 'geju',
        name: '格局派',
        description: '注重格局成败，层次高低',
        params: {
          emphasis: 'geju',
          tone: 'professional',
          detailLevel: 'detailed',
          focusAreas: ['pattern-success', 'level', 'achievement']
        }
      },
      {
        id: 'xinpai',
        name: '新派',
        description: '现代创新，融合新理论',
        params: {
          emphasis: 'xinpai',
          tone: 'casual',
          detailLevel: 'standard',
          focusAreas: ['modern', 'innovation', 'integration']
        }
      }
    ];
    
    this.customSchools = [];
    this.loadCustomSchools();
  }
  
  /**
   * 获取所有流派
   */
  getAllSchools() {
    return [...this.defaultSchools, ...this.customSchools];
  }
  
  /**
   * 获取默认流派
   */
  getDefaultSchools() {
    return [...this.defaultSchools];
  }
  
  /**
   * 获取自定义流派
   */
  getCustomSchools() {
    return [...this.customSchools];
  }
  
  /**
   * 根据ID获取流派
   */
  getSchoolById(id) {
    return this.getAllSchools().find(s => s.id === id);
  }
  
  /**
   * 创建自定义流派
   */
  createCustomSchool(config) {
    const school = {
      id: `custom-${Date.now()}`,
      name: config.name,
      description: config.description,
      isCustom: true,
      params: {
        emphasis: config.emphasis || 'wangshuai',
        tone: config.tone || 'professional',
        detailLevel: config.detailLevel || 'standard',
        focusAreas: config.focusAreas || []
      }
    };
    
    this.customSchools.push(school);
    this.saveCustomSchools();
    
    return school;
  }
  
  /**
   * 更新自定义流派
   */
  updateCustomSchool(id, config) {
    const index = this.customSchools.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('流派不存在');
    }
    
    this.customSchools[index] = {
      ...this.customSchools[index],
      name: config.name,
      description: config.description,
      params: {
        ...this.customSchools[index].params,
        ...config.params
      }
    };
    
    this.saveCustomSchools();
    return this.customSchools[index];
  }
  
  /**
   * 删除自定义流派
   */
  deleteCustomSchool(id) {
    const index = this.customSchools.findIndex(s => s.id === id);
    if (index === -1) {
      return false;
    }
    
    this.customSchools.splice(index, 1);
    this.saveCustomSchools();
    return true;
  }
  
  /**
   * 保存自定义流派到本地存储
   */
  saveCustomSchools() {
    if (typeof storage !== 'undefined') {
      storage.set('customSchools', this.customSchools);
    } else {
      localStorage.setItem('bazi-custom-schools', JSON.stringify(this.customSchools));
    }
  }
  
  /**
   * 从本地存储加载自定义流派
   */
  loadCustomSchools() {
    try {
      let data;
      if (typeof storage !== 'undefined') {
        data = storage.get('customSchools', []);
      } else {
        const saved = localStorage.getItem('bazi-custom-schools');
        data = saved ? JSON.parse(saved) : [];
      }
      this.customSchools = data;
    } catch (e) {
      console.error('加载自定义流派失败:', e);
      this.customSchools = [];
    }
  }
  
  /**
   * 获取流派描述文本
   */
  getSchoolDescription(schoolId) {
    const school = this.getSchoolById(schoolId);
    if (!school) return '';
    
    const emphasisMap = {
      'wangshuai': '以日主强弱为核心',
      'ziping': '经典正统，注重格局',
      'blind': '实战口诀，简洁直接',
      'geju': '注重格局成败',
      'xinpai': '现代创新理论'
    };
    
    const toneMap = {
      'professional': '专业严谨',
      'casual': '通俗易懂',
      'poetic': '诗意优美'
    };
    
    const detailMap = {
      'brief': '简洁概要',
      'standard': '标准详细',
      'detailed': '深度详细'
    };
    
    const params = school.params;
    return `${school.name}：${emphasisMap[params.emphasis] || ''}，${toneMap[params.tone] || ''}，${detailMap[params.detailLevel] || ''}`;
  }
  
  /**
   * 生成流派选择器HTML
   */
  generateSelectorHTML(selectedId = 'wangshuai') {
    const schools = this.getAllSchools();
    
    return `
      <div class="school-selector">
        <label class="selector-label">选择流派</label>
        <select id="school-select" class="school-select">
          ${schools.map(s => `
            <option value="${s.id}" ${s.id === selectedId ? 'selected' : ''}>
              ${s.name}${s.isCustom ? ' (自定义)' : ''}
            </option>
          `).join('')}
        </select>
        <p class="school-desc" id="school-desc"></p>
      </div>
    `;
  }
  
  /**
   * 生成流派管理界面HTML
   */
  generateManagerHTML() {
    const customSchools = this.getCustomSchools();
    
    return `
      <div class="school-manager">
        <div class="manager-header">
          <h3>自定义流派</h3>
          <button id="create-school-btn" class="btn btn-primary">创建新流派</button>
        </div>
        
        <div class="schools-list">
          ${customSchools.length === 0 ? `
            <p class="empty-tip">暂无自定义流派，点击上方按钮创建</p>
          ` : `
            ${customSchools.map(s => `
              <div class="school-item" data-id="${s.id}">
                <div class="school-info">
                  <h4>${s.name}</h4>
                  <p>${s.description}</p>
                </div>
                <div class="school-actions">
                  <button class="btn-edit" data-id="${s.id}">编辑</button>
                  <button class="btn-delete" data-id="${s.id}">删除</button>
                </div>
              </div>
            `).join('')}
          `}
        </div>
      </div>
    `;
  }
  
  /**
   * 生成创建/编辑流派表单HTML
   */
  generateFormHTML(school = null) {
    const isEdit = !!school;
    
    return `
      <form id="school-form" class="school-form">
        <div class="form-group">
          <label>流派名称</label>
          <input type="text" id="school-name" value="${school?.name || ''}" required>
        </div>
        
        <div class="form-group">
          <label>描述</label>
          <textarea id="school-desc-input" rows="2">${school?.description || ''}</textarea>
        </div>
        
        <div class="form-group">
          <label>分析侧重点</label>
          <select id="school-emphasis">
            <option value="wangshuai" ${school?.params?.emphasis === 'wangshuai' ? 'selected' : ''}>旺衰</option>
            <option value="ziping" ${school?.params?.emphasis === 'ziping' ? 'selected' : ''}>子平</option>
            <option value="blind" ${school?.params?.emphasis === 'blind' ? 'selected' : ''}>盲派</option>
            <option value="geju" ${school?.params?.emphasis === 'geju' ? 'selected' : ''}>格局</option>
            <option value="xinpai" ${school?.params?.emphasis === 'xinpai' ? 'selected' : ''}>新派</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>语气风格</label>
          <select id="school-tone">
            <option value="professional" ${school?.params?.tone === 'professional' ? 'selected' : ''}>专业严谨</option>
            <option value="casual" ${school?.params?.tone === 'casual' ? 'selected' : ''}>通俗易懂</option>
            <option value="poetic" ${school?.params?.tone === 'poetic' ? 'selected' : ''}>诗意优美</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>详细程度</label>
          <select id="school-detail">
            <option value="brief" ${school?.params?.detailLevel === 'brief' ? 'selected' : ''}>简洁</option>
            <option value="standard" ${school?.params?.detailLevel === 'standard' ? 'selected' : ''}>标准</option>
            <option value="detailed" ${school?.params?.detailLevel === 'detailed' ? 'selected' : ''}>详细</option>
          </select>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">${isEdit ? '保存' : '创建'}</button>
          <button type="button" class="btn btn-secondary" id="cancel-school-btn">取消</button>
        </div>
      </form>
    `;
  }
}

// 创建全局实例
const schoolConfigManager = new SchoolConfigManager();

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SchoolConfigManager, schoolConfigManager };
}
