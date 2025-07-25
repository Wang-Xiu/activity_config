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
./deploy-app.sh
```

就是这么简单！应用将在 `http://你的服务器IP:3000` 运行。

---

## 📋 详细说明

### 文件说明
- `install-docker-centos7.sh` - Docker环境自动安装脚本
- `deploy-app.sh` - 应用部署脚本  
- `Dockerfile` - Docker镜像构建配置
- `docker-compose.yml` - Docker容器编排配置

### 常用命令
```bash
# 查看应用状态
docker-compose ps

# 查看应用日志
docker-compose logs -f

# 重启应用
docker-compose restart

# 停止应用  
docker-compose down

# 更新应用（在更新代码后）
docker-compose down
docker-compose up -d --build
```

### 端口说明
- 应用端口：3000
- 如需修改端口，编辑 `docker-compose.yml` 文件中的端口映射

### 故障排除
如果遇到问题，可以查看详细部署指南：`CENTOS7-DOCKER-DEPLOYMENT.md`