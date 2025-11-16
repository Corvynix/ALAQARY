import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle, AlertTriangle, FileText, Star } from 'lucide-react';
import type { Developer } from '@shared/schema';

interface TrustScoreIndicatorProps {
  developer: Developer;
  showBreakdown?: boolean;
}

export function TrustScoreIndicator({ developer, showBreakdown = false }: TrustScoreIndicatorProps) {
  const { t } = useLanguage();
  const score = developer.trustScore || 0;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-chart-2';
    if (score >= 60) return 'text-chart-4';
    return 'text-muted-foreground';
  };
  
  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-chart-2';
    if (score >= 60) return 'bg-chart-4';
    return 'bg-muted';
  };

  const completionRate = developer.totalContracts > 0 
    ? (developer.completedContracts / developer.totalContracts) * 100 
    : 0;

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center justify-between gap-4">
          <span>{t('trustScoreTitle')}</span>
          <span className={`text-4xl font-bold ${getScoreColor(score)}`} data-testid="text-trust-score">
            {Math.round(score)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Progress 
            value={score} 
            className="h-2"
            data-testid="progress-trust-score"
          />
        </div>
        
        {showBreakdown && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileText className="w-4 h-4" />
                <span>{t('contracts')}</span>
              </div>
              <span className="font-medium" data-testid="text-contracts">
                {developer.totalContracts}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="w-4 h-4" />
                <span>{t('completed')}</span>
              </div>
              <span className="font-medium" data-testid="text-completion-rate">
                {Math.round(completionRate)}%
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <AlertTriangle className="w-4 h-4" />
                <span>{t('complaints')}</span>
              </div>
              <span className="font-medium" data-testid="text-complaints">
                {developer.complaints}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Star className="w-4 h-4" />
                <span>{t('rating')}</span>
              </div>
              <span className="font-medium" data-testid="text-rating">
                {developer.averageRating.toFixed(1)} / 5.0
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
