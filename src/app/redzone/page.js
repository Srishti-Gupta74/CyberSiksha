"use client";

import { useState, useEffect } from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import TextReveal from '@/components/TextReveal';
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
    <div className="max-w-7xl mx-auto pb-52 pt-6 px-4 sm:px-8 animate-fade-in select-none">
      
      {/* Masthead Banner */}
      <div className="glass-card p-8 md:p-12 mb-12 relative overflow-hidden bg-gradient-to-r from-rose-950/40 via-slate-950 to-slate-900 border border-rose-500/40 shadow-[0_0_80px_rgba(244,63,94,0.15)] flex flex-col md:flex-row items-center justify-between gap-8 hover-lift">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-rose-600/15 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-2xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-rose-500/20 border border-rose-500/40 px-3.5 py-1 rounded-full text-[11px] font-mono font-black text-rose-300 tracking-widest uppercase mb-4">
            <Crosshair size={14} className="text-rose-400 animate-spin" /> CyberSiksha Interactive Defense Arena
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-heading text-white mb-4 leading-tight">
            The Red Zone: <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-purple-400 to-amber-400">
              Attacker's POV Simulator
            </span>
          </h1>
          <TextReveal 
            text="Flip the game. To become an unshakeable defender, you must master the offensive mechanics of social engineering. Design a mock trap and let AI evaluate its psychological lethality." 
            className="text-slate-200 text-base sm:text-lg leading-relaxed font-semibold font-sans"
          />
        </div>

        {/* Live Threat Badge */}
        {!loadingIntel && intel?.isLiveIntel && (
          <div className="bg-slate-900/90 border border-cyan-400/50 p-6 rounded-3xl text-center shadow-2xl shrink-0 max-w-xs relative animate-scale-up">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping absolute top-4 right-4"></span>
            <ShieldAlert className="text-cyan-400 mx-auto mb-2" size={28} />
            <span className="text-[10px] font-mono font-black text-cyan-300 uppercase tracking-widest block mb-1">Live Feed Synchronized</span>
            <p className="text-xs font-bold text-white leading-snug">{intel.badgeText}</p>
          </div>
        )}
      </div>

      {/* RedZone Tab Navigation Toolbar (High contrast & large fonts for elders) */}
      <div className="flex justify-center mb-16">
        <div className="bg-slate-900/90 p-3 rounded-3xl border-2 border-white/20 flex flex-wrap justify-center gap-3 font-mono text-sm sm:text-base uppercase tracking-wider shadow-2xl">
          <button
            onClick={() => setRedzoneTab("simulations")}
            className={`px-6 py-4 rounded-2xl transition-all cursor-pointer flex items-center gap-3 font-bold ${
              redzoneTab === "simulations" 
                ? "bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-black shadow-[0_0_25px_rgba(168,85,247,0.5)] scale-105" 
                : "bg-white/5 border border-white/10 text-slate-100 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span>🎮 Interactive Scam Storyline Simulations</span>
          </button>
          <button
            onClick={() => setRedzoneTab("workbench")}
            className={`px-6 py-4 rounded-2xl transition-all cursor-pointer flex items-center gap-3 font-bold ${
              redzoneTab === "workbench" 
                ? "bg-rose-500 text-slate-950 font-black shadow-[0_0_25px_rgba(244,63,94,0.5)] scale-105" 
                : "bg-white/5 border border-white/10 text-slate-100 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span>🎯 Attacker Workbench & AI Trap Test</span>
          </button>
        </div>
      </div>

      {/* Conditional Rendering based on selected tab */}
      {redzoneTab === "simulations" ? (
        <ScamSimulationsArena />
      ) : (
        <div className="bg-[#0a0a0c] border border-white/10 rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-2xl font-mono animate-fade-in">
        
          {/* Attacker / Input Panel (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-12 border-b lg:border-b-0 lg:border-r border-white/10 space-y-10">
            <div>
              <span className="text-rose-500 text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                STEP 1: CONFIGURE TARGET VECTOR
              </span>
              <h3 className="text-4xl sm:text-6xl font-black text-white font-serif italic tracking-tight leading-tight my-4">
                Social Engineering Workbench
              </h3>
            </div>

            <form onSubmit={handleLaunchAttack} className="space-y-8">
              
              {/* Step 01 / Target Identification */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest mb-2">
                  <span className="text-slate-500">01 / TARGET IDENTIFICATION</span>
                  <span className="text-rose-500">VERIFIED SUBJECT</span>
                </div>
                <div className="bg-[#161618] border border-white/10 p-6 rounded-xl my-2 hover:border-white/30 transition-all flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-inner">
                  <div className="w-24 h-24 bg-black/60 border border-white/5 rounded-lg flex flex-col items-center justify-center text-[10px] text-slate-500 shrink-0 uppercase tracking-widest text-center p-2 font-bold">
                    SUBJECT 68-A
                  </div>
                  <div className="w-full flex-1">
                    <select 
                      value={targetPersona} 
                      onChange={e => setTargetPersona(e.target.value)}
                      className="w-full bg-transparent text-xl sm:text-2xl font-black font-serif italic text-white focus:outline-none cursor-pointer mb-2 border-b border-white/10 pb-2"
                    >
                      <option className="bg-slate-900 text-base font-sans">Elderly Grandfather (68, Pensioner)</option>
                      <option className="bg-slate-900 text-base font-sans">College Student (19, Job Seeker)</option>
                      <option className="bg-slate-900 text-base font-sans">Small Shopkeeper (42, UPI User)</option>
                      <option className="bg-slate-900 text-base font-sans">Homemaker (35, Part-time seeker)</option>
                      <option className="bg-slate-900 text-base font-sans">Corporate Employee (28, Salaried)</option>
                    </select>
                    <p className="text-slate-400 italic text-xs sm:text-sm font-sans leading-relaxed">
                      Subject displays high trust in institutional communications. Digital footprint suggests frequent use of legacy banking portals.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 02 / Delivery Method */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest mb-2">
                  <span className="text-slate-500">02 / DELIVERY METHOD</span>
                </div>
                <div className="bg-[#161618] border border-white/10 p-5 rounded-xl my-2 hover:border-white/30 transition-all shadow-inner">
                  <select 
                    value={attackVector} 
                    onChange={e => setAttackVector(e.target.value)}
                    className="w-full bg-transparent text-xl sm:text-2xl font-black font-serif italic text-white focus:outline-none cursor-pointer"
                  >
                    <option className="bg-slate-900 text-base font-sans">Bank KYC SMS Freeze</option>
                    <option className="bg-slate-900 text-base font-sans">CBI Digital Arrest Video Call</option>
                    <option className="bg-slate-900 text-base font-sans">Fake Luxury Giveaway QR</option>
                    <option className="bg-slate-900 text-base font-sans">Gov Direct Scheme Claim</option>
                    <option className="bg-slate-900 text-base font-sans">WFH Part-Time Salary Deposit</option>
                  </select>
                </div>
              </div>

              {/* Step 03 / Payload Composition */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest mb-2">
                  <span className="text-slate-500">03 / PAYLOAD COMPOSITION</span>
                  <span className="border border-rose-500 text-rose-500 text-[10px] px-2 py-0.5 rounded font-black tracking-wider">DRAFT_MODE</span>
                </div>
                <textarea 
                  rows={4} 
                  value={craftedMessage}
                  onChange={e => setCraftedMessage(e.target.value)}
                  placeholder="FINAL NOTICE: Dear SBI Customer, your KYC has expired today. Your bank account and ATM card will be blocked within 24 hours. Click here to verify..." 
                  className="w-full bg-[#141416] border border-white/15 rounded-xl p-6 text-base sm:text-lg text-slate-100 font-mono leading-relaxed outline-none focus:border-rose-500 my-2 shadow-inner resize-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={evaluating || !craftedMessage.trim()}
                className="w-full py-5 px-8 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-base sm:text-lg font-black rounded-xl transition-all shadow-[0_0_30px_rgba(225,29,72,0.4)] flex items-center justify-between cursor-pointer uppercase tracking-widest font-mono pt-6"
              >
                <span>{evaluating ? "RUNNING AI EVALUATION..." : "EXECUTE ATTACK VECTOR SIMULATION"}</span>
                <span className="text-xl">{evaluating ? <RefreshCw className="animate-spin" size={20} /> : "➔"}</span>
              </button>
            </form>
          </div>

          {/* Defender / Evaluation Panel (5 Cols) */}
          <div className="lg:col-span-5 p-6 sm:p-12 bg-[#0e0e10] flex flex-col justify-between">
            {result ? (
              <div className="space-y-8 animate-fade-in my-auto">
                
                <div className="flex justify-between items-start border-b border-white/10 pb-6">
                  <div>
                    <span className="text-xs sm:text-sm font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">LETHALITY METRIC</span>
                    <h3 className="text-3xl sm:text-4xl font-black text-white font-serif italic">{result.rating}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-4xl sm:text-5xl font-black font-serif italic text-rose-500">{result.lethalityScore}/100</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs sm:text-sm font-mono font-black text-cyan-400 uppercase tracking-wider block mb-3">EXPLOITED PSYCHOLOGICAL TRIGGERS:</span>
                  <div className="flex flex-wrap gap-3">
                    {result.triggersExploited.map((trig, idx) => (
                      <span key={idx} className="bg-rose-500/20 border border-rose-500/40 text-rose-200 px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-bold">
                        🎯 {trig}
                      </span>
                    ))}
                  </div>
                </div>

                <TextReveal 
                  text={result.forensicAnalysis} 
                  className="text-base sm:text-lg text-slate-100 leading-relaxed font-sans font-semibold bg-[#161618] p-6 rounded-xl border border-white/10 shadow-inner"
                />

                {/* Ethical Flip Box */}
                <div className="p-6 sm:p-8 rounded-2xl bg-[#141416] border border-cyan-400/50 shadow-xl space-y-5">
                  <div className="flex items-center gap-2.5 text-cyan-400 font-black font-mono text-sm sm:text-base uppercase tracking-wider">
                    <ShieldCheck size={22} className="text-cyan-400 shrink-0" /> <span>🔄 THE ETHICAL FLIP CHALLENGE</span>
                  </div>
                  <TextReveal 
                    text={result.ethicalFlipChallenge.prompt} 
                    className="text-base sm:text-lg text-cyan-200 leading-relaxed font-sans font-bold"
                  />

                  <div className="space-y-3 pt-2">
                    {result.ethicalFlipChallenge.redFlagsToSpot.map((flag, idx) => {
                      const isSpotted = spottedFlags.includes(idx);
                      return (
                        <div 
                          key={idx}
                          onClick={() => toggleFlag(idx)}
                          className={`p-4 rounded-xl border text-sm sm:text-base cursor-pointer transition-all flex items-center justify-between font-mono font-bold ${
                            isSpotted ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200 shadow-md' : 'bg-[#18181b] border-white/10 text-slate-200 hover:border-white/30'
                          }`}
                        >
                          <span className="pr-2">🚩 {flag}</span>
                          {isSpotted && <CheckCircle2 size={22} className="text-emerald-400 shrink-0" />}
                        </div>
                      );
                    })}
                  </div>

                  {spottedFlags.length === result.ethicalFlipChallenge.redFlagsToSpot.length && (
                    <div className="bg-emerald-500/20 border border-emerald-400 p-4 rounded-xl text-center text-emerald-300 text-sm font-black uppercase font-mono tracking-widest animate-bounce mt-4 shadow-lg">
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
                  className="w-full py-4 bg-[#161618] hover:bg-[#202024] text-cyan-400 border border-cyan-400/40 rounded-xl text-sm sm:text-base font-black uppercase font-mono tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl mt-4"
                >
                  <RefreshCw size={18} /> RESET WORKBENCH & CRAFT NEW TRAP
                </button>

              </div>
            ) : (
              <div className="my-auto text-center space-y-6 py-16">
                <div className="w-36 h-36 rounded-full border border-white/5 mx-auto flex items-center justify-center relative shadow-2xl">
                  <div className="w-24 h-24 rounded-full border border-rose-500/30 flex items-center justify-center">
                    <Crosshair size={48} className="text-rose-500 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl sm:text-4xl font-black font-serif italic text-white mb-3">Awaiting Trap Execution</h3>
                  <p className="text-sm sm:text-base font-sans font-medium text-slate-400 max-w-sm mx-auto leading-relaxed">Craft your attack vector on the workbench to analyze forensic lethality metrics and simulation outcomes.</p>
                </div>
                <div className="grid grid-cols-2 gap-6 pt-12 border-t border-white/10 text-left">
                  <div>
                    <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest block mb-2">COGNITIVE LOAD</span>
                    <div className="h-1 bg-white/5 rounded w-full"></div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest block mb-2">BYPASS PROB.</span>
                    <div className="h-1 bg-white/5 rounded w-full"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
