import { useState } from 'react';
import { NavBar } from '@/components/features/NavBar';
import { useAppStore } from '@/store/appStore';
import {
  Mic,
  Code2,
  Users,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Target,
  Clock,
  Award,
  Upload,
  FileText,
  ChevronDown,
  Play,
} from 'lucide-react';

type PracticeType = 'project' | 'technical' | 'behavioral';

interface PracticeEntry {
  id: PracticeType;
  icon: typeof Mic;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  level: string;
}

const practiceEntries: PracticeEntry[] = [
  {
    id: 'project',
    icon: Code2,
    title: '项目追问训练',
    subtitle: 'Project Deep-Dive',
    description: 'AI 模拟面试官深挖你的项目经历，考察技术决策与影响力',
    duration: '约 12 分钟',
    level: '5 道追问',
  },
  {
    id: 'technical',
    icon: Target,
    title: '技术面试训练',
    subtitle: 'Technical Round',
    description: '针对简历中的技术栈提问，覆盖系统设计与工程实践',
    duration: '约 15 分钟',
    level: '6 道技术题',
  },
  {
    id: 'behavioral',
    icon: Users,
    title: 'HR 行为面训练',
    subtitle: 'Behavioral Round',
    description: 'STAR 法则实战练习，训练表达结构与故事讲述能力',
    duration: '约 10 分钟',
    level: '4 道行为题',
  },
];

