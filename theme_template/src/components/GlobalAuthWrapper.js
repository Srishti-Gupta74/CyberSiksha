"use client";

import { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import AuthModal from './AuthModal';
import { User, LogOut, Edit2, ChevronDown, Check, Shield } from 'lucide-react';

export default function GlobalAuthWrapper({ children }) {
  const { user, profile, loading, signOut, updateDisplayName } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Profile Menu State
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editNameInput, setEditNameInput] = useState('');
  const [authModalMode, setAuthModalMode] = useState(true);

  useEffect(() => {
    const handleOpenAuth = (e) => {
      setAuthModalMode(e.detail?.isLogin ?? true);
      setShowAuthModal(true);
    };
    window.addEventListener('open_auth_modal', handleOpenAuth);
    return () => window.removeEventListener('open_auth_modal', handleOpenAuth);
  }, []);

  useEffect(() => {
    const isInviteOnboarding = typeof window !== 'undefined' && window.location.search.includes('code=');
    const isHomePage = typeof window !== 'undefined' && window.location.pathname === '/';
    if (!loading && !user && !isInviteOnboarding && !isHomePage) {
      window.location.href = '/';
    }
  }, [user, loading]);

  const handleSaveName = async (e) => {
    e.preventDefault();
    if (!editNameInput.trim()) return;
    await updateDisplayName(editNameInput.trim());
    setShowEditModal(false);
    setShowMenu(false);
  };

  return (
    <>
      {/* Top Header / Profile Info */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-black/30 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-[100] px-6 md:px-12 flex items-center justify-between transition-all select-none">
        <div 
          onClick={() => {
            if (!user) localStorage.removeItem('cs_explored_guest');
            window.location.href = '/';
          }}
          className="flex items-center gap-2 cursor-pointer group hover:opacity-80 transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <Shield size={16} className="text-white/80" />
          </div>
          <div className="font-bold font-heading text-xl tracking-tight text-white flex items-center gap-3">
            <span>CyberSiksha</span>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-medium uppercase bg-white/5 text-white/50 border border-white/10 tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 mr-1.5 animate-pulse"></span> Active
            </span>
          </div>
        </div>
        
        {!loading && (
          <div className="flex items-center gap-3 text-sm relative">
            {user ? (
              <>
                <div className="relative">
                  <button 
                    onClick={() => setShowMenu(!showMenu)}
                    className="bg-transparent hover:bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.2] rounded-full px-3 py-1.5 flex items-center gap-2.5 transition-all cursor-pointer group"
                  >
                    <span className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold">
                      {profile?.avatar_initial || user.email?.charAt(0).toUpperCase()}
                    </span>
                    <span className="font-heading font-medium text-sm text-white/80 group-hover:text-white transition-colors">
                      {profile?.display_name || 'Cyber Defender'}
                    </span>
                    <ChevronDown size={14} className="text-white/40" />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {showMenu && (
                    <div className="absolute right-0 top-12 w-48 bg-slate-950/95 border border-cyan-400/40 rounded-2xl shadow-2xl py-2 z-[150] animate-fade-in backdrop-blur-xl">
                      <button
                        onClick={() => {
                          setEditNameInput(profile?.display_name || '');
                          setShowEditModal(true);
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-slate-200 hover:bg-cyan-500/20 hover:text-cyan-300 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Edit2 size={14} className="text-cyan-400" />
                        <span>Edit Display Name</span>
                      </button>

                      <div className="my-1 border-t border-white/10"></div>

                      <button
                        onClick={async () => {
                          await signOut();
                          window.location.reload();
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-rose-400 hover:bg-rose-500/20 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <LogOut size={14} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button 
                onClick={() => { setAuthModalMode(true); setShowAuthModal(true); }}
                className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded-full transition-all hover:bg-slate-200 hover:scale-105 font-bold font-heading text-xs uppercase tracking-wider cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              >
                <span>Sign In</span>
              </button>
            )}
          </div>
        )}
      </header>

      <div className="pt-14">
        {children}
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        defaultIsLogin={authModalMode}
        onClose={() => {
          setShowAuthModal(false);
        }} 
      />

      {/* Edit Display Name Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="glass-card max-w-sm w-full p-6 bg-slate-950 border border-cyan-400/60 shadow-[0_0_50px_rgba(34,211,238,0.3)] rounded-3xl">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
              <h3 className="text-lg font-black font-['Outfit'] text-white">Edit Your Name</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white font-bold cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSaveName} className="space-y-5">
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2">Display Name</label>
                <input
                  type="text"
                  required
                  value={editNameInput}
                  onChange={(e) => setEditNameInput(e.target.value)}
                  placeholder="e.g. Rajesh Sharma"
                  className="w-full bg-slate-900 border border-white/20 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 py-3 text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check size={14} className="text-navy" />
                  <span>Save Name</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
