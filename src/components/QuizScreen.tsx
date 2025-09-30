import React from 'react';
import { ChevronRight, X, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useQuiz } from '@/contexts/QuizContext';
import { cn } from '@/lib/utils';

export const QuizScreen: React.FC = () => {
  const {
    currentQuestion,
    questionIndex,
    totalQuestions,
    stats,
    selectedAnswer,
    showResult,
    isCorrect,
    selectAnswer,
    nextQuestion,
    resetQuiz,
  } = useQuiz();

  if (!currentQuestion) return null;

  const progress = ((questionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Pregunta {questionIndex + 1} de {totalQuestions}
            </span>
            <span className="font-medium text-primary">
              {stats.correctAnswers}/{stats.totalAnswers} correctas
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="p-8 animate-fade-in">
          <div className="space-y-6">
            {/* Question Header */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{currentQuestion.module}</Badge>
              <Badge variant="secondary">{currentQuestion.subtopic}</Badge>
              <Badge 
                variant={currentQuestion.difficulty === 'Básico' ? 'default' : 'destructive'}
                className="bg-gradient-to-r"
              >
                {currentQuestion.difficulty}
              </Badge>
            </div>

            {/* Question */}
            <h2 className="text-2xl font-semibold">
              {currentQuestion.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrectOption = index === currentQuestion.correct;
                const showCorrect = showResult && isCorrectOption;
                const showIncorrect = showResult && isSelected && !isCorrectOption;

                return (
                  <button
                    key={index}
                    onClick={() => selectAnswer(index)}
                    disabled={showResult}
                    className={cn(
                      "w-full text-left p-4 rounded-lg border-2 transition-all duration-200",
                      "hover:border-primary/50 hover:bg-muted/50",
                      isSelected && !showResult && "border-primary bg-primary/10",
                      showCorrect && "border-success bg-success-light/20",
                      showIncorrect && "border-destructive bg-destructive/10",
                      !showResult && !isSelected && "border-border"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option}</span>
                      {showCorrect && <Check className="h-5 w-5 text-success" />}
                      {showIncorrect && <X className="h-5 w-5 text-destructive" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Result Feedback */}
            {showResult && (
              <div
                className={cn(
                  "p-4 rounded-lg border animate-scale-in",
                  isCorrect
                    ? "bg-success-light/10 border-success/20 text-success"
                    : "bg-destructive/10 border-destructive/20 text-destructive"
                )}
              >
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <>
                      <Check className="h-5 w-5" />
                      <span className="font-medium">¡Correcto!</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5" />
                      <span className="font-medium">Incorrecto</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={resetQuiz}
            className="group"
          >
            <X className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" />
            Salir
          </Button>
          {showResult && (
            <Button
              onClick={nextQuestion}
              className="flex-1 group"
            >
              {questionIndex === totalQuestions - 1 ? 'Ver resultados' : 'Siguiente'}
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};