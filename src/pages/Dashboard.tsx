import React, { useState, useEffect } from 'react';
import { ModuleCard } from '@/components/ModuleCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useQuiz } from '@/contexts/QuizContext';

interface Module {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  icon: any;
  color: string;
}

export const Dashboard: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [questionCount, setQuestionCount] = useState(20);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { startQuiz } = useQuiz();

  useEffect(() => {
    // Load modules
    fetch('/src/data/questions_index.json')
      .then(res => res.json())
      .then(data => setModules(data.modules))
      .catch(console.error);
  }, []);

  const handleStartQuiz = (moduleName: string) => {
    startQuiz(moduleName, questionCount);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Elige tu módulo de aprendizaje
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Practica con preguntas aleatorias y mide tu progreso en cada área del conocimiento de seguros
          </p>
        </div>

        {/* Settings */}
        <div className="flex flex-wrap items-center justify-center gap-6 p-6 rounded-xl bg-card border">
          <div className="flex items-center gap-3">
            <Label htmlFor="questions">Número de preguntas:</Label>
            <Input
              id="questions"
              type="number"
              min="5"
              max="50"
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-20"
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="sound"
              checked={soundEnabled}
              onCheckedChange={(checked) => setSoundEnabled(checked as boolean)}
            />
            <Label htmlFor="sound">Sonido habilitado</Label>
          </div>
        </div>

        {/* Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              onStart={() => handleStartQuiz(module.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};