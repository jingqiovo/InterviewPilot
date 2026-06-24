import type {
  AnalysisResult,
  HistoryRecord,
  AgentStep,
  StreamMessage,
  Problem,
  Recommendation,
  ResumeVersion,
  ResumeSection,
  GapAnalysis,
} from '../types';

const SAMPLE_RESUME = `张明 | 前端开发工程师
电话: 138-xxxx-xxxx | 邮箱: zhangming@email.com | 北京

个人简介
一年半前端开发经验，熟练掌握 React、Vue 技术栈，熟悉 Node.js 后端开发。

工作经历
前端开发工程师 - 字节跳动 (2023.07 - 至今)
- 负责公司内部管理系统前端开发
- 使用 Vue 完成多个功能模块
- 协助后端调试接口

前端开发实习生 - 腾讯 (2023.01 - 2023.06)
- 参与小程序开发
- 完成用户界面优化

项目经历
电商后台管理系统 (2023.08 - 2023.12)
- 使用 Vue3 + Element Plus 开发
- 实现了数据可视化功能

个人博客 (2022.09 - 2023.02)
- React + Next.js 全栈项目
- 使用 MongoDB 存储数据

教育背景
北京邮电大学 | 计算机科学与技术 | 本科 | 2019 - 2023 | GPA 3.5/4.0

技能证书
- HTML, CSS, JavaScript, TypeScript
- React, Vue, Vue3, Node.js
- Git, Webpack, Vite
- 英语六级 520 分`;

const OPTIMIZED_RESUME_V1: ResumeSection[] = [
  {
    type: 'header',
    title: '个人信息',
    content: '张明 | 前端开发工程师 | 1.5 年经验\n北京 | 138-xxxx-xxxx | zhangming@email.com',
    modified: false,
  },
  {
    type: 'summary',
    title: '个人简介',
    content: '1.5 年前端开发经验，字节跳动业务团队成员。精通 React 与 Vue 双技术栈，具备从 0 到 1 交付中后台系统的实战经验，累计优化页面性能 40%+，擅长大屏数据可视化与交互体验提升。',
    modified: true,
  },
  {
    type: 'experience',
    title: '工作经历',
    content: `字节跳动 — 前端开发工程师（2023.07 - 至今）
• 主导企业内部管理系统前端架构设计与开发（Vue3 + Vite）
• 封装通用图表组件库，覆盖 12+ 业务模块，代码复用率提升 60%
• 优化首屏加载性能，通过代码分割与懒加载，LCP 指标降低 42%
• 与后端紧密协作，独立完成 8 个核心接口的联调与数据流设计

腾讯 — 前端开发实习生（2023.01 - 2023.06）
• 参与微信小程序核心功能迭代，独立负责 3 个业务模块开发
• 基于用户反馈优化交互流程，相关页面停留时长提升 25%`,
    modified: true,
  },
  {
    type: 'projects',
    title: '项目经历',
    content: `电商数据大屏（2023.08 - 2023.12）
• 技术栈：Vue3 + Element Plus + ECharts
• 实现实时交易数据可视化大屏，支持日/周/月维度切换
• 通过 WebSocket 推送数据，前端渲染帧率稳定在 60fps

个人技术博客（2022.09 - 2023.02）
• 技术栈：React + Next.js + MongoDB + Vercel
• 全栈独立开发，部署于 Vercel，月均 UV 2000+
• 支持 Markdown 写作与评论区功能`,
    modified: true,
  },
  {
    type: 'education',
    title: '教育背景',
    content: '北京邮电大学 | 计算机科学与技术 | 本科 | 2019 - 2023 | GPA 3.5/4.0',
    modified: false,
  },
  {
    type: 'skills',
    title: '技能证书',
    content: `前端：React, Vue3, TypeScript, JavaScript, HTML/CSS
工程化：Git, Webpack, Vite, ESLint, CI/CD
后端：Node.js, Express, MongoDB（了解）
英语：CET-6 520 分`,
    modified: true,
  },
];

const OPTIMIZED_RESUME_V2: ResumeSection[] = OPTIMIZED_RESUME_V1.map((s) => ({
  ...s,
  modified: s.type === 'summary' ? true : s.modified,
}));

