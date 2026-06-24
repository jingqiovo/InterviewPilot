import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { NavBar } from '@/components/features/NavBar';
import { AgentSteps } from '@/components/features/AgentSteps';
import { ErrorState } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { mockQuestions } from '@/data/mockData';
import { ArrowRight, Sparkles } from 'lucide-react';

const ANALYSIS_STEPS = [
  {
    id: 'step-1',
    name: '读取简历',
    logs: ['解析简历结构...', '提取关键信息完成']
  },
  {
    id: 'step-2',
    name: '分析目标岗位',
    logs: ['识别岗位要求...', '匹配度分析中...']
  },
  {
    id: 'step-3',
    name: '提取关键技能',
    logs: ['识别核心技能...', '分析项目经验...']
  },
  {
    id: 'step-4',
    name: '生成面试题',
    logs: ['生成 5 道面试题...', '问题类型分配中...']
  },
  {
    id: 'step-5',
    name: '构建评分标准',
    logs: ['建立评分维度...', '评分标准就绪']
  },
  {
    id: 'step-6',
    name: '准备就绪',
    logs: ['准备完成']
  },
];

export function AnalysisPage() {
  const {
    agentSteps,
    updateAgentStep,
    addStreamLog,
    setCurrentPage,
    setQuestions,
    error,
    hideError,
  } = useAppStore();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (currentStepIndex >= ANALYSIS_STEPS.length) {
      setIsComplete(true);
      return;
    }

    const step = ANALYSIS_STEPS[currentStepIndex];
    updateAgentStep(step.id, { status: 'running' });

    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < step.logs.length) {
        addStreamLog(step.logs[logIndex]);
        setLogs(prev => [...prev, step.logs[logIndex]]);
        logIndex++;
      } else {
        clearInterval(logInterval);
        updateAgentStep(step.id, { status: 'completed', log: step.logs[step.logs.length - 1] });
        setCurrentStepIndex(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(logInterval);
  }, [currentStepIndex, updateAgentStep, addStreamLog]);

  const handleComplete = () => {
    setQuestions(mockQuestions);
    setCurrentPage('interview');
  };

  if (error.isOpen) {
    return (
      <div className="min-h-screen bg-white">
        <NavBar showBack={true} onBack={() => setCurrentPage('home')} />
        <main className="max-w-3xl mx-auto px-6 py-12">
          <ErrorState
            type={error.type}
            title={error.title}
            message={error.message}
            onRetry={() => {
              hideError();
              setCurrentStepIndex(0);
              setLogs([]);
            }}
          />
        </main>
      </div>
    );
  }

  const progressPercent = Math.round((currentStepIndex / ANALYSIS_STEPS.length) * 100);

  return (
    <div className="min-h-screen bg-white">
      <NavBar showBack={true} onBack={() => setCurrentPage('home')} title="AI 分析中" />

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8 fade-in">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full pulse-dot text-amber-500" />
            <span className="text-xs uppercase tracking-wider text-amber-600 font-medium">
              Agent 工作中
            </span>
          </div>
          <h1 className="text-h2 text-primary mb-2">正在分析你的简历</h1>
          <p className="text-small text-text-secondary">
            AI 正在认真分析你的背景和目标岗位，生成针对性的面试问题
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 fade-in" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-tiny text-text-secondary">整体进度</span>
            <span className="text-tiny text-text-tertiary tabular-nums">{progressPercent}%</span>
          </div>
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-black rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <Card padding="lg" className="mb-6 slide-up" style={{ animationDelay: '200ms' }}>
          <AgentSteps steps={agentSteps} />
        </Card>

        {/* Logs */}
        <Card padding="md" className="slide-up" style={{ animationDelay: '300ms' }}>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-primary">实时日志</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full pulse-dot text-green-500" />
              <span className="text-tiny text-text-tertiary">streaming</span>
            </div>
          </div>
          <div className="bg-muted rounded-lg p-4 font-mono text-sm min-h-[160px]">
            {logs.length > 0 ? (
              <div className="space-y-1">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className="text-text-secondary slide-in-bottom"
                    style={{ animationDelay: '0ms', animationDuration: '300ms' }}
                  >
                    <span className="text-primary mr-2">›</span>
                    {log}
                  </div>
                ))}
                {!isComplete && (
                  <div className="text-text-tertiary flex items-center">
                    <span className="text-primary mr-2">›</span>
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                )}
              </div>
            ) : (
              <span className="text-text-tertiary pulse-soft">等待开始分析...</span>
            )}
          </div>
        </Card>

        {/* Complete Button */}
        {isComplete && (
          <div className="mt-6 slide-up">
            <div className="mb-3 flex items-center justify-center gap-2 text-success">
              <Sparkles size={16} className="heartbeat" />
              <span className="text-sm font-medium">专属面试题已就绪</span>
            </div>
            <Button
              size="lg"
              className="w-full group hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
              onClick={handleComplete}
            >
              进入面试
              <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}