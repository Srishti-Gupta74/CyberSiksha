"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { LESSONS } from '@/data/content';
import { Flame, Shield, Trophy, ChevronRight, BookOpen, ShieldQuestion, Newspaper, MessageSquareText, UserPlus, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const { user, profile, completedLessons, loading } = useAuth();
  const [scamIq, setScamIq] = useState(0);

  useEffect(() => {
    // Calculate Scam IQ
    // Base IQ is 50. Each completed lesson adds up to (100 / total_lessons) points.
    const totalLessons = LESSONS.length;
    const completedCount = completedLessons.length;
    
    if (totalLessons > 0) {
      const calculatedIq = Math.min(100, Math.round(50 + (completedCount / totalLessons) * 50));
      setScamIq(calculatedIq);
    }
  }, [completedLessons]);

  const modules = [
    { title: "Learn", desc: "Bite-sized scam prevention lessons", icon: <BookOpen className="text-emerald mb-2" size={32} />, path: "/learn", color: "border-emerald/20 hover:border-emerald/50", textHover: "group-hover:text-emerald" },
    { title: "Quiz Game", desc: "Test your Scam IQ in real scenarios", icon: <ShieldQuestion className="text-cyan mb-2" size={32} />, path: "/quiz", color: "border-cyan/20 hover:border-cyan/50", textHover: "group-hover:text-cyan" },
    { title: "Scam Alerts", desc: "Latest threats happening in India", icon: <Newspaper className="text-violet mb-2" size={32} />, path: "/news", color: "border-violet/20 hover:border-violet/50", textHover: "group-hover:text-violet" },
    { title: "Ask AI", desc: "Got a doubt? Ask your cyber mentor", icon: <MessageSquareText className="text-gold mb-2" size={32} />, path: "/chat", color: "border-gold/20 hover:border-gold/50", textHover: "group-hover:text-gold" },
  ];

  if (loading) {
    return <div className="animate-pulse p-8 text-center text-cyan flex flex-col items-center justify-center min-h-[50vh]">
      <Shield className="animate-bounce mb-4 opacity-50" size={48} />
      <p>Loading CyberSiksha Dashboard...</p>
    </div>;
  }

  // Find the next uncompleted lesson
  const nextLesson = LESSONS.find(l => !completedLessons.includes(l.id));

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Hero Dashboard */}
      <div className="glass-card p-6 md:p-8 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
          <div className="text-center md:text-left flex-1">
            <p className="text-slate-400 font-semibold uppercase tracking-wider text-xs mb-2">Welcome back 👋</p>
            <h1 className="text-3xl md:text-4xl font-black font-['Outfit'] mb-3">
              {profile?.display_name || 'Cyber Learner'}
            </h1>
            
            <div className="inline-flex items-center gap-2 bg-emerald/10 border border-emerald/20 text-emerald px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
              {scamIq < 60 ? '🌱 Cyber Newbie' : scamIq < 85 ? '🛡️ Cyber Defender' : '👑 Scam Expert'}
            </div>
          </div>
          
          {/* Circular Progress (Scam IQ) */}
          <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center bg-navy-light rounded-full shadow-[0_0_30px_rgba(16,185,129,0.15)] border border-white/5">
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
              <circle 
                cx="50" cy="50" r="45" fill="none" 
                stroke="url(#iqGradient)" 
                strokeWidth="6" 
                strokeLinecap="round"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * scamIq) / 100}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="iqGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#38BDF8" />
                </linearGradient>
              </defs>
            </svg>
            <div className="text-center z-10">
              <div className="text-3xl font-black font-['Outfit'] text-transparent bg-clip-text bg-gradient-to-br from-emerald to-cyan drop-shadow-lg">
                {scamIq}
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Scam IQ</div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 md:gap-6 mt-8 relative z-10">
          <div className="bg-navy-light/80 p-3 md:p-4 rounded-xl border border-white/5 text-center transition-transform hover:-translate-y-1">
            <Flame className="mx-auto text-gold mb-1 md:mb-2 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" size={24} />
            <div className="text-xl md:text-2xl font-black font-['Outfit']">{profile?.streak || 0}</div>
            <div className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wide font-semibold mt-1">Streak</div>
          </div>
          
          <div className="bg-navy-light/80 p-3 md:p-4 rounded-xl border border-white/5 text-center transition-transform hover:-translate-y-1">
            <Trophy className="mx-auto text-emerald mb-1 md:mb-2 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" size={24} />
            <div className="text-xl md:text-2xl font-black font-['Outfit']">{profile?.xp || 0}</div>
            <div className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wide font-semibold mt-1">Total XP</div>
          </div>
          
          <div className="bg-navy-light/80 p-3 md:p-4 rounded-xl border border-white/5 text-center transition-transform hover:-translate-y-1">
            <CheckCircle2 className="mx-auto text-cyan mb-1 md:mb-2 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" size={24} />
            <div className="text-xl md:text-2xl font-black font-['Outfit']">{completedLessons.length}</div>
            <div className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wide font-semibold mt-1">Lessons</div>
          </div>
        </div>
      </div>

      {/* Continue Learning CTA */}
      {nextLesson && (
        <Link href="/learn">
          <div className="glass-card p-4 md:p-5 flex items-center justify-between border-emerald/30 bg-emerald/5 hover:bg-emerald/10 cursor-pointer group transition-all">
            <div>
              <p className="text-[10px] md:text-xs font-bold text-emerald uppercase tracking-widest mb-1 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald animate-pulse"></span> Continue Learning
              </p>
              <h3 className="font-bold text-white text-sm md:text-base group-hover:text-emerald transition-colors">{nextLesson.title}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald text-navy flex items-center justify-center font-bold text-lg shadow-[0_0_15px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-transform">
              ▶
            </div>
          </div>
        </Link>
      )}

      {/* Modules Grid */}
      <div>
        <h2 className="text-lg font-bold font-['Outfit'] mb-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-cyan rounded-full"></span>
          Training Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((m) => (
            <Link href={m.path} key={m.path}>
              <div className={`glass-card p-5 flex items-center justify-between hover:bg-navy-light transition-all cursor-pointer group border border-white/5 ${m.color}`}>
                <div className="flex gap-4 items-center">
                  <div className="bg-navy p-3 rounded-xl border border-white/5 shadow-inner">
                    {m.icon}
                  </div>
                  <div>
                    <h3 className={`text-base font-bold transition-colors ${m.textHover}`}>{m.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{m.desc}</p>
                  </div>
                </div>
                <ChevronRight className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" size={20} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Family Hub Promo */}
      <div className="relative overflow-hidden glass-card p-6 border-violet/30 bg-gradient-to-br from-navy-light to-navy">
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-violet/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <h3 className="text-lg font-bold font-['Outfit'] text-white mb-2 flex items-center gap-2">
              <UserPlus className="text-violet" size={20} />
              Protect Your Family
            </h3>
            <p className="text-xs md:text-sm text-slate-300 max-w-lg leading-relaxed">
              Cybersecurity is a team effort. Invite your parents and grandparents, monitor their Scam IQ, and ensure they know how to spot the latest digital threats in India.
            </p>
          </div>
          <Link href="/family" className="w-full md:w-auto">
            <button className="whitespace-nowrap px-6 py-3 bg-violet hover:bg-violet/90 text-white font-bold rounded-xl shadow-[0_4px_20px_rgba(139,92,246,0.3)] transition-all hover:-translate-y-1 w-full md:w-auto">
              Open Family Hub
            </button>
          </Link>
        </div>
      </div>

    </div>
  );
}
