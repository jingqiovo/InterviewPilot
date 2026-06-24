import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, Trash2, RotateCcw, FileText, Clock, Target } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/ErrorState';
import type { HistoryRecord } from '../types';

export function HistoryPage() {
  const { history, deleteHistoryRecord, restoreHistoryRecord, setPage } = useAppStore();
  const [deleteTarget, setDeleteTarget] = useState<HistoryRecord | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<HistoryRecord | null>(null);

  const fmtDate = (iso: string) => {
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return '今天';
    if (days === 1) return '昨天';
    if (days < 7) return `${days} 天前`;
    return d.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
  };

  const scoreStyle = (score: number) => {
    if (score >= 80) return 'text-success bg-emerald-50 border border-success/20';
    if (score >= 60) return 'text-warning bg-amber-50 border border-warning/20';
    return 'text-error bg-red-50 border border-error/20';
  };

  const handleRestore = (record: HistoryRecord) => {
    setRestoreTarget(record);
  };

  const confirmRestore = () => {
    if (restoreTarget) {
      restoreHistoryRecord(restoreTarget.id);
      setRestoreTarget(null);
    }
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteHistoryRecord(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="min-h-screen bg-bg pt-20 pb-16">
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setPage('result')}
            className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-gray-100 transition-all duration-150 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-primary">历史记录</h1>
            <p className="text-sm text-secondary mt-0.5">
              {history.length === 0 ? '暂无记录' : `${history.length} 条记录`}
            </p>
          </div>
        </div>

        {/* List */}
        {history.length === 0 ? (
          <EmptyState
            icon="clock"
            title="还没有分析记录"
            description="上传简历并完成分析后，会自动保存到这里"
            action={
              <Button variant="secondary" size="sm" onClick={() => setPage('home')}>
                上传简历
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {history.map((record, i) => (
              <div key={record.id} className="group">
                <Card
                  className="hover:border-border-hover transition-all duration-150 cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${i * 50}ms` }}
                  onClick={() => handleRestore(record)}
                >
                  <div className="flex items-start gap-4">
                    {/* Score */}
                    <div
                      className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${scoreStyle(
                        record.score
                      )}`}
                    >
                      <span className="text-lg font-bold leading-none">{record.score}</span>
                      <span className="text-[9px] opacity-70 mt-0.5">分</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <h3 className="text-base font-semibold text-primary">
                          {record.jobTitle}
                        </h3>
                        {i === 0 && (
                          <span className="text-[10px] font-medium text-accent bg-accent-light px-1.5 py-0.5 rounded">
                            最新
                          </span>
                        )}
                        {record.hasJD && (
                          <span className="text-[10px] font-medium text-accent bg-accent-light px-1.5 py-0.5 rounded flex items-center gap-1">
                            <FileText className="w-2.5 h-2.5" />
                            基于 JD 分析
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-secondary truncate mb-1.5">
                        {record.resumeSnippet}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-tertiary flex-wrap">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {fmtDate(record.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {record.versionCount} 个版本
                        </span>
                        {record.matchPercent !== undefined && (
                          <span className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            匹配度 {record.matchPercent}%
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRestore(record);
                        }}
                        className="p-2 rounded-lg text-secondary hover:text-accent hover:bg-accent-light transition-all duration-150 active:scale-95"
                        title="查看详情"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget(record);
                        }}
                        className="p-2 rounded-lg text-secondary hover:text-error hover:bg-error-light transition-all duration-150 active:scale-95"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <ChevronRight className="w-4 h-4 text-tertiary self-center group-hover:text-secondary transition-colors" />
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Restore Confirm */}
      <ConfirmDialog
        open={!!restoreTarget}
        title="恢复历史版本"
        message={`将切换到 "${restoreTarget?.jobTitle}" 的分析结果，当前未保存的修改将被覆盖。`}
        confirmLabel="恢复"
        onConfirm={confirmRestore}
        onCancel={() => setRestoreTarget(null)}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="删除记录"
        message={`确定删除 "${deleteTarget?.jobTitle}" 的分析记录？删除后无法恢复。`}
        confirmLabel="删除"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        variant="danger"
      />
    </div>
  );
}