const OPTIMIZED_RESUME_V3: ResumeSection[] = OPTIMIZED_RESUME_V1;

// JD-driven version: 项目经历中显式体现岗位关键词（接口联调、性能优化、组件复用）
const JD_OPTIMIZED_PROJECTS: ResumeSection[] = OPTIMIZED_RESUME_V1.map((s) => {
  if (s.type !== 'projects') return s;
  return {
    ...s,
    modified: true,
    content: `AI 简历优化助手（2024.03 - 2024.08）
• 技术栈：React + TypeScript + Tailwind CSS + Vite
• 基于 React、TypeScript 和 Tailwind CSS 实现一款 AI 简历优化产品原型，支持简历上传、岗位 JD 分析、Agent 分析过程展示、问题诊断、版本回退和结果编辑
• 与产品 / 后端协作完成 12 个核心接口的联调，封装统一的请求、错误处理与 loading 状态管理，覆盖简历上传、岗位匹配、版本回退等关键流程
• 拆分通用组件（JobBadge / GapItem / MatchRing 等），构建组件复用体系，新页面接入时间从 2 天缩短到 0.5 天
• 通过代码分割、组件懒加载、useMemo 缓存渲染结果，关键页面首屏 LCP 优化 38%

电商数据大屏（2023.08 - 2023.12）
• 技术栈：Vue3 + Element Plus + ECharts
• 实现实时交易数据可视化大屏，支持日/周/月维度切换
• 通过 WebSocket 推送数据，前端渲染帧率稳定在 60fps
• 与后端协作完成 6 个核心接口的联调与异常状态处理

个人技术博客（2022.09 - 2023.02）
• 技术栈：React + Next.js + MongoDB + Vercel
• 全栈独立开发，部署于 Vercel，月均 UV 2000+
• 支持 Markdown 写作与评论区功能`,
  };
});

// JD-driven version: 个人职责也根据 JD 描述重写
const JD_OPTIMIZED_FINAL: ResumeSection[] = JD_OPTIMIZED_PROJECTS.map((s) => {
  if (s.type === 'summary') {
    return {
      ...s,
      content: '1.5 年前端开发经验，字节跳动业务团队成员。精通 React 与 Vue 双技术栈，熟悉 TypeScript 工程化与组件化设计。具备从 0 到 1 交付中后台系统的实战经验，擅长接口联调、组件复用与性能优化。',
    };
  }
  return s;
});

const createAgentSteps = (hasJD: boolean): AgentStep[] => {
  const base: AgentStep[] = [
    {
      id: 'read',
      label: '正在读取简历内容',
      status: 'pending',
      streamMessages: [],
    },
    {
      id: 'detect',
      label: '正在识别目标岗位',
      status: 'pending',
      streamMessages: [],
    },
  ];

  if (hasJD) {
    base.push(
      {
        id: 'parseJD',
        label: '正在解析岗位 JD',
        status: 'pending',
        streamMessages: [],
      },
      {
        id: 'extractReq',
        label: '正在提取岗位核心要求',
        status: 'pending',
        streamMessages: [],
      }
    );
  }

  base.push(
    {
      id: 'analyze',
      label: hasJD ? '正在对比简历与岗位要求' : '正在分析岗位要求',
      status: 'pending',
      streamMessages: [],
    },
    {
      id: 'problems',
      label: hasJD ? '发现 4 个能力差距' : '发现 4 个待优化问题',
      status: 'pending',
      streamMessages: [],
    },
    {
      id: 'optimize',
      label: '正在生成优化建议',
      status: 'pending',
      streamMessages: [],
    },
    {
      id: 'generate',
      label: '正在生成最终优化版本',
      status: 'pending',
      streamMessages: [],
    }
  );

  return base;
};

