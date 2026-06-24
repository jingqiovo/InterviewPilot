import React from 'react';
import { useAppStore } from './store/appStore';
import { NavBar } from './components/features/NavBar';
import { HomePage } from './pages/HomePage';
import { AnalysisPage } from './pages/AnalysisPage';
import { ResultPage } from './pages/ResultPage';
import { HistoryPage } from './pages/HistoryPage';

export default function App() {
  const { currentPage } = useAppStore();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'analysis':
        return <AnalysisPage />;
      case 'result':
        return <ResultPage />;
      case 'history':
        return <HistoryPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <NavBar />
      {renderPage()}
    </div>
  );
}
