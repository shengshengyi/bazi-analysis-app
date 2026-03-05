/**
 * 雷达图组件
 * 用于展示五维分析结果
 */

class RadarChart {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error(`Canvas element with id "${canvasId}" not found`);
      return;
    }
    
    this.ctx = this.canvas.getContext('2d');
    this.options = {
      width: 300,
      height: 300,
      padding: 40,
      maxValue: 100,
      ...options
    };
    
    // 设置canvas尺寸
    this.canvas.width = this.options.width;
    this.canvas.height = this.options.height;
    
    // 五维标签
    this.labels = ['事业', '财富', '运势', '性格', '健康'];
    this.dimensions = ['career', 'wealth', 'fortune', 'personality', 'health'];
    
    // 颜色配置
    this.colors = {
      grid: '#E0D5C7',
      axis: '#C19A6B',
      data: '#8B4513',
      dataFill: 'rgba(139, 69, 19, 0.2)',
      label: '#666666'
    };
    
    // 数据
    this.data = null;
  }
  
  /**
   * 设置数据并渲染
   */
  setData(data) {
    this.data = data;
    this.render();
  }
  
  /**
   * 渲染雷达图
   */
  render() {
    if (!this.ctx) return;
    
    const { width, height, padding } = this.options;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - padding;
    
    // 清空画布
    this.ctx.clearRect(0, 0, width, height);
    
    // 绘制网格
    this.drawGrid(centerX, centerY, radius);
    
    // 绘制轴线
    this.drawAxes(centerX, centerY, radius);
    
    // 绘制数据
    if (this.data) {
      this.drawData(centerX, centerY, radius);
    }
    
    // 绘制标签
    this.drawLabels(centerX, centerY, radius);
  }
  
  /**
   * 绘制网格
   */
  drawGrid(cx, cy, radius) {
    const levels = 5;
    this.ctx.strokeStyle = this.colors.grid;
    this.ctx.lineWidth = 1;
    
    for (let i = 1; i <= levels; i++) {
      const r = (radius / levels) * i;
      this.ctx.beginPath();
      
      for (let j = 0; j < 5; j++) {
        const angle = (Math.PI * 2 / 5) * j - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        
        if (j === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      }
      
      this.ctx.closePath();
      this.ctx.stroke();
    }
  }
  
  /**
   * 绘制轴线
   */
  drawAxes(cx, cy, radius) {
    this.ctx.strokeStyle = this.colors.axis;
    this.ctx.lineWidth = 1;
    
    for (let i = 0; i < 5; i++) {
      const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      
      this.ctx.beginPath();
      this.ctx.moveTo(cx, cy);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    }
  }
  
  /**
   * 绘制数据
   */
  drawData(cx, cy, radius) {
    const values = this.dimensions.map(dim => this.data[dim]?.score || 0);
    
    this.ctx.beginPath();
    this.ctx.fillStyle = this.colors.dataFill;
    this.ctx.strokeStyle = this.colors.data;
    this.ctx.lineWidth = 2;
    
    for (let i = 0; i < 5; i++) {
      const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
      const value = values[i] / this.options.maxValue;
      const r = radius * value;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
    
    // 绘制数据点
    this.ctx.fillStyle = this.colors.data;
    for (let i = 0; i < 5; i++) {
      const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
      const value = values[i] / this.options.maxValue;
      const r = radius * value;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, 4, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
  
  /**
   * 绘制标签
   */
  drawLabels(cx, cy, radius) {
    this.ctx.fillStyle = this.colors.label;
    this.ctx.font = '12px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    
    const labelRadius = radius + 20;
    
    for (let i = 0; i < 5; i++) {
      const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
      const x = cx + labelRadius * Math.cos(angle);
      const y = cy + labelRadius * Math.sin(angle);
      
      this.ctx.fillText(this.labels[i], x, y);
    }
  }
  
  /**
   * 销毁图表
   */
  destroy() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.data = null;
  }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RadarChart };
}
