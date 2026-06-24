import React, { useState, useRef, useCallback } from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

interface UploadZoneProps {
  onUploadSuccess?: (text: string, fileName?: string) => void;
  onUploadError?: (error: { type: 'upload_failed' | 'format_error' | 'parse_error'; message: string }) => void;
}

type UploadState = 'idle' | 'drag-over' | 'uploading' | 'success' | 'error';

const ALLOWED_TYPES = ['.pdf', '.doc', '.docx', '.txt'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const SAMPLE_TEXT = `张明 | 前端开发工程师
电话: 138-xxxx-xxxx | 邮箱: zhangming@email.com | 北京

个人简介
一年半前端开发经验，熟练掌握 React、Vue 技术栈，熟悉 Node.js 后端开发。

工作经历
前端开发工程师 - 字节跳动 (2023.07 - 至今)
- 负责公司内部管理系统前端开发
- 使用 Vue 完成多个功能模块
- 协助后端调试接口

前端开发实习生 - 腾讯 (2023.01 - 2023.06)
- 参与小程序开发
- 完成用户界面优化

项目经历
电商后台管理系统 (2023.08 - 2023.12)
- 使用 Vue3 + Element Plus 开发
- 实现了数据可视化功能

个人博客 (2022.09 - 2023.02)
- React + Next.js 全栈项目
- 使用 MongoDB 存储数据

教育背景
北京邮电大学 | 计算机科学与技术 | 本科 | 2019 - 2023 | GPA 3.5/4.0

技能证书
- HTML, CSS, JavaScript, TypeScript
- React, Vue, Vue3, Node.js
- Git, Webpack, Vite
- 英语六级 520 分`;

export function UploadZone({ onUploadSuccess, onUploadError }: UploadZoneProps) {
  const [state, setState] = useState<UploadState>('idle');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPaste, setShowPaste] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { setResume } = useAppStore();

  const simulateParse = (text: string, name?: string, size?: number) => {
    setState('uploading');
    setTimeout(() => {
      if (text.trim().length < 50) {
        setState('error');
        setErrorMsg('简历内容太短，无法识别其中的工作经历。你可以粘贴更完整的简历文本，或上传包含更多信息的文件。');
        onUploadError?.({ type: 'parse_error', message: '简历内容过短' });
        return;
      }
      setState('success');
      setFileName(name || '已粘贴简历.txt');
      setFileSize(size || text.length * 2);
      setResume({
        rawText: text,
        fileName: name || '已粘贴简历.txt',
        fileSize: size || text.length * 2,
        uploadTime: new Date(),
      });
      onUploadSuccess?.(text, name);
    }, 1200);
  };

  const handleFile = useCallback((file: File) => {
    setErrorMsg('');

    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_TYPES.includes(ext)) {
      setState('error');
      setErrorMsg('这个文件格式暂时无法解析，请上传 PDF、DOC、DOCX 或 TXT 格式的简历。');
      onUploadError?.({ type: 'format_error', message: `不支持 ${ext} 格式` });
      return;
    }

    if (file.size > MAX_SIZE) {
      setState('error');
      setErrorMsg('文件超过了 10MB 的限制。你可以压缩后重新上传，或直接粘贴简历文本继续。');
      onUploadError?.({ type: 'upload_failed', message: '文件过大' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text || text.trim().length < 50) {
        setState('error');
        setErrorMsg('无法从这份文件中提取到足够的文字。请尝试粘贴简历文本继续。');
        onUploadError?.({ type: 'parse_error', message: '无法读取文件内容' });
        return;
      }
      simulateParse(text, file.name, file.size);
    };
    reader.onerror = () => {
      setState('error');
      setErrorMsg('文件读取失败。请重新上传，或改为粘贴简历文本继续。');
      onUploadError?.({ type: 'upload_failed', message: '文件读取失败' });
    };
    reader.readAsText(file);
  }, [onUploadError]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setState('idle');
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState('drag-over');
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState('idle');
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handlePasteSubmit = () => {
    if (pasteText.trim()) {
      simulateParse(pasteText);
      setShowPaste(false);
    }
  };

  const handleReset = () => {
    setState('idle');
    setFileName('');
    setFileSize(0);
    setErrorMsg('');
    setPasteText('');
    setResume(null);
  };

  if (state === 'success') {
    return (
      <div className="border-2 border-success/30 bg-success/5 rounded-xl p-6 animate-fade-in">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-success" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-primary truncate">{fileName}</p>
            <p className="text-xs text-secondary mt-0.5">
              {(fileSize / 1024).toFixed(1)} KB · 上传成功
            </p>
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg text-tertiary hover:text-secondary hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => state !== 'uploading' && inputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-150
          ${state === 'drag-over'
            ? 'border-accent bg-accent-light'
            : state === 'error'
            ? 'border-error bg-error-light'
            : state === 'uploading'
            ? 'border-border bg-gray-50 cursor-wait'
            : 'border-border hover:border-border-hover hover:bg-gray-50'
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleInputChange}
        />

        {state === 'uploading' ? (
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
              <div className="w-6 h-6 border-2 border-border border-t-accent rounded-full animate-spin" />
            </div>
            <p className="text-sm text-secondary">正在读取简历内容...</p>
          </div>
        ) : state === 'error' ? (
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-error-light flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6 text-error" />
            </div>
            <div className="max-w-sm mx-auto">
              <p className="text-sm font-medium text-error mb-1">{errorMsg}</p>
              <p className="text-xs text-secondary">点击这里重新选择文件，或在下方直接粘贴文本</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto group-hover:bg-accent-light transition-colors">
              <Upload className="w-6 h-6 text-tertiary group-hover:text-accent transition-colors" />
            </div>
            <div>
              <p className="text-sm font-medium text-primary">
                拖拽简历文件到这里，或点击选择
              </p>
              <p className="text-xs text-secondary mt-1">
                支持 PDF、DOC、DOCX、TXT 格式，最大 10MB
              </p>
            </div>
          </div>
        )}
      </div>

      {!showPaste ? (
        <button
          onClick={() => setShowPaste(true)}
          className="text-xs text-secondary hover:text-accent transition-colors underline-offset-2 hover:underline"
        >
          或者粘贴简历文本
        </button>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden animate-slide-up">
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder="在此粘贴简历内容..."
            className="w-full h-48 p-4 text-sm text-primary placeholder:text-tertiary resize-none focus:outline-none bg-surface"
          />
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-border bg-gray-50">
            <p className="text-xs text-tertiary">
              粘贴后点击"确认使用"按钮
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => { setShowPaste(false); setPasteText(''); }}
                className="px-3 py-1.5 text-xs font-medium text-secondary hover:text-primary hover:bg-white rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handlePasteSubmit}
                disabled={!pasteText.trim()}
                className="px-3 py-1.5 text-xs font-medium bg-accent text-white rounded-lg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                确认使用
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
