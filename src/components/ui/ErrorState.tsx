import React from 'react';
import { AlertTriangle, Upload, FileText, Clock, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';

interface ErrorStateProps {
  type: 'upload_failed' | 'format_error' | 'parse_error' | 'timeout' | 'dissatisfied' | 'unknown';
  title?: string;
  whatHappened?: string;
  whyHappened?: string;
  message?: string;
  onRetry?: () => void;
  onFallback?: () => void;
  fallbackLabel?: string;
}

const ERROR_CONFIG: Record<
  ErrorStateProps['type'],
  {
    defaultTitle: string;
    whatHappened: string;
    whyHappened: string;
    defaultFallback?: string;
  }
> = {
  upload_failed: {
    defaultTitle: '简历上传失败',
    whatHappened: '文件没有成功上传到服务器。',
    whyHappened: '通常是网络波动或文件较大导致的。你可以重新尝试上传，或改为直接粘贴简历文本继续。',
    defaultFallback: '改为粘贴简历文本',
  },
  format_error: {
    defaultTitle: '文件格式不支持',
    whatHappened: '当前文件格式无法被解析。',
    whyHappened: '目前支持 PDF、DOC、DOCX 和 TXT 格式。如果你的简历是图片或扫描件，建议复制其中文字后粘贴使用。',
    defaultFallback: '粘贴简历文本',
  },
  parse_error: {
    defaultTitle: '简历内容暂时无法识别',
    whatHappened: '我们没有成功提取出可分析的简历文本。',
    whyHappened: '可能是文件内容过短、扫描件缺少文字层，或文件存在加密保护。你可以重新上传一份更完整的简历，或直接粘贴简历文本继续分析。',
    defaultFallback: '手动粘贴简历文本',
  },
  timeout: {
    defaultTitle: 'AI 分析超时',
    whatHappened: '分析过程超过了预期时间，已经被中断。',
    whyHappened: '通常是当前请求量较高，或简历内容较长导致。你可以重新尝试一次，或稍等几分钟后再分析。',
    defaultFallback: undefined,
  },
  dissatisfied: {
    defaultTitle: '结果不太理想？',
    whatHappened: '当前结果可能没有完全命中你的预期。',
    whyHappened: 'AI 优化本身具有一定随机性。你可以选择重新生成一个版本，或直接编辑当前内容进行微调。',
    defaultFallback: '编辑当前结果',
  },
  unknown: {
    defaultTitle: '出现了意外情况',
    whatHappened: '页面遇到了一个暂时无法识别的问题。',
    whyHappened: '请稍后重试。如果问题持续存在，尝试刷新页面或返回上一步重新开始。',
    defaultFallback: undefined,
  },
};

export function ErrorState({
  type,
  title,
  whatHappened,
  whyHappened,
  message,
  onRetry,
  onFallback,
  fallbackLabel,
}: ErrorStateProps) {
  const config = ERROR_CONFIG[type];

  return (
    <Card className="max-w-md mx-auto animate-fade-in">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-error" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-primary mb-3">
            {title || config.defaultTitle}
          </h3>

          {!message && (
            <div className="space-y-2.5">
              <div>
                <p className="text-xs font-medium text-tertiary mb-0.5">发生了什么</p>
                <p className="text-sm text-secondary leading-relaxed">
                  {whatHappened || config.whatHappened}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-tertiary mb-0.5">为什么会这样</p>
                <p className="text-sm text-secondary leading-relaxed">
                  {whyHappened || config.whyHappened}
                </p>
              </div>
            </div>
          )}

          {message && (
            <p className="text-sm text-secondary leading-relaxed">
              {message}
            </p>
          )}
        </div>
      </div>

      {(onRetry || onFallback) && (
        <div className="flex flex-wrap gap-2 mt-5 ml-14">
          {onRetry && (
            <Button variant="primary" size="sm" onClick={onRetry}>
              重新尝试
            </Button>
          )}
          {onFallback && (
            <Button variant="secondary" size="sm" onClick={onFallback}>
              {fallbackLabel || config.defaultFallback}
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}

interface EmptyStateProps {
  icon?: 'upload' | 'file' | 'clock' | 'sparkles';
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon = 'file', title, description, action }: EmptyStateProps) {
  const icons = {
    upload: Upload,
    file: FileText,
    clock: Clock,
    sparkles: Sparkles,
  };
  const Icon = icons[icon];

  return (
    <div className="text-center py-16 px-6">
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
          <Icon className="w-7 h-7 text-tertiary" />
        </div>
      </div>
      <h3 className="text-base font-medium text-primary mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-secondary max-w-xs mx-auto">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}