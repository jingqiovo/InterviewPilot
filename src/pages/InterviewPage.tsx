import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { NavBar } from '@/components/features/NavBar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { mockResult } from '@/data/mockData';
import { ArrowRight, ArrowLeft, Lightbulb, CheckCircle2 } from 'lucide-react';

export function InterviewPage() {
  const {
    questions,
    currentQuestionIndex,
    nextQuestion,
    prevQuestion,
    skipQuestion,
    answers,
    setAnswer,
    setResult,
    setCurrentPage,
    showConfirm,
  } = useAppStore();

  const [currentAnswer, setCurrentAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const hasAnswer = currentQuestion ? answers.has(currentQuestion.id) : false;
  const answerLength = currentAnswer.trim().length;

  useEffect(() => {
    if (currentQuestion) {
      const savedAnswer = answers.get(currentQuestion.id);
      setCurrentAnswer(savedAnswer || '');
      setShowHint(false);
    }
  }, [currentQuestion, answers]);

  const handleAnswerChange = (value: string) => {
    setCurrentAnswer(value);
    if (currentQuestion) {
      setAnswer(currentQuestion.id, value);
    }
  };

  const handleSubmit = () => {
    if (currentAnswer.trim() && currentQuestion) {
      setAnswer(currentQuestion.id, currentAnswer);
      if (isLastQuestion) {
        setResult(mockResult);
        setCurrentPage('result');
      } else {
        setDirection('next');
        setIsTransitioning(true);
        setTimeout(() => {
          nextQuestion();
          setIsTransitioning(false);
        }, 250);
      }
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setDirection('prev');
      setIsTransitioning(true);
      setTimeout(() => {
        prevQuestion();
        setIsTransitioning(false);
      }, 250);
    }
  };

  const handleSkip = () => {
    if (currentQuestion) {
      showConfirm(
        '跳过问题',
        '确定要跳过这个问题吗？',
        () => skipQuestion(currentQuestion.id)
      );
    }
  };

  const handleEndInterview = () => {
    showConfirm(
      '结束面试',
      '确定要提前结束面试吗？',
      () => {
        setResult(mockResult);
        setCurrentPage('result');
      }
    );
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-white">
        <NavBar showBack={true} onBack={() => setCurrentPage('home')} />
        <main className="max-w-3xl mx-auto px-6 py-12 text-center">
          <div className="flex items-center justify-center gap-2 text-text-secondary">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="ml-2">加载中...</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <NavBar showBack={true} onBack={() => setCurrentPage('home')} />

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Progress */}
        <div className="mb-8 fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-small text-text-secondary tabular-nums">
              问题 {currentQuestionIndex + 1} / {totalQuestions}
            </span>
            <span className="text-small text-text-tertiary tabular-nums">{Math.round(progress)}%</span>
          </div>
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-black rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div
          className={`transition-all duration-300 ease-out ${
            isTransitioning
              ? direction === 'next'
                ? 'opacity-0 translate-x-8'
                : 'opacity-0 -translate-x-8'
              : 'opacity-100 translate-x-0'
          }`}
        >
          <Card padding="lg" className="mb-6">
            {/* Question Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-7 h-7 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-semibold tabular-nums">{currentQuestion.number || currentQuestionIndex + 1}</span>
                </div>
                <h2 className="text-h3 text-primary flex-1 leading-relaxed">
                  {currentQuestion.question}
                </h2>
              </div>
              <Badge
                variant={currentQuestion.difficulty === 'easy' ? 'success' : currentQuestion.difficulty === 'medium' ? 'warning' : 'error'}
              >
                {currentQuestion.difficulty === 'easy' ? '简单' : currentQuestion.difficulty === 'medium' ? '中等' : '困难'}
              </Badge>
            </div>

            {/* Question Type */}
            <div className="flex items-center gap-2 mb-5">
              <Badge variant="default">
                {currentQuestion.type === 'behavioral' ? '行为面试' :
                 currentQuestion.type === 'technical' ? '技术面试' : '情景面试'}
              </Badge>
              {hasAnswer && (
                <span className="inline-flex items-center gap-1 text-xs text-success scale-in">
                  <CheckCircle2 size={12} className="heartbeat" />
                  已回答
                </span>
              )}
              {answerLength > 0 && (
                <span className="text-xs text-text-tertiary tabular-nums fade-in">
                  {answerLength} 字
                </span>
              )}
            </div>

            {/* Answer Input */}
            <Textarea
              placeholder="在此输入你的回答..."
              className="min-h-[180px] mb-4 transition-all duration-200"
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(e.target.value)}
            />

            {/* Hint */}
            {currentQuestion.expectedPoints && showHint && (
              <div className="p-4 bg-muted rounded-lg mb-4 slide-down">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb size={14} className="text-amber-500" />
                  <p className="text-sm font-medium text-primary">参考要点</p>
                </div>
                <ul className="space-y-1 stagger">
                  {currentQuestion.expectedPoints.map((point, i) => (
                    <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-sm text-text-secondary hover:text-primary underline-expand transition-colors duration-200"
              >
                {showHint ? '隐藏提示' : '查看提示'}
              </button>
            </div>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between fade-in" style={{ animationDelay: '200ms' }}>
          <Button
            variant="secondary"
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft size={14} className="mr-1" />
            上一题
          </Button>

          <Button
            variant="ghost"
            onClick={handleEndInterview}
            className="text-text-secondary hover:text-error transition-colors duration-200"
          >
            结束面试
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={handleSkip}
            >
              跳过
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!currentAnswer.trim()}
              className="group"
            >
              {isLastQuestion ? '完成面试' : '下一题'}
              {!isLastQuestion && (
                <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform duration-200" />
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}