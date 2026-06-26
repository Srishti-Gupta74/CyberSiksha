"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import ScrollReveal from '@/components/ScrollReveal';
import { LESSONS } from '@/data/content';
import { Flame, Shield, Trophy, ChevronRight, BookOpen, ShieldQuestion, Newspaper, MessageSquareText, UserPlus, CheckCircle2, AlertTriangle, Activity, Lock } from 'lucide-react';

const CYBER_FACTS = [
  "Over 70% of Indian retirees targeted by phone scams lose money within 15 minutes.",
  "Fraudsters clone AI voices using just 3 seconds of audio from public Instagram Reels.",
  "Banks will NEVER ask for your 6-digit WhatsApp OTP over a phone call.",
  "India's National Cyber Crime Helpline is 1930 — dial it immediately if defrauded!",
  "Over ₹1,200 Crore was saved by Indian cyber cells last quarter through prompt reporting.",
  "Always check for official 'App Store' badges before downloading banking software.",
  "SIM Swap scammers often use fake Aadhaar cards to disable victims' mobile networks.",
  "Enabling 2-Factor Authentication stops 99.9% of automated social media hacking attempts."
];

const HERO_THREATS = [
  "Digital Arrest & Voice Fraud",
  "Fake WhatsApp CBI Notices",
  "Cloned AI Family Extortion",
  "Malicious UPI Payment Links",
  "Sideloaded APK Loan Traps"
];

