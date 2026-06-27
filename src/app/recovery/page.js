"use client";

import { useState } from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import { PhoneCall, ShieldAlert, ExternalLink, Lock, CheckCircle2, FileText, ArrowRight, AlertOctagon, Activity, Sparkles, HelpCircle, Phone, Globe, Shield, ChevronDown, ChevronUp, Copy, Check, Clock, ListFilter } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';

const BANK_FREEZE_NUMBERS = [
  { bank: "State Bank of India (SBI)", num: "1800 11 1109", sms: "BLOCK <CardLast4> to 567676", color: "cyan" },
  { bank: "HDFC Bank", num: "1800 258 6161", sms: "BLOCK <CardLast4> to 5676712", color: "blue" },
  { bank: "ICICI Bank", num: "1800 1080", sms: "BLOCK <CardLast4> to 9215676766", color: "purple" },
  { bank: "Axis Bank", num: "1800 419 5577", sms: "BLOCKCARD to 5676782", color: "rose" },
  { bank: "Punjab National Bank (PNB)", num: "1800 180 2222", sms: "HOT <CardLast4> to 5607040", color: "amber" },
  { bank: "Paytm / UPI Gateway", num: "0120 4456456", sms: "Report in Paytm App Support", color: "cyan" }
];

const NATIONAL_HELPLINES = [
  { name: "National Cyber Helpline (Golden Hour Fund Freeze)", num: "1930", desc: "Specialized assistance for banking and UPI related scams. Call immediately to block money transfer." },
  { name: "National Emergency Response", num: "112", desc: "National emergency number for all types of crisis support and police rescue." },
  { name: "RBI Financial Consumer Fraud Support", num: "14448", desc: "Official Reserve Bank of India helpline for unauthorized banking transactions." },
  { name: "Women & Child Cyber Protection Helpline", num: "181 / 1091", desc: "Specialized cyber harassment and online safety support for women and minors." }
];

