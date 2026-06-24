import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Check, Edit2 } from 'lucide-react';
import type { JobPosition } from '../../types';
import { useAppStore } from '../../store/appStore';

const DETECTED_JOBS = [
  '前端开发工程师',
  'React 开发工程师',
  '全栈开发工程师',
  'Vue 开发工程师',
  '前端Leader',
];

export function JobInput() {
  const [detectedJob, setDetectedJob] = useState<JobPosition | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const { resume, setJob, job } = useAppStore();
  const prevResumeId = useRef<string | null>(null);

  useEffect(() => {
    const resumeId = resume?.rawText ? `${resume.fileName ?? 'pasted'}-${resume.fileSize ?? 0}` : null;
    if (resumeId && resumeId !== prevResumeId.current && !job) {
      prevResumeId.current = resumeId;
      setIsDetecting(true);
      const t = setTimeout(() => {
        const detected = DETECTED_JOBS[0];
        const newJob: JobPosition = {
          title: detected,
          confidence: 94,
          isAutoDetected: true,
        };
        setDetectedJob(newJob);
        setJob(newJob);
        setIsDetecting(false);
      }, 1200);
      return () => clearTimeout(t);
    }
    if (!resume) {
      prevResumeId.current = null;
      setDetectedJob(null);
    }
  }, [resume, job, setJob]);

  const confirmJob = () => {
    if (detectedJob) {
      setJob(detectedJob);
      setIsEditing(false);
    }
  };

  const handleInputConfirm = () => {
    if (inputValue.trim()) {
      setJob({
        title: inputValue.trim(),
        confidence: 100,
        isAutoDetected: false,
      });
      setDetectedJob(null);
      setIsEditing(false);
    }
  };

  const selectSuggestion = (title: string) => {
    const newJob: JobPosition = {
      title,
      confidence: 95,
      isAutoDetected: true,
    };
    setDetectedJob(newJob);
    setJob(newJob);
    setInputValue('');
    setShowSuggestions(false);
    setIsEditing(false);
  };

  if (job && !isEditing) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-2 bg-accent-light rounded-lg border border-accent/20">
          <Check className="w-3.5 h-3.5 text-accent" />
          <span className="text-sm font-medium text-accent">{job.title}</span>
          {job.isAutoDetected && (
            <span className="text-xs text-accent/70">AI识别</span>
          )}
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="p-1.5 rounded-lg text-tertiary hover:text-secondary hover:bg-gray-100 transition-all duration-150 active:scale-95"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onKeyDown={(e) => e.key === 'Enter' && handleInputConfirm()}
            placeholder={isDetecting ? 'AI 正在识别岗位...' : '输入目标岗位名称...'}
            disabled={isDetecting}
            className="flex-1 px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent bg-surface placeholder:text-tertiary disabled:bg-gray-50 disabled:cursor-wait"
          />
          {inputValue && (
            <button
              onClick={handleInputConfirm}
              className="px-3 py-2 text-sm font-medium bg-accent text-white rounded-lg hover:bg-accent-hover transition-all duration-150 active:scale-[0.98]"
            >
              确认
            </button>
          )}
          {isDetecting && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-border border-t-accent rounded-full animate-spin" />
          )}
        </div>

        {showSuggestions && !isDetecting && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-xl shadow-lg py-1 z-10 animate-slide-up">
            <div className="px-3 py-1.5">
              <p className="text-xs font-medium text-tertiary uppercase tracking-wide">
                AI 推荐岗位
              </p>
            </div>
            {DETECTED_JOBS.map((title) => (
              <button
                key={title}
                onMouseDown={() => selectSuggestion(title)}
                className="w-full px-3 py-2 text-sm text-left text-primary hover:bg-gray-50 flex items-center gap-2 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                {title}
              </button>
            ))}
          </div>
        )}
      </div>

      {detectedJob && !isEditing && !isDetecting && (
        <div className="flex items-center gap-2 text-xs text-accent">
          <Check className="w-3 h-3" />
          <span>已识别：{detectedJob.title}（置信度 {detectedJob.confidence}%）</span>
        </div>
      )}
    </div>
  );
}