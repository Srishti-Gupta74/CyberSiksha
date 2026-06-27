"use client";

import { useEffect, useRef, useState } from 'react';

export default function DynamicBackground() {
  const cursorRef = useRef(null);
  const spotlightRef = useRef(null);
  const [isHoveringLink, setIsHoveringLink] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX: x, clientY: y } = e;

      // 100% Instantaneous Hardware Accelerated Transform (Zero React Render Lag)
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }
      if (spotlightRef.current) {
        spotlightRef.current.style.background = `radial-gradient(650px circle at ${x}px ${y}px, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01), transparent 80%)`;
      }

      // Check interactive hover state
      const target = e.target;
      const isInteractive = target?.closest?.('button, a, input, [role="button"], .cursor-pointer, li');
      setIsHoveringLink(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* 1. Ambient Animated Shifting Background Orbs (Aesthetic Monochromatic) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
        <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] rounded-full bg-gradient-to-br from-neutral-800/20 via-neutral-900/10 to-transparent blur-[110px] animate-pulse"></div>
        <div className="absolute top-[25%] right-[-5%] w-[650px] h-[650px] rounded-full bg-gradient-to-bl from-neutral-700/10 via-neutral-900/10 to-transparent blur-[130px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-neutral-800/15 via-black/10 to-transparent blur-[120px] animate-pulse"></div>

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_60%,transparent_100%)] opacity-50"></div>
      </div>

      {/* 2. Instantaneous Zero-Lag Cursor Spotlight Aura */}
      <div 
        ref={spotlightRef}
        className="pointer-events-none fixed inset-0 z-0 hidden sm:block"
      />

      {/* 3. 100% Instantaneous Hardware-Accelerated Custom Cursor Orb (Zero Latency Tracking) */}
      <div
        ref={cursorRef}
        className={`pointer-events-none fixed top-0 left-0 z-[9999] rounded-full hidden md:flex items-center justify-center transition-[width,height,background-color,border-color,box-shadow] duration-200 ease-out ${
          isHoveringLink 
            ? 'w-12 h-12 bg-white/10 border-2 border-white shadow-[0_0_25px_rgba(255,255,255,0.5)]' 
            : 'w-7 h-7 border border-white/40 bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.2)]'
        }`}
        style={{ willChange: 'transform' }}
      >
        <div className={`rounded-full transition-all duration-200 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] ${isHoveringLink ? 'w-2.5 h-2.5 animate-ping' : 'w-1.5 h-1.5'}`}></div>
      </div>
    </>
  );
}