const PROBLEMS: Problem[] = [
  {
    id: 'p1',
    title: '项目描述缺乏量化成果',
    description:
      '项目经历中未使用数据指标说明工作成效，招聘者难以评估实际贡献。建议为每个工作要点添加可量化的结果描述。',
    severity: 'high',
    section: '项目经历',
    currentText: '负责公司内部管理系统前端开发',
    suggestedFix: '负责企业内部管理系统前端架构设计与开发，使用 Vue3 + Vite 完成 12+ 业务模块开发，代码复用率提升 60%。',
  },
  {
    id: 'p2',
    title: '个人简介缺乏差异化定位',
    description:
      '现有个人简介仅罗列技术栈，未体现与目标岗位的匹配度和个人亮点。应突出与"前端开发工程师"岗位最相关的核心竞争力。',
    severity: 'medium',
    section: '个人简介',
    currentText: '一年半前端开发经验，熟练掌握 React、Vue 技术栈，熟悉 Node.js 后端开发。',
    suggestedFix: '1.5 年字节跳动业务团队前端开发经验，精通 React 与 Vue 双技术栈，具备从 0 到 1 交付中后台系统的实战经验，擅长大屏数据可视化。',
  },
  {
    id: 'p3',
    title: '技能关键词与 JD 匹配度不足',
    description:
      '目标岗位"前端开发工程师"要求熟悉主流前端框架、工程化工具和性能优化，当前简历中这些关键词出现频率偏低。',
    severity: 'medium',
    section: '技能证书',
    currentText: 'HTML, CSS, JavaScript, TypeScript',
    suggestedFix: '按类别重新组织技能，突出与目标岗位最相关的技能点，如 React/Vue 框架掌握程度、工程化工具、CI/CD 经验等。',
  },
  {
    id: 'p4',
    title: '工作经历时间线不连续',
    description:
      '简历显示工作经历从 2023.01 至今，但项目经历中"个人博客"项目时间为 2022.09 - 2023.02，与工作经历有时间重叠，需要梳理清晰的时间线。',
    severity: 'low',
    section: '项目经历',
    currentText: '个人博客 (2022.09 - 2023.02)',
    suggestedFix: '将个人博客项目时间调整为 2022.09 - 2023.01，避免与腾讯实习时间重叠，并明确标注为业余项目。',
  },
];

const RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'r1',
    category: '内容优化',
    title: '为每个项目添加量化成果指标',
    description: '将"负责 xxx 开发"改为"通过 xxx，实现了 xxx 提升（具体数值）"，便于招聘者快速评估你的贡献价值。',
    priority: 1,
    completed: false,
  },
  {
    id: 'r2',
    category: '结构优化',
    title: '重新组织个人简介结构',
    description: '将个人简介改为"经验年限 + 核心公司 + 核心技术栈 + 核心成果"的四段式结构，第一眼就建立专业印象。',
    priority: 2,
    completed: false,
  },
  {
    id: 'r3',
    category: '关键词优化',
    title: '补充与目标岗位匹配的关键词',
    description: '在技能和项目描述中增加"Vue3、Vite、Webpack、CI/CD、性能优化"等高频出现在 JD 中的关键词。',
    priority: 3,
    completed: false,
  },
  {
    id: 'r4',
    category: '格式规范',
    title: '统一时间线，避免时间重叠',
    description: '梳理所有项目的时间线，确保与工作经历不重叠，或明确标注为工作外的个人项目。',
    priority: 4,
    completed: false,
  },
];

// 基于 JD 的推荐：每条都引用 JD 中的具体要求
const JD_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'jr1',
    category: '技术栈匹配',
    title: '强化 React / TypeScript 技术实现描述',
    description: '根据 JD 中对 React、TypeScript 的明确要求，在项目经历中显式体现你在这两项技术上的具体实践，例如组件设计、类型系统、状态管理方案。',
    priority: 1,
    completed: false,
  },
  {
    id: 'jr2',
    category: '接口联调',
    title: '补充 API 请求、错误处理与数据状态管理经历',
    description: '根据 JD 中"与后端协作完成接口联调"的要求，在项目经历中加入接口请求封装、loading / error / empty 三态处理、数据缓存策略等内容。',
    priority: 2,
    completed: false,
  },
  {
    id: 'jr3',
    category: '团队协作',
    title: '补充与产品、后端协作的过程',
    description: '根据 JD 中"跨团队协作"的描述，在项目经历中加入需求评审、接口定义评审、上线联调等协作节点，体现你与产品 / 后端协作的真实过程。',
    priority: 3,
    completed: false,
  },
  {
    id: 'jr4',
    category: '性能优化',
    title: '补充加载优化、组件拆分或缓存策略相关描述',
    description: '根据 JD 中"性能优化"要求，在项目经历中加入具体的优化手段与量化结果，如代码分割、懒加载、组件拆分、缓存命中率、首屏 LCP 等指标。',
    priority: 4,
    completed: false,
  },
];

