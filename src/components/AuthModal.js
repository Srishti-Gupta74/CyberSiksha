"use client";

import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { Shield, X, Mail, Lock, User as UserIcon } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();

  if (!isOpen) return null;

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
        const { error: signUpErr } = await signUp(email, password, name);
        if (signUpErr) throw signUpErr;
        // Supabase might require email confirmation depending on settings
        setIsLogin(true);
        setError("Account created! You can now log in.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/80 backdrop-blur-md animate-fade-in">
      <div className="glass-card w-full max-w-md overflow-hidden relative shadow-[0_0_40px_rgba(164,246,249,0.15)] border-t-2 border-t-cyan">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <Shield className="mx-auto text-cyan mb-3 drop-shadow-[0_0_15px_rgba(164,246,249,0.5)]" size={48} />
            <h2 className="text-2xl font-bold font-['Outfit']">Cyber<span className="text-cyan">Siksha</span></h2>
            <p className="text-sm text-slate-400 mt-1">Because nobody taught our parents how the internet works.</p>
          </div>

          {/* Toggle */}
          <div className="flex p-1 bg-navy/50 rounded-xl mb-6 border border-white/5">
            <button 
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${isLogin ? 'bg-card text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              onClick={() => { setIsLogin(true); setError(''); }}
            >
              Sign In
            </button>
            <button 
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${!isLogin ? 'bg-card text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              onClick={() => { setIsLogin(false); setError(''); }}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className={`p-3 rounded-lg mb-6 text-sm font-medium border ${error.includes('created') ? 'bg-success/10 border-success/20 text-success' : 'bg-error/10 border-error/20 text-error'}`}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Display Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required 
                    className="w-full bg-navy/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-all"
                    placeholder="Your Name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required 
                  className="w-full bg-navy/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-all"
                  placeholder="you@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required 
                  minLength={6}
                  className="w-full bg-navy/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full mt-2 py-3 disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={onClose} className="text-sm text-slate-400 hover:text-white underline underline-offset-4">
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
