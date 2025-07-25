#!/bin/bash

echo "=== Activity Config 环境切换脚本 ==="

# 获取目标环境参数
TARGET_ENV=${1:-""}

# 显示当前环境状态
echo "=== 当前环境状态 ==="

# 检查当前运行的容器
CURRENT_CONTAINERS=$(docker ps --format "table {{.Names}}\t{{.Status}}" | grep activity-config || echo "无运行中的容器")
echo "运行中的容器: $CURRENT_CONTAINERS"

# 检查环境配置文件
if [ -f ".env.test" ] && [ -f ".env.prod" ]; then
    echo "环境配置文件: ✅ 测试环境(.env.test) ✅ 生产环境(.env.prod)"
else
    echo "⚠️  环境配置文件缺失，请检查 .env.test 和 .env.prod 文件"
fi

echo ""

# 如果没有提供参数，显示使用方法并询问
if [ -z "$TARGET_ENV" ]; then
    echo "用法: $0 [test|prod|status]"
    echo ""
    echo "选项:"
    echo "  test   - 切换到测试环境"
    echo "  prod   - 切换到生产环境"
    echo "  status - 显示当前环境状态"
    echo ""
    
    read -p "请选择要切换的环境 (test/prod/status): " TARGET_ENV
fi

case "$TARGET_ENV" in
    "test")
        COMPOSE_FILE="docker-compose.test.yml"
        ENV_FILE=".env.test"
        ENV_NAME="测试环境"
        ;;
    "prod")
        COMPOSE_FILE="docker-compose.prod.yml"
        ENV_FILE=".env.prod"
        ENV_NAME="生产环境"
        ;;
    "status")
        echo "=== 详细环境状态 ==="
        
        # 检查Docker Compose文件状态
        echo ""
        echo "Docker Compose配置文件:"
        for file in docker-compose.yml docker-compose.test.yml docker-compose.prod.yml; do
            if [ -f "$file" ]; then
                echo "  ✅ $file"
            else
                echo "  ❌ $file (缺失)"
            fi
        done
        
        # 检查环境变量文件
        echo ""
        echo "环境变量配置文件:"
        for file in .env.test .env.prod; do
            if [ -f "$file" ]; then
                echo "  ✅ $file"
                echo "    API_BASE_URL: $(grep API_BASE_URL $file | cut -d'=' -f2)"
                echo "    DEPLOY_ENV: $(grep DEPLOY_ENV $file | cut -d'=' -f2)"
            else
                echo "  ❌ $file (缺失)"
            fi
        done
        
        # 检查Docker状态
        echo ""
        echo "Docker服务状态:"
        if systemctl is-active --quiet docker; then
            echo "  ✅ Docker服务运行中"
        else
            echo "  ❌ Docker服务未运行"
        fi
        
        if command -v docker-compose &> /dev/null; then
            echo "  ✅ Docker Compose已安装 ($(docker-compose --version))"
        else
            echo "  ❌ Docker Compose未安装"
        fi
        
        # 检查正在运行的容器详情
        echo ""
        echo "运行中的容器详情:"
        if docker ps | grep -q activity-config; then
            docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}" | grep -E "(NAMES|activity-config)"
            
            echo ""
            echo "容器环境变量:"
            CONTAINER_ID=$(docker ps -q --filter "name=activity-config")
            if [ ! -z "$CONTAINER_ID" ]; then
                echo "  NODE_ENV: $(docker exec $CONTAINER_ID printenv NODE_ENV 2>/dev/null || echo '未设置')"
                echo "  DEPLOY_ENV: $(docker exec $CONTAINER_ID printenv DEPLOY_ENV 2>/dev/null || echo '未设置')"
            fi
        else
            echo "  无正在运行的应用容器"
        fi
        
        exit 0
        ;;
    *)
        echo "❌ 无效的环境参数: $TARGET_ENV"
        echo "有效选项: test, prod, status"
        exit 1
        ;;
