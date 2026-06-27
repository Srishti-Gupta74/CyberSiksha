"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Newspaper, Users, Crosshair, Camera, ShieldAlert, BookOpen, Gamepad2 } from 'lucide-react';
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
    { name: 'Home', path: '/', icon: <Home size={24} /> },
    { name: 'Learn', path: '/learn', icon: <BookOpen size={24} className="text-emerald-400" /> },
    { name: 'Quiz', path: '/quiz', icon: <Gamepad2 size={24} className="text-purple-400" /> },
    { name: 'Scanner', path: '/scanner', icon: <Camera size={24} className="text-cyan-400" /> },
    { name: 'RedZone', path: '/redzone', icon: <Crosshair size={24} className="text-rose-400" /> },
    { name: 'SOS Guide', path: '/recovery', icon: <ShieldAlert size={24} className="text-rose-500" /> },
    { name: 'News', path: '/news', icon: <Newspaper size={24} /> },
    { name: 'Family', path: '/family', icon: <Users size={24} /> },
  ];

  return (
    <>
      {/* Floating Elite High-Contrast Dock for Elders */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-[98%] sm:max-w-fit animate-fade-in">
        <div className="bg-slate-950/95 backdrop-blur-2xl rounded-3xl mx-auto flex justify-between items-center px-3 py-2.5 sm:px-6 sm:py-3.5 shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_40px_rgba(139,92,246,0.35)] border-2 border-purple-500/50 overflow-x-auto max-w-full">
          
          <div className="flex w-full sm:w-auto justify-between gap-1 sm:gap-3 md:gap-4 items-center">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`relative flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 group ${
                    isActive ? 'text-cyan-300 scale-105 font-black' : 'text-slate-200 hover:text-white hover:scale-105'
                  }`}
                >
                  <div className={`p-2 rounded-2xl transition-all ${isActive ? 'bg-purple-600/40 text-cyan-300 shadow-[0_0_20px_rgba(139,92,246,0.6)]' : 'group-hover:bg-white/10'}`}>
                    {item.icon}
                  </div>
                  <span className="text-[11px] sm:text-xs font-black tracking-wider uppercase mt-1.5 block font-sans">
                    {item.name}
                  </span>
                  {isActive && (
                    <span className="absolute -bottom-1 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]"></span>
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
