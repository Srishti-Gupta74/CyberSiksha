"use client";

import { useRef, useState } from 'react';
import { Download, Share2, ShieldCheck, Sparkles, Check, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ShowcaseModal({ isOpen, onClose, userName = "Family Defender", xp = 500, badge = "Banking Shield Level 3" }) {
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPng = async () => {
    if (!cardRef.current || downloading) return;
    setDownloading(true);

    try {
      // Dynamic import to prevent SSR Next.js window crash
      const html2canvas = (await import('html2canvas')).default;
      
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#020617', // slate-950
        useCORS: true,
        logging: false
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `CyberSiksha_Confluence2_Defender_${userName.replace(/\s+/g, '_')}.png`;
      link.click();

      setDownloading(false);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
    } catch (err) {
      console.error('Export error:', err);
      setDownloading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl animate-fade-in select-none">
      <div className="glass-card max-w-lg w-full p-6 sm:p-10 relative bg-slate-950 border border-cyan-400 shadow-[0_0_90px_rgba(34,211,238,0.4)] rounded-3xl animate-scale-up m-auto flex flex-col items-center">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 hover:bg-rose-500 hover:text-white text-slate-400 flex items-center justify-center font-bold text-base transition-all cursor-pointer"
        >
          ✕
        </button>

        <h3 className="text-xl font-black font-['Outfit'] text-white mb-6 flex items-center gap-2">
          <Sparkles className="text-cyan-400" /> Shareable Social Showcase Card
        </h3>

        {/* Visible DOM Card Ref for html2canvas (1080x1920 Aspect Ratio Container) */}
        <div 
          ref={cardRef}
          className="w-full max-w-[320px] aspect-[9/16] p-8 rounded-3xl bg-gradient-to-b from-indigo-950 via-slate-950 to-slate-900 border-2 border-purple-500/60 shadow-2xl flex flex-col justify-between items-center text-center relative overflow-hidden my-4"
        >
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-pink-500/20 rounded-full blur-2xl pointer-events-none"></div>

          {/* Top Header */}
          <div className="relative z-10 w-full pt-2">
            <span className="text-[9px] font-mono font-black tracking-[0.3em] uppercase text-cyan-400 block mb-1">Confluence 2.0 Hackathon Finalist</span>
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 p-0.5 shadow-lg mb-3">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-3xl">
                🛡️
              </div>
            </div>
            <h4 className="text-xl font-black text-white font-['Outfit']">{userName}</h4>
            <span className="text-[10px] font-mono text-purple-300 font-bold uppercase tracking-widest block mt-0.5">Verified Citizen Defender</span>
          </div>

          {/* Center Stats */}
          <div className="relative z-10 bg-white/5 border border-white/10 p-5 rounded-2xl w-full my-4 space-y-3 backdrop-blur-md">
            <div>
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider font-bold block">Security Clearance XP</span>
              <span className="text-2xl font-black font-mono text-cyan-300">{xp} XP</span>
            </div>
            <div className="border-t border-white/10 pt-2">
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider font-bold block">Highest Defense Shield</span>
              <span className="text-xs font-black text-pink-400 uppercase font-mono tracking-wider block mt-0.5">{badge}</span>
            </div>
          </div>

          {/* Bottom Footer & Alliance Badges */}
          <div className="relative z-10 w-full pb-2 space-y-3">
            <div className="inline-flex items-center gap-2 bg-purple-900/40 border border-purple-500/30 px-3 py-1 rounded-xl text-[8px] font-mono text-slate-300 uppercase">
              <QrCode size={12} className="text-cyan-400" /> <span>Scan on cyber-siksha.vercel.app</span>
            </div>

            <div className="border-t border-white/10 pt-2 text-[7px] font-mono text-slate-500 uppercase tracking-widest leading-tight">
              Amplified by Next Techy Pixel Creator Studio <br />
              Aligned with CyberCIA Forge Resilience Framework
            </div>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex w-full gap-4 mt-6">
          <button 
            onClick={handleCopyLink}
            className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-black uppercase text-xs tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 font-mono"
          >
            {copied ? <Check size={16} className="text-emerald-400" /> : <Share2 size={16} />}
            <span>{copied ? "Link Copied" : "Copy App Link"}</span>
          </button>

          <button 
            onClick={handleDownloadPng}
            disabled={downloading}
            className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-slate-950 font-black uppercase text-xs tracking-wider transition-all cursor-pointer shadow-[0_0_25px_rgba(34,211,238,0.5)] disabled:opacity-50 flex items-center justify-center gap-2 font-mono"
          >
            <Download size={16} />
            <span>{downloading ? "Exporting..." : "Download 9:16 PNG"}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
