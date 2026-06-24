import React, { useState } from 'react';
import { Card, CardHeader } from '../ui/Card';
import { ChevronDown, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import type { Problem } from '../../types';

interface ProblemCardProps {
  problems: Problem[];
}

const severityConfig = {
  high: { label: '需优先处理', color: 'text-error', bg: 'bg-red-50', icon: AlertCircle, border: 'border-red-100' },
  medium: { label: '建议优化', color: 'text-warning', bg: 'bg-amber-50', icon: AlertTriangle, border: 'border-amber-100' },
  low: { label: '可进一步打磨', color: 'text-secondary', bg: 'bg-gray-50', icon: Info, border: 'border-gray-100' },
};

export function ProblemCard({ problems }: ProblemCardProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <Card className="animate-fade-in" style={{ animationDelay: '100ms' }}>
      <CardHeader
        title="问题诊断"
        subtitle={`共发现 ${problems.length} 个待优化问题`}
      />

      <div className="space-y-2">
        {problems.map((problem) => {
          const config = severityConfig[problem.severity];
          const isOpen = expanded === problem.id;

          return (
            <div
              key={problem.id}
              className={`border rounded-lg overflow-hidden transition-colors ${config.border}`}
            >
              <button
                onClick={() => setExpanded(isOpen ? null : problem.id)}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center ${config.bg}`}>
                  <config.icon className={`w-3 h-3 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-primary truncate">
                      {problem.title}
                    </span>
                    <span className={`text-xs font-medium ${config.color} ${config.bg} px-1.5 py-0.5 rounded`}>
                      {config.label}
                    </span>
                  </div>
                  <span className="text-xs text-tertiary mt-0.5 block">
                    位于：{problem.section}
                  </span>
                </div>
                <div className={`text-tertiary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 space-y-4 animate-slide-up">
                  {/* 为什么这是问题 */}
                  <div>
                    <p className="text-xs font-medium text-tertiary mb-1.5">为什么这是问题</p>
                    <p className="text-sm text-secondary leading-relaxed">
                      {problem.description}
                    </p>
                  </div>

                  {problem.currentText && (
                    <div>
                      <p className="text-xs font-medium text-tertiary mb-1.5">当前写法</p>
                      <div className="px-3 py-2.5 bg-red-50/60 border border-red-100 rounded-lg">
                        <p className="text-xs text-primary italic leading-relaxed">
                          {problem.currentText}
                        </p>
                      </div>
                    </div>
                  )}

                  {problem.suggestedFix && (
                    <div>
                      <p className="text-xs font-medium text-tertiary mb-1.5">建议怎么改</p>
                      <div className="px-3 py-2.5 bg-emerald-50/60 border border-emerald-100 rounded-lg">
                        <p className="text-xs text-primary leading-relaxed">
                          {problem.suggestedFix}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}