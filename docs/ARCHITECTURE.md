# 八字分析应用 V3 - 架构设计文档

## 1. 系统架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                         客户端层 (Client)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  入口页面    │  │  主页面      │  │      AI悬浮窗           │  │
│  │ entry.html  │→ │ index.html  │  │  ┌─────────────────┐    │  │
│  │             │  │             │  │  │  SchoolSelector │    │  │
│  │ - 输入表单   │  │ - 四柱展示   │  │  │  ChatHistory    │    │  │
│  │ - 类型切换   │  │ - 功能入口   │  │  │  InputArea      │    │  │
│  └─────────────┘  └─────────────┘  │  └─────────────────┘    │  │
│                                    └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      前端组件层 (Frontend)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────┐ │
│  │  Router     │  │  ModalMgr   │  │  StateMgr   │  │  Utils │ │
│  │ 页面路由    │  │ 弹窗管理    │  │ 状态管理    │  │ 工具库 │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API网关层 (API Gateway)                   │
│                    Express.js + TypeScript                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ /api/bazi   │  │/api/analyze │  │  /api/ai    │             │
│  │  排盘接口   │  │  分析接口   │  │  AI对话     │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      服务层 (Service Layer)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │BaziService  │  │AnalysisSvc  │  │  AIService  │             │
│  │ 八字排盘    │  │ 五维分析    │  │ AI解盘      │             │
│  │ - MCP调用   │  │ - 算法分析  │  │ - 多流派    │             │
│  │ - 数据转换  │  │ - 评分计算  │  │ - 流式输出  │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      外部依赖层 (External)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  bazi-mcp   │  │   AI SDK    │  │  LocalStore │             │
│  │  (MCP协议)  │  │(多提供商)   │  │  (本地存储) │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. 前端架构

### 2.1 页面结构

```
public/
├── entry.html          # 入口页面（排盘输入）
├── index.html          # 主页面（核心展示）
├── css/
│   ├── base.css        # 基础样式、变量
│   ├── entry.css       # 入口页样式
│   ├── main.css        # 主页面样式
│   ├── components.css  # 组件样式（弹窗、悬浮窗等）
│   └── responsive.css  # 响应式适配
└── js/
    ├── core/
    │   ├── router.js       # 简易路由管理
    │   ├── state.js        # 全局状态管理
    │   ├── storage.js      # 本地存储封装
    │   └── api.js          # API请求封装
    ├── components/
    │   ├── Modal.js        # 弹窗组件
    │   ├── FloatingPanel.js # 悬浮面板组件
    │   ├── BaziDisplay.js  # 八字展示组件
    │   └── RadarChart.js   # 雷达图组件
    ├── pages/
    │   ├── entry.js        # 入口页逻辑
    │   └── main.js         # 主页面逻辑
    ├── features/
    │   ├── ai-chat.js      # AI对话功能
    │   ├── school-config.js # 派别配置
    │   └── history.js      # 历史记录
    └── utils/
        ├── bazi-parser.js  # 八字解析器
        ├── validators.js   # 输入校验
        └── formatters.js   # 格式化工具
```

### 2.2 状态管理设计

```typescript
// 全局状态结构
interface AppState {
  // 当前八字数据
  currentBazi: BaziData | null;
  
  // UI状态
  ui: {
    activeModal: string | null;      // 当前打开的弹窗
    aiPanelOpen: boolean;            // AI面板是否展开
    selectedSchool: string;          // 当前选中的流派
  };
  
  // 用户配置
  preferences: {
    defaultInputType: InputType;
    customSchools: CustomSchool[];
    aiConfig: AIConfig;
  };
  
  // 历史记录
  history: HistoryItem[];
}

// 状态管理类
class StateManager {
  private state: AppState;
  private listeners: Map<string, Function[]>;
  
  get<K extends keyof AppState>(key: K): AppState[K];
  set<K extends keyof AppState>(key: K, value: AppState[K]): void;
  subscribe(key: string, callback: Function): void;
}
```

### 2.3 组件通信机制

```
事件总线设计:
┌────────────────────────────────────────┐
│           EventBus                     │
├────────────────────────────────────────┤
│  emit(event: string, data: any)        │
│  on(event: string, handler: Function)  │
│  off(event: string, handler: Function) │
└────────────────────────────────────────┘

核心事件:
- 'bazi:loaded'      - 八字数据加载完成
- 'modal:open'       - 打开弹窗
- 'modal:close'      - 关闭弹窗
- 'ai:toggle'        - 切换AI面板
- 'school:change'    - 切换流派
```

