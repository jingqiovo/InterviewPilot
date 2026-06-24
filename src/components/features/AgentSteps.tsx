import React from 'react';
import { Check } from 'lucide-react';
import type { AgentStep } from '../../types';

interface AgentStepsProps {
  steps: AgentStep[];
  currentStep: number;
}

export function AgentSteps({ steps, currentStep }: AgentStepsProps) {
  return (
    <div className="space-y-0">
      {steps.map((step, index) => {
        const isDone = step.status === 'done';
        const isActive = step.status === 'active';
        const isPending = step.status === 'pending';
        const isError = step.status === 'error';

        return (
          <div key={step.id} className="relative">
            {/* Row */}
            <div
              className={`flex items-start gap-3 py-2 px-3 rounded-lg transition-all duration-300 ${
                isActive ? 'bg-accent/5' : 'bg-transparent'
              }`}
            >
              {/* Status Icon */}
              <div className="flex-shrink-0 mt-0.5 w-5 h-5">
                {isDone && (
                  <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" strokeWidth={2.5} />
                  </div>
                )}
                {isActive && (
                  <div className="relative w-5 h-5">
                    <div
                      className="absolute inset-0 rounded-full bg-accent step-active-pulse"
                    />
                    <div className="relative w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                  </div>
                )}
                {isPending && (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-200" />
                )}
                {isError && (
                  <div className="w-5 h-5 rounded-full bg-error flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">!</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm leading-snug transition-colors duration-200 ${
                    isActive
                      ? 'font-medium text-accent'
                      : isDone
                      ? 'text-secondary'
                      : isError
                      ? 'text-error font-medium'
                      : 'text-tertiary'
                  }`}
                >
                  {step.label}
                </p>
                {isDone && step.timestamp && (
                  <p className="text-[11px] text-tertiary mt-0.5">{step.timestamp}</p>
                )}
              </div>
            </div>

            {/* Connector — below each row except last */}
            {index < steps.length - 1 && (
              <div
                className={`ml-[22px] w-0.5 h-4 transition-colors duration-500 ${
                  index < currentStep ? 'bg-success/50' : 'bg-gray-100'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
