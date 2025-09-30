import React from 'react';
import { Moon, Sun, Brain, Trophy, Settings } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { useQuiz } from '@/contexts/QuizContext';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { stats } = useQuiz();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Brain className="h-7 w-7 text-primary" />
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              DuoSeguros
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Streak Counter */}
          {stats.streak > 0 && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success-light/10 border border-success/20">
              <Trophy className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-success">
                Racha: {stats.streak}
              </span>
            </div>
          )}

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity" />
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 transition-transform group-hover:rotate-45" />
            ) : (
              <Moon className="h-5 w-5 transition-transform group-hover:-rotate-12" />
            )}
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="icon" className="group">
            <Settings className="h-5 w-5 transition-transform group-hover:rotate-90" />
          </Button>
        </div>
      </div>
    </header>
  );
};