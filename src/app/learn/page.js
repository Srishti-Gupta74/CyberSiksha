"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [selectedLesson, setSelectedLesson] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [victoryReward, setVictoryReward] = useState(null);
  const [wheelDegrees, setWheelDegrees] = useState(0);
  
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

  const startWheelSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    // Add 1440 to 1800 degrees (4 to 5 full wheel rotations)
    const extraSpins = 1440 + Math.floor(Math.random() * 360);
    setWheelDegrees(prev => prev + extraSpins);

    setTimeout(() => {
      setIsSpinning(false);
      const randomIndex = Math.floor(Math.random() * LESSONS.length);
      setSelectedLesson(LESSONS[randomIndex]);
      setActiveSlide(0);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 2200);
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
        content: lesson.tip || "Never click bank links sent via WhatsApp or SMS. Always verify on official bank apps.",
        icon: "🛡️",
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

  const renderShowcaseSection = (tierKey, title, subtitle, deck, accentColor, icon) => {
    if (!deck || !deck.length) return null;

    const doneCount = deck.filter(l => completedLessons.includes(l.id)).length;
    const totalCount = deck.length;
    const pct = Math.round((doneCount / totalCount) * 100) || 0;

    return (
      <div className="mb-16 select-none group/tier">
        {/* Tier Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 mb-6 border-b border-white/10 gap-6">
          <div className="flex items-center gap-4">
            <span className="text-4xl sm:text-5xl filter drop-shadow animate-pulse">{icon}</span>
            <div>
              <span className={`text-[10px] font-mono font-black tracking-[0.3em] uppercase text-${accentColor}-400 block`}>3D CLASSIFIED CARD DECK</span>
              <h2 className="text-2xl sm:text-4xl font-black font-['Outfit'] text-white mt-0.5 flex flex-wrap items-center gap-3">
                <span>{title}</span>
                <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-500/15 px-3 py-1 rounded-full border border-cyan-400/30">✨ Hover Left/Right to Pan Deck</span>
              </h2>
            </div>
          </div>

          {/* Gamified Cyber Deck Progress Bar Pill ("deck 1/15 completed") */}
          <div className="bg-slate-950/95 p-4 sm:px-6 sm:py-4 rounded-3xl border border-white/15 shadow-2xl flex flex-col gap-2.5 w-full md:w-auto min-w-[280px]">
            <div className="flex items-center justify-between text-xs font-mono font-black uppercase tracking-wider gap-4">
              <span className="text-slate-300 flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full bg-${accentColor}-400 ${doneCount > 0 ? "animate-ping" : ""}`}></span>
                <span>Deck Progress</span>
              </span>
              <span className={`text-${accentColor}-400 bg-white/5 px-3 py-1 rounded-xl border border-white/10 font-black`}>
                {doneCount}/{totalCount} Completed ({pct}%)
              </span>
            </div>
            
            {/* High-Tech Glowing Laser Progress Bar Meter */}
            <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden relative shadow-inner p-0.5">
              <div 
                style={{ width: `${pct}%` }}
                className={`h-full rounded-full transition-all duration-700 ${
                  pct === 100 
                    ? "bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 shadow-[0_0_15px_#34d399]" 
                    : `bg-gradient-to-r from-${accentColor}-500 via-purple-500 to-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]`
                }`}
              ></div>
            </div>
          </div>
        </div>

        {/* 3D Interactive Horizontal Card Deck Track (Cursor Pan Left/Right) */}
        <div 
          onMouseMove={(e) => {
            const el = e.currentTarget;
            const rect = el.getBoundingClientRect();
            const norm = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            el.scrollLeft = norm * (el.scrollWidth - rect.width);
          }}
          className="flex gap-6 overflow-x-auto pb-10 pt-4 px-3 scrollbar-none no-scrollbar select-none cursor-ew-resize"
          style={{ scrollBehavior: 'auto' }}
        >
          {deck.map((lesson) => {
            const isDone = completedLessons.includes(lesson.id);
            return (
              <div 
                key={lesson.id}
                onClick={() => openRoadmapModal(lesson)}
                className="w-[340px] sm:w-[390px] shrink-0 p-8 rounded-3xl bg-gradient-to-br from-slate-800/95 via-slate-900/95 to-slate-950 backdrop-blur-2xl border border-white/15 hover:border-cyan-400 transition-all duration-300 cursor-pointer group flex flex-col justify-between gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:shadow-[0_30px_70px_rgba(34,211,238,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:-translate-y-3.5 hover:rotate-1 relative z-10 hover:z-50"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <span className="w-16 h-16 rounded-2xl bg-slate-950 border border-white/15 flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 group-hover:border-cyan-400/50 transition-transform duration-200 shrink-0">
                      {lesson.icon || "🛡️"}
                    </span>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">DECK CARD #{lesson.id}</span>
                      <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-black px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                        🪙 +{tierKey === 'advanced' ? 100 : (tierKey === 'medium' ? 50 : 25)} XP
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white group-hover:text-cyan-300 transition-colors leading-snug">
                      {lesson.title}
                    </h3>
                    {isDone && <CheckCircle2 size={20} className="text-emerald-400 shrink-0 drop-shadow ml-1" />}
                  </div>

                  <p className="text-slate-300 text-xs sm:text-sm line-clamp-3 leading-relaxed font-normal opacity-85 group-hover:opacity-100 transition-opacity">
                    {getLessonText(lesson.content).slice(0, 140)}...
                  </p>
                </div>

                <div className="pt-5 border-t border-white/10 flex items-center justify-between text-xs font-mono font-black uppercase tracking-wider text-cyan-400 group-hover:underline">
                  <span>{isDone ? "🔄 Re-Deal Protocol" : "⚡ Deal & Inspect Card"}</span>
                  <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-cyan-400 group-hover:text-slate-950 text-slate-400 flex items-center justify-center font-black transition-all shadow-md group-hover:rotate-45 text-sm">
                    ➔
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto pb-44 pt-4 px-4 sm:px-6 select-none animate-fade-in">
      
      {/* Hero Banner with Interactive Fortune Wheel Roulette */}
      <ScrollReveal>
        <div className="glass-card p-8 md:p-14 mb-14 relative overflow-hidden bg-gradient-to-r from-purple-900/40 via-slate-900 to-slate-900 flex flex-col md:flex-row items-center justify-between gap-8 border-purple-500/30 shadow-2xl">
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/40 px-4 py-1.5 rounded-full text-xs font-black text-cyan-300 tracking-widest uppercase mb-6 shadow-[0_0_20px_rgba(139,92,246,0.3)] font-mono">
              <Sparkles size={16} className="text-cyan-400 animate-spin" /> Elite Dark Navy-Purple Ecosystem
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-['Outfit'] mb-4 leading-[1.06] text-white">
              Tactile Dealing <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500">
                Security Decks
              </span>
            </h1>
            
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
              Scroll down to explore the classified security card decks. Move your mouse left or right across any deck to smoothly pan through the cards! Unsure where to begin? Spin the wheel on the right!
            </p>
          </div>

          {/* Fun Interactive Cyber Fortune Wheel Roulette ("🎡 SPIN ME") */}
          <div className="relative z-10 flex flex-col items-center shrink-0 w-full sm:w-auto mt-4 md:mt-0">
            <div className="relative flex flex-col items-center select-none">
              {/* Gold Bouncing Pointer Triangle */}
              <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[22px] border-t-amber-400 absolute -top-4 z-30 filter drop-shadow-[0_2px_6px_rgba(251,191,36,0.9)] animate-bounce"></div>

              {/* Rotating Circular Wheel */}
              <div 
                onClick={startWheelSpin}
                style={{ transform: `rotate(${wheelDegrees}deg)` }}
                className="w-44 h-44 sm:w-52 sm:h-52 rounded-full border-[6px] border-cyan-400 bg-gradient-to-tr from-slate-950 via-purple-950 to-slate-900 shadow-[0_0_60px_rgba(34,211,238,0.45)] flex items-center justify-center relative cursor-pointer overflow-hidden transition-transform duration-[2200ms] ease-out hover:scale-105 active:scale-95 ring-4 ring-purple-500/30"
              >
                {/* Decorative Wedge Grid & Rings */}
                <div className="absolute inset-0 border border-white/10 rounded-full scale-75"></div>
                <div className="absolute inset-0 border border-cyan-400/25 rounded-full scale-50"></div>
                <div className="absolute w-full h-px bg-white/15"></div>
                <div className="absolute h-full w-px bg-white/15"></div>
                <div className="absolute w-full h-px bg-white/15 rotate-45"></div>
                <div className="absolute h-full w-px bg-white/15 rotate-45"></div>

                {/* Slices Icons */}
                <span className="absolute top-3 text-xl filter drop-shadow">🛡️</span>
                <span className="absolute bottom-3 text-xl filter drop-shadow">🚨</span>
                <span className="absolute left-3 text-xl filter drop-shadow">💬</span>
                <span className="absolute right-3 text-xl filter drop-shadow">💸</span>
                <span className="absolute top-7 left-7 text-lg filter drop-shadow">🤖</span>
                <span className="absolute bottom-7 right-7 text-lg filter drop-shadow">🔒</span>
                <span className="absolute top-7 right-7 text-lg filter drop-shadow">🎣</span>
                <span className="absolute bottom-7 left-7 text-lg filter drop-shadow">🛒</span>

                {/* Center Hub Spin Button */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 via-purple-600 to-pink-500 p-1 z-20 shadow-2xl flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center text-center p-1 group-hover:bg-slate-900 transition-colors">
                    <span className="text-2xl animate-pulse">{isSpinning ? "💫" : "🎡"}</span>
                    <span className="text-[9px] font-mono font-black text-cyan-300 uppercase tracking-tighter block mt-0.5">{isSpinning ? "SPINNING" : "SPIN ME"}</span>
                  </div>
                </div>
              </div>

              <span className="text-[11px] sm:text-xs font-mono font-black text-cyan-300 bg-slate-950/90 border border-cyan-400/50 px-4 py-2 rounded-full mt-4 shadow-xl tracking-wider text-center block max-w-[240px]">
                {isSpinning ? "🎰 WHEEL PICKING..." : "🎡 CLICK WHEEL TO PICK RANDOM LESSON"}
              </span>
            </div>
          </div>

        </div>
      </ScrollReveal>

      {/* 3 3D Horizontal Card Deck Rows (Pan Left/Right on Hover) */}
      <div className="space-y-4 pt-2">
        {renderShowcaseSection("beginner", "Tier 1: Basics", "Everyday Shield", beginnerDeck, "emerald", "🟢")}
        {renderShowcaseSection("medium", "Tier 2: Tactical", "Scam Interception", mediumDeck, "amber", "🟡")}
        {renderShowcaseSection("advanced", "Tier 3: Elite", "Cyber Warfare", advancedDeck.length ? advancedDeck : LESSONS.slice(6, 8), "rose", "🔴")}
      </div>

      {/* Interactive Roadmap Modal - True Viewport Portal Overlay */}
      {mounted && selectedLesson && createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-2xl animate-fade-in select-none">
          <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-10 relative bg-slate-950 border border-purple-500/60 shadow-[0_0_90px_rgba(139,92,246,0.5)] rounded-3xl animate-scale-up my-auto">
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/10">
              <div className="flex items-center gap-4">
                <span className="text-4xl sm:text-5xl animate-bounce">{selectedLesson.icon || "🚨"}</span>
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest font-mono">Protocol Instruction #{selectedLesson.id}</span>
                  <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white mt-1 leading-snug">{selectedLesson.title}</h2>
                </div>
              </div>
              <button 
                onClick={() => setSelectedLesson(null)}
                className="w-11 h-11 rounded-full bg-white/5 hover:bg-rose-500 hover:text-white flex items-center justify-center text-slate-400 transition-all cursor-pointer font-bold text-lg shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Stepper Progress Bar */}
            <div className="flex items-center gap-2 mb-8">
              {steps.map((st, i) => (
                <div key={i} className="flex-1 h-2 rounded-full overflow-hidden bg-white/10">
                  <div className={`h-full transition-all duration-300 ${i <= activeSlide ? "bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 shadow-[0_0_12px_rgba(139,92,246,0.8)]" : "w-0"}`}></div>
                </div>
              ))}
            </div>

            {/* Step Content Slide */}
            <div className="min-h-[200px] sm:min-h-[220px] flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{steps[activeSlide]?.icon}</span>
                <h3 className="text-lg sm:text-xl font-black text-cyan-300 uppercase tracking-wider font-['Outfit']">
                  {steps[activeSlide]?.title}
                </h3>
              </div>

              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4 font-mono">
                {steps[activeSlide]?.subtitle}
              </p>

              {steps[activeSlide]?.isTerminal ? (
                <div className="bg-slate-900 border border-purple-500/40 rounded-2xl p-6 font-mono text-xs sm:text-sm text-cyan-300 shadow-inner leading-relaxed overflow-x-auto relative group">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-purple-500/20 text-[10px] text-purple-400 font-bold uppercase tracking-widest">
                    <span>⚠️ INTERCEPTED SCAM TRAP</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                  </div>
                  "{steps[activeSlide]?.content}"
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 text-slate-100 text-base sm:text-lg leading-relaxed font-normal">
                  {steps[activeSlide]?.content}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-8 mt-4 border-t border-white/10 font-mono">
              <button 
                onClick={() => setActiveSlide(s => Math.max(0, s - 1))}
                disabled={activeSlide === 0}
                className="px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-20 font-black text-xs uppercase transition-all cursor-pointer tracking-wider"
              >
                ← Back
              </button>

              <button 
                onClick={handleFinishStep}
                className="btn-primary py-4 px-10 text-xs sm:text-sm font-black flex items-center gap-2 cursor-pointer shadow-[0_0_30px_rgba(34,211,238,0.5)]"
              >
                <span>{activeSlide === steps.length - 1 ? "🎉 Secure Clearance XP" : "Next Protocol ➔"}</span>
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* Gamified Level-Up Victory Modal - True Viewport Portal Overlay */}
      {mounted && victoryReward && createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl animate-fade-in select-none">
          <div className="glass-card max-w-md w-full p-8 text-center relative bg-slate-950 border border-cyan-400 shadow-[0_0_90px_rgba(34,211,238,0.4)] rounded-3xl animate-scale-up my-auto">
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-tr from-amber-400 to-cyan-400 p-1 shadow-lg animate-bounce flex items-center justify-center text-5xl">
              🏆
            </div>
            
            <span className="bg-cyan-500/20 border border-cyan-400 text-cyan-300 text-[11px] font-mono font-black px-3.5 py-1 rounded-full uppercase tracking-widest block w-fit mx-auto mb-4">
              ✨ Security Clearance Secured
            </span>

            <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white mb-2">
              {victoryReward.title}
            </h2>

            <p className="text-slate-300 text-sm mb-6 font-medium">
              You mastered this threat vector and upgraded your family network defense shield!
            </p>

            <div className="bg-slate-900/90 border border-amber-500/40 p-4 rounded-2xl mb-8 flex items-center justify-around font-mono">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Reward</span>
                <span className="text-2xl font-black text-amber-400">+{victoryReward.xp} XP</span>
              </div>
              <div className="w-px h-10 bg-white/10"></div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Threat Status</span>
                <span className="text-2xl font-black text-emerald-400">NEUTRALIZED</span>
              </div>
            </div>

            <button
              onClick={() => {
                triggerVictory();
                setTimeout(() => setVictoryReward(null), 1200);
              }}
              className="w-full py-4 bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 text-slate-950 hover:opacity-95 text-xs font-mono font-black uppercase tracking-wider cursor-pointer rounded-2xl shadow-[0_0_40px_rgba(52,211,153,0.6)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <span>✨ Collect Victory Reward ✨</span>
            </button>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
