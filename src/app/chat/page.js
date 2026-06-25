"use client";

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { MessageSquareText, Send, User, Bot, AlertTriangle, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function ChatPage() {
  const { profile } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: "Namaste! I am your Cyber Mentor. Received a suspicious WhatsApp message? Not sure if a UPI request is genuine? Ask me anything."
    }
  ]);
  const [input, setInput] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const savedKey = localStorage.getItem('cybersiksha_gemini_key');
    if (savedKey) setApiKey(savedKey);
  }, []);

  const handleSaveKey = (e) => {
    const val = e.target.value;
    setApiKey(val);
    localStorage.setItem('cybersiksha_gemini_key', val);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !apiKey) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `You are a cybersecurity expert mentor for an Indian platform called CyberSiksha. 
Your goal is to help elderly people, parents, and youth spot scams.
The user's question: "${userMessage}"

Provide a clear, simple, and reassuring answer. Do not use complex technical jargon. 
Give them direct advice on whether it's safe or a scam, and tell them exactly what to do next. Keep it under 150 words.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'ai', content: text }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'error', content: `Error connecting to AI Mentor. Please check your API key.` }]);
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-12 h-[calc(100vh-140px)] flex flex-col">
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-2xl md:text-3xl font-black font-['Outfit'] flex items-center gap-3 mb-2">
          <MessageSquareText className="text-gold" size={28} />
          AI Cyber Mentor
        </h1>
        <p className="text-slate-400 text-sm">Your personal security advisor. Available 24/7.</p>
      </div>

      {!apiKey && (
        <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 mb-6 flex-shrink-0 flex items-start gap-3">
          <AlertTriangle className="text-gold mt-1 flex-shrink-0" size={20} />
          <div className="flex-1">
            <h3 className="text-gold font-bold mb-1">API Key Required</h3>
            <p className="text-sm text-slate-300 mb-3">
              To chat with the mentor, please enter your free Google Gemini API Key. This key is saved locally in your browser and never sent to our servers.
            </p>
            <input 
              type="password" 
              placeholder="Paste Gemini API Key here (AIza...)" 
              value={apiKey}
              onChange={handleSaveKey}
              className="w-full bg-navy/50 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
            />
          </div>
        </div>
      )}

      <div className="flex-1 glass-card border-gold/20 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none"></div>
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                msg.role === 'user' ? 'bg-cyan/20 text-cyan' : 
                msg.role === 'error' ? 'bg-rose/20 text-rose' : 'bg-gold/20 text-gold'
              }`}>
                {msg.role === 'user' ? (
                  <span className="text-xs font-bold">{profile?.avatar_initial || 'U'}</span>
                ) : msg.role === 'error' ? (
                  <AlertTriangle size={16} />
                ) : (
                  <Bot size={16} />
                )}
              </div>
              
              <div className={`p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-cyan text-navy rounded-tr-none' 
                  : msg.role === 'error'
                  ? 'bg-rose/10 border border-rose/20 text-rose rounded-tl-none'
                  : 'bg-navy-light border border-white/5 text-slate-200 rounded-tl-none'
              }`}>
                <p className="text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-4 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center flex-shrink-0 mt-1">
                <Bot size={16} />
              </div>
              <div className="bg-navy-light border border-white/5 p-4 rounded-2xl rounded-tl-none flex items-center gap-2 text-gold">
                <Loader2 className="animate-spin" size={16} />
                <span className="text-sm font-semibold">Mentor is typing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-navy-light border-t border-white/5">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={!apiKey || isTyping}
              placeholder="E.g. I got a call from 'FedEx' about a parcel..."
              className="w-full bg-navy border border-white/10 rounded-full py-4 pl-6 pr-14 text-sm text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={!input.trim() || !apiKey || isTyping}
              className="absolute right-2 w-10 h-10 bg-gold hover:bg-gold/90 text-navy rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(245,158,11,0.3)]"
            >
              <Send size={18} className="ml-1" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
