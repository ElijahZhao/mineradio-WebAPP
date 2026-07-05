# Mineradio Web 部署指南

> **声明**：本项目是基于 [XxHuberrr/Mineradio](https://github.com/XxHuberrr/Mineradio)（GPL-3.0）的 Web 移植版。
> Copyright (C) 2026 XxHuberrr. 本项目同样采用 GPL-3.0 授权，详见 [LICENSE](./LICENSE)。

## 快速开始（本地运行）

```bash
cd mineradio-web
npm install --omit=dev
node server.js
```

打开浏览器访问 `http://localhost:3000`

## 一键部署到 Zeabur（推荐，国内直连）

1. 把 `mineradio-web` 目录推送到你自己的 GitHub 仓库
2. 登录 [zeabur.com](https://zeabur.com)，点击"新建项目"
3. 选择 GitHub 仓库，Zeabur 会自动识别 Node.js 项目
4. 点击部署，等待 1-2 分钟
5. 分配一个域名即可访问

**特点**：国内移动/联通/电信直连，无需梯子，自动 HTTPS。

## 部署到 Render

1. 把代码推送到 GitHub
2. 登录 [render.com](https://render.com)，新建 Web Service
3. 选择 GitHub 仓库，构建命令留空，启动命令填 `node server.js`
4. 免费实例会在 15 分钟无访问后休眠，首次访问需等待唤醒

## 部署到阿里云/腾讯云轻量服务器

1. 购买一台轻量服务器（新用户约 38~99 元/年）
2. 安装 Node.js 20：
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
3. 上传代码到服务器，进入目录运行：
   ```bash
   npm install --omit=dev
   nohup node server.js > app.log 2>&1 &
   ```
4. 开放安全组 3000 端口，访问 `http://你的服务器IP:3000`

**进阶**：用 pm2 守护进程 + Nginx 反代 + 域名备案，可长期稳定运行。

## 已知限制

- **单用户 Cookie**：当前代码的登录态是全局单例的，同一时间只能有一个网易云账号登录。多人同时用会互相踢掉。
- **需要国内网络**：网易云/QQ 音乐的 API 服务器在国内，部署在海外（如 Render 美国节点）可能连接超时。
- **WebGL 降级**：无 GPU 环境下粒子效果不显示，但搜索、播放、歌词等全部功能正常。

## 技术栈

- 后端：Node.js + `NeteaseCloudMusicApi`
- 前端：原生 HTML/JS + Three.js（粒子效果）
- 端口：默认 3000，可通过 `PORT` 环境变量修改
