import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

export function Toast({
  message,
  type = 'success',
  duration = 3000,
  onClose,
}: ToastProps) {
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 200);
    }, duration);
    return () => clearTimeout(timerRef.current);
  }, [duration, onClose]);

  const icons = { success: CheckCircle, error: CheckCircle, info: CheckCircle };
  const Icon = icons[type];

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-200 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
      }`}
    >
      <div className="flex items-center gap-2.5 bg-primary text-white px-4 py-3 rounded-xl shadow-lg">
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={() => {
            clearTimeout(timerRef.current);
            setVisible(false);
            setTimeout(onClose, 200);
          }}
          className="ml-1 p-0.5 rounded hover:bg-white/10 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M9 3L3 9M3 3L9 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

interface ExportMenuProps {
  onExport: (format: 'pdf' | 'word') => void;
}

export function ExportMenu({ onExport }: ExportMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-secondary border border-border rounded-lg hover:text-primary hover:border-border-hover hover:bg-gray-50 transition-all duration-150 active:scale-[0.98]"
      >
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 2v8M5 7l3 3 3-3M3 12h10"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        导出
        <svg
          className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-44 bg-surface border border-border rounded-xl shadow-lg z-20 py-1 animate-slide-down">
            <button
              onClick={() => {
                onExport('pdf');
                setOpen(false);
              }}
              className="w-full px-4 py-2.5 text-sm text-left text-primary hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
            >
              <span className="w-5 h-5 rounded bg-red-50 text-[9px] font-bold text-red-500 flex items-center justify-center">
                PDF
              </span>
              导出 PDF
            </button>
            <button
              onClick={() => {
                onExport('word');
                setOpen(false);
              }}
              className="w-full px-4 py-2.5 text-sm text-left text-primary hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
            >
              <span className="w-5 h-5 rounded bg-blue-50 text-[9px] font-bold text-blue-500 flex items-center justify-center">
                DOC
              </span>
              导出 Word
            </button>
          </div>
        </>
      )}
    </div>
  );
}
