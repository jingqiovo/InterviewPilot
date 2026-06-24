import React, { useState } from 'react';
import { ChevronDown, RotateCcw, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import type { ResumeVersion } from '../../types';

interface VersionCardProps {
  versions: ResumeVersion[];
  currentVersion: string;
  onSwitch: (version: string) => void;
}

export function VersionCard({ versions, currentVersion, onSwitch }: VersionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [pendingVersion, setPendingVersion] = useState<string | null>(null);

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

  const handleRestoreClick = (v: string) => {
    if (v === currentVersion) return;
    setPendingVersion(v);
  };

  const confirmRestore = () => {
    if (pendingVersion) {
      onSwitch(pendingVersion);
      setPendingVersion(null);
    }
  };

  return (
    <>
      <Card className="animate-fade-in" style={{ animationDelay: '250ms' }}>
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between text-left"
        >
          <div>
            <h3 className="text-base font-semibold text-primary">
              版本历史
            </h3>
            <p className="text-sm text-secondary mt-0.5">
              共 {versions.length} 个版本 · 当前 {currentVersion}
            </p>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-tertiary transition-transform duration-200 ${
              expanded ? 'rotate-180' : ''
            }`}
          />
        </button>

        {expanded && (
          <div className="mt-4 space-y-2 animate-slide-down">
            {[...versions].reverse().map((v) => {
              const isActive = v.version === currentVersion;

              return (
                <div
                  key={v.version}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    isActive
                      ? 'border-accent bg-accent-light'
                      : 'border-border hover:border-border-hover hover:bg-gray-50'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-semibold text-sm flex-shrink-0 ${
                      isActive ? 'bg-accent text-white' : 'bg-gray-100 text-secondary'
                    }`}
                  >
                    {v.version}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-medium ${
                          isActive ? 'text-accent' : 'text-primary'
                        }`}
                      >
                        {v.summary}
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-medium text-accent bg-accent/10 px-1.5 py-0.5 rounded">
                          当前
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-tertiary" />
                      <span className="text-xs text-tertiary">{fmtDate(v.timestamp)}</span>
                      <span className="text-tertiary">·</span>
                      <span
                        className={`text-xs font-medium ${
                          v.score >= 80 ? 'text-success' : 'text-warning'
                        }`}
                      >
                        {v.score}分
                      </span>
                    </div>
                  </div>

                  {!isActive && (
                    <button
                      onClick={() => handleRestoreClick(v.version)}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-secondary hover:text-primary border border-border hover:border-border-hover rounded-lg transition-all duration-150 active:scale-95"
                    >
                      <RotateCcw className="w-3 h-3" />
                      恢复
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={!!pendingVersion}
        title="恢复版本"
        message={`确定要恢复 ${pendingVersion} 吗？当前编辑内容将被覆盖。`}
        confirmLabel="恢复"
        onConfirm={confirmRestore}
        onCancel={() => setPendingVersion(null)}
      />
    </>
  );
}
