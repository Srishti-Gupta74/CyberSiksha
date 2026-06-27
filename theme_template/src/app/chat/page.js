"use client";

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { MessageSquareText, Send, Bot, AlertTriangle, Loader2, Sparkles, ShieldCheck } from 'lucide-react';

export default function ChatPage() {
  const { profile } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: "Namaste! I am your Cyber Mentor. Received a suspicious WhatsApp link? Not sure if a digital arrest video call is fake? Ask me anything."
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to connect to AI server');
      }

      setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'error', 
        content: `Connection Interrupted: ${error.message}` 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-12 h-[calc(100vh-140px)] flex flex-col px-4">
      <div className="mb-6 flex-shrink-0 flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black font-['Outfit'] flex items-center gap-3 mb-1 text-slate-900">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center shadow-xs">
              <Sparkles size={22} />
            </div>
            Ask Cyber AI Mentor
          </h1>
          <p className="text-slate-600 text-xs md:text-sm">Your family's 24/7 personal safety advisor. Ask in English, Hindi, or Hinglish!</p>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-emerald-700 text-xs font-bold bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
          <ShieldCheck size={16} className="text-emerald-600" /> Private & Safe Chat
        </div>
      </div>

      <div className="flex-1 glass-card border-slate-200 flex flex-col overflow-hidden relative shadow-xl bg-white">
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar bg-[#FAF9F6]">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3.5 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-xs mt-1 text-base ${
                msg.role === 'user' ? 'bg-sky-600 text-white font-black' : 
                msg.role === 'error' ? 'bg-rose-100 border border-rose-200 text-rose-600' : 'bg-white border border-slate-200 text-purple-600'
              }`}>
                {msg.role === 'user' ? (
                  <span>👤</span>
                ) : msg.role === 'error' ? (
                  <AlertTriangle size={16} />
                ) : (
                  <span>🤖</span>
                )}
              </div>
              
              <div className={`p-4 md:p-5 rounded-3xl shadow-xs text-sm md:text-base leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-sky-600 text-white font-medium rounded-tr-none' 
                  : msg.role === 'error'
                  ? 'bg-rose-50 border border-rose-200 text-rose-700 rounded-tl-none font-medium'
                  : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-none font-normal shadow-sm'
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3.5 max-w-[85%] animate-fade-in">
              <div className="w-9 h-9 rounded-2xl bg-white border border-slate-200 text-purple-600 flex items-center justify-center shrink-0 mt-1 text-base shadow-xs">
                🤖
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-3xl rounded-tl-none flex items-center gap-3 text-slate-600 shadow-sm">
                <Loader2 className="animate-spin text-sky-600" size={18} />
                <span className="text-xs md:text-sm font-semibold">Mentor is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white border-t border-slate-100">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={isTyping}
              placeholder="E.g. I got an SMS from electricity board saying my power will be cut..."
              className="w-full bg-slate-50 border border-slate-200 rounded-full py-4 pl-6 pr-14 text-sm md:text-base text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white transition-all placeholder:text-slate-400 shadow-inner"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 w-10 h-10 bg-sky-600 hover:bg-sky-700 text-white rounded-full flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md font-bold"
            >
              <Send size={18} className="ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
