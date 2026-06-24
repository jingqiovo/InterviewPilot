import React from 'react';
import { Card, CardHeader } from '../ui/Card';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import type { GapAnalysis as GapAnalysisType, GapItem } from '../../types';

interface GapAnalysisCardProps {
  gap: GapAnalysisType;
}

export function GapAnalysisCard({ gap }: GapAnalysisCardProps) {
  return (
    <Card className="animate-fade-in" style={{ animationDelay: '100ms' }}>
      <CardHeader
        title="岗位差距分析"
        subtitle="对比简历与岗位要求，定位已具备和待补强的能力"
      />

      <div className="space-y-5">
        <Section
          icon={<CheckCircle2 className="w-3.5 h-3.5 text-success" />}
          title="已匹配能力"
          items={gap.matched}
          accent="success"
        />
        <Section
          icon={<AlertCircle className="w-3.5 h-3.5 text-warning" />}
          title="待补强能力"
          items={gap.gaps}
          accent="warning"
        />
        <Section
          icon={<Sparkles className="w-3.5 h-3.5 text-accent" />}
          title="建议强化表达"
          items={gap.enhancements}
          accent="accent"
        />
      </div>
    </Card>
  );
}

function Section({
  icon,
  title,
  items,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  items: GapItem[];
  accent: 'success' | 'warning' | 'accent';
}) {
  const dotClass =
    accent === 'success'
      ? 'bg-success/10'
      : accent === 'warning'
      ? 'bg-warning/10'
      : 'bg-accent/10';

  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        <div className={`w-5 h-5 rounded-md ${dotClass} flex items-center justify-center`}>
          {icon}
        </div>
        <h4 className="text-xs font-semibold text-primary">{title}</h4>
        <span className="text-[10px] text-tertiary">· {items.length} 项</span>
      </div>
      <ul className="space-y-1.5 ml-1">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-xs text-secondary leading-relaxed"
          >
            <span
              className={`mt-1.5 w-1 h-1 rounded-full flex-shrink-0 ${
                accent === 'success'
                  ? 'bg-success'
                  : accent === 'warning'
                  ? 'bg-warning'
                  : 'bg-accent'
              }`}
            />
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
