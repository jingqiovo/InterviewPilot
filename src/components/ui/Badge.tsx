import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', size = 'sm', children, className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-muted text-text-secondary',
    success: 'bg-green-50 text-success',
    warning: 'bg-amber-50 text-warning',
    error: 'bg-red-50 text-error',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-md ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
}
