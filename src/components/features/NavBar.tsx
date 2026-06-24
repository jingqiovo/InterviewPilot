import React from 'react';
import { Sparkles, History, Home } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import type { AppPage } from '../../types';

export function NavBar() {
  const { currentPage, setPage } = useAppStore();

  const navItems: { page: AppPage; label: string; icon: React.ReactNode }[] = [
    { page: 'home', label: '开始分析', icon: <Home className="w-4 h-4" /> },
    { page: 'history', label: '历史记录', icon: <History className="w-4 h-4" /> },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <button
          onClick={() => setPage('home')}
          className="flex items-center gap-2 group"
        >
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-semibold text-primary tracking-tight">
            ResumePilot <span className="text-secondary font-normal">AI</span>
          </span>
        </button>

        <nav className="flex items-center gap-1">
          {navItems.map(({ page, label, icon }) => (
            <button
              key={page}
              onClick={() => setPage(page)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? 'bg-accent-light text-accent'
                  : 'text-secondary hover:text-primary hover:bg-gray-100'
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
