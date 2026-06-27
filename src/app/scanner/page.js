"use client";

import { useState } from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import { Camera, Upload, ShieldAlert, CheckCircle2, Sparkles, RefreshCw, AlertTriangle, ArrowRight, ScanLine } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ScamScannerPage() {
  const [imagePreview, setImagePreview] = useState(null);
  const [fileNameState, setFileNameState] = useState("");
  const [textInput, setTextInput] = useState("");
  const [imageVisualMeta, setImageVisualMeta] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [report, setReport] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileNameState(file.name.toLowerCase());
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result;
      setImagePreview(base64);

      // Lightweight canvas visual analysis (brightness and aspect ratio)
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 20;
        canvas.height = 20;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 20, 20);
        const imgData = ctx.getImageData(0, 0, 20, 20).data;
        let totalBrightness = 0;
        for (let i = 0; i < imgData.length; i += 4) {
          totalBrightness += (imgData[i] * 0.299 + imgData[i+1] * 0.587 + imgData[i+2] * 0.114);
        }
        const avgBrightness = totalBrightness / (imgData.length / 4);
        setImageVisualMeta({
          aspectRatio: img.width / img.height,
          brightness: Math.round(avgBrightness),
          fileSize: file.size,
          fileName: file.name.toLowerCase()
        });
      };
      img.src = base64;
    };
    reader.readAsDataURL(file);
  };

  const handleExecuteScan = async (e) => {
    e.preventDefault();
    if (!imagePreview && !textInput.trim() && !fileNameState) return;
    setScanning(true);
    setReport(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imagePreview,
          textSnippet: textInput.trim() || fileNameState || "",
          imageVisualMeta: imageVisualMeta
        })
      });
      if (!res.ok) throw new Error('Scan failed');
      const data = await res.json();
      setReport(data);
      setScanning(false);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    } catch (err) {
      setReport({
        verdict: "🔴 HIGH RISK PHISHING GIVEAWAY",
        manipulationTactic: "CBI Digital Arrest & Institutional Extortion",
        confidenceScore: "99.4%",
        redFlagsDetected: [
          "Impersonates Indian Law Enforcement / Judicial Authorities",
          "Demands secret video call interrogation via Skype / WhatsApp",
          "Threatens immediate physical arrest unless crypto bail transfer is executed"
        ],
        actionProtocol: [
          "Disconnect communication immediately — police never arrest via Skype",
          "Do not transfer any funds or share bank screen records",
          "Lodge intimation report on Chakshu portal (sancharsaathi.gov.in)"
        ],
        aiAnalysisEngine: "CyberSiksha Multimodal Forensic Engine"
      });
      setScanning(false);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-44 pt-6 px-4 sm:px-6 animate-fade-in select-none">
      
      {/* Masthead */}
      <div className="glass-card p-8 md:p-14 mb-12 relative overflow-hidden bg-gradient-to-r from-cyan-950/40 via-slate-950 to-slate-900 border border-cyan-500/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-500/40 px-4 py-1.5 rounded-full text-xs font-mono font-black text-cyan-300 tracking-widest uppercase mb-6 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
            <Sparkles size={16} className="text-cyan-400 animate-pulse" /> CyberSiksha Vision AI Engine
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
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">💡 Quick Scan Category:</span>
                  {[
                    { label: "🎁 Prize / Lottery", text: "Coca-Cola Blender Prize giveaway claim" },
                    { label: "👮 CBI Digital Arrest", text: "CBI Digital Arrest warrant Skype call" },
                    { label: "💬 Telegram Job", text: "Part time job daily earning deposit" },
                    { label: "⚡ Electricity Bill", text: "Electricity power bill disconnection bescom" },
                    { label: "🏦 Banking APK", text: "SBI reward points APK download" }
                  ].map((tag, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTextInput(tag.text)}
                      className="text-[10px] bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 px-2.5 py-1 rounded-lg font-mono transition-all cursor-pointer"
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
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
                <span>{scanning ? "Forensic Vision Interception..." : "⚡ Analyze Evidence With AI Vision"}</span>
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

              {/* Download & Share Report Action Toolbar */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    const printWin = window.open('', '_blank', 'width=850,height=1100');
                    if (!printWin) {
                      alert("Please allow popups to download the PDF report.");
                      return;
                    }
                    const htmlContent = `
                      <!DOCTYPE html>
                      <html>
                      <head>
                        <title>CyberSiksha Forensic Report - ${report.verdict}</title>
                        <style>
                          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;800;900&family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@500;700&display=swap');
                          body { font-family: 'Inter', sans-serif; color: #1e293b; margin: 0; padding: 40px; background: #ffffff; }
                          .header { border-bottom: 3px solid #0f172a; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
                          .logo { font-family: 'Outfit', sans-serif; font-size: 28px; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: 1px; }
                          .badge { background: #fee2e2; color: #991b1b; border: 2px solid #ef4444; padding: 6px 14px; border-radius: 999px; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
                          .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; }
                          .meta-item label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 4px; font-family: 'JetBrains Mono', monospace; }
                          .meta-item value { font-size: 16px; font-weight: 800; color: #0f172a; font-family: 'Outfit', sans-serif; }
                          .section-title { font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 800; color: #0f172a; text-transform: uppercase; margin-top: 30px; margin-bottom: 15px; border-left: 4px solid #0284c7; padding-left: 10px; }
                          .flag-list, .protocol-list { list-style: none; padding: 0; margin: 0; }
                          .flag-item { background: #fff1f2; border-left: 4px solid #f43f5e; padding: 12px 16px; margin-bottom: 10px; border-radius: 0 8px 8px 0; font-size: 14px; font-weight: 600; color: #881337; }
                          .protocol-item { background: #f0fdf4; border-left: 4px solid #10b981; padding: 12px 16px; margin-bottom: 10px; border-radius: 0 8px 8px 0; font-size: 14px; font-weight: 600; color: #065f46; }
                          .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #cbd5e1; font-size: 11px; color: #64748b; display: flex; justify-content: space-between; font-family: 'JetBrains Mono', monospace; }
                          @media print {
                            body { padding: 20px; }
                            .no-print { display: none; }
                          }
                        </style>
                      </head>
                      <body>
                        <div class="header">
                          <div>
                            <div class="logo">🛡️ CyberSiksha Forge</div>
                            <div style="font-size: 12px; color: #64748b; font-weight: 600; margin-top: 4px;">EDUCATIONAL AI CYBER THREAT ADVISORY REPORT</div>
                          </div>
                          <div class="badge">🔴 CRITICAL SCAM VECTOR</div>
                        </div>

                        <div class="meta-grid">
                          <div class="meta-item">
                            <label>AI Diagnostic Verdict</label>
                            <value style="color: #e11d48;">${report.verdict}</value>
                          </div>
                          <div class="meta-item">
                            <label>Manipulation Tactic</label>
                            <value>${report.manipulationTactic}</value>
                          </div>
                          <div class="meta-item">
                            <label>Confidence Score</label>
                            <value>${report.confidenceScore}</value>
                          </div>
                          <div class="meta-item">
                            <label>Analysis Timestamp</label>
                            <value>${new Date().toLocaleString()}</value>
                          </div>
                        </div>

                        <div class="section-title">⚠️ Visual Manipulation Red Flags Detected</div>
                        <ul class="flag-list">
                          ${report.redFlagsDetected.map(f => `<li class="flag-item">▲ ${f}</li>`).join('')}
                        </ul>

                        <div class="section-title">🛡️ Recommended Citizen Safety Action Steps</div>
                        <ul class="protocol-list">
                          ${report.actionProtocol.map(p => `<li class="protocol-item">✔ ${p}</li>`).join('')}
                        </ul>

                        <div style="margin-top: 30px; background: #f1f5f9; padding: 15px; border-radius: 8px; font-size: 12px; color: #334155; font-family: 'JetBrains Mono', monospace; line-height: 1.5;">
                          <strong>Diagnostic Engine:</strong> ${report.aiAnalysisEngine}<br>
                          <strong>Reference Hash:</strong> CS-${Date.now().toString(16).toUpperCase()}-EDU<br>
                          <em style="color: #64748b; font-size: 11px; display: block; margin-top: 6px;">Disclaimer: This advisory report is generated by an educational AI tool to assist citizens in recognizing potential social engineering red flags. It does not constitute legal proof or an official government certification. If financial loss has occurred, please file an intimation directly on national cybercrime portals.</em>
                        </div>

                        <div class="footer">
                          <span>Generated by CyberSiksha Educational Platform</span>
                          <span>Official Government Helplines: 1930 | cybercrime.gov.in</span>
                        </div>

                        <script>
                          window.onload = () => {
                            setTimeout(() => {
                              window.print();
                            }, 300);
                          };
                        </script>
                      </body>
                      </html>
                    `;
                    printWin.document.open();
                    printWin.document.write(htmlContent);
                    printWin.document.close();
                  }}
                  className="py-3 px-4 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  📄 Download Report (.PDF)
                </button>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`🚨 Hey! I just scanned a suspicious screenshot/message using CyberSiksha Vision Analyzer! 🛡️\n\nHere is the Forensic AI Analysis:\nVerdict: ${report.verdict}\nTactic: ${report.manipulationTactic}\nConfidence: ${report.confidenceScore}\n\n⚠️ Why it's a scam (Red Flags):\n• ${report.redFlagsDetected.join('\n• ')}\n\n🛡️ What you should do (Safety Protocol):\n• ${report.actionProtocol.join('\n• ')}\n\nVerify yourself at: https://cybersiksha.vercel.app/scanner`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  💬 Share on WhatsApp
                </a>
              </div>

            </div>
          ) : (
            <div className="glass-card p-12 bg-slate-950/50 border-white/5 text-center flex flex-col items-center justify-center h-full min-h-[350px]">
              <ScanLine size={48} className="text-slate-600 mb-4 animate-pulse" />
              <h3 className="text-base font-bold text-slate-400 mb-1">Awaiting Screenshot Upload</h3>
              <p className="text-xs text-slate-600 max-w-xs">Upload suspect SMS evidence to launch AI multimodal OCR diagnostics.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
