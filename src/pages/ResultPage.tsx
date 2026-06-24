import { useAppStore } from '@/store/appStore';
import { NavBar } from '@/components/features/NavBar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowRight, TrendingUp, TrendingDown, Sparkles, Target, MessageSquare, Lightbulb } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ResultPage() {
  const { result, setCurrentPage, resetSession } = useAppStore();
  const [animatedScores, setAnimatedScores] = useState<{
    overall: number;
    professional: number;
    communication: number;
    problemSolving: number;
  }>({ overall: 0, professional: 0, communication: 0, problemSolving: 0 });

  useEffect(() => {
    if (!result) return;

    const duration = 1200;
    const steps = 60;
    const stepDuration = duration / steps;

    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);

      setAnimatedScores({
        overall: Math.round(result.overallScore * eased),
        professional: Math.round(result.scores.professional * eased),
        communication: Math.round(result.scores.communication * eased),
        problemSolving: Math.round(result.scores.problemSolving * eased),
      });

      if (progress >= 1) clearInterval(interval);
    }, stepDuration);

    return () => clearInterval(interval);
  }, [result]);

  if (!result) {
    return (
      <div className="min-h-screen bg-white">
        <NavBar showBack={true} onBack={() => setCurrentPage('home')} />
        <main className="max-w-3xl mx-auto px-6 py-12 text-center">
          <div className="flex items-center justify-center gap-2 text-text-secondary">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="ml-2">加载结果...</span>
          </div>
        </main>
      </div>
    );
  }

  // Score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-50';
    if (score >= 60) return 'bg-amber-50';
    return 'bg-red-50';
  };

  return (
    <div className="min-h-screen bg-white">
      <NavBar showBack={false} showHistory={true} />

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10 fade-in">
          <div className="inline-flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-black heartbeat" />
            <span className="text-xs uppercase tracking-wider text-gray-500 font-medium">
              面试反馈
            </span>
          </div>
          <h1 className="text-h1 text-primary mb-2">面试完成</h1>
          <p className="text-body text-text-secondary">
            以下是针对你面试表现的分析和建议
          </p>
        </div>

        {/* Overall Score */}
        <Card padding="lg" className="mb-8 text-center scale-in">
          <p className="text-small text-text-secondary mb-3">综合评分</p>
          <div className={`text-7xl font-semibold tracking-tight mb-4 ${getScoreColor(animatedScores.overall)} tabular-nums`}>
            {animatedScores.overall}
          </div>
          <div className="max-w-xs mx-auto mb-3">
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-black rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${animatedScores.overall}%` }}
              />
            </div>
          </div>
          <p className="text-small text-text-secondary">
            与目标岗位匹配度 <span className="font-semibold text-primary tabular-nums">{result.matchRate}%</span>
          </p>
        </Card>

        {/* Sub Scores */}
        <div className="grid grid-cols-3 gap-4 mb-10 stagger">
          <Card padding="md" className="text-center card-hover">
            <div className={`w-8 h-8 ${getScoreBg(result.scores.professional)} rounded-lg flex items-center justify-center mx-auto mb-2`}>
              <Target size={14} className={getScoreColor(result.scores.professional)} />
            </div>
            <p className="text-tiny text-text-tertiary mb-2">专业能力</p>
            <p className={`text-2xl font-semibold ${getScoreColor(animatedScores.professional)} tabular-nums`}>
              {animatedScores.professional}
            </p>
          </Card>
          <Card padding="md" className="text-center card-hover">
            <div className={`w-8 h-8 ${getScoreBg(result.scores.communication)} rounded-lg flex items-center justify-center mx-auto mb-2`}>
              <MessageSquare size={14} className={getScoreColor(result.scores.communication)} />
            </div>
            <p className="text-tiny text-text-tertiary mb-2">沟通表达</p>
            <p className={`text-2xl font-semibold ${getScoreColor(animatedScores.communication)} tabular-nums`}>
              {animatedScores.communication}
            </p>
          </Card>
          <Card padding="md" className="text-center card-hover">
            <div className={`w-8 h-8 ${getScoreBg(result.scores.problemSolving)} rounded-lg flex items-center justify-center mx-auto mb-2`}>
              <Lightbulb size={14} className={getScoreColor(result.scores.problemSolving)} />
            </div>
            <p className="text-tiny text-text-tertiary mb-2">问题解决</p>
            <p className={`text-2xl font-semibold ${getScoreColor(animatedScores.problemSolving)} tabular-nums`}>
              {animatedScores.problemSolving}
            </p>
          </Card>
        </div>

        {/* Diagnoses */}
        <section className="mb-10">
          <h2 className="text-h3 text-primary mb-4 fade-in">问题诊断</h2>
          <div className="space-y-3 stagger">
            {result.diagnoses.map((diagnosis) => (
              <Card key={diagnosis.id} padding="md" className="card-hover">
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-110 ${
                    diagnosis.type === 'strength' ? 'bg-green-50' :
                    diagnosis.type === 'weakness' ? 'bg-amber-50' : 'bg-blue-50'
                  }`}>
                    {diagnosis.type === 'strength' ? (
                      <TrendingUp size={14} className="text-green-600" />
                    ) : diagnosis.type === 'weakness' ? (
                      <TrendingDown size={14} className="text-amber-600" />
                    ) : (
                      <Sparkles size={14} className="text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium text-primary">{diagnosis.title}</h3>
                      <Badge variant={
                        diagnosis.type === 'strength' ? 'success' :
                        diagnosis.type === 'weakness' ? 'warning' : 'default'
                      }>
                        {diagnosis.type === 'strength' ? '优势' :
                         diagnosis.type === 'weakness' ? '待改进' : '机会点'}
                      </Badge>
                    </div>
                    <p className="text-small text-text-secondary">{diagnosis.description}</p>
                    {diagnosis.examples.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {diagnosis.examples.map((example, i) => (
                          <li key={i} className="text-tiny text-text-tertiary flex items-start gap-1.5">
                            <span>•</span>
                            <span>{example}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Suggestions */}
        <section className="mb-10">
          <h2 className="text-h3 text-primary mb-4 fade-in">优化建议</h2>
          <div className="space-y-3 stagger">
            {/* High priority */}
            {result.suggestions.filter(s => s.priority === 'high').length > 0 && (
              <div className="mb-4">
                <p className="text-tiny text-text-tertiary mb-2 uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  高优先级
                </p>
                {result.suggestions.filter(s => s.priority === 'high').map((suggestion) => (
                  <Card key={suggestion.id} padding="md" className="mb-2 card-hover border-l-2 border-l-red-400">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 bg-muted rounded-md flex items-center justify-center shrink-0">
                        <Lightbulb size={14} className="text-amber-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-primary">{suggestion.title}</p>
                        <p className="text-small text-text-secondary mt-0.5">{suggestion.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Medium priority */}
            {result.suggestions.filter(s => s.priority === 'medium').length > 0 && (
              <div className="mb-4">
                <p className="text-tiny text-text-tertiary mb-2 uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                  中优先级
                </p>
                {result.suggestions.filter(s => s.priority === 'medium').map((suggestion) => (
                  <Card key={suggestion.id} padding="md" className="mb-2 card-hover border-l-2 border-l-amber-400">
                    <p className="text-sm font-medium text-primary">{suggestion.title}</p>
                    <p className="text-small text-text-secondary mt-0.5">{suggestion.description}</p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Practice Areas */}
        <section className="mb-10 fade-in">
          <h2 className="text-h3 text-primary mb-4">建议练习方向</h2>
          <Card padding="md">
            <div className="flex flex-wrap gap-2">
              {result.practiceAreas.map((area, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-sm rounded-full border border-gray-100 hover:border-gray-300 hover:bg-white transition-all duration-200 hover:-translate-y-0.5 scale-in"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <span className="text-text-secondary">{area}</span>
                </span>
              ))}
            </div>
          </Card>
        </section>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-border fade-in" style={{ animationDelay: '300ms' }}>
          <Button
            variant="secondary"
            className="flex-1 group"
            onClick={() => { resetSession(); setCurrentPage('home'); }}
          >
            返回首页
          </Button>
          <Button
            className="flex-1 group"
            onClick={() => { resetSession(); setCurrentPage('home'); }}
          >
            再练一次
            <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform duration-200" />
          </Button>
        </div>
      </main>
    </div>
  );
}