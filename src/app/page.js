"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProgress } from '@/lib/progress';
import { Flame, Shield, Trophy, ChevronRight, BookOpen, ShieldQuestion, Newspaper, MessageSquareText } from 'lucide-react';

export default function Home() {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  if (!progress) return <div className="animate-pulse p-8 text-center text-cyan">Loading CyberSiksha Dashboard...</div>;

  const modules = [
    { title: "Learn", desc: "Bite-sized scam prevention lessons", icon: <BookOpen className="text-cyan mb-2" size={32} />, path: "/learn" },
    { title: "Quiz Game", desc: "Test your Scam IQ in real scenarios", icon: <ShieldQuestion className="text-cyan mb-2" size={32} />, path: "/quiz" },
    { title: "Scam Alerts", desc: "Latest threats happening in India", icon: <Newspaper className="text-cyan mb-2" size={32} />, path: "/news" },
    { title: "Ask AI", desc: "Got a doubt? Ask your cyber mentor", icon: <MessageSquareText className="text-cyan mb-2" size={32} />, path: "/chat" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Profile Section */}
      <div className="glass-card p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome Back!</h1>
          <p className="text-slate-300">Your family's cybersecurity depends on you. Keep learning.</p>
        </div>
        
        {/* Stats Row */}
        <div className="flex gap-4 w-full md:w-auto">
          <div className="bg-navy/50 p-4 rounded-xl flex-1 md:flex-none border border-white/5 text-center">
            <Flame className="mx-auto text-warning mb-1" size={24} />
            <div className="text-2xl font-bold">{progress.streak}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wide">Day Streak</div>
          </div>
          
          <div className="bg-navy/50 p-4 rounded-xl flex-1 md:flex-none border border-white/5 text-center relative overflow-hidden">
            <Shield className="mx-auto text-cyan mb-1" size={24} />
            <div className="text-2xl font-bold text-cyan glow-text">{progress.scamIq}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wide">Scam IQ</div>
            {/* Progress bar background */}
            <div className="absolute bottom-0 left-0 h-1 bg-cyan" style={{ width: `${progress.scamIq}%` }}></div>
          </div>
          
          <div className="bg-navy/50 p-4 rounded-xl flex-1 md:flex-none border border-white/5 text-center">
            <Trophy className="mx-auto text-success mb-1" size={24} />
            <div className="text-2xl font-bold text-success">{progress.xp}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wide">Total XP</div>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <h2 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2">Your Training Modules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((m) => (
          <Link href={m.path} key={m.path}>
            <div className="glass-card p-6 flex items-center justify-between hover:bg-[var(--color-card-hover)] transition-all cursor-pointer group">
              <div className="flex gap-4 items-center">
                <div className="bg-navy/50 p-3 rounded-lg border border-cyan/20 group-hover:border-cyan/50 transition-colors">
                  {m.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold group-hover:text-cyan transition-colors">{m.title}</h3>
                  <p className="text-sm text-slate-400">{m.desc}</p>
                </div>
              </div>
              <ChevronRight className="text-slate-500 group-hover:text-cyan group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        ))}
      </div>

      {/* Family Hub Promo (Mock UI for PPT) */}
      <div className="bg-gradient-to-r from-[var(--color-card)] to-navy border border-cyan/20 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan/5 rounded-full blur-3xl"></div>
        <div className="z-10">
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            👨‍👩‍👧 Family Protection Dashboard
          </h3>
          <p className="text-slate-300 max-w-xl">
            Invite your parents and grandparents to CyberSiksha. Monitor their Scam IQ and ensure they know how to spot the latest threats.
          </p>
        </div>
        <button className="btn-primary whitespace-nowrap z-10 w-full md:w-auto">
          Invite Family
        </button>
      </div>
    </div>
  );
}
