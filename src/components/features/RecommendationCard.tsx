import React, { useState } from 'react';
import { Card, CardHeader } from '../ui/Card';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';
import type { Recommendation } from '../../types';

interface RecommendationCardProps {
  recommendations: Recommendation[];
  onToggle?: (id: string) => void;
}

export function RecommendationCard({ recommendations, onToggle }: RecommendationCardProps) {
  const sorted = [...recommendations].sort((a, b) => a.priority - b.priority);

  return (
    <Card className="animate-fade-in" style={{ animationDelay: '150ms' }}>
      <CardHeader
        title="优化建议"
        subtitle="按优先级排列，建议按顺序处理"
      />

      <div className="space-y-3">
        {sorted.map((rec, index) => (
          <div
            key={rec.id}
            className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
              rec.completed
                ? 'border-success/20 bg-success/5'
                : 'border-border hover:border-border-hover hover:bg-gray-50'
            }`}
            onClick={() => onToggle?.(rec.id)}
          >
            <div className="flex-shrink-0 mt-0.5">
              {rec.completed ? (
                <CheckCircle className="w-5 h-5 text-success" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-gray-200 flex items-center justify-center">
                  <span className="text-[10px] font-semibold text-tertiary">
                    {index + 1}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                  rec.completed ? 'bg-success/10 text-success' : 'bg-gray-100 text-secondary'
                }`}>
                  {rec.category}
                </span>
              </div>
              <p className={`text-sm font-medium ${rec.completed ? 'text-secondary line-through' : 'text-primary'}`}>
                {rec.title}
              </p>
              <p className="text-xs text-secondary mt-1 leading-relaxed">
                {rec.description}
              </p>
            </div>

            {!rec.completed && (
              <ArrowRight className="w-4 h-4 text-tertiary flex-shrink-0 mt-1" />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
