#!/bin/bash

# Vercel 部署诊断和修复脚本
set -e

echo "=========================================="
echo "   Vercel 部署诊断和修复脚本"
echo "=========================================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

cd "$(dirname "$0")"

echo ""
echo "1. 检查 TypeScript 编译..."
if [ ! -d "dist" ]; then
    echo -e "${YELLOW}dist 目录不存在，执行编译...${NC}"
    npm run build
else
    echo -e "${GREEN}dist 目录已存在${NC}"
fi

echo ""
echo "2. 检查编译输出文件..."
if [ ! -f "dist/server.js" ]; then
    echo -e "${RED}错误: dist/server.js 不存在${NC}"
    echo "重新编译..."
    npm run build
fi

if [ ! -f "dist/server.js" ]; then
    echo -e "${RED}编译失败，请检查 TypeScript 错误${NC}"
    exit 1
fi
echo -e "${GREEN}dist/server.js 存在${NC}"

echo ""
echo "3. 检查 server.js 是否包含 Vercel 兼容代码..."
if grep -q "process.env.VERCEL" "dist/server.js"; then
    echo -e "${GREEN}✓ 已包含 Vercel 环境检测代码${NC}"
else
    echo -e "${RED}✗ 缺少 Vercel 环境检测代码${NC}"
    echo "重新编译..."
    npm run build
fi

echo ""
echo "4. 检查 vercel.json 配置..."
if [ ! -f "vercel.json" ]; then
    echo -e "${YELLOW}创建 vercel.json...${NC}"
    cat > vercel.json << 'EOF'
{
  "version": 2,
  "builds": [
    {
      "src": "dist/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "dist/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "dist/server.js"
    }
  ]
}
EOF
    echo -e "${GREEN}vercel.json 已创建${NC}"
else
    echo -e "${GREEN}vercel.json 已存在${NC}"
    # 检查配置是否正确
    if grep -q '"src": "dist/server.js"' "vercel.json"; then
        echo -e "${GREEN}✓ vercel.json 配置正确${NC}"
    else
        echo -e "${YELLOW}! vercel.json 配置可能需要检查${NC}"
    fi
fi

echo ""
echo "5. 检查 public 目录..."
if [ ! -d "public" ]; then
    echo -e "${RED}警告: public 目录不存在${NC}"
else
    echo -e "${GREEN}public 目录存在${NC}"
    if [ ! -f "public/index.html" ]; then
        echo -e "${RED}警告: public/index.html 不存在${NC}"
    fi
fi

echo ""
echo "6. 检查 .gitignore..."
if grep -q "dist" .gitignore; then
    echo -e "${YELLOW}警告: .gitignore 中排除了 dist 目录${NC}"
    echo "   Vercel 需要访问 dist 目录进行构建"
    echo "   建议将 dist 从 .gitignore 中移除"
fi

echo ""
echo "7. 检查关键源文件..."
FILES=(
    "src/server.ts"
    "src/routes/bazi.routes.ts"
    "src/routes/analyze.routes.ts"
    "src/routes/ai.routes.ts"
    "src/ai/ai.service.ts"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ $file${NC}"
    else
        echo -e "${RED}✗ $file 缺失${NC}"
    fi
done

echo ""
echo "8. 检查路由配置..."
echo "   API 路由列表:"
grep -r "router.get\|router.post" src/routes/*.ts 2>/dev/null | grep -o "/[a-zA-Z0-9/]*" || echo "   无法解析路由"

echo ""
echo "=========================================="
echo "   诊断完成"
echo "=========================================="
echo ""
echo "如果 Git 集成已配置，请执行:"
echo "  git add ."
echo "  git commit -m 'Fix Vercel deployment'"
echo "  git push"
echo ""
echo "或者手动部署到 Vercel:"
echo "  npx vercel@latest --prod"
echo ""
