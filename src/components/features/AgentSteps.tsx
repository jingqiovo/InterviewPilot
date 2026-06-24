import { AgentStep } from '@/types';
import { Check } from 'lucide-react';

interface AgentStepsProps {
  steps: AgentStep[];
}

export function AgentSteps({ steps }: AgentStepsProps) {
  const completedCount = steps.filter(s => s.status === 'completed').length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-text-secondary">分析进度</span>
        <span className="text-sm text-text-tertiary tabular-nums">{completedCount}/{steps.length} 步</span>
      </div>
      <div className="space-y-1">
        {steps.map((step, index) => (
          <AgentStepItem key={step.id} step={step} index={index} />
        ))}
      </div>
    </div>
  );
}

function AgentStepItem({ step, index }: { step: AgentStep; index: number }) {
  const statusConfig = {
    pending: {
      dot: 'bg-gray-200',
      text: 'text-text-tertiary',
      label: '等待中',
    },
    running: {
      dot: 'bg-amber-400',
      text: 'text-primary',
      label: '进行中',
    },
    completed: {
      dot: 'bg-green-500',
      text: 'text-primary',
      label: '已完成',
    },
    error: {
      dot: 'bg-red-500',
      text: 'text-red-600',
      label: '失败',
    },
  };

  const config = statusConfig[step.status];

  return (
    <div
      className="flex items-start gap-3 py-2.5 transition-all duration-300"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Timeline indicator */}
      <div className="flex flex-col items-center pt-1">
        {step.status === 'completed' ? (
          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center heartbeat">
            <Check size={11} className="text-white" strokeWidth={3} />
          </div>
        ) : step.status === 'running' ? (
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 pulse-dot text-amber-400" />
        ) : step.status === 'error' ? (
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
        ) : (
          <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
        )}
        {index < 5 && (
          <div className={`w-px h-8 mt-1 transition-colors duration-500 ${
            step.status === 'completed' ? 'bg-green-500/40' : 'bg-border'
          }`} />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium transition-colors duration-300 ${config.text}`}>
            {step.name}
          </span>
          <span className={`text-xs ${config.text}`}>({config.label})</span>
        </div>
        {step.log && step.status !== 'pending' && (
          <p className="text-xs text-text-tertiary mt-0.5 fade-in">{step.log}</p>
        )}
      </div>
    </div>
  );
}