import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/appStore';
import { AlertTriangle } from 'lucide-react';

export function ConfirmDialog() {
  const { confirmDialog, hideConfirm } = useAppStore();

  const handleConfirm = () => {
    confirmDialog.onConfirm();
    hideConfirm();
  };

  return (
    <Dialog open={confirmDialog.isOpen} onOpenChange={hideConfirm}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <AlertTriangle size={18} className="text-amber-600" />
            </div>
            <DialogTitle>{confirmDialog.title}</DialogTitle>
          </div>
          <DialogDescription>{confirmDialog.message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={hideConfirm}>取消</Button>
          <Button onClick={handleConfirm}>确认</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
