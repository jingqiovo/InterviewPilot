import { Card } from '@/components/ui/Card';
import { HistoryRecord } from '@/types';
import { useAppStore } from '@/store/appStore';

interface HistoryListProps {
  records: HistoryRecord[];
}

export function HistoryList({ records }: HistoryListProps) {
  const { rollbackToVersion, showConfirm } = useAppStore();

  if (records.length === 0) {
    return (
      <Card padding="lg" className="text-center">
        <p className="text-text-secondary">暂无面试记录</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {records.map((record) => (
        <Card key={record.id} padding="md">
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
                <span>v{record.version}</span>
              </div>
              
              {/* Score */}
              <div className="flex items-center gap-4">
                <div className={`text-xl font-semibold ${record.overallScore >= 80 ? 'text-green-600' : record.overallScore >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                  {record.overallScore} 分
                </div>
                <div className="text-small text-text-tertiary">
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
                className="text-tiny text-text-secondary hover:text-primary transition-colors"
              >
                回退
              </button>
              <svg className="w-4 h-4 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
