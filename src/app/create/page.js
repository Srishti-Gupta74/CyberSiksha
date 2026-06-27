"use client";

import { useState } from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import { Sparkles, Layers, PlusCircle, CheckCircle2, Share2, ShieldQuestion } from 'lucide-react';
import confetti from 'canvas-confetti';
import ShowcaseModal from '@/components/ShowcaseModal';

// Official I4C (Indian Cyber Crime Coordination Centre) documented crime categories
const I4C_CATEGORIES = [
  "Aadhaar Enabled Payment System (AePS) Biometric Cloning",
  "CBI / Customs 'Digital Arrest' Video Interrogation",
  "FedEx / Courier Narcotic Parcel Customs Scam",
  "Part-Time Work From Home (WFH) Telegram Task Fraud",
  "UPI QR Code 'Receive Money' Refund Deception",
  "WhatsApp APK Banking Reward Point Trojan",
  "SIM Swap Telecom Tower Outage Exploitation"
];

export default function CreateStudioPage() {
  const [selectedCategory, setSelectedCategory] = useState(I4C_CATEGORIES[0]);
  const [targetPersona, setTargetPersona] = useState("Elderly Parents");
  const [scenarioTitle, setScenarioTitle] = useState("");
  const [scenarioScript, setScenarioScript] = useState("");
  const [redFlags, setRedFlags] = useState(["Requests UPI PIN", "Threatens Immediate Arrest", "Unofficial Shortened Link"]);
  const [newFlag, setNewFlag] = useState("");

  const [publishedTraps, setPublishedTraps] = useState([
    {
      title: "Grandpa's Fake Electricity Cutoff SMS",
      category: "SIM Swap / Utility Disconnection",
      author: "Gupta Family Grid",
      rating: "98% Community Score",
      flagsCount: 3
    },
    {
      title: "Teen Instagram Brand Ambassador Offer",
      category: "Part-Time WFH Telegram Task Fraud",
      author: "Sharma Household",
      rating: "95% Community Score",
      flagsCount: 4
    }
  ]);

  const [showCardModal, setShowCardModal] = useState(false);

  const handleAddFlag = (e) => {
    e.preventDefault();
    if (!newFlag.trim() || redFlags.length >= 5) return;
    setRedFlags([...redFlags, newFlag.trim()]);
    setNewFlag("");
  };

  const handlePublishScenario = (e) => {
    e.preventDefault();
    if (!scenarioTitle.trim() || !scenarioScript.trim()) return;

    setPublishedTraps([
      {
        title: scenarioTitle,
        category: selectedCategory,
        author: "Gupta Family Grid (You)",
        rating: "🌟 New Community Submission",
        flagsCount: redFlags.length
      },
      ...publishedTraps
    ]);

    setScenarioTitle("");
    setScenarioScript("");
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    setShowCardModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto pb-44 pt-6 px-4 sm:px-6 animate-fade-in select-none">
      
      {/* Masthead */}
      <div className="glass-card p-8 md:p-14 mb-14 relative overflow-hidden bg-gradient-to-r from-purple-950/40 via-slate-950 to-slate-900 border border-purple-500/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-pink-500/15 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-pink-500/20 border border-pink-500/40 px-4 py-1.5 rounded-full text-xs font-mono font-black text-pink-300 tracking-widest uppercase mb-6 shadow-[0_0_20px_rgba(236,72,153,0.3)]">
            <Sparkles size={16} className="text-pink-400 animate-pulse" /> Next Techy Pixel No-Code Creator Studio
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-['Outfit'] text-white mb-6 leading-tight">
            ⚡ Scenario Creator: <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400">
              Community Defense Grid
            </span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
            Next Techy Pixel empowers builders. Turn your family's real cyber experiences into interactive community training modules seeded from official Indian Cyber Crime (I4C) fraud typologies.
          </p>
        </div>

        <button 
          onClick={() => setShowCardModal(true)}
          className="btn-primary py-5 px-8 text-xs font-black shrink-0 flex items-center gap-2 shadow-[0_0_35px_rgba(236,72,153,0.5)] cursor-pointer"
        >
          <Share2 size={18} /> <span>⚡ Generate Viral Defender Card</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* No-Code Studio Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card p-6 sm:p-10 bg-slate-950 border-purple-500/40">
            <h2 className="text-2xl font-black font-['Outfit'] text-white mb-8 flex items-center gap-3">
              <PlusCircle className="text-pink-400" /> Build Scenario Workbench
            </h2>

            <form onSubmit={handlePublishScenario} className="space-y-6 font-sans">
              <div>
                <label className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-black block mb-2">1. Official I4C Crime Category</label>
                <select 
                  value={selectedCategory} 
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white font-medium focus:border-pink-500 outline-none font-mono text-xs sm:text-sm"
                >
                  {I4C_CATEGORIES.map((cat, i) => (
                    <option key={i} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold block mb-2">2. Module Title</label>
                  <input 
                    type="text"
                    value={scenarioTitle}
                    onChange={e => setScenarioTitle(e.target.value)}
                    placeholder="e.g. Fake Electricity Bill Trap"
                    className="w-full bg-slate-900 border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white focus:border-pink-500 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold block mb-2">3. Target Persona</label>
                  <select 
                    value={targetPersona}
                    onChange={e => setTargetPersona(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white font-medium focus:border-pink-500 outline-none"
                  >
                    <option>Elderly Parents</option>
                    <option>Teenagers / Students</option>
                    <option>Working Professionals</option>
                    <option>Rural Citizens</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold block mb-2">4. Intercepted Scam Transcript / Story</label>
                <textarea 
                  value={scenarioScript}
                  onChange={e => setScenarioScript(e.target.value)}
                  placeholder="Describe the exact WhatsApp message or phone call script..."
                  rows={4}
                  className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-pink-500 outline-none resize-none font-mono text-xs sm:text-sm leading-relaxed"
                />
              </div>

              {/* Red Flags Manager */}
              <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/5">
                <label className="text-xs font-mono text-pink-400 uppercase tracking-widest font-black block">5. Configure Critical Red Flags (Max 5)</label>
                
                <div className="flex flex-wrap gap-2">
                  {redFlags.map((flag, i) => (
                    <span key={i} className="bg-purple-600/30 border border-purple-500/50 text-purple-200 text-xs font-mono font-bold px-3 py-1.5 rounded-xl flex items-center gap-2">
                      <span>🚩 {flag}</span>
                      <button type="button" onClick={() => setRedFlags(redFlags.filter((_, idx) => idx !== i))} className="hover:text-rose-400 font-bold">×</button>
                    </span>
                  ))}
                </div>

                {redFlags.length < 5 && (
                  <div className="flex gap-2 pt-2">
                    <input 
                      type="text"
                      value={newFlag}
                      onChange={e => setNewFlag(e.target.value)}
                      placeholder="Add red flag (e.g. Unofficial UPI handle)..."
                      className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:border-pink-500 outline-none font-mono"
                    />
                    <button type="button" onClick={handleAddFlag} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition-all">+</button>
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                disabled={!scenarioTitle.trim() || !scenarioScript.trim()}
                className="w-full py-5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 hover:opacity-95 text-slate-950 font-black uppercase text-xs sm:text-sm tracking-widest shadow-xl cursor-pointer transition-all disabled:opacity-25"
              >
                🚀 Publish To Community Defense Grid
              </button>
            </form>
          </div>
        </div>

        {/* Community Grid Showcase */}
        <div className="lg:col-span-5 space-y-6 font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-xs font-black uppercase tracking-widest text-cyan-400">🌐 Active Community Grid Scenarios</h3>
            <span className="text-[10px] text-slate-400">Seeded from I4C</span>
          </div>

          <div className="space-y-4">
            {publishedTraps.map((trap, i) => (
              <div key={i} className="glass-card p-6 bg-slate-950 border-white/10 hover:border-cyan-400/50 transition-all space-y-3 relative group">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[9px] font-bold text-pink-400 uppercase tracking-wider block mb-1">{trap.category}</span>
                    <h4 className="text-base font-black font-['Outfit'] text-white group-hover:text-cyan-300 transition-colors">{trap.title}</h4>
                  </div>
                  <span className="bg-white/5 px-2.5 py-1 rounded-lg text-[10px] text-slate-400 shrink-0">{trap.flagsCount} Flags</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[10px] text-slate-400">
                  <span>By {trap.author}</span>
                  <span className="text-emerald-400 font-bold">{trap.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <ShowcaseModal 
        isOpen={showCardModal} 
        onClose={() => setShowCardModal(false)}
        userName="Gupta Family Grid"
        xp={850}
        badge="Elite I4C Scenario Builder"
      />

    </div>
  );
}
