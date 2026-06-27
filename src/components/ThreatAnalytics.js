"use client";

import { useState } from 'react';
import { PieChart, BarChart3, TrendingUp, ShieldAlert, Activity, Users, AlertTriangle, ArrowUpRight } from 'lucide-react';

const CRIME_DISTRIBUTION = [
  { label: "UPI & Shortened Payment Links", pct: 38, count: "28,196 cases", color: "#F43F5E" },
  { label: "CBI Digital Arrest & Police Warrants", pct: 26, count: "19,292 cases", color: "#8B5CF6" },
  { label: "Telegram Investment Task Syndicates", pct: 18, count: "13,356 cases", color: "#F59E0B" },
  { label: "Sideloaded Loan App APK Trojans", pct: 12, count: "8,904 cases", color: "#10B981" },
  { label: "AI Voice Cloning Family Extortion", pct: 6, count: "4,452 cases", color: "#06B6D4" }
];

const MONTHLY_CASES = [
  { month: "Jan", cases: 18400, label: "18.4k" },
  { month: "Feb", cases: 24100, label: "24.1k" },
  { month: "Mar", cases: 31200, label: "31.2k" },
  { month: "Apr", cases: 42800, label: "42.8k" },
  { month: "May", cases: 56900, label: "56.9k" },
  { month: "Jun", cases: 74200, label: "74.2k" }
];

