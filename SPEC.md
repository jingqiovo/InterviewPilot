# InterviewPilot - 产品设计规格文档

## 1. Concept & Vision

InterviewPilot 是一款 AI 面试陪练 Agent 原型。它不是简历分析工具，也不是面试题库，而是一位专业的、克制的、像真正面试官一样的陪练伙伴——它会主动提问、追问、评估、反馈。用户进入产品的第一感觉是"我要开始练面试了"，而不是"我要上传一个文件"。视觉语言借鉴 Duolingo 的练习感 + Linear 的克制 + Claude 的可信度：白底为主、深色点缀、大量留白、克制留边框。

## 2. Design Language

### Aesthetic Direction
训练产品克制主义（Training Minimal）——参考 Duolingo 的"练习即将开始"的感觉，但采用 Linear 式的克制版式。整体以白色为主，深色仅用于核心交互按钮和强调文字。大量留白，少边框，多用 grid gap 实现区域分割。

### Color Palette
- **Background**: `#FFFFFF` (页面主底色)
- **Background Subtle**: `#FAFAFA` (准备区、统计区)
- **Surface**: `#FFFFFF` (卡片/面板)
- **Border**: `#E5E7EB` (边框)
- **Border Hover**: `#D1D5DB`
- **Border Strong**: `#111827` (激活态边框)
- **Text Primary**: `#111827`
- **Text Secondary**: `#6B7280`
- **Text Tertiary**: `#9CA3AF`
- **Text Placeholder**: `#D1D5DB`
- **Accent**: `#111827` (Black, 主操作按钮)
- **Accent Hover**: `#374151`
- **Success**: `#16A34A` (Green-600)
- **Success Subtle**: `#DCFCE7` (Green-100)
- **Score High**: `#16A34A` (80+ 分)
- **Score Mid**: `#F59E0B` (60-80)
- **Score Low**: `#EF4444` (<60)
- **Growth Bar**: `#111827` (柱状图)

### Typography
- **Font**: `Inter` (Google Fonts)
- **Hero Headline**: 44-52px / 600 / -0.02em (首页主标题)
- **Heading XL**: 32px / 600 / -0.02em
- **Heading L**: 24px / 600 / -0.01em
- **Heading M**: 18px / 600
- **Body**: 15px / 400 / 1.6
- **Body Small**: 13px / 400 / 1.5
- **Label**: 12px / 500 / uppercase / 0.05em (章节小标)
- **Caption**: 11px / 400 (辅助信息)

### Spatial System
- Base unit: 4px
- Component padding: 16px / 24px / 32px
- Section gap: 48px / 64px / 80px
- Max content width: 1080px (居中)
- Card border-radius: 16px / 20px
- Button border-radius: 12px

### Motion Philosophy
- 过渡时长: 200ms (快速) / 400ms (标准) / 600ms (展开)
- 缓动: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo)
- 卡片悬停: translateY(-2px) + opacity 渐变
- 准备区展开: opacity + translateY(16px)
- 按钮交互: 0.15s 颜色切换

### Visual Assets
- Icons: Lucide React (consistent stroke-width: 1.5-1.75)
- 无插图、无装饰图形
- 状态指示器: 圆点 + 文字
- 柱状图: 渐变透明度展示成长趋势

## 3. Layout & Structure

### 全局布局
- 顶部固定导航栏: Logo + 历史入口（简化）
- 内容区: 单列，最大宽度 1080px，居中
- 响应式: 移动端 100% 宽度，左右 padding 16-32px

### 页面架构
1. **HomePage** - 训练入口层（品牌 → 三种训练 → 准备区 → 成长区）
2. **AnalysisPage** - 过程层（Agent 分析简历，生成专属问题）
3. **InterviewPage** - 对话层（模拟面试问答）
4. **ResultPage** - 反馈层（评分 + 能力拆解 + 改进建议）
5. **HistoryPage** - 历史层（练习记录列表）

### Visual Pacing
- 首页: 大量留白，呼吸感，Hero → 三栏训练卡 → 准备区 → 成长区
- 分析页: 单列流式展示，Agent 步骤可视化
- 面试页: 单列对话流，问题居中突出
- 结果页: 卡片流，分层展示（评分 → 拆解 → 建议）

### 首页布局（核心）
```
[品牌区]                  居中：Logo + Hero Headline + Subtitle
   ↓
[三栏训练卡片]            项目追问 / 技术面试 / HR 行为面
   ↓
[准备区]                  上传简历 + 岗位 + 开始练习（点击训练卡后才出现）
   ↓
[成长区]                  训练次数 + 平均评分 + 能力趋势柱状图 + 最近记录
```

## 4. Features & Interactions

### 首页（HomePage）

**品牌区**
- 居中 Logo（黑色方块 + Mic 图标 + InterviewPilot 字样）
- Hero Headline: "像真实面试一样练习，而不是背答案。"
- Subtitle: 解释 Coach 定位

**三栏训练卡片**
- 三张并排卡片，每张代表一种训练模式
- 每张卡片包含：
  - 左上角图标（Code2 / Target / Users）
  - 右上角箭头（hover 时右移）
  - 标题 + 英文副标（uppercase + tracking）
  - 简短描述
  - 时长 + 题数
- 悬停效果：浮起 + 边框变深 + 图标变黑色填充
- 点击：选中态 + 下方展开准备区

**准备区（点击训练卡后才出现）**
- 章节小标："训练准备"（带小圆点 + uppercase）
- 标题: "上传简历，让 AI 更懂你"
- 副文案: "这不是报名，这是开始前的准备。AI 会基于你的简历定制专属问题。"
- 三列布局：
  - 左 3 列：上传区（拖拽 + 文件选择 + 粘贴文本）
  - 右 2 列：岗位输入 + JD 折叠 + 开始练习按钮
