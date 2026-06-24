import { History, ArrowLeft } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

interface NavBarProps {
  showBack?: boolean;
  showHistory?: boolean;
  title?: string;
  onBack?: () => void;
}

export function NavBar({ showBack, showHistory = true, title, onBack }: NavBarProps) {
  const { setCurrentPage } = useAppStore();

  return (
    <nav className="sticky top-0 z-40 w-full bg-white border-b border-border">
      <div className="max-w-3xl mx-auto flex h-14 items-center px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          {showBack ? (
            <button 
              onClick={onBack}
              className="flex items-center gap-1.5 text-small text-text-secondary hover:text-primary transition-colors"
            >
              <ArrowLeft size={16} />
              <span>返回</span>
            </button>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-semibold">AI</span>
              </div>
              <span className="font-medium text-primary">InterviewPilot</span>
            </div>
          )}
        </div>

        {/* Center */}
        {title && (
          <div className="flex-1 text-center">
            <span className="text-small text-text-secondary">{title}</span>
          </div>
        )}

        {/* Right */}
        <div className="flex items-center gap-4 ml-auto">
          {showHistory && (
            <button 
              onClick={() => setCurrentPage('history')}
              className="flex items-center gap-1.5 text-small text-text-secondary hover:text-primary transition-colors"
            >
              <History size={16} />
              <span>历史</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
