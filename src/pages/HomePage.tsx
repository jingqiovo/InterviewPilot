import React, { useState } from 'react';
import { Sparkles, Zap } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { UploadZone } from '../components/features/UploadZone';
import { JobInput } from '../components/features/JobInput';
import { JDInput } from '../components/features/JDInput';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function HomePage() {
  const { resume, job, jd, setPage } = useAppStore();
  const canStart = !!(resume && job);

  return (
    <div className="min-h-screen bg-bg pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-6">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent/5 rounded-full text-accent text-xs font-medium mb-5">
            <Zap className="w-3 h-3" />
            AI 简历分析
          </div>

          <h1 className="text-2xl font-bold text-primary tracking-tight mb-2">
            ResumePilot
          </h1>
          <p className="text-sm text-secondary">
            上传简历，AI 自动诊断问题、给出优化建议
          </p>
        </div>

        {/* Upload Card */}
        <Card padding="lg" className="mb-4">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                简历文件
              </label>
              <UploadZone />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                目标岗位
              </label>
              <JobInput />
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-2">
                <label className="block text-sm font-medium text-primary">
                  目标岗位 JD
                </label>
                <span className="text-[11px] text-tertiary">可选 · 增强分析</span>
              </div>
              <p className="text-[11px] text-tertiary mb-2.5">
                粘贴招聘描述后，AI 会根据岗位要求分析你的简历匹配度
              </p>
              <JDInput />
            </div>

            <Button
              variant="primary"
              size="lg"
              disabled={!canStart}
              onClick={() => canStart && setPage('analysis')}
              className="w-full"
            >
              <Sparkles className="w-4 h-4" />
              {jd ? '开始分析（含 JD）' : '开始分析'}
            </Button>

            {!canStart && (
              <p className="text-xs text-tertiary text-center -mt-1">
                {resume ? '选择目标岗位后即可开始' : '上传简历后即可开始'}
              </p>
            )}
          </div>
        </Card>

        {/* Feature hints */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: '智能诊断',
              desc: '定位简历问题',
              icon: (
                <svg className="w-4 h-4 text-accent" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M8 5V8.5L10 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              ),
            },
            {
              label: '精准匹配',
              desc: '对照岗位要求',
              icon: (
                <svg className="w-4 h-4 text-success" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8L6 12L14 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
            },
            {
              label: '版本管理',
              desc: '随时回退重试',
              icon: (
                <svg className="w-4 h-4 text-warning" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8a6 6 0 1 0 1.5-3.9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M2 4V8H6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
            },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="flex justify-center mb-1.5">{item.icon}</div>
              <p className="text-xs font-medium text-primary">{item.label}</p>
              <p className="text-[11px] text-tertiary">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
