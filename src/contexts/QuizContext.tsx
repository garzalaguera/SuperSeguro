import React, { createContext, useContext, useState, useEffect } from 'react';

interface Question {
  module: string;
  subtopic: string;
  difficulty: string;
  question: string;
  options: string[];
  correct: number;
}

interface QuizStats {
  correctAnswers: number;
  totalAnswers: number;
  streak: number;
  maxStreak: number;
}

interface ModuleProgress {
  lastScore?: number;
  avgScore?: number;
  totalQuestions: number;
  history: number[];
}

interface QuizContextType {
  currentModule: string | null;
  currentQuestion: Question | null;
  questionIndex: number;
  totalQuestions: number;
  stats: QuizStats;
  moduleProgress: Record<string, ModuleProgress>;
  selectedAnswer: number | null;
  showResult: boolean;
  isCorrect: boolean;
  questions: Question[];
  
  startQuiz: (moduleName: string, questionCount: number) => void;
  selectAnswer: (index: number) => void;
  nextQuestion: () => void;
  endQuiz: () => void;
  resetQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentModule, setCurrentModule] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [stats, setStats] = useState<QuizStats>({
    correctAnswers: 0,
    totalAnswers: 0,
    streak: 0,
    maxStreak: 0,
  });
  const [moduleProgress, setModuleProgress] = useState<Record<string, ModuleProgress>>(() => {
    const saved = localStorage.getItem('moduleProgress');
    return saved ? JSON.parse(saved) : {};
  });
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    localStorage.setItem('moduleProgress', JSON.stringify(moduleProgress));
  }, [moduleProgress]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startQuiz = async (moduleName: string, questionCount: number) => {
    try {
      const response = await fetch('/src/data/questions_all.json');
      const allQuestions: Question[] = await response.json();
      
      const moduleQuestions = allQuestions.filter(q => q.module === moduleName);
      const shuffled = shuffleArray(moduleQuestions).slice(0, questionCount);
      
      setQuestions(shuffled);
      setCurrentModule(moduleName);
      setQuestionIndex(0);
      setStats({
        correctAnswers: 0,
        totalAnswers: 0,
        streak: 0,
        maxStreak: 0,
      });
      setSelectedAnswer(null);
      setShowResult(false);
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  const selectAnswer = (index: number) => {
    if (showResult) return;
    
    setSelectedAnswer(index);
    setShowResult(true);
    
    const correct = index === questions[questionIndex].correct;
    setIsCorrect(correct);
    
    setStats(prev => ({
      correctAnswers: correct ? prev.correctAnswers + 1 : prev.correctAnswers,
      totalAnswers: prev.totalAnswers + 1,
      streak: correct ? prev.streak + 1 : 0,
      maxStreak: correct ? Math.max(prev.streak + 1, prev.maxStreak) : prev.maxStreak,
    }));
  };

  const nextQuestion = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(false);
    } else {
      endQuiz();
    }
  };

  const endQuiz = () => {
    if (!currentModule) return;
    
    const score = Math.round((stats.correctAnswers / stats.totalAnswers) * 100);
    
    setModuleProgress(prev => {
      const moduleData = prev[currentModule] || { totalQuestions: 0, history: [] };
      const newHistory = [...moduleData.history, score].slice(-10); // Keep last 10 scores
      
      return {
        ...prev,
        [currentModule]: {
          lastScore: score,
          avgScore: Math.round(newHistory.reduce((a, b) => a + b, 0) / newHistory.length),
          totalQuestions: moduleData.totalQuestions + stats.totalAnswers,
          history: newHistory,
        },
      };
    });
  };

  const resetQuiz = () => {
    setCurrentModule(null);
    setQuestions([]);
    setQuestionIndex(0);
    setStats({
      correctAnswers: 0,
      totalAnswers: 0,
      streak: 0,
      maxStreak: 0,
    });
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
  };

  const currentQuestion = questions[questionIndex] || null;

  return (
    <QuizContext.Provider
      value={{
        currentModule,
        currentQuestion,
        questionIndex,
        totalQuestions: questions.length,
        stats,
        moduleProgress,
        selectedAnswer,
        showResult,
        isCorrect,
        questions,
        startQuiz,
        selectAnswer,
        nextQuestion,
        endQuiz,
        resetQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within QuizProvider');
  }
  return context;
};