<div align="center">

<br/>

# 🍽️ Mens

**现代化餐厅数字菜单展示与管理系统**

<br/>

[![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)](https://svelte.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![MongoDB](https://img.shields.io/badge/MongoDB_8-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](#-license)

<br/>

<p>
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white"/>
<img src="https://img.shields.io/badge/Python_3.11-3776AB?style=flat-square&logo=python&logoColor=white"/>
<img src="https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white"/>
<img src="https://img.shields.io/badge/Svelte_5-FF3E00?style=flat-square&logo=svelte&logoColor=white"/>
<img src="https://img.shields.io/badge/Vite_7-646CFF?style=flat-square&logo=vite&logoColor=white"/>
<img src="https://img.shields.io/badge/Nginx-009639?style=flat-square&logo=nginx&logoColor=white"/>
<img src="https://img.shields.io/badge/pnpm-F69220?style=flat-square&logo=pnpm&logoColor=white"/>
</p>

<p><i>为餐厅打造的全栈数字菜单方案 — 顾客看得见的美味，老板管得住的后台</i></p>

<br/>

</div>

---

## ✨ 功能亮点

<table>
<tr>
<td width="50%" valign="top">

### 📺 公共菜单展示

- **双栏布局** — 左侧文字价目表 + 右侧精美图片卡片
- **自动循环滚动** — 60fps 丝滑动画，到底自动回滚
- **折扣标识** — "限时优惠" 徽章 + 原价划线 + 折后价
- **分类浏览** — 冷菜 🥗 / 热菜 🔥 / 汤 🍲
- **响应式网格** — 6列 → 3列 → 2列 → 1列自适应

</td>
<td width="50%" valign="top">

### 🔧 管理后台

- **完整 CRUD** — 新增 / 编辑 / 删除菜品，实时预览
- **图片支持** — URL 或 Base64 上传，即传即看
- **数据统计** — 总菜品数、各分类数、折扣菜品数一目了然
- **搜索与筛选** — 按名称搜索、按分类过滤
- **个性化设置** — 主题色、背景图、WiFi 信息、二维码

</td>
</tr>
<tr>
<td colspan="2">

### 🔐 认证与安全

- 首次启动引导：自动创建管理员账户
- 基于 Session Cookie 的登录机制（30 天自动续期）
- 角色权限控制：管理员专属操作
- SHA-256 密码哈希存储
- MongoDB 事务支持 + 指数退避重试

</td>
</tr>
</table>

## 🏗️ 系统架构

```
                          ┌──────────────┐
                          │    Client    │
                          └──────┬───────┘
                                 │
                          ┌──────▼───────┐
                          │ Nginx  :80   │
                          └──┬───────┬───┘
                             │       │
                    /api/*   │       │   /*
                             │       │
                   ┌─────────▼──┐ ┌──▼──────────┐
                   │  Backend   │ │  Frontend    │
                   │ FastAPI    │ │  SvelteKit   │
                   │   :8000    │ │    :3000     │
                   └─────┬──────┘ └─────────────┘
                         │
                   ┌─────▼──────┐
                   │  MongoDB 8 │
                   │ ReplicaSet │
                   │   :27017   │
                   └────────────┘
```

<table>
<tr><th>层级</th><th>技术栈</th></tr>
<tr><td><b>前端</b></td><td>SvelteKit 2 · Svelte 5 · TypeScript 5.9 · Tailwind CSS 4 · Bits UI · Vite 7</td></tr>
<tr><td><b>后端</b></td><td>FastAPI 0.116 · Beanie 2 (MongoDB ODM) · Pydantic 2 · Uvicorn</td></tr>
<tr><td><b>数据库</b></td><td>MongoDB 8 (Replica Set)</td></tr>
<tr><td><b>部署</b></td><td>Docker · Docker Compose · Nginx · GitHub Actions CI/CD</td></tr>
</table>

## 🚀 快速开始

### 一键启动（推荐）

```bash
git clone https://github.com/Miaoyww/Mens.git
cd Mens
docker compose up --build
```

打开 **http://localhost** 即可使用 🎉

> 首次访问进入管理后台 `/admin`，系统会引导你创建管理员账户。

### 本地开发

<details>
<summary><b>📦 后端</b></summary>

<br/>

```bash
cd backend
python -m venv .venv

# Linux / macOS
source .venv/bin/activate
# Windows
.venv\Scripts\activate

pip install -r requirements.txt
```

创建 `backend/config.toml`：

```toml
mongodb_url = "mongodb://localhost:27017/dish_menu?replicaSet=rs0"
mongodb_db = "dish_menu"
mongodb_username = ""
mongodb_password = ""
secret_key = "your-secret-key"
```

```bash
python main.py
# ✅ Backend running at http://localhost:8000
```

</details>

<details>
<summary><b>🎨 前端</b></summary>

<br/>

```bash
cd frontend
pnpm install
pnpm dev
# ✅ Frontend running at http://localhost:5173
```

开发模式下 `/api` 请求自动代理到 `http://localhost:8000`。

</details>

## 📡 API 参考

### 用户 `/api/user`

| 方法 | 路径 | 说明 | 认证 |
|:----:|------|------|:----:|
| `POST` | `/setup` | 初始化管理员（首次使用，仅一次） | — |
| `POST` | `/register` | 注册新用户 | — |
| `POST` | `/login` | 登录，返回 Session Cookie | — |
| `POST` | `/self/get` | 获取当前用户信息 | 🔑 |
| `POST` | `/logout` | 退出登录 | 🔑 |

### 菜品 `/api/dish`

| 方法 | 路径 | 说明 | 认证 |
|:----:|------|------|:----:|
| `GET` | `/list` | 获取菜品列表（`?category=hot\|cold\|soup`） | — |
| `POST` | `/create` | 创建菜品 | 🔒 |
| `PATCH` | `/{id}/update` | 更新菜品 | 🔒 |
| `DELETE` | `/{id}/delete` | 删除菜品 | 🔒 |

> 🔑 需登录 &nbsp;&nbsp; 🔒 需管理员权限

## 📁 项目结构

```
Mens/
├── frontend/                    # SvelteKit 前端应用
│   ├── src/
│   │   ├── lib/
│   │   │   ├── components/      # UI 组件 (DishCard, Sidebar, Dialog...)
│   │   │   ├── stores/          # 状态管理 (dish, auth, admin, settings)
│   │   │   └── utils.ts         # 工具函数
│   │   └── routes/
│   │       ├── +page.svelte     # 公共菜单展示页
│   │       └── admin/           # 管理后台
│   ├── Dockerfile
│   └── package.json
│
├── backend/                     # FastAPI 后端服务
│   ├── src/
│   │   ├── service/             # 路由 & 业务逻辑
│   │   ├── db/                  # 数据库模型 (User, Dish, Session)
│   │   └── types/               # 自定义类型 (Decimal128)
│   ├── nginx/                   # Nginx 反代配置
│   ├── Dockerfile
│   └── requirements.txt
│
├── docker-compose.yml           # 全栈服务编排
└── .github/workflows/           # CI/CD 自动构建
```

## 📊 数据模型

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────────────┐
│      User       │     │   UserSession    │     │        Dish          │
├─────────────────┤     ├──────────────────┤     ├──────────────────────┤
│ username  (uniq)│◄────│ user       (ref) │     │ name       (indexed) │
│ password_sha256 │     │ value      (uniq)│     │ price    (Decimal128)│
│ role            │     │ expires_at       │     │ image                │
└─────────────────┘     └──────────────────┘     │ category   (indexed) │
                                                  │ discount  (0.0~1.0) │
                                                  └──────────────────────┘
```

## ⚙️ 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `MONGODB_URL` | MongoDB 连接地址 | `mongodb://mongo:27017/dish_menu?replicaSet=rs0` |
| `MONGODB_DB` | 数据库名 | `dish_menu` |
| `MONGODB_USERNAME` | 数据库用户名 | — |
| `MONGODB_PASSWORD` | 数据库密码 | — |
| `SECRET_KEY` | 签名密钥 | — |
| `PORT` | 前端服务端口 | `3000` |

## 📄 License

本项目基于 [MIT License](backend/LICENSE) 开源。

Copyright © 2025 GoldenEggs-Workshop

---

<div align="center">
<br/>

**Made with ❤️ by [Miaoyww](https://github.com/Miaoyww)**

<br/>
</div>