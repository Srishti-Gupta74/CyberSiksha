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

  const handleSendMessage = async (textToSend) => {
    const query = typeof textToSend === 'string' ? textToSend : inputText;
    if (!query || !query.trim()) return;

    const userMsg = { sender: 'user', text: query, time: 'Now' };
    setMessages(prev => [...prev, userMsg]);
    if (typeof textToSend !== 'string') setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      });
      const data = await res.json();
      if (res.ok && data.reply) {
        setMessages(prev => [...prev, { sender: 'ai', text: data.reply, time: 'Just now' }]);
        setIsTyping(false);
        return;
      }
    } catch (err) {
      console.log("AI Chat endpoint fallback:", err);
    }

    // Local fallback intelligence engine if API is unreachable
    const lower = query.toLowerCase();
    let reply = "🚨 Security Mentor Advisory: Always pause and verify unasked financial requests or suspicious links independently. Never share your bank OTP, passwords, or UPI PIN over phone calls. If you suspect fraud, report immediately to the National Helpline at 1930.";
    
    if (lower.includes('phishing') || lower.includes('link') || lower.includes('click')) {
      reply = "🎣 PHISHING DEFINITION: Phishing is a cyber attack where scammers send fake messages (SMS, WhatsApp, or Email) disguised as trusted banks, delivery services, or government bodies. They trick you into clicking malicious links to steal your passwords, bank logins, or OTPs. Always check the sender address carefully!";
    } else if (lower.includes('deepfake') || lower.includes('ai voice') || lower.includes('clone')) {
      reply = "🤖 DEEPFAKE ALERT: Scammers use AI to clone voices or faces of family members from public social media videos. If a loved one calls claiming an emergency and demanding money, hang up and call them back on their known number!";
    } else if (lower.includes('apk') || lower.includes('yono') || lower.includes('download')) {
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
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-[200]">
      
      {/* Cheerful Animated Cyber Mascot Character (Visible on ALL pages) */}
      {/* Sleek, Compact Standard Chatbot Launcher Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-cyan-500 via-indigo-600 to-pink-500 text-white shadow-[0_10px_30px_rgba(34,211,238,0.4)] border-2 border-white/20 flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-300 group relative animate-bounce-subtle"
          title="Open CyberCompanion AI"
        >
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 border-2 border-slate-950 rounded-full animate-ping"></span>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 border-2 border-slate-950 rounded-full"></span>
          <MessageSquareText size={28} className="group-hover:scale-110 transition-transform duration-300 text-white" />
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
