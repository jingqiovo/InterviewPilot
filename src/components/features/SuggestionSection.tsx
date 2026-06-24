import { Card } from '@/components/ui/Card';
import { Suggestion } from '@/types';

interface SuggestionSectionProps {
  suggestions: Suggestion[];
}

export function SuggestionSection({ suggestions }: SuggestionSectionProps) {
  const highPriority = suggestions.filter(s => s.priority === 'high');
  const mediumPriority = suggestions.filter(s => s.priority === 'medium');

  return (
    <div className="space-y-4">
      {highPriority.length > 0 && (
        <div>
          <p className="text-tiny text-text-tertiary mb-2 uppercase tracking-wide">高优先级</p>
          <div className="space-y-2">
            {highPriority.map((suggestion) => (
              <Card key={suggestion.id} padding="md">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-muted rounded-md flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary">{suggestion.title}</p>
                    <p className="text-small text-text-secondary mt-0.5">{suggestion.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {mediumPriority.length > 0 && (
        <div>
          <p className="text-tiny text-text-tertiary mb-2 uppercase tracking-wide">中优先级</p>
          <div className="space-y-2">
            {mediumPriority.map((suggestion) => (
              <Card key={suggestion.id} padding="md">
                <p className="text-sm font-medium text-primary">{suggestion.title}</p>
                <p className="text-small text-text-secondary mt-0.5">{suggestion.description}</p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
