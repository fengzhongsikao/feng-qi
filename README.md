# 风起 · 诗词

> **🌐 线上地址：** [windstart.top](https://windstart.top)

随机推荐一首诗，感受千年风雅。

## 截图

![风起·诗词首页](images/shicihome.png)

## 功能

- **随机诗词** — 首页随机展示一首唐诗宋词
- **搜索诗词** — 支持按标题、作者、正文关键词搜索
- **作者浏览** — 按作者浏览诗词
- **诗词详情** — 查看诗词完整内容

## 技术栈

- [Next.js](https://nextjs.org) 16 — React 框架
- [React](https://react.dev) 19
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com) v4 — 样式
- [shadcn/ui](https://ui.shadcn.com) — UI 组件（基于 [Base UI](https://base-ui.com)）
- [Lucide](https://lucide.dev) — 图标

## 本地开发

```bash
pnpm install
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 即可访问。

## 构建

```bash
pnpm build
pnpm start
```

## 项目结构

```
app/              # 路由页面
  page.tsx        # 首页（随机诗词）
  search/page.tsx # 搜索页
  authors/page.tsx# 作者列表
  poems/[id]/     # 诗词详情
components/       # UI 组件
lib/              # 工具函数和类型定义
```

## 环境要求

- Node.js 20+
- pnpm
