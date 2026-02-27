# GitHub 推送指南

## 快速推送（推荐）

### 方式一：使用 GitHub CLI

```bash
# 1. 登录 GitHub
gh auth login

# 2. 创建仓库并推送（在项目目录执行）
cd e:/ai_project/bazi/bazi-app
gh repo create bazi-analysis-app --public --source=. --push

# 或使用 HTTPS（推荐新手）
gh repo create bazi-analysis-app --public --source=. --push --remote=https
```

### 方式二：手动创建仓库并推送

**步骤 1：在 GitHub 创建仓库**
1. 打开 https://github.com/new
2. Repository name: `bazi-analysis-app`
3. 选择 Public（公开）或 Private（私有）
4. **不要**勾选 "Add a README file"
5. 点击 **Create repository**

**步骤 2：推送代码**
```bash
cd e:/ai_project/bazi/bazi-app

# 添加远程仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/bazi-analysis-app.git

# 推送代码
git push -u origin master
```

---

## 版本管理规范

### 分支策略
```
master (生产分支)
  ↑
develop (开发分支)
  ↑
feature/* (功能分支)
```

### 常用命令

```bash
# 查看状态
git status

# 查看提交历史
git log --oneline --graph

# 创建功能分支
git checkout -b feature/new-analysis

# 提交更改
git add .
git commit -m "feat: 新增XX功能"

# 推送分支
git push origin feature/new-analysis

# 合并到 master
git checkout master
git pull origin master
git merge feature/new-analysis
git push origin master

# 删除分支
git branch -d feature/new-analysis
```

### 提交规范（Conventional Commits）

| 类型 | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat: 新增健康分析维度` |
| `fix` | 修复问题 | `fix: 修复财富分析计算错误` |
| `docs` | 文档更新 | `docs: 更新API文档` |
| `style` | 代码格式 | `style: 格式化代码` |
| `refactor` | 重构 | `refactor: 优化分析算法` |
| `test` | 测试相关 | `test: 添加单元测试` |
| `chore` | 构建/工具 | `chore: 更新依赖` |

### 版本标签

```bash
# 创建版本标签
git tag -a v1.0.0 -m "初始版本发布"
git push origin v1.0.0

# 查看所有标签
git tag

# 删除标签
git tag -d v1.0.0
git push origin --delete v1.0.0
```

---

## 后续更新流程

### 标准开发流程

```bash
# 1. 拉取最新代码
git checkout master
git pull origin master

# 2. 创建功能分支
git checkout -b feature/xxx

# 3. 开发并提交
git add .
git commit -m "feat: xxx"

# 4. 推送分支
git push origin feature/xxx

# 5. 在 GitHub 创建 Pull Request 合并
# 或手动合并
git checkout master
git merge feature/xxx
git push origin master

# 6. 删除功能分支
git branch -d feature/xxx
git push origin --delete feature/xxx
```

---

## GitHub 功能配置

### 1. 添加议题模板

创建 `.github/ISSUE_TEMPLATE/bug_report.md`:
```markdown
---
name: Bug Report
about: 报告问题
title: '[Bug] '
labels: bug
assignees: ''
---

**描述问题**

**复现步骤**
1.
2.
3.

**期望行为**

**环境信息**
- Node.js 版本:
- 操作系统:
```

### 2. 添加 PR 模板

创建 `.github/pull_request_template.md`:
```markdown
## 变更内容

## 测试情况

## 检查清单
- [ ] 代码已测试
- [ ] 文档已更新
```

### 3. GitHub Actions CI（可选）

创建 `.github/workflows/ci.yml`:
```yaml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 22
      - run: npm install
      - run: npm run build
```

---

## 常见问题

### Q: 推送失败 "rejected: non-fast-forward"
```bash
git pull origin master --rebase
git push origin master
```

### Q: 修改最后一次提交
```bash
git commit --amend -m "新的提交信息"
git push origin master --force-with-lease
```

### Q: 撤销已推送的提交
```bash
# 查看提交历史
git log --oneline

# 撤销到指定版本（替换 COMMIT_HASH）
git revert COMMIT_HASH
git push origin master
```

---

## 相关链接

- [GitHub 官方文档](https://docs.github.com)
- [Git 官方文档](https://git-scm.com/doc)
- [Conventional Commits](https://www.conventionalcommits.org)

