# 快速部署指南 - CentOS 7

## 🚀 一键部署流程

### 第一步：上传文件到服务器
将整个项目文件夹上传到服务器的 `/opt/activity-config/` 目录

### 第二步：安装Docker环境
```bash
cd /opt/activity-config
sudo ./install-docker-centos7.sh
```

### 第三步：部署应用
```bash
# 部署到测试环境（默认）
./deploy-app.sh test

# 或部署到生产环境
./deploy-app.sh prod
```

就是这么简单！应用将在 `http://你的服务器IP:3000` 运行。

---

## 🎯 多环境支持

现在支持完整的多环境部署：

### 环境切换
```bash
# 切换到测试环境
./switch-env.sh test

# 切换到生产环境  
./switch-env.sh prod

# 查看当前环境状态
./switch-env.sh status
```

### 环境对比
| 环境 | API地址 | 启动模式 | 调试 |
|------|---------|----------|------|
| 测试 | testactivity.meequ.cn | 开发模式 | 开启 |
| 生产 | proactivity.meequ.cn | 生产模式 | 关闭 |

---

## 📋 详细说明

### 文件说明
- `install-docker-centos7.sh` - Docker环境自动安装脚本
- `deploy-app.sh` - 多环境部署脚本  
- `switch-env.sh` - 环境切换脚本
- `docker-compose.test.yml` - 测试环境配置
- `docker-compose.prod.yml` - 生产环境配置
- `.env.test` / `.env.prod` - 环境变量配置

### 常用命令
```bash
# 查看应用状态
docker-compose -f docker-compose.test.yml ps   # 测试环境
docker-compose -f docker-compose.prod.yml ps   # 生产环境

# 查看应用日志
docker-compose -f docker-compose.test.yml logs -f   # 测试环境
docker-compose -f docker-compose.prod.yml logs -f   # 生产环境

# 重启应用
./switch-env.sh test   # 重启到测试环境
./switch-env.sh prod   # 重启到生产环境
```

### 端口说明
- 应用端口：3000
- 如需修改端口，编辑对应的 `docker-compose.*.yml` 文件中的端口映射

### ✅ 问题解决
- **API baseURL问题已修复** - 根据环境自动使用正确的API地址
- **支持环境选择** - 可以灵活选择测试或生产环境部署
- **Docker生产优化** - 生产环境使用优化的启动方式

### 故障排除
如果遇到问题，可以查看详细指南：
- `MULTI-ENV-GUIDE.md` - 多环境部署详细指南
- `CENTOS7-DOCKER-DEPLOYMENT.md` - CentOS 7 Docker部署指南