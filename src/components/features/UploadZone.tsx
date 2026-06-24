import { useState, useCallback } from 'react';
import { FileText, Edit2, X } from 'lucide-react';

interface UploadZoneProps {
  onFileUpload: (content: string, fileName: string) => void;
  onTextPaste: (content: string) => void;
  value?: string;
  placeholder?: string;
}

export function UploadZone({ onFileUpload, onTextPaste, value = '', placeholder }: UploadZoneProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onFileUpload(event.target?.result as string, file.name);
      };
      reader.readAsText(file);
    }
  }, [onFileUpload]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onFileUpload(event.target?.result as string, file.name);
      };
      reader.readAsText(file);
    }
  }, [onFileUpload]);

  const handleClear = useCallback(() => {
    onTextPaste('');
    setIsEditing(false);
  }, [onTextPaste]);

  // Show content when there's value and not editing
  if (value && !isEditing) {
    return (
      <div className="p-4 bg-white border border-border rounded-xl">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center shrink-0">
            <FileText size={18} className="text-text-secondary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-primary text-sm">简历内容已导入</p>
            <p className="text-tiny text-text-tertiary mt-0.5">{value.length} 字符</p>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setIsEditing(true)}
              className="p-1.5 text-text-tertiary hover:text-primary hover:bg-muted rounded-md transition-colors"
            >
              <Edit2 size={14} />
            </button>
            <button 
              onClick={handleClear}
              className="p-1.5 text-text-tertiary hover:text-primary hover:bg-muted rounded-md transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Upload area
  return (
    <div
      className="border border-border rounded-xl p-6 bg-white"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </div>
        
        <div className="text-center">
          <p className="text-sm font-medium text-primary">拖拽文件到此处上传</p>
          <p className="text-tiny text-text-tertiary mt-0.5">支持 .txt, .md 文件</p>
        </div>

        <label className="relative cursor-pointer">
          <input type="file" className="sr-only" onChange={handleFileChange} accept=".txt,.md" />
          <span className="inline-flex items-center h-8 px-3 text-sm font-medium text-primary bg-muted hover:bg-gray-200 rounded-md transition-colors">
            选择文件
          </span>
        </label>

        <div className="w-full">
          <p className="text-center text-tiny text-text-tertiary mb-2">或粘贴简历内容</p>
          <textarea
            className="w-full h-20 px-3 py-2.5 text-sm bg-white border border-border rounded-lg resize-none focus:border-primary focus:outline-none placeholder:text-text-tertiary"
            placeholder={placeholder || '粘贴简历内容...'}
            value={value}
            onChange={(e) => onTextPaste(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
