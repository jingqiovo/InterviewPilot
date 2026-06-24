import { useEffect, useRef } from 'react';

interface StreamLogProps {
  logs: string[];
  className?: string;
}

export function StreamLog({ logs, className }: StreamLogProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  if (logs.length === 0) {
    return null;
  }

  return (
    <div className={className} ref={containerRef}>
      {logs.map((log, index) => (
        <div 
          key={index} 
          className="text-sm text-muted-foreground animate-typing"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <span className="text-primary mr-2">{'>'}</span>
          {log}
        </div>
      ))}
      <StreamingCursor />
    </div>
  );
}

function StreamingCursor() {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="text-primary">{'>'}</span>
      <span className="inline-block h-4 w-2 bg-primary animate-pulse" />
    </span>
  );
}