function HeroSection() {
  const [threatIdx, setThreatIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const target = HERO_THREATS[threatIdx];
    const speed = deleting ? 35 : 65;

    const t = setTimeout(() => {
      if (!deleting && typed === target) {
        setTimeout(() => setDeleting(true), 3200);
      } else if (deleting && typed === "") {
        setDeleting(false);
        setThreatIdx((prev) => (prev + 1) % HERO_THREATS.length);
      } else {
        setTyped(target.substring(0, typed.length + (deleting ? -1 : 1)));
      }
    }, speed);
    return () => clearTimeout(t);
  }, [typed, deleting, threatIdx]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 md:py-20 text-center select-none overflow-hidden">
      
      {/* Breathtaking Calligraphic Brand Typography Header */}
      <div className="relative mx-auto mb-10 text-center select-none py-2">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-24 bg-gradient-to-r from-cyan-400/20 via-purple-500/25 to-pink-500/20 blur-3xl opacity-90 rounded-full animate-pulse pointer-events-none"></div>
        
        <div className="relative inline-flex flex-col items-center">
          <span className="text-[11px] font-mono font-black tracking-[0.4em] uppercase text-cyan-400/90 mb-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            THE NATIONAL SHIELD INITIATIVE
          </span>
          <h2 className="text-5xl sm:text-7xl md:text-8xl font-black font-['Outfit'] tracking-tight drop-shadow-[0_0_40px_rgba(34,211,238,0.45)] select-none">
            <span className="text-white">Cyber</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-400 font-serif italic pr-2 font-normal">Siksha</span>
          </h2>
          <div className="w-48 sm:w-64 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mt-2 rounded-full shadow-[0_0_15px_#00f0ff] animate-pulse"></div>
        </div>
      </div>

      <ScrollReveal>
        <div className="inline-flex items-center gap-2.5 bg-cyan-500/20 border border-cyan-400/50 px-6 py-2.5 rounded-full text-xs font-black text-cyan-300 mb-8 uppercase tracking-[0.2em] shadow-[0_0_35px_rgba(34,211,238,0.3)] backdrop-blur-md font-mono">
          <Activity size={15} className="animate-pulse text-cyan-400" /> NEXT-GEN HOUSEHOLD CYBER ARMOR • LIVE DEFENSE GRID
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-['Outfit'] text-white tracking-tight mb-8 leading-[1.15]">
          Shield Your Family From <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-300 to-purple-400 inline-block min-h-[1.25em] drop-shadow-sm">
            {typed || "Digital Arrest"}
          </span>
          <span className="text-cyan-400 font-mono animate-pulse font-normal ml-1 inline-block">|</span>
        </h1>
      </ScrollReveal>

      <ScrollReveal>
        <p className="text-slate-200 text-lg sm:text-2xl max-w-3xl mx-auto font-normal leading-relaxed mb-14 opacity-95">
          CyberSiksha gamifies cybersecurity for the Indian household. Train parents and grandparents to spot fake CBI investigations, WhatsApp extortion, and UPI traps before money leaves their bank.
        </p>
      </ScrollReveal>

      <ScrollReveal>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 max-w-lg mx-auto mb-24">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open_auth_modal', { detail: { isLogin: false } }))}
            className="w-full sm:w-auto flex-1 py-4 px-10 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:opacity-95 text-slate-950 font-black font-['Outfit'] rounded-full text-sm uppercase tracking-wider shadow-[0_0_40px_rgba(52,211,153,0.6)] transition-all transform hover:-translate-y-1 cursor-pointer"
          >
            🚀 Sign Up Free
          </button>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open_auth_modal', { detail: { isLogin: true } }))}
            className="w-full sm:w-auto flex-1 py-4 px-10 bg-slate-900/90 hover:bg-slate-800 text-white font-black font-['Outfit'] rounded-full border border-cyan-400/40 text-sm uppercase tracking-wider transition-all cursor-pointer shadow-2xl hover:border-cyan-300"
          >
            🔑 Sign In
          </button>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <div className="border-t border-white/10 pt-20 text-left">
          <h2 className="text-3xl sm:text-5xl font-black font-['Outfit'] text-center text-white mb-4 tracking-tight">
            CyberSiksha — Learn to Outsmart Scams
          </h2>
          <p className="text-center text-slate-300 text-base sm:text-xl mb-14 max-w-2xl mx-auto font-normal">
            India's most comprehensive gamified digital defense curriculum designed for the entire household.
          </p>

          {/* Interactive Magnetic Parallax Cursor-Tracked Floating Deck */}
          <div 
            onMouseMove={(e) => {
              const el = e.currentTarget;
              const rect = el.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const pct = Math.max(0, Math.min(1, x / rect.width));
              el.scrollLeft = pct * (el.scrollWidth - el.clientWidth);
            }}
            className="flex overflow-x-auto gap-8 pb-16 pt-8 px-4 sm:px-8 select-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden cursor-ew-resize transition-all duration-75"
          >
            {/* Card 1: LEARN */}
            <div 
              onClick={() => window.dispatchEvent(new CustomEvent('open_auth_modal', { detail: { isLogin: false } }))}
              className="w-[300px] sm:w-[340px] shrink-0 glass-card p-8 bg-slate-900/90 border-cyan-500/50 flex flex-col justify-between transition-all duration-300 hover:-translate-y-3 hover:border-cyan-400 hover:shadow-[0_25px_60px_rgba(34,211,238,0.3)] shadow-2xl relative group overflow-hidden border-2 rounded-3xl cursor-pointer"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_15px_rgba(34,211,238,0.8)]"></div>
              <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/25 transition-all"></div>
              <div>
                <div className="flex items-center gap-3.5 mb-6 pt-2">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(34,211,238,0.4)] shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all">
                    📖
                  </div>
                  <div>
                    <h3 className="font-black text-2xl font-['Outfit'] text-white group-hover:text-cyan-300 transition-colors">LEARN</h3>
                    <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider font-mono">Bite-Sized Lessons</span>
                  </div>
                </div>
                <ul className="space-y-3.5 text-sm text-slate-200 font-medium mb-8 leading-relaxed">
                  <li className="flex items-start gap-3"><span className="text-cyan-400 font-black shrink-0 mt-0.5">✔</span> Story-driven lessons showing how scams work step by step</li>
                  <li className="flex items-start gap-3"><span className="text-cyan-400 font-black shrink-0 mt-0.5">✔</span> Categories: SMS traps, UPI fraud, calls, job offers</li>
                  <li className="flex items-start gap-3"><span className="text-cyan-400 font-black shrink-0 mt-0.5">✔</span> Simple plain language designed for beginners</li>
                  <li className="flex items-start gap-3"><span className="text-cyan-400 font-black shrink-0 mt-0.5">✔</span> 3–5 min per lesson with clear protection tips</li>
                </ul>
              </div>
              <div className="pt-4 border-t border-white/10 text-xs font-black text-cyan-300 inline-flex items-center gap-1.5 group-hover:translate-x-2 transition-transform uppercase tracking-wider">
                <span>🔒 Sign Up Free to Unlock</span> ➔
              </div>
            </div>

            {/* Card 2: QUIZ */}
            <div 
              onClick={() => window.dispatchEvent(new CustomEvent('open_auth_modal', { detail: { isLogin: false } }))}
              className="w-[300px] sm:w-[340px] shrink-0 glass-card p-8 bg-slate-900/90 border-purple-500/50 flex flex-col justify-between transition-all duration-300 hover:-translate-y-3 hover:border-purple-400 hover:shadow-[0_25px_60px_rgba(168,85,247,0.3)] shadow-2xl relative group overflow-hidden border-2 rounded-3xl cursor-pointer"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-400 to-pink-500 shadow-[0_0_15px_rgba(168,85,247,0.8)]"></div>
              <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/25 transition-all"></div>
              <div>
                <div className="flex items-center gap-3.5 mb-6 pt-2">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/50 text-purple-300 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(168,85,247,0.4)] shrink-0 group-hover:scale-110 group-hover:-rotate-6 transition-all">
                    🎮
                  </div>
                  <div>
                    <h3 className="font-black text-2xl font-['Outfit'] text-white group-hover:text-purple-300 transition-colors">QUIZ</h3>
                    <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider font-mono">Gamified Challenges</span>
                  </div>
                </div>
                <ul className="space-y-3.5 text-sm text-slate-200 font-medium mb-8 leading-relaxed">
                  <li className="flex items-start gap-3"><span className="text-purple-400 font-black shrink-0 mt-0.5">✔</span> Realistic Indian scam scenarios (SMS, UPI, voice calls)</li>
                  <li className="flex items-start gap-3"><span className="text-purple-400 font-black shrink-0 mt-0.5">✔</span> Choose "Safe" or "Scam?" with instant feedback</li>
                  <li className="flex items-start gap-3"><span className="text-purple-400 font-black shrink-0 mt-0.5">✔</span> Earn XP points, Scam IQ, streaks & levels</li>
                  <li className="flex items-start gap-3"><span className="text-purple-400 font-black shrink-0 mt-0.5">✔</span> Wrong answers teach red flag identification</li>
                </ul>
              </div>
              <div className="pt-4 border-t border-white/10 text-xs font-black text-purple-300 inline-flex items-center gap-1.5 group-hover:translate-x-2 transition-transform uppercase tracking-wider">
                <span>🔒 Sign Up Free to Play</span> ➔
              </div>
            </div>

            {/* Card 3: NEWS */}
            <div 
              onClick={() => window.dispatchEvent(new CustomEvent('open_auth_modal', { detail: { isLogin: false } }))}
              className="w-[300px] sm:w-[340px] shrink-0 glass-card p-8 bg-slate-900/90 border-pink-500/50 flex flex-col justify-between transition-all duration-300 hover:-translate-y-3 hover:border-pink-400 hover:shadow-[0_25px_60px_rgba(236,72,153,0.3)] shadow-2xl relative group overflow-hidden border-2 rounded-3xl cursor-pointer"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-400 to-rose-500 shadow-[0_0_15px_rgba(236,72,153,0.8)]"></div>
              <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-pink-500/25 transition-all"></div>
              <div>
                <div className="flex items-center gap-3.5 mb-6 pt-2">
                  <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-400/50 text-pink-300 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(236,72,153,0.4)] shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all">
                    📰
                  </div>
                  <div>
                    <h3 className="font-black text-2xl font-['Outfit'] text-white group-hover:text-pink-300 transition-colors">NEWS</h3>
                    <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider font-mono">Scam Alerts Feed</span>
                  </div>
                </div>
                <ul className="space-y-3.5 text-sm text-slate-200 font-medium mb-8 leading-relaxed">
                  <li className="flex items-start gap-3"><span className="text-pink-400 font-black shrink-0 mt-0.5">✔</span> Curated feed of latest cyber scam trends across India</li>
                  <li className="flex items-start gap-3"><span className="text-pink-400 font-black shrink-0 mt-0.5">✔</span> Explains what it is, how it works, and prevention</li>
                  <li className="flex items-start gap-3"><span className="text-pink-400 font-black shrink-0 mt-0.5">✔</span> Written in plain language, zero jargon</li>
                  <li className="flex items-start gap-3"><span className="text-pink-400 font-black shrink-0 mt-0.5">✔</span> Links directly to related scenario testing</li>
                </ul>
              </div>
              <div className="pt-4 border-t border-white/10 text-xs font-black text-pink-300 inline-flex items-center gap-1.5 group-hover:translate-x-2 transition-transform uppercase tracking-wider">
                <span>🔒 Sign Up Free to Read</span> ➔
              </div>
            </div>

            {/* Card 4: ASK AI */}
            <div 
              onClick={() => window.dispatchEvent(new CustomEvent('open_auth_modal', { detail: { isLogin: false } }))}
              className="w-[300px] sm:w-[340px] shrink-0 glass-card p-8 bg-slate-900/90 border-amber-500/50 flex flex-col justify-between transition-all duration-300 hover:-translate-y-3 hover:border-amber-400 hover:shadow-[0_25px_60px_rgba(245,158,11,0.3)] shadow-2xl relative group overflow-hidden border-2 rounded-3xl cursor-pointer"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_0_15px_rgba(245,158,11,0.8)]"></div>
              <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/25 transition-all"></div>
              <div>
                <div className="flex items-center gap-3.5 mb-6 pt-2">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/50 text-amber-300 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(245,158,11,0.4)] shrink-0 group-hover:scale-110 group-hover:-rotate-6 transition-all">
                    🤖
                  </div>
                  <div>
                    <h3 className="font-black text-2xl font-['Outfit'] text-white group-hover:text-amber-300 transition-colors">ASK AI</h3>
                    <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider font-mono">Doubt Clearance Bot</span>
                  </div>
                </div>
                <ul className="space-y-3.5 text-sm text-slate-200 font-medium mb-8 leading-relaxed">
                  <li className="flex items-start gap-3"><span className="text-amber-400 font-black shrink-0 mt-0.5">✔</span> AI mentor powered by Google Gemini 2.0</li>
                  <li className="flex items-start gap-3"><span className="text-amber-400 font-black shrink-0 mt-0.5">✔</span> Instant answers to any cybersecurity doubt</li>
                  <li className="flex items-start gap-3"><span className="text-amber-400 font-black shrink-0 mt-0.5">✔</span> Warm, simple analogies for everyday clarity</li>
                  <li className="flex items-start gap-3"><span className="text-amber-400 font-black shrink-0 mt-0.5">✔</span> Handles Hindi, English & Hinglish naturally</li>
                </ul>
              </div>
              <div className="pt-4 border-t border-white/10 text-xs font-black text-amber-300 inline-flex items-center gap-1.5 group-hover:translate-x-2 transition-transform uppercase tracking-wider">
                <span>🔒 Sign Up Free to Ask</span> ➔
              </div>
            </div>

            {/* Card 5: FAMILY DASHBOARD */}
            <div 
              onClick={() => window.dispatchEvent(new CustomEvent('open_auth_modal', { detail: { isLogin: false } }))}
              className="w-[300px] sm:w-[340px] shrink-0 glass-card p-8 bg-slate-900/90 border-emerald-500/50 flex flex-col justify-between transition-all duration-300 hover:-translate-y-3 hover:border-emerald-400 hover:shadow-[0_25px_60px_rgba(16,185,129,0.3)] shadow-2xl relative group overflow-hidden border-2 rounded-3xl cursor-pointer"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 to-teal-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]"></div>
              <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/25 transition-all"></div>
              <div>
                <div className="flex items-center gap-3.5 mb-6 pt-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(16,185,129,0.4)] shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all">
                    👨‍👩‍👧‍👦
                  </div>
                  <div>
                    <h3 className="font-black text-2xl font-['Outfit'] text-white group-hover:text-emerald-300 transition-colors">FAMILY</h3>
                    <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider font-mono">Defense Roster</span>
                  </div>
                </div>
                <ul className="space-y-3.5 text-sm text-slate-200 font-medium mb-8 leading-relaxed">
                  <li className="flex items-start gap-3"><span className="text-emerald-400 font-black shrink-0 mt-0.5">✔</span> Invite parents and elders via private copy link</li>
                  <li className="flex items-start gap-3"><span className="text-emerald-400 font-black shrink-0 mt-0.5">✔</span> Track everyone's Scam IQ and quiz accuracy</li>
                  <li className="flex items-start gap-3"><span className="text-emerald-400 font-black shrink-0 mt-0.5">✔</span> Realtime Supabase live network sync</li>
                  <li className="flex items-start gap-3"><span className="text-emerald-400 font-black shrink-0 mt-0.5">✔</span> Nudge family members to complete daily lessons</li>
                </ul>
              </div>
              <div className="pt-4 border-t border-white/10 text-xs font-black text-emerald-300 inline-flex items-center gap-1.5 group-hover:translate-x-2 transition-transform uppercase tracking-wider">
                <span>🔒 Sign Up Free to Join</span> ➔
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}

