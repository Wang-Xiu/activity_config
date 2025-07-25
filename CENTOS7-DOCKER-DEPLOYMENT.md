# CentOS 7 Docker部署指南

## 前提条件
- CentOS 7 系统
- root权限或sudo权限
- 服务器可以访问互联网

## 第一步：安装Docker

### 1. 更新系统包
```bash
sudo yum update -y
```

### 2. 安装Docker所需依赖
```bash
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
```

### 3. 添加Docker官方源
```bash
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```

### 4. 安装Docker CE
```bash
sudo yum install -y docker-ce docker-ce-cli containerd.io
```

### 5. 启动Docker服务
```bash
sudo systemctl start docker
sudo systemctl enable docker
```

### 6. 验证Docker安装
```bash
sudo docker --version
sudo docker run hello-world
```

### 7. 将当前用户添加到docker组（可选）
```bash
sudo usermod -aG docker $USER
# 需要重新登录或执行以下命令
newgrp docker
```

## 第二步：安装Docker Compose

### 1. 下载Docker Compose
```bash
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

### 2. 添加执行权限
```bash
sudo chmod +x /usr/local/bin/docker-compose
```

### 3. 创建软链接（方便使用）
```bash
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```

### 4. 验证安装
```bash
docker-compose --version
```

## 第三步：部署应用

### 1. 上传项目文件
将整个项目文件夹上传到服务器，比如 `/opt/activity-config/`

### 2. 进入项目目录
```bash
cd /opt/activity-config/
```

### 3. 构建并启动应用
```bash
# 构建镜像并启动容器
docker-compose up -d --build

# 查看启动状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 4. 验证部署
```bash
# 检查容器是否运行
docker ps

# 测试应用是否可访问
curl http://localhost:3000

# 或者从外部访问（如果防火墙允许）
curl http://你的服务器IP:3000
```

## 第四步：配置防火墙（如果需要）

### CentOS 7 防火墙配置
```bash
# 开放3000端口
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload

# 查看开放的端口
sudo firewall-cmd --list-ports
```

## 第五步：设置Nginx反向代理（可选）

### 1. 安装Nginx
```bash
sudo yum install -y epel-release
sudo yum install -y nginx
```

### 2. 配置Nginx
```bash
sudo vim /etc/nginx/conf.d/activity-config.conf
```

添加以下配置：
```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名或IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}
```

### 3. 启动Nginx
```bash
sudo systemctl start nginx
sudo systemctl enable nginx

# 如果需要开放80端口
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --reload
```

## 常用Docker管理命令

### 查看应用状态
```bash
docker-compose ps
docker-compose logs
```

### 重启应用
```bash
docker-compose restart
```

### 停止应用
```bash
docker-compose down
```

### 更新应用
```bash
# 1. 更新代码
git pull  # 如果使用git

# 2. 重新构建并启动
docker-compose down
docker-compose up -d --build
```

### 查看资源使用情况
```bash
docker stats
```

### 进入容器调试
```bash
docker-compose exec activity-config sh
```

## 故障排除

### 1. Docker服务启动失败
```bash
# 检查服务状态
sudo systemctl status docker

# 查看错误日志
sudo journalctl -u docker.service
```

### 2. 应用启动失败
```bash
# 查看详细日志
docker-compose logs -f

# 检查容器状态
docker ps -a
```

### 3. 端口被占用
```bash
# 查找占用3000端口的进程
sudo netstat -tlnp | grep :3000

# 或使用ss命令
sudo ss -tlnp | grep :3000
```

### 4. 内存不足
```bash
# 查看系统内存使用情况
free -h

# 查看Docker内存使用
docker stats --no-stream
```

## 自动启动配置

### 设置开机自启动
```bash
# Docker服务已经设置了自启动
sudo systemctl enable docker

# Docker Compose应用自启动
# 创建systemd服务文件
sudo vim /etc/systemd/system/activity-config.service
```

添加以下内容：
```ini
[Unit]
Description=Activity Config Docker Compose Application Service
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/activity-config
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

启用服务：
```bash
sudo systemctl daemon-reload
sudo systemctl enable activity-config.service
```

## 备份和恢复

### 备份应用数据
```bash
# 备份项目文件
tar -czf activity-config-backup-$(date +%Y%m%d).tar.gz /opt/activity-config/

# 备份Docker镜像
docker save -o activity-config-image.tar activity-config_activity-config
```

### 恢复应用
```bash
# 恢复项目文件
tar -xzf activity-config-backup-YYYYMMDD.tar.gz -C /

# 恢复Docker镜像
docker load -i activity-config-image.tar
```

这样你就可以在CentOS 7上成功部署Next.js应用了！