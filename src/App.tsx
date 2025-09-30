import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { QuizProvider, useQuiz } from "@/contexts/QuizContext";
import { Header } from "@/components/layout/Header";
import { Dashboard } from "@/pages/Dashboard";
import { QuizScreen } from "@/components/QuizScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { currentQuestion } = useQuiz();
  
  return (
    <>
      <Header />
      {currentQuestion ? <QuizScreen /> : <Dashboard />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <QuizProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AppContent />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QuizProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;