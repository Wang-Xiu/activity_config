#!/bin/bash

echo "=== Activity Config 应用部署脚本 ==="

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker未安装，请先运行 install-docker-centos7.sh"
    exit 1
fi

# 检查Docker Compose是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose未安装，请先运行 install-docker-centos7.sh"
    exit 1
fi

# 检查Docker服务是否运行
if ! systemctl is-active --quiet docker; then
    echo "启动Docker服务..."
    sudo systemctl start docker
fi

echo "开始部署应用..."

# 1. 停止旧容器（如果存在）
echo "停止旧容器..."
docker-compose down 2>/dev/null || true

# 2. 清理旧镜像（可选）
read -p "是否清理旧的Docker镜像？(y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "清理旧镜像..."
    docker system prune -f
fi

# 3. 构建并启动新容器
echo "构建并启动应用..."
docker-compose up -d --build

# 4. 等待容器启动
echo "等待应用启动..."
sleep 10

# 5. 检查容器状态
echo "检查应用状态..."
docker-compose ps

# 6. 测试应用是否可访问
echo "测试应用连接..."
if curl -f -s http://localhost:3000 > /dev/null; then
    echo "✅ 应用启动成功！"
    echo "🌍 应用访问地址: http://$(hostname -I | awk '{print $1}'):3000"
else
    echo "⚠️  应用可能还在启动中，请稍等片刻后访问"
    echo "🌍 应用访问地址: http://$(hostname -I | awk '{print $1}'):3000"
fi

# 7. 显示日志
echo ""
echo "=== 应用日志 ==="
docker-compose logs --tail=20

echo ""
echo "=== 部署完成！==="
echo ""
echo "常用管理命令："
echo "查看状态: docker-compose ps"
echo "查看日志: docker-compose logs -f"
echo "重启应用: docker-compose restart"
echo "停止应用: docker-compose down"
echo "进入容器: docker-compose exec activity-config sh"