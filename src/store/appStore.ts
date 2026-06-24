import { create } from 'zustand';
import { InterviewSession, InterviewQuestion, AgentStep, AppPage, HistoryRecord } from '@/types';
import { mockHistory } from '@/data/mockData';

interface AppState {
  // Navigation
  currentPage: AppPage;
  setCurrentPage: (page: AppPage) => void;

  // Session
  currentSession: InterviewSession | null;
  
  // Resume
  resumeContent: string;
  setResumeContent: (content: string) => void;
  
  // Position
  positionTitle: string;
  setPositionTitle: (title: string) => void;
  
  // Job JD
  jobJDContent: string;
  setJobJDContent: (content: string) => void;

  // Analysis
  isAnalyzing: boolean;
  agentSteps: AgentStep[];
  streamLogs: string[];
  
  startAnalysis: () => void;
  addAgentStep: (step: AgentStep) => void;
  updateAgentStep: (stepId: string, updates: Partial<AgentStep>) => void;
  addStreamLog: (log: string) => void;
  
  // Interview
  questions: InterviewQuestion[];
  setQuestions: (questions: InterviewQuestion[]) => void;
  currentQuestionIndex: number;
  answers: Map<string, string>;
  setAnswer: (questionId: string, answer: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  skipQuestion: (questionId: string) => void;
  
  // Result
  result: {
    id: string;
    sessionId: string;
    overallScore: number;
    scores: {
      professional: number;
      communication: number;
      problemSolving: number;
    };
    matchRate: number;
    diagnoses: {
      id: string;
      type: 'strength' | 'weakness' | 'opportunity';
      title: string;
      description: string;
      examples: string[];
    }[];
    suggestions: {
      id: string;
      category: 'answer' | 'delivery' | 'structure' | 'content';
      title: string;
      description: string;
      priority: 'high' | 'medium' | 'low';
    }[];
    practiceAreas: string[];
    completedAt: Date;
  } | null;
  setResult: (result: AppState['result']) => void;
  
  // History
  history: HistoryRecord[];
  addToHistory: (record: HistoryRecord) => void;
  rollbackToVersion: (sessionId: string, version: number) => void;

  // Confirm Dialog
  confirmDialog: {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  };
  showConfirm: (title: string, message: string, onConfirm: () => void) => void;
  hideConfirm: () => void;

  // Error
  error: {
    isOpen: boolean;
    title: string;
    message: string;
    type: 'upload' | 'parse' | 'analysis' | 'timeout' | 'unknown';
  };
  showError: (title: string, message: string, type: AppState['error']['type']) => void;
  hideError: () => void;

  // Reset
  resetSession: () => void;
}

const initialAgentSteps: AgentStep[] = [
  { id: 'step-1', name: '读取简历', status: 'pending', timestamp: new Date() },
  { id: 'step-2', name: '分析目标岗位', status: 'pending', timestamp: new Date() },
  { id: 'step-3', name: '提取关键技能', status: 'pending', timestamp: new Date() },
  { id: 'step-4', name: '生成面试题', status: 'pending', timestamp: new Date() },
  { id: 'step-5', name: '构建评分标准', status: 'pending', timestamp: new Date() },
  { id: 'step-6', name: '完成', status: 'pending', timestamp: new Date() },
];

export const useAppStore = create<AppState>((set, get) => ({
  // Navigation
  currentPage: 'home',
  setCurrentPage: (page) => set({ currentPage: page }),

  // Session
  currentSession: null,

  // Resume
  resumeContent: '',
  setResumeContent: (content) => set({ resumeContent: content }),

  // Position
  positionTitle: '',
  setPositionTitle: (title) => set({ positionTitle: title }),

  // Job JD
  jobJDContent: '',
  setJobJDContent: (content) => set({ jobJDContent: content }),

  // Analysis
  isAnalyzing: false,
  agentSteps: [...initialAgentSteps],
  streamLogs: [],

  startAnalysis: () => {
    set({
      isAnalyzing: true,
      agentSteps: initialAgentSteps.map(s => ({ ...s, status: 'pending' as const })),
      streamLogs: [],
      currentPage: 'analysis',
    });
  },

  addAgentStep: (step) => {
    set((state) => ({
      agentSteps: [...state.agentSteps, step],
    }));
  },

  updateAgentStep: (stepId, updates) => {
    set((state) => ({
      agentSteps: state.agentSteps.map((step) =>
        step.id === stepId ? { ...step, ...updates } : step
      ),
    }));
  },

  addStreamLog: (log) => {
    set((state) => ({
      streamLogs: [...state.streamLogs, log],
    }));
  },

  // Interview
  questions: [],
  setQuestions: (questions) => set({ questions }),
  currentQuestionIndex: 0,
  answers: new Map(),

  setAnswer: (questionId, answer) => {
    set((state) => {
      const newAnswers = new Map(state.answers);
      newAnswers.set(questionId, answer);
      return { answers: newAnswers };
    });
  },

  nextQuestion: () => {
    set((state) => ({
      currentQuestionIndex: Math.min(
        state.currentQuestionIndex + 1,
        state.questions.length - 1
      ),
    }));
  },

  prevQuestion: () => {
    set((state) => ({
      currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
    }));
  },

  skipQuestion: (questionId) => {
    const { questions, currentQuestionIndex } = get();
    if (questions.length > 1) {
      const newQuestions = questions.filter((q) => q.id !== questionId);
      set({
        questions: newQuestions,
        currentQuestionIndex: Math.min(currentQuestionIndex, newQuestions.length - 1),
      });
    }
  },

  // Result
  result: null,
  setResult: (result) => {
    set({ result });
  },

  // History
  history: [...mockHistory],

  addToHistory: (record) => {
    set((state) => ({
      history: [record, ...state.history],
    }));
  },

  rollbackToVersion: (sessionId, version) => {
    console.log(`Rolling back session ${sessionId} to version ${version}`);
  },

  // Confirm Dialog
  confirmDialog: {
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  },

  showConfirm: (title, message, onConfirm) => {
    set({
      confirmDialog: {
        isOpen: true,
        title,
        message,
        onConfirm,
      },
    });
  },

  hideConfirm: () => {
    set({
      confirmDialog: {
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
      },
    });
  },

  // Error
  error: {
    isOpen: false,
    title: '',
    message: '',
    type: 'unknown',
  },

  showError: (title, message, type) => {
    set({
      error: {
        isOpen: true,
        title,
        message,
        type,
      },
    });
  },

  hideError: () => {
    set({
      error: {
        isOpen: false,
        title: '',
        message: '',
        type: 'unknown',
      },
    });
  },

  // Reset
  resetSession: () => {
    set({
      currentSession: null,
      resumeContent: '',
      positionTitle: '',
      jobJDContent: '',
      isAnalyzing: false,
      agentSteps: [...initialAgentSteps],
      streamLogs: [],
      questions: [],
      currentQuestionIndex: 0,
      answers: new Map(),
      result: null,
      currentPage: 'home',
    });
  },
}));
