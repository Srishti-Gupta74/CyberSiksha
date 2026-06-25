"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { QUIZZES } from '@/data/content';
import { ShieldQuestion, CheckCircle2, XCircle, Trophy, ArrowRight, RefreshCcw, Flame, ShieldAlert, Sparkles, Smartphone, Lock, AlertTriangle, Radio } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import confetti from 'canvas-confetti';

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function QuizPage() {
  const { user, profile } = useAuth();
  
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, wrong: 0, xp: 0 });
  const [streak, setStreak] = useState(0);
  const [gameState, setGameState] = useState('intro'); // intro, playing, summary
  const [feedback, setFeedback] = useState(null); // null, correct, wrong

  useEffect(() => {
    setQuestions(shuffle(QUIZZES).slice(0, 5));
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06b6d4', '#10b981', '#8b5cf6', '#f59e0b']
    });
  };

  const startGame = () => {
    setQuestions(shuffle(QUIZZES).slice(0, 5));
    setCurrentIndex(0);
    setScore({ correct: 0, wrong: 0, xp: 0 });
    setStreak(0);
    setGameState('playing');
    setFeedback(null);
  };

  const handleAnswer = (isScamChosen) => {
    const q = questions[currentIndex];
    const isCorrect = isScamChosen === q.isScam;
    
    if (isCorrect) {
      triggerConfetti();
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }

    setFeedback({
      correct: isCorrect,
      explanation: q.explanation
    });

    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      wrong: prev.wrong + (isCorrect ? 0 : 1),
      xp: prev.xp + (isCorrect ? (10 + streak * 2) : 0) // Combo bonus XP!
    }));
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      endGame();
    } else {
      setCurrentIndex(curr => curr + 1);
      setFeedback(null);
    }
  };

  const endGame = async () => {
    setGameState('summary');
    triggerConfetti();
    
    if (user && score.correct > 0) {
      const totalXp = (profile?.xp || 0) + score.xp + (score.correct === questions.length ? 25 : 0);
      await supabase.from('profiles').update({ xp: totalXp }).eq('id', user.id);
      
      await supabase.from('quiz_results').insert({
        user_id: user.id,
        total_questions: questions.length,
        correct_answers: score.correct,
        xp_earned: score.xp
      });
    }
  };

  if (gameState === 'intro') {
    return (
      <div className="animate-fade-in max-w-3xl mx-auto text-center py-12 px-4">
        <div className="w-24 h-24 mx-auto mb-8 bg-sky-100 border border-sky-200 rounded-3xl flex items-center justify-center shadow-sm animate-bounce text-5xl">
          🕹️
        </div>
        
        <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 px-4 py-1.5 rounded-full text-xs font-bold text-purple-700 uppercase tracking-widest mb-4">
          <Sparkles size={14} /> Quick Practice Game
        </div>

        <h1 className="text-4xl md:text-6xl font-black font-['Outfit'] mb-6 leading-tight text-slate-900">
          Spot the Scam <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-purple-600 to-pink-600">
            Quiz Challenge
          </span>
        </h1>
        
        <p className="text-slate-600 text-base md:text-lg mb-12 max-w-xl mx-auto leading-relaxed font-normal">
          Test your cyber safety skills! We will show you 5 everyday messages. Decide if each one is Safe or a Fraud to earn points and protect your family.
        </p>
        
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-12">
          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
            <div className="text-amber-600 font-black text-2xl font-['Outfit']">5</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Quick Scenarios</div>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
            <div className="text-sky-600 font-black text-2xl font-['Outfit']">+50</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Max Safety Points</div>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
            <div className="text-rose-600 font-black text-2xl font-['Outfit']">🔥</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Streak Bonus</div>
          </div>
        </div>

        <button 
          onClick={startGame}
          className="btn-primary text-base md:text-lg px-12 py-4 w-full sm:w-auto font-bold shadow-lg"
        >
          <span>Start Quiz Challenge ➔</span>
        </button>
      </div>
    );
  }

  if (gameState === 'summary') {
    const isPerfect = score.correct === questions.length;
    return (
      <div className="animate-fade-in max-w-3xl mx-auto text-center py-12 px-4">
        <div className={`w-28 h-28 mx-auto mb-8 rounded-3xl border flex items-center justify-center shadow-2xl ${
          isPerfect ? 'bg-gold/20 border-gold text-gold shadow-[0_0_50px_rgba(245,158,11,0.5)]' : 'bg-cyan/20 border-cyan text-cyan shadow-[0_0_40px_rgba(6,182,212,0.4)]'
        }`}>
          <Trophy className="animate-bounce" size={56} />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Mission Report</span>
        <h1 className="text-4xl md:text-6xl font-black font-['Outfit'] text-white mt-1 mb-4">
          {isPerfect ? 'Flawless Clearance!' : 'Threat Audit Complete'}
        </h1>
        <p className="text-slate-300 text-lg mb-10">You neutralized {score.correct} out of {questions.length} attack vectors.</p>
        
        <div className="glass-card p-8 md:p-12 mb-10 border-white/10 grid grid-cols-3 gap-4 max-w-xl mx-auto shadow-2xl bg-gradient-to-br from-navy-light to-navy">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-black text-emerald font-['Outfit'] mb-1">{score.correct}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Intercepted</div>
          </div>
          <div className="text-center border-x border-white/5">
            <div className="text-4xl md:text-5xl font-black text-rose font-['Outfit'] mb-1">{score.wrong}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Breached</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-black text-gold font-['Outfit'] mb-1">+{score.xp + (isPerfect ? 25 : 0)}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total XP</div>
          </div>
        </div>

        <button 
          onClick={startGame}
          className="btn-primary flex items-center justify-center gap-2.5 mx-auto px-10 py-4 font-black uppercase text-sm tracking-wider"
        >
          <RefreshCcw size={18} /> Re-initialize Sim
        </button>
      </div>
    );
  }

  const q = questions[currentIndex];
  const progressPercent = ((currentIndex) / questions.length) * 100;

  return (
    <div className="animate-fade-in max-w-3xl mx-auto pb-32 px-4">
      
      {/* HUD Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 font-mono font-bold text-xs uppercase text-slate-400">
          <Radio size={14} className="text-cyan animate-pulse" /> INTERCEPT {currentIndex + 1} / {questions.length}
        </div>

        <div className="flex items-center gap-6">
          {streak > 1 && (
            <div className="flex items-center gap-1.5 bg-gold/10 border border-gold/30 text-gold px-3 py-1 rounded-full text-xs font-black animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.3)] font-['Outfit']">
              <Flame size={14} /> {streak}x COMBO
            </div>
          )}
          <div className="flex gap-4 font-['Outfit'] font-black">
            <span className="text-emerald text-sm flex items-center gap-1"><CheckCircle2 size={16}/> {score.correct}</span>
            <span className="text-rose text-sm flex items-center gap-1"><XCircle size={16}/> {score.wrong}</span>
          </div>
        </div>
      </div>
      
      {/* Neon Progress Bar */}
      <div className="w-full h-2 bg-navy rounded-full mb-8 overflow-hidden border border-white/10 shadow-inner p-0.5">
        <div 
          className="h-full bg-gradient-to-r from-cyan via-emerald to-violet transition-all duration-500 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.8)]" 
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Simulated Device Screen Mockup */}
      <div className="glass-card p-0 border-white/10 relative overflow-hidden mb-8 shadow-2xl bg-[#0b1329]">
        <div className="bg-navy border-b border-white/5 px-6 py-3 flex items-center justify-between text-[11px] font-mono font-bold text-slate-400">
          <div className="flex items-center gap-2">
            <Smartphone size={14} className="text-cyan" /> TARGET DEVICE RECEIVER
          </div>
          <div className="flex items-center gap-3">
            <span>📶 5G</span>
            <span>🔒 ENCRYPTED</span>
            <span className="text-white">10:42 AM</span>
          </div>
        </div>

        <div className="p-8 md:p-12 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <span className="bg-violet/20 text-violet border border-violet/30 px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest font-['Outfit']">
              Vector: {q.type}
            </span>
            <span className="text-xs text-rose font-mono font-bold animate-pulse">● LIVE INTERCEPT</span>
          </div>
          
          <div className="bg-navy/90 p-6 md:p-8 rounded-2xl border border-white/5 shadow-inner">
            <p className="text-lg md:text-2xl text-slate-100 leading-relaxed font-normal font-['Plus_Jakarta_Sans']">
              "{q.scenario}"
            </p>
          </div>
        </div>
      </div>

      {!feedback ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <button 
            onClick={() => handleAnswer(false)}
            className="p-8 glass-card border-emerald/40 bg-gradient-to-br from-emerald/10 to-navy hover:bg-emerald/20 flex flex-col items-center justify-center gap-4 transition-all group shadow-xl hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(16,185,129,0.25)]"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald/20 border border-emerald/50 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald group-hover:text-navy text-emerald transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <CheckCircle2 size={32} />
            </div>
            <div className="text-center">
              <span className="block font-black text-2xl text-emerald font-['Outfit'] uppercase tracking-wider mb-1">Authorize Safe</span>
              <span className="text-xs text-slate-400 font-medium">Legitimate communication vector</span>
            </div>
          </button>
          
          <button 
            onClick={() => handleAnswer(true)}
            className="p-8 glass-card border-rose/40 bg-gradient-to-br from-rose/10 to-navy hover:bg-rose/20 flex flex-col items-center justify-center gap-4 transition-all group shadow-xl hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(244,63,94,0.25)]"
          >
            <div className="w-16 h-16 rounded-2xl bg-rose/20 border border-rose/50 flex items-center justify-center group-hover:scale-110 group-hover:bg-rose group-hover:text-navy text-rose transition-all duration-300 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
              <AlertTriangle size={32} />
            </div>
            <div className="text-center">
              <span className="block font-black text-2xl text-rose font-['Outfit'] uppercase tracking-wider mb-1">Flag as Scam</span>
              <span className="text-xs text-slate-400 font-medium">Fraudulent phishing attempt</span>
            </div>
          </button>
        </div>
      ) : (
        <div className={`glass-card p-8 md:p-10 animate-fade-in border-2 shadow-2xl ${
          feedback.correct 
            ? 'bg-gradient-to-br from-emerald/15 via-navy to-navy border-emerald shadow-[0_0_50px_rgba(16,185,129,0.2)]' 
            : 'bg-gradient-to-br from-rose/15 via-navy to-navy border-rose shadow-[0_0_50px_rgba(244,63,94,0.2)]'
        }`}>
          <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
              feedback.correct ? 'bg-emerald text-navy' : 'bg-rose text-white'
            }`}>
              {feedback.correct 
                ? <CheckCircle2 size={36} /> 
                : <XCircle size={36} />
              }
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className={`text-3xl font-black font-['Outfit'] uppercase ${feedback.correct ? 'text-emerald' : 'text-rose'}`}>
                  {feedback.correct ? 'Threat Neutralized!' : 'Security Breach!'}
                </h3>
                {feedback.correct && streak > 1 && (
                  <span className="bg-gold/20 text-gold border border-gold/40 px-2.5 py-0.5 rounded text-xs font-black">+{streak * 2} COMBO XP</span>
                )}
              </div>
              <p className="text-slate-200 text-lg md:text-xl leading-relaxed font-normal">
                {feedback.explanation}
              </p>
            </div>
          </div>
          
          <button 
            onClick={nextQuestion}
            className={`w-full py-4 px-8 flex items-center justify-center gap-3 font-black font-['Outfit'] rounded-xl transition-all shadow-xl uppercase text-sm tracking-wider ${
              feedback.correct 
                ? 'bg-emerald text-navy hover:bg-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.5)]' 
                : 'bg-rose text-navy hover:bg-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.5)]'
            }`}
          >
            <span>Load Next Intercept</span> <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
