import React, { useState, useEffect, useRef } from 'react';
import type { StreamMessage } from '../../types';

interface StreamOutputProps {
  messages: StreamMessage[];
  isComplete: boolean;
}

const typeConfig = {
  info: { dot: 'bg-accent/60', text: 'text-secondary' },
  thinking: { dot: 'bg-warning/70', text: 'text-secondary' },
  success: { dot: 'bg-success', text: 'text-success' },
  error: { dot: 'bg-error', text: 'text-error' },
};

export function StreamOutput({ messages, isComplete }: StreamOutputProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {messages.map((msg) => {
          const config = typeConfig[msg.type];

          return (
            <div key={msg.id} className="flex items-start gap-2 animate-msg-enter">
              <div className={`w-1.5 h-1.5 rounded-full mt-[7px] flex-shrink-0 ${config.dot}`} />
              <div className="flex-1">
                <span className={`text-sm ${config.text}`}>{msg.text}</span>
                <span className="text-[11px] text-tertiary ml-2">{msg.timestamp}</span>
              </div>
            </div>
          );
        })}

        {isComplete && (
          <div className="flex items-start gap-2 pt-3 border-t border-border/60 animate-fade-in">
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success/60 dot-bounce-1" />
              <span className="w-1.5 h-1.5 rounded-full bg-success/60 dot-bounce-2" />
              <span className="w-1.5 h-1.5 rounded-full bg-success/60 dot-bounce-3" />
            </div>
            <span className="text-sm text-secondary animate-fade-in" style={{ animationDelay: '200ms' }}>
              分析完成，正在整理结果...
            </span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
