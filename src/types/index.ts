export interface ResumeData {
  rawText: string;
  fileName?: string;
  fileSize?: number;
  uploadTime?: Date;
}

export interface JobPosition {
  title: string;
  confidence: number;
  isAutoDetected: boolean;
}

export interface JDData {
  rawText: string;
  fileName?: string;
  uploadTime?: Date;
}

export interface GapItem {
  category: 'matched' | 'gap' | 'enhance';
  text: string;
}

export interface GapAnalysis {
  matched: GapItem[];
  gaps: GapItem[];
  enhancements: GapItem[];
}

export type AgentStepStatus = 'pending' | 'active' | 'done' | 'error';

export interface AgentStep {
  id: string;
  label: string;
  status: AgentStepStatus;
  timestamp?: string;
  streamMessages?: StreamMessage[];
}

export interface StreamMessage {
  id: string;
  text: string;
  timestamp: string;
  type: 'info' | 'thinking' | 'success' | 'error';
}

export type ProblemSeverity = 'high' | 'medium' | 'low';

export interface Problem {
  id: string;
  title: string;
  description: string;
  severity: ProblemSeverity;
  section: string;
  currentText?: string;
  suggestedFix?: string;
}

export interface Recommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  priority: number;
  completed: boolean;
}

export interface ResumeSection {
  type: 'header' | 'summary' | 'experience' | 'education' | 'skills' | 'projects';
  title: string;
  content: string;
  modified: boolean;
}

export interface ResumeScore {
  total: number;
  breakdown: {
    content: number;
    structure: number;
    keywords: number;
    impact: number;
  };
  industryAverage: number;
}

export interface MatchAnalysis {
  overall: number;
  skills: number;
  projects: number;
  experience: number;
  matched: string[];
  missing: string[];
  keywords: {
    found: string[];
    missing: string[];
  };
  explanation?: string;
}

export interface ResumeVersion {
  version: string;
  timestamp: string;
  score: number;
  summary: string;
  sections: ResumeSection[];
}

export interface AnalysisResult {
  id: string;
  resume: ResumeData;
  job: JobPosition;
  jd?: JDData | null;
  hasJD: boolean;
  score: ResumeScore;
  match: MatchAnalysis;
  gap: GapAnalysis;
  problems: Problem[];
  recommendations: Recommendation[];
  versions: ResumeVersion[];
  currentVersion: string;
  agentSteps: AgentStep[];
  createdAt: string;
}

export interface HistoryRecord {
  id: string;
  jobTitle: string;
  hasJD: boolean;
  matchPercent?: number;
  score: number;
  createdAt: string;
  versionCount: number;
  resumeSnippet: string;
  result: AnalysisResult;
}

export type AppPage = 'home' | 'analysis' | 'result' | 'history';

export interface AppState {
  currentPage: AppPage;
  resume: ResumeData | null;
  job: JobPosition | null;
  jd: JDData | null;
  analysisResult: AnalysisResult | null;
  history: HistoryRecord[];
  error: AppError | null;
}

export interface AppError {
  type: 'upload_failed' | 'format_error' | 'parse_error' | 'timeout' | 'dissatisfied' | 'unknown';
  title: string;
  message: string;
  recoverable: boolean;
  recoverableAction?: string;
  fallbackAction?: string;
}
