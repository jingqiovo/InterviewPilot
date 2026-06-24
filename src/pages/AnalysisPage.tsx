import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, AlertTriangle, RefreshCw, Activity, ChevronRight } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { createMockAnalysisResult } from '../data/mockData';
import { AgentSteps } from '../components/features/AgentSteps';
import { StreamOutput } from '../components/features/StreamOutput';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const STEPS_NO_JD = [
  '正在读取简历内容',
  '正在识别目标岗位',
  '正在分析岗位要求',
  '正在对比简历与岗位要求',
  '正在诊断简历问题',
  '正在生成优化建议',
  '正在生成优化后的简历版本',
];

const STEPS_WITH_JD = [
  '正在读取简历内容',
  '正在识别目标岗位',
  '正在解析岗位 JD',
  '正在提取岗位核心要求',
  '正在对比简历与岗位要求',
  '发现 4 个能力差距',
  '正在生成优化建议',
  '正在生成最终优化版本',
];

const STREAM_NO_JD = [
  { text: '已读取简历内容，正在识别核心经历', type: 'info' as const },
  { text: '检测到目标岗位：前端开发工程师', type: 'success' as const },
  { text: '正在对比岗位要求与简历中的技能描述', type: 'thinking' as const },
  { text: '已识别工作经历：字节跳动、腾讯', type: 'info' as const },
  { text: '发现 4 个待优化问题', type: 'info' as const },
  { text: '正在优化技术栈表达', type: 'thinking' as const },
  { text: '正在生成最终优化建议', type: 'info' as const },
];

const STREAM_WITH_JD = [
  { text: '已读取简历内容，正在识别核心经历', type: 'info' as const },
  { text: '检测到目标岗位：前端开发工程师', type: 'success' as const },
  { text: '正在解析岗位 JD...', type: 'thinking' as const },
  { text: '已识别岗位 JD 中的核心要求：React、TypeScript、组件化、接口联调', type: 'success' as const },
  { text: '正在检查简历中是否体现对应经验', type: 'thinking' as const },
  { text: '已识别工作经历：字节跳动、腾讯', type: 'info' as const },
  { text: '发现项目经历中缺少接口联调描述', type: 'info' as const },
  { text: '发现技术栈表达与岗位关键词匹配不足', type: 'info' as const },
  { text: '正在生成针对岗位要求的优化建议', type: 'thinking' as const },
  { text: '正在生成最终优化版本', type: 'info' as const },
];