export default function Home() {
  const { profile, user, completedLessons, loading } = useAuth();
  const [scamIq, setScamIq] = useState(0);
  
  // Typing Ticker Engine
  const [factIndex, setFactIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFact = CYBER_FACTS[factIndex];
    const typingSpeed = isDeleting ? 25 : 55;

    const timer = setTimeout(() => {
      if (!isDeleting && typedText === currentFact) {
        setTimeout(() => setIsDeleting(true), 3500); // Pause on completed sentence
      } else if (isDeleting && typedText === "") {
        setIsDeleting(false);
        setFactIndex((prev) => (prev + 1) % CYBER_FACTS.length);
      } else {
        setTypedText(
          currentFact.substring(0, typedText.length + (isDeleting ? -1 : 1))
        );
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, factIndex]);

  useEffect(() => {
    const totalLessons = LESSONS.length;
    const completedCount = completedLessons.length;
    
    if (totalLessons > 0) {
      const calculatedIq = Math.min(100, Math.round(50 + (completedCount / totalLessons) * 50));
      setTimeout(() => setScamIq(calculatedIq), 500);
    }
  }, [completedLessons]);

  const modules = [
    { title: "Learn", desc: "Bite-sized scam prevention lessons", icon: <BookOpen className="text-cyan-400" size={28} />, path: "/learn", color: "from-cyan-500/20 to-transparent", textHover: "group-hover:text-cyan-300" },
    { title: "Quiz Game", desc: "Test your Scam IQ in real scenarios", icon: <ShieldQuestion className="text-purple-400" size={28} />, path: "/quiz", color: "from-purple-500/20 to-transparent", textHover: "group-hover:text-purple-300" },
    { title: "Scam Alerts", desc: "Latest threats happening in India", icon: <Newspaper className="text-pink-400" size={28} />, path: "/news", color: "from-pink-500/20 to-transparent", textHover: "group-hover:text-pink-300" },
    { title: "Ask AI", desc: "Got a doubt? Ask your cyber mentor", icon: <MessageSquareText className="text-amber-400" size={28} />, path: "/chat", color: "from-amber-500/20 to-transparent", textHover: "group-hover:text-amber-300" },
  ];

  if (loading) {
    return <div className="animate-pulse p-8 text-center text-cyan-400 flex flex-col items-center justify-center min-h-[50vh]">
      <Shield className="animate-bounce mb-4 opacity-50" size={48} />
      <p className="font-['Outfit'] font-bold tracking-widest uppercase">Initializing Security Protocols...</p>
    </div>;
  }

  if (!user) {
    return <HeroSection />;
  }

  const nextLesson = LESSONS.find(l => !completedLessons.includes(l.id));

  return (
    <div className="space-y-8 pb-32 max-w-6xl mx-auto px-4 pt-2 animate-fade-in">
      
      {/* Live Cyber Intelligence Typing Ticker */}
      <div className="glass-card p-4 md:p-5 bg-slate-900/90 border-cyan-400/30 flex items-center gap-4 shadow-[0_0_30px_rgba(34,211,238,0.15)] overflow-hidden">
        <div className="bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 px-3 py-1.5 rounded-xl text-xs font-black shrink-0 flex items-center gap-2 uppercase tracking-wider animate-pulse">
          <Activity size={15} className="text-cyan-400" /> Live Cyber Fact
        </div>
        <div className="font-mono text-xs sm:text-sm text-slate-200 truncate flex-1 flex items-center">
          <span>{typedText}</span>
          <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 animate-pulse"></span>
        </div>
      </div>

      {/* Hero Dashboard - Security Posture Infographic */}
      <ScrollReveal>
        <div className="glass-card p-0 relative overflow-hidden flex flex-col md:flex-row bg-slate-900/60 border-purple-500/30 shadow-2xl">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-to-tr from-cyan-500/10 via-transparent to-purple-500/15 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="p-8 md:p-12 flex-1 relative z-10 border-b md:border-b-0 md:border-r border-white/10">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/40 px-3.5 py-1.5 rounded-full text-xs font-black text-cyan-300 mb-6 shadow-[0_0_15px_rgba(139,92,246,0.3)] uppercase tracking-wider">
              <Activity size={14} className="text-cyan-400 animate-pulse" /> National Defense Shield Active
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black font-['Outfit'] mb-4 leading-[1.1] text-white">
              Welcome, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 drop-shadow">
                {profile?.display_name || user?.email?.split('@')[0] || 'Cyber Defender'}
              </span>
            </h1>
            
            <p className="text-slate-300 text-base max-w-md leading-relaxed mb-8 font-normal">
              CyberSiksha is India's premier interactive digital defense ecosystem. Practice interactive cyber traps to keep your parents and family safe from financial fraud.
            </p>

            <div className="flex items-center gap-8">
              <div>
                <div className="flex items-center gap-2 text-gold font-black text-3xl font-['Outfit']">
                  <Flame className="animate-bounce" /> {profile?.streak || 0}
                </div>
                <div className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">Day Streak</div>
              </div>
              <div className="w-px h-12 bg-white/10"></div>
              <div>
                <div className="flex items-center gap-2 text-emerald font-black text-3xl font-['Outfit']">
                  <Trophy /> {profile?.xp || 0}
                </div>
                <div className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">Safety Points (XP)</div>
              </div>
            </div>
          </div>
          
          <div className="p-8 md:p-12 flex-1 flex flex-col items-center justify-center relative z-10 bg-navy-light/40 backdrop-blur-md">
            <h3 className="text-xs font-black text-cyan uppercase tracking-widest mb-8 self-start md:self-center font-['Outfit']">Family Safety Score</h3>
            
            <div className="relative w-52 h-52 flex items-center justify-center mb-6">
              <div className="absolute inset-0 rounded-full border border-white/10 border-dashed animate-[spin_25s_linear_infinite]"></div>
              <div className="absolute inset-4 rounded-full border border-cyan/40 border-dotted animate-[spin_18s_linear_infinite_reverse]"></div>
              
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                <circle 
                  cx="50" cy="50" r="40" fill="none" 
                  stroke="url(#iqGradient)" 
                  strokeWidth="8" 
                  strokeLinecap="round"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * scamIq) / 100}
                  className="transition-all duration-[2000ms] ease-out drop-shadow-[0_0_15px_rgba(0,242,254,0.6)]"
                />
                <defs>
                  <linearGradient id="iqGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00f2fe" />
                    <stop offset="50%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#9f55ff" />
                  </linearGradient>
                </defs>
              </svg>
              
              <div className="text-center z-10 flex flex-col items-center">
                <Lock className="text-cyan mb-1" size={24} />
                <div className="text-6xl font-black font-['Outfit'] text-white tracking-tight">
                  {scamIq}
                </div>
                <div className="text-[10px] font-black text-cyan uppercase tracking-widest mt-1">Scam IQ</div>
              </div>
            </div>
            
            <div className="w-full max-w-xs bg-navy rounded-full h-2 mt-2 overflow-hidden p-0.5 shadow-inner border border-white/10">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-cyan via-emerald to-violet transition-all duration-1000 shadow-[0_0_12px_rgba(0,242,254,0.8)]"
                style={{ width: `${Math.min(100, (completedLessons.length / LESSONS.length) * 100)}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-3">
              {completedLessons.length} OF {LESSONS.length} GUIDES SECURED
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Modules Grid */}
      <div>
        <ScrollReveal delay={200}>
          <h2 className="text-2xl font-black font-['Outfit'] mb-6 flex items-center gap-3 text-white">
            <div className="w-2.5 h-7 bg-gradient-to-b from-cyan to-violet rounded-full shadow-[0_0_15px_rgba(0,242,254,0.8)]"></div>
            Explore Cyber Ecosystem
          </h2>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {modules.map((m, i) => (
            <ScrollReveal key={m.path} delay={250 + i * 80}>
              <Link href={m.path} className="block group h-full">
                <div className={`glass-card p-8 h-full relative overflow-hidden border border-white/10 group-hover:border-cyan transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 shadow-xl`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${m.color} opacity-0 group-hover:opacity-15 transition-opacity duration-300`}></div>
                  
                  <div className="relative z-10">
                    <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-white/15 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {m.icon}
                    </div>
                    <h3 className={`text-2xl font-black font-['Outfit'] mb-3 transition-colors text-white ${m.textHover}`}>{m.title}</h3>
                    <p className="text-base text-slate-300 mb-6 leading-relaxed font-normal">{m.desc}</p>
                  </div>

                  <div className="relative z-10 flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest group-hover:text-cyan transition-colors mt-auto pt-4 border-t border-white/10">
                    Launch Ecosystem <ChevronRight size={16} className="ml-1 group-hover:translate-x-1.5 transition-transform text-cyan" />
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Daily Tip Card */}
      <ScrollReveal delay={300}>
        <div className="glass-card p-8 rounded-3xl border border-gold/40 shadow-[0_0_40px_rgba(255,179,0,0.15)] flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-gold/15 via-navy to-navy">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-gold/20 border border-gold/40 text-gold flex items-center justify-center font-black text-3xl shrink-0 shadow-[0_0_20px_rgba(255,179,0,0.5)] animate-pulse">
              💡
            </div>
            <div>
              <span className="text-xs font-black text-gold uppercase tracking-widest block font-['Outfit']">Daily Cyber Tip</span>
              <p className="text-white font-bold text-base md:text-lg mt-1">
                "Never share your 6-digit WhatsApp verification OTP with anyone, even if they claim to be a friend."
              </p>
            </div>
          </div>
          
          <Link href="/learn" className="btn-primary shrink-0 py-4 px-8 text-xs font-black">
            <span>Practice Lesson ➔</span>
          </Link>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Learning & Modules */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Continue Learning CTA */}
          {nextLesson && (
            <ScrollReveal delay={100}>
              <Link href="/learn" className="block group">
                <div className="glass-card p-8 border-emerald/40 bg-gradient-to-r from-emerald/15 via-transparent to-transparent relative overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(16,185,129,0.2)] hover:-translate-y-1">
                  <div className="absolute right-0 top-0 bottom-0 w-48 bg-gradient-to-l from-emerald/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald animate-ping"></span>
                        <p className="text-xs font-black text-emerald uppercase tracking-widest">Active Investigation</p>
                      </div>
                      <h3 className="font-black text-3xl font-['Outfit'] text-white mb-2 group-hover:text-emerald transition-colors">
                        {nextLesson.title}
                      </h3>
                      <p className="text-base text-slate-300 font-medium">Duration: {nextLesson.duration} • Threat Level: {nextLesson.difficulty}</p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-emerald/20 border border-emerald/50 text-emerald flex items-center justify-center text-xl font-black shadow-[0_0_20px_rgba(16,185,129,0.5)] group-hover:scale-110 group-hover:bg-emerald group-hover:text-navy transition-all duration-300">
                      ▶
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          )}

          {/* Modules Grid */}
          <div>
            <ScrollReveal delay={200}>
              <h2 className="text-2xl font-black font-['Outfit'] mb-6 flex items-center gap-3 text-white">
                <div className="w-2 h-7 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)]"></div>
                Explore CyberSiksha
              </h2>
            </ScrollReveal>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {modules.map((m, i) => (
                <ScrollReveal key={m.path} delay={250 + i * 80}>
                  <Link href={m.path} className="block group h-full">
                    <div className={`glass-card p-8 h-full relative overflow-hidden border border-purple-500/20 hover:border-cyan-400 transition-all duration-300 flex flex-col justify-between bg-slate-900/60 shadow-xl hover:-translate-y-1.5`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${m.color} opacity-0 group-hover:opacity-15 transition-opacity duration-300`}></div>
                      
                      <div className="relative z-10">
                        <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-white/15 shadow-lg group-hover:scale-110 transition-transform duration-300">
                          {m.icon}
                        </div>
                        <h3 className={`text-2xl font-black font-['Outfit'] mb-3 transition-colors text-white group-hover:text-cyan-300`}>{m.title}</h3>
                        <p className="text-base text-slate-300 mb-6 leading-relaxed font-normal">{m.desc}</p>
                      </div>

                      <div className="relative z-10 flex items-center text-xs font-black text-cyan-300 uppercase tracking-widest group-hover:text-cyan-400 transition-colors mt-auto pt-4 border-t border-white/10">
                        Launch Feature <ChevronRight size={16} className="ml-1 group-hover:translate-x-1.5 transition-transform text-cyan-400" />
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Threats & Family */}
        <div className="space-y-6">
          
          {/* Active Threat Card */}
          <ScrollReveal delay={300}>
            <div className="glass-card p-8 border-rose/30 bg-gradient-to-b from-rose/10 via-transparent to-transparent relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-rose animate-pulse-glow"></div>
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="text-rose animate-bounce" size={28} />
                <h3 className="font-black font-['Outfit'] text-rose text-xl tracking-wide">National Threat Level</h3>
              </div>
              <div className="bg-navy/90 border border-rose/20 rounded-2xl p-6 mb-6 shadow-inner">
                <div className="text-5xl font-black font-['Outfit'] text-white mb-2 tracking-tight">CRITICAL</div>
                <p className="text-sm text-slate-300 leading-relaxed">Surge in sophisticated AI-cloned voice extortion calls detected across major Indian metropolitan hubs.</p>
              </div>
              <Link href="/news" className="block">
                <button className="w-full py-3.5 bg-rose/15 hover:bg-rose hover:text-white text-rose font-black font-['Outfit'] uppercase tracking-widest rounded-xl text-xs transition-all duration-300 border border-rose/30 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
                  Access Intelligence Unit
                </button>
              </Link>
            </div>
          </ScrollReveal>

          {/* Family Hub Promo */}
          <ScrollReveal delay={400}>
            <div className="glass-card p-8 border-violet/30 bg-gradient-to-br from-violet/10 via-navy-light to-navy relative overflow-hidden group shadow-2xl">
              <div className="absolute -bottom-24 -right-24 w-56 h-56 bg-violet/25 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="relative z-10">
                <div className="w-14 h-14 bg-violet/20 rounded-2xl border border-violet/30 flex items-center justify-center mb-6 text-violet shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                  <UserPlus size={28} />
                </div>
                <h3 className="text-2xl font-black font-['Outfit'] text-white mb-3">
                  Family Defense Hub
                </h3>
                <p className="text-base text-slate-300 mb-8 leading-relaxed font-normal">
                  Cybersecurity is a family effort. Invite parents or elders, monitor their Scam IQ, and ensure their savings are shielded.
                </p>
                <Link href="/family" className="block">
                  <button className="btn-primary w-full text-xs uppercase tracking-widest py-4 font-black">
                    Open Family Grid
                  </button>
                </Link>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </div>
  );
}
