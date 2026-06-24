import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md';
  color?: 'accent' | 'success' | 'warning' | 'error';
}

export function ProgressBar({
  value,
  max = 100,
  className = '',
  showLabel = false,
  size = 'md',
  color = 'accent',
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const heights = {
    sm: 'h-1',
    md: 'h-1.5',
  };

  const colors = {
    accent: 'bg-accent',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
  };

  return (
    <div className={`${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-secondary">分析进度</span>
          <span className="text-xs font-medium text-primary">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-100 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`${heights[size]} ${colors[color]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
