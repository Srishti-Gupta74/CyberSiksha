"use client";

import { useState } from 'react';
import { PieChart, BarChart3, TrendingUp, ShieldAlert, Activity, Users, AlertTriangle, ArrowUpRight } from 'lucide-react';

const CRIME_DISTRIBUTION = [
  { label: "Financial Fraud (UPI, NetBanking & Cards)", pct: 44, count: "12.38 Lakh complaints", color: "#F43F5E" },
  { label: "Online Job & Telegram Investment Syndicates", pct: 22, count: "6.19 Lakh complaints", color: "#8B5CF6" },
  { label: "Impersonation & Digital Arrest (CBI/Police)", pct: 16, count: "4.50 Lakh complaints", color: "#F59E0B" },
  { label: "Sideloaded APK Loan Apps & Mobile Trojans", pct: 11, count: "3.09 Lakh complaints", color: "#10B981" },
  { label: "Sextortion & Social Media Harassment", pct: 7, count: "1.97 Lakh complaints", color: "#06B6D4" }
];

const ANNUAL_INCIDENTS = [
  { year: "2021", cases: 1402809, label: "14.03L" },
  { year: "2022", cases: 1391457, label: "13.91L" },
  { year: "2023", cases: 1592917, label: "15.93L" },
  { year: "2024", cases: 2041360, label: "20.41L" },
  { year: "2025", cases: 2944248, label: "29.44L" }
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
      
      {/* Top KPI Summary Tickers (High contrast & large fonts for elders) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 sm:p-8 bg-slate-900 border-2 border-rose-500/60 relative overflow-hidden rounded-3xl shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs sm:text-sm text-slate-200 font-bold uppercase tracking-wider">CERT-In Reported Incidents</span>
            <span className="bg-rose-500/30 text-rose-200 border border-rose-400 font-black text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 shadow">
              +44.2% YoY <ArrowUpRight size={14} />
            </span>
          </div>
          <span className="text-4xl sm:text-5xl font-black text-white font-['Outfit'] block tracking-tight">29.44 Lakh</span>
          <span className="text-xs sm:text-sm font-bold text-rose-300 block mt-2">Official MeitY parliamentary data disclosure</span>
        </div>

        <div className="glass-card p-6 sm:p-8 bg-slate-900 border-2 border-emerald-500/60 relative overflow-hidden rounded-3xl shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs sm:text-sm text-slate-200 font-bold uppercase tracking-wider">I4C Citizen Funds Saved</span>
            <span className="bg-emerald-500/30 text-emerald-200 border border-emerald-400 font-black text-xs px-2.5 py-1 rounded-lg shadow">
              23.61L+ Cases
            </span>
          </div>
          <span className="text-4xl sm:text-5xl font-black text-emerald-400 font-['Outfit'] block tracking-tight">₹8,189 Cr</span>
          <span className="text-xs sm:text-sm font-bold text-slate-200 block mt-2">Total money saved/frozen via 1930 NCRP Portal</span>
        </div>

        <div className="glass-card p-6 sm:p-8 bg-slate-900 border-2 border-cyan-400/60 relative overflow-hidden rounded-3xl shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs sm:text-sm text-slate-200 font-bold uppercase tracking-wider">NCRP Citizen Complaints</span>
            <span className="bg-cyan-500/30 text-cyan-200 border border-cyan-400 font-black text-xs px-2.5 py-1 rounded-lg shadow">
              ~88,976 / Day
            </span>
          </div>
          <span className="text-4xl sm:text-5xl font-black text-cyan-300 font-['Outfit'] block tracking-tight">28.15 Lakh</span>
          <span className="text-xs sm:text-sm font-bold text-slate-200 block mt-2">Annual complaints registered on cybercrime.gov.in</span>
        </div>
      </div>

      {/* Visual Pie Donut Chart Showcase & Breakdown */}
      <div className="glass-card p-8 sm:p-12 bg-slate-900 border-2 border-purple-500/80 shadow-[0_0_80px_rgba(139,92,246,0.2)] rounded-[2.5rem]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/20 pb-6 mb-8">
          <div>
            <span className="text-xs sm:text-sm text-purple-300 font-black uppercase tracking-widest block mb-1">National Typology Grid (I4C NCRP)</span>
            <h3 className="text-3xl sm:text-4xl font-black font-['Outfit'] text-white">Scam Vector Distribution Pie Chart</h3>
          </div>
          <span className="text-xs sm:text-sm font-bold text-slate-200 bg-white/10 px-4 py-2 rounded-xl border border-white/20 shadow">
            Based on 28.15 Lakh documented NCRP filings
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* CSS Conic Donut Chart */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center py-4">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full shadow-[0_0_50px_rgba(255,255,255,0.12)] flex items-center justify-center"
                 style={{ background: `conic-gradient(${gradientStops})` }}>
              
              {/* Inner Donut Cutout */}
              <div className="w-44 h-44 sm:w-56 sm:h-56 bg-slate-950 rounded-full flex flex-col items-center justify-center p-4 text-center border-2 border-white/20 shadow-inner">
                <span className="text-xs sm:text-sm text-slate-300 uppercase font-bold">Vector Share</span>
                <span className="text-4xl sm:text-5xl font-black font-['Outfit'] text-white mt-1" style={{ color: activeSector.color }}>
                  {activeSector.pct}%
                </span>
                <span className="text-xs sm:text-sm text-slate-100 font-bold line-clamp-2 mt-1 px-2">{activeSector.label}</span>
              </div>
            </div>
          </div>

          {/* Interactive Legend & Selector Matrix */}
          <div className="lg:col-span-7 space-y-4">
            <span className="text-base sm:text-lg font-black text-cyan-300 uppercase tracking-wider block mb-3">⚡ Tap Category To Inspect Dossier:</span>
            <div className="space-y-3">
              {CRIME_DISTRIBUTION.map((item, idx) => {
                const isSelected = selectedSector === idx;
                return (
                  <div 
                    key={idx}
                    onClick={() => setSelectedSector(idx)}
                    className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 shadow-md ${
                      isSelected ? "bg-white/15 border-cyan-400 scale-102 shadow-xl" : "bg-white/[0.06] border-white/15 hover:border-white/30 hover:bg-white/[0.1]"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="w-4 h-4 rounded-full shrink-0 shadow-md" style={{ backgroundColor: item.color }}></span>
                      <span className="text-sm sm:text-base font-bold text-white">{item.label}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-lg sm:text-2xl font-black font-['Outfit'] block" style={{ color: item.color }}>{item.pct}%</span>
                      <span className="text-xs sm:text-sm font-bold text-slate-200 block">{item.count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Annual Escalation Bar Chart Heuristic */}
      <div className="glass-card p-8 sm:p-12 bg-slate-900 border-2 border-rose-500/60 rounded-[2.5rem] shadow-2xl">
        <div className="flex justify-between items-center border-b border-white/20 pb-6 mb-8">
          <div>
            <span className="text-xs sm:text-sm text-rose-300 font-black uppercase tracking-widest block mb-1">Year-over-Year Escalation</span>
            <h3 className="text-2xl sm:text-4xl font-black font-['Outfit'] text-white">Annual Cyber Security Incidents Surge (CERT-In)</h3>
          </div>
          <TrendingUp size={36} className="text-rose-400 shrink-0" />
        </div>

        {/* Bar Matrix */}
        <div className="flex items-end justify-between gap-3 sm:gap-8 h-72 pt-8 px-2 sm:px-6 border-b border-white/20">
          {ANNUAL_INCIDENTS.map((m, idx) => {
            const maxVal = 2944248;
            const heightPct = Math.round((m.cases / maxVal) * 100);
            const isCurrent = idx === ANNUAL_INCIDENTS.length - 1;
            
            const barGradients = [
              "from-blue-600 to-cyan-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]",
              "from-cyan-600 to-teal-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]",
              "from-teal-600 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]",
              "from-purple-600 to-indigo-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]",
              "from-rose-600 via-amber-500 to-yellow-400 shadow-[0_0_30px_rgba(244,63,94,0.6)] animate-pulse"
            ];

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <span className={`text-xs sm:text-sm font-black transition-transform group-hover:-translate-y-1 ${isCurrent ? "text-amber-300 scale-110" : "text-slate-200"}`}>
                  {m.label}
                </span>
                <div 
                  className={`w-full rounded-t-2xl transition-all duration-500 bg-gradient-to-t ${barGradients[idx] || barGradients[0]} hover:brightness-125`}
                  style={{ height: `${heightPct}%` }}
                ></div>
                <span className="text-sm sm:text-base font-black text-white mt-3">{m.year}</span>
              </div>
            );
          })}
        </div>
        <div className="text-center pt-8 space-y-2">
          <p className="text-sm sm:text-base font-bold text-cyan-300">
            Official Citation Sources: Ministry of Electronics & Information Technology (MeitY) / CERT-In Parliamentary Disclosures & MHA I4C NCRP Dossier
          </p>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-3xl mx-auto leading-relaxed">
            Data reflects total cyber incidents tracked by CERT-In and citizen financial fraud reports logged via the National Helpline 1930 and cybercrime.gov.in.
          </p>
        </div>
      </div>

    </div>
  );
}
