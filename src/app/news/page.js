"use client";

import { useState } from 'react';
import { NEWS_ARTICLES } from '@/data/content';
import { Newspaper, ExternalLink, Calendar, ShieldAlert, X } from 'lucide-react';

export default function NewsPage() {
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black font-['Outfit'] flex items-center gap-3 mb-2">
          <Newspaper className="text-violet" size={28} />
          Live Scam Alerts
        </h1>
        <p className="text-slate-400 text-sm">Stay informed about the latest cyber threats currently active across India.</p>
      </div>

      <div className="space-y-6">
        {NEWS_ARTICLES.map((article, index) => (
          <div 
            key={index} 
            className="glass-card p-6 md:p-8 border-violet/20 hover:border-violet/40 transition-colors group relative overflow-hidden"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet/5 rounded-full blur-3xl pointer-events-none group-hover:bg-violet/10 transition-colors"></div>
            
            <div className="flex flex-col md:flex-row gap-6 relative z-10">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="bg-violet/10 text-violet border border-violet/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {article.category || article.source}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    <Calendar size={12} /> {article.date}
                  </span>
                </div>
                
                <h2 className="text-xl md:text-2xl font-bold font-['Outfit'] mb-3 group-hover:text-violet transition-colors">
                  {article.title}
                </h2>
                
                <p className="text-slate-300 mb-6 leading-relaxed">
                  {article.summary}
                </p>
                
                {article.protection && (
                  <div className="bg-rose/5 border border-rose/10 p-4 rounded-xl flex items-start gap-3">
                    <ShieldAlert className="text-rose flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <span className="text-xs font-bold text-rose uppercase tracking-widest block mb-1">How to stay safe</span>
                      <span className="text-sm text-slate-300">{article.protection[0]}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <button 
              onClick={() => setSelectedArticle(article)}
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-cyan hover:text-white transition-colors"
            >
              Read Full Report <ExternalLink size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Modal for Full Report */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-navy/80 backdrop-blur-sm"
            onClick={() => setSelectedArticle(null)}
          ></div>
          <div className="glass-card w-full max-w-2xl max-h-[85vh] overflow-y-auto relative z-10 animate-fade-in border-violet/30 p-6 md:p-8 custom-scrollbar">
            <button 
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-2 mb-4 text-violet text-sm font-bold uppercase tracking-widest">
              <Newspaper size={16} />
              {selectedArticle.source}
            </div>

            <h2 className="text-2xl md:text-3xl font-black font-['Outfit'] mb-6 text-white leading-tight">
              {selectedArticle.title}
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-white/10 pb-2">Full Details</h3>
                <p className="text-slate-200 leading-relaxed text-[15px]">
                  {selectedArticle.details || selectedArticle.summary}
                </p>
              </div>

              {selectedArticle.protection && (
                <div className="bg-rose/10 border border-rose/20 p-5 rounded-xl">
                  <h3 className="flex items-center gap-2 text-rose font-bold mb-3 uppercase tracking-widest text-sm">
                    <ShieldAlert size={18} /> Protection Guidelines
                  </h3>
                  <ul className="space-y-3">
                    {selectedArticle.protection.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-rose mt-0.5">•</span>
                        <span className="text-slate-200 text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="mt-8 pt-4 border-t border-white/10 flex justify-end">
              <button 
                onClick={() => setSelectedArticle(null)}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition-all text-sm"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
