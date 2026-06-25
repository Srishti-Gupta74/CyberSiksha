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
              CyberSiksha is India's award-winning digital defense ecosystem. Practice interactive cyber traps to keep your parents and family safe from financial fraud.
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
              <h2 className="text-2xl font-black font-['Outfit'] mb-6 flex items-center gap-3 text-slate-900">
                <div className="w-2 h-7 bg-sky-600 rounded-full"></div>
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

                      <div className="relative z-10 flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest group-hover:text-cyan-400 transition-colors mt-auto pt-4 border-t border-white/10">
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
