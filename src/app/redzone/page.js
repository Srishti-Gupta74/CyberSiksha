"use client";

import { useState, useEffect } from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import { ShieldAlert, Crosshair, Sparkles, RefreshCw, CheckCircle2, ArrowRight, Skull, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import DigitalArrestSim from '@/components/DigitalArrestSim';

export default function RedZonePage() {
  const [intel, setIntel] = useState(null);
  const [loadingIntel, setLoadingIntel] = useState(true);
  
  const [targetPersona, setTargetPersona] = useState("Elderly Grandfather");
  const [attackVector, setAttackVector] = useState("Bank KYC SMS");
  const [craftedMessage, setCraftedMessage] = useState("");
  
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [spottedFlags, setSpottedFlags] = useState([]);

  useEffect(() => {
    fetch('/api/redzone')
      .then(res => res.json())
      .then(data => {
        setIntel(data);
        setLoadingIntel(false);
      })
      .catch(() => setLoadingIntel(false));
  }, []);

  const handleLaunchAttack = async (e) => {
    e.preventDefault();
    if (!craftedMessage.trim()) return;
    setEvaluating(true);
    setResult(null);
    setFlipped(false);

    try {
      const res = await fetch('/api/redzone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona: targetPersona,
          vector: attackVector,
          message: craftedMessage
        })
      });
      const data = await res.json();
      setResult(data);
      setEvaluating(false);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    } catch {
      setEvaluating(false);
    }
  };

  const toggleFlag = (idx) => {
    setSpottedFlags(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };

  return (
    <div className="max-w-6xl mx-auto pb-44 pt-6 px-4 sm:px-6 animate-fade-in select-none">
      
      {/* Masthead Banner */}
      <div className="glass-card p-8 md:p-12 mb-12 relative overflow-hidden bg-gradient-to-r from-rose-950/40 via-slate-950 to-slate-900 border border-rose-500/40 shadow-[0_0_80px_rgba(244,63,94,0.15)] flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-rose-600/15 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-2xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-rose-500/20 border border-rose-500/40 px-3.5 py-1 rounded-full text-[11px] font-mono font-black text-rose-300 tracking-widest uppercase mb-4">
            <Crosshair size={14} className="text-rose-400 animate-spin" /> CyberCIA Forge Offense-For-Defense Arena
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-['Outfit'] text-white mb-4 leading-tight">
            🔴 The Red Zone: <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-purple-400 to-amber-400">
              Attacker's POV Simulator
            </span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Flip the game. To become an unshakeable defender, you must master the offensive mechanics of social engineering. Design a mock trap and let AI evaluate its psychological lethality.
          </p>
        </div>

        {/* Live Threat Badge */}
        {!loadingIntel && intel?.isLiveIntel && (
          <div className="bg-slate-900/90 border border-cyan-400/50 p-6 rounded-3xl text-center shadow-2xl shrink-0 max-w-xs relative animate-scale-up">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping absolute top-4 right-4"></span>
            <Sparkles className="text-cyan-400 mx-auto mb-2" size={28} />
            <span className="text-[10px] font-mono font-black text-cyan-300 uppercase tracking-widest block mb-1">Live Feed Synchronized</span>
            <p className="text-xs font-bold text-white leading-snug">{intel.badgeText}</p>
          </div>
        )}
      </div>

      {/* Topical India Digital Arrest Simulation Showcase */}
      <div className="mb-14">
        <DigitalArrestSim />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Attacker Workbench Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card p-6 sm:p-8 bg-slate-950 border-white/10">
            <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white mb-6 flex items-center gap-3">
              <Skull className="text-rose-400" /> Engineer Phishing Vector
            </h2>

            <form onSubmit={handleLaunchAttack} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-bold block mb-2">1. Target Persona</label>
                  <select 
                    value={targetPersona} 
                    onChange={e => setTargetPersona(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white font-medium focus:border-rose-500 outline-none"
                  >
                    <option>Elderly Grandfather</option>
                    <option>Job Seeking Graduate</option>
                    <option>Rural Farmer</option>
                    <option>Teen / Student</option>
                    <option>Small Business Owner</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-bold block mb-2">2. Attack Vector</label>
                  <select 
                    value={attackVector} 
                    onChange={e => setAttackVector(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white font-medium focus:border-rose-500 outline-none"
                  >
                    <option>Bank KYC SMS Freeze</option>
                    <option>CBI Digital Arrest Video Call</option>
                    <option>Fake Luxury Giveaway QR</option>
                    <option>Gov Direct Scheme Claim</option>
                    <option>WFH Part-Time Salary Deposit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-bold block mb-2">3. Craft Trap Message / Script</label>
                <textarea 
                  value={craftedMessage}
                  onChange={e => setCraftedMessage(e.target.value)}
                  placeholder="Dear Customer, your bank account is suspended pending KYC verification. Click immediately..."
                  rows={4}
                  className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-rose-500 outline-none resize-none font-mono"
                />
              </div>

              <button 
                type="submit" 
                disabled={evaluating || !craftedMessage.trim()}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-black uppercase text-xs tracking-widest shadow-lg cursor-pointer transition-all disabled:opacity-30 flex items-center justify-center gap-2"
              >
                {evaluating ? <RefreshCw className="animate-spin" /> : <span>⚡ Evaluate Lethality Score</span>}
              </button>
            </form>
          </div>
        </div>

        {/* AI Scoring Results & Ethical Flip */}
        <div className="lg:col-span-5 space-y-6">
          {result ? (
            <div className="glass-card p-6 sm:p-8 bg-slate-950 border-rose-500/50 relative animate-scale-up space-y-6">
              
              <div className="text-center pb-6 border-b border-white/10">
                <span className="text-4xl sm:text-5xl font-black font-mono text-rose-400 block mb-1">{result.lethalityScore}%</span>
                <span className="text-xs font-bold font-mono text-slate-300 uppercase tracking-widest">{result.rating}</span>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono mb-3">🧠 Psychological Triggers Exploited:</h4>
                <div className="flex flex-wrap gap-2">
                  {result.triggersExploited.map((tr, i) => (
                    <span key={i} className="bg-purple-600/20 border border-purple-500/40 text-purple-300 text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase">
                      {tr}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-normal bg-white/5 p-4 rounded-2xl border border-white/5">
                {result.forensicAnalysis}
              </p>

              {/* Ethical Flip Box */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 border border-cyan-400 shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-cyan-300 font-black font-mono text-xs uppercase tracking-wider">
                  <ShieldCheck size={18} className="text-cyan-400" /> <span>🔄 The Ethical Flip Challenge</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">{result.ethicalFlipChallenge.prompt}</p>

                <div className="space-y-2 pt-2">
                  {result.ethicalFlipChallenge.redFlagsToSpot.map((flag, idx) => {
                    const isSpotted = spottedFlags.includes(idx);
                    return (
                      <div 
                        key={idx}
                        onClick={() => toggleFlag(idx)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between font-mono ${
                          isSpotted ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/30'
                        }`}
                      >
                        <span>🚩 {flag}</span>
                        {isSpotted && <CheckCircle2 size={16} className="text-emerald-400" />}
                      </div>
                    );
                  })}
                </div>

                {spottedFlags.length === result.ethicalFlipChallenge.redFlagsToSpot.length && (
                  <div className="bg-emerald-500/30 border border-emerald-400 p-3 rounded-xl text-center text-emerald-200 text-xs font-black uppercase font-mono tracking-widest animate-bounce mt-2">
                    🛡️ Trap Neutralized! Cyber Resilience XP Earned!
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="glass-card p-12 bg-slate-950/50 border-white/5 text-center flex flex-col items-center justify-center h-full min-h-[350px]">
              <Crosshair size={48} className="text-slate-600 mb-4 animate-pulse" />
              <h3 className="text-base font-bold text-slate-400 mb-1">Awaiting Trap Execution</h3>
              <p className="text-xs text-slate-600 max-w-xs">Craft your attack vector on the workbench to analyze forensic lethality metrics.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