export function AnalysisPage() {
  const { resume, job, jd, setPage, setAnalysisResult } = useAppStore();
  const hasJD = !!(jd && jd.rawText && jd.rawText.trim().length > 0);
  const STEPS = hasJD ? STEPS_WITH_JD : STEPS_NO_JD;
  const STREAM = hasJD ? STREAM_WITH_JD : STREAM_NO_JD;
  const STEP_COUNT = STEPS.length;

  const [agentSteps, setAgentSteps] = useState<
    { id: string; label: string; status: 'pending' | 'active' | 'done' | 'error'; timestamp?: string }[]
  >([]);
  const [messages, setMessages] = useState<
    { id: string; text: string; timestamp: string; type: 'info' | 'thinking' | 'success' | 'error' }[]
  >([]);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showError, setShowError] = useState(false);
  const [hasAutoSubmitted, setHasAutoSubmitted] = useState(false);
  const [runId, setRunId] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const msgIdx = useRef(0);

  const clearAll = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const fmt = (sec: number) =>
    `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;

  const addMsg = (type: typeof STREAM[0]['type'], delay: number) => {
    const t = setTimeout(() => {
      const entry = STREAM[msgIdx.current];
      if (!entry) return;
      setMessages((m) => [...m, { id: `m${msgIdx.current}`, ...entry, timestamp: fmt(delay / 1000) }]);
      msgIdx.current++;
    }, delay);
    timers.current.push(t);
  };

  useEffect(() => {
    if (!resume || !job) return;

    clearAll();
    setAgentSteps([]);
    setMessages([]);
    setProgress(0);
    setIsDone(false);
    setIsCompleting(false);
    setIsError(false);
    setShowError(false);
    setHasAutoSubmitted(false);
    msgIdx.current = 0;

    const tick = (step: number, delay: number, donePercent: number) => {
      timers.current.push(setTimeout(() => {
        setAgentSteps((s) => s.map((x, i) => (i === step ? { ...x, status: 'active' } : x)));
        setProgress(Math.max(0, donePercent - 10));
      }, delay));

      timers.current.push(setTimeout(() => {
        setAgentSteps((s) => s.map((x, i) => {
          if (i === step) return { ...x, status: 'done', timestamp: new Date().toLocaleTimeString() };
          if (i === step + 1) return { ...x, status: 'active' };
          return x;
        }));
        setProgress(donePercent);
      }, delay + 700));
    };

    setAgentSteps(STEPS.map((label, i) => ({ id: `s${i}`, label, status: 'pending' })));

    // 动态步数适配：有 JD 8 步，无 JD 7 步
    const stepDelay = 1100;
    const totalSteps = STEP_COUNT;
    // 流式消息按 STREAM 顺序插入到对应步骤之间
    const streamInterval = totalSteps > 0 ? Math.floor((stepDelay * totalSteps) / (STREAM.length + 1)) : stepDelay;

    for (let i = 0; i < totalSteps; i++) {
      const donePercent = Math.floor(((i + 1) / totalSteps) * 95);
      tick(i, stepDelay * i, donePercent);

      // 每个步骤后追加一条流式消息
      if (i < STREAM.length) {
        addMsg(STREAM[i].type, stepDelay * i + 400);
      }
    }

    timers.current.push(setTimeout(() => {
      setAgentSteps((s) => s.map((x, i) => (i === s.length - 1 ? { ...x, status: 'done', timestamp: new Date().toLocaleTimeString() } : x)));
      setProgress(100);
      setIsDone(true);
    }, stepDelay * totalSteps + 500));

    return clearAll;
  }, [runId, resume, job, jd, STEP_COUNT, STEPS, STREAM]);

  // Auto-submit when done — show completing state first, then jump to result
  useEffect(() => {
    if (isDone && !hasAutoSubmitted && resume && job) {
      setIsCompleting(true);
      const t = setTimeout(() => {
        const result = createMockAnalysisResult(
          {
            rawText: resume.rawText,
            fileName: resume.fileName,
            fileSize: resume.fileSize,
            uploadTime: resume.uploadTime,
          },
          {
            title: job.title,
            confidence: job.confidence,
            isAutoDetected: job.isAutoDetected,
          },
          jd && jd.rawText
            ? { rawText: jd.rawText, fileName: jd.fileName, uploadTime: jd.uploadTime }
            : undefined
        );
        setHasAutoSubmitted(true);
        setAnalysisResult(result);
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [isDone, hasAutoSubmitted, resume, job, jd, setAnalysisResult]);

  const handleViewResult = () => {
    if (!resume || !job) return;
    const result = createMockAnalysisResult(
      {
        rawText: resume.rawText,
        fileName: resume.fileName,
        fileSize: resume.fileSize,
        uploadTime: resume.uploadTime,
      },
      {
        title: job.title,
        confidence: job.confidence,
        isAutoDetected: job.isAutoDetected,
      },
      jd && jd.rawText
        ? { rawText: jd.rawText, fileName: jd.fileName, uploadTime: jd.uploadTime }
        : undefined
    );
    setHasAutoSubmitted(true);
    setAnalysisResult(result);
  };

  const handleRetry = () => {
    clearAll();
    setRunId((n) => n + 1);
  };

  const handleBack = () => {
    clearAll();
    setPage('home');
  };

  if (!resume || !job) {
    return (
      <div className="min-h-screen bg-bg pt-24 flex items-center justify-center">
        <p className="text-sm text-secondary">请先上传简历</p>
        <Button variant="secondary" size="sm" onClick={() => setPage('home')} className="ml-4">
          返回
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleBack}
            className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-gray-100 transition-all duration-150 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-primary">简历分析中</h1>
            <p className="text-sm text-secondary mt-0.5">
              {job.title} · {resume.fileName || '文本简历'}
              {hasJD && (
                <span className="ml-2 text-[10px] font-medium text-accent bg-accent-light px-1.5 py-0.5 rounded">
                  基于岗位 JD 分析
                </span>
              )}
            </p>
          </div>
          <div className="w-36">
            <ProgressBar value={progress} showLabel />
          </div>
        </div>

        {/* Main */}
        <div className="grid grid-cols-5 gap-6">
          {/* Left */}
          <Card className="col-span-2" padding="md">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-semibold text-primary">分析步骤</h2>
            </div>
            <AgentSteps
              steps={agentSteps}
              currentStep={agentSteps.findIndex((s) => s.status === 'active')}
            />
          </Card>

          {/* Right */}
          <Card className="col-span-3" padding="md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-primary">分析日志</h2>
              {isDone && (
                <span className="text-xs text-success flex items-center gap-1">
                  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  完成
                </span>
              )}
            </div>
            <div className="h-80 overflow-y-auto">
              <StreamOutput messages={messages} isComplete={isDone} />
            </div>
          </Card>
        </div>

        {/* Error State */}
        {isError && showError && (
          <Card className="mt-6 border-error/30 bg-error-light/30 animate-fade-in">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-error" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-primary mb-2">分析未能完成</h3>
                <div className="space-y-2.5">
                  <div>
                    <p className="text-xs font-medium text-tertiary mb-1">发生了什么</p>
                    <p className="text-sm text-secondary leading-relaxed">
                      简历内容暂时无法被识别。
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-tertiary mb-1">为什么会这样</p>
                    <p className="text-sm text-secondary leading-relaxed">
                      文件可能是扫描件格式、加密文档，或文字编码异常。你可以重新上传文件，或直接粘贴简历文本继续分析。
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5 ml-14">
              <Button variant="primary" size="sm" onClick={handleRetry}>
                <RefreshCw className="w-3.5 h-3.5" />
                重新分析
              </Button>
              <Button variant="secondary" size="sm" onClick={handleBack}>
                返回修改
              </Button>
            </div>
          </Card>
        )}

        {/* Bottom Actions */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!isDone && !isError && (
              <details className="group">
                <summary className="text-xs text-tertiary hover:text-secondary cursor-pointer list-none flex items-center gap-1 select-none transition-colors">
                  <svg className="w-3 h-3 transition-transform group-open:rotate-90" viewBox="0 0 12 12" fill="none">
                    <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  排查问题
                </summary>
                <div className="mt-2 px-3 py-2 bg-gray-50 border border-border rounded-lg">
                  <p className="text-xs text-tertiary mb-2">如果长时间没有结果，可以测试失败状态的处理体验。</p>
                  <button
                    onClick={() => {
                      clearAll();
                      setIsError(true);
                      setShowError(true);
                      setAgentSteps((s) => s.map((x, i) => (i === s.length - 1 ? { ...x, status: 'error' } : x)));
                    }}
                    className="text-xs font-medium text-secondary hover:text-error transition-colors"
                  >
                    查看失败状态 →
                  </button>
                </div>
              </details>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isCompleting && !hasAutoSubmitted ? (
              <span className="text-sm text-secondary animate-fade-in">
                分析完成，正在整理结果...
              </span>
            ) : isDone ? (
              <Button variant="primary" onClick={handleViewResult}>
                查看结果
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : !isError ? (
              <Button variant="secondary" onClick={handleRetry}>
                <RefreshCw className="w-3.5 h-3.5" />
                重新分析
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}