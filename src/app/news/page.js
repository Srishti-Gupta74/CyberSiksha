"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NEWS_ARTICLES } from '@/data/content';
import ScrollReveal from '@/components/ScrollReveal';
import { Newspaper, ArrowRight, Calendar, ShieldAlert, Sparkles, ChevronDown, ArrowUpRight, Share2, Bookmark, Zap, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import IndiaHeatmap from '@/components/IndiaHeatmap';
import ThreatAnalytics from '@/components/ThreatAnalytics';

export default function NewsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("feed"); // "feed" | "map" | "analytics"
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [mounted, setMounted] = useState(false);
  
  const [liveThreats, setLiveThreats] = useState([]);
  const [intelSource, setIntelSource] = useState("Synchronizing Threat Feed...");

  useEffect(() => {
    setMounted(true);
    async function fetchLiveFeed() {
      try {
        const res = await fetch('/api/threats');
        const data = await res.json();
        if (data && data.threats) {
          setLiveThreats(data.threats);
          setIntelSource(data.source || "CERT-In Government Intelligence Feed");
        }
      } catch(e) {}
    }
    fetchLiveFeed();
  }, []);

  const financialNews = NEWS_ARTICLES.filter(a => [3, 5, 6, 7, 8].includes(a.id) || a.title?.toLowerCase().includes('upi') || a.title?.toLowerCase().includes('loan'));
  const aiSocialNews = NEWS_ARTICLES.filter(a => [1, 2, 4, 9].includes(a.id) || a.title?.toLowerCase().includes('ai') || a.title?.toLowerCase().includes('arrest'));
  const biometricNews = NEWS_ARTICLES.filter(a => [8, 1].includes(a.id) || a.details?.toLowerCase().includes('aadhaar') || a.details?.toLowerCase().includes('biometric'));

  const renderNewsShowcase = (id, title, subtitle, list, colorTheme, emojiIcon) => (
    <section key={id} className="mb-24 scroll-mt-24">
      <div className="flex items-center gap-4 mb-10 pb-4 border-b border-white/10">
        <span className="text-4xl filter drop-shadow">{emojiIcon}</span>
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold block">{subtitle}</span>
          <h2 className="text-2xl sm:text-4xl font-black font-heading text-white">{title}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12 pt-2">
        {list.map((article, i) => {
          // Alternating realistic rotations and tape positions for organic clipping feel
          const rotations = ["-rotate-2 hover:rotate-0", "rotate-2 hover:rotate-0", "-rotate-1 hover:rotate-0", "rotate-1 hover:rotate-0", "rotate-0 hover:-rotate-1"];
          const tiltClass = rotations[i % rotations.length];

          return (
            <div 
              key={i} 
              onClick={() => setSelectedArticle(article)}
              className={`bg-[#f4f1ea] text-[#1a1b18] p-6 sm:p-7 flex flex-col justify-between group cursor-pointer border border-[#d8d6cc] shadow-[8px_10px_25px_rgba(0,0,0,0.7)] transition-all duration-300 relative overflow-hidden ${tiltClass} hover:scale-[1.03] hover:shadow-[12px_15px_35px_rgba(34,211,238,0.3)] hover:z-20`}
              style={{
                clipPath: "polygon(0% 0%, 100% 0%, 99% 98%, 95% 100%, 88% 98%, 80% 100%, 72% 98%, 65% 100%, 55% 98%, 45% 100%, 35% 98%, 25% 100%, 15% 98%, 8% 100%, 0% 98%)"
              }}
            >
              {/* Simulated Translucent Tape Piece on Top */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-amber-100/60 border border-amber-200/50 rotate-1 shadow-sm pointer-events-none backdrop-blur-[1px]"></div>

              <div className="space-y-4 pt-2">
                {/* Authentic Newspaper Dateline */}
                <div className="flex items-center justify-between text-[11px] text-[#555] font-mono border-b border-[#1a1b18]/20 pb-2 uppercase tracking-wider font-bold">
                  <span>CLIPPING #{article.id || (i+1)}</span>
                  <span>{article.date || "RECENT"}</span>
                  <span>{article.source || "FORENSIC DESK"}</span>
                </div>

                {/* Headline */}
                <h3 className="text-xl sm:text-2xl font-black font-serif text-[#1a1b18] group-hover:text-blue-900 transition-colors leading-tight line-clamp-3">
                  {article.title}
                </h3>

                {/* Ink Snippet */}
                <p className="text-[#3a3b35] text-xs sm:text-sm line-clamp-4 leading-relaxed font-serif italic">
                  &ldquo;{article.summary}&rdquo;
                </p>
              </div>

              {/* Action Callout */}
              <div className="pt-5 mt-6 border-t border-[#1a1b18]/20 flex items-center justify-between text-xs font-mono font-bold text-[#1a1b18] group-hover:text-blue-800 transition-colors">
                <span className="flex items-center gap-1.5">✂️ Click cut piece to expand</span>
                <span className="underline decoration-2 underline-offset-4 group-hover:translate-x-1 transition-transform">Read Report ➔</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );

  return (
    <div className="max-w-7xl mx-auto pb-44 pt-6 px-4 sm:px-6 select-none animate-fade-in">
      
      <ScrollReveal>
        <div className="glass-card p-8 sm:p-14 mb-16 relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-cyan-400/30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-500/40 px-4 py-1.5 rounded-full text-xs font-black text-cyan-300 tracking-widest uppercase mb-6 shadow-[0_0_20px_rgba(34,211,238,0.3)] font-mono">
              <Newspaper size={16} className="text-cyan-400 animate-pulse" /> National Threat Intelligence Feed
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-['Outfit'] mb-6 leading-[1.06] text-white">
              Real-Time Cyber <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500">
                News Chronicles
              </span>
            </h1>
            
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal max-w-2xl">
              Survey verified digital scam dispatches across India. Organized into clean, spacious showcase dossiers with zero abrupt jumping.
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* Tab Toggle Toolbar (High contrast & large fonts for elders) */}
      <div className="flex justify-center mb-16">
        <div className="bg-slate-900/90 p-3 rounded-3xl border-2 border-white/20 flex flex-wrap justify-center gap-3 font-mono text-sm sm:text-base uppercase tracking-wider shadow-2xl">
          <button 
            onClick={() => setActiveTab("feed")}
            className={`px-6 py-4 rounded-2xl transition-all cursor-pointer flex items-center gap-3 font-bold ${activeTab === "feed" ? "bg-cyan-400 text-slate-950 font-black shadow-[0_0_20px_rgba(34,211,238,0.5)] scale-105" : "bg-white/5 border border-white/10 text-slate-100 hover:bg-white/10 hover:text-white"}`}
          >
            <Newspaper size={20} /> <span>Chronicles Feed</span>
          </button>
          <button 
            onClick={() => setActiveTab("map")}
            className={`px-6 py-4 rounded-2xl transition-all cursor-pointer flex items-center gap-3 font-bold ${activeTab === "map" ? "bg-rose-500 text-white font-black shadow-[0_0_20px_rgba(244,63,94,0.5)] scale-105" : "bg-white/5 border border-white/10 text-slate-100 hover:bg-white/10 hover:text-white"}`}
          >
            <MapPin size={20} /> <span>Geographic Heat Map</span>
          </button>
          <button 
            onClick={() => setActiveTab("analytics")}
            className={`px-6 py-4 rounded-2xl transition-all cursor-pointer flex items-center gap-3 font-bold ${activeTab === "analytics" ? "bg-purple-600 text-white font-black shadow-[0_0_20px_rgba(147,51,234,0.5)] scale-105" : "bg-white/5 border border-white/10 text-slate-100 hover:bg-white/10 hover:text-white"}`}
          >
            <span>📊 National Threat Analytics</span>
          </button>
        </div>
      </div>

      {/* Conditional Content */}
      {activeTab === "feed" ? (
        <div className="pt-4">
          {liveThreats.length > 0 && renderNewsShowcase("live", "🔴 Live Indian Threat Feed", intelSource, liveThreats, "rose", "🚨")}
          {renderNewsShowcase("finance", "Financial & Banking Frauds", "High Priority", financialNews, "cyan", "💸")}
          {renderNewsShowcase("ai", "AI Deepfakes & Social Impersonation", "Emerging Vector", aiSocialNews, "purple", "🤖")}
          {renderNewsShowcase("biometric", "Aadhaar Biometric & Identity Theft", "Critical Advisory", biometricNews, "rose", "🔒")}
        </div>
      ) : activeTab === "map" ? (
        <div className="pt-4">
          <IndiaHeatmap />
        </div>
      ) : (
        <div className="pt-4">
          <ThreatAnalytics />
        </div>
      )}

      {/* Official Verified Data Attribution Badge */}
      <div className="mt-16 mb-12 bg-slate-900/80 border border-cyan-400/40 rounded-3xl p-6 sm:p-8 text-center space-y-3 font-mono shadow-xl max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/30 px-3.5 py-1 rounded-full text-xs font-bold text-cyan-300 uppercase tracking-wider">
          <ShieldAlert size={14} className="text-cyan-400" /> 🇮🇳 Verified Government & Financial Intelligence Sources
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
          All case studies, threat velocities, and financial fraud statistics displayed across CyberSiksha are compiled from legitimate, fact-checked public advisories released by the <b>Indian Cyber Crime Coordination Centre (I4C)</b>, <b>Ministry of Home Affairs (MHA)</b>, <b>Reserve Bank of India (RBI) Annual Master Circulars</b>, <b>CERT-In Bulletins</b>, and verified LEA charge sheets (2024–2026).
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-[11px] text-slate-400 pt-2 border-t border-white/5 font-bold">
          <span>Official Helpline: 1930</span> • <span>Portal: cybercrime.gov.in</span> • <span>RBI Anti-Fraud: 14440</span>
        </div>
      </div>

      {/* Detailed Editorial Chronicle Modal - True Viewport Portal Overlay */}
      {mounted && selectedArticle && createPortal(
        <div 
          onClick={() => setSelectedArticle(null)}
          className="fixed inset-0 z-[999999] overflow-y-auto bg-slate-950/85 backdrop-blur-2xl animate-fade-in select-none p-4 sm:p-6 md:p-10 flex"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#faf9f5] text-[#1a1b18] rounded-3xl max-w-4xl w-full p-6 sm:p-14 relative border border-[#d8d6cc] shadow-[0_35px_100px_rgba(0,0,0,0.95)] animate-scale-up m-auto"
          >
            {/* Authentic Newspaper Masthead Banner */}
            <div className="border-b-4 border-double border-[#1a1b18] pb-6 mb-8 text-center flex flex-col items-center">
              <div className="flex items-center justify-between w-full text-[11px] font-mono tracking-widest uppercase border-b border-[#1a1b18]/20 pb-2 mb-4">
                <span>VOL. CLXIV NO. 88</span>
                <span className="font-bold">{selectedArticle.source} • FORENSIC DESK</span>
                <span>PRICE: FREE</span>
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-serif tracking-tight uppercase leading-[1.08] mb-3 max-w-3xl">
                {selectedArticle.title}
              </h2>
              <div className="flex items-center gap-4 text-xs font-mono italic text-[#555]">
                <span>By CyberCIA Senior Correspondent</span>
                <span>•</span>
                <span>Dispatched: {selectedArticle.date}</span>
              </div>
            </div>

            {/* Article Body */}
            <div className="prose max-w-none font-serif text-base sm:text-lg leading-[1.8] text-[#2c2d28] space-y-6">
              {/* Lead Summary Paragraph with Drop Cap */}
              <p className="font-bold text-xl leading-relaxed text-[#1a1b18] first-letter:text-6xl first-letter:font-black first-letter:float-left first-letter:mr-3.5 first-letter:leading-none border-b border-[#1a1b18]/10 pb-6">
                {selectedArticle.summary}
              </p>
              
              {/* Full In-Depth Investigation Report */}
              {selectedArticle.details && (
                <div className="space-y-4 text-[#222] font-normal leading-relaxed pt-2">
                  <h4 className="font-mono text-xs uppercase tracking-widest font-bold text-[#666]">
                    [ FORENSIC DESK REPORT ]
                  </h4>
                  <p className="whitespace-pre-line text-lg">
                    {selectedArticle.details}
                  </p>
                </div>
              )}

              {/* Actionable Defense Protocol List */}
              {selectedArticle.protection && selectedArticle.protection.length > 0 && (
                <div className="p-6 sm:p-8 bg-[#f0ede1] border-2 border-[#1a1b18] my-8 rounded-2xl font-sans text-sm text-[#333] shadow-md">
                  <div className="flex items-center gap-2 font-mono text-xs font-black tracking-widest uppercase text-rose-700 mb-4 border-b border-[#1a1b18]/20 pb-2">
                    <ShieldAlert size={16} /> <span>CITIZEN SAFETY DEFENSE PROTOCOLS</span>
                  </div>
                  <ul className="space-y-2.5 m-0 pl-5 list-disc font-semibold text-[#1a1b18]">
                    {selectedArticle.protection.map((protocol, idx) => (
                      <li key={idx} className="leading-snug">
                        {protocol}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-5 bg-white/60 border border-[#1a1b18]/20 rounded-xl font-sans text-xs text-[#555] flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
                <span>🚨 Official Cyber Emergency Helpline: <b>1930</b></span>
                <span>Chakshu Portal: <b>sancharsaathi.gov.in</b></span>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-[#1a1b18]/20 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
              <button 
                onClick={() => {
                  alert("Article archived to your Personal Intelligence Library!");
                  setSelectedArticle(null);
                }}
                className="px-6 py-3 bg-[#1a1b18] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-[#333] transition-colors cursor-pointer"
              >
                <Bookmark size={15} /> <span>Archive Chronicle</span>
              </button>
              
              <button 
                onClick={() => setSelectedArticle(null)}
                className="px-6 py-3 border border-[#1a1b18]/30 rounded-xl font-bold hover:bg-[#1a1b18]/10 transition-colors cursor-pointer"
              >
                Close Dossier ✕
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