// JD-based problem: 每个问题直接对应 JD 中的具体要求
const JD_PROBLEMS: Problem[] = [
  {
    id: 'jp1',
    title: '项目经历中缺少接口联调描述',
    description: 'JD 中明确要求"独立完成接口联调"，但当前简历项目经历中未体现任何与后端协作完成接口请求、错误处理、数据状态管理的过程。建议在每个项目经历中补充这一维度。',
    severity: 'high',
    section: '项目经历',
    currentText: '负责公司内部管理系统前端开发',
    suggestedFix: '负责企业内部管理系统前端开发，与后端协作完成 8 个核心接口的联调，封装统一的请求、loading / error / empty 状态管理方案。',
  },
  {
    id: 'jp2',
    title: '技术栈表达与 JD 关键词匹配不足',
    description: 'JD 中"React / TypeScript / 组件化"为高频需求词，但当前简历技术栈中相关词汇出现频率偏低，且未在项目描述中显式体现。',
    severity: 'high',
    section: '技能证书',
    currentText: 'HTML, CSS, JavaScript, TypeScript',
    suggestedFix: '按类别组织技能：前端框架（React、Vue3）、语言（TypeScript）、工程化（Vite、Webpack、CI/CD）、组件化设计（封装通用组件库 12+）。',
  },
  {
    id: 'jp3',
    title: '缺少性能优化与组件复用设计说明',
    description: 'JD 中明确要求"具备性能优化意识"和"组件化设计能力"，但当前简历中没有任何关于加载优化、组件拆分或缓存策略的描述。',
    severity: 'medium',
    section: '项目经历',
    currentText: '使用 Vue3 + Element Plus 开发',
    suggestedFix: '基于 Vue3 + Element Plus 完成 12+ 业务模块开发，封装通用图表组件库提升复用率 60%，首屏 LCP 优化 42%。',
  },
  {
    id: 'jp4',
    title: '缺少团队协作过程的具体描述',
    description: 'JD 强调"良好的沟通协作能力"，但当前简历未体现与产品、后端协作的具体过程，如需求评审、接口定义、上线联调等。',
    severity: 'low',
    section: '工作经历',
    currentText: '使用 Vue 完成多个功能模块',
    suggestedFix: '与产品协作完成 3 轮需求评审，独立与后端定义 8 个核心接口的字段约定，推动项目按时上线。',
  },
];

const GAP_ANALYSIS: GapAnalysis = {
  matched: [
    { category: 'matched', text: 'React 基础项目经验' },
    { category: 'matched', text: 'TypeScript 使用经验' },
    { category: 'matched', text: '页面组件开发经验' },
  ],
  gaps: [
    { category: 'gap', text: '缺少接口联调经历' },
    { category: 'gap', text: '缺少性能优化描述' },
    { category: 'gap', text: '缺少组件复用设计说明' },
  ],
  enhancements: [
    {
      category: 'enhance',
      text: '在项目经历中补充接口请求、数据处理、异常状态处理等内容',
    },
    {
      category: 'enhance',
      text: '增加组件复用、状态管理和页面性能优化相关描述',
    },
    {
      category: 'enhance',
      text: '将"完成页面开发"改成更具体的"负责核心页面组件开发与接口联调"',
    },
  ],
};

