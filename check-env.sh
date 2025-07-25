#!/bin/bash

echo "=== 老版本服务器环境检测 ==="

# 检测系统信息
echo "系统信息："
if [ -f /etc/os-release ]; then
    cat /etc/os-release | grep -E "NAME|VERSION"
elif [ -f /etc/redhat-release ]; then
    cat /etc/redhat-release
elif [ -f /etc/lsb-release ]; then
    cat /etc/lsb-release
else
    uname -a
fi

echo ""

# 检测Node.js
echo "Node.js版本："
if command -v node &> /dev/null; then
    node --version
else
    echo "Node.js 未安装"
fi

echo ""

# 检测npm
echo "npm版本："
if command -v npm &> /dev/null; then
    npm --version
else
    echo "npm 未安装"
fi

echo ""

# 检测Docker
echo "Docker版本："
if command -v docker &> /dev/null; then
    docker --version
else
    echo "Docker 未安装"
fi

echo ""

# 检测docker-compose
echo "Docker Compose版本："
if command -v docker-compose &> /dev/null; then
    docker-compose --version
else
    echo "Docker Compose 未安装"
fi

echo ""

# 检测系统资源
echo "系统资源："
echo "内存: $(free -h | grep Mem | awk '{print $2}')"
echo "磁盘: $(df -h / | tail -1 | awk '{print $4}' | sed 's/G/GB/')"

echo ""

# 给出建议
echo "=== 部署建议 ==="

NODE_VERSION=$(node --version 2>/dev/null | sed 's/v//' | cut -d. -f1)

if command -v docker &> /dev/null; then
    echo "✅ 推荐使用 Docker 容器部署"
    echo "   执行: docker-compose up -d"
elif [ ! -z "$NODE_VERSION" ] && [ "$NODE_VERSION" -ge 16 ]; then
    echo "✅ 可以使用降级版本部署"
    echo "   执行: cp package-legacy.json package.json && npm install"
elif [ ! -z "$NODE_VERSION" ] && [ "$NODE_VERSION" -ge 14 ]; then
    echo "⚠️  可以尝试降级版本，但可能有兼容性问题"
    echo "   建议使用 Docker"
else
    echo "❌ Node.js版本过低或未安装"
    echo "   建议安装 Docker 或使用 NVM 安装新版本 Node.js"
fi