# AgentConsensus | AC 30m 高频博弈舱

> 基于 A2A 协议的多 AI 节点对抗式投资决策系统

![Demo](./docs/demo.png)

## 项目简介
** For Second Me 全球首届 A2A 黑客松 [https://hackathon.second.me/]**
AgentConsensus 是一个创新的 AI 驱动投资决策系统，通过多个 AI Agent 之间的辩论和投票来达成投资共识。系统每 30 分钟完成一轮完整的决策循环，包括市场感知、多空辩论、实战交易、复盘优化四个阶段。

## 技术栈

- **前端框架**: Next.js 15.5.12
- **UI 框架**: React 18.3.1
- **样式方案**: Tailwind CSS 3.4
- **状态管理**: Zustand
- **图表库**: Recharts
- **认证**: NextAuth.js
- **数据库**: SQLite (via Prisma ORM)
- **类型**: TypeScript

## 核心功能

### 🎯 循环监控 (Loop Monitor)
- 实时追踪 40 分钟决策循环的四个阶段：
  - **感知** (2分钟): 抓取市场数据、热门板块、社交媒体情绪
  - **博弈** (8分钟): 5 个 AI Agent 进行多空辩论
  - **实战** (30分钟): 执行交易并实时监控
  - **复盘** (0分钟): 分析本轮表现并调整 Agent 权重

### 🤖 AI 辩论看板 (Debate Board)
- 5 个 AI Agent 实时参与讨论：
  - **激进派** (🎯): 追逐妖股，高风险高回报
  - **稳健派** (🛡️): 风险厌恶，注重安全
  - **哨兵** (🔍): 质疑一切，识别风险
  - **SecondMe AI-1** (🤖): 自主决策 AI
  - **SecondMe AI-2** (🤖): 自主决策 AI

### 📈 收益曲线 (Profit Curve)
- 可视化展示历史收益率
- 胜率统计
- 总回报
- 平均每轮收益

### 📊 行情监控 (Market Monitor)
- 热门板块与个股数据
- 换手率、成交量的实时追踪
- 目标股票池筛选

## 项目结构

```
AgentConsensus/
├── app/                    # Next.js App Router
│   ├── api/              # API 路由
│   │   ├── auth/           # NextAuth 认证配置
│   │   └── [...nextauth]/    # NextAuth 处理
│   ├── components/         # React 组件
│   │   ├── LoopMonitor.tsx
│   │   ├── DebateBoard.tsx
│   │   ├── ProfitCurve.tsx
│   │   └── MarketMonitor.tsx
│   ├── lib/              # 工具函数
│   │   ├── auth.ts          # 认证配置 (Demo 模式)
│   │   ├── prisma.ts       # 数据库客户端
│   │   ├── secondme.ts      # SecondMe API 客户端
│   │   ├── store.ts         # Zustand 状态管理
│   │   └── utils.ts         # 工具函数
│   ├── types/            # TypeScript 类型定义
│   ├── prisma/
│   │   └── schema.prisma    # 数据库模型
└── public/                 # 静态资源
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 初始化数据库

```bash
npx prisma db push
```

### 3. 配置环境变量

复制 `.env.local.example` 到 `.env.local`：

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# SecondMe API (生产环境需配置真实值)
SECONDME_API_ENDPOINT="https://api.second.me"
SECONDME_CLIENT_ID="your-client-id"
SECONDME_CLIENT_SECRET="your-client-secret"
```

### 4. 启动开发服务器

```bash
npm run dev
```

应用将在 http://localhost:3000 启动

## 登录说明

### Demo 模式 (当前默认)

系统内置了演示模式的 Mock 认证，无需真实登录：

1. 刷新页面
2. 点击 **"SecondMe 登录"** 按钮
3. 自动登录并进入主控制台

### 生产环境配置真实 OAuth

如需启用真实的 SecondMe OAuth 登录：

1. 修改 `lib/auth.ts` 文件
2. 将 `MockSecondMeProvider` 替换为标准的 OAuth 配置
3. 确保 `.env.local` 中的 SecondMe 凭证信息正确配置

## 组件说明

### LoopMonitor
- **状态**: 感知 (sensing)、博弈 (debating)、实战 (trading)、复盘 (reviewing)
- **进度**: 圆形进度条和倒计时
- **阶段标签**: 显示当前所处阶段

### DebateBoard
- **Agent 列表**: 显示 5 个 AI Agent
- **实时流**: 消息自动滚动显示
- **情绪标识**: 看多 (▲)、看空 (◆)、看跌 (▼)

### ProfitCurve
- **数据类型**: TypeScript 接口定义
- **图表**: Recharts AreaChart 组件
- **指标**: 胜率、总回报、平均收益

### MarketMonitor
- **行情列表**: 热门股票实时数据
- **目标股票**: 当前选中的交易标的
- **价格水平**: 入场价、目标价、止损价

## 技术特点

- ✅ **TypeScript**: 完整类型安全
- 🎨 **Tailwind CSS 3.x**: 原子化样式
- ⚡ **React 18**: 新 Hooks 和并发渲染
- 📊 **Recharts**: 响应式图表
- 🔄 **Zustand**: 轻量级状态管理
- 🔐 **NextAuth 15**: 认证中间件
- 🗄️ **Prisma**: 类型安全的 ORM
- 🎭 **Next.js 13**: App Router + 服务端组件

## 开发规范

- 代码风格: ESLint + Prettier
- 组件命名: PascalCase (组件) + camelCase (工具函数)
- 注释: JSDoc 风格
- 类型定义: TypeScript interfaces

## 常见问题

### Q: 登录后还是回到登录页？
**A**: 这是正常的。Demo 模式下，session 有效期仅限于当前浏览器会话。刷新页面会重新开始新的会话，需要重新点击登录按钮。

### Q: 如何配置真实的 SecondMe OAuth？
**A**: 见上方 "生产环境配置真实 OAuth" 章节

### Q: 如何查看实时日志？
**A**: 查看终端输出，服务器会显示编译状态和 HTTP 请求日志。

## 许可证

MIT License

---

**Made with ❤️ by AgentConsensus Team**
