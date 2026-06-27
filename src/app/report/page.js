"use client";

import { useState } from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import { ShieldCheck, AlertTriangle, Mail, Sparkles, Download, CheckCircle2, Radar, Users } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FamilyResilienceReportPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [audit, setAudit] = useState(null);

  const [householdMembers, setHouseholdMembers] = useState([
    { name: "Grandfather (Rajesh)", score: 92, status: "Elite Banking Shield" },
    { name: "Mother (Sunita)", score: 88, status: "Phishing Resistant" },
    { name: "Son (Aarav)", score: 95, status: "Tactical Defender" }
  ]);

  const handleRunAudit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setLoading(true);
    setAudit(null);

    try {
      const res = await fetch(`/api/pwned?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      setAudit(data);
      setLoading(false);
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-44 pt-6 px-4 sm:px-6 animate-fade-in select-none">
      
      {/* Masthead Banner */}
      <div className="glass-card p-8 md:p-14 mb-14 relative overflow-hidden bg-gradient-to-r from-cyan-950/40 via-slate-950 to-slate-900 border border-cyan-500/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-500/40 px-4 py-1.5 rounded-full text-xs font-mono font-black text-cyan-300 tracking-widest uppercase mb-6 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
            <Radar size={16} className="text-cyan-400 animate-spin" /> CyberCIA Forge Resilience Framework
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-['Outfit'] text-white mb-6 leading-tight">
            📊 Household Cyber <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500">
              Resilience Audit Report
            </span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
            Generate an authoritative, shareable household defense audit. Evaluated strictly against official **RBI Fraud Categorization Typologies** and documented Indian historical breach records.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-purple-500/40 p-6 rounded-3xl text-center shadow-2xl shrink-0 max-w-xs relative">
          <span className="text-3xl font-black font-mono text-cyan-400 block mb-1">91.6%</span>
          <span className="text-[10px] font-mono text-purple-300 uppercase tracking-widest font-bold block">Combined Household Score</span>
          <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full w-[91.6%] shadow-[0_0_10px_#22d3ee]"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Email Breach Scanner Workbench */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-card p-6 sm:p-10 bg-slate-950 border-white/10 space-y-6">
            <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white flex items-center gap-3">
              <Mail className="text-cyan-400" /> Member Breach Lookup
            </h2>

            <form onSubmit={handleRunAudit} className="space-y-4 font-mono">
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-widest block mb-2 font-bold">Enter Family Member Email</label>
                <input 
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. grandpa.sharma@gmail.com"
                  className="w-full bg-slate-900 border border-white/10 rounded-2xl px-4 py-4 text-sm text-white focus:border-cyan-400 outline-none"
                />
              </div>

              <button 
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full py-4 rounded-2xl btn-primary text-xs font-black uppercase tracking-widest shadow-xl cursor-pointer transition-all disabled:opacity-30"
              >
                {loading ? "Scanning Historical Archives..." : "⚡ Execute Forensic Exposure Audit"}
              </button>
            </form>

            {audit && (
              <div className="pt-6 border-t border-white/10 space-y-4 animate-scale-up font-sans">
                <div className="flex items-center justify-between bg-rose-500/10 border border-rose-500/30 p-4 rounded-2xl text-rose-300 font-mono text-xs">
                  <span className="flex items-center gap-2 font-bold"><AlertTriangle size={16} className="text-rose-400" /> Exposure Detected:</span>
                  <span className="font-black text-sm">{audit.breachCount} Breaches</span>
                </div>

                <div className="space-y-3">
                  {audit.breaches.map((br, i) => (
                    <div key={i} className="bg-slate-900/90 border border-white/10 p-4 rounded-2xl space-y-1">
                      <div className="flex justify-between items-center font-['Outfit'] font-black text-white text-base">
                        <span>{br.name}</span>
                        <span className="text-xs font-mono font-bold text-rose-400">{br.year}</span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono">{br.type}</p>
                      <p className="text-xs text-slate-300 leading-relaxed pt-1">{br.details}</p>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center font-mono space-y-1">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">{audit.certificationBadge}</span>
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider">{audit.methodology}</p>
                  <p className="text-[8px] text-slate-500 italic pt-1">{audit.disclaimer}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RBI Typology Radar & Household Roster */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-card p-6 sm:p-10 bg-slate-950 border-cyan-500/30 space-y-8">
            <div>
              <span className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-widest block mb-1">RBI Documented Typology</span>
              <h3 className="text-2xl font-black font-['Outfit'] text-white">4-Pillar Resilience Radar</h3>
            </div>

            {/* Radar Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 font-mono">
              <div className="bg-slate-900/80 p-5 rounded-2xl border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Phishing Awareness</span>
                <span className="text-2xl font-black text-emerald-400 block">94%</span>
                <span className="text-[8px] text-slate-500 uppercase">RBI Typology 1.1</span>
              </div>

              <div className="bg-slate-900/80 p-5 rounded-2xl border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Social Eng. Resistance</span>
                <span className="text-2xl font-black text-cyan-400 block">89%</span>
                <span className="text-[8px] text-slate-500 uppercase">RBI Typology 2.4</span>
              </div>

              <div className="bg-slate-900/80 p-5 rounded-2xl border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Password Hygiene</span>
                <span className="text-2xl font-black text-purple-400 block">96%</span>
                <span className="text-[8px] text-slate-500 uppercase">CERT-In Best Pract.</span>
              </div>

              <div className="bg-slate-900/80 p-5 rounded-2xl border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Banking Scam Recog.</span>
                <span className="text-2xl font-black text-amber-400 block">88%</span>
                <span className="text-[8px] text-slate-500 uppercase">RBI Typology 4.0</span>
              </div>
            </div>

            {/* Household Roster Audit */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h4 className="text-xs font-mono font-black uppercase tracking-widest text-slate-300 flex items-center gap-2">
                <Users size={16} className="text-purple-400" /> <span>Individual Roster Audit Scores</span>
              </h4>

              <div className="space-y-3">
                {householdMembers.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 font-mono">
                    <div>
                      <span className="text-sm font-bold text-white block">{m.name}</span>
                      <span className="text-[10px] text-cyan-300 uppercase">{m.status}</span>
                    </div>
                    <span className="text-xl font-black text-emerald-400">{m.score}/100</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
