"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '@/components/AuthProvider';
import { LESSONS } from '@/data/content';
import ScrollReveal from '@/components/ScrollReveal';
import { BookOpen, CheckCircle2, ChevronRight, Sparkles, Layers, Lock, ArrowUpRight, ChevronDown, Shield, ShieldAlert, Smartphone, Wifi, CreditCard, Terminal, Radio, Zap, Activity, Award, FileText, MessageSquare, AlertTriangle, Eye, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

function getLessonText(content) {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content.map(c => typeof c === 'string' ? c : c.value || '').join(' ');
  }
  return '';
}

function getLessonLucideIcon(id) {
  switch (id % 8) {
    case 1: return <MessageSquare className="text-cyan-400" size={28} />;
    case 2: return <CreditCard className="text-purple-400" size={28} />;
    case 3: return <Smartphone className="text-rose-400" size={28} />;
    case 4: return <Lock className="text-amber-400" size={28} />;
    case 5: return <Wifi className="text-emerald-400" size={28} />;
    case 6: return <Terminal className="text-cyan-300" size={28} />;
    case 7: return <ShieldAlert className="text-rose-400" size={28} />;
    default: return <Shield className="text-purple-400" size={28} />;
  }
}

const getDeckForTier = (tierKey) => {
  if (tierKey === 'beginner') return LESSONS.filter(l => (l.difficulty || '').toLowerCase().includes('begin') || (l.difficulty || '').toLowerCase().includes('easy'));
  if (tierKey === 'medium') return LESSONS.filter(l => (l.difficulty || '').toLowerCase().includes('inter') || (l.difficulty || '').toLowerCase().includes('med'));
  const adv = LESSONS.filter(l => !(l.difficulty || '').toLowerCase().includes('begin') && !(l.difficulty || '').toLowerCase().includes('inter') && !(l.difficulty || '').toLowerCase().includes('easy') && !(l.difficulty || '').toLowerCase().includes('med'));
  return adv.length ? adv : LESSONS.slice(6, 8);
};

