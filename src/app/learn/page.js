"use client";

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { LESSONS } from '@/data/content';
import ScrollReveal from '@/components/ScrollReveal';
import { BookOpen, CheckCircle2, ChevronRight, Sparkles, Dices, Layers, Lock, ArrowUpRight, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';

function getLessonText(content) {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content.map(c => typeof c === 'string' ? c : c.value || '').join(' ');
  }
  return '';
}

export default function LearnPage() {
  const { completedLessons, markLessonComplete } = useAuth();
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [victoryReward, setVictoryReward] = useState(null);
  
  // Track which Deck Tower is currently being hovered/expanded
  const [activeDeckTier, setActiveDeckTier] = useState(null);

  const beginnerDeck = LESSONS.filter(l => (l.difficulty || '').toLowerCase().includes('begin') || (l.difficulty || '').toLowerCase().includes('easy'));
  const mediumDeck = LESSONS.filter(l => (l.difficulty || '').toLowerCase().includes('inter') || (l.difficulty || '').toLowerCase().includes('med'));
  const advancedDeck = LESSONS.filter(l => !(l.difficulty || '').toLowerCase().includes('begin') && !(l.difficulty || '').toLowerCase().includes('inter') && !(l.difficulty || '').toLowerCase().includes('easy') && !(l.difficulty || '').toLowerCase().includes('med'));

  const triggerVictory = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#22d3ee', '#10b981', '#8b5cf6', '#ffb300']
    });
  };

  const spinRandomLesson = () => {
    setIsSpinning(true);
    let counter = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * LESSONS.length);
      setSelectedLesson(LESSONS[randomIndex]);
      counter++;
      if (counter > 12) {
        clearInterval(interval);
        setIsSpinning(false);
        setActiveSlide(0);
      }
    }, 100);
  };

  const openRoadmapModal = (lesson) => {
    setSelectedLesson(lesson);
    setActiveSlide(0);
  };

  const getRoadmapSteps = (lesson) => {
    if (!lesson) return [];
    const fullText = getLessonText(lesson.content);
    return [
      {
        title: "Threat Vector Briefing",
        subtitle: "How this cyber fraud operates",
        content: fullText.slice(0, 180) + (fullText.length > 180 ? "..." : ""),
        icon: "🚨",
        badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/40"
      },
      {
        title: "Intercepted Scam Trap",
        subtitle: "Real message example used by fraudsters",
        content: lesson.example || "Dear Customer, your bank account is pending KYC verification. Click immediately to restore service...",
        icon: "💬",
        isTerminal: true
      },
      {
        title: "Ironclad Defense Rule",
        subtitle: "Your family's safety protocol",
        content: lesson.tip || "Never click bank links sent via WhatsApp or SMS. Always check on official bank apps.",
        icon: "🛡️",
        badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
      }
    ];
  };

  const steps = selectedLesson ? getRoadmapSteps(selectedLesson) : [];

  const handleFinishStep = () => {
    if (activeSlide < steps.length - 1) {
      setActiveSlide(s => s + 1);
    } else {
      triggerVictory();
      const diff = (selectedLesson?.difficulty || '').toLowerCase();
      const earnedXp = diff.includes('hard') || diff.includes('elite') || diff.includes('adv') ? 100 : (diff.includes('med') || diff.includes('inter') || diff.includes('tactical') ? 50 : 25);
      markLessonComplete(selectedLesson.id, earnedXp);
      setVictoryReward({ title: selectedLesson.title, xp: earnedXp });
      setSelectedLesson(null);
    }
  };

  // Interactive Cascading Accordion Deck
  const renderInteractiveDeck = (tierKey, title, subtitle, deck, accentColor, badgeIcon) => {
    const isDeckOpen = activeDeckTier === tierKey;
    
    return (
      <div 
        onMouseEnter={() => setActiveDeckTier(tierKey)}
        onMouseLeave={() => setActiveDeckTier(null)}
        className={`glass-card p-6 md:p-8 transition-all duration-500 relative overflow-hidden select-none ${
          isDeckOpen 
            ? `border-${accentColor}-400 bg-slate-900/95 shadow-[0_30px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(139,92,246,0.3)]` 
            : 'border-purple-500/20 hover:border-purple-500/40 bg-slate-900/60'
        }`}
      >
        {/* Closed Deck Cover Badge (Always visible at top) */}
        <div className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-${accentColor}-500/20 border border-${accentColor}-500/40 text-${accentColor}-400 flex items-center justify-center font-black text-3xl shadow-lg animate-pulse`}>
              {badgeIcon}
            </div>
            <div>
              <span className={`text-[10px] font-black uppercase tracking-widest text-${accentColor}-400 px-3 py-1 rounded-full bg-${accentColor}-500/10 border border-${accentColor}-500/20`}>
                {subtitle}
              </span>
              <h2 className="text-2xl font-black font-['Outfit'] text-white mt-1">{title}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 hidden sm:inline">{deck.length} Dossiers</span>
            <div className={`w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-slate-300 transition-transform duration-500 ${isDeckOpen ? 'rotate-180 bg-purple-600 text-white' : ''}`}>
              <ChevronDown size={20} />
            </div>
          </div>
        </div>

        {/* Closed Deck Hint Preview */}
        {!isDeckOpen && (
          <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs font-bold text-slate-400">
            <span className="flex items-center gap-2">🃏 Hover cursor here to cascade open {deck.length} modules</span>
            <ArrowUpRight size={16} className="text-cyan-400 animate-bounce" />
          </div>
        )}

        {/* Dealt Cards Container (Smoothly expands downwards on hover) */}
        <div className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${isDeckOpen ? 'max-h-[1200px] opacity-100 mt-8 space-y-4' : 'max-h-0 opacity-0 mt-0'}`}>
          {deck.map((lesson, idx) => {
            const isDone = completedLessons.includes(lesson.id);
            return (
              <div 
                key={lesson.id}
                onClick={(e) => {
                  e.stopPropagation();
                  openRoadmapModal(lesson);
                }}
                className="p-5 rounded-2xl bg-slate-800/80 hover:bg-gradient-to-r hover:from-purple-900/60 hover:to-slate-800 border border-white/10 hover:border-cyan-400 transition-all duration-300 cursor-pointer group/item flex items-center justify-between gap-4 shadow-md hover:translate-x-1.5"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl shrink-0 group-hover/item:scale-125 transition-transform">{lesson.icon || "🛡️"}</span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lesson #{lesson.id}</span>
                      <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1 tracking-wider">
                        🪙 +{tierKey === 'advanced' ? 100 : (tierKey === 'medium' ? 50 : 25)} XP
                      </span>
                      {isDone && <CheckCircle2 size={15} className="text-emerald-400 drop-shadow" />}
                    </div>
                    <h3 className="text-base sm:text-lg font-black font-['Outfit'] text-white group-hover/item:text-cyan-300 transition-colors">
                      {lesson.title}
                    </h3>
                  </div>
                </div>

                <div className="w-9 h-9 rounded-xl bg-white/5 group-hover/item:bg-cyan-400 group-hover/item:text-navy text-slate-400 flex items-center justify-center font-black transition-all shrink-0">
                  ➔
                </div>
              </div>
            );
          })}
        </div>

      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto pb-44 pt-4 px-4 sm:px-6">
      
      {/* Hero Banner */}
      <ScrollReveal>
        <div className="glass-card p-8 md:p-12 mb-10 relative overflow-hidden bg-gradient-to-r from-purple-900/40 via-slate-900 to-slate-900 flex flex-col md:flex-row items-center justify-between gap-8 border-purple-500/30 shadow-2xl">
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/40 px-4 py-1.5 rounded-full text-xs font-black text-cyan-300 tracking-widest uppercase mb-6 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
              <Sparkles size={16} className="text-cyan-400 animate-spin" /> Elite Dark Navy-Purple Ecosystem
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black font-['Outfit'] mb-4 leading-[1.08] text-white">
              Tactile Dealing <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500">
                Security Decks
              </span>
            </h1>
            
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
              Rest your cursor over any of the 3 compact classified decks below. Watch the cards smoothly deal out downward into view!
            </p>
          </div>

          <div className="relative z-10 flex flex-col items-center shrink-0 w-full sm:w-auto">
            <button 
              onClick={spinRandomLesson}
              disabled={isSpinning}
              className="btn-primary w-full sm:w-auto py-5 px-8 text-base font-black flex items-center justify-center gap-3 group shadow-[0_0_35px_rgba(139,92,246,0.5)] cursor-pointer"
            >
              <Dices size={24} className={`text-navy ${isSpinning ? "animate-spin" : "group-hover:rotate-45 transition-transform"}`} />
              <span>{isSpinning ? "🎰 Spinning Surprise..." : "🎰 Spin Surprise Lesson"}</span>
            </button>
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2.5">Feeling lucky? Let AI pick for you!</span>
          </div>
        </div>
      </ScrollReveal>

      {/* 3 Interactive Dealing Deck Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {renderInteractiveDeck("beginner", "Tier 1: Basics", "Everyday Shield", beginnerDeck, "emerald", "🟢")}
        {renderInteractiveDeck("medium", "Tier 2: Tactical", "Scam Interception", mediumDeck, "amber", "🟡")}
        {renderInteractiveDeck("advanced", "Tier 3: Elite", "Cyber Warfare", advancedDeck.length ? advancedDeck : LESSONS.slice(6, 8), "rose", "🔴")}
      </div>

      {/* Interactive Roadmap Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl animate-fade-in">
          <div className="glass-card max-w-2xl w-full p-6 sm:p-10 relative overflow-hidden bg-slate-950 border-purple-500/50 shadow-[0_0_80px_rgba(139,92,246,0.4)]">
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="text-4xl animate-bounce">{selectedLesson.icon || "🚨"}</span>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protocol Instruction #{selectedLesson.id}</span>
                  <h2 className="text-2xl font-black font-['Outfit'] text-white mt-1">{selectedLesson.title}</h2>
                </div>
              </div>
              <button 
                onClick={() => setSelectedLesson(null)}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Stepper Progress Bar */}
            <div className="flex items-center gap-2 mb-8">
              {steps.map((st, i) => (
                <div key={i} className="flex-1 h-2 rounded-full overflow-hidden bg-white/10">
                  <div className={`h-full transition-all duration-500 ${i <= activeSlide ? "bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 shadow-[0_0_12px_rgba(139,92,246,0.8)]" : "w-0"}`}></div>
                </div>
              ))}
            </div>

            {/* Step Content Slide */}
            <div className="min-h-[220px] sm:min-h-[240px] flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{steps[activeSlide]?.icon}</span>
                <h3 className="text-lg font-black text-cyan-300 uppercase tracking-wider font-['Outfit']">
                  {steps[activeSlide]?.title}
                </h3>
              </div>

              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">
                {steps[activeSlide]?.subtitle}
              </p>

              {steps[activeSlide]?.isTerminal ? (
                <div className="bg-slate-900 border border-purple-500/30 rounded-xl p-5 font-mono text-xs sm:text-sm text-cyan-300 shadow-inner leading-relaxed overflow-x-auto relative group">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-purple-500/20 text-[10px] text-purple-400 font-bold uppercase tracking-widest">
                    <span>⚠️ Intercepted Message</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                  </div>
                  "{steps[activeSlide]?.content}"
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-slate-200 text-base sm:text-lg leading-relaxed font-normal">
                  {steps[activeSlide]?.content}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              <button 
                onClick={() => setActiveSlide(s => Math.max(0, s - 1))}
                disabled={activeSlide === 0}
                className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-20 font-bold text-sm uppercase transition-all cursor-pointer"
              >
                ← Back
              </button>

              <button 
                onClick={handleFinishStep}
                className="btn-primary py-4 px-10 text-base font-black flex items-center gap-2 cursor-pointer"
              >
                <span>{activeSlide === steps.length - 1 ? "🎉 Secure Clearance XP" : "Next Protocol ➔"}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Gamified Level-Up Victory Modal */}
      {victoryReward && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl animate-fade-in">
          <div className="glass-card max-w-md w-full p-8 text-center relative overflow-hidden bg-slate-950 border-cyan-400 shadow-[0_0_90px_rgba(34,211,238,0.4)] animate-scale-up">
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-tr from-amber-400 to-cyan-400 p-1 shadow-lg animate-bounce flex items-center justify-center text-5xl">
              🏆
            </div>
            
            <span className="bg-cyan-500/20 border border-cyan-400 text-cyan-300 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-widest block w-fit mx-auto mb-4">
              ✨ Security Clearance Secured
            </span>

            <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white mb-2">
              {victoryReward.title}
            </h2>

            <p className="text-slate-300 text-sm mb-6 font-medium">
              You mastered this threat vector and upgraded your family network defense shield!
            </p>

            <div className="bg-slate-900/90 border border-amber-500/40 p-4 rounded-2xl mb-8 flex items-center justify-around">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Reward</span>
                <span className="text-2xl font-black font-['Outfit'] text-amber-400">+{victoryReward.xp} XP</span>
              </div>
              <div className="w-px h-10 bg-white/10"></div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Defense Roster</span>
                <span className="text-2xl font-black font-['Outfit'] text-emerald-400">LIVE SYNCED</span>
              </div>
            </div>

            <button
              onClick={() => {
                triggerVictory();
                setTimeout(() => setVictoryReward(null), 1200);
              }}
              className="w-full py-4 bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 text-slate-950 hover:opacity-95 text-base font-black uppercase tracking-wider cursor-pointer rounded-2xl shadow-[0_0_40px_rgba(52,211,153,0.6)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 font-['Outfit']"
            >
              <span>✨ Collect Victory Reward ✨</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
