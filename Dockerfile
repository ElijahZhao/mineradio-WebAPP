# 多阶段构建：deps 阶段安装依赖
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# 运行阶段：只拷必要文件
FROM node:20-alpine
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV HOST=0.0.0.0
ENV PORT=3000
USER node
EXPOSE 3000
CMD ["node", "server.js"]
