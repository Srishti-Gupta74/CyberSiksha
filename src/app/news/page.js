import { Newspaper, Calendar, ShieldAlert, ShieldCheck } from 'lucide-react';
import newsData from '@/data/news.json';
import Link from 'next/link';

export default function NewsPage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Newspaper className="text-cyan" /> 
          Latest Scam Alerts
        </h1>
        <p className="text-slate-300">Stay updated on the newest fraud trends happening across India.</p>
      </div>

      <div className="space-y-6">
        {newsData.map((article) => (
          <div key={article.id} className="glass-card p-6 md:p-8 hover:border-cyan/30 transition-colors">
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
              <Calendar size={14} />
              <span>{new Date(article.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="mx-2">•</span>
              <span className="text-cyan">{article.source}</span>
            </div>
            
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">{article.title}</h2>
            <p className="text-slate-200 text-lg mb-6 leading-relaxed bg-navy/50 p-4 rounded-xl border border-white/5">
              {article.summary}
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="font-bold flex items-center gap-2 text-warning mb-2">
                  <ShieldAlert size={18} /> How it Works
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">{article.howItWorks}</p>
              </div>
              <div>
                <h3 className="font-bold flex items-center gap-2 text-success mb-2">
                  <ShieldCheck size={18} /> How to Stay Safe
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">{article.howToStaySafe}</p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/10 flex justify-end">
               <Link href="/quiz">
                 <button className="text-sm font-bold text-cyan hover:glow-text flex items-center gap-2">
                   Test Your Knowledge →
                 </button>
               </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
