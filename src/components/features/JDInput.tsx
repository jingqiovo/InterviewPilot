import React, { useState, useRef, useCallback } from 'react';
import { FileText, X, ChevronDown, Upload, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const SAMPLE_JD = `【岗位职责】
1. 负责公司核心产品的前端架构设计与开发，使用 React + TypeScript 构建高质量的中后台系统
2. 与产品、后端协作完成接口联调，推动需求按时上线
3. 持续优化页面性能，关注 Core Web Vitals 指标，提升用户体验
4. 抽象通用组件，建立组件库体系，提升团队整体开发效率

【任职要求】
1. 本科及以上学历，计算机相关专业，1 年以上前端开发经验
2. 精通 React / Vue 等主流前端框架，熟悉 TypeScript
3. 具备良好的组件化设计能力，能独立封装通用组件
4. 有性能优化经验，理解加载策略、缓存机制与代码分割
5. 良好的沟通协作能力，能与产品、设计、后端顺畅合作`;

export function JDInput() {
  const { jd, setJD } = useAppStore();
  const [expanded, setExpanded] = useState(!!jd);
  const [text, setText] = useState(jd?.rawText || '');
  const [fileName, setFileName] = useState(jd?.fileName || '');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleConfirm = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      setJD(null);
      return;
    }
    setJD({
      rawText: trimmed,
      fileName: fileName || undefined,
      uploadTime: new Date(),
    });
  }, [text, fileName, setJD]);

  const handleClear = () => {
    setText('');
    setFileName('');
    setJD(null);
    setExpanded(false);
  };

  const handleFile = (file: File) => {
    if (file.size > MAX_SIZE) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = (e.target?.result as string) || '';
      setText(content);
      setFileName(file.name);
    };
    reader.readAsText(file);
  };

  // 折叠态：只显示一个低调的入口按钮
  if (!expanded && !jd) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="w-full flex items-center justify-between p-3 rounded-lg border border-dashed border-border hover:border-border-hover hover:bg-gray-50 transition-all duration-150 group"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-gray-100 group-hover:bg-accent-light flex items-center justify-center transition-colors">
            <Sparkles className="w-3.5 h-3.5 text-tertiary group-hover:text-accent transition-colors" />
          </div>
          <div className="text-left">
            <p className="text-xs font-medium text-primary">添加目标岗位 JD（可选）</p>
            <p className="text-[11px] text-tertiary mt-0.5">粘贴 JD 后，分析会更有针对性</p>
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-tertiary" />
      </button>
    );
  }

  // 已填写态
  if (jd && !expanded) {
    return (
      <div className="border border-accent/30 bg-accent/5 rounded-lg p-3 flex items-center gap-3">
        <div className="w-7 h-7 rounded-md bg-accent/10 flex items-center justify-center flex-shrink-0">
          <FileText className="w-3.5 h-3.5 text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-medium text-primary">已添加岗位 JD</p>
            <span className="text-[10px] font-medium text-accent bg-accent-light px-1.5 py-0.5 rounded">
              增强分析
            </span>
          </div>
          <p className="text-[11px] text-secondary mt-0.5 truncate">
            {jd.fileName || `已粘贴 ${jd.rawText.length} 字 JD`}
          </p>
        </div>
        <button
          onClick={() => setExpanded(true)}
          className="text-[11px] text-secondary hover:text-accent transition-colors"
        >
          编辑
        </button>
        <button
          onClick={handleClear}
          className="p-1 rounded text-tertiary hover:text-error hover:bg-error-light transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // 展开态：粘贴 textarea + 上传入口
  return (
    <div className="border border-border rounded-lg overflow-hidden animate-slide-up">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="在此粘贴目标岗位的招聘描述（JD）..."
        className="w-full h-32 p-3 text-xs text-primary placeholder:text-tertiary resize-none focus:outline-none bg-surface leading-relaxed"
      />
      <div className="flex items-center justify-between px-3 py-2 border-t border-border bg-gray-50">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
          <button
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-1 px-2 py-1 text-[11px] text-secondary hover:text-primary hover:bg-white rounded transition-colors"
          >
            <Upload className="w-3 h-3" />
            上传 JD 文件
          </button>
          <button
            onClick={() => {
              setText(SAMPLE_JD);
              setFileName('示例 JD.txt');
            }}
            className="text-[11px] text-tertiary hover:text-secondary transition-colors"
          >
            填入示例
          </button>
          {fileName && (
            <span className="text-[11px] text-tertiary truncate max-w-[120px]">
              · {fileName}
            </span>
          )}
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={handleClear}
            className="px-2.5 py-1 text-[11px] font-medium text-secondary hover:text-primary hover:bg-white rounded transition-colors"
          >
            清除
          </button>
          <button
            onClick={handleConfirm}
            disabled={!text.trim()}
            className="px-2.5 py-1 text-[11px] font-medium bg-accent text-white rounded hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            使用该 JD
          </button>
        </div>
      </div>
    </div>
  );
}