esac

# 检查目标环境配置文件是否存在
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ 环境配置文件不存在: $ENV_FILE"
    exit 1
fi

if [ ! -f "$COMPOSE_FILE" ]; then
    echo "❌ Docker Compose配置文件不存在: $COMPOSE_FILE"
    exit 1
fi

echo "=== 环境切换操作 ==="
echo "目标环境: $ENV_NAME"
echo "配置文件: $COMPOSE_FILE"
echo "环境变量: $ENV_FILE"
echo ""

# 显示目标环境配置
echo "目标环境配置:"
echo "  NODE_ENV: $(grep NODE_ENV $ENV_FILE | cut -d'=' -f2)"
echo "  DEPLOY_ENV: $(grep DEPLOY_ENV $ENV_FILE | cut -d'=' -f2)"
echo "  API_BASE_URL: $(grep API_BASE_URL $ENV_FILE | cut -d'=' -f2)"
echo ""

# 确认切换
read -p "确认切换到 $ENV_NAME 吗？(y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "环境切换已取消"
    exit 0
fi

echo "开始切换环境..."

# 1. 停止当前运行的容器
echo "1. 停止当前运行的容器..."
docker-compose down 2>/dev/null || true
docker-compose -f docker-compose.test.yml down 2>/dev/null || true
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

# 2. 启动目标环境
echo "2. 启动 $ENV_NAME..."
docker-compose -f $COMPOSE_FILE up -d --build

# 3. 等待启动
echo "3. 等待应用启动..."
sleep 15

# 4. 检查状态
echo "4. 检查应用状态..."
docker-compose -f $COMPOSE_FILE ps

# 5. 验证环境
echo "5. 验证环境配置..."
CONTAINER_ID=$(docker ps -q --filter "name=activity-config")
if [ ! -z "$CONTAINER_ID" ]; then
    CONTAINER_NODE_ENV=$(docker exec $CONTAINER_ID printenv NODE_ENV 2>/dev/null)
    CONTAINER_DEPLOY_ENV=$(docker exec $CONTAINER_ID printenv DEPLOY_ENV 2>/dev/null)
    
    echo "  容器 NODE_ENV: $CONTAINER_NODE_ENV"
    echo "  容器 DEPLOY_ENV: $CONTAINER_DEPLOY_ENV"
    
    if [ "$CONTAINER_DEPLOY_ENV" = "${TARGET_ENV}" ]; then
        echo "  ✅ 环境配置验证成功"
    else
        echo "  ⚠️  环境配置可能不匹配"
    fi
else
    echo "  ⚠️  无法获取容器信息"
fi

# 6. 测试连接
echo "6. 测试应用连接..."
if curl -f -s http://localhost:3000 > /dev/null; then
    echo "✅ 环境切换成功！"
    echo "🌍 应用访问地址: http://$(hostname -I | awk '{print $1}'):3000"
    echo "📊 当前环境: $ENV_NAME"
else
    echo "⚠️  应用可能还在启动中，请稍等片刻后访问"
    echo "🌍 应用访问地址: http://$(hostname -I | awk '{print $1}'):3000"
fi

echo ""
echo "=== 环境切换完成！==="
echo ""
echo "当前环境信息："
echo "  环境: $ENV_NAME"
echo "  配置文件: $COMPOSE_FILE"
echo "  环境变量: $ENV_FILE"
echo ""
echo "管理命令："
echo "  查看状态: docker-compose -f $COMPOSE_FILE ps"
echo "  查看日志: docker-compose -f $COMPOSE_FILE logs -f"
echo "  重启应用: docker-compose -f $COMPOSE_FILE restart"
echo ""
echo "切换其他环境："
echo "  切换到测试环境: ./switch-env.sh test"
echo "  切换到生产环境: ./switch-env.sh prod"
echo "  查看环境状态: ./switch-env.sh status"