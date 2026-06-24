import { create } from 'zustand';
import type {
  AppPage,
  ResumeData,
  JobPosition,
  JDData,
  AnalysisResult,
  HistoryRecord,
} from '../types';
import { createMockAnalysisResult, createMockHistoryRecord } from '../data/mockData';

interface AppStore {
  currentPage: AppPage;
  resume: ResumeData | null;
  job: JobPosition | null;
  jd: JDData | null;
  analysisResult: AnalysisResult | null;
  history: HistoryRecord[];
  setPage: (page: AppPage) => void;
  setResume: (resume: ResumeData | null) => void;
  setJob: (job: JobPosition | null) => void;
  setJD: (jd: JDData | null) => void;
  setAnalysisResult: (result: AnalysisResult) => void;
  regenerateVersion: () => void;
  restoreVersion: (version: string) => void;
  deleteHistoryRecord: (id: string) => void;
  restoreHistoryRecord: (id: string) => void;
  reset: () => void;
}

const initialState = {
  currentPage: 'home' as AppPage,
  resume: null,
  job: null,
  jd: null,
  analysisResult: null,
  history: createMockHistoryRecord(),
};

export const useAppStore = create<AppStore>((set, get) => ({
  ...initialState,

  setPage: (page) => set({ currentPage: page }),

  setResume: (resume) => set({ resume }),

  setJob: (job) => set({ job }),

  setJD: (jd) => set({ jd }),

  setAnalysisResult: (result) => {
    const { history } = get();
    const record: HistoryRecord = {
      id: 'h-' + Date.now(),
      jobTitle: result.job.title,
      hasJD: result.hasJD,
      matchPercent: result.match.overall,
      score: result.score.total,
      createdAt: new Date().toISOString(),
      versionCount: result.versions.length,
      resumeSnippet:
        (result.resume.fileName ||
          result.resume.rawText.slice(0, 30) ||
          '简历') + ' · ' + result.job.title,
      result,
    };
    set({
      analysisResult: result,
      history: [record, ...history],
      currentPage: 'result',
    });
  },

  regenerateVersion: () => {
    const { analysisResult, resume, job, jd } = get();
    if (!analysisResult) return;

    const currentVersions = analysisResult.versions;
    const nextLetter = String.fromCharCode(65 + currentVersions.length);
    const newVersion = `V${nextLetter}`;
    const newVersionCount = currentVersions.length + 1;
    const fresh = createMockAnalysisResult(
      resume || undefined,
      job || undefined,
      jd || undefined
    );
    const freshVer = fresh.versions[fresh.versions.length - 1];

    const updatedResult: AnalysisResult = {
      ...analysisResult,
      versions: [
        ...currentVersions,
        {
          version: newVersion,
          timestamp: new Date().toISOString(),
          score: fresh.score.total,
          summary: `第 ${newVersionCount} 轮优化`,
          sections: freshVer.sections,
        },
      ],
      currentVersion: newVersion,
      score: { ...analysisResult.score, total: fresh.score.total },
      recommendations: fresh.recommendations,
    };

    const { history } = get();
    const updatedHistory = history.map((r) =>
      r.result.id === analysisResult.id
        ? { ...r, result: updatedResult, score: updatedResult.score.total, versionCount: newVersionCount }
        : r
    );

    set({ analysisResult: updatedResult, history: updatedHistory });
  },

  restoreVersion: (version) => {
    const { analysisResult } = get();
    if (!analysisResult) return;
    set({ analysisResult: { ...analysisResult, currentVersion: version } });
  },

  deleteHistoryRecord: (id) =>
    set((state) => ({ history: state.history.filter((r) => r.id !== id) })),

  restoreHistoryRecord: (id) => {
    const { history } = get();
    const record = history.find((r) => r.id === id);
    if (record) {
      set({ analysisResult: record.result, currentPage: 'result' });
    }
  },

  reset: () => set(initialState),
}));
