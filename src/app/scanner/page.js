"use client";

import { useState } from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import { Camera, Upload, ShieldAlert, CheckCircle2, Sparkles, RefreshCw, AlertTriangle, ArrowRight, ScanLine } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ScamScannerPage() {
  const [imagePreview, setImagePreview] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [scanning, setScanning] = useState(false);
  const [report, setReport] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target?.result);
    };
    reader.readAsDataURL(file);
  };

  const handleExecuteScan = async (e) => {
    e.preventDefault();
    if (!imagePreview && !textInput.trim()) return;
    setScanning(true);
    setReport(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imagePreview,
          textSnippet: textInput
        })
      });
      const data = await res.json();
      setReport(data);
      setScanning(false);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    } catch {
      setScanning(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-44 pt-6 px-4 sm:px-6 animate-fade-in select-none">
      
      {/* Masthead */}
      <div className="glass-card p-8 md:p-14 mb-12 relative overflow-hidden bg-gradient-to-r from-cyan-950/40 via-slate-950 to-slate-900 border border-cyan-500/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-500/40 px-4 py-1.5 rounded-full text-xs font-mono font-black text-cyan-300 tracking-widest uppercase mb-6 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
            <Sparkles size={16} className="text-cyan-400 animate-pulse" /> Gemini Vision Multimodal AI Engine
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-['Outfit'] text-white mb-6 leading-tight">
            📷 Scam Screenshot <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500">
              Vision Analyzer
            </span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
            Upload a screenshot of any suspicious SMS, WhatsApp notice, or CBI arrest warrant. Our AI reconstructs the psychological manipulation vector and delivers instant relief checklists.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Upload Workbench */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-card p-6 sm:p-10 bg-slate-950 border-white/10 space-y-6">
            <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white flex items-center gap-3">
              <Upload className="text-cyan-400" /> Upload Suspicious Evidence
            </h2>

            <form onSubmit={handleExecuteScan} className="space-y-6">
              
              {/* Image Uploader Area */}
              <div className="relative border-2 border-dashed border-white/20 hover:border-cyan-400 rounded-3xl p-8 text-center transition-all bg-slate-900/50 group overflow-hidden min-h-[220px] flex flex-col items-center justify-center">
                {imagePreview ? (
                  <div className="relative w-full max-h-60 overflow-hidden rounded-2xl">
                    <img src={imagePreview} alt="Uploaded evidence" className="w-full object-contain max-h-60 rounded-2xl" />
                    {scanning && (
                      <div className="absolute inset-0 bg-cyan-500/20 backdrop-blur-xs flex items-center justify-center">
                        <div className="w-full h-1 bg-cyan-400 absolute top-1/2 shadow-[0_0_20px_#22d3ee] animate-pulse"></div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Camera size={32} />
                    </div>
                    <p className="text-xs font-bold text-slate-300 font-mono uppercase">Drag & Drop Screenshot / Tap To Browse</p>
                    <p className="text-[10px] text-slate-500">Supports PNG, JPG, JPEG (Max 10MB)</p>
                  </div>
                )}
                
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 uppercase font-bold block mb-2">Or Paste Intercepted SMS / Script Text:</label>
                <textarea 
                  value={textInput}
                  onChange={e => setTextInput(e.target.value)}
                  placeholder="Dear Citizen, your SIM card will be deactivated within 2 hours. Call CBI helpline..."
                  rows={3}
                  className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-xs text-white focus:border-cyan-400 outline-none font-mono"
                />
              </div>

              <button 
                type="submit"
                disabled={scanning || (!imagePreview && !textInput.trim())}
                className="w-full py-4 rounded-2xl btn-primary text-xs font-black uppercase tracking-widest shadow-xl cursor-pointer transition-all disabled:opacity-30 flex items-center justify-center gap-2 font-mono"
              >
                {scanning ? <RefreshCw className="animate-spin" /> : <ScanLine />}
                <span>{scanning ? "Forensic Vision Interception..." : "⚡ Analyze Evidence With Gemini Vision"}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Vision Verdict Results */}
        <div className="lg:col-span-6 space-y-6">
          {report ? (
            <div className="glass-card p-6 sm:p-10 bg-slate-950 border-rose-500/50 space-y-6 relative animate-scale-up font-mono">
              
              <div className="text-center pb-6 border-b border-white/10">
                <span className="text-lg sm:text-2xl font-black text-rose-400 block tracking-wider mb-1">{report.verdict}</span>
                <span className="text-xs text-slate-400 font-sans block">{report.manipulationTactic} (Confidence: {report.confidenceScore})</span>
              </div>

              <div className="space-y-2">
                <span className="text-xs text-pink-400 font-black uppercase tracking-wider block mb-2">🚩 Visual Manipulation Red Flags:</span>
                {report.redFlagsDetected.map((fl, i) => (
                  <div key={i} className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200 text-xs flex items-start gap-2">
                    <span>⚠️</span>
                    <span>{fl}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-xs text-cyan-300 font-black uppercase tracking-wider block mb-2">🛡️ Immediate Citizen Safety Protocol:</span>
                {report.actionProtocol.map((st, i) => (
                  <div key={i} className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 text-xs flex items-start gap-2">
                    <span>✅</span>
                    <span>{st}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white/5 p-3 rounded-xl text-center text-[9px] text-slate-500 uppercase tracking-widest">
                {report.aiAnalysisEngine}
              </div>

            </div>
          ) : (
            <div className="glass-card p-12 bg-slate-950/50 border-white/5 text-center flex flex-col items-center justify-center h-full min-h-[350px]">
              <ScanLine size={48} className="text-slate-600 mb-4 animate-pulse" />
              <h3 className="text-base font-bold text-slate-400 mb-1">Awaiting Screenshot Upload</h3>
              <p className="text-xs text-slate-600 max-w-xs">Upload suspect SMS evidence to launch Gemini Vision multimodal OCR diagnostics.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
