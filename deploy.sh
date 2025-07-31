#!/bin/bash

# 简单部署脚本 - 支持端口配置
PORT=${1:-3000}
ENV=${2:-development}

echo "开始部署..."
echo "端口: $PORT"
echo "环境: $ENV"

# 安装依赖
echo "安装依赖包..."
npm install

# 构建项目
echo "构建项目..."
npm run build

# 启动项目（生产模式）
echo "启动项目在端口 $PORT..."
if [ "$PORT" = "3010" ]; then
    npm run start:test
elif [ "$PORT" = "3020" ]; then
    npm run start:prod
else
    PORT=$PORT npm start
fi