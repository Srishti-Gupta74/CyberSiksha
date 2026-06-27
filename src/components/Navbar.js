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
  const [hoveredIndex, setHoveredIndex] = useState(null);

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
    { name: 'Family', path: '/family', icon: <Users size={24} className="text-cyan-300" /> },
  ];

  return (
    <>
      {/* Vertical Mac Dock on Side for Desktop / Horizontal Bottom Dock for Mobile */}
      <nav className="fixed max-sm:bottom-3 max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:w-[98%] sm:left-3 lg:left-5 sm:top-1/2 sm:-translate-y-1/2 z-50 animate-fade-in pointer-events-auto">
        <div 
          className="bg-black/85 backdrop-blur-2xl rounded-[2rem] mx-auto flex max-sm:flex-row sm:flex-col justify-between items-center max-sm:px-3 max-sm:py-3 sm:py-4 sm:px-1.5 lg:px-2 shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_40px_rgba(255,255,255,0.15)] border border-white/20 max-sm:overflow-x-auto transition-all duration-300"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div className="flex max-sm:flex-row sm:flex-col w-full justify-between gap-1.5 sm:gap-4 lg:gap-5 items-center">
            {navItems.map((item, index) => {
              const isActive = pathname === item.path;
              
              // Calculate Mac Dock Magnification physics
              const distance = hoveredIndex !== null ? Math.abs(hoveredIndex - index) : null;
              const isHovered = distance === 0;
              const isAdjacent = distance === 1;
              
              // Dynamic scale and shift based on hover distance
              let scaleStyle = "scale-100";
              let zIndex = "z-10";
              let bgStyle = "bg-transparent";
              
              if (isHovered) {
                scaleStyle = "scale-115 sm:scale-135 max-sm:-translate-y-2 sm:translate-x-2";
                zIndex = "z-50";
                bgStyle = "bg-white/15 border border-white/40 shadow-[0_0_25px_rgba(255,255,255,0.3)]";
              } else if (isAdjacent) {
                scaleStyle = "scale-105 sm:scale-115 max-sm:-translate-y-1 sm:translate-x-1";
                zIndex = "z-30";
                bgStyle = "bg-white/5 border border-white/10";
              } else if (isActive) {
                bgStyle = "bg-gradient-to-r from-purple-600/60 to-slate-900 border-2 border-white/80 shadow-[0_0_25px_rgba(168,85,247,0.6)]";
              }

              return (
                <div key={item.path} className={`relative group ${zIndex}`} onMouseEnter={() => setHoveredIndex(index)}>
                  <Link
                    href={item.path}
                    className={`relative flex flex-col items-center justify-center p-2 sm:px-2 sm:py-1.5 rounded-xl transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] max-sm:origin-bottom sm:origin-left ${scaleStyle} ${bgStyle} ${
                      isActive ? 'text-white font-black' : isHovered ? 'text-white font-bold' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <div className="transition-transform duration-300 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-black tracking-wider uppercase mt-1 block font-sans whitespace-nowrap drop-shadow">
                      {item.name}
                    </span>
                    {isActive && (
                      <span className="absolute max-sm:-bottom-1.5 max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:w-2 max-sm:h-2 sm:left-0 sm:top-1/2 sm:-translate-y-1/2 sm:w-1.5 sm:h-6 rounded-full sm:rounded-r-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></span>
                    )}
                  </Link>

                  {/* MacBook Floating Tooltip appearing on the right side during hover */}
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3.5 py-2 rounded-xl bg-slate-900/95 backdrop-blur-xl border border-white/20 text-white text-xs font-black tracking-wider uppercase opacity-0 -translate-x-3 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 z-50 whitespace-nowrap shadow-2xl hidden sm:flex items-center gap-2">
                    {item.name}
                    <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 border-[6px] border-transparent border-r-slate-900/95"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
