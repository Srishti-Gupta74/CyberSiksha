"use client";

import { useState, useEffect } from 'react';
import { ShieldQuestion, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import quizzesData from '@/data/quizzes.json';
import { updateQuizScore, addXP } from '@/lib/progress';
import confetti from 'canvas-confetti';

export default function QuizPage() {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // Randomize quizzes on load
  const [shuffledQuizzes, setShuffledQuizzes] = useState([]);
  
  useEffect(() => {
    setShuffledQuizzes([...quizzesData].sort(() => Math.random() - 0.5));
  }, []);

  if (shuffledQuizzes.length === 0) return <div className="p-8 text-center animate-pulse">Loading Scenarios...</div>;

  const currentQuiz = shuffledQuizzes[currentQuizIndex];

  const handleAnswer = (idx) => {
    if (hasAnswered) return;
    
    setSelectedOption(idx);
    setHasAnswered(true);
    
    const isCorrect = idx === currentQuiz.correctIndex;
    updateQuizScore(currentQuiz.id, isCorrect);
    
    if (isCorrect) {
      setScore(s => s + 1);
      addXP(10);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#A4F6F9', '#10B981']
      });
    }
  };

  const nextQuestion = () => {
    if (currentQuizIndex < shuffledQuizzes.length - 1) {
      setCurrentQuizIndex(i => i + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      setIsGameOver(true);
    }
  };

  if (isGameOver) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in text-center py-12">
        <ShieldQuestion size={64} className="mx-auto text-cyan mb-4" />
        <h1 className="text-4xl font-bold mb-2">Quiz Complete!</h1>
        <p className="text-xl text-slate-300 mb-8">
          You scored <span className="text-cyan font-bold">{score}</span> out of {shuffledQuizzes.length}
        </p>
        
        <div className="glass-card p-6 border-cyan/30 mb-8">
          <p className="text-lg">
            {score === shuffledQuizzes.length 
              ? "Perfect! You have a highly trained eye for scams. Keep your family safe!" 
              : "Good effort! Review the lessons to patch up any knowledge gaps and avoid falling for tricky scams."}
          </p>
        </div>

        <button 
          onClick={() => window.location.reload()} 
          className="btn-primary"
        >
          Try Another Round
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShieldQuestion className="text-cyan" /> Scenario {currentQuizIndex + 1}
        </h1>
        <span className="bg-navy px-3 py-1 rounded-full text-sm font-medium border border-white/10">
          Score: <span className="text-cyan">{score}</span>
        </span>
      </div>

      <div className="glass-card p-6 md:p-8 relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-warning/5 rounded-full blur-3xl -z-10"></div>
        
        <p className="text-lg md:text-xl text-white leading-relaxed z-10 relative">
          {currentQuiz.scenario}
        </p>
      </div>

      <div className="space-y-3">
        {currentQuiz.options.map((opt, idx) => {
          let styleClass = "glass-card border-white/5 hover:bg-white/5";
          if (hasAnswered) {
            if (idx === currentQuiz.correctIndex) {
              styleClass = "bg-success/20 border-success shadow-[0_0_15px_rgba(16,185,129,0.3)]";
            } else if (idx === selectedOption) {
              styleClass = "bg-error/20 border-error";
            } else {
              styleClass = "opacity-50 glass-card border-white/5";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={hasAnswered}
              className={`w-full text-left p-4 rounded-xl transition-all duration-300 border flex items-start gap-3 ${styleClass}`}
            >
              <div className="mt-1">
                {hasAnswered && idx === currentQuiz.correctIndex && <CheckCircle2 className="text-success" size={20} />}
                {hasAnswered && idx === selectedOption && idx !== currentQuiz.correctIndex && <XCircle className="text-error" size={20} />}
                {(!hasAnswered || (idx !== currentQuiz.correctIndex && idx !== selectedOption)) && <div className="w-5 h-5 rounded-full border border-slate-500"></div>}
              </div>
              <span className={hasAnswered && idx === selectedOption && idx !== currentQuiz.correctIndex ? "text-slate-300" : "text-white"}>
                {opt}
              </span>
            </button>
          );
        })}
      </div>

      {hasAnswered && (
        <div className="animate-slide-up mt-6 space-y-4">
          <div className={`p-4 rounded-xl border ${selectedOption === currentQuiz.correctIndex ? 'bg-success/10 border-success/30' : 'bg-warning/10 border-warning/30'}`}>
            <p className="text-slate-200">
              <span className="font-bold mr-2">{selectedOption === currentQuiz.correctIndex ? 'Correct!' : 'Not Quite.'}</span> 
              {currentQuiz.feedback}
            </p>
          </div>
          
          <button 
            onClick={nextQuestion}
            className="w-full btn-primary flex justify-center items-center gap-2 py-4 text-lg"
          >
            Next Scenario <ArrowRight />
          </button>
        </div>
      )}
    </div>
  );
}
