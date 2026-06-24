# ResumePilot AI - 产品设计规格文档

## 1. Concept & Vision

ResumePilot AI 是一款面向应届毕业生的 AI 简历优化 Agent 原型。它不是简历生成器，而是一位安静的、有洞察力的职业顾问——克制、专业、透明。用户始终知道 AI 在做什么、为什么做、结果可信度如何。视觉语言借鉴 Claude / Cursor / Linear 的克制美学：无装饰、重内容、可信赖。

## 2. Design Language

### Aesthetic Direction
线性克制主义（Linear Minimal）——参考 Linear App 的暗色克制感，但采用浅色主题以适配 Notion 式的文档感。大量留白，信息密度适中，无任何视觉噪音。

### Color Palette
- **Background**: `#FAFAFA` (页面底色)
- **Surface**: `#FFFFFF` (卡片/面板)
- **Border**: `#E5E5E5` (边框)
- **Border Hover**: `#D1D5DB`
- **Text Primary**: `#111111`
- **Text Secondary**: `#6B7280`
- **Text Tertiary**: `#9CA3AF`
- **Accent**: `#4F46E5` (Indigo-600, 主操作色)
- **Accent Hover**: `#4338CA` (Indigo-700)
- **Accent Light**: `#EEF2FF` (Indigo-50, 背景强调)
- **Success**: `#10B981` (Emerald-500)
- **Warning**: `#F59E0B` (Amber-500)
- **Error**: `#EF4444` (Red-500)
- **Error Light**: `#FEF2F2`
- **Agent Active**: `#4F46E5`
- **Agent Done**: `#10B981`
- **Agent Pending**: `#D1D5DB`

### Typography
- **Font**: `Inter` (Google Fonts)
- **Heading XL**: 28px / 700 / -0.02em
- **Heading L**: 22px / 600 / -0.01em
- **Heading M**: 18px / 600
- **Body**: 15px / 400 / 1.6
- **Body Small**: 13px / 400
- **Label**: 12px / 500 / uppercase / 0.04em (按钮、标签)

### Spatial System
- Base unit: 4px
- Component padding: 16px / 20px / 24px
- Section gap: 32px / 48px
- Max content width: 800px (居中)
- Card border-radius: 12px

### Motion Philosophy
- 过渡时长: 150ms (快速) / 300ms (标准) / 500ms (展开)
- 缓动: `ease-out`
- 流式文字: 逐字符/逐词出现，40ms/词
- 步骤切换: opacity + translateY
- 页面切换: opacity 淡入淡出

### Visual Assets
- Icons: Lucide React (consistent stroke-width: 1.5)
- 无插图、无装饰图形
- 状态指示器: 圆点 + 文字

## 3. Layout & Structure

### 全局布局
- 顶部固定导航栏: Logo + 导航链接 + 历史入口
- 内容区: 单列，最大宽度 800px，居中
- 响应式: 移动端 100% 宽度，左右 padding 16px

### 页面架构
1. **HomePage** - 输入层（简历上传 + 岗位确认）
2. **AnalysisPage** - 过程层（Agent步骤 + 流式输出）
3. **ResultPage** - 结果层（评分 → 匹配度 → 诊断 → 建议 → 简历 → 版本）
4. **HistoryPage** - 历史层（记录列表）

### Visual Pacing
- 首页: 大量留白，呼吸感，中心聚焦上传
- 分析页: 左右分栏 (Agent步骤 40% / 流式输出 60%)
- 结果页: 卡片流，信息密度递增

## 4. Features & Interactions

### 首页
- 拖拽上传区域: 虚线边框 + 上传图标 + 提示文字
  - 拖拽进入时: 边框变实色 + 背景微微变蓝
  - 上传中: 显示进度条
  - 上传成功: 显示文件名 + 文件大小 + 重新上传按钮
- 粘贴文本区: 可折叠的"或者粘贴简历文本"入口
- 岗位输入框: AI自动识别后显示徽章提示
- 主按钮: 禁用状态至简历和岗位都准备好