const SCENARIO_GUIDES = [
  {
    id: "arrest",
    code: "CBI",
    shortTitle: "DIGITAL ARREST",
    title: "Fake CBI / Police Digital Arrest",
    protocolId: "882-CBI",
    subtitle: "Scammers initiate a video call posing as law enforcement, claiming your Aadhaar or SIM is linked to money laundering or drug trafficking to extort 'bail' money.",
    tagColor: "border-rose-500 text-rose-400 bg-rose-500/10 shadow-[0_0_20px_rgba(244,63,94,0.3)]",
    stepColor: "text-rose-500 border-rose-500/30",
    steps: [
      { num: "01", title: "TERMINATE CALL", desc: "Hang up immediately. Indian Police, CBI, or judges NEVER conduct video call interrogations via Skype or WhatsApp." },
      { num: "02", title: "BLIND THE CAMERA", desc: "Cover your phone or laptop webcam with opaque tape immediately. Do not let them capture your environment." },
      { num: "03", title: "ZERO TRANSFER", desc: "Do not transfer 'security bail' or share screen recordings. Official bail is never paid via UPI or online transfers." },
      { num: "04", title: "REPORT PORTAL", desc: "Visit the Chakshu Portal (sancharsaathi.gov.in) immediately to report the scammer's Skype ID and mobile number." }
    ]
  },
  {
    id: "upi",
    code: "UPI",
    shortTitle: "MONEY DEBITED",
    title: "UPI / Bank Account Money Debited",
    protocolId: "404-UPI",
    subtitle: "Unauthorized money transfer occurred after clicking a suspicious link, accepting a collect request, or inadvertently sharing an OTP code.",
    tagColor: "border-amber-500 text-amber-400 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.3)]",
    stepColor: "text-amber-400 border-amber-500/30",
    steps: [
      { num: "01", title: "DIAL GOLDEN HOUR", desc: "Call 1930 within the first 2 hours. I4C cyber police can put a live lien freeze on suspect accounts holding stolen funds." },
      { num: "02", title: "LOCK CARDS & UPI", desc: "Send SMS format to your bank hotline directory to instantly hotlist debit cards and netbanking access." },
      { num: "03", title: "COPY 12-DIGIT UTR", desc: "Extract the exact 12-digit UPI / UTR transaction reference number from your bank passbook or SMS debit alert." },
      { num: "04", title: "FILE DISPUTE", desc: "Submit a formal online dispute warrant on cybercrime.gov.in attaching the transaction screenshot evidence." }
    ]
  },
  {
    id: "job",
    code: "TG",
    shortTitle: "JOB SCAM",
    title: "Telegram Job / Task Scam Deposit",
    protocolId: "512-TG",
    subtitle: "Paid prepaid deposit for YouTube likes, movie ratings, or hotel reviews and cannot withdraw accumulated wallet money.",
    tagColor: "border-purple-500 text-purple-400 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.3)]",
    stepColor: "text-purple-400 border-purple-500/30",
    steps: [
      { num: "01", title: "STOP DEPOSITS", desc: "Stop transferring money immediately. Do not pay 'tax' or 'unfreeze fee' to recover lost funds; it is a psychological trap." },
      { num: "02", title: "CAPTURE EVIDENCE", desc: "Take clear screenshots of every UPI ID, QR code, and bank account where you transferred deposit money." },
      { num: "03", title: "REPORT GROUP", desc: "Exit and report the Telegram VIP recruitment group to @notoscambot and platform safety moderators." },
      { num: "04", title: "FREEZE PAYOUTS", desc: "Report recipient merchant handles to 1930 to freeze their fraudulent payout bank accounts before laundering." }
    ]
  },
  {
    id: "electricity",
    code: "APK",
    shortTitle: "TROJAN APK",
    title: "Electricity Disconnection / APK Trojan",
    protocolId: "909-APK",
    subtitle: "Received SMS threatening power disconnection tonight or downloaded SBI Reward points / credit card KYC update APK.",
    tagColor: "border-cyan-400 text-cyan-300 bg-cyan-400/10 shadow-[0_0_20px_rgba(34,211,238,0.3)]",
    stepColor: "text-cyan-400 border-cyan-400/30",
    steps: [
      { num: "01", title: "SEVER INTERNET", desc: "If you installed AnyDesk, TeamViewer, or an unverified APK, turn off mobile data and Wi-Fi instantly." },
      { num: "02", title: "IGNORE SMS NUMBER", desc: "Do not call the 10-digit personal mobile number listed in the threatening disconnection SMS message." },
      { num: "03", title: "PURGE MALWARE", desc: "Uninstall the suspicious APK in safe mode and run a Google Play Protect full device security scan." },
      { num: "04", title: "OFFICIAL PORTAL", desc: "Verify electricity bill status only on your state's official utility board portal or authorized mobile app." }
    ]
  },
  {
    id: "sim",
    code: "SIM",
    shortTitle: "OTP SWAP",
    title: "SIM Swap & Cloned Network Attack",
    protocolId: "303-SIM",
    subtitle: "Mobile network suddenly disabled while scammers intercept SMS OTPs to empty linked bank accounts.",
    tagColor: "border-blue-500 text-blue-400 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.3)]",
    stepColor: "text-blue-400 border-blue-500/30",
    steps: [
      { num: "01", title: "EMERGENCY FREEZE", desc: "Contact your bank hotline immediately from another phone or device to freeze netbanking and UPI transactions." },
      { num: "02", title: "LOCK SIM HANDLE", desc: "Call your telecom provider (Airtel/Jio/Vi) customer care to immediately disable the cloned SIM handle." },
      { num: "03", title: "DIAL 1930", desc: "File an immediate golden hour fund reversal claim with national cyber police within the first 2 hours." },
      { num: "04", title: "RESET KEYS", desc: "Reset email and netbanking passwords using secondary recovery backup keys and hardware authentication." }
    ]
  }
];

