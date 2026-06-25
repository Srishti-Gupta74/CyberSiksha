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
      <header className="fixed top-0 left-0 right-0 h-14 bg-navy/80 backdrop-blur-md border-b border-white/5 z-40 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🛡️</span>
          <span className="font-bold font-['Outfit'] hidden sm:inline">Cyber<span className="text-cyan">Siksha</span></span>
        </div>
        
        {!loading && (
          <div className="flex items-center gap-3 text-sm">
            {user ? (
              <>
                <div className="bg-cyan/10 text-cyan border border-cyan/20 rounded-full px-3 py-1 font-bold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-cyan text-navy flex items-center justify-center text-xs">
                    {profile?.avatar_initial || user.email?.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden sm:inline">{profile?.display_name || 'Cyber Learner'}</span>
                </div>
                <button 
                  onClick={() => signOut()}
                  className="p-2 text-slate-400 hover:text-rose transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <button 
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 bg-navy-light hover:bg-card-hover border border-white/10 px-4 py-1.5 rounded-full transition-colors"
              >
                <User size={16} className="text-cyan" />
                <span className="font-semibold text-slate-200">Sign In</span>
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