export default function ThreatAnalytics() {
  const [selectedSector, setSelectedSector] = useState(0);
  const activeSector = CRIME_DISTRIBUTION[selectedSector];

  // Construct precise CSS conic gradient for instant zero-bundle donut pie render
  let accumulatedPct = 0;
  const gradientStops = CRIME_DISTRIBUTION.map(item => {
    const start = accumulatedPct;
    accumulatedPct += item.pct;
    return `${item.color} ${start}% ${accumulatedPct}%`;
  }).join(', ');

  return (
    <div className="space-y-10 font-mono animate-fade-in select-none">
      
      {/* Top KPI Summary Tickers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 bg-slate-950 border-rose-500/40 relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Deepfake & Voice Fraud</span>
            <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1">
              +182% MoM <ArrowUpRight size={12} />
            </span>
          </div>
          <span className="text-4xl font-black text-white font-['Outfit'] block tracking-tight">74,200</span>
          <span className="text-xs text-rose-400 block mt-1">Recorded Indian incidents last month</span>
        </div>

        <div className="glass-card p-6 bg-slate-950 border-emerald-500/40 relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">1930 Helpline Freezes</span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black px-2 py-0.5 rounded">
              Q2 Record
            </span>
          </div>
          <span className="text-4xl font-black text-emerald-400 font-['Outfit'] block tracking-tight">₹1,240 Cr</span>
          <span className="text-xs text-slate-300 block mt-1">Stolen citizen funds frozen in lien accounts</span>
        </div>

        <div className="glass-card p-6 bg-slate-950 border-cyan-400/40 relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Chakshu Blacklist</span>
            <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-[10px] font-black px-2 py-0.5 rounded">
              TRAI Registry
            </span>
          </div>
          <span className="text-4xl font-black text-cyan-300 font-['Outfit'] block tracking-tight">4.2 Lakh</span>
          <span className="text-xs text-slate-300 block mt-1">Spoofed SIMs & Skype handles disconnected</span>
        </div>
      </div>

      {/* Visual Pie Donut Chart Showcase & Breakdown */}
      <div className="glass-card p-8 sm:p-12 bg-slate-950 border-2 border-purple-500/60 shadow-[0_0_80px_rgba(139,92,246,0.2)]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6 mb-8">
          <div>
            <span className="text-xs text-purple-400 font-black uppercase tracking-widest block mb-1">National Typology Grid (I4C)</span>
            <h3 className="text-2xl sm:text-4xl font-black font-['Outfit'] text-white">Scam Vector Distribution Pie Chart</h3>
          </div>
          <span className="text-xs text-slate-400 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
            Based on 74,200 documented June filings
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* CSS Conic Donut Chart */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center py-4">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full shadow-[0_0_50px_rgba(255,255,255,0.08)] flex items-center justify-center"
                 style={{ background: `conic-gradient(${gradientStops})` }}>
              
              {/* Inner Donut Cutout */}
              <div className="w-40 h-40 sm:w-48 sm:h-48 bg-slate-950 rounded-full flex flex-col items-center justify-center p-4 text-center border border-white/10 shadow-inner">
                <span className="text-xs text-slate-400 uppercase font-bold">Vector Share</span>
                <span className="text-3xl sm:text-4xl font-black font-['Outfit'] text-white mt-0.5" style={{ color: activeSector.color }}>
                  {activeSector.pct}%
                </span>
                <span className="text-[10px] text-slate-300 font-bold line-clamp-2 mt-1">{activeSector.label}</span>
              </div>
            </div>
          </div>

          {/* Interactive Legend & Selector Matrix */}
          <div className="lg:col-span-7 space-y-3">
            <span className="text-xs font-black text-cyan-300 uppercase tracking-widest block mb-2">⚡ Tap Category To Inspect Dossier:</span>
            <div className="space-y-2.5">
              {CRIME_DISTRIBUTION.map((item, idx) => {
                const isSelected = selectedSector === idx;
                return (
                  <div 
                    key={idx}
                    onClick={() => setSelectedSector(idx)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected ? "bg-white/10 border-cyan-400 scale-102 shadow-lg" : "bg-white/5 border-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-3.5 h-3.5 rounded-full shrink-0 shadow-md" style={{ backgroundColor: item.color }}></span>
                      <span className="text-xs sm:text-sm font-bold text-white">{item.label}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-black font-['Outfit'] block" style={{ color: item.color }}>{item.pct}%</span>
                      <span className="text-[10px] text-slate-400 block">{item.count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Monthly Escalation Bar Chart Heuristic */}
      <div className="glass-card p-8 sm:p-12 bg-slate-950 border-rose-500/40">
        <div className="flex justify-between items-center border-b border-white/10 pb-6 mb-8">
          <div>
            <span className="text-xs text-rose-400 font-black uppercase tracking-widest block mb-1">Escalation Velocity</span>
            <h3 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white">Monthly Cyber Fraud Surge (2026)</h3>
          </div>
          <TrendingUp size={28} className="text-rose-400 shrink-0" />
        </div>

        {/* Bar Matrix */}
        <div className="flex items-end justify-between gap-2 sm:gap-6 h-64 pt-8 px-2 sm:px-6 border-b border-white/10">
          {MONTHLY_CASES.map((m, idx) => {
            const maxVal = 74200;
            const heightPct = Math.round((m.cases / maxVal) * 100);
            const isCurrent = idx === MONTHLY_CASES.length - 1;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <span className={`text-[10px] sm:text-xs font-black transition-transform group-hover:-translate-y-1 ${isCurrent ? "text-rose-400 scale-110" : "text-slate-400"}`}>
                  {m.label}
                </span>
                <div 
                  className={`w-full rounded-t-xl transition-all duration-500 ${
                    isCurrent ? "bg-gradient-to-t from-rose-600 to-amber-400 shadow-[0_0_25px_rgba(244,63,94,0.5)] animate-pulse" : "bg-slate-800 group-hover:bg-cyan-400/60"
                  }`}
                  style={{ height: `${heightPct}%` }}
                ></div>
                <span className="text-xs font-black text-white mt-2">{m.month}</span>
              </div>
            );
          })}
        </div>
        <div className="text-center pt-4 text-[10px] text-slate-500 uppercase tracking-widest">
          Data compiled from Ministry of Home Affairs I4C Monthly Dispatch Bulletins
        </div>
      </div>

    </div>
  );
}
