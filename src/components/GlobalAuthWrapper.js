"use client";

import { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import AuthModal from './AuthModal';
import { User, LogOut } from 'lucide-react';

export default function GlobalAuthWrapper({ children }) {
  const { user, profile, loading, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [guestMode, setGuestMode] = useState(false);

  useEffect(() => {
    // If we've finished loading and there's no user, and they haven't explicitly chosen guest mode
    if (!loading && !user && !guestMode) {
      setShowAuthModal(true);
    } else {
      setShowAuthModal(false);
    }
  }, [user, loading, guestMode]);

  return (
    <>
      {/* Top Header / Profile Info */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#0a0f1d]/85 backdrop-blur-xl border-b border-purple-500/20 z-[100] px-6 md:px-12 flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.6)]">
            <span className="text-white font-bold text-base">🛡️</span>
          </div>
          <div className="font-black font-['Outfit'] text-xl tracking-tight text-white">
            Cyber<span className="text-cyan-400">Siksha</span>
          </div>
        </div>
        
        {!loading && (
          <div className="flex items-center gap-4 text-sm">
            {user ? (
              <>
                <div className="bg-purple-950/60 text-cyan-300 border border-purple-500/30 rounded-full px-4 py-1.5 font-bold flex items-center gap-2.5 shadow-md">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 text-navy flex items-center justify-center text-xs font-black">
                    {profile?.avatar_initial || user.email?.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden sm:inline font-['Outfit'] tracking-wide text-white">{profile?.display_name || 'Cyber Defender'}</span>
                </div>
                <button 
                  onClick={async () => {
                    await signOut();
                    window.location.reload();
                  }}
                  className="p-2 bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-xl border border-white/10 hover:border-rose-500/40 transition-all cursor-pointer shadow-sm"
                  title="Sign Out"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <button 
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 text-navy px-5 py-2 rounded-full transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)] font-black text-xs uppercase tracking-wider"
              >
                <User size={15} className="text-navy" />
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
        onClose={() => {
          setShowAuthModal(false);
          if (!user) setGuestMode(true);
        }} 
      />
    </>
  );
}
