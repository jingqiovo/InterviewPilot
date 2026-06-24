import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  type: 'upload' | 'parse' | 'analysis' | 'timeout' | 'unknown';
  title?: string;
  message?: string;
  onRetry?: () => void;
}

const errorConfig = {
  upload: { title: '上传失败', message: '简历上传过程中出现问题，请检查文件格式后重试。' },
  parse: { title: '解析失败', message: '无法解析简历内容，请确保简历为文本格式或 PDF 格式。' },
  analysis: { title: '分析失败', message: 'AI 分析过程中出现错误，请稍后重试。' },
  timeout: { title: '请求超时', message: '网络请求超时，请检查网络连接后重试。' },
  unknown: { title: '未知错误', message: '发生未知错误，请刷新页面后重试。' },
};

export function ErrorState({ type, title, message, onRetry }: ErrorStateProps) {
  const config = errorConfig[type];

  return (
    <div className="p-6 bg-white border border-border rounded-xl">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
          <AlertTriangle size={18} className="text-error" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-primary">{title || config.title}</h3>
          <p className="text-small text-text-secondary mt-1">{message || config.message}</p>
          {onRetry && (
            <Button variant="secondary" size="sm" onClick={onRetry} className="mt-4">
              重试
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
