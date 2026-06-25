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

  const renderNewsDeck = (deckKey, title, subtitle, articles, accentColor, badgeIcon) => {
    const isOpen = activeNewsDeck === deckKey;

    return (
      <div 
        onMouseEnter={() => setActiveNewsDeck(deckKey)}
        onMouseLeave={() => setActiveNewsDeck(null)}
        className={`glass-card p-6 md:p-8 transition-all duration-500 relative overflow-hidden select-none mb-8 ${
          isOpen 
            ? `border-${accentColor}-400 bg-slate-900/95 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(139,92,246,0.3)]` 
            : 'border-purple-500/20 hover:border-purple-500/40 bg-slate-900/60'
        }`}
      >
        {/* Closed Deck Header (Always visible) */}
        <div className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-${accentColor}-500/20 border border-${accentColor}-500/40 text-${accentColor}-400 flex items-center justify-center font-black text-3xl shadow-lg animate-pulse`}>
              {badgeIcon}
            </div>
            <div>
              <span className={`text-[10px] font-black uppercase tracking-widest text-${accentColor}-400 px-3 py-1 rounded-full bg-${accentColor}-500/10 border border-${accentColor}-500/20`}>
                {subtitle} Dossier Deck
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white mt-1.5">{title}</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 hidden sm:inline">{articles.length} Classified Dispatches</span>
            <div className={`w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-slate-300 transition-transform duration-500 ${isOpen ? 'rotate-180 bg-cyan-400 text-navy font-black' : ''}`}>
              <ChevronDown size={20} />
            </div>
          </div>
        </div>

        {/* Closed Hint Preview */}
        {!isOpen && (
          <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs font-bold text-slate-400">
            <span className="flex items-center gap-2">📰 Hover cursor here to cascade open live news dispatches</span>
            <ArrowUpRight size={16} className="text-cyan-400 animate-bounce" />
          </div>
        )}

        {/* Cascaded Articles Container (Deals out downwards on hover) */}
        <div className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${isOpen ? 'max-h-[1500px] opacity-100 mt-8 space-y-6' : 'max-h-0 opacity-0 mt-0'}`}>
          {articles.map((article, idx) => (
            <div 
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedArticle(article);
              }}
              className="p-6 rounded-2xl bg-slate-800/80 hover:bg-gradient-to-r hover:from-purple-900/50 hover:to-slate-800 border border-white/10 hover:border-cyan-400 transition-all duration-300 cursor-pointer group/card flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg hover:translate-x-2"
            >
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="bg-white/10 border border-white/15 px-3 py-1 rounded-lg text-xs font-bold text-cyan-300">
                    {article.source}
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                    <Calendar size={13} className="text-purple-400" /> {article.date}
                  </span>
                </div>

                <h3 className="text-xl font-black font-['Outfit'] text-white group-hover/card:text-cyan-300 transition-colors mb-2 leading-snug">
                  {article.title}
                </h3>
                
                <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 leading-relaxed font-normal">
                  {article.summary}
                </p>
              </div>

              <div className="flex md:flex-col items-center justify-end shrink-0 gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-white/10">
                <div className="w-10 h-10 rounded-xl bg-white/5 group-hover/card:bg-cyan-400 group-hover/card:text-navy text-slate-400 flex items-center justify-center font-black transition-all shadow-md">
                  ➔
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Read Intelligence</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto pb-44 pt-4 px-4 sm:px-6 animate-fade-in">
      
      {/* Hero Banner */}
      <ScrollReveal>
        <div className="glass-card p-8 md:p-12 mb-12 relative overflow-hidden bg-gradient-to-r from-purple-900/40 via-slate-900 to-slate-900 flex flex-col md:flex-row items-center justify-between gap-8 border-purple-500/30 shadow-2xl">
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/40 px-4 py-1.5 rounded-full text-xs font-black text-cyan-300 tracking-widest uppercase mb-6 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
              <Sparkles size={16} className="text-cyan-400 animate-spin" /> Live Intelligence Dossier Decks
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-black font-['Outfit'] mb-4 leading-[1.08] text-white">
              National Threat <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500">
                News Dispatches
              </span>
            </h1>
            
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
              Glide your mouse over the classified news decks below. Watch India's latest digital scam dispatches cascade open without needing a click!
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* 3 Interactive News Dispatches Decks */}
      <div>
        {renderNewsDeck("finance", "Financial & Banking Frauds", "High Priority", financialNews, "cyan", "💸")}
        {renderNewsDeck("ai", "AI Deepfakes & Social Impersonation", "Emerging Vector", aiSocialNews, "purple", "🤖")}
        {renderNewsDeck("biometric", "Aadhaar Biometric & Identity Theft", "Critical Advisory", biometricNews, "rose", "🔒")}
      </div>

      {/* Detailed Reading Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl animate-fade-in">
          <div className="glass-card max-w-3xl w-full p-6 sm:p-10 relative overflow-hidden bg-slate-950 border-cyan-400 shadow-[0_0_80px_rgba(34,211,238,0.3)] max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="bg-purple-600/30 border border-purple-500/40 text-cyan-300 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                  {selectedArticle.source} • {selectedArticle.date}
                </span>
              </div>
              <button 
                onClick={() => setSelectedArticle(null)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold transition-colors text-lg"
              >
                ✕
              </button>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black font-['Outfit'] text-white mb-6 leading-tight">
              {selectedArticle.title}
            </h2>

            <div className="space-y-6 text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 font-medium text-white italic">
                "{selectedArticle.summary}"
              </div>

              <p>{selectedArticle.details || selectedArticle.summary}</p>

              {selectedArticle.protection && (
                <div className="mt-8 p-6 rounded-2xl bg-cyan-950/40 border border-cyan-500/30">
                  <h3 className="text-lg font-black font-['Outfit'] text-cyan-300 uppercase tracking-wider flex items-center gap-2 mb-4">
                    🛡️ Official Defense Protocol
                  </h3>
                  <ul className="space-y-3">
                    {selectedArticle.protection.map((prot, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-slate-200">
                        <span className="text-cyan-400 shrink-0 mt-0.5">✔</span>
                        <span>{prot}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
              <button 
                onClick={() => setSelectedArticle(null)}
                className="btn-primary py-4 px-10 text-sm cursor-pointer"
              >
                <span>Acknowledge & Close Dossier ➔</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
