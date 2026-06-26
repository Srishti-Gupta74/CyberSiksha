"use client";

import { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import AuthModal from './AuthModal';
import { User, LogOut, Edit2, ChevronDown, Check } from 'lucide-react';

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
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#0a0f1d]/85 backdrop-blur-xl border-b border-purple-500/20 z-[100] px-6 md:px-12 flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.5)] select-none">
        <div 
          onClick={() => {
            if (!user) localStorage.removeItem('cs_explored_guest');
            window.location.href = '/';
          }}
          className="flex items-center gap-3 cursor-pointer group hover:opacity-95 transition-all"
        >
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-purple-600 to-pink-500 p-[2px] shadow-[0_0_25px_rgba(34,211,238,0.6)] group-hover:scale-110 transition-transform duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/30 to-purple-500/30 animate-pulse"></div>
              <span className="text-cyan-300 font-black text-base relative z-10 animate-bounce">🛡️</span>
            </div>
          </div>
          <div className="font-black font-['Outfit'] text-xl tracking-tight text-white flex items-center gap-2">
            <span>Cyber<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-400">Siksha</span></span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-ping"></span> Active Grid
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
                    className="bg-purple-950/80 hover:bg-purple-900/90 text-cyan-300 border border-purple-500/40 rounded-full px-4 py-1.5 font-bold flex items-center gap-2.5 shadow-md transition-all cursor-pointer"
                  >
                    <span className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 text-slate-950 flex items-center justify-center text-xs font-black">
                      {profile?.avatar_initial || user.email?.charAt(0).toUpperCase()}
                    </span>
                    <span className="font-['Outfit'] tracking-wide text-white">{profile?.display_name || 'Cyber Defender'}</span>
                    <ChevronDown size={14} className="text-slate-400" />
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
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-90 text-slate-950 px-5 py-2 rounded-full transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)] font-black text-xs uppercase tracking-wider cursor-pointer font-['Outfit']"
              >
                <User size={15} className="text-slate-950" />
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
