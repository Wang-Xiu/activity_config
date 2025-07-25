# 部署指南

## 方案一：代码部署（推荐）

### 前提条件
- 服务器已安装 Node.js (版本 18 或以上)
- 服务器已安装 npm
- 可选：安装 PM2 进程管理器

### 部署步骤

1. **上传代码到服务器**
   ```bash
   # 方式1：使用git（推荐）
   git clone <你的仓库地址>
   cd project-1749009667620
   
   # 方式2：直接上传压缩包
   # 将整个项目文件夹压缩后上传到服务器并解压
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **构建项目**
   ```bash
   npm run build
   ```

4. **启动项目**
   
   **简单启动（测试用）：**
   ```bash
   npm start
   # 项目将在 http://localhost:3000 运行
   ```
   
   **使用PM2启动（生产推荐）：**
   ```bash
   # 安装PM2
   npm install -g pm2
   
   # 启动应用
   pm2 start ecosystem.config.json
   
   # 查看状态
   pm2 status
   
   # 查看日志
   pm2 logs activity-config
   
   # 重启应用
   pm2 restart activity-config
   
   # 停止应用
   pm2 stop activity-config
   ```

5. **配置反向代理（可选）**
   
   如果使用 Nginx，配置示例：
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
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
       }
   }
   ```

## 方案二：本地构建后部署

### 适用场景
- 服务器资源有限
- 不想在服务器上安装开发依赖

### 步骤

1. **本地构建**
   ```bash
   npm install
   npm run build
   ```

2. **准备部署文件**
   需要上传以下文件/文件夹到服务器：
   - `.next/` （构建输出目录）
   - `public/` （静态资源）
   - `package.json`
   - `package-lock.json`
   - `.env.production`（如果有环境变量）

3. **服务器操作**
   ```bash
   # 只安装生产依赖
   npm install --production
   
   # 启动应用
   npm start
   ```

## 环境变量配置

在服务器上创建 `.env.production` 文件：
```
NODE_ENV=production
PORT=3000
```

## 日志管理

项目日志将保存在 `./logs/` 目录下：
- `combined.log` - 所有日志
- `out.log` - 标准输出
- `error.log` - 错误日志

## 常见问题

1. **端口冲突**
   - 修改 `ecosystem.config.json` 中的 PORT 配置
   - 或在 `.env.production` 中设置不同端口

2. **内存不足**
   - 调整 `ecosystem.config.json` 中的 `max_memory_restart` 配置

3. **权限问题**
   ```bash
   chmod +x deploy.sh
   ```

## 更新部署

使用git更新：
```bash
git pull origin main
npm install  # 如果有新依赖
npm run build
pm2 restart activity-config
```