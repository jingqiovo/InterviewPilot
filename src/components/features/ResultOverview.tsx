import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';

interface ResultOverviewProps {
  result: {
    overallScore: number;
    scores: {
      professional: number;
      communication: number;
      problemSolving: number;
    };
    matchRate: number;
  };
}

export function ResultOverview({ result }: ResultOverviewProps) {
  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* 总分卡片 */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">综合评分</p>
              <div className={cn('text-6xl font-bold', scoreColor(result.overallScore))}>
                {result.overallScore}
                <span className="text-2xl text-muted-foreground">分</span>
              </div>
            </div>
            <Progress value={result.overallScore} className="h-2" />
            <p className="text-sm text-muted-foreground">
              与目标岗位匹配度 {result.matchRate}%
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 分项评分 */}
      <div className="grid grid-cols-3 gap-4">
        <ScoreCard 
          title="专业能力" 
          score={result.scores.professional}
          color="blue"
        />
        <ScoreCard 
          title="沟通表达" 
          score={result.scores.communication}
          color="purple"
        />
        <ScoreCard 
          title="问题解决" 
          score={result.scores.problemSolving}
          color="green"
        />
      </div>
    </div>
  );
}

interface ScoreCardProps {
  title: string;
  score: number;
  color: 'blue' | 'purple' | 'green';
}

function ScoreCard({ title, score, color }: ScoreCardProps) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    green: 'bg-green-50 text-green-600 border-green-100',
  };

  return (
    <Card className={cn('border', colors[color])}>
      <CardContent className="pt-4">
        <div className="text-center space-y-2">
          <p className="text-xs font-medium opacity-70">{title}</p>
          <p className="text-3xl font-bold">{score}</p>
        </div>
      </CardContent>
    </Card>
  );
}
