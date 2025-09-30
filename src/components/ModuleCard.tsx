import React from 'react';
import { Shield, User, Car, TrendingUp, ArrowRight, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useQuiz } from '@/contexts/QuizContext';

const iconMap = {
  Shield,
  User,
  Car,
  TrendingUp,
};

interface ModuleCardProps {
  module: {
    id: string;
    name: string;
    description: string;
    questionCount: number;
    icon: keyof typeof iconMap;
    color: string;
  };
  onStart: () => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ module, onStart }) => {
  const { moduleProgress } = useQuiz();
  const progress = moduleProgress[module.name];
  const Icon = iconMap[module.icon];

  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card hover:bg-card-hover transition-all duration-300 hover:shadow-lg hover:border-primary/30">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-primary/10 text-primary`}>
            <Icon className="h-6 w-6" />
          </div>
          {progress?.lastScore !== undefined && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Última</p>
              <p className="text-lg font-bold text-primary">{progress.lastScore}%</p>
            </div>
          )}
        </div>

        <h3 className="text-lg font-semibold mb-2">{module.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{module.description}</p>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Target className="h-4 w-4" />
          <span>{module.questionCount} preguntas disponibles</span>
        </div>

        {progress?.avgScore !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Promedio</span>
              <span className="font-medium">{progress.avgScore}%</span>
            </div>
            <Progress value={progress.avgScore} className="h-2" />
          </div>
        )}

        <Button 
          onClick={onStart}
          className="w-full group/btn relative overflow-hidden"
          variant="default"
        >
          <span className="relative z-10">Comenzar</span>
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </div>
    </Card>
  );
};