export const createMockAnalysisResult = (
  resumeOverride?: { rawText: string; fileName?: string; fileSize?: number; uploadTime?: Date },
  jobOverride?: { title: string; confidence: number; isAutoDetected: boolean },
  jdOverride?: { rawText: string; fileName?: string; uploadTime?: Date }
): AnalysisResult => {
  const resume = {
    rawText: resumeOverride?.rawText || SAMPLE_RESUME,
    fileName: resumeOverride?.fileName || '张明_前端开发工程师.pdf',
    fileSize: resumeOverride?.fileSize ?? 245000,
    uploadTime: resumeOverride?.uploadTime || new Date(),
  };
  const job = jobOverride || {
    title: '前端开发工程师',
    confidence: 94,
    isAutoDetected: true,
  };
  const hasJD = !!(jdOverride && jdOverride.rawText && jdOverride.rawText.trim().length > 0);

  return {
    id: 'result-' + Date.now(),
    resume,
    job,
    jd: hasJD ? {
      rawText: jdOverride!.rawText,
      fileName: jdOverride!.fileName,
      uploadTime: jdOverride!.uploadTime || new Date(),
    } : null,
    hasJD,
    score: {
      total: hasJD ? 86 : 82,
      breakdown: {
        content: hasJD ? 84 : 78,
        structure: hasJD ? 88 : 85,
        keywords: hasJD ? 90 : 76,
        impact: hasJD ? 88 : 88,
      },
      industryAverage: 68,
    },
    match: {
      overall: hasJD ? 86 : 78,
      skills: hasJD ? 88 : 80,
      projects: hasJD ? 82 : 74,
      experience: hasJD ? 76 : 72,
      matched: [
        'React',
        'Vue/Vue3',
        'JavaScript/TypeScript',
        'Node.js',
        'Git',
        'CSS/HTML',
        '前端开发经验',
      ],
      missing: hasJD
        ? [
            '接口联调',
            '组件化设计',
            '性能优化（Lighthouse/Core Web Vitals）',
            'CI/CD',
          ]
        : [
            'Vite',
            'Webpack',
            'CI/CD',
            '性能优化（Lighthouse/Core Web Vitals）',
            '微前端',
            '单元测试（Jest/Vitest）',
          ],
      keywords: {
        found: ['React', 'Vue3', 'TypeScript', 'Node.js', 'WebSocket', 'Git'],
        missing: hasJD
          ? ['接口联调', '组件化', '性能优化', '协作']
          : ['Vite', '性能优化', 'CI/CD', '单元测试', '微前端'],
      },
      explanation: hasJD
        ? '你的技术栈与岗位要求较匹配，但项目经历中的业务结果和协作细节还可以进一步强化。'
        : '你的整体技术栈与岗位方向较匹配，建议在项目经历中补充更多可量化的结果描述。',
    },
    gap: GAP_ANALYSIS,
    problems: hasJD ? JD_PROBLEMS : PROBLEMS,
    recommendations: hasJD ? JD_RECOMMENDATIONS : RECOMMENDATIONS,
    versions: [
      {
        version: 'V1',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        score: hasJD ? 80 : 76,
        summary: '原始分析结果',
        sections: SAMPLE_RESUME.split('\n\n').map((content, i) => ({
          type: ['header', 'summary', 'experience', 'education', 'skills', 'projects'][i] as ResumeSection['type'],
          title: ['', '个人简介', '工作经历', '教育背景', '技能证书', '项目经历'][i],
          content,
          modified: false,
        })),
      },
      {
        version: 'V2',
        timestamp: new Date(Date.now() - 180000).toISOString(),
        score: hasJD ? 84 : 82,
        summary: hasJD ? '补强 JD 匹配表达' : '优化项目经历表达',
        sections: hasJD ? JD_OPTIMIZED_PROJECTS : OPTIMIZED_RESUME_V1,
      },
      {
        version: 'V3',
        timestamp: new Date().toISOString(),
        score: hasJD ? 86 : 82,
        summary: hasJD ? '强化技术栈与协作描述' : '增强岗位关键词匹配',
        sections: hasJD ? JD_OPTIMIZED_FINAL : OPTIMIZED_RESUME_V3,
      },
    ],
    currentVersion: 'V3',
    agentSteps: createAgentSteps(hasJD),
    createdAt: new Date().toISOString(),
  };
};

