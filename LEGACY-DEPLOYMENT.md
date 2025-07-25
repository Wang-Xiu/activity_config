# 老版本服务器部署指南

## 检查你的服务器环境

首先确认服务器的系统版本和Node.js版本：

```bash
# 检查系统版本
cat /etc/os-release

# 检查Node.js版本（如果已安装）
node --version

# 检查是否支持Docker
docker --version
```

## 方案一：Docker容器部署（强烈推荐）

### 优势
- 不需要升级系统Node.js版本
- 环境隔离，不影响系统其他应用
- 部署简单，易于管理

### 前提条件
- 服务器支持Docker（大多数Linux发行版都支持）
- 如果没有Docker，可以参考以下安装：

```bash
# CentOS/RHEL 7+
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker

# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
```

### 部署步骤

1. **上传项目文件到服务器**

2. **构建并启动容器**
   ```bash
   # 使用docker-compose（推荐）
   docker-compose up -d
   
   # 或者使用Docker命令
   docker build -t activity-config .
   docker run -d -p 3000:3000 --name activity-config activity-config
   ```

3. **查看运行状态**
   ```bash
   docker-compose ps
   # 或
   docker ps
   ```

4. **查看日志**
   ```bash
   docker-compose logs -f
   # 或
   docker logs -f activity-config
   ```

## 方案二：降级到兼容版本

### 适用场景
- 服务器有Node.js 16+
- 不想使用Docker

### 步骤

1. **替换package.json**
   ```bash
   cp package-legacy.json package.json
   ```

2. **清理并重新安装依赖**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **构建和部署**
   ```bash
   npm run build
   npm start
   ```

## 方案三：Nginx反向代理 + 简单HTTP服务器

### 适用场景
- Node.js版本太低（<14）
- 无法使用Docker

### 步骤

1. **本地构建静态文件**
   ```bash
   # 在你的开发机器上
   npm run build
   npm run export  # 如果支持静态导出
   ```

2. **上传静态文件到服务器**
   上传 `out/` 或 `.next/` 目录到服务器

3. **配置Nginx反向代理**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       # 静态文件
       location / {
           root /path/to/your/static/files;
           try_files $uri $uri.html $uri/ =404;
       }
       
       # API请求直接代理到PHP后端
       location /api/ {
           proxy_pass http://your-php-backend.com/;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }
   }
   ```

## 方案四：使用NVM管理Node.js版本

### 如果可以安装用户级别的Node.js

```bash
# 安装NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# 安装并使用Node.js 18
nvm install 18
nvm use 18

# 然后正常部署
npm install
npm run build
npm start
```

## 推荐方案选择

1. **如果服务器支持Docker** → 使用方案一（Docker）
2. **如果有Node.js 16+** → 使用方案二（降级版本）
3. **如果可以安装用户级软件** → 使用方案四（NVM）
4. **如果以上都不行** → 使用方案三（静态文件+代理）

## 常见老系统兼容性问题

### CentOS 6/7
```bash
# 可能需要更新证书
yum update ca-certificates

# 如果npm安装失败，尝试
npm config set registry https://registry.npm.taobao.org/
```

### Ubuntu 14.04/16.04
```bash
# 更新apt源
sudo apt-get update

# 如果SSL问题
npm config set strict-ssl false
```

请告诉我你的服务器具体是什么系统和版本，我可以给出更具体的建议。