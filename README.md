# 重开么 · 角色盲盒

每天开一个角色盲盒，用陌生人的眼睛过一天。

**在线体验：** https://tomo-efficient.github.io/today-role/

## 功能

- 24 个内置角色，每个角色 3 个零成本线下任务
- 每日角色确定性随机：同一用户同一天角色固定，每天可换一次
- 任务展开、写心得、跳过直接完成
- Canvas 生成 1080×1440 分享图，支持三种配色
- 交流社区、热门角色榜、点赞评论
- 6 个成就、体验历史、自定义角色工坊
- 登录 / 注册 / 跳过登录直接体验，数据存在 localStorage

## 技术栈

React 18 · TypeScript · Vite · Tailwind CSS · lucide-react

## 本地运行

```bash
npm install
npm run dev
```

打开 http://127.0.0.1:5273。

## 部署

静态导出到 GitHub Pages：

```bash
PAGES_BASE_PATH=/today-role/ npm run build
```

构建产物在 `dist/`，由 `.github/workflows/deploy.yml` 发布。
