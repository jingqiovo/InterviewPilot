import * as ProgressPrimitive from '@radix-ui/react-progress';

interface ProgressProps {
  value: number;
  className?: string;
}

export function Progress({ value = 0, className = '' }: ProgressProps) {
  return (
    <ProgressPrimitive.Root 
      className={`relative h-1.5 w-full overflow-hidden rounded-full bg-muted ${className}`}
    >
      <ProgressPrimitive.Indicator 
        className="h-full bg-primary transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </ProgressPrimitive.Root>
  );
}
