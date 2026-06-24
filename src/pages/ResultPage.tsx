import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, History, RotateCcw, Sparkles, FileText } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { ScoreCard } from '../components/features/ScoreCard';
import { MatchCard } from '../components/features/MatchCard';
import { GapAnalysisCard } from '../components/features/GapAnalysisCard';
import { ProblemCard } from '../components/features/ProblemCard';
import { RecommendationCard } from '../components/features/RecommendationCard';
import { ResumeEditor } from '../components/features/ResumeEditor';
import { VersionCard } from '../components/features/VersionCard';
import { Button } from '../components/ui/Button';
import { Toast, ExportMenu } from '../components/ui/Toast';
import { Card } from '../components/ui/Card';
import type { ResumeSection } from '../types';

export function ResultPage() {
  const { analysisResult, setPage, regenerateVersion, restoreVersion } = useAppStore();
  const [recommendations, setRecommendations] = useState(
    analysisResult?.recommendations || []
  );
  const [editedSections, setEditedSections] = useState<ResumeSection[] | null>(null);
  const [showAgentRecord, setShowAgentRecord] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  if (!analysisResult) {
    return (
      <div className="min-h-screen bg-bg pt-24 flex flex-col items-center justify-center gap-3">
        <p className="text-sm text-secondary">暂无分析结果</p>
        <Button variant="secondary" size="sm" onClick={() => setPage('home')}>
          上传简历
        </Button>
      </div>
    );
  }

  const result = analysisResult;
  const currentSections =
    editedSections ||
    result.versions.find((v) => v.version === result.currentVersion)?.sections ||
    [];

  const toast = (msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
  };

  const handleRecToggle = (id: string) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const handleRegenerate = () => {
    setRegenerating(true);
    setTimeout(() => {
      regenerateVersion();
      setEditedSections(null);
      setRegenerating(false);
      toast('已生成新版本');
    }, 1800);
  };

  const handleExport = (format: 'pdf' | 'word') => {
    toast(`${format.toUpperCase()} 导出中...`);
    setTimeout(() => toast(`${format.toUpperCase()} 已导出`), 1200);
  };

  const doneCount = recommendations.filter((r) => r.completed).length;

  return (
    <div className="min-h-screen bg-bg pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPage('home')}
              className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-gray-100 transition-all duration-150 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-primary">分析结果</h1>
                {result.hasJD && (
                  <span className="text-[10px] font-medium text-accent bg-accent-light px-1.5 py-0.5 rounded flex items-center gap-1">
                    <FileText className="w-2.5 h-2.5" />
                    基于 JD 分析
                  </span>
                )}
              </div>
              <p className="text-sm text-secondary mt-0.5">
                {result.job.title} · 当前 {result.currentVersion} · 完成于{' '}
                {new Date(result.createdAt).toLocaleDateString('zh-CN')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRegenerate}
              loading={regenerating}
              className="gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {regenerating ? '生成中' : '换一个版本'}
            </Button>
            <ExportMenu onExport={handleExport} />
          </div>
        </div>

        {/* JD 状态提示条 */}
        <div
          className={`mb-5 px-4 py-2.5 rounded-lg text-xs flex items-center gap-2 animate-fade-in ${
            result.hasJD
              ? 'bg-accent/5 text-accent border border-accent/20'
              : 'bg-gray-50 text-secondary border border-border'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
          <span>
            {result.hasJD
              ? '本次分析已结合目标岗位 JD。'
              : '本次分析基于目标岗位名称完成。粘贴岗位 JD 后可获得更精准分析。'}
          </span>
        </div>

        {/* Content */}
        <div className="space-y-5">
          <ScoreCard score={result.score} />
          <MatchCard match={result.match} hasJD={result.hasJD} />
          <GapAnalysisCard gap={result.gap} />
          <ProblemCard problems={result.problems} />
          <RecommendationCard
            recommendations={recommendations}
            onToggle={handleRecToggle}
          />
          <ResumeEditor
            sections={currentSections}
            onChange={(sections) => setEditedSections(sections)}
          />
          <VersionCard
            versions={result.versions}
            currentVersion={result.currentVersion}
            onSwitch={(v) => {
              restoreVersion(v);
              setEditedSections(null);
              toast(`已切换至 ${v}`);
            }}
          />

          {/* AI 分析记录 - 默认折叠 */}
          <Card>
            <button
              onClick={() => setShowAgentRecord(!showAgentRecord)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <h3 className="text-base font-semibold text-primary">分析记录</h3>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-tertiary transition-transform duration-200 ${
                  showAgentRecord ? 'rotate-180' : ''
                }`}
              />
            </button>

            {showAgentRecord && (
              <div className="mt-4 space-y-2 animate-slide-down">
                {result.agentSteps.map((step) => (
                  <div
                    key={step.id}
                    className="flex items-center gap-3 py-2 px-3 rounded-lg bg-gray-50"
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.status === 'done'
                          ? 'bg-success'
                          : step.status === 'active'
                          ? 'bg-accent'
                          : step.status === 'error'
                          ? 'bg-error'
                          : 'bg-gray-200'
                      }`}
                    >
                      {step.status === 'done' ? (
                        <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      )}
                    </div>
                    <span
                      className={`text-sm flex-1 ${
                        step.status === 'done'
                          ? 'text-secondary'
                          : step.status === 'active'
                          ? 'text-accent font-medium'
                          : 'text-tertiary'
                      }`}
                    >
                      {step.label}
                    </span>
                    {step.timestamp && (
                      <span className="text-xs text-tertiary">{step.timestamp}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <p className="text-sm text-secondary">
              {doneCount}/{recommendations.length} 项建议已处理
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage('history')}
              >
                <History className="w-3.5 h-3.5" />
                历史记录
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => toast('已保存')}
              >
                保存
              </Button>
            </div>
          </div>
        </div>
      </div>

      {toastVisible && (
        <Toast message={toastMsg} onClose={() => setToastVisible(false)} />
      )}
    </div>
  );
}
