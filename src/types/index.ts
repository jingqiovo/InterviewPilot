export interface Resume {
  id: string;
  name: string;
  content: string;
  fileName?: string;
  uploadedAt: Date;
}

export interface JobPosition {
  id: string;
  title: string;
  company?: string;
}

export interface JobJD {
  id: string;
  content: string;
  source?: string;
}

export interface AgentStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  log?: string;
  timestamp: Date;
}

export interface InterviewQuestion {
  id: string;
  number: number;
  question: string;
  type: 'behavioral' | 'technical' | 'situational';
  difficulty: 'easy' | 'medium' | 'hard';
  expectedPoints?: string[];
}

export interface InterviewAnswer {
  questionId: string;
  answer: string;
  submittedAt: Date;
}

export interface QuestionScore {
  questionId: string;
  score: number;
  feedback: string;
  highlights: string[];
  improvements: string[];
}

export interface InterviewResult {
  id: string;
  sessionId: string;
  overallScore: number;
  scores: {
    professional: number;
    communication: number;
    problemSolving: number;
  };
  matchRate: number;
  diagnoses: Diagnosis[];
  suggestions: Suggestion[];
  practiceAreas: string[];
  completedAt: Date;
}

export interface Diagnosis {
  id: string;
  type: 'strength' | 'weakness' | 'opportunity';
  title: string;
  description: string;
  examples: string[];
}

export interface Suggestion {
  id: string;
  category: 'answer' | 'delivery' | 'structure' | 'content';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface InterviewSession {
  id: string;
  resume: Resume;
  position: JobPosition;
  jobJD: JobJD;
  questions: InterviewQuestion[];
  answers: InterviewAnswer[];
  scores: QuestionScore[];
  currentQuestionIndex: number;
  status: 'preparing' | 'analyzing' | 'interviewing' | 'scoring' | 'completed' | 'failed';
  agentSteps: AgentStep[];
  streamLogs: string[];
  createdAt: Date;
  version: number;
}

export interface HistoryRecord {
  id: string;
  sessionId: string;
  position: JobPosition;
  overallScore: number;
  matchRate: number;
  questionsCount: number;
  completedAt: Date;
  version: number;
}

export type AppPage = 'home' | 'analysis' | 'interview' | 'result' | 'history';
