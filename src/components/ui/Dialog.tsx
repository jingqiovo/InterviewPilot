import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

export function Dialog({ children, open, onOpenChange }: { children: React.ReactNode; open?: boolean; onOpenChange?: (open: boolean) => void }) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </DialogPrimitive.Root>
  );
}

export function DialogTrigger({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) {
  return <DialogPrimitive.Trigger asChild={asChild}>{children}</DialogPrimitive.Trigger>;
}

export function DialogContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 animate-fade-in" />
      <DialogPrimitive.Content className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl border border-border shadow-lg z-50 animate-slide-up p-6 ${className}`}>
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 text-text-tertiary hover:text-text-secondary transition-colors">
          <X size={18} />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mb-5 ${className}`}>{children}</div>;
}

export function DialogTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <DialogPrimitive.Title className={`text-h3 text-primary ${className}`}>
      {children}
    </DialogPrimitive.Title>
  );
}

export function DialogDescription({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <DialogPrimitive.Description className={`text-small text-text-secondary mt-1 ${className}`}>
      {children}
    </DialogPrimitive.Description>
  );
}

export function DialogFooter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex justify-end gap-3 mt-6 ${className}`}>{children}</div>;
}
