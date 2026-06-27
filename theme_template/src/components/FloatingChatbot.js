"use client";

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MessageSquareText, X, Send, Sparkles, Bot, ShieldCheck, Loader2, Minimize2 } from 'lucide-react';
import { useAuth } from './AuthProvider';

const MOCK_AI_RESPONSES = {
  default: "Namaste! I am CyberAI, your 24/7 digital protection officer. Send me any suspicious SMS, UPI request, WhatsApp link, or phone number and I will instantly analyze if it's a scam!",
  apk: "🚨 CRITICAL WARNING: NEVER download any .apk file sent over WhatsApp or Telegram (even if it claims to be SBI YONO, PM Yojana, or Electricity Board). Official apps are ONLY on Google Play Store!",
  arrest: "⚠️ FRAUD ALERT: 'Digital Arrest' is 100% FAKE! CBI, Police, or RBI officers NEVER video call citizens on WhatsApp or Skype asking for money to clear charges. Disconnect immediately and dial 1930!",
  lottery: "🛑 SCAM INTERCEPTED: If you didn't buy a lottery ticket, you cannot win ₹25 Lakhs from KBC or WhatsApp! Do not pay any 'processing fee' or 'taxes' to claim this fake prize.",
  job: "⚠️ TRAP DETECTED: Legitimate companies (Amazon, Google, Tata) NEVER ask candidates to pay ₹1,000 for 'laptop security deposit' or 'registration fee' on Telegram."
};

const QUICK_PROMPTS = [
  "🚨 Check fake SBI YONO SMS",
  "📞 Is 'Digital Arrest' call real?",
  "💡 How to lock Aadhaar biometrics?",
  "💸 Someone requested UPI PIN"
];

