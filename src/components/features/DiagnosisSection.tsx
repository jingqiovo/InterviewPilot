import { Badge } from '@/components/ui/Badge';
import { Diagnosis } from '@/types';

interface DiagnosisSectionProps {
  diagnoses: Diagnosis[];
}

export function DiagnosisSection({ diagnoses }: DiagnosisSectionProps) {
  return (
    <div className="space-y-4">
      {diagnoses.map((diagnosis) => (
        <div key={diagnosis.id} className="p-4 bg-white border border-border rounded-xl">
          <div className="flex items-start gap-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              diagnosis.type === 'strength' ? 'bg-green-50' :
              diagnosis.type === 'weakness' ? 'bg-amber-50' : 'bg-blue-50'
            }`}>
              {diagnosis.type === 'strength' ? (
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : diagnosis.type === 'weakness' ? (
                <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-medium text-primary">{diagnosis.title}</h3>
                <Badge variant={
                  diagnosis.type === 'strength' ? 'success' :
                  diagnosis.type === 'weakness' ? 'warning' : 'default'
                }>
                  {diagnosis.type === 'strength' ? '优势' :
                   diagnosis.type === 'weakness' ? '待改进' : '机会点'}
                </Badge>
              </div>
              <p className="text-small text-text-secondary">{diagnosis.description}</p>
              {diagnosis.examples.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {diagnosis.examples.map((example, i) => (
                    <li key={i} className="text-tiny text-text-tertiary flex items-start gap-1.5">
                      <span>•</span>
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
