#!/bin/bash

# Vercel 项目初始化和部署脚本
set -e

echo "=========================================="
echo "   Vercel 项目初始化和部署"
echo "=========================================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

cd "$(dirname "$0")"

# 检查是否已登录
echo ""
echo -e "${BLUE}1. 检查 Vercel 登录状态...${NC}"
if ! npx vercel@latest whoami 2>/dev/null; then
    echo -e "${YELLOW}请先登录 Vercel:${NC}"
    echo "  npx vercel@latest login"
    exit 1
fi
echo -e "${GREEN}✓ 已登录 Vercel${NC}"

# 检查项目是否已关联
echo ""
echo -e "${BLUE}2. 检查 Vercel 项目配置...${NC}"
if [ ! -d ".vercel" ]; then
    echo -e "${YELLOW}项目未关联到 Vercel，开始初始化...${NC}"
    echo ""
    echo "请选择:"
    echo "1) 链接到现有项目"
    echo "2) 创建新项目"
    read -p "请输入选项 (1/2): " choice

    if [ "$choice" = "1" ]; then
        npx vercel@latest link
    else
        npx vercel@latest
    fi
else
    echo -e "${GREEN}✓ 项目已关联到 Vercel${NC}"
fi

# 编译项目
echo ""
echo -e "${BLUE}3. 编译项目...${NC}"
npm run build
echo -e "${GREEN}✓ 编译完成${NC}"

# 部署到生产环境
echo ""
echo -e "${BLUE}4. 部署到 Vercel 生产环境...${NC}"
npx vercel@latest --prod

echo ""
echo "=========================================="
echo -e "${GREEN}   部署完成!${NC}"
echo "=========================================="
echo ""
echo "请访问 Vercel Dashboard 查看部署状态:"
echo "  https://vercel.com/dashboard"
echo ""
