import { useState, useEffect, useRef, useCallback } from 'react';
import type { AgentStep, StreamMessage, AnalysisResult } from '../types';
import { createMockAnalysisResult, STREAM_MESSAGES } from '../data/mockData';

interface UseAnalysisOptions {
  resumeText: string;
  jobTitle: string;
  onComplete?: (result: AnalysisResult) => void;
  onError?: (error: Error) => void;
  simulateError?: boolean;
}

interface UseAnalysisReturn {
  currentStep: number;
  agentSteps: AgentStep[];
  streamMessages: StreamMessage[];
  progress: number;
  isComplete: boolean;
  isError: boolean;
  errorMessage: string;
  start: () => void;
  reset: () => void;
}

const STEP_DELAY = 1500;
const MESSAGE_INTERVAL = 800;

export function useAnalysis({
  resumeText,
  jobTitle,
  onComplete,
  onError,
  simulateError = false,
}: UseAnalysisOptions): UseAnalysisReturn {
  const [currentStep, setCurrentStep] = useState(0);
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([]);
  const [streamMessages, setStreamMessages] = useState<StreamMessage[]>([]);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const streamIndexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
  };

  const reset = useCallback(() => {
    clearTimers();
    setCurrentStep(0);
    setAgentSteps([]);
    setStreamMessages([]);
    setProgress(0);
    setIsComplete(false);
    setIsError(false);
    setErrorMessage('');
    streamIndexRef.current = 0;
  }, []);

  const start = useCallback(() => {
    reset();

    const initialSteps: AgentStep[] = [
      { id: 'read', label: '正在读取简历内容', status: 'pending', streamMessages: [] },
      { id: 'detect', label: '正在识别目标岗位', status: 'pending', streamMessages: [] },
      { id: 'analyze', label: '正在分析岗位要求', status: 'pending', streamMessages: [] },
      { id: 'problems', label: '发现 4 个待优化问题', status: 'pending', streamMessages: [] },
      { id: 'optimize', label: '正在优化项目经历', status: 'pending', streamMessages: [] },
      { id: 'generate', label: '正在生成最终结果', status: 'pending', streamMessages: [] },
    ];
    setAgentSteps(initialSteps);

    // Step 0 - Read
    const t0 = setTimeout(() => {
      setAgentSteps((prev) =>
        prev.map((s, i) => (i === 0 ? { ...s, status: 'active' } : s))
      );
      setProgress(5);

      // Stream messages for step 0
      const messages0 = STREAM_MESSAGES.filter((_, i) => i < 3);
      messages0.forEach((msg, i) => {
        const t = setTimeout(() => {
          setStreamMessages((prev) => [...prev, msg]);
        }, i * MESSAGE_INTERVAL);
        timerRef.current.push(t);
      });
    }, 500);
    timerRef.current.push(t0);

    const t1 = setTimeout(() => {
      setAgentSteps((prev) =>
        prev.map((s, i) => (i === 0 ? { ...s, status: 'done', timestamp: new Date().toLocaleTimeString() } : s))
      );
      setCurrentStep(1);
      setProgress(15);
    }, STEP_DELAY + 1000);
    timerRef.current.push(t1);

    // Step 1 - Detect
    const t2 = setTimeout(() => {
      setAgentSteps((prev) =>
        prev.map((s, i) => (i === 1 ? { ...s, status: 'active' } : s))
      );
      const messages1 = STREAM_MESSAGES.filter((_, i) => i >= 3 && i < 5);
      messages1.forEach((msg, i) => {
        const t = setTimeout(() => {
          setStreamMessages((prev) => [...prev, msg]);
        }, i * MESSAGE_INTERVAL);
        timerRef.current.push(t);
      });
    }, STEP_DELAY + 1500);
    timerRef.current.push(t2);

    const t3 = setTimeout(() => {
      setAgentSteps((prev) =>
        prev.map((s, i) => (i === 1 ? { ...s, status: 'done', timestamp: new Date().toLocaleTimeString() } : s))
      );
      setCurrentStep(2);
      setProgress(30);
    }, STEP_DELAY * 2 + 2000);
    timerRef.current.push(t3);

    // Step 2 - Analyze
    const t4 = setTimeout(() => {
      setAgentSteps((prev) =>
        prev.map((s, i) => (i === 2 ? { ...s, status: 'active' } : s))
      );
      const messages2 = STREAM_MESSAGES.filter((_, i) => i >= 5 && i < 9);
      messages2.forEach((msg, i) => {
        const t = setTimeout(() => {
          setStreamMessages((prev) => [...prev, msg]);
        }, i * MESSAGE_INTERVAL);
        timerRef.current.push(t);
      });
    }, STEP_DELAY * 2 + 2500);
    timerRef.current.push(t4);

    const t5 = setTimeout(() => {
      setAgentSteps((prev) =>
        prev.map((s, i) => (i === 2 ? { ...s, status: 'done', timestamp: new Date().toLocaleTimeString() } : s))
      );
      setCurrentStep(3);
      setProgress(50);
    }, STEP_DELAY * 3 + 5000);
    timerRef.current.push(t5);

    // Step 3 - Problems
    const t6 = setTimeout(() => {
      setAgentSteps((prev) =>
        prev.map((s, i) => (i === 3 ? { ...s, status: 'active' } : s))
      );
      const msg = STREAM_MESSAGES.find((m) => m.id === 's7');
      if (msg) {
        const t = setTimeout(() => {
          setStreamMessages((prev) => [...prev, msg]);
        }, 0);
        timerRef.current.push(t);
      }
    }, STEP_DELAY * 3 + 5500);
    timerRef.current.push(t6);

    const t7 = setTimeout(() => {
      setAgentSteps((prev) =>
        prev.map((s, i) => (i === 3 ? { ...s, status: 'done', timestamp: new Date().toLocaleTimeString() } : s))
      );
      setCurrentStep(4);
      setProgress(65);
    }, STEP_DELAY * 4 + 5500);
    timerRef.current.push(t7);

    // Step 4 - Optimize
    const t8 = setTimeout(() => {
      setAgentSteps((prev) =>
        prev.map((s, i) => (i === 4 ? { ...s, status: 'active' } : s))
      );
      const messages4 = STREAM_MESSAGES.filter((_, i) => i >= 10 && i < 13);
      messages4.forEach((msg, i) => {
        const t = setTimeout(() => {
          setStreamMessages((prev) => [...prev, msg]);
        }, i * MESSAGE_INTERVAL);
        timerRef.current.push(t);
      });
    }, STEP_DELAY * 4 + 6000);
    timerRef.current.push(t8);

    const t9 = setTimeout(() => {
      setAgentSteps((prev) =>
        prev.map((s, i) => (i === 4 ? { ...s, status: 'done', timestamp: new Date().toLocaleTimeString() } : s))
      );
      setCurrentStep(5);
      setProgress(80);
    }, STEP_DELAY * 5 + 8000);
    timerRef.current.push(t9);

    // Step 5 - Generate
    const t10 = setTimeout(() => {
      setAgentSteps((prev) =>
        prev.map((s, i) => (i === 5 ? { ...s, status: 'active' } : s))
      );
      const lastMsg = STREAM_MESSAGES[12];
      if (lastMsg) {
        const t = setTimeout(() => {
          setStreamMessages((prev) => [...prev, lastMsg]);
        }, 0);
        timerRef.current.push(t);
      }
    }, STEP_DELAY * 5 + 8500);
    timerRef.current.push(t10);

    const t11 = setTimeout(() => {
      if (simulateError) {
        setIsError(true);
        setErrorMessage('AI 生成超时：服务器响应时间过长，请稍后重试。');
        setAgentSteps((prev) =>
          prev.map((s, i) => (i === 5 ? { ...s, status: 'error' } : s))
        );
        onError?.(new Error('AI generation timeout'));
        return;
      }
      setAgentSteps((prev) =>
        prev.map((s, i) => (i === 5 ? { ...s, status: 'done', timestamp: new Date().toLocaleTimeString() } : s))
      );
      setProgress(100);
      setIsComplete(true);

      const result = createMockAnalysisResult();
      onComplete?.(result);
    }, STEP_DELAY * 6 + 10000);
    timerRef.current.push(t11);
  }, [resumeText, jobTitle, onComplete, onError, simulateError, reset]);

  useEffect(() => {
    return () => clearTimers();
  }, []);

  return {
    currentStep,
    agentSteps,
    streamMessages,
    progress,
    isComplete,
    isError,
    errorMessage,
    start,
    reset,
  };
}
