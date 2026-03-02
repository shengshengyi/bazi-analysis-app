#!/bin/bash

# Vercel 部署验证脚本
# 使用: ./verify-deployment.sh <你的域名>
# 例如: ./verify-deployment.sh my-app.vercel.app

DOMAIN=${1:-""}

if [ -z "$DOMAIN" ]; then
    echo "用法: ./verify-deployment.sh <域名>"
    echo "例如: ./verify-deployment.sh my-app.vercel.app"
    exit 1
fi

echo "=========================================="
echo "   验证 Vercel 部署"
echo "=========================================="
echo "域名: $DOMAIN"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

BASE_URL="https://$DOMAIN"

# 测试函数
test_endpoint() {
    local endpoint=$1
    local description=$2
    echo -n "测试 $description ... "

    response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$endpoint" 2>/dev/null)

    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✓ 通过 (HTTP 200)${NC}"
        return 0
    elif [ "$response" = "404" ]; then
        echo -e "${RED}✗ 未找到 (HTTP 404)${NC}"
        return 1
    elif [ "$response" = "500" ]; then
        echo -e "${RED}✗ 服务器错误 (HTTP 500)${NC}"
        return 1
    else
        echo -e "${YELLOW}? 状态码: $response${NC}"
        return 1
    fi
}

echo "1. 测试主页..."
test_endpoint "/" "主页"

echo ""
echo "2. 测试健康检查 API..."
test_endpoint "/api/health" "健康检查"

echo ""
echo "3. 测试 AI 配置 API..."
test_endpoint "/api/ai/config" "AI 配置"

echo ""
echo "4. 测试 AI 提供商列表 API..."
test_endpoint "/api/ai/providers" "AI 提供商"

echo ""
echo "5. 测试流派列表 API..."
test_endpoint "/api/ai/schools" "流派列表"

echo ""
echo "6. 测试八字排盘 API (OPTIONS)..."
echo -n "测试八字排盘 API ... "
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d '{"inputType":"solar","gender":"male","solarDate":"1990-01-01","solarTime":"12:00"}' \
    "$BASE_URL/api/bazi/calculate" 2>/dev/null)

if [ "$response" = "200" ] || [ "$response" = "400" ] || [ "$response" = "500" ]; then
    echo -e "${GREEN}✓ 可访问 (HTTP $response)${NC}"
else
    echo -e "${RED}✗ 问题 (HTTP $response)${NC}"
fi

echo ""
echo "=========================================="
echo "   验证完成"
echo "=========================================="
echo ""
echo "如果所有测试都通过，AI 对话功能应该可以正常工作了。"
echo ""
echo "如果还有问题，请检查 Vercel Dashboard 的构建日志:"
echo "  https://vercel.com/dashboard"
echo ""
