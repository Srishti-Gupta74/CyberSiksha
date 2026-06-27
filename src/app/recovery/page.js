"use client";

import ScrollReveal from '@/components/ScrollReveal';
import { PhoneCall, ShieldAlert, ExternalLink, Lock, CheckCircle2, FileText, ArrowRight, AlertOctagon } from 'lucide-react';
import Link from 'next/link';

const BANK_FREEZE_NUMBERS = [
  { bank: "State Bank of India (SBI)", num: "1800 11 1109", sms: "BLOCK <CardLast4> to 567676" },
  { bank: "HDFC Bank", num: "1800 258 6161", sms: "BLOCK <CardLast4> to 5676712" },
  { bank: "ICICI Bank", num: "1800 1080", sms: "BLOCK <CardLast4> to 9215676766" },
  { bank: "Axis Bank", num: "1800 419 5577", sms: "BLOCKCARD to 5676782" },
  { bank: "Punjab National Bank (PNB)", num: "1800 180 2222", sms: "HOT <CardLast4> to 5607040" },
  { bank: "Paytm / UPI Gateway", num: "0120 4456456", sms: "Report in Paytm App Support" }
];

export default function EmergencyRecoveryPage() {
  return (
    <div className="max-w-6xl mx-auto pb-44 pt-6 px-4 sm:px-6 animate-fade-in select-none">
      
      {/* Emergency Masthead */}
      <div className="glass-card p-8 md:p-14 mb-12 relative overflow-hidden bg-gradient-to-r from-rose-950 via-slate-950 to-red-950 border-2 border-rose-500 shadow-[0_0_90px_rgba(244,63,94,0.35)] text-center sm:text-left flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-rose-600/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-rose-500/20 border border-rose-500/40 px-4 py-1.5 rounded-full text-xs font-mono font-black text-rose-300 tracking-widest uppercase mb-4 animate-pulse">
            <AlertOctagon size={16} className="text-rose-400 animate-spin" /> Golden Hour Citizen Emergency Protocol
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-['Outfit'] text-white mb-4 leading-tight">
            🚨 I Got Scammed — <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-300 to-purple-400">
              What Do I Do Now?
            </span>
          </h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-medium">
            Every minute counts. Do not panic. Follow India's documented post-fraud recovery sequence immediately to freeze stolen funds and lodge official cyber warrants.
          </p>
        </div>

        {/* National 1930 Call Action */}
        <div className="bg-gradient-to-br from-red-600 to-rose-700 p-8 rounded-3xl text-center shadow-2xl border-4 border-white/20 shrink-0 animate-scale-up">
          <span className="text-xs font-mono font-black uppercase text-rose-200 block mb-1 tracking-widest">National Cyber Helpline</span>
          <span className="text-6xl font-black font-mono text-white block tracking-tighter drop-shadow-md">1930</span>
          <a 
            href="tel:1930"
            className="mt-4 inline-flex items-center gap-2 bg-white text-rose-950 font-black uppercase text-xs px-6 py-3 rounded-2xl shadow-lg hover:bg-rose-100 transition-all font-mono"
          >
            <PhoneCall size={16} /> <span>Tap To Dial 1930 Now</span>
          </a>
        </div>
      </div>

      {/* 4-Step Action Sequence */}
      <div className="space-y-10">
        
        {/* Step 1: Government Portals Filing */}
        <div className="glass-card p-8 bg-slate-950 border-cyan-400/40 space-y-6">
          <div className="flex items-center gap-4 border-b border-white/10 pb-4">
            <span className="w-10 h-10 rounded-2xl bg-cyan-400/20 text-cyan-400 font-mono font-black text-xl flex items-center justify-center">1</span>
            <h2 className="text-2xl font-black font-['Outfit'] text-white">Lodge Warrants on Official Government Portals</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono">
            <div className="p-6 rounded-2xl bg-slate-900 border border-white/10 space-y-3">
              <span className="text-xs font-black text-cyan-400 uppercase tracking-wider block">Financial Cyber Fraud Portal</span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">Report unauthorized banking/UPI debits immediately. I4C freezes merchant accounts holding funds if filed within 2 hours.</p>
              <a 
                href="https://cybercrime.gov.in" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-cyan-300 bg-cyan-500/20 px-4 py-2 rounded-xl hover:bg-cyan-500/30 transition-all"
              >
                <span>Visit cybercrime.gov.in</span> <ExternalLink size={14} />
              </a>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-rose-500/30 space-y-3">
              <span className="text-xs font-black text-rose-400 uppercase tracking-wider block">TRAI Chakshu Suspect Registry</span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">Report spoofed CBI calls, fake KYC links, or extortion numbers. Department of Telecom blocks suspect IMEI and SIM handles.</p>
              {/* Note: Verified correct Hindi spelling sancharsaathi (double a) */}
              <a 
                href="https://sancharsaathi.gov.in/sfc" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-rose-300 bg-rose-500/20 px-4 py-2 rounded-xl hover:bg-rose-500/30 transition-all"
              >
                <span>Visit sancharsaathi.gov.in</span> <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Step 2: Emergency Bank Freeze Directory */}
        <div className="glass-card p-8 bg-slate-950 border-purple-500/40 space-y-6">
          <div className="flex items-center gap-4 border-b border-white/10 pb-4">
            <span className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 font-mono font-black text-xl flex items-center justify-center">2</span>
            <h2 className="text-2xl font-black font-['Outfit'] text-white">Direct Bank Fraud Desk Directory (Emergency Freeze)</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 font-mono">
            {BANK_FREEZE_NUMBERS.map((b, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-400 transition-all space-y-2">
                <span className="text-xs font-bold text-white block">{b.bank}</span>
                <span className="text-lg font-black text-purple-400 block tracking-tight">{b.num}</span>
                <span className="text-[10px] text-slate-400 block pt-1 border-t border-white/5 font-sans">SMS: {b.sms}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step 3: Forensic Evidence Preservation Checklist */}
        <div className="glass-card p-8 bg-slate-950 border-emerald-500/40 space-y-6">
          <div className="flex items-center gap-4 border-b border-white/10 pb-4">
            <span className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 font-mono font-black text-xl flex items-center justify-center">3</span>
            <h2 className="text-2xl font-black font-['Outfit'] text-white">Preserve Forensic Digital Evidence</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-slate-300">
            <div className="p-4 rounded-xl bg-slate-900 border border-white/5 flex items-center gap-3">
              <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
              <span>Capture untruncated screenshots of full SMS / WhatsApp conversation logs</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-white/5 flex items-center gap-3">
              <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
              <span>Copy exact 12-digit UPI / UTR Transaction Reference Numbers from bank statement</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-white/5 flex items-center gap-3">
              <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
              <span>Note down suspect telecom handle or Skype ID before blocking</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-white/5 flex items-center gap-3">
              <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
              <span>Lodge written intimation at your local Cyber Cell branch office</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