- 主按钮："开始练习" + Play 图标（黑色填充）

**成长区**
- 章节小标："你的成长"
- 标题: "持续练习，看到进步"
- 三栏 grid（用 gap 实现分割）：
  - 训练次数 + Sparkles 图标
  - 平均评分 + Award 图标（含文案解读）
  - 能力趋势 + TrendingUp 图标 + 柱状图
- 最近训练列表（前 3 条，含标题、公司、题数、日期、分数）

### 分析页（AnalysisPage）
- 顶部状态条: "正在分析简历..." + 进度百分比
- Agent 步骤列表:
  - 等待中: 灰色圆点 + 灰色文字
  - 进行中: 黑色脉冲圆点 + 黑色文字
  - 完成: 绿色勾选 + 灰色文字
- 流式输出面板: 逐词显示 AI 思考过程
- 完成时: 显示"进入面试"按钮

### 面试页（InterviewPage）
- 单列对话流
- 当前问题居中突出显示（编号、类型标签、难度标识）
- 答案输入框（大尺寸 textarea）
- 操作区：跳过 / 提交 / 下一题
- 进度指示：第 N 题 / 共 M 题
- AI 追问：根据用户回答动态生成

### 结果页（ResultPage）
- **Score Card**: 大号数字评分 + 与历史平均对比
- **Breakdown Card**: 多维度能力雷达图（模拟）
- **Diagnosis Card**: 强项 / 弱项 / 机会 三栏
- **Suggestion Card**: 改进建议列表（可勾选）
- **Action Items**: 下次练习重点

### 异常状态
- **上传失败**: 说明原因 + 重试按钮 + 粘贴文本替代入口
- **格式错误**: 支持格式列表 + 手动粘贴提示
- **解析失败**: 保留输入 + 重试 + 手动修正
- **生成超时**: 显示进度 + 重新生成按钮
- **面试中断**: 保存进度 + 稍后继续

### 历史页（HistoryPage）
- 记录卡片: 训练类型 / 岗位 / 日期 / 评分
- 操作: 查看详情 / 重新练习 / 删除（含确认弹窗）
- 空状态: 简洁提示 "还没有训练记录，开始你的第一次练习"

## 5. Component Inventory

### NavBar
- Logo (黑色方块 + Mic 图标 + InterviewPilot 字样)
- 右侧历史入口
- 简化版（不显示多导航项）

### PracticeCard
- 三种训练模式对应的卡片
- States: default / hover / selected
- 悬停浮起 + 箭头位移
- 选中态：黑色边框 + 阴影

### UploadZone
- States: idle / drag-over / success / error
- 支持拖拽 + 点击选择 + 文本粘贴
- 上传成功后显示文件名 + 移除按钮

### JobInput
- 简洁输入框 + 占位提示
- 岗位描述可折叠展开

### AgentSteps
- 垂直时间线，每步骤: 状态图标 + 文字 + 时间
- 完成步骤: checkmark + 完成时间
- 当前步骤: 脉冲动画

### StreamOutput
- 打字机效果，cursor blink
- 时间戳行

### ScoreCard
- 大数字 + 描述文案
- 评分等级颜色标识

### BreakdownCard
- 多维度能力评分（条形 / 雷达）
- 各维度描述

### DiagnosisCard
- 三栏：强项 / 弱项 / 机会
- 简洁列表

### SuggestionCard
- 改进建议列表
- 可交互勾选

### GrowthChart
- 柱状图展示最近 N 次训练分数
- 渐变透明度表现时间顺序
- 空状态：灰色占位

### HistoryList
- 列表式展示训练记录
- 每条：标题、公司、题数、日期、分数

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
├── data/            # Mock data & constants (mockResume, mockQuestions, mockHistory)
├── hooks/           # Custom hooks (useAnalysis, useStream, useHistory)
├── store/           # Zustand store (appStore.ts)
├── components/
│   ├── ui/          # Base UI (Button, Badge, Card, Dialog, etc.)
│   └── features/    # Feature components (NavBar, UploadZone, etc.)
├── pages/
│   ├── HomePage.tsx       # 训练入口层
│   ├── AnalysisPage.tsx   # Agent 分析过程
│   ├── InterviewPage.tsx  # 模拟面试对话
│   ├── ResultPage.tsx     # 反馈结果
│   └── HistoryPage.tsx    # 历史记录
└── styles/          # Global styles
```

### Data Flow
- Zustand store 持有全局状态
  - resumeContent: 简历内容
  - positionTitle: 目标岗位
  - jobJDContent: 岗位描述
  - questions: 面试问题列表
  - answers: 用户回答（Map）
  - result: 评分结果
  - history: 历史训练记录
- 页面组件从 store 读取状态
- 模拟数据通过 hooks 模拟 API 延迟

### Routing
- `/` → HomePage
- `/analysis` → AnalysisPage
- `/interview` → InterviewPage
- `/result` → ResultPage
- `/history` → HistoryPage

### 设计原则
- **训练优先**: 首页核心是"选择训练"而非"上传简历"
- **成长可视**: 练习次数、评分、趋势在首页始终可见
- **准备延后**: 上传简历是训练开始前的步骤，不是主流程
- **反馈分层**: 评分 → 拆解 → 建议，三层结构
- **视觉克制**: 白底为主，深色仅用于关键交互
- **陪练感**: 文案使用"开始练习"、"继续训练"等动词，避免"上传"、"分析"等工具感词汇
