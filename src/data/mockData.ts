import { InterviewQuestion, InterviewResult, HistoryRecord } from '@/types';

export const mockResume = `李明
高级前端工程师

工作经历

字节跳动 | 前端工程师 | 2021.03 - 至今
- 负责抖音直播中台架构设计与开发
- 主导前端工程化改造，团队效率提升 40%
- 使用 React + TypeScript 构建核心业务组件库
- 推动 TypeScript 覆盖率从 60% 提升至 95%

阿里巴巴 | 前端工程师 | 2018.06 - 2021.02
- 参与淘宝商品详情页性能优化，首屏加载时间缩短 60%
- 开发营销活动页面搭建平台，提升运营效率 3 倍
- 负责前端技术分享，培养 5 名初中级工程师

技能特长
- 前端框架: React, Vue, Angular
- 构建工具: Webpack, Vite, Rollup
- 语言: TypeScript, JavaScript, Python
- 其他: Node.js, GraphQL, Docker

教育背景
浙江大学 | 计算机科学与技术 | 本科 | 2014.09 - 2018.06`;

export const mockJobJD = `前端开发工程师（高级）

岗位职责：
1. 负责公司核心产品的前端架构设计与开发
2. 主导前端技术选型，制定技术规范
3. 优化前端性能，提升用户体验
4. 指导初中级工程师，提升团队整体技术水平

任职要求：
1. 本科及以上学历，计算机相关专业
2. 5 年以上前端开发经验
3. 精通 React 或 Vue，熟悉前端工程化
4. 具备良好的架构设计能力，有大型项目经验
5. 熟悉 TypeScript，有良好的代码风格
6. 具备良好的沟通协调能力和团队合作精神

加分项：
- 有跨端开发经验（小程序、RN、Flutter）
- 有开源项目贡献经验
- 熟悉前端监控与性能分析`;

export const mockQuestions: InterviewQuestion[] = [
  {
    id: 'q1',
    number: 1,
    question: '请介绍一下你在字节跳动负责的核心项目，以及你在其中的具体角色和贡献。',
    type: 'behavioral',
    difficulty: 'medium',
    expectedPoints: [
      '项目背景和规模',
      '具体职责和技术挑战',
      '量化成果和方法论',
    ],
  },
  {
    id: 'q2',
    number: 2,
    question: '你如何理解前端工程化？在你的实践中是如何推进工程化落地的？',
    type: 'technical',
    difficulty: 'hard',
    expectedPoints: [
      '工程化的定义和价值',
      '具体实践案例',
      '团队协作和推广经验',
    ],
  },
  {
    id: 'q3',
    number: 3,
    question: '在性能优化方面，你有哪些经验和方法论？能举例说明吗？',
    type: 'technical',
    difficulty: 'hard',
    expectedPoints: [
      '性能指标理解（FCP、LCP、CLS）',
      '优化手段和工具',
      '案例和数据',
    ],
  },
  {
    id: 'q4',
    number: 4,
    question: '当产品需求和技术方案产生冲突时，你通常如何处理？',
    type: 'situational',
    difficulty: 'medium',
    expectedPoints: [
      '沟通技巧',
      '平衡商业和技术',
      '共赢方案',
    ],
  },
  {
    id: 'q5',
    number: 5,
    question: '你是如何帮助团队中的初中级工程师成长的？有哪些具体方法？',
    type: 'behavioral',
    difficulty: 'easy',
    expectedPoints: [
      '辅导方法',
      '成长路径设计',
      '成果和反馈',
    ],
  },
];

export const mockResult: InterviewResult = {
  id: 'result-1',
  sessionId: 'session-1',
  overallScore: 82,
  scores: {
    professional: 85,
    communication: 80,
    problemSolving: 81,
  },
  matchRate: 88,
  diagnoses: [
    {
      id: 'd1',
      type: 'strength',
      title: '技术深度优秀',
      description: '在性能优化和工程化方面有扎实的理论基础和实践经验',
      examples: ['性能优化方法论完整', '工程化改造有量化成果'],
    },
    {
      id: 'd2',
      type: 'weakness',
      title: '表达结构待优化',
      description: '回答问题时缺乏清晰的 STAR 框架，容易遗漏关键信息',
      examples: ['项目介绍时背景交代不够', '成果量化不够突出'],
    },
    {
      id: 'd3',
      type: 'opportunity',
      title: '软技能展现空间大',
      description: '在团队管理和跨部门协作方面有丰富经验，可以更充分展示',
      examples: ['可多举例领导力', '冲突解决案例可更具体'],
    },
  ],
  suggestions: [
    {
      id: 's1',
      category: 'answer',
      title: '使用 STAR 法则组织回答',
      description: 'Situation-Task-Action-Result 结构能让回答更有逻辑性和说服力',
      priority: 'high',
    },
    {
      id: 's2',
      category: 'delivery',
      title: '控制语速和节奏',
      description: '技术问题可以适当放慢语速，给面试官思考时间',
      priority: 'medium',
    },
    {
      id: 's3',
      category: 'content',
      title: '增加量化数据',
      description: '在描述成果时，多使用百分比和具体数字',
      priority: 'high',
    },
    {
      id: 's4',
      category: 'structure',
      title: '准备项目模板',
      description: '为每个核心项目准备 2-3 分钟的标准化介绍',
      priority: 'medium',
    },
  ],
  practiceAreas: [
    'STAR 法则练习',
    '自我介绍精炼',
    '项目经历量化表达',
    '团队协作案例准备',
  ],
  completedAt: new Date(),
};

export const mockHistory: HistoryRecord[] = [
  {
    id: 'h1',
    sessionId: 'session-1',
    position: { id: 'p1', title: '高级前端工程师', company: '字节跳动' },
    overallScore: 82,
    matchRate: 88,
    questionsCount: 5,
    completedAt: new Date('2026-06-24T10:30:00'),
    version: 1,
  },
  {
    id: 'h2',
    sessionId: 'session-2',
    position: { id: 'p2', title: '前端架构师', company: '阿里巴巴' },
    overallScore: 75,
    matchRate: 72,
    questionsCount: 5,
    completedAt: new Date('2026-06-23T15:20:00'),
    version: 2,
  },
  {
    id: 'h3',
    sessionId: 'session-3',
    position: { id: 'p3', title: '前端技术专家', company: '腾讯' },
    overallScore: 68,
    matchRate: 65,
    questionsCount: 5,
    completedAt: new Date('2026-06-22T09:45:00'),
    version: 1,
  },
];
