# Vercel GitHub 集成部署指南

## 步骤 1: 在 Vercel Dashboard 中导入项目

1. 访问 https://vercel.com/new
2. 点击 "Import Git Repository"
3. 选择你的 GitHub 账号
4. 找到并选择 `bazi-analysis-app` 仓库
5. 点击 "Import"

## 步骤 2: 配置项目

在配置页面，确保以下设置：

- **Framework Preset**: Other
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 环境变量（可选）

如果需要，可以添加以下环境变量：
- `NODE_VERSION`: 22.x

## 步骤 3: 部署

点击 "Deploy" 按钮，等待部署完成。

## 步骤 4: 验证

部署完成后，访问提供的域名，测试以下 API：

```bash
# 健康检查
curl https://你的域名.vercel.app/api/health

# AI 配置
curl https://你的域名.vercel.app/api/ai/config

# 流派列表
curl https://你的域名.vercel.app/api/ai/schools
```

## 自动部署

配置完成后，每次推送代码到 GitHub main 分支，Vercel 会自动重新部署。

```bash
git add .
git commit -m "你的更改"
git push
```

## 故障排除

如果部署后遇到 "Not Found" 错误：

1. 检查 Vercel Dashboard 的构建日志
2. 确保 `vercel.json` 配置正确
3. 确保 `dist/server.js` 存在

## 项目文件结构

```
bazi-app/
├── dist/                  # 编译输出（由 Vercel 构建生成）
├── public/                # 静态文件
├── src/
│   ├── server.ts         # 入口文件
│   ├── routes/           # API 路由
│   ├── ai/               # AI 服务
│   └── ...
├── vercel.json           # Vercel 配置
├── package.json
└── tsconfig.json
```
