import { useAppStore } from '@/store/appStore';
import { NavBar } from '@/components/features/NavBar';
import { Card } from '@/components/ui/Card';
import { History as HistoryIcon, ArrowRight } from 'lucide-react';

export function HistoryPage() {
  const { history, setCurrentPage, rollbackToVersion, showConfirm } = useAppStore();

  const avgScore = history.length > 0
    ? Math.round(history.reduce((sum, h) => sum + h.overallScore, 0) / history.length)
    : 0;

  const totalSessions = history.length;
  const bestScore = history.length > 0
    ? Math.max(...history.map(h => h.overallScore))
    : 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-white">
      <NavBar
        showBack={true}
        showHistory={false}
        onBack={() => setCurrentPage('home')}
        title="历史记录"
      />

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10 fade-in">
          <div className="inline-flex items-center gap-2 mb-3">
            <HistoryIcon size={14} className="text-gray-500" />
            <span className="text-xs uppercase tracking-wider text-gray-500 font-medium">
              练习轨迹
            </span>
          </div>
          <h1 className="text-h1 text-primary mb-2">历史记录</h1>
          <p className="text-body text-text-secondary">
            你的每一次练习，都是进步的一步
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10 stagger">
          <Card padding="md" className="text-center card-hover">
            <p className="text-tiny text-text-tertiary mb-2 uppercase tracking-wider">平均分</p>
            <p className="text-3xl font-semibold text-primary tabular-nums">{avgScore}</p>
          </Card>
          <Card padding="md" className="text-center card-hover">
            <p className="text-tiny text-text-tertiary mb-2 uppercase tracking-wider">面试次数</p>
            <p className="text-3xl font-semibold text-primary tabular-nums">{totalSessions}</p>
          </Card>
          <Card padding="md" className="text-center card-hover">
            <p className="text-tiny text-text-tertiary mb-2 uppercase tracking-wider">最高分</p>
            <p className="text-3xl font-semibold text-primary tabular-nums">{bestScore}</p>
          </Card>
        </div>

        {/* History List */}
        <div>
          <h2 className="text-h3 text-primary mb-4 fade-in">面试记录</h2>

          {history.length === 0 ? (
            <Card padding="lg" className="text-center fade-in">
              <div className="py-8">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3 float">
                  <HistoryIcon size={20} className="text-gray-400" />
                </div>
                <p className="text-text-secondary mb-1">还没有练习记录</p>
                <p className="text-tiny text-text-tertiary mb-4">开始你的第一次面试训练</p>
                <button
                  onClick={() => setCurrentPage('home')}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-black underline-expand"
                >
                  去训练
                  <ArrowRight size={14} />
                </button>
              </div>
            </Card>
          ) : (
            <div className="space-y-3 stagger">
              {history.map((record) => (
                <Card key={record.id} padding="md" className="group card-hover">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Position */}
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-medium text-primary">{record.position.title}</h3>
                        {record.position.company && (
                          <span className="text-small text-text-tertiary">@{record.position.company}</span>
                        )}
                      </div>

                      {/* Meta */}
                      <div className="flex items-center gap-3 text-tiny text-text-tertiary mb-3">
                        <span>{new Date(record.completedAt).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        <span>{record.questionsCount} 题</span>
                        <span className="px-1.5 py-0.5 bg-gray-50 rounded text-[10px]">v{record.version}</span>
                      </div>

                      {/* Score */}
                      <div className="flex items-center gap-4">
                        <div className={`text-xl font-semibold tabular-nums ${getScoreColor(record.overallScore)}`}>
                          {record.overallScore} 分
                        </div>
                        <div className="text-small text-text-tertiary tabular-nums">
                          匹配度 {record.matchRate}%
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          showConfirm(
                            '版本回退',
                            `确定要回退到 v${record.version} 版本吗？`,
                            () => rollbackToVersion(record.sessionId, record.version)
                          );
                        }}
                        className="text-tiny text-text-secondary hover:text-primary underline-expand transition-colors duration-200"
                      >
                        回退
                      </button>
                      <ArrowRight
                        size={14}
                        className="text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all duration-300"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}