"use client";

import { useState } from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import { PhoneCall, ShieldAlert, ExternalLink, Lock, CheckCircle2, FileText, ArrowRight, AlertOctagon, Activity, Sparkles, HelpCircle, Phone, Globe, Shield } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';

const BANK_FREEZE_NUMBERS = [
  { bank: "State Bank of India (SBI)", num: "1800 11 1109", sms: "BLOCK <CardLast4> to 567676" },
  { bank: "HDFC Bank", num: "1800 258 6161", sms: "BLOCK <CardLast4> to 5676712" },
  { bank: "ICICI Bank", num: "1800 1080", sms: "BLOCK <CardLast4> to 9215676766" },
  { bank: "Axis Bank", num: "1800 419 5577", sms: "BLOCKCARD to 5676782" },
  { bank: "Punjab National Bank (PNB)", num: "1800 180 2222", sms: "HOT <CardLast4> to 5607040" },
  { bank: "Paytm / UPI Gateway", num: "0120 4456456", sms: "Report in Paytm App Support" }
];

const NATIONAL_HELPLINES = [
  { name: "National Cyber Helpline (Golden Hour Fund Freeze)", num: "1930", badge: "🔴 CRITICAL 24/7" },
  { name: "National Emergency Helpline (Police / Rescue)", num: "112", badge: "🚨 EMERGENCY" },
  { name: "Women & Child Cyber Protection Helpline", num: "181 / 1091", badge: "🛡️ PRIORITY SAFETY" },
  { name: "RBI Financial Consumer Fraud Helpline", num: "14448", badge: "🏦 BANKING REGULATOR" }
];

const SCENARIO_GUIDES = [
  {
    id: "arrest",
    title: "👮 Fake CBI / Police Digital Arrest",
    subtitle: "Scammer on video call claiming your Aadhaar/SIM is linked to money laundering or drugs.",
    steps: [
      "HANG UP IMMEDIATELY — Indian Police, CBI, or judges NEVER conduct video call interrogations via Skype or WhatsApp.",
      "Cover your phone or laptop webcam with opaque tape or disconnect internet immediately.",
      "DO NOT transfer 'security bail' or share screen recordings of your bank accounts.",
      "Report the scammer's Skype ID or mobile number immediately on TRAI Chakshu portal."
    ]
  },
  {
    id: "upi",
    title: "💸 UPI / Bank Account Money Debited",
    subtitle: "Unauthorized money transfer occurred after clicking a link or sharing OTP.",
    steps: [
      "DIAL 1930 WITHIN 2 HOURS (The Golden Hour) — I4C can put a lien freeze on scammer accounts holding stolen funds.",
      "Send SMS to your bank fraud desk (from directory below) to instantly block debit card & netbanking.",
      "Copy the exact 12-digit UTR / UPI Transaction Reference Number from your SMS or bank passbook.",
      "File a formal online dispute warrant on cybercrime.gov.in attaching the transaction screenshot."
    ]
  },
  {
    id: "job",
    title: "💬 Telegram Job / Task Scam Deposit",
    subtitle: "Paid prepaid deposit for YouTube likes or hotel reviews and cannot withdraw money.",
    steps: [
      "STOP DEPOSITING MONEY IMMEDIATELY — Do not pay 'tax' or 'unfreeze fee' to recover lost funds; it is a trap.",
      "Take screenshots of every UPI ID or bank account where you transferred money.",
      "Exit and report the Telegram VIP recruitment group to @notoscambot.",
      "Report recipient merchant handles to 1930 to freeze their fraudulent payout accounts."
    ]
  },
  {
    id: "electricity",
    title: "⚡ Electricity Disconnection / APK Trojan",
    subtitle: "Received SMS about power disconnection tonight or downloaded SBI Reward points APK.",
    steps: [
      "DO NOT call the 10-digit personal mobile number listed in the SMS message.",
      "If you installed AnyDesk, TeamViewer, or an unverified APK, TURN OFF MOBILE DATA / WI-FI instantly.",
      "Uninstall the suspicious APK and run Google Play Protect full device scan.",
      "Verify electricity bill status only on your state's official utility board portal or official app."
    ]
  }
];

