import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'default' | 'danger';
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = '确认',
  cancelLabel = '取消',
  onConfirm,
  onCancel,
  variant = 'default',
}: ConfirmDialogProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
    } else {
      const t = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!visible && !open) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${
        open ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div
        className={`relative bg-surface rounded-xl border border-border shadow-xl w-full max-w-sm p-6 animate-slide-up`}
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1 rounded-md text-tertiary hover:text-secondary hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-lg font-semibold text-primary mb-2">{title}</h3>
        <p className="text-sm text-secondary leading-relaxed mb-6">{message}</p>

        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={onCancel} size="sm">
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            size="sm"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
