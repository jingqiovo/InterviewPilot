import { useAppStore } from '@/store/appStore';
import { ConfirmDialog } from '@/components/features/ConfirmDialog';
import { HomePage } from '@/pages/HomePage';
import { AnalysisPage } from '@/pages/AnalysisPage';
import { InterviewPage } from '@/pages/InterviewPage';
import { ResultPage } from '@/pages/ResultPage';
import { HistoryPage } from '@/pages/HistoryPage';

function App() {
  const { currentPage } = useAppStore();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'analysis':
        return <AnalysisPage />;
      case 'interview':
        return <InterviewPage />;
      case 'result':
        return <ResultPage />;
      case 'history':
        return <HistoryPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-primary antialiased">
      {renderPage()}
      <ConfirmDialog />
    </div>
  );
}

export default App;
