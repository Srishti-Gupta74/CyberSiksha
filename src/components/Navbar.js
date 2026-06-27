"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Newspaper, Users, Crosshair, Camera, ShieldAlert } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading || !user) return null;
  
  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={22} /> },
    { name: 'Scanner', path: '/scanner', icon: <Camera size={22} className="text-cyan-400 animate-pulse" /> },
    { name: 'RedZone', path: '/redzone', icon: <Crosshair size={22} className="text-rose-400" /> },
    { name: 'SOS Guide', path: '/recovery', icon: <ShieldAlert size={22} className="text-rose-500 animate-pulse" /> },
    { name: 'News', path: '/news', icon: <Newspaper size={22} /> },
    { name: 'Family', path: '/family', icon: <Users size={22} /> },
  ];

  return (
    <>
      {/* Floating Emergency Pill */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
        <Link
          href="/recovery"
          className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(244,63,94,0.6)] border border-rose-400 flex items-center gap-2 transition-all font-mono hover:scale-105"
        >
          <span className="animate-pulse">🚨</span>
          <span>Scammed? SOS Action Guide & Helplines</span>
        </Link>
      </div>

      {/* Floating Elite Navy-Purple Dock */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[95%] md:max-w-fit animate-fade-in">
        <div className="bg-slate-900/85 backdrop-blur-2xl rounded-3xl mx-auto flex justify-between items-center px-6 py-4 md:px-10 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(139,92,246,0.25)] border border-purple-500/30">
          
          <div className="flex w-full md:w-auto justify-between md:gap-8 items-center">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`relative flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 group ${
                    isActive ? 'text-cyan-400 scale-110 font-bold' : 'text-slate-400 hover:text-white hover:scale-105'
                  }`}
                >
                  <div className={`p-2.5 rounded-2xl transition-all ${isActive ? 'bg-purple-600/30 text-cyan-300 shadow-[0_0_15px_rgba(139,92,246,0.5)]' : 'group-hover:bg-white/5'}`}>
                    {item.icon}
                  </div>
                  <span className="text-[10px] tracking-wider uppercase mt-1 hidden md:block">
                    {item.name}
                  </span>
                  {isActive && (
                    <span className="absolute -bottom-1.5 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee] animate-pulse"></span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
