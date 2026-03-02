# 八字分析应用 V2.0 (Bazi Analysis App)

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-22+-green.svg" alt="Node.js 22+">
  <img src="https://img.shields.io/badge/TypeScript-5.0+-blue.svg" alt="TypeScript 5.0+">
  <img src="https://img.shields.io/badge/MCP-Protocol-orange.svg" alt="MCP Protocol">
  <img src="https://img.shields.io/badge/AI-Powered-purple.svg" alt="AI Powered">
  <img src="https://img.shields.io/badge/License-ISC-yellow.svg" alt="License: ISC">
</p>

<p align="center">
  <b>🎯 精准八字排盘 + 🤖 AI智能解盘 + 📚 多流派支持</b>
  <br>
  <small>支持 OpenAI / Claude / DeepSeek / 通义千问(千问百炼)</small>
</p>

---

## ✨ V2.0 新特性

| 特性 | 描述 |
|------|------|
| 🤖 **AI智能解盘** | 基于大模型的智能八字解读 |
| 🎭 **五大流派** | 旺衰派/子平派/盲派/格局派/新派 |
| 🔌 **多AI支持** | OpenAI / Claude / DeepSeek / 通义千问 |
| 💬 **对话式解盘** | 与AI实时交流，深入探讨命理 |
| ⚙️ **可配置AI** | UI界面配置API Key和模型参数 |

---

## 支持的AI服务商

| 服务商 | 模型 | 特点 |
|--------|------|------|
| **OpenAI** | GPT-4o / GPT-4o Mini | 强大通用能力 |
| **Anthropic** | Claude 3.5 Sonnet / Haiku | 优秀推理能力 |
| **DeepSeek** | DeepSeek Chat / Coder | 中文优化 |
| **通义千问** | Qwen Max / Plus / Turbo / Coder | 阿里云百炼平台，国内友好 |
| **自定义** | 任意OpenAI兼容API | 灵活扩展 |

---

