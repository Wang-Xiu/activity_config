# 多环境部署配置说明

## 端口配置

为了支持同时部署测试环境和正式环境，现已修改端口配置：

- **测试环境**: 端口 `3010`
- **正式环境**: 端口 `3020`
- **开发环境**: 端口 `3000` (默认)

## Docker 部署

### 快速部署

```bash
# 部署到测试环境 (端口 3010)
./deploy-app.sh test

# 部署到正式环境 (端口 3020)
./deploy-app.sh prod
```

### 详细说明

**测试环境部署:**
```bash
./deploy-app.sh test
```
- 使用 `docker-compose.test.yml` 配置文件
- 容器名: `activity-config-test`
- 外部端口: `3010`
- 环境变量文件: `.env.test`

**正式环境部署:**
```bash
./deploy-app.sh prod
```
- 使用 `docker-compose.prod.yml` 配置文件
- 容器名: `activity-config-prod`
- 外部端口: `3020`
- 环境变量文件: `.env.prod`

## 本地开发

### NPM 脚本

```bash
# 开发环境 (端口 3000)
npm run dev

# 测试环境开发 (端口 3010)
npm run dev:test

# 正式环境开发 (端口 3020)
npm run dev:prod

# 生产构建后启动 - 测试环境 (端口 3010)
npm run start:test

# 生产构建后启动 - 正式环境 (端口 3020)
npm run start:prod
```

### 传统部署脚本

```bash
# 默认端口 3000
./deploy.sh

# 指定端口部署
./deploy.sh 3010    # 测试环境
./deploy.sh 3020    # 正式环境
```

## 容器管理

### 查看运行状态
```bash
# 测试环境
docker-compose -f docker-compose.test.yml ps

# 正式环境
docker-compose -f docker-compose.prod.yml ps
```

### 查看日志
```bash
# 测试环境日志
docker-compose -f docker-compose.test.yml logs -f

# 正式环境日志
docker-compose -f docker-compose.prod.yml logs -f
```

### 重启服务
```bash
# 重启测试环境
docker-compose -f docker-compose.test.yml restart

# 重启正式环境
docker-compose -f docker-compose.prod.yml restart
```

### 停止服务
```bash
# 停止测试环境
docker-compose -f docker-compose.test.yml down

# 停止正式环境
docker-compose -f docker-compose.prod.yml down
```

## 访问地址

部署完成后，可通过以下地址访问：

- **测试环境**: http://服务器IP:3010
- **正式环境**: http://服务器IP:3020

## 注意事项

1. **端口占用检查**: 部署前请确保目标端口未被占用
2. **环境隔离**: 两个环境使用不同的容器名和网络，可以同时运行
3. **数据隔离**: 测试环境和正式环境连接不同的后端API
4. **日志分离**: 各环境的日志存储在独立的目录中

## 故障排查

### 端口冲突
如果出现端口冲突，可以检查端口使用情况：
```bash
# 检查端口占用
netstat -tlnp | grep :3010
netstat -tlnp | grep :3020

# 停止占用端口的进程
sudo kill -9 <PID>
```

### 容器状态异常
```bash
# 查看容器详细信息
docker inspect activity-config-test
docker inspect activity-config-prod

# 重新构建容器
docker-compose -f docker-compose.test.yml up -d --build --force-recreate
```