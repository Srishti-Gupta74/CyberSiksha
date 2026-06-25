"use client";

import { useState, useRef, useEffect } from 'react';
import { MessageSquareText, Send, Loader2, Bot, User } from 'lucide-react';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Namaste! I am your CyberSiksha AI Mentor. Did you receive a suspicious message or call today? Ask me anything!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });
      
      const data = await response.json();
      if (data.content) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I am having trouble connecting to my brain right now.' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Network error. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-10rem)] max-w-3xl mx-auto animate-fade-in">
      <div className="mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <MessageSquareText className="text-cyan" /> 
          Ask AI Mentor
        </h1>
      </div>

      <div className="flex-1 glass-card overflow-y-auto p-4 md:p-6 mb-4 space-y-4 border border-white/10 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-cyan/20 border border-cyan/50 flex items-center justify-center shrink-0">
                <Bot size={16} className="text-cyan" />
              </div>
            )}
            
            <div className={`max-w-[80%] p-3 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-cyan text-navy rounded-tr-sm font-medium' 
                : 'bg-navy/80 border border-white/10 text-slate-200 rounded-tl-sm'
            }`}>
              {msg.content}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-500 flex items-center justify-center shrink-0">
                <User size={16} className="text-white" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-cyan/20 border border-cyan/50 flex items-center justify-center shrink-0">
              <Bot size={16} className="text-cyan" />
            </div>
            <div className="bg-navy/80 border border-white/10 p-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-cyan" />
              <span className="text-slate-400 text-sm">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me about a suspicious call or message..."
          className="flex-1 bg-navy/80 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan/50 text-white placeholder-slate-500"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          disabled={isLoading || !input.trim()}
          className="bg-cyan text-navy px-4 py-3 rounded-xl font-bold hover:bg-cyan/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center w-14 shrink-0"
        >
          {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
        </button>
      </form>
    </div>
  );
}