- [项目简介](#项目简介)
- [功能特性](#功能特性)
- [技术架构](#技术架构)
- [快速开始](#快速开始)
- [API 文档](#api-文档)
- [分析算法](#分析算法)
- [部署指南](#部署指南)
- [项目结构](#项目结构)
- [团队分工](#团队分工)
- [更新日志](#更新日志)
- [致谢](#致谢)

---

## 项目简介

八字分析应用是一款基于现代Web技术栈开发的命理分析工具，通过集成 [bazi-mcp](https://github.com/cantian-ai/bazi-mcp)（参天AI开发的MCP服务），提供精准的八字排盘和深度命理分析服务。

传统八字排盘往往依赖人工计算，容易出错。本项目通过AI技术实现：
- **精准排盘**: 基于参天AI的权威算法，避免传统排盘错误
- **真太阳时校正**: 根据出生地经度自动校正时辰
- **五维分析**: 从职业、财富、运势、性格、健康五个维度深度解析

---

## 功能特性

### 核心功能

| 功能 | 描述 | 状态 |
|------|------|------|
| 🔮 **八字排盘** | 支持公历/农历输入，生成四柱八字 | ✅ 已完成 |
| ⏰ **真太阳时校正** | 根据经度自动校正出生时辰 | ✅ 已完成 |
| 📊 **五维分析** | 职业/财富/运势/性格/健康全方位分析 | ✅ 已完成 |
| 📈 **可视化展示** | 雷达图展示五维能力分布 | ✅ 已完成 |
| 🎨 **传统排盘** | 经典四柱格式，十神神煞一目了然 | ✅ 已完成 |
| 🔮 **大运流年** | 展示大运周期和流年运势 | ✅ 已完成 |

### 详细功能说明

#### 1. 排盘输入
- 支持公历/农历两种输入方式
- 性别选择
- 出生地经度输入（用于真太阳时校正）
- 分析维度自定义选择

#### 2. 排盘结果
- 四柱八字（年柱、月柱、日柱、时柱）
- 天干地支十神标注
- 藏干信息
- 纳音、旬空、星运、自坐
- 神煞列表（贵人、桃花、华盖等）

#### 3. 五维分析

**职业分析**
- 官杀星分析 → 管理能力
- 财星分析 → 商业敏感度
- 印星分析 → 学习能力
- 食伤分析 → 创造力

**财富分析**
- 日主强弱 vs 财星强弱 → 担财能力
- 财星有根性 → 财源稳定性
- 比劫旺衰 → 破财风险
- 食伤生财能力 → 财富创造力

**运势分析**
- 大运干支与原局关系
- 流年干支与日主关系
- 刑冲合会分析
- 神煞流年影响

**性格分析**
- 日主五行属性 → 基本性格底色
- 十神分布 → 行为模式
- 阴阳比例 → 内外向倾向

**健康分析**
- 五行偏枯 → 脏腑弱点
- 寒暖燥湿 → 体质倾向
- 刑冲合会 → 突发健康风险

---

## 技术架构

### 系统架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                         前端层 (Frontend)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  排盘输入页  │  │  分析报告页  │  │  大运流年可视化          │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ HTTP/REST
┌─────────────────────────────────────────────────────────────────┐
│                      API 网关层 (Express)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ /api/bazi   │  │ /api/analyze│  │ /api/report             │  │
│  │ 排盘接口    │  │ 分析接口    │  │ 报告生成接口             │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   排盘服务       │ │   分析引擎       │ │   报告服务       │
│  (bazi-mcp)     │ │  (五维算法)      │ │  (可视化)        │
├─────────────────┤ ├─────────────────┤ ├─────────────────┤
│ • MCP集成       │ │ • 职业分析       │ │ • 雷达图生成     │
│ • 真太阳时校正   │ │ • 财富分析       │ │ • 报告导出       │
│ • 公历农历转换   │ │ • 运势分析       │ │ • 分享功能       │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

### 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| **后端** | Node.js | 22+ |
| **框架** | Express | 4.18.2 |
| **语言** | TypeScript | 5.3+ |
| **MCP SDK** | @modelcontextprotocol/sdk | 1.10.2 |
| **前端** | 原生 HTML/CSS/JS | - |
| **图表** | Chart.js | 4.x |
| **时间处理** | date-fns | 3.6.0 |

---

## 快速开始

### 环境要求

- **Node.js**: 22.0.0 或更高版本
- **npm**: 9.0.0 或更高版本
- **操作系统**: Windows / macOS / Linux

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd bazi-app
```

2. **安装依赖**
```bash
npm install
```

3. **开发运行**
```bash
npm run dev
```

4. **访问应用**
```
浏览器打开: http://localhost:3000
```

### 生产构建

```bash
# 编译 TypeScript
npm run build

# 运行生产版本
npm start
```

---

## API 文档

### 接口概览

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/bazi/calculate` | 八字排盘 |
| POST | `/api/analyze` | 详细分析 |
| POST | `/api/analyze/quick` | 快速分析（排盘+分析） |
| GET | `/api/health` | 健康检查 |

### 1. 快速分析

**请求**
```bash
POST /api/analyze/quick
Content-Type: application/json

{
  "inputType": "solar",
  "solarDate": "1998-07-31",
  "solarTime": "14:10",
  "gender": "male",
  "useTrueSolarTime": true,
  "longitude": 116.4074
}
```

**响应**
```json
{
  "success": true,
  "data": {
    "bazi": {
      "gender": "男",
      "solarDatetime": "1998年7月31日 14:10:00",
      "lunarDatetime": "农历戊寅年六月初九辛未时",
      "bazi": "戊寅 己未 己卯 辛未",
      "zodiac": "虎",
      "dayMaster": "己",
      "pillars": { ... },
      "daYun": { ... }
    },
    "report": {
      "summary": "男命，日主己...",
      "dimensions": {
        "career": { "score": 7, "level": "good", ... },
        "wealth": { "score": 2, "level": "weak", ... },
        "fortune": { "score": 6, "level": "good", ... },
        "personality": { "score": 6, "level": "good", ... },
        "health": { "score": 5, "level": "average", ... }
      },
      "advice": ["建议1", "建议2", ...]
    }
  }
}
```

### 2. 八字排盘

**请求**
```bash
POST /api/bazi/calculate
Content-Type: application/json

{
  "inputType": "solar",
  "solarDate": "1998-07-31",
  "solarTime": "14:10",
  "gender": "male",
  "useTrueSolarTime": false
}
```

**响应**
```json
{
  "success": true,
  "data": {
    "gender": "男",
    "solarDatetime": "1998年7月31日 14:10:00",
    "lunarDatetime": "农历戊寅年六月初九辛未时",
    "bazi": "戊寅 己未 己卯 辛未",
    "zodiac": "虎",
    "dayMaster": "己",
    "pillars": { ... },
    "shenSha": { ... },
    "daYun": { ... }
  }
}
```

### 3. 详细分析

**请求**
```bash
POST /api/analyze
Content-Type: application/json

{
  "baziData": { ... },
  "dimensions": ["career", "wealth", "fortune", "personality", "health"],
  "year": 2025
}
```

### 参数说明

#### 输入参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| inputType | string | 是 | 输入类型: `solar` 或 `lunar` |
| solarDate | string | 条件 | 公历日期，格式: `YYYY-MM-DD` |
| solarTime | string | 条件 | 公历时间，格式: `HH:mm` |
| lunarYear | number | 条件 | 农历年 |
| lunarMonth | number | 条件 | 农历月 |
| lunarDay | number | 条件 | 农历日 |
| lunarHour | number | 条件 | 农历时 (0-23) |
| isLeapMonth | boolean | 否 | 是否闰月，默认 false |
| gender | string | 是 | 性别: `male` 或 `female` |
| useTrueSolarTime | boolean | 否 | 是否使用真太阳时，默认 false |
| longitude | number | 条件 | 经度，使用真太阳时时必填 |

#### 分析维度

| 维度 | 说明 |
|------|------|
| career | 职业分析 |
| wealth | 财富分析 |
| fortune | 运势分析 |
| personality | 性格分析 |
| health | 健康分析 |

---

## 分析算法

### 真太阳时校正算法

真太阳时是根据太阳实际位置计算的时间，与标准时间（平太阳时）存在差异。

```typescript
function calculateTrueSolarTime(
  standardTime: Date,
  longitude: number,
  timezoneOffset: number
): Date {
  // 1. 经度时差（每度4分钟）
  const longitudeDiff = longitude - (timezoneOffset * 15);
  const longitudeTimeDiff = longitudeDiff * 4; // 分钟

  // 2. 均时差（Equation of Time）
  const eotMinutes = calculateEOT(dayOfYear);

  // 3. 总时差
  const totalDiff = longitudeTimeDiff + eotMinutes;

  return new Date(standardTime.getTime() + totalDiff * 60 * 1000);
}
```

### 五维分析算法

#### 1. 职业分析
```
输入: 八字四柱
算法:
  1. 统计官杀星 → 管理能力
  2. 统计财星 → 商业敏感度
  3. 统计印星 → 学习能力
  4. 统计食伤 → 创造力
输出: 职业倾向、适合行业、发展建议
```

#### 2. 财富分析
```
输入: 八字四柱
算法:
  1. 日主强弱 vs 财星强弱 → 担财能力
  2. 财星是否有根 → 财源稳定性
  3. 比劫旺衰 → 破财风险
  4. 食伤生财能力 → 财富创造力
输出: 财富等级、理财建议、投资方向
```

#### 3. 运势分析
```
输入: 八字 + 大运 + 流年
算法:
  1. 当前大运干支与原局关系
  2. 流年干支与日主/用神关系
  3. 刑冲合会分析
  4. 神煞流年影响
输出: 年度运势评分、关键月份、注意事项
```

#### 4. 性格分析
```
输入: 八字四柱
算法:
  1. 日主五行属性 → 基本性格底色
  2. 十神分布 → 行为模式
  3. 阴阳比例 → 内外向倾向
输出: 性格画像、人际建议、自我提升方向
```

#### 5. 健康分析
```
输入: 八字四柱
算法:
  1. 五行偏枯 → 对应脏腑弱点
  2. 寒暖燥湿 → 体质倾向
  3. 刑冲合会 → 突发健康问题
输出: 体质类型、养生建议、注意事项
```

---

## 部署指南

### 部署到 Vercel

1. **安装 Vercel CLI**
```bash
npm i -g vercel
```

2. **登录 Vercel**
```bash
vercel login
```

3. **部署**
```bash
cd bazi-app
vercel --prod
```

4. **环境变量（可选）**
在 Vercel Dashboard 中设置:
- `NODE_ENV=production`

### 部署到 Render

1. **创建 Web Service**
   - 选择 GitHub 仓库
   - 选择分支: main

2. **配置构建**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

3. **环境变量**
   - `NODE_ENV=production`

### Docker 部署

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
docker build -t bazi-app .
docker run -p 3000:3000 bazi-app
```

---

## 项目结构

```
bazi-app/
├── src/
│   ├── server.ts                    # Express 入口
│   ├── routes/
│   │   ├── bazi.routes.ts           # 排盘路由
│   │   └── analyze.routes.ts        # 分析路由
│   ├── services/
│   │   ├── bazi.service.ts          # 排盘服务（MCP集成）
│   │   └── analysis.service.ts      # 分析服务整合
│   ├── algorithms/
│   │   ├── true-solar-time.ts       # 真太阳时算法
│   │   ├── career-analysis.ts       # 职业分析算法
│   │   ├── wealth-analysis.ts       # 财富分析算法
│   │   ├── fortune-analysis.ts      # 运势分析算法
│   │   ├── personality-analysis.ts  # 性格分析算法
│   │   └── health-analysis.ts       # 健康分析算法
│   ├── models/
│   │   └── types.ts                 # TypeScript 类型定义
│   └── utils/
│       └── helpers.ts               # 工具函数
├── public/                          # 前端静态文件
│   ├── index.html                   # 主页面
│   ├── css/
│   │   └── style.css               # 样式文件
│   └── js/
│       └── app.js                  # 前端逻辑
├── dist/                            # 编译输出（自动生成）
├── package.json                     # 项目配置
├── tsconfig.json                    # TypeScript 配置
├── vercel.json                      # Vercel 部署配置
└── README.md                        # 项目文档
```

---

## 团队分工

本项目采用**强协作模式**完成，4人团队分工如下：

| 角色 | 负责人 | 职责 | 交付物 |
|------|--------|------|--------|
| **产品架构师** | - | 架构设计、文档编写、技术选型 | ARCHITECTURE.md、PROJECT_STATUS.md |
| **排盘工程师** | - | MCP集成、真太阳时算法、排盘服务 | bazi.service.ts、true-solar-time.ts |
| **分析师** | - | 五维分析算法、十神解读、大运流年 | career/wealth/fortune/personality/health-analysis.ts |
| **全栈开发** | - | 前端界面、API接口、部署配置 | index.html、app.js、routes/、vercel.json |

---

## 更新日志

### v1.0.0 (2026-02-27)
- ✅ 初始版本发布
- ✅ 集成 bazi-mcp 排盘服务
- ✅ 实现真太阳时校正
- ✅ 完成五维分析算法
- ✅ 开发前端可视化界面
- ✅ 支持公历/农历输入
- ✅ 部署配置完成

---

## 致谢

- [Cantian AI](https://cantian.ai) - 提供 bazi-mcp 排盘服务
- [Model Context Protocol](https://modelcontextprotocol.io) - MCP 协议
- [Chart.js](https://www.chartjs.org) - 图表库

---

## 许可证

[ISC](LICENSE)

---

<p align="center">
  <sub>Built with ❤️ by the Bazi Analysis Team</sub>
</p>
