# 今日角色（Today Role）

每天获得一个虚构身份和 3 个线下任务，用新的视角完成一次日常观察。

**在线体验：** https://tomo-efficient.github.io/today-role/

## 功能

- 10 个角色、10 类主题，每个角色 3 个线下观察任务
- 按 userId + 日期确定性生成每日 4 个角色序列（1 个主角色 + 3 个备选），每天最多换 3 次
- 任务勾选、逐条文字心得、连续天数、完成任务数、体验角色数
- 6 个成就：初体验、连续 3 天、连续 7 天、完成 10 个任务、体验 5 个角色、完美一日
- html2canvas 生成分享图；进度和成就保存在 localStorage
- 移动端优先

## 技术栈

Next.js 14（App Router）· TypeScript · Tailwind CSS · framer-motion · html2canvas

## 本地运行

```bash
npm install
npm run dev
```

打开 http://localhost:3000。

## 部署

静态导出到 GitHub Pages：

```bash
PAGES_BASE_PATH=/today-role npm run build
```

构建产物在 `out/`，由 `.github/workflows/deploy.yml` 发布到 GitHub Pages。