const RECOVERY_STEPS = [
  "Dialed 1930 National Cyber Helpline to trigger golden hour lien freeze",
  "Contacted bank fraud desk & initiated emergency debit card / netbanking lock",
  "Reported suspect phone number / handle on TRAI Chakshu portal (sancharsaathi.gov.in)",
  "Preserved full untruncated chat logs & 12-digit UPI / UTR transaction reference numbers"
];

export default function EmergencyRecoveryPage() {
  const [completedSteps, setCompletedSteps] = useState([]);
  const [activeScenario, setActiveScenario] = useState("arrest");

  const toggleRecoveryStep = (idx) => {
    const next = completedSteps.includes(idx) ? completedSteps.filter(i => i !== idx) : [...completedSteps, idx];
    setCompletedSteps(next);
    if (next.length === RECOVERY_STEPS.length) {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-44 pt-6 px-4 sm:px-6 animate-fade-in select-none font-mono">
      
      {/* Interactive Visual Emergency Response Tracker */}
      <div className="mb-10 glass-card p-6 sm:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border-2 border-cyan-400 shadow-2xl space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <span className="text-xs font-black uppercase tracking-widest text-cyan-300 flex items-center gap-2">
            <Activity size={16} className="text-cyan-400 animate-pulse" /> Interactive Visual Recovery Action Board:
          </span>
          <span className="bg-cyan-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full">
            {completedSteps.length} of 4 Actions Verified ({Math.round((completedSteps.length / 4) * 100)}%)
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-white/10">
          <div 
            className="bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 h-full transition-all duration-500"
            style={{ width: `${(completedSteps.length / 4) * 100}%` }}
          ></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
          {RECOVERY_STEPS.map((stepText, idx) => {
            const isDone = completedSteps.includes(idx);
            return (
              <div 
                key={idx}
                onClick={() => toggleRecoveryStep(idx)}
                className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                  isDone ? "bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold" : "bg-white/5 border-white/10 text-slate-300 hover:border-cyan-400"
                }`}
              >
                <span className="text-base shrink-0">{isDone ? "✔" : "◻"}</span>
                <span className="leading-snug">{stepText}</span>
              </div>
            );
          })}
        </div>

        {completedSteps.length === 4 && (
          <div className="p-4 rounded-2xl bg-emerald-500 text-slate-950 font-black text-center text-xs uppercase tracking-widest animate-bounce shadow-xl mt-2">
            🛡️ ALL RECOVERY PROTOCOLS EXECUTED! DIGITAL EVIDENCE PRESERVED!
          </div>
        )}
      </div>

      {/* Emergency Masthead */}
      <div className="glass-card p-8 md:p-14 mb-12 relative overflow-hidden bg-gradient-to-r from-rose-950 via-slate-950 to-red-950 border-2 border-rose-500 shadow-[0_0_90px_rgba(244,63,94,0.35)] text-center sm:text-left flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-rose-600/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-rose-500/20 border border-rose-500/40 px-4 py-1.5 rounded-full text-xs font-mono font-black text-rose-300 tracking-widest uppercase mb-4 animate-pulse">
            <AlertOctagon size={16} className="text-rose-400 animate-spin" /> Golden Hour Citizen Emergency Protocol
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-['Outfit'] text-white mb-4 leading-tight">
            🚨 Scammed? SOS Guide — <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-300 to-purple-400">
              What To Do Right Now
            </span>
          </h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-medium">
            Every second matters. Do not panic. Select your emergency scenario below for an immediate step-by-step action sequence, or call national government helplines to freeze funds.
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

      {/* NEW: Scenario-Specific Emergency To-Do Guides */}
      <div className="mb-12 glass-card p-6 sm:p-10 bg-slate-950 border-2 border-rose-500/80 shadow-[0_0_80px_rgba(244,63,94,0.2)]">
        <div className="border-b border-white/10 pb-6 mb-8">
          <span className="text-xs font-black text-rose-400 uppercase tracking-widest flex items-center gap-2 mb-1">
            <HelpCircle size={16} className="animate-bounce" /> Scenario-Specific Action Sequences
          </span>
          <h2 className="text-2xl sm:text-4xl font-black font-['Outfit'] text-white">What To Do When Something Goes Wrong</h2>
          <p className="text-xs text-slate-300 mt-1">Select the specific scam or threat scenario you are facing right now for tailored emergency instructions:</p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {SCENARIO_GUIDES.map(sc => (
            <button
              key={sc.id}
              onClick={() => setActiveScenario(sc.id)}
              className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                activeScenario === sc.id 
                  ? "bg-rose-500/20 border-rose-400 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)] scale-105" 
                  : "bg-white/5 border-white/10 text-slate-300 hover:border-white/30"
              }`}
            >
              <span className="font-bold text-sm leading-tight block mb-1">{sc.title}</span>
              <span className="text-[10px] text-slate-400 font-sans line-clamp-2">{sc.subtitle}</span>
            </button>
          ))}
        </div>

        {/* Active Scenario Guide Display */}
        {(() => {
          const active = SCENARIO_GUIDES.find(s => s.id === activeScenario) || SCENARIO_GUIDES[0];
          return (
            <div className="bg-slate-900/80 p-6 sm:p-8 rounded-3xl border border-rose-400/50 space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-black text-rose-300 uppercase tracking-widest bg-rose-500/20 px-3 py-1 rounded-full border border-rose-500/30">Emergency Protocol Active</span>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-2">{active.title}</h3>
                </div>
              </div>

              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 block">Immediate Action Checklist (Do These 4 Things Now):</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {active.steps.map((step, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-white/10 flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-rose-500 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">{idx+1}</span>
                      <span className="text-xs text-slate-200 font-sans leading-relaxed font-medium">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Comprehensive Helplines & Government Assistance Directory */}
      <div className="space-y-10">
        
        {/* NEW: National Emergency & Government Helpline Directory */}
        <div className="glass-card p-8 bg-slate-950 border-rose-500/60 space-y-6">
          <div className="flex items-center gap-4 border-b border-white/10 pb-4">
            <span className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 font-mono font-black text-xl flex items-center justify-center"><Phone size={20} /></span>
            <div>
              <h2 className="text-2xl font-black font-['Outfit'] text-white">National Government Emergency Helplines</h2>
              <p className="text-xs text-slate-300 font-sans">Verified 24/7 helpline numbers established by Government of India & Regulatory Authorities</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
            {NATIONAL_HELPLINES.map((h, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-rose-400 transition-all space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-rose-300 block">{h.badge}</span>
                  <span className="text-xs font-bold text-white block mt-1">{h.name}</span>
                </div>
                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-2xl font-black text-rose-400 tracking-tight">{h.num}</span>
                  <a href={`tel:${h.num.split(' ')[0]}`} className="p-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white transition-all">
                    <PhoneCall size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Government Portals Filing */}
        <div className="glass-card p-8 bg-slate-950 border-cyan-400/40 space-y-6">
          <div className="flex items-center gap-4 border-b border-white/10 pb-4">
            <span className="w-10 h-10 rounded-2xl bg-cyan-400/20 text-cyan-400 font-mono font-black text-xl flex items-center justify-center"><Globe size={20} /></span>
            <h2 className="text-2xl font-black font-['Outfit'] text-white">Official Government Citizen Reporting Portals</h2>
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
            <span className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 font-mono font-black text-xl flex items-center justify-center"><Shield size={20} /></span>
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
