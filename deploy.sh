#!/bin/bash

# 部署脚本
echo "开始部署..."

# 安装依赖
echo "安装依赖包..."
npm install

# 构建项目
echo "构建项目..."
npm run build

# 启动项目（生产模式）
echo "启动项目..."
npm start