"use client";

import { useState } from 'react';
import { NEWS_ARTICLES } from '@/data/content';
import ScrollReveal from '@/components/ScrollReveal';
import { Newspaper, ArrowRight, Calendar, ShieldAlert, Sparkles, ChevronDown, ArrowUpRight, Share2, Bookmark } from 'lucide-react';

export default function NewsPage() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  
  // Track which News Deck is actively being hovered/cascaded
  const [activeNewsDeck, setActiveNewsDeck] = useState(null);

  // Categorize News into Decks
  const financialNews = NEWS_ARTICLES.filter((_, idx) => idx === 0 || idx === 3);
  const aiSocialNews = NEWS_ARTICLES.filter((_, idx) => idx === 1 || idx === 4);
  const biometricNews = NEWS_ARTICLES.filter((_, idx) => idx === 2);

  // Permanent Editorial Grid Showcase (No abrupt hover jumping, clean spacious cards)
  const renderNewsShowcase = (categoryKey, title, subtitle, articles, accentColor, badgeIcon) => {
    return (
      <div className="mb-24">
        {/* Category Header Banner */}
        <ScrollReveal>
          <div className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-${accentColor}-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 mb-10 shadow-[0_20px_60px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] relative overflow-hidden`}>
            <div className={`absolute -top-24 -left-24 w-60 h-60 bg-${accentColor}-500/15 rounded-full blur-3xl pointer-events-none`}></div>
            <div className="flex items-center gap-5 relative z-10">
              <div className={`w-16 h-16 rounded-2xl bg-${accentColor}-500/20 border border-${accentColor}-500/40 text-${accentColor}-400 flex items-center justify-center font-black text-4xl shadow-lg shrink-0`}>
                {badgeIcon}
              </div>
              <div>
                <span className={`text-[10px] font-black uppercase tracking-widest text-${accentColor}-400 px-3 py-1 rounded-full bg-${accentColor}-500/10 border border-${accentColor}-500/20 font-mono`}>
                  {subtitle}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white mt-1.5">{title}</h2>
              </div>
            </div>
            <div className="relative z-10 bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-white/10 text-xs font-bold text-slate-300 shadow-inner flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full bg-${accentColor}-400 animate-pulse`}></span>
              <span>{articles.length} Dispatches</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Spacious Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((article, idx) => (
            <ScrollReveal key={idx} delay={(idx % 2) * 150}>
              <div 
                onClick={() => {
                  setSelectedArticle(article);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-8 sm:p-9 rounded-3xl bg-gradient-to-br from-slate-800/90 via-slate-900/95 to-slate-950 backdrop-blur-2xl border border-white/10 hover:border-cyan-400 transition-all duration-300 cursor-pointer group/card flex flex-col justify-between gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:shadow-[0_25px_60px_rgba(34,211,238,0.25),inset_0_1px_1px_rgba(255,255,255,0.35)] hover:-translate-y-2 relative z-10 hover:z-50 h-full"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <span className="bg-white/10 border border-white/15 px-3 py-1 rounded-lg text-xs font-bold text-cyan-300 font-mono">
                      {article.source}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-400 text-xs font-medium font-serif italic">
                      <Calendar size={13} className="text-purple-400 not-italic" /> {article.date}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white group-hover/card:text-cyan-300 transition-colors mb-3 leading-snug">
                    {article.title}
                  </h3>
                  
                  <p className="text-slate-300 text-xs sm:text-sm line-clamp-3 leading-relaxed font-normal opacity-80 group-hover/card:opacity-100 transition-opacity">
                    {article.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t pt-5 border-white/10 mt-2">
                  <span className="text-[11px] font-black uppercase tracking-widest text-cyan-400 group-hover/card:underline flex items-center gap-1.5">
                    <span>Read Chronicle</span>
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white/5 group-hover/card:bg-cyan-400 group-hover/card:text-navy text-slate-400 flex items-center justify-center font-black transition-all shadow-md group-hover/card:rotate-45">
                    ➔
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto pb-44 pt-4 px-4 sm:px-6 animate-fade-in">
      
      {/* Hero Banner */}
      <ScrollReveal>
        <div className="glass-card p-8 md:p-14 mb-14 relative overflow-hidden bg-gradient-to-r from-purple-900/40 via-slate-900 to-slate-900 flex flex-col md:flex-row items-center justify-between gap-8 border-purple-500/30 shadow-2xl">
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 text-center md:text-left max-w-3xl">
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

      {/* Spacious On-Scroll Showcase Sections */}
      <div className="pt-4">
        {renderNewsShowcase("finance", "Financial & Banking Frauds", "High Priority", financialNews, "cyan", "💸")}
        {renderNewsShowcase("ai", "AI Deepfakes & Social Impersonation", "Emerging Vector", aiSocialNews, "purple", "🤖")}
        {renderNewsShowcase("biometric", "Aadhaar Biometric & Identity Theft", "Critical Advisory", biometricNews, "rose", "🔒")}
      </div>

      {/* Detailed Editorial Chronicle Modal - Ultra Luxury Online Newspaper with Calligraphy Drop Cap */}
      {selectedArticle && (
        <div 
          onClick={() => setSelectedArticle(null)}
          className="fixed inset-0 z-[200] flex items-start justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-2xl animate-fade-in select-none overflow-y-auto pt-6 sm:pt-12 pb-20"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#faf9f5] text-[#1a1b18] rounded-3xl max-w-4xl w-full p-6 sm:p-14 relative overflow-hidden border border-[#d8d6cc] shadow-[0_45px_120px_rgba(0,0,0,0.95)] mt-4 sm:mt-8 mb-16 animate-scale-up"
          >
            {/* Authentic Newspaper Masthead Banner */}
            <div className="text-center border-b-[3px] border-slate-900 pb-4 mb-8 font-serif">
              <p className="text-[10px] sm:text-xs font-mono tracking-[0.35em] uppercase text-slate-500 mb-1 font-bold">National Cyber Intelligence Chronicle</p>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-950 font-serif uppercase">THE CYBER SENTINEL</h1>
              <div className="flex items-center justify-between border-t border-b border-slate-400 mt-3 py-1.5 px-2 text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-700">
                <span>VOL. CXLIV NO. 48,012</span>
                <span className="font-bold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded">★ EXCLUSIVE REPORT ★</span>
                <span>NEW DELHI • EDITION</span>
              </div>
            </div>
            
            {/* Elegant Dispatch Header */}
            <div className="border-b-2 border-slate-300 pb-4 mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="bg-slate-950 text-amber-300 font-mono text-[10px] sm:text-xs font-black tracking-[0.2em] px-3.5 py-1 rounded uppercase shadow-sm">
                  ★ CLASSIFIED DISPATCH
                </span>
                <span className="font-serif italic text-slate-600 font-bold text-xs sm:text-sm">
                  {selectedArticle.source} • {selectedArticle.date}
                </span>
              </div>
              <button 
                onClick={() => setSelectedArticle(null)}
                className="w-11 h-11 rounded-full bg-[#ebeee3] hover:bg-rose-600 hover:text-white text-slate-800 flex items-center justify-center font-bold transition-all text-lg cursor-pointer shadow-sm shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Calligraphy Editorial Headline */}
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-serif italic text-[#181223] mb-8 leading-[1.08] tracking-tight">
              {selectedArticle.title}
            </h2>

            {/* Editorial Body with Calligraphy Pull Quote and Luxury Drop Cap */}
            <div className="space-y-8 text-slate-800 text-base sm:text-xl leading-[1.85] font-normal font-serif">
              
              {/* Calligraphy Pull Quote Box */}
              <div className="p-8 sm:p-10 rounded-2xl bg-[#f0ede6] border-l-4 border-[#6d28d9] font-serif text-[#311062] text-xl sm:text-2xl italic font-normal leading-relaxed shadow-inner relative">
                <span className="absolute top-2 left-4 text-6xl text-purple-900/15 font-serif font-black select-none pointer-events-none">“</span>
                <span className="relative z-10">{selectedArticle.summary}</span>
              </div>

              {/* Calligraphic Section Divider */}
              <div className="text-center text-purple-900/40 tracking-[0.5em] select-none py-2 text-xl">
                ✦ ❦ ✦
              </div>

              {/* Luxury Calligraphy Drop Cap Paragraph */}
              <p className="text-slate-800 leading-[1.9] font-serif text-lg sm:text-xl">
                <span className="float-left text-6xl sm:text-7xl font-serif italic font-black text-[#581c87] mr-3.5 pr-2 pt-1 pb-1 leading-none border-b-2 border-[#8b5cf6] shadow-xs select-none">
                  {(selectedArticle.details || selectedArticle.summary).charAt(0)}
                </span>
                {(selectedArticle.details || selectedArticle.summary).slice(1)}
              </p>

              {selectedArticle.protection && (
                <div className="mt-12 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-950 via-[#0d1322] to-slate-900 text-white shadow-2xl border border-amber-500/40 relative overflow-hidden font-sans">
                  <div className="absolute -right-10 -top-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
                  <h3 className="text-sm sm:text-base font-black font-mono text-amber-400 uppercase tracking-[0.2em] flex items-center gap-3 mb-6 border-b border-white/15 pb-4 z-10 relative">
                    <span>🛡️ OFFICIAL DEFENSE PROTOCOL</span>
                  </h3>
                  <ul className="space-y-4 relative z-10">
                    {selectedArticle.protection.map((prot, i) => (
                      <li key={i} className="flex items-start gap-4 text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
                        <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold shadow-sm">✔</span>
                        <span>{prot}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* High-End Archival Footer CTA */}
            <div className="mt-12 pt-8 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 uppercase font-bold tracking-wider">
                <span>⚡ SECURE HOME NETWORK ARCHIVE</span>
              </div>
              <button 
                onClick={() => setSelectedArticle(null)}
                className="w-full sm:w-auto py-4 px-10 bg-slate-950 hover:bg-amber-500 hover:text-slate-950 text-white rounded-2xl font-mono font-black text-xs uppercase tracking-[0.15em] shadow-xl transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>ACKNOWLEDGE & ARCHIVE DOSSIER ➔</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
