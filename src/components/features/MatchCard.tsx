import React from 'react';
import { Card, CardHeader } from '../ui/Card';
import { CheckCircle, XCircle } from 'lucide-react';
import type { MatchAnalysis } from '../../types';

interface MatchCardProps {
  match: MatchAnalysis;
  hasJD?: boolean;
}

export function MatchCard({ match, hasJD }: MatchCardProps) {
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (match.overall / 100) * circumference;

  const getMatchColor = (value: number) => {
    if (value >= 80) return { stroke: '#10B981', text: 'text-success', bg: 'bg-emerald-50' };
    if (value >= 60) return { stroke: '#F59E0B', text: 'text-warning', bg: 'bg-amber-50' };
    return { stroke: '#EF4444', text: 'text-error', bg: 'bg-red-50' };
  };

  const overallColors = getMatchColor(match.overall);

  const dimColor = (v: number) =>
    v >= 80 ? 'bg-success' : v >= 60 ? 'bg-warning' : 'bg-error';

  return (
    <Card className="animate-fade-in" style={{ animationDelay: '50ms' }}>
      <CardHeader
        title="岗位匹配度"
        subtitle={
          hasJD
            ? '基于简历内容 + 目标岗位 JD 综合分析'
            : '与目标岗位的关键词匹配分析'
        }
      />

      <div className="flex items-start gap-6">
        {/* Circular Progress */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="#F3F4F6"
              strokeWidth="6"
            />
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke={overallColors.stroke}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold ${overallColors.text}`}>
              {match.overall}%
            </span>
            <span className="text-[10px] text-tertiary">综合匹配</span>
          </div>
        </div>

        {/* Match Details */}
        <div className="flex-1 space-y-4">
          {/* 三维度 */}
          <div className="space-y-2.5">
            <DimensionBar label="技能匹配" value={match.skills} color={dimColor(match.skills)} />
            <DimensionBar label="项目匹配" value={match.projects} color={dimColor(match.projects)} />
            <DimensionBar label="经验匹配" value={match.experience} color={dimColor(match.experience)} />
          </div>

          {/* 关键词匹配 */}
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
            <div>
              <p className="text-xs font-medium text-tertiary uppercase tracking-wide mb-2">
                已匹配项
              </p>
              <div className="space-y-1">
                {match.matched.slice(0, 5).map((item) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <CheckCircle className="w-3 h-3 text-success flex-shrink-0" />
                    <span className="text-xs text-primary">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-tertiary uppercase tracking-wide mb-2">
                缺失项
              </p>
              <div className="space-y-1">
                {match.missing.slice(0, 5).map((item) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <XCircle className="w-3 h-3 text-error flex-shrink-0" />
                    <span className="text-xs text-secondary">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 解释文案 */}
      {match.explanation && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-secondary leading-relaxed">
            {match.explanation}
          </p>
        </div>
      )}
    </Card>
  );
}

function DimensionBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-secondary">{label}</span>
        <span className="text-xs font-medium text-primary tabular-nums">{value}%</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

