"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { QUIZZES } from '@/data/content';
import { ShieldQuestion, CheckCircle2, XCircle, Trophy, ArrowRight, RefreshCcw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Shuffle utility
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
  const [gameState, setGameState] = useState('intro'); // intro, playing, summary
  const [feedback, setFeedback] = useState(null); // null, correct, wrong

  useEffect(() => {
    // Only take 5 random questions per session
    setQuestions(shuffle(QUIZZES).slice(0, 5));
  }, []);

  const startGame = () => {
    setQuestions(shuffle(QUIZZES).slice(0, 5));
    setCurrentIndex(0);
    setScore({ correct: 0, wrong: 0, xp: 0 });
    setGameState('playing');
    setFeedback(null);
  };

  const handleAnswer = (isScamChosen) => {
    const q = questions[currentIndex];
    const isCorrect = isScamChosen === q.isScam;
    
    setFeedback({
      correct: isCorrect,
      explanation: q.explanation
    });

    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      wrong: prev.wrong + (isCorrect ? 0 : 1),
      xp: prev.xp + (isCorrect ? 10 : 0)
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
    
    if (user && score.correct > 0) {
      // Sync XP to cloud
      const totalXp = (profile?.xp || 0) + score.xp + (score.correct === questions.length ? 20 : 0); // Bonus for perfect score
      await supabase.from('profiles').update({ xp: totalXp }).eq('id', user.id);
      
      // Save quiz result
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
      <div className="animate-fade-in max-w-2xl mx-auto text-center py-12">
        <ShieldQuestion className="mx-auto text-cyan mb-6 drop-shadow-[0_0_20px_rgba(56,189,248,0.5)]" size={80} />
        <h1 className="text-4xl md:text-5xl font-black font-['Outfit'] mb-4">Safe or Scam?</h1>
        <p className="text-slate-300 text-lg mb-10 max-w-md mx-auto">
          Review 5 real-world scenarios happening in India right now. Test your instincts and earn XP.
        </p>
        <button 
          onClick={startGame}
          className="btn-primary text-lg px-10 py-4 w-full md:w-auto font-black uppercase tracking-wider"
        >
          Start Challenge
        </button>
      </div>
    );
  }

  if (gameState === 'summary') {
    const isPerfect = score.correct === questions.length;
    return (
      <div className="animate-fade-in max-w-2xl mx-auto text-center py-12">
        <Trophy className={`mx-auto mb-6 ${isPerfect ? 'text-gold drop-shadow-[0_0_30px_rgba(245,158,11,0.6)]' : 'text-cyan'} animate-bounce`} size={80} />
        <h1 className="text-4xl md:text-5xl font-black font-['Outfit'] mb-2">
          {isPerfect ? 'Perfect Score!' : 'Challenge Complete'}
        </h1>
        <p className="text-slate-300 mb-10">You identified {score.correct} out of {questions.length} scenarios correctly.</p>
        
        <div className="glass-card p-6 md:p-10 mb-8 flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="text-center">
            <div className="text-4xl font-black text-emerald mb-1">{score.correct}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Correct</div>
          </div>
          <div className="w-px h-16 bg-white/10 hidden md:block"></div>
          <div className="text-center">
            <div className="text-4xl font-black text-rose mb-1">{score.wrong}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Wrong</div>
          </div>
          <div className="w-px h-16 bg-white/10 hidden md:block"></div>
          <div className="text-center">
            <div className="text-4xl font-black text-gold mb-1">+{score.xp + (isPerfect ? 20 : 0)}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">XP Earned</div>
          </div>
        </div>

        <button 
          onClick={startGame}
          className="btn-primary flex items-center justify-center gap-2 mx-auto"
        >
          <RefreshCcw size={18} /> Play Again
        </button>
      </div>
    );
  }

  // Playing state
  const q = questions[currentIndex];
  const progressPercent = ((currentIndex) / questions.length) * 100;

  return (
    <div className="animate-fade-in max-w-3xl mx-auto pb-12">
      {/* Progress Bar & Scores */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Scenario {currentIndex + 1} of {questions.length}
        </div>
        <div className="flex gap-4">
          <span className="text-emerald font-bold text-sm flex items-center gap-1"><CheckCircle2 size={16}/> {score.correct}</span>
          <span className="text-rose font-bold text-sm flex items-center gap-1"><XCircle size={16}/> {score.wrong}</span>
        </div>
      </div>
      
      <div className="w-full h-2 bg-navy rounded-full mb-8 overflow-hidden border border-white/5">
        <div className="h-full bg-cyan transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
      </div>

      <div className="glass-card p-6 md:p-10 border-cyan/20 relative overflow-hidden mb-8">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-cyan/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <span className="inline-block bg-violet/10 text-violet border border-violet/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 relative z-10">
          {q.type} Scam
        </span>
        
        <p className="text-lg md:text-xl text-slate-200 leading-relaxed font-medium relative z-10 font-['Outfit']">
          "{q.scenario}"
        </p>
      </div>

      {!feedback ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => handleAnswer(false)}
            className="p-6 glass-card border-emerald/30 hover:bg-emerald/10 flex flex-col items-center gap-3 transition-all group"
          >
            <div className="w-16 h-16 rounded-full bg-emerald/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="text-emerald drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" size={32} />
            </div>
            <span className="font-black text-xl text-emerald uppercase tracking-wider">It's Safe</span>
          </button>
          
          <button 
            onClick={() => handleAnswer(true)}
            className="p-6 glass-card border-rose/30 hover:bg-rose/10 flex flex-col items-center gap-3 transition-all group"
          >
            <div className="w-16 h-16 rounded-full bg-rose/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <XCircle className="text-rose drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]" size={32} />
            </div>
            <span className="font-black text-xl text-rose uppercase tracking-wider">It's a Scam</span>
          </button>
        </div>
      ) : (
        <div className={`glass-card p-6 md:p-8 animate-fade-in border ${feedback.correct ? 'bg-emerald/10 border-emerald/30' : 'bg-rose/10 border-rose/30'}`}>
          <div className="flex items-start gap-4 mb-6">
            <div className="mt-1 flex-shrink-0">
              {feedback.correct 
                ? <CheckCircle2 className="text-emerald" size={32} /> 
                : <XCircle className="text-rose" size={32} />
              }
            </div>
            <div>
              <h3 className={`text-2xl font-black font-['Outfit'] mb-2 ${feedback.correct ? 'text-emerald' : 'text-rose'}`}>
                {feedback.correct ? 'Correct!' : 'Wrong!'}
              </h3>
              <p className="text-slate-200 leading-relaxed">
                {feedback.explanation}
              </p>
            </div>
          </div>
          
          <button 
            onClick={nextQuestion}
            className={`w-full py-4 flex items-center justify-center gap-2 font-black rounded-xl transition-all shadow-lg ${
              feedback.correct 
                ? 'bg-emerald text-navy hover:bg-emerald/90 shadow-[0_4px_20px_rgba(16,185,129,0.4)]' 
                : 'bg-rose text-navy hover:bg-rose/90 shadow-[0_4px_20px_rgba(244,63,94,0.4)]'
            }`}
          >
            Next Scenario <ArrowRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
