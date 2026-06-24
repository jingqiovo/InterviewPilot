import React, { useState } from 'react';
import { Card, CardHeader } from '../ui/Card';
import { Edit3, Check, X, Sparkles } from 'lucide-react';
import type { ResumeSection } from '../../types';

interface ResumeEditorProps {
  sections: ResumeSection[];
  onChange?: (sections: ResumeSection[]) => void;
  readOnly?: boolean;
}

export function ResumeEditor({ sections, onChange, readOnly = false }: ResumeEditorProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  const startEdit = (index: number, content: string) => {
    setEditingIndex(index);
    setEditContent(content);
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    const updated = sections.map((s, i) =>
      i === editingIndex
        ? { ...s, content: editContent, modified: s.content !== editContent }
        : s
    );
    onChange?.(updated);
    setEditingIndex(null);
    setEditContent('');
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditContent('');
  };

  const typeLabels: Record<ResumeSection['type'], string> = {
    header: '个人信息',
    summary: '个人简介',
    experience: '工作经历',
    education: '教育背景',
    skills: '技能证书',
    projects: '项目经历',
  };

  return (
    <Card className="animate-fade-in" style={{ animationDelay: '200ms' }}>
      <CardHeader
        title="优化后简历"
        subtitle="基于原始简历和 AI 分析生成，支持手动编辑"
        action={
          !readOnly && (
            <span className="text-xs text-tertiary flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI 优化版本
            </span>
          )
        }
      />

      <div className="space-y-4">
        {sections.map((section, index) => (
          <div key={section.type} className="group">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-tertiary uppercase tracking-wide">
                {typeLabels[section.type]}
              </span>
              {section.modified && (
                <span className="text-xs text-accent bg-accent-light px-1.5 py-0.5 rounded">
                  已优化
                </span>
              )}
              {!readOnly && editingIndex !== index && (
                <button
                  onClick={() => startEdit(index, section.content)}
                  className="ml-auto opacity-0 group-hover:opacity-100 p-1 rounded text-tertiary hover:text-secondary hover:bg-gray-100 transition-all"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              )}
            </div>

            {editingIndex === index ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full h-48 p-3 text-sm border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none bg-surface font-mono leading-relaxed"
                  autoFocus
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-secondary hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-3 h-3" />
                    取消
                  </button>
                  <button
                    onClick={saveEdit}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
                  >
                    <Check className="w-3 h-3" />
                    保存修改
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`p-3 rounded-lg border text-sm leading-relaxed whitespace-pre-wrap ${
                  section.modified
                    ? 'border-accent/20 bg-accent-light/30'
                    : 'border-border bg-gray-50'
                } ${readOnly ? '' : 'cursor-pointer hover:border-border-hover transition-colors'}`}
                onClick={() => !readOnly && startEdit(index, section.content)}
              >
                <pre className="font-sans text-primary overflow-x-auto whitespace-pre-wrap break-words">
                  {section.content}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