---

## 3. 后端架构

### 3.1 API设计

#### 3.1.1 排盘接口

```typescript
// POST /api/bazi/calculate
interface CalculateRequest {
  inputType: 'solar' | 'lunar' | 'bazi';  // V3新增bazi类型
  // 阳历输入
  solarDate?: string;      // YYYY-MM-DD
  solarTime?: string;      // HH:mm
  // 农历输入
  lunarYear?: number;
  lunarMonth?: number;
  lunarDay?: number;
  lunarHour?: number;
  isLeapMonth?: boolean;
  // 八字直接输入 (V3新增)
  baziString?: string;     // 如: "甲子年丙寅月戊辰日庚午时"
  // 通用
  gender: 'male' | 'female';
  useTrueSolarTime?: boolean;
  longitude?: number;
}

interface CalculateResponse {
  success: boolean;
  data?: BaziData;
  error?: string;
}
```

#### 3.1.2 分析接口

```typescript
// POST /api/analyze
interface AnalyzeRequest {
  baziData: BaziData;
  dimensions: AnalysisDimension[];
  year?: number;
}

// POST /api/analyze/quick
// 排盘+分析一键完成
```

#### 3.1.3 AI接口

```typescript
// POST /api/ai/chat
interface ChatRequest {
  baziData: BaziData;
  message: string;
  schoolId: string;
  customSchoolParams?: CustomSchoolParams;  // V3新增
  history?: ChatMessage[];
}

// GET /api/ai/schools
// 获取所有流派配置（含用户自定义）

// POST /api/ai/schools/custom
// 创建自定义流派
```

### 3.2 服务层设计

```
src/
├── server.ts              # 服务器入口
├── routes/
│   ├── bazi.routes.ts     # 排盘路由
│   ├── analyze.routes.ts  # 分析路由
│   └── ai.routes.ts       # AI路由
├── services/
│   ├── bazi.service.ts    # 排盘服务
│   ├── analysis.service.ts # 分析服务
│   └── ai/
│       ├── ai.service.ts      # AI核心服务
│       ├── school.service.ts  # 流派管理服务 (V3新增)
│       └── prompt.builder.ts  # 提示词构建器
├── algorithms/
│   ├── bazi-parser.ts     # 八字解析器 (V3新增)
│   ├── career-analysis.ts
│   ├── wealth-analysis.ts
│   ├── fortune-analysis.ts
│   ├── personality-analysis.ts
│   └── health-analysis.ts
└── models/
    └── types.ts           # 类型定义
```

### 3.3 八字直接输入解析器

```typescript
// src/algorithms/bazi-parser.ts

interface BaziParseResult {
  year: { stem: string; branch: string };
  month: { stem: string; branch: string };
  day: { stem: string; branch: string };
  hour: { stem: string; branch: string };
  isValid: boolean;
  errors?: string[];
}

class BaziParser {
  // 支持格式:
  // "甲子年丙寅月戊辰日庚午时"
  // "甲子 丙寅 戊辰 庚午"
  // "甲子,丙寅,戊辰,庚午"
  
  parse(input: string): BaziParseResult;
  
  // 模糊匹配（容错）
  fuzzyParse(input: string): BaziParseResult[];
  
  // 验证八字合法性
  validate(bazi: BaziParseResult): boolean;
  
  // 转换为阳历日期（用于排盘）
  convertToSolar(bazi: BaziParseResult): SolarDate;
}
```

### 3.4 流派管理服务

```typescript
// src/services/ai/school.service.ts

interface SchoolManager {
  // 获取所有流派（内置+自定义）
  getAllSchools(): SchoolConfig[];
  
  // 获取单个流派
  getSchool(id: string): SchoolConfig | undefined;
  
  // 创建自定义流派
  createCustomSchool(config: CustomSchoolConfig): SchoolConfig;
  
  // 更新自定义流派
  updateCustomSchool(id: string, config: Partial<CustomSchoolConfig>): SchoolConfig;
  
  // 删除自定义流派
  deleteCustomSchool(id: string): boolean;
  
  // 构建系统提示词
  buildSystemPrompt(schoolId: string, baziData: BaziData): string;
}
```

---

## 4. 数据流设计

### 4.1 排盘流程