export default function LearnPage() {
  const { completedLessons, markLessonComplete } = useAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [selectedLessons, setSelectedLessons] = useState(() => ({
    beginner: getDeckForTier('beginner')[0],
    medium: getDeckForTier('medium')[0],
    advanced: getDeckForTier('advanced')[0],
  }));

  const [tierSlides, setTierSlides] = useState({
    beginner: 0,
    medium: 0,
    advanced: 0,
  });

  const [isSpinning, setIsSpinning] = useState(false);
  const [victoryReward, setVictoryReward] = useState(null);
  const [wheelDegrees, setWheelDegrees] = useState(0);

  const beginnerDeck = getDeckForTier('beginner');
  const mediumDeck = getDeckForTier('medium');
  const advancedDeck = getDeckForTier('advanced');

  const triggerVictory = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#22d3ee', '#10b981', '#8b5cf6', '#ffb300']
    });
  };

  const handleSelectLesson = (tierKey, lesson) => {
    setSelectedLessons(prev => ({ ...prev, [tierKey]: lesson }));
    setTierSlides(prev => ({ ...prev, [tierKey]: 0 }));
  };

  const startWheelSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    const extraSpins = 1440 + Math.floor(Math.random() * 360);
    setWheelDegrees(prev => prev + extraSpins);

    setTimeout(() => {
      setIsSpinning(false);
      const randomIndex = Math.floor(Math.random() * LESSONS.length);
      const randomLesson = LESSONS[randomIndex];
      
      const diff = (randomLesson.difficulty || '').toLowerCase();
      let targetTier = 'beginner';
      if (diff.includes('inter') || diff.includes('med')) targetTier = 'medium';
      else if (!diff.includes('begin') && !diff.includes('easy')) targetTier = 'advanced';

      handleSelectLesson(targetTier, randomLesson);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      const el = document.getElementById(`tier-${targetTier}`);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 2200);
  };

  const getRoadmapSteps = (lesson) => {
    if (!lesson) return [];
    const contentSlides = [];
    
    if (Array.isArray(lesson.content)) {
      lesson.content.forEach((block, idx) => {
        if (!block || !block.value) return;
        let slideTitle = "Threat Vector Briefing";
        let slideSubtitle = "Operational intelligence analysis";
        let slideIcon = <ShieldAlert className="text-cyan-400" size={28} />;
        let isTerm = false;

        if (block.type === 'example') {
          slideTitle = "Intercepted Scam Payload";
          slideSubtitle = "Real trap transcript used by cyber criminals";
          slideIcon = <Terminal className="text-rose-400" size={28} />;
          isTerm = true;
        } else if (block.type === 'tip') {
          slideTitle = "Crucial Safety Directive";
          slideSubtitle = "National emergency defense protocol";
          slideIcon = <AlertTriangle className="text-amber-400" size={28} />;
        } else if (idx > 0) {
          slideTitle = "Tactical Breakdown";
          slideSubtitle = "Psychological manipulation vectors";
          slideIcon = <Activity className="text-purple-400" size={28} />;
        }

        contentSlides.push({
          title: slideTitle,
          subtitle: slideSubtitle,
          content: block.value,
          icon: slideIcon,
          isTerminal: isTerm
        });
      });
    } else {
      contentSlides.push({
        title: "Threat Vector Briefing",
        subtitle: "Operational intelligence analysis",
        content: getLessonText(lesson.content),
        icon: <ShieldAlert className="text-cyan-400" size={28} />
      });
    }

    if (lesson.redFlags && lesson.redFlags.length > 0) {
      contentSlides.push({
        title: "Critical Red Flags",
        subtitle: "Indicators of compromise to detect immediately",
        content: lesson.redFlags.map(rf => `• ${rf}`).join('\n\n'),
        icon: <AlertTriangle className="text-rose-400" size={28} />
      });
    }

    contentSlides.push({
      title: "Ironclad Defense Rule",
      subtitle: "National Household Armor Directive",
      content: lesson.tip || "Never click unsolicited bank verification links sent via WhatsApp or SMS. Always inspect official app credentials.",
      icon: <Shield className="text-emerald-400" size={28} />
    });

    return contentSlides;
  };

  const handleFinishStepInline = (tierKey, lesson, currentSlideIdx, totalSteps) => {
    if (currentSlideIdx < totalSteps - 1) {
      setTierSlides(prev => ({ ...prev, [tierKey]: currentSlideIdx + 1 }));
    } else {
      triggerVictory();
      const diff = (lesson?.difficulty || '').toLowerCase();
      const earnedXp = diff.includes('hard') || diff.includes('elite') || diff.includes('adv') ? 100 : (diff.includes('med') || diff.includes('inter') || diff.includes('tactical') ? 50 : 25);
      markLessonComplete(lesson.id, earnedXp);
      setVictoryReward({ title: lesson.title, xp: earnedXp });
    }
  };

  const renderShowcaseSection = (tierKey, title, subtitle, deck, accentColor, headerIconNode) => {
    if (!deck || !deck.length) return null;

    const currentLesson = selectedLessons[tierKey] || deck[0];
    const currentSlideIdx = tierSlides[tierKey] || 0;
    const steps = getRoadmapSteps(currentLesson);
    const currentStep = steps[currentSlideIdx] || steps[0];

    const doneCount = deck.filter(l => completedLessons.includes(l.id)).length;
    const totalCount = deck.length;
    const pct = Math.round((doneCount / totalCount) * 100) || 0;
    const isLessonDone = completedLessons.includes(currentLesson?.id);

    const theme = {
      beginner: {
        badgeText: "🔵 TIER 1 • BLUE FOUNDATIONS",
        containerBg: "bg-gradient-to-br from-blue-950/30 via-slate-950/90 to-slate-950 border-blue-500/30 shadow-[0_0_80px_rgba(59,130,246,0.15)]",
        cardActiveBg: "bg-gradient-to-r from-blue-950/80 via-slate-900 to-slate-950 border-blue-400 shadow-[0_0_35px_rgba(59,130,246,0.35)] lg:translate-x-2",
        cardHoverBorder: "hover:border-blue-500/50",
        terminalBg: "bg-gradient-to-br from-slate-950 via-blue-950/40 to-black border-blue-500/50 shadow-[0_0_70px_rgba(59,130,246,0.25)]",
        glowColor: "bg-blue-500/15",
        accentText: "text-blue-400",
        accentBg: "bg-blue-500/20 text-blue-300 border-blue-400/50",
        progressGradient: "bg-gradient-to-r from-blue-500 via-cyan-400 to-sky-400 shadow-[0_0_15px_#3b82f6]",
        stepActiveGradient: "bg-gradient-to-r from-blue-400 to-cyan-400 shadow-[0_0_12px_rgba(59,130,246,0.8)]",
        btnGradient: "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black shadow-[0_0_30px_rgba(59,130,246,0.5)]",
      },
      medium: {
        badgeText: "🟣 TIER 2 • PURPLE INTERCEPTION",
        containerBg: "bg-gradient-to-br from-purple-950/30 via-slate-950/90 to-slate-950 border-purple-500/30 shadow-[0_0_80px_rgba(168,85,247,0.15)]",
        cardActiveBg: "bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-950 border-purple-400 shadow-[0_0_35px_rgba(168,85,247,0.35)] lg:translate-x-2",
        cardHoverBorder: "hover:border-purple-500/50",
        terminalBg: "bg-gradient-to-br from-slate-950 via-purple-950/40 to-black border-purple-500/50 shadow-[0_0_70px_rgba(168,85,247,0.25)]",
        glowColor: "bg-purple-500/15",
        accentText: "text-purple-400",
        accentBg: "bg-purple-500/20 text-purple-300 border-purple-400/50",
        progressGradient: "bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-400 shadow-[0_0_15px_#a855f7]",
        stepActiveGradient: "bg-gradient-to-r from-purple-400 to-violet-400 shadow-[0_0_12px_rgba(168,85,247,0.8)]",
        btnGradient: "bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 text-white font-black shadow-[0_0_30px_rgba(168,85,247,0.5)]",
      },
      advanced: {
        badgeText: "🌸 TIER 3 • PINK WARFARE",
        containerBg: "bg-gradient-to-br from-pink-950/30 via-slate-950/90 to-slate-950 border-pink-500/30 shadow-[0_0_80px_rgba(236,72,153,0.15)]",
        cardActiveBg: "bg-gradient-to-r from-pink-950/80 via-slate-900 to-slate-950 border-pink-400 shadow-[0_0_35px_rgba(236,72,153,0.35)] lg:translate-x-2",
        cardHoverBorder: "hover:border-pink-500/50",
        terminalBg: "bg-gradient-to-br from-slate-950 via-pink-950/40 to-black border-pink-500/50 shadow-[0_0_70px_rgba(236,72,153,0.25)]",
        glowColor: "bg-pink-500/15",
        accentText: "text-pink-400",
        accentBg: "bg-pink-500/20 text-pink-300 border-pink-400/50",
        progressGradient: "bg-gradient-to-r from-pink-500 via-rose-400 to-fuchsia-400 shadow-[0_0_15px_#ec4899]",
        stepActiveGradient: "bg-gradient-to-r from-pink-400 to-rose-400 shadow-[0_0_12px_rgba(236,72,153,0.8)]",
        btnGradient: "bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white font-black shadow-[0_0_30px_rgba(236,72,153,0.5)]",
      }
    }[tierKey] || {
      badgeText: "CLASSIFIED SECURITY DOSSIER",
      containerBg: "bg-slate-950 border-white/10",
      cardActiveBg: "bg-slate-900 border-cyan-400",
      cardHoverBorder: "hover:border-white/30",
      terminalBg: "bg-slate-950 border-purple-500/40",
      glowColor: "bg-cyan-500/10",
      accentText: "text-cyan-400",
      accentBg: "bg-cyan-500/20 text-cyan-300",
      progressGradient: "bg-cyan-400",
      stepActiveGradient: "bg-cyan-400",
      btnGradient: "btn-primary",
    };

    return (
      <ScrollReveal>
        <div id={`tier-${tierKey}`} className={`mb-24 select-none group/tier scroll-mt-28 p-6 sm:p-10 rounded-[3rem] border backdrop-blur-xl transition-all hover-glow-border ${theme.containerBg}`}>
          {/* Tier Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-white/10 gap-6">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-3xl border shadow-xl ${theme.accentBg}`}>
              {headerIconNode}
            </div>
            <div>
              <span className={`text-xs font-mono font-black tracking-[0.25em] uppercase block mb-1 ${theme.accentText}`}>
                {theme.badgeText}
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold font-heading text-white mt-0.5 flex flex-wrap items-center gap-3">
                <span>{title}</span>
              </h2>
              <p className="text-slate-300 text-sm font-normal mt-1 max-w-xl">{subtitle}</p>
            </div>
          </div>

          <div className="bg-slate-950/95 p-4 sm:px-6 sm:py-4 rounded-3xl border border-white/15 shadow-2xl flex flex-col gap-2.5 w-full md:w-auto min-w-[280px]">
            <div className="flex items-center justify-between text-xs font-mono font-black uppercase tracking-wider gap-4">
              <span className="text-slate-300 flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${theme.accentBg.split(' ')[0]} ${doneCount > 0 ? "animate-ping" : ""}`}></span>
                <span>Tier Clearance</span>
              </span>
              <span className={`px-3 py-1 rounded-xl border border-white/10 font-black text-xs ${theme.accentText} bg-white/5`}>
                {doneCount}/{totalCount} Complete ({pct}%)
              </span>
            </div>
            
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden relative shadow-inner">
              <div 
                style={{ width: `${pct}%` }}
                className={`h-full rounded-full transition-all duration-700 ${theme.progressGradient}`}
              ></div>
            </div>
          </div>
        </div>

        {/* BENTO GRID LAYOUT: Left Side Deck Track (5 Col) + Right Side Inspection Terminal (7 Col) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT BENTO BOX (5 Col): Horizontal/Vertical Lesson Selector Track */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className={`text-xs font-mono font-bold uppercase tracking-widest flex items-center justify-between px-2 ${theme.accentText}`}>
              <span>DECK DOSSIERS ({deck.length})</span>
              <span className="text-white/40 text-[10px]">SWEEP & CLICK</span>
            </div>

            <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-x-visible lg:max-h-[620px] lg:overflow-y-auto pr-2 pb-4 lg:pb-0 scrollbar-none no-scrollbar">
              {deck.map((lesson) => {
                const isSelected = currentLesson?.id === lesson.id;
                const isDone = completedLessons.includes(lesson.id);
                return (
                  <div
                    key={lesson.id}
                    onClick={() => handleSelectLesson(tierKey, lesson)}
                    className={`w-[290px] sm:w-[340px] lg:w-full shrink-0 p-6 rounded-3xl cursor-pointer transition-all duration-300 border flex flex-col justify-between gap-4 relative group ${
                      isSelected 
                        ? theme.cardActiveBg 
                        : `bg-slate-950/80 border-white/10 ${theme.cardHoverBorder} hover:bg-slate-900/60`
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shrink-0 border ${isSelected ? theme.accentBg + ' scale-110 shadow-lg' : 'bg-white/[0.04] text-slate-400 border-white/10 group-hover:scale-105'}`}>
                        {getLessonLucideIcon(lesson.id)}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest">DOSSIER #{lesson.id}</span>
                        {isDone ? (
                          <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                            <CheckCircle2 size={10} /> VERIFIED
                          </span>
                        ) : (
                          <span className={`border text-[9px] font-mono font-semibold px-2.5 py-0.5 rounded-full ${isSelected ? theme.accentBg : 'bg-white/[0.04] border-white/10 text-slate-300'}`}>
                            +{tierKey === 'advanced' ? 100 : (tierKey === 'medium' ? 50 : 25)} PTS
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className={`text-lg font-bold font-heading transition-colors leading-snug ${isSelected ? theme.accentText : 'text-white group-hover:text-white'}`}>
                        {lesson.title}
                      </h3>
                      <p className="text-slate-300 text-xs line-clamp-2 leading-relaxed mt-1 font-normal opacity-90">
                        {getLessonText(lesson.content).slice(0, 100)}...
                      </p>
                    </div>

                    <div className={`pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider ${theme.accentText}`}>
                      <span>{isSelected ? 'ACTIVE IN TERMINAL ➔' : 'CLICK TO INSPECT'}</span>
                      {isSelected && <span className={`w-2 h-2 rounded-full ${theme.accentText.replace('text-', 'bg-')} animate-ping`}></span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT BENTO BOX (7 Col): Expanded Inline Inspection Terminal (No Popups!) */}
          <div className={`lg:col-span-7 p-6 sm:p-10 relative rounded-3xl flex flex-col justify-between min-h-[560px] border backdrop-blur-2xl transition-all ${theme.terminalBg}`}>
            <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none ${theme.glowColor}`}></div>

            <div>
              {/* Terminal Header */}
              <div className="flex flex-wrap items-center justify-between pb-6 mb-8 border-b border-white/10 gap-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3.5 rounded-2xl border shadow-md ${theme.accentBg}`}>
                    {getLessonLucideIcon(currentLesson?.id || 1)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-widest font-mono ${theme.accentText}`}>ACTIVE DOSSIER #{currentLesson?.id}</span>
                      {isLessonDone && <span className="bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">CLEARANCE SECURED</span>}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold font-heading text-white mt-1 leading-tight">{currentLesson?.title}</h3>
                  </div>
                </div>
              </div>

              {/* Stepper Tabs */}
              <div className="flex items-center gap-2 mb-8">
                {steps.map((st, i) => (
                  <button
                    key={i}
                    onClick={() => setTierSlides(prev => ({ ...prev, [tierKey]: i }))}
                    className="flex-1 h-2.5 rounded-full overflow-hidden bg-white/10 cursor-pointer relative group/step"
                    title={st.title}
                  >
                    <div className={`h-full transition-all duration-300 ${i <= currentSlideIdx ? theme.stepActiveGradient : "w-0 group-hover/step:w-full group-hover/step:bg-white/20"}`}></div>
                  </button>
                ))}
              </div>

              {/* Step Slide Content */}
              <div className="min-h-[250px] flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  {currentStep?.icon}
                  <h4 className={`text-lg sm:text-xl font-bold uppercase tracking-wider font-heading ${theme.accentText}`}>
                    {currentStep?.title}
                  </h4>
                </div>

                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-5 font-mono">
                  {currentStep?.subtitle} • Step {currentSlideIdx + 1} of {steps.length}
                </p>

                {currentStep?.isTerminal ? (
                  <div className="bg-slate-900/95 border border-white/15 rounded-2xl p-6 font-mono text-xs sm:text-sm text-cyan-300 shadow-inner leading-relaxed overflow-x-auto relative whitespace-pre-line">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-[10px] text-purple-400 font-bold uppercase tracking-widest">
                      <span>INTERCEPTED SCAM PAYLOAD</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                    </div>
                    "{currentStep?.content}"
                  </div>
                ) : (
                  <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 sm:p-8 text-slate-100 text-base sm:text-lg leading-relaxed font-normal whitespace-pre-line shadow-sm">
                    {currentStep?.content}
                  </div>
                )}
              </div>
            </div>

            {/* Terminal Actions */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-white/10 font-mono gap-4">
              <button 
                onClick={() => setTierSlides(prev => ({ ...prev, [tierKey]: Math.max(0, currentSlideIdx - 1) }))}
                disabled={currentSlideIdx === 0}
                className="px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-20 font-semibold text-xs uppercase transition-all cursor-pointer tracking-wider"
              >
                ← Previous Step
              </button>

              <button 
                onClick={() => handleFinishStepInline(tierKey, currentLesson, currentSlideIdx, steps.length)}
                className={`py-4 px-8 sm:px-10 text-xs sm:text-sm rounded-2xl flex items-center gap-2 cursor-pointer transition-all transform hover:-translate-y-0.5 ${theme.btnGradient}`}
              >
                <span>{currentSlideIdx === steps.length - 1 ? (isLessonDone ? "Re-Verify Clearance XP" : "Secure Clearance Points") : "Next Directive ➔"}</span>
              </button>
            </div>
          </div>

        </div>
      </div>
      </ScrollReveal>
    );
  };

  return (
    <div className="max-w-7xl mx-auto pb-44 pt-4 px-4 sm:px-6 select-none animate-fade-in">
      
      {/* Hero Banner with Interactive Scanner Radar */}
      <ScrollReveal>
        <div className="glass-card p-8 md:p-14 mb-14 relative overflow-hidden bg-gradient-to-r from-purple-950/40 via-slate-950 to-slate-900 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/15 shadow-2xl hover-lift">
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] px-4 py-1.5 rounded-full text-xs font-semibold text-cyan-300 tracking-widest uppercase mb-6 shadow-lg font-mono">
              <Activity size={14} className="text-cyan-400 animate-pulse" /> National Defense Curriculum
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-heading mb-4 leading-[1.06] text-white tracking-tight">
              Bento Security <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500">
                Intelligence Decks
              </span>
            </h1>
            
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
              Explore classified security dossiers below arranged in our master-detail Bento Matrix. Sweep or click any dossier on the left to immediately inspect its threat mechanics inside the inline terminal on the right!
            </p>
          </div>

          <div className="relative flex flex-col items-center justify-center shrink-0 animate-floating">
            <div 
              onClick={startWheelSpin}
              className="w-56 h-56 rounded-full relative cursor-pointer group flex items-center justify-center transition-all hover:scale-105 select-none"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 p-0.5 shadow-[0_0_50px_rgba(34,211,238,0.25)]">
                <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className={`absolute inset-0 border border-cyan-400/20 rounded-full ${isSpinning ? "animate-spin" : ""}`} style={{ transform: `rotate(${wheelDegrees}deg)`, transition: isSpinning ? "transform 2.2s cubic-bezier(0.1, 0.9, 0.2, 1)" : "none" }}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]"></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-purple-400 rounded-full"></div>
                  </div>
                  
                  <Radio size={36} className={`text-cyan-400 mb-2 ${isSpinning ? "animate-ping" : ""}`} />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">{isSpinning ? "SCANNING..." : "THREAT RADAR"}</span>
                  <span className="text-[9px] font-mono text-cyan-400/80 uppercase tracking-widest mt-1">INITIALIZE RANDOM</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </ScrollReveal>

      {/* 3 BENTO MATRIX ROWS */}
      <div className="space-y-12 pt-4">
        {renderShowcaseSection("beginner", "Tier 1: Foundations", "Essential Household Defense", beginnerDeck, "emerald", <Shield className="text-emerald-400" size={28} />)}
        {renderShowcaseSection("medium", "Tier 2: Interception", "Advanced Threat Mitigation", mediumDeck, "amber", <Activity className="text-amber-400" size={28} />)}
        {renderShowcaseSection("advanced", "Tier 3: Elite Warfare", "Complex Vector Neutralization", advancedDeck.length ? advancedDeck : LESSONS.slice(6, 8), "rose", <Zap className="text-rose-400" size={28} />)}
      </div>

      {mounted && victoryReward && createPortal(
        <div className="fixed inset-0 z-[999999] overflow-y-auto bg-black/85 backdrop-blur-2xl animate-fade-in select-none p-4 sm:p-6 flex">
          <div className="glass-card max-w-md w-full p-8 text-center relative bg-slate-950 border border-cyan-400 shadow-[0_0_90px_rgba(34,211,238,0.4)] rounded-3xl animate-scale-up m-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-white/[0.04] border border-white/10 shadow-lg flex items-center justify-center text-cyan-400">
              <Award size={44} />
            </div>
            
            <span className="bg-cyan-500/20 border border-cyan-400 text-cyan-300 text-[11px] font-mono font-bold px-3.5 py-1 rounded-full uppercase tracking-widest block w-fit mx-auto mb-4">
              Security Clearance Verified
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white mb-2">
              {victoryReward.title}
            </h2>

            <p className="text-slate-300 text-sm mb-6 font-normal">
              You analyzed this threat vector and fortified your household cyber shield.
            </p>

            <div className="bg-slate-900/90 border border-white/10 p-4 rounded-2xl mb-8 flex items-center justify-around font-mono">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Clearance</span>
                <span className="text-xl font-bold text-cyan-400">+{victoryReward.xp} PTS</span>
              </div>
              <div className="w-px h-10 bg-white/10"></div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Vector Status</span>
                <span className="text-xl font-bold text-emerald-400">NEUTRALIZED</span>
              </div>
            </div>

            <button
              onClick={() => {
                triggerVictory();
                setTimeout(() => setVictoryReward(null), 1200);
              }}
              className="btn-primary w-full py-4 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer rounded-2xl shadow-[0_0_40px_rgba(34,211,238,0.4)] transition-all flex items-center justify-center gap-2"
            >
              <span>Collect Clearance Points</span>
            </button>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
