"use client";

import { useState, useRef, useEffect } from 'react';
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
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
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
      
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 p-1 rounded-full shadow-[0_10px_35px_rgba(34,211,238,0.5)] hover:scale-105 transition-all duration-300 cursor-pointer"
        >
          <div className="bg-slate-950 px-5 py-3 rounded-full flex items-center gap-3">
            <div className="relative">
              <Bot className="text-cyan-400 animate-bounce" size={24} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-[0_0_8px_#10b981]"></span>
            </div>
            <span className="font-black font-['Outfit'] text-sm tracking-wider uppercase text-white hidden sm:inline">
              Ask AI Mentor
            </span>
            <Sparkles size={16} className="text-amber-400 animate-spin" />
          </div>
        </button>
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