```
用户输入
    │
    ▼
┌─────────────────┐
│  输入类型判断    │
└─────────────────┘
    │
    ├── 阳历 ──→ 日期校验 ──→ 真太阳时转换 ──┐
    ├── 农历 ──→ 农历转阳历 ──→ 日期校验 ──┼──→ MCP调用
    └── 八字 ──→ 八字解析 ──→ 反推阳历 ────┘
                                              │
                                              ▼
                                        ┌─────────────┐
                                        │  bazi-mcp   │
                                        │  getBazi    │
                                        └─────────────┘
                                              │
                                              ▼
                                        ┌─────────────┐
                                        │  数据标准化  │
                                        │ normalize   │
                                        └─────────────┘
                                              │
                                              ▼
                                        ┌─────────────┐
                                        │  存储到State │
                                        │  跳转主页面  │
                                        └─────────────┘
```

### 4.2 AI对话流程

```
用户提问
    │
    ▼
┌─────────────────┐
│  检查八字数据    │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│  获取当前流派    │
│  配置+系统提示词 │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│  构建完整提示词  │
│  - 流派风格     │
│  - 八字信息     │
│  - 历史对话     │
│  - 用户问题     │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│  AI SDK调用     │
│  streamText     │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│  流式响应输出    │
│  SSE/EventStream│
└─────────────────┘
```

---

## 5. 关键技术决策

### 5.1 前端技术选型

| 技术 | 选择 | 理由 |
|------|------|------|
| 框架 | 原生JS + Web Components | 轻量，无需构建，适合静态部署 |
| 样式 | CSS Variables + Flex/Grid | 原生支持，主题切换方便 |
| 图表 | Chart.js | 轻量，雷达图支持好 |
| 状态 | 自定义StateManager | 简单场景无需Redux/Vuex |

### 5.2 后端技术选型

| 技术 | 选择 | 理由 |
|------|------|------|
| 框架 | Express.js | 成熟稳定，生态丰富 |
| AI SDK | Vercel AI SDK | 统一接口，支持多提供商 |
| MCP | bazi-mcp | 已集成，功能完善 |
| 部署 | Vercel/Node | 支持Serverless |

### 5.3 存储策略

| 数据类型 | 存储位置 | 理由 |
|----------|----------|------|
| 八字历史 | LocalStorage | 隐私敏感，本地存储 |
| 用户配置 | LocalStorage | 轻量配置，无需服务端 |
| 自定义流派 | LocalStorage | 用户个人偏好 |
| API Key | 服务端环境变量 | 安全考虑，不暴露前端 |

### 5.4 错误处理策略

```
错误层级:
├── 输入层错误
│   └── 前端校验，即时反馈
├── API层错误
│   └── 统一错误格式，友好提示
├── MCP层错误
│   └── 降级方案，缓存兜底
└── AI层错误
    └── 流式错误处理，优雅降级
```

---

## 6. 安全设计

### 6.1 API Key管理
- 服务端配置默认Key（环境变量）
- 用户自定义Key仅保存在服务端内存（不持久化）
- 前端绝不暴露任何Key

### 6.2 输入校验
```typescript
// 多层校验策略
1. 前端: 即时校验，用户体验
2. 路由层: 参数类型/必填校验
3. 服务层: 业务逻辑校验
4. MCP层: 数据有效性校验
```

### 6.3 XSS防护
- 所有用户输入转义输出
- Content-Security-Policy头
- 严格的输入过滤

---

## 7. 扩展性设计

### 7.1 新增分析维度
```typescript
// 分析服务插件化
interface AnalysisPlugin {
  id: string;
  name: string;
  analyze(baziData: BaziData): DimensionAnalysis;
}

// 注册新插件
analysisService.registerPlugin(new MarriageAnalysisPlugin());
```

### 7.2 新增AI流派
```typescript
// 流派配置扩展
interface SchoolConfig {
  id: string;
  // ...基础配置
  
  // 可扩展参数
  extensions?: {
    promptTemplate?: string;
    responseFormat?: 'text' | 'json' | 'markdown';
    maxTokens?: number;
  };
}
```

---

## 8. 部署架构

```
开发环境                    生产环境
─────────                  ─────────
localhost:3000      →      Vercel/Node
    │                            │
    ├─ Express Server            ├─ Express Server
    ├─ bazi-mcp (local)          ├─ bazi-mcp (npm)
    └─ AI SDK (dev key)          └─ AI SDK (prod key)
```

---

## 9. 监控与日志

```typescript
// 关键指标
- API响应时间
- MCP调用成功率
- AI对话Token消耗
- 错误率统计

// 日志级别
- ERROR: 系统错误
- WARN:  警告信息
- INFO:  业务流程
- DEBUG: 调试信息
```
