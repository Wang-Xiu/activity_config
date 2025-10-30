# 使用 Node.js 18 镜像
# 如果官方源无法访问，可以尝试使用镜像代理
FROM swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/library/node:18

# 设置工作目录
WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 设置环境变量（可以在构建时覆盖）
ARG NODE_ENV=production
ENV NODE_ENV=production
ENV BUILD_TIME=true
ENV NEXT_TELEMETRY_DISABLED=1

# 构建应用
RUN npm run build

# 暴露端口
EXPOSE 3000

# 启动应用（根据环境变量决定启动方式）
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"development\" ]; then npm run dev; else npm start; fi"]