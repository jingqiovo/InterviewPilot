import React from 'react';
import { Card, CardHeader } from '../ui/Card';
import type { ResumeScore } from '../../types';

interface ScoreCardProps {
  score: ResumeScore;
}

function getSummary(total: number): string {
  if (total >= 85) return '整体质量不错，简历结构清晰，与目标岗位匹配度较高。';
  if (total >= 75) return '简历基础扎实，部分细节可以进一步打磨，以获得更好的投递效果。';
  if (total >= 65) return '简历整体框架尚可，项目经历和成果表达仍有提升空间。';
  return '简历存在明显短板，建议优先处理高优先级问题，再做投递。';
}

export function ScoreCard({ score }: ScoreCardProps) {
  const getScoreColor = (value: number) => {
    if (value >= 80) return 'text-success';
    if (value >= 60) return 'text-warning';
    return 'text-error';
  };

  const getBarColor = (value: number) => {
    if (value >= 80) return 'bg-success';
    if (value >= 60) return 'bg-warning';
    return 'bg-error';
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader
        title="简历评分"
        subtitle="基于内容、结构、关键词和影响力四个维度"
      />
      <p className="text-sm text-secondary leading-relaxed mb-5 -mt-1">
        {getSummary(score.total)}
      </p>
      <div className="flex items-end gap-6">
        <div className="flex items-baseline gap-1">
          <span className={`text-5xl font-bold ${getScoreColor(score.total)}`}>
            {score.total}
          </span>
          <span className="text-lg text-tertiary font-medium">/100</span>
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${getBarColor(score.total)} rounded-full transition-all duration-700`}
                style={{ width: `${score.total}%` }}
              />
            </div>
            <span className="text-xs text-tertiary w-20">
              行业平均 {score.industryAverage}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {Object.entries(score.breakdown).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="text-sm font-semibold text-primary">{value}</div>
                <div className="text-xs text-tertiary capitalize">
                  {key === 'content' ? '内容' :
                   key === 'structure' ? '结构' :
                   key === 'keywords' ? '关键词' : '影响力'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