export default function FloatingChatbot() {
  const pathname = usePathname();
  const isHomepage = pathname === '/';
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 12;
      const normY = (e.clientY / window.innerHeight - 0.5) * 8;
      setMousePos({ x: normX, y: normY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const [messages, setMessages] = useState([
    { sender: 'ai', text: MOCK_AI_RESPONSES.default, time: 'Just now' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = (textToSend) => {
    const query = typeof textToSend === 'string' ? textToSend : inputText;
    if (!query || !query.trim()) return;

    const userMsg = { sender: 'user', text: query, time: 'Now' };
    setMessages(prev => [...prev, userMsg]);
    if (typeof textToSend !== 'string') setInputText('');
    setIsTyping(true);

    // AI Intelligence Analysis Simulation
    setTimeout(() => {
      const lower = query.toLowerCase();
      let reply = "⚠️ SUSPICIOUS PATTERN DETECTED: Scammers frequently use urgent pressure tactics and promises of quick rewards. Do not share OTPs, click unknown links, or transfer funds. Verify independently!";
      
      if (lower.includes('apk') || lower.includes('yono') || lower.includes('download')) {
        reply = MOCK_AI_RESPONSES.apk;
      } else if (lower.includes('arrest') || lower.includes('police') || lower.includes('cbi') || lower.includes('video call')) {
        reply = MOCK_AI_RESPONSES.arrest;
      } else if (lower.includes('lottery') || lower.includes('kbc') || lower.includes('prize') || lower.includes('won')) {
        reply = MOCK_AI_RESPONSES.lottery;
      } else if (lower.includes('job') || lower.includes('telegram') || lower.includes('part time') || lower.includes('youtube like')) {
        reply = MOCK_AI_RESPONSES.job;
      } else if (lower.includes('aadhaar') || lower.includes('biometric') || lower.includes('lock')) {
        reply = "🛡️ PROTOCOL: Visit myaadhaar.uidai.gov.in right now, log in with OTP, and click 'Lock/Unlock Biometrics'. This stops scammers from using your cloned fingerprints at customer service centres!";
      } else if (lower.includes('upi') || lower.includes('pin') || lower.includes('qr') || lower.includes('receive')) {
        reply = "🛑 IRONCLAD RULE: You NEVER need to enter your UPI PIN to RECEIVE money. Entering your PIN always DEDUCTS money from your bank account!";
      }

      setMessages(prev => [...prev, { sender: 'ai', text: reply, time: 'Just now' }]);
      setIsTyping(false);
    }, 1000);
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-[200]">
      
      {/* Cheerful Animated Cyber Mascot Character (Visible on ALL pages) */}
      {!isOpen && (
        <div 
          onClick={() => setIsOpen(true)}
          className="flex flex-col items-end cursor-pointer group select-none animate-fade-in"
        >
          {/* Cheerful Speech Bubble */}
          <div className="mb-3 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white p-4 sm:p-5 rounded-3xl rounded-br-xs border-2 border-cyan-400/80 shadow-[0_20px_50px_rgba(34,211,238,0.45)] max-w-[280px] transform transition-all group-hover:-translate-y-2 group-hover:scale-105 relative overflow-hidden backdrop-blur-2xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/15 rounded-full blur-xl pointer-events-none"></div>
            <p className="text-[10px] font-black font-mono text-cyan-400 mb-1.5 tracking-widest uppercase flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-400 animate-spin" /> Cyber Companion
            </p>
            <p className="text-xs sm:text-sm font-medium text-slate-100 leading-snug font-['Outfit']">
              "Hi I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-300 to-pink-400 font-black text-sm">Cyber</span>, your learning companion, ask me anything!"
            </p>
          </div>

          {/* Illustrated Full Figure Humanoid Robot Mascot (AAA Game Style) */}
          <div className="relative w-48 h-52 flex items-center justify-center transform transition-transform group-hover:scale-110 duration-300">
            
            {/* Custom Self-Contained Keyframe Animations */}
            <style jsx>{`
              @keyframes mascotGentleHover {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-7px); }
              }
              @keyframes mascotWaveHand {
                0%, 100% { transform: rotate(0deg); }
                25% { transform: rotate(18deg); }
                75% { transform: rotate(-8deg); }
              }
              @keyframes mascotBlinkEyes {
                0%, 92%, 100% { transform: scaleY(1); }
                96% { transform: scaleY(0.08); }
              }
              .mascot-container {
                animation: mascotGentleHover 4s ease-in-out infinite;
              }
              .mascot-waving-arm {
                transform-origin: 148px 115px;
                animation: mascotWaveHand 2.2s ease-in-out infinite;
              }
              .mascot-eyes {
                transform-origin: 100px 64px;
                animation: mascotBlinkEyes 4.5s infinite;
              }
            `}</style>

            {/* Holographic Orbital Rings around Cyber */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 border border-cyan-400/30 rounded-full absolute animate-[spin_18s_linear_infinite] border-dashed"></div>
              <div className="w-40 h-40 border border-purple-500/25 rounded-full absolute animate-[spin_25s_linear_infinite_reverse]"></div>
            </div>

            {/* Swirling Holographic Ground Portal Ring Shadow (Clean static glow, no shooting balls) */}
            <div className="absolute bottom-2 w-36 h-6 bg-gradient-to-r from-cyan-500/40 via-purple-500/50 to-pink-500/40 rounded-full blur-md animate-pulse"></div>
            <div className="absolute bottom-3 w-28 h-3 border border-cyan-400/70 rounded-full opacity-80"></div>

            {/* Complete Humanoid Robot Mascot SVG */}
            <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-[0_20px_35px_rgba(34,211,238,0.4)] mascot-container">
              <defs>
                <linearGradient id="armorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="60%" stopColor="#e2e8f0" />
                  <stop offset="100%" stopColor="#94a3b8" />
                </linearGradient>
                <linearGradient id="darkVisor" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0f172a" />
                  <stop offset="100%" stopColor="#020617" />
                </linearGradient>
                <linearGradient id="neonGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>

              {/* Floating Holographic Antenna Diamond */}
              <polygon points="100,5 107,15 100,25 93,15" fill="url(#neonGlow)" className="animate-pulse" />
              <line x1="100" y1="25" x2="100" y2="40" stroke="#22d3ee" strokeWidth="3" />

              {/* Jetpack Wings peeking behind */}
              <path d="M50,100 Q20,110 30,145 Q50,135 65,115 Z" fill="url(#neonGlow)" opacity="0.85" />
              <path d="M150,100 Q180,110 170,145 Q150,135 135,115 Z" fill="url(#neonGlow)" opacity="0.85" />

              {/* Left Arm & Shoulder Pad (Resting casually on hip) */}
              <g className="transition-transform duration-500 hover:rotate-6" style={{ transformOrigin: '52px 115px' }}>
                <rect x="42" y="102" width="22" height="16" rx="8" fill="url(#armorGrad)" />
                <path d="M52,115 Q35,135 48,160" stroke="url(#armorGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
                <circle cx="48" cy="160" r="9" fill="#22d3ee" className="shadow-[0_0_15px_#22d3ee]" />
              </g>

              {/* Right Arm & Waving Hand (Continuous smooth waving animation) */}
              <g className="mascot-waving-arm">
                <rect x="136" y="102" width="22" height="16" rx="8" fill="url(#armorGrad)" />
                <path d="M148,115 Q175,100 170,75" stroke="url(#armorGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
                <circle cx="170" cy="75" r="10" fill="#ec4899" className="animate-pulse" />
                {/* Waving motion energy arcs */}
                <path d="M185,65 Q192,75 185,85" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M191,70 Q196,75 191,80" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" fill="none" />
              </g>

              {/* Left Leg & Hover Boot */}
              <rect x="75" y="175" width="16" height="30" rx="8" fill="url(#armorGrad)" />
              <path d="M68,200 L98,200 L94,215 L72,215 Z" fill="#1e293b" stroke="#22d3ee" strokeWidth="2" />
              <ellipse cx="83" cy="218" rx="10" ry="3.5" fill="#22d3ee" opacity="0.9" />

              {/* Right Leg & Hover Boot */}
              <rect x="109" y="175" width="16" height="30" rx="8" fill="url(#armorGrad)" />
              <path d="M102,200 L132,200 L128,215 L106,215 Z" fill="#1e293b" stroke="#22d3ee" strokeWidth="2" />
              <ellipse cx="117" cy="218" rx="10" ry="3.5" fill="#22d3ee" opacity="0.9" />

              {/* Main Humanoid Torso / Chassis */}
              <path d="M65,95 L135,95 L125,175 L75,175 Z" fill="url(#armorGrad)" stroke="#64748b" strokeWidth="2" />
              {/* Glowing Chest Breastplate Trim */}
              <path d="M72,105 L128,105 L120,150 L80,150 Z" fill="#0f172a" stroke="url(#neonGlow)" strokeWidth="2.5" />
              {/* Glowing Energy Core Heart inside chest */}
              <polygon points="100,115 110,125 100,140 90,125" fill="#22d3ee" />
              <circle cx="100" cy="126" r="4.5" fill="#ffffff" className="animate-pulse" />

              {/* Mecha Waist Belt */}
              <rect x="70" y="165" width="60" height="12" rx="6" fill="#334155" stroke="#22d3ee" strokeWidth="1.5" />
              <circle cx="100" cy="171" r="4" fill="#ec4899" />

              {/* Robot Head / Helmet with Cursor Tracking Parallax */}
              <g style={{ transform: `translate(${mousePos.x * 0.45}px, ${mousePos.y * 0.45}px)`, transition: 'transform 0.08s ease-out' }}>
                <rect x="60" y="38" width="80" height="60" rx="28" fill="url(#armorGrad)" stroke="#ffffff" strokeWidth="2.5" />
                {/* Mecha Ear Orbs */}
                <circle cx="56" cy="68" r="8" fill="#ec4899" />
                <circle cx="144" cy="68" r="8" fill="#22d3ee" />

                {/* Curved Dark LED Visor */}
                <rect x="68" y="48" width="64" height="40" rx="18" fill="url(#darkVisor)" stroke="url(#neonGlow)" strokeWidth="2" />

                {/* Expressive Glowing Visor Anime Mascot Eyes with Natural Blinking & Mouse Parallax Tracking */}
                <g className="mascot-eyes" style={{ transform: `translate(${mousePos.x * 0.65}px, ${mousePos.y * 0.65}px)` }}>
                  {/* Left Eye */}
                  <ellipse cx="85" cy="64" rx="6.5" ry="8.5" fill="#22d3ee" />
                  <circle cx="83" cy="61" r="3" fill="#ffffff" />
                  {/* Right Eye */}
                  <ellipse cx="115" cy="64" rx="6.5" ry="8.5" fill="#22d3ee" />
                  <circle cx="113" cy="61" r="3" fill="#ffffff" />
                </g>

                {/* Cute Digital Rosy Cheeks */}
                <rect x="74" y="76" width="8" height="3" rx="1.5" fill="#f43f5e" opacity="0.85" />
                <rect x="118" y="76" width="8" height="3" rx="1.5" fill="#f43f5e" opacity="0.85" />

                {/* Cheerful Visor Smile Line */}
                <path d="M92,75 Q100,83 108,75" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" fill="none" />
              </g>
            </svg>

          </div>
        </div>
      )}

      {/* Expanded Chatbot Window Modal */}
      {isOpen && (
        <div className="w-[calc(100vw-3rem)] sm:w-[400px] h-[550px] bg-slate-950/95 backdrop-blur-2xl border border-cyan-400/50 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_50px_rgba(139,92,246,0.35)] flex flex-col overflow-hidden animate-fade-in">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-purple-900/40 via-slate-900 to-slate-900 border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center shadow-lg">
                🤖
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black font-['Outfit'] text-white text-base">CyberAI Mentor</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]"></span>
                </div>
                <span className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase">24/7 Fraud Intercept Unit</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
              >
                <Minimize2 size={16} />
              </button>
            </div>
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="px-4 py-2.5 bg-slate-900/60 border-b border-white/5 flex gap-2 overflow-x-auto custom-scrollbar shrink-0 select-none">
            {QUICK_PROMPTS.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(qp)}
                disabled={isTyping}
                className="shrink-0 text-[11px] font-bold bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-400/40 px-3 py-1.5 rounded-full transition-all cursor-pointer"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Message Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 custom-scrollbar">
            {messages.map((m, i) => (
              <div 
                key={i} 
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`max-w-[88%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user' 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-navy font-bold rounded-br-xs shadow-md' 
                    : 'bg-slate-900 border border-purple-500/30 text-slate-100 rounded-bl-xs shadow-lg'
                }`}>
                  {m.text}
                </div>
                <span className="text-[9px] text-slate-500 font-bold uppercase mt-1 px-1">{m.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono p-2 animate-pulse">
                <Loader2 size={14} className="animate-spin" /> Analyzing threat database...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-slate-900 border-t border-white/10 shrink-0">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative flex items-center"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste SMS link or ask doubt..."
                className="w-full bg-slate-950 border border-white/15 rounded-2xl py-3 pl-4 pr-12 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="absolute right-1.5 w-9 h-9 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-20 text-navy rounded-xl flex items-center justify-center font-bold transition-all cursor-pointer shadow-sm"
              >
                <Send size={16} />
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
}
