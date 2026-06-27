"use client";

import { useState, useEffect } from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import { ShieldAlert, Crosshair, Sparkles, RefreshCw, CheckCircle2, ArrowRight, Skull, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import ScamSimulationsArena from '@/components/ScamSimulationsArena';

export default function RedZonePage() {
  const [redzoneTab, setRedzoneTab] = useState("simulations");
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
      if (!res.ok) throw new Error('API route returned non-200');
      const data = await res.json();
      setResult(data);
      setEvaluating(false);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    } catch (err) {
      const lower = craftedMessage.toLowerCase().trim();
      const isHarmless = lower.length < 20 && !lower.includes('urgent') && !lower.includes('bank') && !lower.includes('win') && !lower.includes('block') && !lower.includes('http');
      
      setResult({
        lethalityScore: isHarmless ? 10 : 88,
        rating: isHarmless ? '🟢 Harmless Message (No Threat Detected)' : '🔴 Supreme Lethality Trap (Simulated)',
        triggersExploited: isHarmless ? ['None (Friendly Casual Message)'] : ['High-Pressure Time Urgency', 'Institutional Authority Impersonation'],
        forensicAnalysis: isHarmless 
          ? `This looks like a friendly, completely harmless greeting or casual conversation! It does not contain any urgency, scare tactics, links, or financial demands typical of social engineering attackers.`
          : `This attack attempts to exploit core psychological vulnerability vectors targeting the ${targetPersona} persona.`,
        ethicalFlipChallenge: {
          prompt: "Now flip your mindset! As a cyber defender, evaluate how a vigilant citizen analyzes this text.",
          redFlagsToSpot: isHarmless ? [
            "No threatening or urgent language present",
            "No request for sensitive credentials or money",
            "No external phishing links or spoofed numbers"
          ] : [
            "Unverified external contact vector",
            "Artificial urgency demanding immediate action",
            "Requests sensitive credential or financial transfer"
          ]
        }
      });
      setEvaluating(false);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
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
            <Crosshair size={14} className="text-rose-400 animate-spin" /> CyberSiksha Interactive Defense Arena
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

      {/* RedZone Tab Navigation Toolbar */}
      <div className="flex justify-center mb-12">
        <div className="bg-slate-900/80 p-2 rounded-2xl border border-white/10 flex flex-wrap justify-center gap-3 font-mono text-xs uppercase tracking-wider shadow-xl">
          <button
            onClick={() => setRedzoneTab("simulations")}
            className={`px-6 py-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-2.5 ${
              redzoneTab === "simulations" 
                ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-black shadow-[0_0_25px_rgba(168,85,247,0.5)] scale-105" 
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Sparkles size={18} className="animate-spin" /> <span>🎮 Interactive Scam Storyline Simulations</span>
          </button>
          <button
            onClick={() => setRedzoneTab("workbench")}
            className={`px-6 py-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-2.5 ${
              redzoneTab === "workbench" 
                ? "bg-rose-500 text-slate-950 font-black shadow-[0_0_25px_rgba(244,63,94,0.5)] scale-105" 
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Crosshair size={18} /> <span>☠️ Attack Engineering Workbench</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Interactive Scam Storyline Simulations */}
      {redzoneTab === "simulations" && (
        <div className="mb-14 pt-2">
          <ScamSimulationsArena />
        </div>
      )}

      {/* Tab 2: Attack Engineering Workbench */}
      {redzoneTab === "workbench" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2 animate-fade-in">
        
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
                    rows={4} 
                    value={craftedMessage}
                    onChange={e => setCraftedMessage(e.target.value)}
                    placeholder="e.g., Dear SBI Customer, your KYC has expired today. Your bank account and ATM card will be blocked within 24 hours. Click here to verify..." 
                    className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-rose-500 outline-none resize-none font-sans"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={evaluating || !craftedMessage.trim()}
                  className="w-full py-4 bg-rose-500 hover:bg-rose-400 disabled:opacity-50 text-slate-950 font-black rounded-2xl transition-all shadow-[0_0_25px_rgba(244,63,94,0.4)] flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                >
                  {evaluating ? <RefreshCw className="animate-spin" size={20} /> : <Sparkles size={20} />}
                  <span>{evaluating ? "Running AI Heuristic Evaluation..." : "Execute Attack Vector Simulation"}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Defender / Evaluation Panel */}
          <div className="lg:col-span-5">
            {result ? (
              <div className="glass-card p-6 sm:p-8 bg-slate-950 border-cyan-400 shadow-[0_0_50px_rgba(34,211,238,0.15)] space-y-6">
                
                <div className="flex justify-between items-start border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Lethality Metric</span>
                    <h3 className="text-xl font-black text-white font-['Outfit']">{result.rating}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black font-['Outfit'] text-rose-400">{result.lethalityScore}/100</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-wider block mb-2">Exploited Psychological Triggers:</span>
                  <div className="flex flex-wrap gap-2">
                    {result.triggersExploited.map((trig, idx) => (
                      <span key={idx} className="bg-rose-500/10 border border-rose-500/30 text-rose-300 px-3 py-1 rounded-full text-xs font-mono font-medium">
                        🎯 {trig}
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

                <button
                  onClick={() => {
                    setResult(null);
                    setCraftedMessage("");
                    setSpottedFlags([]);
                  }}
                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-400/40 rounded-2xl text-xs font-black uppercase font-mono tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-4"
                >
                  <RefreshCw size={16} /> Reset Workbench & Craft New Trap
                </button>

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
      )}

    </div>
  );
}
