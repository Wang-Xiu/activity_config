#!/bin/bash

echo "=== Activity Config 多环境部署脚本 ==="

# 获取环境参数
ENVIRONMENT=${1:-"test"}

# 验证环境参数
if [[ "$ENVIRONMENT" != "test" && "$ENVIRONMENT" != "prod" ]]; then
    echo "❌ 无效的环境参数: $ENVIRONMENT"
    echo "用法: $0 [test|prod]"
    echo "  test - 部署到测试环境 (默认)"
    echo "  prod - 部署到生产环境"
    exit 1
fi

# 设置环境配置
if [ "$ENVIRONMENT" = "prod" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
    ENV_FILE=".env.prod"
    ENV_NAME="生产环境"
    APP_PORT="3020"
    CONTAINER_NAME="activity-config-prod"
else
    COMPOSE_FILE="docker-compose.test.yml"
    ENV_FILE=".env.test"
    ENV_NAME="测试环境"
    APP_PORT="3010"
    CONTAINER_NAME="activity-config-test"
fi

echo "部署目标: $ENV_NAME"
echo "使用配置文件: $COMPOSE_FILE"
echo "环境变量文件: $ENV_FILE"
echo "应用端口: $APP_PORT"

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

# 检查环境文件是否存在
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ 环境配置文件不存在: $ENV_FILE"
    exit 1
fi

# 检查Docker服务是否运行 (适配 macOS 和 Linux)
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux 系统使用 systemctl
    if ! systemctl is-active --quiet docker; then
        echo "启动Docker服务..."
        sudo systemctl start docker
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS 系统检查 Docker Desktop
    if ! docker info >/dev/null 2>&1; then
        echo "请确保 Docker Desktop 已启动"
        exit 1
    fi
fi

echo "开始部署应用到 $ENV_NAME..."

# 显示环境配置摘要
echo ""
echo "=== 环境配置摘要 ==="
echo "NODE_ENV: $(grep NODE_ENV $ENV_FILE | cut -d'=' -f2)"
echo "DEPLOY_ENV: $(grep DEPLOY_ENV $ENV_FILE | cut -d'=' -f2)"
echo "API_BASE_URL: $(grep API_BASE_URL $ENV_FILE | cut -d'=' -f2)"
echo ""

# 确认部署
read -p "确认部署到 $ENV_NAME 吗？(y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "部署已取消"
    exit 0
fi

# 1. 停止旧容器（如果存在）
echo "停止旧容器..."
docker-compose -f $COMPOSE_FILE down 2>/dev/null || true

# 2. 清理旧镜像（可选）
if [ "$ENVIRONMENT" = "prod" ]; then
    echo "生产环境部署，清理旧镜像..."
    docker system prune -f
else
    read -p "是否清理旧的Docker镜像？(y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "清理旧镜像..."
        docker system prune -f
    fi
fi

# 3. 构建并启动新容器
echo "构建并启动应用..."
docker-compose -f $COMPOSE_FILE up -d --build

# 4. 等待容器启动
echo "等待应用启动..."
sleep 15

# 5. 检查容器状态
echo "检查应用状态..."
docker-compose -f $COMPOSE_FILE ps

# 6. 测试应用是否可访问
echo "测试应用连接..."
if curl -f -s http://localhost:$APP_PORT > /dev/null; then
    echo "✅ 应用启动成功！"
    # 获取本机IP地址 (适配 macOS 和 Linux)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
    else
        LOCAL_IP=$(hostname -I | awk '{print $1}')
    fi
    echo "🌍 应用访问地址: http://${LOCAL_IP:-localhost}:$APP_PORT"
    echo "📊 环境: $ENV_NAME"
else
    echo "⚠️  应用可能还在启动中，请稍等片刻后访问"
    # 获取本机IP地址 (适配 macOS 和 Linux)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
    else
        LOCAL_IP=$(hostname -I | awk '{print $1}')
    fi
    echo "🌍 应用访问地址: http://${LOCAL_IP:-localhost}:$APP_PORT"
    echo "📊 环境: $ENV_NAME"
fi

# 7. 显示日志
echo ""
echo "=== 应用日志 (最近20条) ==="
docker-compose -f $COMPOSE_FILE logs --tail=20

echo ""
echo "=== 部署完成！==="
echo ""
echo "环境信息："
echo "  部署环境: $ENV_NAME"
echo "  应用端口: $APP_PORT"
echo "  容器名称: $CONTAINER_NAME"
echo "  配置文件: $COMPOSE_FILE"
echo "  环境变量: $ENV_FILE"
echo ""
echo "常用管理命令："
echo "  查看状态: docker-compose -f $COMPOSE_FILE ps"
echo "  查看日志: docker-compose -f $COMPOSE_FILE logs -f"
echo "  重启应用: docker-compose -f $COMPOSE_FILE restart"
echo "  停止应用: docker-compose -f $COMPOSE_FILE down"
echo "  进入容器: docker-compose -f $COMPOSE_FILE exec ${CONTAINER_NAME##*-} sh"
echo ""
echo "端口信息："
echo "  测试环境: http://服务器IP:3010"
echo "  正式环境: http://服务器IP:3020"
echo ""
echo "环境切换："
echo "  切换到测试环境: ./deploy-app.sh test"
echo "  切换到生产环境: ./deploy-app.sh prod"