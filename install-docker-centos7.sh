#!/bin/bash

echo "=== CentOS 7 Docker 自动安装脚本 ==="

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then
    echo "请使用root权限运行此脚本: sudo $0"
    exit 1
fi

# 检查系统版本
if ! grep -q "CentOS Linux 7" /etc/os-release; then
    echo "警告：此脚本专为CentOS 7设计，当前系统可能不兼容"
    read -p "是否继续？(y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "开始安装Docker..."

# 1. 更新系统包
echo "更新系统包..."
yum update -y

# 2. 安装必要依赖
echo "安装Docker依赖..."
yum install -y yum-utils device-mapper-persistent-data lvm2

# 3. 添加Docker官方源
echo "添加Docker源..."
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# 4. 安装Docker CE
echo "安装Docker CE..."
yum install -y docker-ce docker-ce-cli containerd.io

# 5. 启动Docker服务
echo "启动Docker服务..."
systemctl start docker
systemctl enable docker

# 6. 验证Docker安装
echo "验证Docker安装..."
docker --version

if [ $? -eq 0 ]; then
    echo "✅ Docker安装成功！"
else
    echo "❌ Docker安装失败！"
    exit 1
fi

# 7. 安装Docker Compose
echo "安装Docker Compose..."
curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

if [ $? -eq 0 ]; then
    chmod +x /usr/local/bin/docker-compose
    ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose
    
    # 验证Docker Compose安装
    docker-compose --version
    
    if [ $? -eq 0 ]; then
        echo "✅ Docker Compose安装成功！"
    else
        echo "❌ Docker Compose安装失败！"
        exit 1
    fi
else
    echo "❌ Docker Compose下载失败，请检查网络连接！"
    exit 1
fi

# 8. 配置防火墙（开放3000端口）
echo "配置防火墙..."
if systemctl is-active --quiet firewalld; then
    firewall-cmd --permanent --add-port=3000/tcp
    firewall-cmd --reload
    echo "✅ 防火墙已配置，开放3000端口"
else
    echo "⚠️  防火墙服务未运行，跳过防火墙配置"
fi

# 9. 创建项目目录
echo "创建项目目录..."
mkdir -p /opt/activity-config
chown $SUDO_USER:$SUDO_USER /opt/activity-config 2>/dev/null || true

echo ""
echo "=== 安装完成！==="
echo ""
echo "接下来的步骤："
echo "1. 将项目文件上传到 /opt/activity-config/ 目录"
echo "2. 进入项目目录: cd /opt/activity-config"
echo "3. 启动应用: docker-compose up -d --build"
echo "4. 查看状态: docker-compose ps"
echo "5. 查看日志: docker-compose logs -f"
echo ""
echo "应用将在 http://你的服务器IP:3000 运行"

# 10. 运行hello-world测试
echo ""
echo "运行Docker测试..."
docker run hello-world

if [ $? -eq 0 ]; then
    echo "✅ Docker环境测试成功！"
else
    echo "❌ Docker环境测试失败！"
fi