export const createMockHistoryRecord = (): HistoryRecord[] => [
  {
    id: 'h1',
    jobTitle: '前端开发工程师',
    hasJD: true,
    matchPercent: 86,
    score: 86,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    versionCount: 3,
    resumeSnippet: '张明 | 字节跳动 | React + Vue3...',
    result: createMockAnalysisResult(
      undefined,
      undefined,
      { rawText: SAMPLE_JD, fileName: 'JD_前端开发工程师.txt' }
    ),
  },
  {
    id: 'h2',
    jobTitle: '前端Leader',
    hasJD: false,
    matchPercent: 71,
    score: 71,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    versionCount: 2,
    resumeSnippet: '张明 | 字节跳动 | 前端团队管理...',
    result: { ...createMockAnalysisResult(), id: 'h2-result', job: { title: '前端Leader', confidence: 88, isAutoDetected: false }, score: { total: 71, breakdown: { content: 65, structure: 72, keywords: 68, impact: 78 }, industryAverage: 65 } },
  },
  {
    id: 'h3',
    jobTitle: '全栈工程师',
    hasJD: true,
    matchPercent: 82,
    score: 82,
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    versionCount: 2,
    resumeSnippet: '张明 | 全栈 | React + Node.js...',
    result: { ...createMockAnalysisResult(undefined, { title: '全栈工程师', confidence: 81, isAutoDetected: true }, { rawText: SAMPLE_JD }), id: 'h3-result', job: { title: '全栈工程师', confidence: 81, isAutoDetected: true }, score: { total: 82, breakdown: { content: 78, structure: 84, keywords: 80, impact: 86 }, industryAverage: 67 } },
  },
];

// 样本 JD 文本（首页示例用）
const SAMPLE_JD = `【岗位职责】
1. 负责公司核心产品的前端架构设计与开发，使用 React + TypeScript 构建高质量的中后台系统
2. 与产品、后端协作完成接口联调，推动需求按时上线
3. 持续优化页面性能，关注 Core Web Vitals 指标，提升用户体验
4. 抽象通用组件，建立组件库体系，提升团队整体开发效率

【任职要求】
1. 本科及以上学历，计算机相关专业，1 年以上前端开发经验
2. 精通 React / Vue 等主流前端框架，熟悉 TypeScript
3. 具备良好的组件化设计能力，能独立封装通用组件
4. 有性能优化经验，理解加载策略、缓存机制与代码分割
5. 良好的沟通协作能力，能与产品、设计、后端顺畅合作`;

export const STREAM_MESSAGES: StreamMessage[] = [
  { id: 's1', text: '正在解析简历文本...', timestamp: '00:00', type: 'info' },
  { id: 's2', text: '检测到简历格式：标准文本结构', timestamp: '00:01', type: 'info' },
  { id: 's3', text: '识别到个人信息：张明，前端开发工程师', timestamp: '00:02', type: 'success' },
  { id: 's4', text: '开始分析目标岗位匹配度...', timestamp: '00:03', type: 'thinking' },
  { id: 's5', text: '分析工作经历：字节跳动 + 腾讯，双技术栈背景', timestamp: '00:05', type: 'info' },
  { id: 's6', text: '检测到项目描述缺少量化成果，正在标记...', timestamp: '00:07', type: 'thinking' },
  { id: 's7', text: '发现可优化点：个人简介缺乏差异化定位', timestamp: '00:08', type: 'info' },
  { id: 's8', text: '关键词匹配分析中... React ✓ Vue ✓ TypeScript ✓', timestamp: '00:10', type: 'info' },
  { id: 's9', text: '缺失关键词：Vite、Webpack、CI/CD、性能优化', timestamp: '00:11', type: 'info' },
  { id: 's10', text: '正在生成优化建议...', timestamp: '00:12', type: 'thinking' },
  { id: 's11', text: '量化项目成果表述中...', timestamp: '00:13', type: 'thinking' },
  { id: 's12', text: '检测到时间线重叠问题，正在修正...', timestamp: '00:14', type: 'info' },
  { id: 's13', text: '开始生成优化后简历内容...', timestamp: '00:15', type: 'info' },
  { id: 's14', text: '优化完成！综合评分 82/100', timestamp: '00:16', type: 'success' },
];

export { SAMPLE_RESUME };