export function HomePage() {
  const {
    resumeContent,
    setResumeContent,
    positionTitle,
    setPositionTitle,
    jobJDContent,
    setJobJDContent,
    startAnalysis,
    history,
    setCurrentPage,
  } = useAppStore();

  const [selectedPractice, setSelectedPractice] = useState<PracticeType | null>(null);
  const [showJD, setShowJD] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const totalSessions = history.length;
  const avgScore = totalSessions > 0
    ? Math.round(history.reduce((sum, h) => sum + h.overallScore, 0) / totalSessions)
    : 0;

  const handleSelectPractice = (id: PracticeType) => {
    setSelectedPractice(id);
    setTimeout(() => {
      document.getElementById('prep-section')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  };

  const handleStart = () => {
    if (resumeContent && positionTitle) {
      startAnalysis();
    }
  };

  const handleLoadDemo = () => {
    import('@/data/mockData').then(({ mockResume, mockJobJD }) => {
      setResumeContent(mockResume);
      setJobJDContent(mockJobJD);
      setPositionTitle('高级前端工程师');
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setResumeContent(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setResumeContent(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const isValid = resumeContent.trim() && positionTitle.trim();

  // Build growth sparkline from history
  const growthData = [...history].reverse().slice(-8);
  const growthMax = Math.max(...growthData.map(h => h.overallScore), 100);

  return (
    <div className="min-h-screen bg-white">
      <NavBar showBack={false} showHistory={true} />

      <main className="max-w-[1080px] mx-auto px-8 pt-12 pb-24">
        {/* Brand Header */}
        <div className="text-center mb-20 stagger-slow">
          <div className="inline-flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center float">
              <Mic size={16} className="text-white" strokeWidth={2} />
            </div>
            <span className="text-base font-semibold tracking-tight">InterviewPilot</span>
          </div>

          <h1 className="text-[44px] md:text-[52px] leading-[1.05] font-semibold tracking-[-0.02em] mb-6">
            像真实面试一样<span className="text-gray-400">练习，</span><br />
            而不是背答案。
          </h1>

          <p className="text-base text-gray-500 max-w-md mx-auto">
            你的 AI 面试陪练。每一次练习都像真实面试，
            <br className="hidden md:block" />
            每一次反馈都让你更接近 offer。
          </p>
        </div>

        {/* Practice Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 stagger">
          {practiceEntries.map((entry) => {
            const Icon = entry.icon;
            const isSelected = selectedPractice === entry.id;
            return (
              <button
                key={entry.id}
                onClick={() => handleSelectPractice(entry.id)}
                className={`group text-left bg-white rounded-2xl p-6 border card-lift ${
                  isSelected
                    ? 'border-black shadow-[0_8px_30px_rgba(0,0,0,0.08)]'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-12">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center icon-lift transition-all duration-300 ${
                    isSelected ? 'bg-black text-white' : 'bg-gray-50 text-black group-hover:bg-black group-hover:text-white'
                  }`}>
                    <Icon size={18} strokeWidth={1.75} />
                  </div>
                  <ArrowRight
                    size={16}
                    className="text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all duration-300"
                  />
                </div>

                <h3 className="text-lg font-medium mb-1">{entry.title}</h3>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">
                  {entry.subtitle}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed mb-5 min-h-[42px]">
                  {entry.description}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{entry.duration}</span>
                  </div>
                  <div className="w-px h-3 bg-gray-200" />
                  <span>{entry.level}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Prep Section - Always visible */}
        <section
          id="prep-section"
          className="mb-20"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-1 bg-gray-400 rounded-full pulse-soft" />
            <span className="text-xs uppercase tracking-wider text-gray-500 font-medium">
              训练准备
            </span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight mb-2">
            上传简历，让 AI 更懂你
          </h2>
          <p className="text-sm text-gray-500 mb-8">
            AI 会基于你的简历定制专属问题。如果你已经准备过，也可以直接选择训练模式开始。
          </p>

          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Upload - 3 cols */}
              <div className="md:col-span-3">
                <div
                  className={`bg-white border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 ${
                    isDragging
                      ? 'border-black bg-gray-50 scale-[1.02]'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                >
                  {resumeContent ? (
                    <div className="flex items-center gap-3 scale-in">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center heartbeat">
                        <FileText size={18} className="text-gray-700" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-sm font-medium">简历已就绪</p>
                        <p className="text-xs text-gray-500">{resumeContent.length} 字符</p>
                      </div>
                      <button
                        onClick={() => setResumeContent('')}
                        className="text-xs text-gray-500 hover:text-black underline-expand transition-colors"
                      >
                        移除
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3 icon-lift">
                        <Upload size={18} className="text-gray-600" />
                      </div>
                      <p className="text-sm font-medium mb-1">拖拽或点击上传简历</p>
                      <p className="text-xs text-gray-500 mb-3">支持 TXT / PDF / DOCX</p>
                      <label>
                        <input type="file" className="sr-only" onChange={handleFileChange} accept=".txt,.pdf,.docx" />
                        <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-black text-white rounded-lg cursor-pointer hover:bg-gray-800 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                          选择文件
                        </span>
                      </label>
                    </>
                  )}
                </div>

                {!resumeContent && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">没有文件？直接粘贴简历内容。</p>
                    <textarea
                      placeholder="粘贴简历内容..."
                      className="w-full min-h-[80px] text-sm bg-white border border-gray-200 rounded-xl p-3 resize-none focus:outline-none focus:border-gray-400 focus:shadow-[0_0_0_3px_rgba(17,24,39,0.06)] transition-all duration-200"
                      value={resumeContent}
                      onChange={(e) => setResumeContent(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Position - 2 cols */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">目标岗位</label>
                  <input
                    type="text"
                    placeholder="例如：AI产品设计师"
                    value={positionTitle}
                    onChange={(e) => setPositionTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 focus:shadow-[0_0_0_3px_rgba(17,24,39,0.06)] transition-all duration-200"
                  />
                </div>

                <button
                  onClick={() => setShowJD(!showJD)}
                  className="flex items-center justify-between w-full text-xs font-medium text-gray-700 hover:text-black transition-colors duration-200"
                >
                  <span>岗位描述 <span className="font-normal text-gray-400">(可选)</span></span>
                  <span className={`transform transition-transform duration-300 ${showJD ? 'rotate-180' : 'rotate-0'}`}>
                    <ChevronDown size={14} />
                  </span>
                </button>

                {showJD && (
                  <div className="slide-down">
                    <textarea
                      placeholder="粘贴目标岗位的职位描述..."
                      className="w-full min-h-[70px] text-sm bg-white border border-gray-200 rounded-xl p-3 resize-none focus:outline-none focus:border-gray-400 focus:shadow-[0_0_0_3px_rgba(17,24,39,0.06)] transition-all duration-200"
                      value={jobJDContent}
                      onChange={(e) => setJobJDContent(e.target.value)}
                    />
                  </div>
                )}

                <button
                  onClick={handleStart}
                  disabled={!isValid}
                  className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isValid
                      ? 'bg-black text-white hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-lg'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Play size={14} fill="currentColor" />
                  开始练习
                </button>

                {!resumeContent && (
                  <button
                    onClick={handleLoadDemo}
                    className="w-full text-xs text-gray-500 hover:text-black underline-expand transition-colors duration-200"
                  >
                    使用示例数据快速开始
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Stats & Growth */}
        <section className="border-t border-gray-100 pt-16 fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-1 bg-gray-400 rounded-full pulse-soft" />
            <span className="text-xs uppercase tracking-wider text-gray-500 font-medium">
              你的成长
            </span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight mb-10">
            持续练习，看到进步
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-100 rounded-2xl overflow-hidden mb-12 stagger">
            {/* Sessions */}
            <div className="bg-white p-8 hover:bg-gray-50 transition-colors duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                  <Sparkles size={14} />
                </div>
                <span className="text-xs text-gray-400 uppercase tracking-wider">训练次数</span>
              </div>
              <p className="text-4xl font-semibold tracking-tight">{totalSessions}</p>
              <p className="text-xs text-gray-500 mt-2">次完整面试练习</p>
            </div>

            {/* Avg Score */}
            <div className="bg-white p-8 hover:bg-gray-50 transition-colors duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                  <Award size={14} />
                </div>
                <span className="text-xs text-gray-400 uppercase tracking-wider">平均评分</span>
              </div>
              <p className="text-4xl font-semibold tracking-tight">
                {avgScore > 0 ? avgScore : '—'}
                {avgScore > 0 && <span className="text-lg text-gray-400 ml-1">分</span>}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {avgScore >= 80 ? '面试官级别表现' : avgScore > 0 ? '继续打磨细节' : '开始你的第一次练习'}
              </p>
            </div>

            {/* Growth Trend */}
            <div className="bg-white p-8 hover:bg-gray-50 transition-colors duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                  <TrendingUp size={14} />
                </div>
                <span className="text-xs text-gray-400 uppercase tracking-wider">能力趋势</span>
              </div>

              {growthData.length > 0 ? (
                <>
                  <div className="flex items-end gap-1 h-12 mb-3">
                    {growthData.map((h, i) => (
                      <div
                        key={h.id}
                        className="flex-1 bg-black rounded-sm bar-grow"
                        style={{
                          height: `${(h.overallScore / growthMax) * 100}%`,
                          opacity: 0.4 + (i / growthData.length) * 0.6,
                          animationDelay: `${i * 80}ms`,
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">最近 {growthData.length} 次训练</p>
                </>
              ) : (
                <>
                  <p className="text-4xl font-semibold tracking-tight text-gray-300">—</p>
                  <p className="text-xs text-gray-500 mt-2">完成后显示成长曲线</p>
                </>
              )}
            </div>
          </div>

          {/* Recent Sessions */}
          {history.length > 0 && (
            <div className="fade-in" style={{ animationDelay: '400ms' }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-medium">最近的训练</h3>
                <button
                  onClick={() => setCurrentPage('history')}
                  className="text-xs text-gray-500 hover:text-black underline-expand transition-colors duration-200"
                >
                  查看全部
                </button>
              </div>
              <div className="space-y-2 stagger">
                {history.slice(0, 3).map((record) => (
                  <div
                    key={record.id}
                    className="group flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:border-gray-300 card-lift"
                  >
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-gray-100 transition-colors duration-300">
                      <Code2 size={16} className="text-gray-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {record.position.title}
                        <span className="text-gray-400 font-normal ml-2">
                          · {record.position.company}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {record.questionsCount} 道题 · {new Date(record.completedAt).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">{record.overallScore}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider">score</p>
                    </div>
                    <ArrowRight size={14} className="text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}