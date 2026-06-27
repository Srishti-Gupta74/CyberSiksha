"use client";

import { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { Shield, X, Mail, Lock, User as UserIcon } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, defaultIsLogin = true }) {
  const [isLogin, setIsLogin] = useState(defaultIsLogin);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [render, setRender] = useState(false);
  
  const { signIn, signUp } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setIsLogin(defaultIsLogin);
      setRender(true);
      const t = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(t);
    } else {
      setIsVisible(false);
      const t = setTimeout(() => setRender(false), 300);
      return () => clearTimeout(t);
    }
  }, [isOpen, defaultIsLogin]);

  if (!render) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        const { error: signInErr } = await signIn(email, password);
        if (signInErr) throw signInErr;
        onClose();
      } else {
        const { data, error: signUpErr } = await signUp(email, password, name);
        if (signUpErr) throw signUpErr;
        if (data?.user) {
          onClose();
        } else {
          setIsLogin(true);
          setError("Account created! You can now log in.");
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl transition-opacity duration-300 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`w-full max-w-md overflow-hidden relative shadow-2xl border border-white/[0.08] bg-[#050505] rounded-3xl transition-all duration-300 ease-out transform ${isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'}`}>
        
        {/* MacOS Style Close Button (Single Red Dot) */}
        <div className="absolute top-5 right-5 flex z-10 group">
          <button 
            onClick={onClose}
            className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] flex items-center justify-center border border-[#e0443e] hover:bg-[#ff5f56] transition-colors"
          >
            <X size={8} className="text-black/70 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={4} />
          </button>
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <Shield className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-bold font-heading tracking-tight text-white">CyberSiksha</h2>
            <p className="text-sm text-white/40 mt-2 font-medium">Because nobody taught our parents how the internet works.</p>
          </div>

          {/* Toggle */}
          <div className="flex p-1 bg-white/[0.02] rounded-xl mb-8 border border-white/[0.05]">
            <button 
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${isLogin ? 'bg-white/10 text-white shadow-md border border-white/10' : 'text-white/40 hover:text-white/70'}`}
              onClick={() => { setIsLogin(true); setError(''); }}
            >
              Sign In
            </button>
            <button 
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${!isLogin ? 'bg-white/10 text-white shadow-md border border-white/10' : 'text-white/40 hover:text-white/70'}`}
              onClick={() => { setIsLogin(false); setError(''); }}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className={`p-3 rounded-lg mb-6 text-sm font-medium border ${error.includes('created') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Display Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                  <input 
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required 
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-white/30 focus:bg-white/[0.04] transition-all placeholder:text-white/20"
                    placeholder="Your Name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required 
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-white/30 focus:bg-white/[0.04] transition-all placeholder:text-white/20"
                  placeholder="you@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required 
                  minLength={6}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-white/30 focus:bg-white/[0.04] transition-all placeholder:text-white/20"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-4 py-4 bg-white text-black font-bold font-heading rounded-xl text-sm uppercase tracking-wider transition-all hover:bg-slate-200 disabled:opacity-50 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={onClose} className="text-[11px] font-medium text-white/40 hover:text-white uppercase tracking-widest transition-colors cursor-pointer">
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
