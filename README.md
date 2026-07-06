# Mineradio Web

> 沉浸式音乐可视化播放器 — 融合天气电台、歌词舞台、粒子视觉和 3D 歌单架
>
> An immersive music visualization player ported from the Electron desktop app to the web.

[![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/Node-%3E%3D18-green.svg)](https://nodejs.org)
[![PWA](https://img.shields.io/badge/PWA-Ready-purple.svg)](public/manifest.json)
[![Tests](https://img.shields.io/badge/Tests-32%20passed-brightgreen.svg)](tests/)

**在线 Demo**: https://mineradio-webapp.onrender.com/

**基于 [XxHuberrr/Mineradio](https://github.com/XxHuberrr/Mineradio) (GPL-3.0) 的 Web 移植**

---

## 概述 / Overview

Mineradio Web 是一个基于 Node.js 原生 `http` 模块构建的沉浸式音乐播放器，将 Electron 桌面应用移植到 Web 平台。它集成了网易云音乐和 QQ 音乐双源播放、基于节奏的粒子可视化、天气电台、歌词同步舞台和 3D 歌单浏览等功能。

This project ports the Mineradio Electron desktop app to a web-first architecture using vanilla Node.js (no Express), featuring dual music source integration (NetEase Cloud Music + QQ Music), beat-driven particle visualization, weather-based radio, synced lyrics stage, and a 3D album browser.

---

## 功能特性 / Features

| 功能 | 说明 |
|------|------|
| 双音乐源 | 网易云音乐 + QQ 音乐搜索、播放、扫码登录 |
| 粒子可视化 | Three.js 基于节拍的电影镜头粒子视觉系统，含 WebGL 降级方案 |
| 天气电台 | Open-Meteo 天气数据驱动播放队列生成 |
| 歌词舞台 | 实时歌词同步与粒子效果联动 |
| 3D 歌单架 | Three.js 3D 旋转歌单浏览界面 |
| 桌面歌词 | 独立悬浮窗歌词显示 |
| PWA 支持 | Service Worker 离线缓存 + 可安装到桌面/主屏幕 |
| WebSocket | 实时在线人数推送（手动实现 RFC 6455 协议） |
| 多用户会话 | AsyncLocalStorage 实现的会话隔离 |
| 节拍分析 | 离线音频节拍检测与节拍图缓存 |

---

## 技术架构 / Tech Stack

### 后端 / Backend

- **运行时**: Node.js 18+ (原生 `http` 模块，不依赖 Express)
- **音乐 API**: 网易云音乐 API（社区逆向）+ QQ 音乐 Web API
- **WebSocket**: 手动实现 RFC 6455 协议（无第三方库），支持在线人数实时推送
- **会话管理**: `AsyncLocalStorage` 多用户会话隔离 + Cookie 鉴权
- **安全防护**: SSRF 白名单、CSP、HSTS、速率限制、X-Frame-Options
- **节拍分析**: 自研 `dj-analyzer.js` 模块，支持音频流解码与节拍检测

### 前端 / Frontend

- **可视化**: Three.js (r128) 粒子系统 + WebGL 降级到 CSS 星空
- **动画**: GSAP 动画引擎
- **音频解码**: mpg123-decoder WASM 解码器
- **PWA**: Service Worker 离线缓存 + Web App Manifest
- **响应式**: 移动端/平板/桌面断点适配

### 工程化 / DevOps

- **测试**: Jest 单元测试（32 项，覆盖安全/缓存/Cookie 模块）
- **代码规范**: ESLint + Prettier + EditorConfig
- **CI/CD**: GitHub Actions（语法检查 + Lint + 测试）
- **容器化**: Dockerfile 多阶段构建，非 root 运行

---

## 快速开始 / Quick Start

### 环境要求

- Node.js >= 18
- npm >= 9

### 本地运行

```bash
# 克隆仓库
git clone https://github.com/ElijahZhao/mineradio-WebAPP.git
cd mineradio-WebAPP

# 安装依赖
npm install

# 启动开发服务器
npm start

# 生产模式
npm run start:prod
```

打开浏览器访问 `http://localhost:3000`，点击「访问网页版」进入播放器。

### Docker 部署

```bash
docker build -t mineradio-web .
docker run -p 3000:3000 mineradio-web
```

---

## 测试 / Testing

```bash
# 运行全部测试
npm test

# 带覆盖率报告
npm run test:coverage

# 监听模式
npm run test:watch
```

测试覆盖以下核心模块：

| 测试文件 | 覆盖内容 | 测试数 |
|----------|----------|--------|
| `tests/security.test.js` | SSRF 防护白名单、私网拦截、子串绕过、协议过滤 | 17 |
| `tests/beatmap-cache.test.js` | 节拍缓存读写、LRU 淘汰、边界条件 | 8 |
| `tests/cookie-security.test.js` | Cookie 安全标志（HttpOnly/Secure/SameSite） | 7 |

---

## 项目结构 / Project Structure

```
mineradio-WebAPP/
├── server.js                 # 后端入口（路由 + API + WebSocket + 安全防护）
├── dj-analyzer.js            # 音频节拍分析模块
├── public/
│   ├── landing.html          # 初始页面（Three.js 粒子背景）
│   ├── index.html            # 播放器本体
│   ├── desktop-lyrics.html   # 桌面悬浮歌词
│   ├── wallpaper.html        # 壁纸模式
│   ├── manifest.json         # PWA 清单
│   ├── sw.js                 # Service Worker（离线缓存）
│   ├── icons/                # PWA 图标（192/256/512 + favicon）
│   ├── vendor/               # 第三方库（Three.js / GSAP / music-tempo）
│   └── assets/               # 静态资源
├── tests/                    # Jest 单元测试
│   ├── security.test.js
│   ├── beatmap-cache.test.js
│   └── cookie-security.test.js
├── .github/workflows/ci.yml  # GitHub Actions CI
├── Dockerfile                # Docker 多阶段构建
├── .eslintrc.js              # ESLint 配置
├── .prettierrc               # Prettier 配置
├── .editorconfig             # 编辑器格式配置
└── LICENSE                   # GPL-3.0
```

---

## API 路由 / API Routes

| 路由 | 方法 | 说明 |
|------|------|------|
| `/` | GET | 初始页面（Landing Page） |
| `/app` | GET | 播放器本体 |
| `/api/health` | GET | 健康检查 |
| `/api/search` | GET | 网易云音乐搜索 |
| `/api/qq/search` | GET | QQ 音乐搜索 |
| `/api/login/qr/*` | GET | 网易云扫码登录 |
| `/api/qq/qr/*` | GET | QQ 音乐扫码登录 |
| `/api/audio` | GET | 音频代理（SSRF 白名单保护） |
| `/api/cover` | GET | 封面代理（SSRF 白名单保护） |
| `/api/podcast/dj-beatmap` | GET | 节拍分析（SSRF 白名单保护） |
| `/api/beatmap/cache` | GET/POST | 节拍图缓存读写 |
| `/ws` | WS | WebSocket 在线人数推送 |

---

## 安全特性 / Security

本项目实现了多层安全防护：

- **SSRF 防护**: 代理目标白名单（仅允许 music.126.net / music.163.com / *.qq.com），拦截私网 IP、云元数据端点、非 HTTP(S) 协议、子串绕过攻击
- **速率限制**: 基于 IP 的请求频率限制（120 次/分钟）
- **安全响应头**: HSTS、X-Content-Type-Options、X-Frame-Options、Referrer-Policy、CSP
- **Cookie 安全**: HttpOnly + SameSite=Lax + Secure（生产环境）
- **WebSocket 安全**: Origin 校验、帧大小限制（1MB）、缓冲区上限
- **请求体限制**: API 请求体 8MB 上限，日志端点 64KB 上限
- **会话隔离**: AsyncLocalStorage 多用户 Cookie 隔离

---

## 开源协议 / License

本项目基于 [GPL-3.0](LICENSE) 协议开源，基于 [XxHuberrr/Mineradio](https://github.com/XxHuberrr/Mineradio) 的 Web 移植。

第三方库致谢见 [NOTICE.md](NOTICE.md)。

---

## 致谢 / Acknowledgments

- **原作者**: [XxHuberrr](https://github.com/XxHuberrr) — Mineradio 桌面版
- **Three.js**: WebGL 3D 图形库
- **GSAP**: 高性能动画引擎
- **music-tempo**: 音频节拍检测
- **NeteaseCloudMusicApi**: 网易云音乐 API 社区封装