export default function EmergencyRecoveryPage() {
  const [activeTab, setActiveTab] = useState("timeline"); // "timeline" | "helplines" | "banks" | "guides"
  const [expandedScenario, setExpandedScenario] = useState("arrest");
  const [copiedSms, setCopiedSms] = useState(null);

  const handleCopySms = (sms, idx) => {
    navigator.clipboard.writeText(sms);
    setCopiedSms(idx);
    setTimeout(() => setCopiedSms(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto pb-44 pt-6 px-4 sm:px-6 animate-fade-in select-none">
      
      {/* HERO STEP 01: IMMEDIATE ACTION BOX (Clean, high-contrast, easy to scan by elders) */}
      <ScrollReveal>
        <div className="p-8 sm:p-12 md:p-16 mb-16 rounded-[2.5rem] relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950/60 border-2 border-rose-500/80 shadow-[0_0_60px_rgba(244,63,94,0.25)] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-center md:text-left">
            <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-[0.25em] text-rose-400 block animate-pulse">
              🚨 IN CASE OF ACTIVE FINANCIAL CYBER FRAUD OR EMERGENCY
            </span>
            <h1 className="text-4xl sm:text-6xl font-black font-heading text-white tracking-tight">
              National Helpline <span className="text-rose-500 underline decoration-4 underline-offset-8">1930</span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal pt-2">
              If you or an elder have just suffered an unauthorized money deduction or active scam, dial 1930 immediately within the 2-hour Golden Hour to freeze stolen funds.
            </p>
          </div>

          <a 
            href="tel:1930"
            className="w-full md:w-auto px-8 py-5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-lg sm:text-xl font-mono uppercase tracking-wider shadow-[0_0_35px_rgba(244,63,94,0.6)] hover:scale-105 transition-all flex items-center justify-center gap-3 shrink-0"
          >
            <PhoneCall size={24} className="animate-bounce" /> <span>DIAL 1930 (EMERGENCY)</span>
          </a>
        </div>
      </ScrollReveal>

      {/* Clean Navigation Tab Bar (High contrast & large fonts for elders) */}
      <div className="flex justify-center mb-16">
        <div className="bg-slate-900/90 p-3 rounded-3xl border-2 border-white/20 flex flex-wrap justify-center gap-3 font-mono text-sm sm:text-base uppercase tracking-wider shadow-2xl">
          <button 
            onClick={() => setActiveTab("timeline")}
            className={`px-6 py-4 rounded-2xl transition-all cursor-pointer flex items-center gap-3 font-bold ${activeTab === "timeline" ? "bg-cyan-400 text-slate-950 font-black shadow-[0_0_20px_rgba(34,211,238,0.5)] scale-105" : "bg-white/5 border border-white/10 text-slate-100 hover:bg-white/10 hover:text-white"}`}
          >
            <Clock size={20} /> <span>Incident Timeline</span>
          </button>
          <button 
            onClick={() => setActiveTab("helplines")}
            className={`px-6 py-4 rounded-2xl transition-all cursor-pointer flex items-center gap-3 font-bold ${activeTab === "helplines" ? "bg-rose-500 text-white font-black shadow-[0_0_20px_rgba(244,63,94,0.5)] scale-105" : "bg-white/5 border border-white/10 text-slate-100 hover:bg-white/10 hover:text-white"}`}
          >
            <Phone size={20} /> <span>Emergency Helplines</span>
          </button>
          <button 
            onClick={() => setActiveTab("banks")}
            className={`px-6 py-4 rounded-2xl transition-all cursor-pointer flex items-center gap-3 font-bold ${activeTab === "banks" ? "bg-purple-600 text-white font-black shadow-[0_0_20px_rgba(168,85,247,0.5)] scale-105" : "bg-white/5 border border-white/10 text-slate-100 hover:bg-white/10 hover:text-white"}`}
          >
            <Shield size={20} /> <span>Bank Freeze Hotlines</span>
          </button>
          <button 
            onClick={() => setActiveTab("guides")}
            className={`px-6 py-4 rounded-2xl transition-all cursor-pointer flex items-center gap-3 font-bold ${activeTab === "guides" ? "bg-blue-600 text-white font-black shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-105" : "bg-white/5 border border-white/10 text-slate-100 hover:bg-white/10 hover:text-white"}`}
          >
            <ListFilter size={20} /> <span>Scam Action Guides</span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT 1: INCIDENT RESPONSE TIMELINE (Reference Screenshot 1 style!) */}
      {activeTab === "timeline" && (
        <div className="space-y-12 animate-fade-in">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <span className="text-sm font-mono font-black tracking-widest uppercase text-cyan-400 block mb-3">EMERGENCY RESPONSE PROTOCOL V2.4</span>
            <h2 className="text-4xl sm:text-6xl font-black font-heading text-white mb-6">Incident Response Timeline</h2>
            <p className="text-slate-100 text-lg sm:text-xl font-normal leading-relaxed">Follow these steps in exact sequence to contain financial loss and document cyber fraud. Remain calm. Every minute counts.</p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Center Vertical Timeline Line */}
            <div className="hidden md:block absolute top-6 bottom-6 left-1/3 w-0.5 bg-gradient-to-b from-rose-500 via-purple-500 to-cyan-500 -translate-x-1/2"></div>

            {/* Step 1: 00m Immediate Dial */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-20 relative">
              <div className="md:w-1/3 md:pr-12 text-left md:text-right">
                <h3 className="text-3xl font-black font-heading text-white mb-1">Immediate Dial</h3>
                <span className="text-base sm:text-lg font-mono font-bold text-rose-300">Containment phase</span>
              </div>

              {/* Glowing Node */}
              <div className="z-10 w-16 h-16 rounded-full bg-slate-950 border-4 border-rose-500 flex items-center justify-center text-rose-400 font-mono font-black text-base shadow-[0_0_25px_rgba(244,63,94,0.6)] md:absolute md:left-1/3 md:-translate-x-1/2">
                00m
              </div>

              <div className="md:w-3/5 w-full bg-slate-950/90 border-2 border-white/20 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-rose-950/80 to-slate-900 border-2 border-rose-500/60 gap-4">
                  <div>
                    <span className="text-xs sm:text-sm font-mono font-black uppercase text-rose-300 tracking-wider block mb-1">NATIONAL HELPLINE</span>
                    <span className="text-4xl sm:text-5xl font-black font-mono text-white">1930</span>
                  </div>
                  <a href="tel:1930" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono font-black text-base uppercase flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-all">
                    <PhoneCall size={20} /> DIAL 1930
                  </a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-white/[0.05] border border-white/15">
                    <span className="text-xs font-mono font-black uppercase text-slate-300 tracking-wider block mb-1">EMERGENCY RESCUE</span>
                    <span className="text-2xl sm:text-3xl font-black font-mono text-white">112</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/[0.05] border border-white/15">
                    <span className="text-xs font-mono font-black uppercase text-slate-300 tracking-wider block mb-1">FINANCIAL FRAUD</span>
                    <span className="text-2xl sm:text-3xl font-black font-mono text-white">14448</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: 05m Financial Lockdown */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-20 relative">
              <div className="md:w-1/3 md:pr-12 text-left md:text-right order-1">
                <h3 className="text-3xl font-black font-heading text-white mb-1">Financial Lockdown</h3>
                <span className="text-base sm:text-lg font-mono font-bold text-purple-300">Stop unauthorized outflows</span>
              </div>

              {/* Glowing Node */}
              <div className="z-10 w-16 h-16 rounded-full bg-slate-950 border-4 border-purple-500 flex items-center justify-center text-purple-400 font-mono font-black text-base shadow-[0_0_25px_rgba(168,85,247,0.6)] md:absolute md:left-1/3 md:-translate-x-1/2 order-2">
                05m
              </div>

              <div className="md:w-3/5 w-full bg-slate-950/90 border-2 border-white/20 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 order-3">
                <span className="text-sm font-mono font-black uppercase tracking-wider text-purple-300 block mb-3">BANK EMERGENCY HOTLINES</span>
                {BANK_FREEZE_NUMBERS.slice(0, 4).map((b, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-white/10 last:border-0 font-mono gap-2">
                    <div>
                      <span className="text-lg sm:text-xl font-bold text-white block">{b.bank}</span>
                      <span className="text-sm text-slate-200">{b.sms}</span>
                    </div>
                    <span className="text-xl sm:text-2xl font-black text-purple-300">{b.num}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3: 15m Evidence & Dispute */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative">
              <div className="md:w-1/3 md:pr-12 text-left md:text-right">
                <h3 className="text-3xl font-black font-heading text-white mb-1">Formal Dispute</h3>
                <span className="text-base sm:text-lg font-mono font-bold text-cyan-300">Government portal filing</span>
              </div>

              {/* Glowing Node */}
              <div className="z-10 w-16 h-16 rounded-full bg-slate-950 border-4 border-cyan-400 flex items-center justify-center text-cyan-300 font-mono font-black text-base shadow-[0_0_25px_rgba(34,211,238,0.6)] md:absolute md:left-1/3 md:-translate-x-1/2">
                15m
              </div>

              <div className="md:w-3/5 w-full bg-slate-950/90 border-2 border-white/20 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                <p className="text-base sm:text-lg text-slate-100 leading-relaxed font-sans font-medium">
                  File an official dispute on the National Cyber Crime portal attaching exact UTR transaction reference numbers.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="px-6 py-4 rounded-xl bg-cyan-400 text-slate-950 font-mono font-black text-sm uppercase flex items-center gap-2 shadow-lg hover:bg-cyan-300 hover:scale-105 transition-all">
                    Visit cybercrime.gov.in <ExternalLink size={16} />
                  </a>
                  <a href="https://sancharsaathi.gov.in" target="_blank" rel="noreferrer" className="px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 font-mono font-black text-sm uppercase flex items-center gap-2 transition-all">
                    Chakshu Portal <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB CONTENT 2: EMERGENCY HELPLINES (Reference Screenshot 2 clean horizontal rows!) */}
      {activeTab === "helplines" && (
        <div className="bg-slate-950/90 border-2 border-white/20 rounded-3xl p-6 sm:p-10 divide-y divide-white/15 animate-fade-in shadow-2xl">
          <div className="pb-6 mb-2">
            <h2 className="text-4xl font-black font-heading text-white mb-3">National Emergency Helplines</h2>
            <p className="text-slate-100 text-lg font-normal">Direct, 1-tap call buttons with high-contrast typography for easy elder scanning. Tap any number to call immediately.</p>
          </div>

          {NATIONAL_HELPLINES.map((h, idx) => (
            <div key={idx} className="py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group hover:bg-white/[0.04] transition-colors rounded-2xl px-4 -mx-4">
              <div className="space-y-2 max-w-3xl">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-3xl sm:text-4xl font-black font-mono text-rose-400 bg-rose-500/10 px-4 py-1.5 rounded-xl border border-rose-500/30">{h.num}</span>
                  <h3 className="text-xl sm:text-2xl font-black font-heading text-white">{h.name}</h3>
                </div>
                <p className="text-slate-200 text-base sm:text-lg leading-relaxed font-normal pt-1">{h.desc}</p>
              </div>

              <a 
                href={`tel:${h.num.split(' ')[0]}`}
                className="px-10 py-5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-mono font-black text-base tracking-wider uppercase transition-all flex items-center justify-center gap-3 shrink-0 shadow-lg hover:scale-105"
              >
                <span>CALL NOW</span> <PhoneCall size={20} />
              </a>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT 3: BANK FREEZE DIRECTORY (Clean horizontal rows with Copy SMS!) */}
      {activeTab === "banks" && (
        <div className="bg-slate-950/90 border-2 border-white/20 rounded-3xl p-6 sm:p-10 divide-y divide-white/15 animate-fade-in shadow-2xl">
          <div className="pb-6 mb-2">
            <h2 className="text-4xl font-black font-heading text-white mb-3">Bank Emergency Freeze Directory</h2>
            <p className="text-slate-100 text-lg font-normal">Call your bank hotline or copy the exact SMS format to freeze debit cards instantly.</p>
          </div>

          {BANK_FREEZE_NUMBERS.map((b, idx) => (
            <div key={idx} className="py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:bg-white/[0.04] transition-colors rounded-2xl px-4 -mx-4">
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-black font-heading text-white">{b.bank}</h3>
                <span className="text-base sm:text-lg font-mono text-slate-100 block">SMS Lock Format: <b className="text-purple-300 font-black bg-purple-500/20 px-3 py-1 rounded-lg ml-1 border border-purple-500/30">{b.sms}</b></span>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <span className="text-3xl sm:text-4xl font-black font-mono text-purple-400">{b.num}</span>
                <button
                  onClick={() => handleCopySms(b.sms, idx)}
                  className="px-6 py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono font-black text-sm uppercase flex items-center gap-2 cursor-pointer transition-all shadow-lg hover:scale-105"
                >
                  {copiedSms === idx ? <Check size={18} className="text-emerald-300" /> : <Copy size={18} />}
                  <span>{copiedSms === idx ? "Copied SMS" : "Copy SMS"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT 4: SCAM ACTION GUIDES (Reference Screenshot 1 Executive Triage Design!) */}
      {activeTab === "guides" && (() => {
        const selectedSc = SCENARIO_GUIDES.find(sc => sc.id === expandedScenario) || SCENARIO_GUIDES[0];
        return (
          <div className="space-y-8 animate-fade-in">
            {/* Header matching Screenshot 1 */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/20">
              <div>
                <span className="text-sm font-mono font-black tracking-[0.25em] uppercase text-rose-400 block mb-2 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span> PRIORITY 0: ACTIVE THREAT MITIGATION
                </span>
                <h2 className="text-4xl sm:text-6xl font-black font-heading text-white tracking-tight">
                  Emergency <span className="text-rose-500">Triage</span>
                </h2>
              </div>
              <div className="text-left md:text-right font-mono">
                <span className="text-sm font-black text-slate-200 block uppercase tracking-wider">STATION 01 // DIGITAL RESPONSE UNIT</span>
                <span className="text-sm text-slate-300 font-medium">Identify your scenario to initiate protocol.</span>
              </div>
            </div>

            {/* Horizontal Selector Bar matching Screenshot 1 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {SCENARIO_GUIDES.map((sc) => {
                const isSelected = selectedSc.id === sc.id;
                return (
                  <button
                    key={sc.id}
                    onClick={() => setExpandedScenario(sc.id)}
                    className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group relative overflow-hidden ${
                      isSelected
                        ? "bg-gradient-to-b from-rose-950/80 to-slate-950 border-rose-500 shadow-[0_0_35px_rgba(244,63,94,0.4)] scale-105"
                        : "bg-slate-950/90 border-white/20 hover:border-white/40 hover:bg-white/[0.05]"
                    }`}
                  >
                    <span className={`px-5 py-2 rounded-xl text-sm sm:text-base font-mono font-black uppercase tracking-widest border transition-colors ${
                      isSelected ? "bg-rose-500 text-white border-rose-400" : "bg-white/10 text-slate-100 border-white/20 group-hover:border-white/40 group-hover:text-white"
                    }`}>
                      {sc.code}
                    </span>
                    <span className={`text-xs sm:text-sm font-mono font-black tracking-wider text-center uppercase ${
                      isSelected ? "text-rose-300" : "text-slate-200 group-hover:text-white"
                    }`}>
                      {sc.shortTitle}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Massive Dossier Screen matching Screenshot 1 */}
            <div className="p-6 sm:p-10 md:p-12 rounded-[2.5rem] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-rose-500/80 shadow-[0_0_70px_rgba(244,63,94,0.25)] relative overflow-hidden space-y-8">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-500 via-purple-500 to-cyan-400"></div>

              {/* Dossier Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-3">
                  <span className="bg-rose-500/30 text-rose-300 border border-rose-500/60 text-xs font-mono font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                    HIGH SEVERITY
                  </span>
                  <span className="text-sm font-mono font-bold text-slate-300 tracking-wider">
                    PROTOCOL ID: <b className="text-white font-black">{selectedSc.protocolId}</b>
                  </span>
                </div>
              </div>

              {/* Dossier Title */}
              <h3 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight">
                {selectedSc.title}
              </h3>

              {/* Threat Profile Interior Box */}
              <div className="p-6 sm:p-8 rounded-2xl bg-slate-950 border-2 border-white/20 flex items-start gap-4 shadow-inner max-w-4xl">
                <ShieldAlert className="text-rose-500 shrink-0 mt-1" size={28} />
                <p className="text-slate-100 text-base sm:text-lg leading-relaxed font-normal">
                  <strong className="text-rose-400 font-mono font-bold tracking-wide uppercase mr-2">Threat Profile:</strong>
                  {selectedSc.subtitle}
                </p>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 pt-4">
                <span className="text-sm font-mono font-black tracking-[0.25em] uppercase text-cyan-300 shrink-0">
                  IMMEDIATE ACTION SEQUENCE
                </span>
                <div className="h-px bg-gradient-to-r from-cyan-400/60 to-transparent w-full"></div>
              </div>

              {/* 4-Column Action Grid matching Screenshot 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
                {selectedSc.steps.map((step, idx) => (
                  <div key={idx} className="p-6 sm:p-8 rounded-2xl bg-white/[0.04] border-2 border-white/15 hover:border-white/30 transition-all flex flex-col justify-between gap-4 group shadow-lg">
                    <div className="space-y-3">
                      <span className="text-5xl font-black font-mono text-rose-500 tracking-tighter block group-hover:scale-105 transition-transform">
                        {step.num}
                      </span>
                      <h4 className="text-lg font-black font-heading text-white tracking-wide uppercase">
                        {step.title}
                      </h4>
                    </div>
                    <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-medium pt-3 border-t border-white/10">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
