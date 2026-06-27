"use client";

import { useState, useEffect } from 'react';
import { Video, ShieldAlert, PhoneOff, MicOff, AlertTriangle, CheckCircle2, Skull } from 'lucide-react';
import confetti from 'canvas-confetti';

const RED_FLAGS = [
  "Police/CBI officers NEVER interrogate or arrest citizens via Skype / WhatsApp video call",
  "Demands secret screen share and forbids informing family members",
  "Requests immediate ₹50,000 crypto / UPI deposit to a personal 'RBI verification account'"
];

export default function DigitalArrestSim() {
  const [timer, setTimer] = useState(119); // 2 minute ultimatum
  const [spotted, setSpotted] = useState([]);
  const [neutralized, setNeutralized] = useState(false);

  useEffect(() => {
    if (neutralized || timer <= 0) return;
    const t = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(t);
  }, [timer, neutralized]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const rs = s % 60;
    return `${m}:${rs < 10 ? '0' : ''}${rs}`;
  };

  const handleSpotFlag = (idx) => {
    if (spotted.includes(idx)) return;
    const next = [...spotted, idx];
    setSpotted(next);

    if (next.length === RED_FLAGS.length) {
      setNeutralized(true);
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="glass-card p-6 sm:p-10 bg-slate-950 border-2 border-rose-500 shadow-[0_0_80px_rgba(244,63,94,0.3)] select-none font-mono">
      
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 text-rose-400 font-black text-xs uppercase tracking-widest">
          <Video className="animate-pulse" size={18} /> <span>LIVE INTERCEPTED THREAT VECTOR • TOPICAL INDIA SCAM</span>
        </div>
        <span className="bg-rose-500/20 border border-rose-500/40 text-rose-300 px-3 py-1 rounded-full text-xs font-black animate-pulse">
          ⏳ Ultimatum Countdown: {formatTime(timer)}
        </span>
      </div>

      <h3 className="text-xl sm:text-3xl font-black font-['Outfit'] text-white mb-2">
        🚨 Simulation: <span className="text-rose-400">"CBI Digital Arrest"</span> Interrogation
      </h3>
      <p className="text-xs text-slate-300 font-sans mb-6">
        A fake law enforcement officer on Skype claims your bank account is linked to narcotics trafficking. Tap the 3 psychological red flags below to break the digital arrest!
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Fake Video Call Screen */}
        <div className="lg:col-span-6 aspect-video bg-slate-900 rounded-3xl border-2 border-rose-500/50 relative overflow-hidden shadow-2xl flex flex-col justify-between p-4 sm:p-6 group">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10 pointer-events-none"></div>
          
          {/* Top Call Info */}
          <div className="relative z-20 flex justify-between items-center text-[10px] sm:text-xs font-bold text-white bg-black/60 px-3.5 py-1.5 rounded-xl backdrop-blur-md w-fit">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping mr-2"></span>
            <span>Skype Recording • CBI_SPECIAL_CELL_DELHI</span>
          </div>

          {/* Center Frozen Officer Face Simulation */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-80">
            <div className="text-center space-y-2 relative">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-slate-800 border-4 border-amber-500/80 mx-auto flex items-center justify-center text-5xl sm:text-6xl shadow-2xl relative">
                👮‍♂️
                <span className="absolute -bottom-2 bg-amber-500 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-md tracking-widest">SUPREME COURT</span>
              </div>
              <span className="text-xs sm:text-sm font-black text-white bg-red-600/90 px-3 py-1 rounded-lg uppercase tracking-widest block shadow-lg">
                ⚠️ DIGITAL ARREST WARRANT #DL-992
              </span>
            </div>
          </div>

          {/* Bottom Video Controls */}
          <div className="relative z-20 flex justify-between items-center pt-4">
            <div className="flex gap-2 text-white/80 bg-black/50 p-2 rounded-xl">
              <MicOff size={16} className="text-rose-400" />
              <Video size={16} />
            </div>

            <div className="bg-rose-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg animate-bounce">
              <PhoneOff size={14} /> <span>DO NOT DISCONNECT</span>
            </div>
          </div>
        </div>

        {/* Tap Red Flags Game Arena */}
        <div className="lg:col-span-6 space-y-4">
          <span className="text-xs font-black text-cyan-300 uppercase tracking-widest block">
            🚩 Spot & Tap The 3 Fatal Flaws ({spotted.length}/3):
          </span>

          <div className="space-y-3">
            {RED_FLAGS.map((fl, idx) => {
              const isSpotted = spotted.includes(idx);
              return (
                <div 
                  key={idx}
                  onClick={() => handleSpotFlag(idx)}
                  className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all leading-relaxed ${
                    isSpotted ? "bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold shadow-[0_0_20px_rgba(52,211,153,0.3)]" : "bg-white/5 border-white/10 text-slate-300 hover:border-cyan-400 hover:bg-white/10"
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <span>⚠️ {fl}</span>
                    {isSpotted && <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />}
                  </div>
                </div>
              );
            })}
          </div>

          {neutralized && (
            <div className="p-4 rounded-2xl bg-emerald-500 text-slate-950 font-black text-center uppercase tracking-widest text-xs shadow-xl animate-scale-up">
              🛡️ WARRANT NEUTRALIZED! 1,000 RESILIENCE XP EARNED!
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
