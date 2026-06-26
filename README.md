<div align="center">

<br/>

# 🍽️ Mens

**现代化餐厅数字菜单展示与管理系统**

<br/>

[![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)](https://svelte.dev)
[![Tauri](https://img.shields.io/badge/Tauri-FFC131?style=for-the-badge&logo=tauri&logoColor=black)](https://tauri.app)
[![Rust](https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white)](https://www.rust-lang.org)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](#-license)

<br/>

<p>
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white"/>
<img src="https://img.shields.io/badge/Svelte_5-FF3E00?style=flat-square&logo=svelte&logoColor=white"/>
<img src="https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white"/>
<img src="https://img.shields.io/badge/Vite_7-646CFF?style=flat-square&logo=vite&logoColor=white"/>
<img src="https://img.shields.io/badge/pnpm-F69220?style=flat-square&logo=pnpm&logoColor=white"/>
</p>

<p><i>为餐厅打造的桌面端数字菜单方案 — 顾客看得见的美味，老板管得住的后台</i></p>

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
- **图片支持** — URL 上传，即传即看
- **数据统计** — 总菜品数、各分类数、折扣菜品数一目了然
- **搜索与筛选** — 按名称搜索、按分类过滤
- **个性化设置** — 主题色、背景图、WiFi 信息、二维码

</td>
</tr>
<tr>
<td colspan="2">

### 🔐 认证与安全

- 首次启动自动创建管理员账户（随机密码打印到控制台）
- 本地 SHA-256 密码哈希存储
- 角色权限控制：管理员专属操作
- 所有数据本地 SQLite 存储，无需网络

</td>
</tr>
</table>

## 🏗️ 系统架构

```
┌──────────────────────────────┐
│       Tauri Desktop App      │
│  ┌──────────┐ ┌───────────┐  │
│  │ SvelteKit│ │   Rust    │  │
│  │ Frontend │◄┤ Commands  │  │
│  │ (WebView)│ │ (Backend) │  │
│  └──────────┘ └─────┬─────┘  │
│                     │        │
│              ┌──────▼──────┐ │
│              │   SQLite    │ │
│              │  (本地数据库) │ │
│              └─────────────┘ │
└──────────────────────────────┘
```

<table>
<tr><th>层级</th><th>技术栈</th></tr>
<tr><td><b>前端</b></td><td>SvelteKit 2 · Svelte 5 · TypeScript 5.9 · Tailwind CSS 4 · Bits UI · Vite 7</td></tr>
<tr><td><b>后端</b></td><td>Tauri 2 · Rust · rusqlite</td></tr>
<tr><td><b>数据库</b></td><td>SQLite (本地文件)</td></tr>
<tr><td><b>打包</b></td><td>Tauri Bundler (MSI / DMG / AppImage)</td></tr>
</table>

## 🚀 快速开始

### 前置要求

- [Rust](https://rustup.rs) (latest stable)
- [Node.js](https://nodejs.org) 22+
- [pnpm](https://pnpm.io) 10+

### 开发模式

```bash
git clone https://github.com/Miaoyww/Mens.git
cd Mens
pnpm install
pnpm tauri dev
```

> 首次启动自动创建管理员账户，密码打印在控制台中。

### 生产构建

```bash
pnpm tauri build
```

构建产物在 `src-tauri/target/release/bundle/` 目录下。

## 📊 数据模型

```
┌─────────────────┐     ┌──────────────────────┐
│      User       │     │        Dish          │
├─────────────────┤     ├──────────────────────┤
│ id       (PK)   │     │ id         (PK UUID) │
│ username (UNIQ) │     │ name                 │
│ password_sha256  │     │ price      (REAL)   │
│ role             │     │ image                │
└─────────────────┘     │ category             │
                        │ discount   (REAL)    │
                        └──────────────────────┘
```

## 📄 License

本项目基于 [MIT License](LICENSE) 开源。

Copyright © 2025 GoldenEggs-Workshop

---

<div align="center">
<br/>

**Made with ❤️ by [Miaoyww](https://github.com/Miaoyww)**

<br/>
</div>