### 分析页
- 顶部状态条: "正在分析简历..." + 进度百分比
- 左侧 Agent 步骤列表:
  - 等待中: 灰色圆点 + 灰色文字
  - 进行中: 蓝色脉冲圆点 + 蓝色文字
  - 完成: 绿色勾选 + 灰色文字
- 右侧流式输出面板:
  - 逐词显示 AI 思考过程
  - 带有时间戳的行
  - 完成时所有行静止
- 失败模拟按钮: 位于右下角，测试失败状态
- 完成时: 显示"查看结果"按钮

### 结果页
- **Score Card**: 大号数字评分 (82/100)，与行业平均对比条
- **Match Card**: 岗位匹配度百分比 + 雷达图(模拟) + 匹配项清单
- **Problem Card**: 问题列表，摘要默认展示，点击"展开详情"展开
- **Recommendation Card**: 优化建议列表，每条可勾选"已处理"
- **Resume Editor**: 优化后简历，支持编辑，显示 diff 高亮
- **Version Card**: V1/V2/V3 切换器，默认折叠，点击展开
- **Regenerate Button**: 重新生成整个结果
- **Export Button**: 导出 PDF / Word 按钮组
- **Agent Analysis Record**: 默认折叠，展开显示分析步骤记录

### 异常状态
- **上传失败**: 说明原因 + 重试按钮 + 粘贴文本替代入口
- **格式错误**: 支持格式列表 + 手动粘贴提示
- **解析失败**: 保留输入 + 重试 + 手动修正
- **生成超时**: 显示进度 + 重新生成按钮
- **结果不满意**: 重新生成 + 版本回退 + 手动编辑

### 历史页
- 记录卡片: 岗位 / 日期 / 评分 / 版本数
- 操作: 查看详情 / 恢复版本 / 删除（含确认弹窗）
- 空状态: 插画 + "还没有分析记录"

## 5. Component Inventory

### NavBar
- Logo (文字) + 导航 ("开始分析" / "历史记录")
- 固定顶部，backdrop-blur 背景

### UploadZone
- States: idle / drag-over / uploading / success / error
- 拖拽进入视觉反馈，禁用拖拽时的禁用态

### JobInput
- AI识别徽章动画出现
- 编辑模式切换

### AgentSteps
- 垂直时间线，每步骤: 状态图标 + 文字 + 时间
- 完成步骤: checkmark + 完成时间
- 当前步骤: 脉冲动画

### StreamOutput
- 打字机效果，cursor blink
- 时间戳行

### ScoreCard
- 大数字 + "/100" 小字
- 评分分布条（低/中/高三段）

### MatchCard
- 百分比圆环进度
- 匹配项列表

### ProblemCard
- 折叠/展开交互
- 问题严重程度颜色标识

### RecommendationCard
- 可交互勾选

### ResumeEditor
- 可编辑 textarea / contenteditable
- diff 样式高亮修改内容

### VersionSwitcher
- 版本标签切换
- 恢复按钮

### ExportButton
- 按钮组弹出

### ErrorState
- 错误图标 + 描述 + 行动按钮

### ConfirmDialog
- 模态遮罩 + 确认/取消

## 6. Technical Approach

### Framework
- React 18 + TypeScript
- Vite 5
- Tailwind CSS v3
- React Router v6 (SPA 路由)
- Lucide React (图标)
- Zustand (轻量状态管理)

### Architecture
```
src/
├── types/           # TypeScript interfaces
├── data/            # Mock data & constants
├── hooks/           # Custom hooks (useAnalysis, useStream, useHistory)
├── store/           # Zustand store
├── components/      # Reusable UI components
│   ├── ui/          # Base UI (Button, Badge, Card, etc.)
│   └── features/    # Feature components
├── pages/           # Route pages
└── styles/          # Global styles
```

### Data Flow
- Zustand store 持有全局状态 (resume, job, analysisResult, history)
- 页面组件从 store 读取状态
- 模拟数据通过 hooks 模拟 API 延迟

### Routing
- `/` → HomePage
- `/analysis` → AnalysisPage
- `/result` → ResultPage
- `/history` → HistoryPage
