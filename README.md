# 八字分析应用 V3 (Bazi Analysis App)

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-22+-green.svg" alt="Node.js 22+">
  <img src="https://img.shields.io/badge/TypeScript-5.0+-blue.svg" alt="TypeScript 5.0+">
  <img src="https://img.shields.io/badge/MCP-Protocol-orange.svg" alt="MCP Protocol">
  <img src="https://img.shields.io/badge/AI-Powered-purple.svg" alt="AI Powered">
  <img src="https://img.shields.io/badge/License-ISC-yellow.svg" alt="License: ISC">
</p>

<p align="center">
  <b>🎯 精准八字排盘 + 🤖 AI智能解盘 + 📚 多流派支持 + 🎨 自定义派别</b>
  <br>
  <small>支持 OpenAI / Claude / DeepSeek / 通义千问</small>
</p>

---

## ✨ V3.0 新特性

| 特性 | 描述 |
|------|------|
| 🤖 **AI智能解盘** | 基于大模型的智能八字解读，可配置API |
| 🎭 **五大流派** | 旺衰派/子平派/盲派/格局派/新派 |
| 🎨 **自定义派别** | 创建个人专属分析风格 |
| 💬 **对话式解盘** | 与AI实时交流，深入探讨命理 |
| 📊 **五维分析** | 事业/财富/运势/性格/健康详细分析 |
| 📈 **可视化展示** | 雷达图展示，弹窗详情查看 |

---

## 支持的AI服务商

| 服务商 | 模型 | 特点 |
|--------|------|------|
| **OpenAI** | GPT-4o / GPT-4o Mini | 强大通用能力 |
| **Anthropic** | Claude 3.5 Sonnet | 优秀推理能力 |
| **DeepSeek** | DeepSeek Chat | 中文优化 |
| **通义千问** | Qwen Max / Plus | 阿里云百炼平台 |

---

## 快速开始

### 环境要求

- **Node.js**: 22.0.0+
- **npm**: 9.0.0+

### 安装运行

```bash
# 克隆项目
git clone <repository-url>
cd bazi-analysis-app

# 安装依赖
npm install

# 开发运行
npm run dev

# 访问应用
# 浏览器打开: http://localhost:3000
```

---

## 功能说明

### 输入方式
- 公历日期时间
- 农历年月日时
- 八字直接输入（如：戊寅 己未 己卯 辛未）

### 排盘结果
- 四柱八字（年柱、月柱、日柱、时柱）
- 天干地支、十神标注
- 藏干信息
- 纳音、神煞
- 命宫身宫

### AI解盘
- 右下角"AI解盘"按钮打开悬浮窗
- 支持选择分析流派
- 可创建自定义派别
- 配置AI服务商和API Key

---

## 项目结构

```
bazi-analysis-app/
├── src/
│   ├── server.ts                 # 服务入口
│   ├── routes/
│   │   ├── bazi.routes.ts       # 排盘API
│   │   ├── ai.routes.ts         # AI对话API
│   │   └── analyze.routes.ts    # 分析API
│   ├── services/
│   │   └── analysis.service.ts  # 分析服务
│   ├── algorithms/
│   │   ├── bazi-parser.ts       # 排盘算法
│   │   └── career-analysis.ts    # 五维分析
│   └── ai/
│       └── ai.service.ts         # AI服务
├── public/
│   ├── index.html                # 主页面
│   ├── entry.html                # 入口页面
│   ├── js/
│   │   ├── pages/
│   │   │   ├── entry.js          # 入口页逻辑
│   │   │   └── main.js           # 主页面逻辑
│   │   ├── components/           # UI组件
│   │   └── core/                 # 核心工具
└── docs/                         # 文档
```

---

## API文档

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/bazi/calculate` | 八字排盘 |
| POST | `/api/analyze` | 详细分析 |
| POST | `/api/ai/chat` | AI对话 |

---

## 部署

### Vercel部署

```bash
npm i -g vercel
vercel --prod
```

详细部署说明见 [VERCEL_DEPLOY_GUIDE.md](VERCEL_DEPLOY_GUIDE.md)

---

## 许可证

[ISC](LICENSE)

---

<p align="center">
  <sub>Built with ❤️ using Node.js + TypeScript</sub>
</p>
