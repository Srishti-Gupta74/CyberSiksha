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
    <div className="p-6 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start select-none font-mono">
      
      {/* Left Panel: Hero Title & Fake Video Feed (6 Cols) */}
      <div className="lg:col-span-6 space-y-8">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <span className="border border-rose-500/60 text-rose-500 text-xs font-mono font-bold px-2.5 py-1 uppercase rounded-sm">
              EXTREME VECTOR
            </span>
            <span className="text-rose-400 font-mono text-xs font-bold animate-pulse">
              ⏳ ULTIMATUM COUNTDOWN: {formatTime(timer)}
            </span>
          </div>

          <h3 className="text-4xl sm:text-6xl font-black font-['Outfit'] text-white uppercase leading-[0.9] tracking-tight mb-6">
            CBI / SUPREME COURT DIGITAL ARREST
          </h3>

          <p className="text-slate-100 text-base sm:text-lg leading-relaxed font-sans font-medium">
            A fake law enforcement officer on Skype claims your bank account is linked to narcotics trafficking. Tap the 3 psychological red flags below to break the digital arrest!
          </p>
        </div>

        {/* Fake Video Call Screen in Noir aesthetic */}
        <div className="bg-[#0c0c0e] border border-white/15 rounded-2xl p-6 shadow-2xl relative overflow-hidden space-y-4">
          <div className="flex justify-between items-center text-xs font-bold text-cyan-400 border-b border-white/10 pb-3">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              SKYPE INTERCEPT • CBI_SPECIAL_CELL_DELHI
            </span>
            <span className="bg-red-600/90 text-white px-2.5 py-1 rounded text-[10px] uppercase font-black tracking-widest">
              WARRANT #DL-992
            </span>
          </div>

          <div className="py-8 text-center space-y-3 bg-black/40 rounded-xl border border-white/5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-900 border-2 border-rose-500 mx-auto flex items-center justify-center shadow-lg">
              <Video size={36} className="text-rose-500 animate-pulse" />
            </div>
            <p className="text-white font-black text-sm sm:text-base uppercase tracking-wider">
              [ ENCRYPTED VIDEO FEED // DO NOT DISCONNECT ]
            </p>
            <p className="text-slate-300 text-xs sm:text-sm font-sans font-medium">
              Caller demands secret screen sharing & isolation from family.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel: Interactive Red Flags (6 Cols) */}
      <div className="lg:col-span-6 space-y-6">
        <h4 className="text-cyan-300 font-black font-['Outfit'] text-2xl sm:text-3xl uppercase leading-snug tracking-wide mb-8">
          SPOT & TAP THE 3 FATAL FLAWS ({spotted.length}/3):
        </h4>

        <div className="space-y-4">
          {RED_FLAGS.map((fl, idx) => {
            const isSpotted = spotted.includes(idx);
            return (
              <div 
                key={idx}
                onClick={() => handleSpotFlag(idx)}
                className={`p-6 sm:p-7 rounded-2xl border transition-all cursor-pointer flex items-start gap-5 relative group shadow-md ${
                  isSpotted 
                    ? "bg-emerald-950/90 border-2 border-emerald-400 text-emerald-100 shadow-[0_0_25px_rgba(16,185,129,0.25)]" 
                    : "bg-[#18181b] border-white/10 hover:border-white/30 text-slate-100"
                }`}
              >
                <span className={`font-mono text-2xl sm:text-3xl font-black pt-0.5 shrink-0 ${isSpotted ? "text-emerald-400" : "text-slate-400"}`}>
                  0{idx + 1}
                </span>
                <div className="flex-1">
                  <p className="text-base sm:text-xl font-bold leading-relaxed font-sans text-white">
                    {fl}
                  </p>
                </div>
                {isSpotted && (
                  <div className="shrink-0 pt-0.5">
                    <CheckCircle2 size={24} className="text-emerald-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {neutralized && (
          <div className="p-6 rounded-2xl bg-emerald-500 text-slate-950 font-black text-center uppercase tracking-widest text-base sm:text-lg shadow-xl animate-scale-up font-mono mt-6">
            🛡️ WARRANT NEUTRALIZED! 1,000 RESILIENCE XP EARNED!
          </div>
        )}
      </div>

    </div>
  );
}
