# 八字分析应用 V3 - 自定义派别系统需求文档

> 版本: V3.0
> 作者: 八字大师顾问
> 日期: 2026-03-05
> 状态: 需求设计阶段

---

## 目录

1. [八字推断核心维度分析](#1-八字推断核心维度分析)
2. [主要命理流派对比](#2-主要命理流派对比)
3. [AI风格参数设计](#3-ai风格参数设计)
4. [自定义派别配置结构](#4-自定义派别配置结构)
5. [典型分析风格示例](#5-典型分析风格示例)
6. [对产品经理的建议](#6-对产品经理的建议)

---

## 1. 八字推断核心维度分析

八字推断是一个多维度、多层次的复杂系统。要让AI能够"学习"不同大师的风格，首先需要明确八字推断中包含哪些核心分析维度。

### 1.1 基础分析维度（必做）

| 维度编号 | 维度名称 | 核心内容 | 权重建议 |
|---------|---------|---------|---------|
| D1 | **日主强弱** | 得令、得地、得势的判断 | 极高 |
| D2 | **格局判定** | 正格/变格/从格的识别 | 极高 |
| D3 | **用神选取** | 扶抑用神、调候用神、通关用神 | 极高 |
| D4 | **十神分析** | 十神配置、喜忌、作用关系 | 高 |
| D5 | **神煞系统** | 吉神凶煞的识别与解读 | 中 |
| D6 | **刑冲合会** | 地支作用关系的分析 | 高 |
| D7 | **大运流年** | 运势周期的推演 | 高 |
| D8 | **寒暖燥湿** | 调候用神的选取依据 | 中 |

### 1.2 进阶分析维度（选做）

| 维度编号 | 维度名称 | 核心内容 | 应用场景 |
|---------|---------|---------|---------|
| A1 | **纳音五行** | 六十甲子纳音的辅助判断 | 传统派别 |
| A2 | **胎元命宫** | 胎元、命宫的配合分析 | 紫微配合 |
| A3 | **空亡理论** | 空亡的识别与填实 | 新派、盲派 |
| A4 | **墓库理论** | 辰戌丑未的特殊处理 | 盲派、新派 |
| A5 | **反断理论** | 喜忌反转的特殊情况 | 新派 |
| A6 | **百神理论** | 十神的多重含义 | 新派 |
| A7 | **做功效率** | 能量流动的效率评估 | 盲派 |
| A8 | **宾主体用** | 主客关系的界定 | 盲派 |

### 1.3 分析维度的优先级排序

```
极高优先级（核心骨架）:
  ├── 日主强弱判断
  ├── 格局类型判定
  └── 用神忌神确定

高优先级（血肉填充）:
  ├── 十神作用关系
  ├── 刑冲合会分析
  └── 大运流年推演

中优先级（细节完善）:
  ├── 神煞系统
  ├── 寒暖燥湿调候
  └── 纳音五行

低优先级（锦上添花）:
  ├── 胎元命宫
  ├── 空亡墓库
  └── 特殊理论（反断、百神等）
```

---

## 2. 主要命理流派对比

现有系统已支持五大流派，V3版本需要更深入地理解各流派的核心差异。

### 2.1 五大流派核心差异对照表

| 对比维度 | 旺衰派 | 子平派 | 盲派 | 格局派 | 新派 |
|---------|--------|--------|------|--------|------|
| **核心理论** | 日主强弱 | 月令定格 | 做功效率 | 格局成败 | 百神反断 |
| **分析起点** | 日主旺衰 | 月令十神 | 宾主体用 | 格局类型 | 月令受制 |
| **用神选取** | 扶抑调候 | 格局用神 | 效率优先 | 相神配合 | 反断论 |
| **术语风格** | 身旺身弱 | 正官七杀 | 做功寻根基 | 成格破格 | 实神虚神 |
| **实战特点** | 平衡调和 | 经典正统 | 铁口直断 | 层次分明 | 现代创新 |
| **学习难度** | ★★☆☆☆ | ★★★☆☆ | ★★★★★ | ★★★★☆ | ★★★☆☆ |
| **适合人群** | 初学者 | 进阶者 | 专业人士 | 研究者 | 现代用户 |

### 2.2 各流派分析侧重点详解

#### 2.2.1 旺衰派 - "平衡之道"

```
分析流程:
1. 判断日主强弱（得令、得地、得势）
2. 确定喜用神（扶抑 + 调候）
3. 分析五行平衡状态
4. 结合大运流年看平衡变化

核心口诀:
- "身旺宜克泄耗，身弱宜生扶"
- "调候为先，扶抑为次"
- "过旺宜泄，过弱宜扶"

输出特点:
- 强调"平衡"概念
- 给出具体调理建议（颜色、方位、数字）
- 语言通俗易懂
```

#### 2.2.2 子平派 - "格局正统"

```
分析流程:
1. 月令定格（八正格 + 变格）
2. 分析天干透出与地支藏干
3. 判断格局成败（成格/破格）
4. 结合神煞定层次

核心口诀:
- "月令为提纲，定格用相"
- "成格者贵，破格者贱"
- "格局清纯为佳，混杂为病"

输出特点:
- 使用传统术语（正官、七杀、正印等）
- 强调格局层次（上中下三等）
- 语言古典雅致
```

#### 2.2.3 盲派 - "实战为王"

```
分析流程:
1. 确定宾主关系（日干为主）
2. 分析做功路径（能量流动）
3. 评估做功效率
4. 直接断具体事件

核心口诀:
- "宾主分明，体用清晰"
- "做功有力，效率优先"
- "寻根基，看出处"

输出特点:
- 直接断事，少说理论
- 重视具体事件（婚姻、财运、官运）
- 语言简练，铁口直断
```

#### 2.2.4 格局派 - "层次分明"

```
分析流程:
1. 精细定格（正格、变格、从格）
2. 分析用神与相神配合
3. 判断格局清浊纯杂
4. 定命运层次

核心口诀:
- "格局决定层次"
- "成格者富或贵"
- "清格上，浊格下"

输出特点:
- 深入分析格局成败原因
- 明确命运层次划分
- 语言专业严谨
```

#### 2.2.5 新派 - "现代创新"

```
分析流程:
1. 分析月令受制情况
2. 应用百神论确定十神
3. 必要时使用反断论
4. 结合现代社会特点解读

核心口诀:
- "月令受制，格局变化"
- "百神论，一神多义"
- "反断论，喜忌反转"

输出特点:
- 使用现代语言
- 结合现代社会职业、生活方式
- 适合年轻用户理解
```

---

## 3. AI风格参数设计

要让AI能够学习某个大师的风格，需要将"风格"量化为可配置的参数。

### 3.1 风格参数体系架构

```
风格参数体系
├── 分析维度权重 (Dimension Weights)
│   ├── 日主强弱权重
│   ├── 格局判定权重
│   ├── 用神选取权重
│   └── ...
├── 术语偏好设置 (Terminology Preferences)
│   ├── 传统术语比例
│   ├── 现代术语比例
│   └── 口语化程度
├── 分析深度设置 (Analysis Depth)
│   ├── 基础层（结论为主）
│   ├── 进阶层（推理过程）
│   └── 专家层（详细论证）
├── 表达方式设置 (Expression Style)
│   ├── 直接程度（委婉 ↔ 直接）
│   ├── 详细程度（简略 ↔ 详尽）
│   └── 肯定程度（推测 ↔ 确定）
└── 特殊理论开关 (Special Theories)
    ├── 空亡论
    ├── 墓库论
    ├── 反断论
    └── 百神论
```

### 3.2 详细参数定义

#### 3.2.1 分析维度权重 (dimensionWeights)

| 参数名 | 类型 | 范围 | 默认值 | 说明 |
|-------|------|------|--------|------|
| `dayMasterStrength` | number | 0-100 | 100 | 日主强弱分析权重 |
| `patternAnalysis` | number | 0-100 | 90 | 格局判定权重 |
| `yongShenSelection` | number | 0-100 | 95 | 用神选取权重 |
| `shiShenAnalysis` | number | 0-100 | 85 | 十神分析权重 |
| `shenShaAnalysis` | number | 0-100 | 50 | 神煞分析权重 |
| `relationAnalysis` | number | 0-100 | 80 | 刑冲合会权重 |
| `luckCycleAnalysis` | number | 0-100 | 85 | 大运流年权重 |
| `climateAnalysis` | number | 0-100 | 60 | 寒暖燥湿权重 |
| `naYinAnalysis` | number | 0-100 | 30 | 纳音分析权重 |
| `kongWangAnalysis` | number | 0-100 | 40 | 空亡分析权重 |
| `muKuAnalysis` | number | 0-100 | 40 | 墓库分析权重 |

#### 3.2.2 术语偏好设置 (terminology)

| 参数名 | 类型 | 选项 | 默认值 | 说明 |
|-------|------|------|--------|------|
| `style` | enum | traditional/modern/mixed | mixed | 术语风格 |
| `traditionalRatio` | number | 0-100 | 50 | 传统术语比例 |
| `modernRatio` | number | 0-100 | 50 | 现代术语比例 |
| `colloquialism` | number | 0-100 | 30 | 口语化程度 |

#### 3.2.3 分析深度设置 (analysisDepth)

| 参数名 | 类型 | 选项 | 默认值 | 说明 |
|-------|------|------|--------|------|
| `level` | enum | basic/advanced/expert | advanced | 分析深度级别 |
| `showReasoning` | boolean | true/false | true | 是否展示推理过程 |
| `showExamples` | boolean | true/false | true | 是否举例说明 |
| `detailLevel` | number | 1-5 | 3 | 详细程度 1-5 |

#### 3.2.4 表达方式设置 (expressionStyle)

| 参数名 | 类型 | 范围 | 默认值 | 说明 |
|-------|------|------|--------|------|
| `directness` | number | 0-100 | 70 | 直接程度（0=委婉，100=直接） |
| `verbosity` | number | 0-100 | 60 | 详细程度（0=简略，100=详尽） |
| `certainty` | number | 0-100 | 60 | 肯定程度（0=推测，100=确定） |
| `focusOnEvents` | boolean | true/false | false | 是否侧重具体事件 |
| `focusOnTheory` | boolean | true/false | true | 是否侧重理论解释 |

#### 3.2.5 特殊理论开关 (specialTheories)

| 参数名 | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| `enableKongWang` | boolean | false | 启用空亡论 |
| `enableMuKu` | boolean | false | 启用墓库论 |
| `enableFanDuan` | boolean | false | 启用反断论 |
| `enableBaiShen` | boolean | false | 启用百神论 |
| `enableZuoGong` | boolean | false | 启用做功理论 |
| `enableBinZhu` | boolean | false | 启用宾主理论 |

#### 3.2.6 用神选取偏好 (yongShenPreference)

| 参数名 | 类型 | 选项 | 默认值 | 说明 |
|-------|------|------|--------|------|
| `primaryMethod` | enum | fuyi/tiaohou/tongguan/geju | fuyi | 主要用神方法 |
| `fuyiWeight` | number | 0-100 | 80 | 扶抑用神权重 |
| `tiaohouWeight` | number | 0-100 | 60 | 调候用神权重 |
| `tongguanWeight` | number | 0-100 | 40 | 通关用神权重 |
| `gejuWeight` | number | 0-100 | 70 | 格局用神权重 |

---

## 4. 自定义派别配置结构

基于上述参数设计，以下是完整的JSON配置结构示例。

### 4.1 配置结构Schema

```typescript
// 自定义派别配置接口
interface CustomSchoolConfig {
  // 基础信息
  id: string;                    // 唯一标识
  name: string;                  // 派别名称
  description: string;           // 派别描述
  author: string;                // 创建者
  version: string;               // 版本号
  createdAt: string;             // 创建时间
  updatedAt: string;             // 更新时间
  
  // 派别特征
  difficulty: 1 | 2 | 3 | 4 | 5; // 学习难度
  tags: string[];                // 标签
  
  // 核心配置
  dimensionWeights: DimensionWeights;
  terminology: TerminologyConfig;
  analysisDepth: AnalysisDepthConfig;
  expressionStyle: ExpressionStyleConfig;
  specialTheories: SpecialTheoriesConfig;
  yongShenPreference: YongShenPreferenceConfig;
  
  // 系统提示词模板
  systemPromptTemplate: string;
  
  // 示例对话（用于Few-shot学习）
  exampleConversations: ExampleConversation[];
}

// 各子配置接口
interface DimensionWeights {
  dayMasterStrength: number;
  patternAnalysis: number;
  yongShenSelection: number;
  shiShenAnalysis: number;
  shenShaAnalysis: number;
  relationAnalysis: number;
  luckCycleAnalysis: number;
  climateAnalysis: number;
  naYinAnalysis: number;
  kongWangAnalysis: number;
  muKuAnalysis: number;
}

interface TerminologyConfig {
  style: 'traditional' | 'modern' | 'mixed';
  traditionalRatio: number;
  modernRatio: number;
  colloquialism: number;
}

interface AnalysisDepthConfig {
  level: 'basic' | 'advanced' | 'expert';
  showReasoning: boolean;
  showExamples: boolean;
  detailLevel: number;
}

interface ExpressionStyleConfig {
  directness: number;
  verbosity: number;
  certainty: number;
  focusOnEvents: boolean;
  focusOnTheory: boolean;
}

interface SpecialTheoriesConfig {
  enableKongWang: boolean;
  enableMuKu: boolean;
  enableFanDuan: boolean;
  enableBaiShen: boolean;
  enableZuoGong: boolean;
  enableBinZhu: boolean;
}

interface YongShenPreferenceConfig {
  primaryMethod: 'fuyi' | 'tiaohou' | 'tongguan' | 'geju';
  fuyiWeight: number;
  tiaohouWeight: number;
  tongguanWeight: number;
  gejuWeight: number;
}

interface ExampleConversation {
  user: string;
  assistant: string;
  description: string;
}
```

### 4.2 完整JSON配置示例

```json
{
  "id": "custom-wangshuai-enhanced",
  "name": "旺衰派·增强版",
  "description": "在传统旺衰派基础上，增加调候和通关用神的权重，更适合现代复杂命局分析",
  "author": "八字大师",
  "version": "1.0.0",
  "createdAt": "2026-03-05",
  "updatedAt": "2026-03-05",
  "difficulty": 2,
  "tags": ["旺衰", "调候", "现代", "入门友好"],
  
  "dimensionWeights": {
    "dayMasterStrength": 100,
    "patternAnalysis": 70,
    "yongShenSelection": 95,
    "shiShenAnalysis": 80,
    "shenShaAnalysis": 40,
    "relationAnalysis": 75,
    "luckCycleAnalysis": 85,
    "climateAnalysis": 90,
    "naYinAnalysis": 20,
    "kongWangAnalysis": 30,
    "muKuAnalysis": 30
  },
  
  "terminology": {
    "style": "mixed",
    "traditionalRatio": 60,
    "modernRatio": 40,
    "colloquialism": 40
  },
  
  "analysisDepth": {
    "level": "advanced",
    "showReasoning": true,
    "showExamples": true,
    "detailLevel": 3
  },
  
  "expressionStyle": {
    "directness": 65,
    "verbosity": 60,
    "certainty": 55,
    "focusOnEvents": false,
    "focusOnTheory": true
  },
  
  "specialTheories": {
    "enableKongWang": false,
    "enableMuKu": false,
    "enableFanDuan": false,
    "enableBaiShen": false,
    "enableZuoGong": false,
    "enableBinZhu": false
  },
  
  "yongShenPreference": {
    "primaryMethod": "fuyi",
    "fuyiWeight": 85,
    "tiaohouWeight": 75,
    "tongguanWeight": 50,
    "gejuWeight": 40
  },
  
  "systemPromptTemplate": "你是{{schoolName}}八字命理大师。{{corePrinciples}}\n\n分析维度权重配置：\n{{dimensionWeightsDescription}}\n\n术语风格：{{terminologyDescription}}\n\n分析深度：{{analysisDepthDescription}}\n\n表达方式：{{expressionStyleDescription}}\n\n特殊理论：{{specialTheoriesDescription}}\n\n用神选取偏好：{{yongShenPreferenceDescription}}\n\n当前八字信息：\n- 八字：{{bazi}}\n- 日主：{{dayMaster}}\n- 性别：{{gender}}\n- 生肖：{{zodiac}}\n\n请基于上述配置风格进行分析和解答。",
  
  "exampleConversations": [
    {
      "user": "请分析我的八字喜用神",
      "assistant": "根据您的八字，首先需要判断日主强弱...\n[详细分析过程]\n因此，您的喜用神为...",
      "description": "喜用神分析示例"
    }
  ]
}
```

### 4.3 配置继承机制

为了便于用户创建派别，建议支持配置继承：

```json
{
  "id": "my-custom-school",
  "name": "我的自定义派别",
  "description": "基于旺衰派的个性化调整",
  "extends": "wangshuai",  // 继承自旺衰派
  
  "overrides": {
    // 只覆盖需要修改的配置
    "dimensionWeights": {
      "climateAnalysis": 95
    },
    "expressionStyle": {
      "directness": 80
    }
  }
}
```

---

## 5. 典型分析风格示例

以下是5个典型的分析风格示例，可直接作为模板使用。

### 5.1 传统保守型

```json
{
  "id": "style-traditional",
  "name": "传统保守型",
  "description": "严格遵循古法，重视经典格局，术语传统，论证严谨",
  "difficulty": 4,
  "tags": ["传统", "经典", "严谨", "学术"],
  
  "dimensionWeights": {
    "dayMasterStrength": 80,
    "patternAnalysis": 100,
    "yongShenSelection": 90,
    "shiShenAnalysis": 90,
    "shenShaAnalysis": 70,
    "relationAnalysis": 85,
    "luckCycleAnalysis": 80,
    "climateAnalysis": 75,
    "naYinAnalysis": 60,
    "kongWangAnalysis": 40,
    "muKuAnalysis": 30
  },
  
  "terminology": {
    "style": "traditional",
    "traditionalRatio": 95,
    "modernRatio": 5,
    "colloquialism": 10
  },
  
  "analysisDepth": {
    "level": "expert",
    "showReasoning": true,
    "showExamples": false,
    "detailLevel": 5
  },
  
  "expressionStyle": {
    "directness": 50,
    "verbosity": 80,
    "certainty": 70,
    "focusOnEvents": false,
    "focusOnTheory": true
  },
  
  "specialTheories": {
    "enableKongWang": true,
    "enableMuKu": false,
    "enableFanDuan": false,
    "enableBaiShen": false,
    "enableZuoGong": false,
    "enableBinZhu": false
  },
  
  "yongShenPreference": {
    "primaryMethod": "geju",
    "fuyiWeight": 60,
    "tiaohouWeight": 70,
    "tongguanWeight": 50,
    "gejuWeight": 90
  }
}
```

**风格特点**：
- 严格遵循《渊海子平》《三命通会》等经典
- 重视月令定格，格局成败分析详尽
- 使用传统术语（正官、七杀、正印等）
- 论证过程严谨，引用经典
- 适合学术研究和传统命理爱好者

---

### 5.2 现代实用型

```json
{
  "id": "style-modern-practical",
  "name": "现代实用型",
  "description": "结合现代社会特点，注重实用性，语言通俗，建议具体",
  "difficulty": 2,
  "tags": ["现代", "实用", "通俗", "入门"],
  
  "dimensionWeights": {
    "dayMasterStrength": 100,
    "patternAnalysis": 60,
    "yongShenSelection": 90,
    "shiShenAnalysis": 85,
    "shenShaAnalysis": 30,
    "relationAnalysis": 70,
    "luckCycleAnalysis": 80,
    "climateAnalysis": 60,
    "naYinAnalysis": 10,
    "kongWangAnalysis": 20,
    "muKuAnalysis": 20
  },
  
  "terminology": {
    "style": "modern",
    "traditionalRatio": 30,
    "modernRatio": 70,
    "colloquialism": 70
  },
  
  "analysisDepth": {
    "level": "basic",
    "showReasoning": false,
    "showExamples": true,
    "detailLevel": 2
  },
  
  "expressionStyle": {
    "directness": 75,
    "verbosity": 40,
    "certainty": 60,
    "focusOnEvents": true,
    "focusOnTheory": false
  },
  
  "specialTheories": {
    "enableKongWang": false,
    "enableMuKu": false,
    "enableFanDuan": false,
    "enableBaiShen": false,
    "enableZuoGong": false,
    "enableBinZhu": false
  },
  
  "yongShenPreference": {
    "primaryMethod": "fuyi",
    "fuyiWeight": 90,
    "tiaohouWeight": 60,
    "tongguanWeight": 40,
    "gejuWeight": 30
  }
}
```

**风格特点**：
- 语言通俗易懂，避免过多术语
- 结合现代职业、生活方式解读
- 给出具体可行的建议（职业选择、发展方向等）
- 重视实用性，少说理论
- 适合现代年轻人和初学者

---

### 5.3 学术研究型

```json
{
  "id": "style-academic",
  "name": "学术研究型",
  "description": "深入理论探讨，多角度对比，引经据典，适合专业研究",
  "difficulty": 5,
  "tags": ["学术", "研究", "深入", "专业"],
  
  "dimensionWeights": {
    "dayMasterStrength": 90,
    "patternAnalysis": 95,
    "yongShenSelection": 95,
    "shiShenAnalysis": 90,
    "shenShaAnalysis": 60,
    "relationAnalysis": 90,
    "luckCycleAnalysis": 85,
    "climateAnalysis": 80,
    "naYinAnalysis": 50,
    "kongWangAnalysis": 50,
    "muKuAnalysis": 40
  },
  
  "terminology": {
    "style": "traditional",
    "traditionalRatio": 90,
    "modernRatio": 10,
    "colloquialism": 20
  },
  
  "analysisDepth": {
    "level": "expert",
    "showReasoning": true,
    "showExamples": true,
    "detailLevel": 5
  },
  
  "expressionStyle": {
    "directness": 60,
    "verbosity": 95,
    "certainty": 50,
    "focusOnEvents": false,
    "focusOnTheory": true
  },
  
  "specialTheories": {
    "enableKongWang": true,
    "enableMuKu": true,
    "enableFanDuan": true,
    "enableBaiShen": true,
    "enableZuoGong": true,
    "enableBinZhu": true
  },
  
  "yongShenPreference": {
    "primaryMethod": "tongguan",
    "fuyiWeight": 70,
    "tiaohouWeight": 70,
    "tongguanWeight": 80,
    "gejuWeight": 80
  }
}
```

**风格特点**：
- 多角度分析，对比不同流派观点
- 引经据典，注明出处
- 对争议问题列出不同观点
- 论证过程详细，逻辑严密
- 适合专业研究者和深度学习者

---

### 5.4 铁口直断型

```json
{
  "id": "style-direct",
  "name": "铁口直断型",
  "description": "盲派风格，直接断事，少说理论，重视具体事件预测",
  "difficulty": 5,
  "tags": ["盲派", "实战", "直接", "事件"],
  
  "dimensionWeights": {
    "dayMasterStrength": 70,
    "patternAnalysis": 50,
    "yongShenSelection": 60,
    "shiShenAnalysis": 80,
    "shenShaAnalysis": 60,
    "relationAnalysis": 90,
    "luckCycleAnalysis": 95,
    "climateAnalysis": 40,
    "naYinAnalysis": 30,
    "kongWangAnalysis": 70,
    "muKuAnalysis": 60
  },
  
  "terminology": {
    "style": "mixed",
    "traditionalRatio": 50,
    "modernRatio": 50,
    "colloquialism": 60
  },
  
  "analysisDepth": {
    "level": "advanced",
    "showReasoning": false,
    "showExamples": false,
    "detailLevel": 3
  },
  
  "expressionStyle": {
    "directness": 95,
    "verbosity": 30,
    "certainty": 85,
    "focusOnEvents": true,
    "focusOnTheory": false
  },
  
  "specialTheories": {
    "enableKongWang": true,
    "enableMuKu": true,
    "enableFanDuan": false,
    "enableBaiShen": false,
    "enableZuoGong": true,
    "enableBinZhu": true
  },
  
  "yongShenPreference": {
    "primaryMethod": "fuyi",
    "fuyiWeight": 60,
    "tiaohouWeight": 40,
    "tongguanWeight": 60,
    "gejuWeight": 30
  }
}
```

**风格特点**：
- 直接给出结论，少说推理过程
- 重视具体事件预测（婚姻、财运、官运等）
- 语言简练，一针见血
- 使用盲派特有的做功、宾主等概念
- 适合追求实战效果的用户

---

### 5.5 温和指导型

```json
{
  "id": "style-gentle",
  "name": "温和指导型",
  "description": "语气温和，注重心理疏导，给出建设性建议，适合咨询场景",
  "difficulty": 2,
  "tags": ["温和", "心理", "建设性", "咨询"],
  
  "dimensionWeights": {
    "dayMasterStrength": 90,
    "patternAnalysis": 70,
    "yongShenSelection": 85,
    "shiShenAnalysis": 80,
    "shenShaAnalysis": 40,
    "relationAnalysis": 70,
    "luckCycleAnalysis": 80,
    "climateAnalysis": 70,
    "naYinAnalysis": 20,
    "kongWangAnalysis": 30,
    "muKuAnalysis": 20
  },
  
  "terminology": {
    "style": "modern",
    "traditionalRatio": 40,
    "modernRatio": 60,
    "colloquialism": 80
  },
  
  "analysisDepth": {
    "level": "advanced",
    "showReasoning": true,
    "showExamples": true,
    "detailLevel": 3
  },
  
  "expressionStyle": {
    "directness": 30,
    "verbosity": 70,
    "certainty": 40,
    "focusOnEvents": false,
    "focusOnTheory": false
  },
  
  "specialTheories": {
    "enableKongWang": false,
    "enableMuKu": false,
    "enableFanDuan": false,
    "enableBaiShen": false,
    "enableZuoGong": false,
    "enableBinZhu": false
  },
  
  "yongShenPreference": {
    "primaryMethod": "fuyi",
    "fuyiWeight": 85,
    "tiaohouWeight": 70,
    "tongguanWeight": 50,
    "gejuWeight": 40
  }
}
```

**风格特点**：
- 语气温和，避免过于绝对的判断
- 注重心理疏导和情绪安抚
- 给出建设性建议，强调主观能动性
- 用积极正面的方式解读命局
- 适合心理咨询和人生指导场景

---

## 6. 对产品经理的建议

### 6.1 功能优先级排序

#### P0 - 核心功能（必须实现）

| 优先级 | 功能 | 说明 | 预估工期 |
|-------|------|------|---------|
| P0 | 分析维度权重配置 | 让用户调整各分析维度的重要性 | 3天 |
| P0 | 术语风格切换 | 传统/现代/混合三种模式 | 2天 |
| P0 | 分析深度设置 | 基础/进阶/专家三级 | 2天 |
| P0 | 表达方式调节 | 直接程度、详细程度滑块 | 2天 |

#### P1 - 重要功能（强烈建议）

| 优先级 | 功能 | 说明 | 预估工期 |
|-------|------|------|---------|
| P1 | 特殊理论开关 | 空亡、墓库、反断等理论的启用/禁用 | 3天 |
| P1 | 用神选取偏好 | 扶抑/调候/通关/格局的权重设置 | 2天 |
| P1 | 配置保存/加载 | 用户可保存自定义配置 | 2天 |
| P1 | 5个预设模板 | 提供5种典型风格模板 | 1天 |

#### P2 - 增强功能（建议实现）

| 优先级 | 功能 | 说明 | 预估工期 |
|-------|------|------|---------|
| P2 | 配置继承机制 | 基于现有派别进行微调 | 3天 |
| P2 | 示例对话配置 | 支持Few-shot示例设置 | 3天 |
| P2 | 配置分享功能 | 用户可分享自定义派别 | 2天 |
| P2 | 配置市场 | 浏览和使用他人分享的派别 | 5天 |

#### P3 - 高级功能（可选）

| 优先级 | 功能 | 说明 | 预估工期 |
|-------|------|------|---------|
| P3 | AI自动调参 | 根据用户反馈自动优化参数 | 7天 |
| P3 | 风格克隆 | 通过分析大师案例自动提取风格 | 10天 |
| P3 | 多风格对比 | 同一八字用不同风格分析对比 | 3天 |

### 6.2 UI/UX设计建议

#### 6.2.1 配置界面布局

```
+------------------+------------------+
|   派别基本信息    |   实时预览区      |
|   (名称/描述)     |   (效果预览)      |
+------------------+------------------+
|                                     |
|        分析维度权重配置              |
|   [滑块] 日主强弱: [====●====] 85%  |
|   [滑块] 格局判定: [===●=====] 70%  |
|   ...                               |
+-------------------------------------+
|        术语偏好设置                 |
|   [单选] ○ 传统  ○ 现代  ● 混合     |
|   [滑块] 传统比例: [====●====] 60%  |
|   [滑块] 口语化:   [==●======] 30%  |
+-------------------------------------+
|        分析深度设置                 |
|   [单选] ○ 基础  ● 进阶  ○ 专家     |
|   [勾选] ☑ 展示推理过程             |
|   [勾选] ☑ 举例说明                 |
+-------------------------------------+
|        表达方式设置                 |
|   [滑块] 直接程度: [====●====] 70%  |
|   [滑块] 详细程度: [===●=====] 60%  |
|   [滑块] 肯定程度: [===●=====] 60%  |
+-------------------------------------+
|        特殊理论开关                 |
|   [开关] 空亡论  [关]               |
|   [开关] 墓库论  [关]               |
|   [开关] 反断论  [关]               |
|   ...                               |
+-------------------------------------+
|   [保存配置]  [重置]  [测试效果]     |
+-------------------------------------+
```

#### 6.2.2 交互设计要点

1. **实时预览**：调整参数后，右侧实时显示一个示例八字的分析效果
2. **预设模板**：顶部提供5个预设模板按钮，一键切换
3. **参数说明**：每个参数旁边有问号图标，hover显示说明
4. **冲突检测**：当参数设置有冲突时（如传统术语+高口语化），给出提示
5. **版本管理**：保存的配置可以命名、编辑、删除

### 6.3 技术实现建议

#### 6.3.1 后端架构调整

```typescript
// 扩展现有的 SchoolConfig 接口
interface SchoolConfig {
  id: string;
  name: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  characteristics: string[];
  
  // 新增：风格参数配置
  styleParams: StyleParameters;
  
  // 修改：系统提示词改为动态生成
  getSystemPrompt(baziData: BaziData): string;
}

// 风格参数接口
interface StyleParameters {
  dimensionWeights: DimensionWeights;
  terminology: TerminologyConfig;
  analysisDepth: AnalysisDepthConfig;
  expressionStyle: ExpressionStyleConfig;
  specialTheories: SpecialTheoriesConfig;
  yongShenPreference: YongShenPreferenceConfig;
}
```

#### 6.3.2 系统提示词动态生成

```typescript
function generateSystemPrompt(
  styleParams: StyleParameters,
  baseSchool: string,
  baziData: BaziData
): string {
  const parts: string[] = [];
  
  // 1. 基础身份定义
  parts.push(`你是${baseSchool}八字命理大师。`);
  
  // 2. 核心原则（根据baseSchool）
  parts.push(getCorePrinciples(baseSchool));
  
  // 3. 分析维度权重说明
  parts.push(generateDimensionWeightsDescription(styleParams.dimensionWeights));
  
  // 4. 术语风格说明
  parts.push(generateTerminologyDescription(styleParams.terminology));
  
  // 5. 分析深度说明
  parts.push(generateAnalysisDepthDescription(styleParams.analysisDepth));
  
  // 6. 表达方式说明
  parts.push(generateExpressionStyleDescription(styleParams.expressionStyle));
  
  // 7. 特殊理论说明
  parts.push(generateSpecialTheoriesDescription(styleParams.specialTheories));
  
  // 8. 用神选取偏好
  parts.push(generateYongShenPreferenceDescription(styleParams.yongShenPreference));
  
  // 9. 当前八字信息
  parts.push(generateBaziInfo(baziData));
  
  return parts.join('\n\n');
}
```

### 6.4 运营建议

#### 6.4.1 用户引导策略

1. **新手引导**：首次使用推荐从预设模板开始
2. **渐进式开放**：基础参数默认开放，高级参数需要完成教程解锁
3. **案例学习**：提供著名命理大师的风格案例分析
4. **社区互动**：建立用户分享配置的市场，优质配置可获得推荐

#### 6.4.2 商业模式建议

| 功能 | 免费用户 | 付费用户 |
|------|---------|---------|
| 预设模板 | 5个 | 20+个 |
| 自定义配置 | 1个 | 无限 |
| 配置分享 | 只读 | 可分享 |
| 配置市场 | 浏览 | 上传+下载 |
| 高级参数 | 部分 | 全部 |

### 6.5 风险提示

1. **参数冲突**：某些参数组合可能产生矛盾效果（如高传统术语+高口语化），需要冲突检测机制
2. **过度定制**：过多参数可能让用户感到困惑，需要提供合理的默认值
3. **效果不稳定**：AI对参数的理解可能不如预期，需要充分的测试和调优
4. **命理准确性**：风格参数影响的是表达方式，不应影响命理判断的准确性

---

## 附录：术语对照表

| 传统术语 | 现代术语 | 英文翻译 |
|---------|---------|---------|
| 日主 | 日元/命主 | Day Master |
| 身旺 | 日主强 | Strong Day Master |
| 身弱 | 日主弱 | Weak Day Master |
| 用神 | 有利元素 | Favorable Element |
| 忌神 | 不利元素 | Unfavorable Element |
| 扶抑 | 补强/抑制 | Support/Suppress |
| 调候 | 气候调节 | Climate Adjustment |
| 通关 | 调和 | Mediation |
| 格局 | 命局类型 | Pattern/Structure |
| 十神 | 十类关系 | Ten Gods |
| 刑冲合会 | 地支作用 | Branch Interactions |
| 大运 | 十年运势 | Major Luck Cycle |
| 流年 | 年度运势 | Annual Luck |

---

## 文档版本历史

| 版本 | 日期 | 作者 | 变更说明 |
|------|------|------|---------|
| 1.0.0 | 2026-03-05 | 八字大师 | 初始版本，完成核心需求设计 |

---

> **结语**：自定义派别系统的核心目标是让AI能够"学习"不同命理大师的分析风格，同时保持命理判断的准确性。通过量化的参数配置，用户可以根据自己的偏好调整AI的分析方式，获得更个性化的解盘体验。
