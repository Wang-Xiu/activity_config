# 多环境部署使用指南

## 🎯 概述

现在你的项目支持完整的多环境部署，包括测试环境和生产环境。所有环境相关的问题都已修复：

- ✅ **API baseURL问题已修复** - 根据环境自动使用正确的API地址
- ✅ **支持测试/生产环境切换** - 一键部署到不同环境
- ✅ **Docker生产模式运行** - 生产环境使用优化配置
- ✅ **环境隔离** - 每个环境使用独立的配置文件

## 📁 文件结构

```
项目根目录/
├── Dockerfile                    # Docker镜像配置（支持多环境）
├── docker-compose.yml           # 默认配置（测试环境）
├── docker-compose.test.yml      # 测试环境专用配置
├── docker-compose.prod.yml      # 生产环境专用配置
├── .env.test                    # 测试环境变量
├── .env.prod                    # 生产环境变量
├── deploy-app.sh                # 多环境部署脚本
├── switch-env.sh                # 环境切换脚本
└── config/environment.ts        # 环境配置（支持环境变量）
```

## 🚀 快速开始

### 1. 部署到测试环境
```bash
./deploy-app.sh test
```

### 2. 部署到生产环境
```bash
./deploy-app.sh prod
```

### 3. 环境切换
```bash
# 切换到测试环境
./switch-env.sh test

# 切换到生产环境
./switch-env.sh prod

# 查看当前环境状态
./switch-env.sh status
```

## 🔧 环境配置

### 测试环境 (.env.test)
```bash
NODE_ENV=development
DEPLOY_ENV=test
API_BASE_URL=http://testactivity.meequ.cn
DEBUG_MODE=true
```

### 生产环境 (.env.prod)
```bash
NODE_ENV=production
DEPLOY_ENV=prod
API_BASE_URL=http://proactivity.meequ.cn
DEBUG_MODE=false
```

## 📊 环境对比

| 特性 | 测试环境 | 生产环境 |
|------|----------|----------|
| NODE_ENV | development | production |
| API地址 | testactivity.meequ.cn | proactivity.meequ.cn |
| 启动方式 | npm run dev | npm start |
| 代码热重载 | ✅ 支持 | ❌ 关闭 |
| 调试日志 | ✅ 详细 | ❌ 精简 |
| 性能优化 | ❌ 关闭 | ✅ 开启 |

## 🛠️ 常用命令

### 部署相关
```bash
# 部署到指定环境
./deploy-app.sh test   # 测试环境
./deploy-app.sh prod   # 生产环境

# 环境切换
./switch-env.sh test   # 切换到测试
./switch-env.sh prod   # 切换到生产
./switch-env.sh status # 查看状态
```

### 容器管理
```bash
# 测试环境
docker-compose -f docker-compose.test.yml ps      # 查看状态
docker-compose -f docker-compose.test.yml logs -f # 查看日志
docker-compose -f docker-compose.test.yml restart # 重启
docker-compose -f docker-compose.test.yml down    # 停止

# 生产环境
docker-compose -f docker-compose.prod.yml ps      # 查看状态
docker-compose -f docker-compose.prod.yml logs -f # 查看日志
docker-compose -f docker-compose.prod.yml restart # 重启
docker-compose -f docker-compose.prod.yml down    # 停止
```

## 🔍 故障排除

### 1. API请求使用错误的baseURL
**问题**: 部署后API请求没有使用配置的baseURL，而是使用服务器本地IP

**解决方案**: 
- 确保使用了正确的环境配置文件
- 检查环境变量是否正确设置
- 验证容器内的环境变量: `docker exec <container_id> printenv`

### 2. 环境切换不生效
**问题**: 切换环境后配置没有更新

**解决方案**:
```bash
# 完全重启
docker-compose -f docker-compose.test.yml down
docker-compose -f docker-compose.prod.yml down
./switch-env.sh <target_env>
```

### 3. 容器启动失败
**问题**: Docker容器无法启动

**解决方案**:
```bash
# 查看详细日志
docker-compose -f docker-compose.<env>.yml logs

# 清理并重建
docker system prune -f
./deploy-app.sh <env>
```

## 🔒 生产环境注意事项

1. **安全配置**: 生产环境自动禁用调试模式
2. **性能优化**: 使用npm start而不是npm run dev
3. **自动清理**: 生产部署时自动清理旧镜像
4. **确认机制**: 部署前需要确认操作

## 📈 监控和日志

### 实时日志监控
```bash
# 测试环境日志
docker-compose -f docker-compose.test.yml logs -f

# 生产环境日志
docker-compose -f docker-compose.prod.yml logs -f
```

### 系统资源监控
```bash
# 查看容器资源使用
docker stats

# 查看系统资源
free -h
df -h
```

## 🔄 更新和维护

### 应用更新流程
```bash
# 1. 更新代码
git pull origin main

# 2. 重新部署
./deploy-app.sh <env>
```

### 配置文件更新
```bash
# 修改环境配置后重启
./switch-env.sh <env>
```

## 💡 最佳实践

1. **先测试后生产**: 总是先在测试环境验证功能
2. **备份重要数据**: 生产部署前备份重要配置
3. **监控日志**: 部署后及时查看应用日志
4. **环境隔离**: 保持测试和生产环境的独立性
5. **定期清理**: 定期清理不用的Docker镜像和容器

现在你可以灵活地在测试和生产环境之间切换，API baseURL问题已完全解决！