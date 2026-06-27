"use client";

import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';

export default function FeaturePalette({ 
  title, 
  subtitle, 
  description, 
  accentColor = "cyan", 
  mockupType = "video",
  reverse = false 
}) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      // Trigger when the element is within the middle 80% of the viewport
      { threshold: 0.15, rootMargin: '-10% 0px -10% 0px' }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => { if (containerRef.current) observer.unobserve(containerRef.current); };
  }, []);

  // Map accent colors to static Tailwind classes (prevents purges)
  const colorMap = {
    cyan: {
      border: "border-cyan-500/20",
      text: "text-cyan-400",
      glow: "shadow-[0_0_50px_rgba(6,182,212,0.1)]",
      gradient: "from-cyan-400 to-blue-600",
      mockupBorder: "border-cyan-500/50",
      mockupBg: "bg-cyan-500/10",
      mockupDot: "bg-cyan-400",
      mockupLine: "bg-cyan-500/50"
    },
    purple: {
      border: "border-purple-500/20",
      text: "text-purple-400",
      glow: "shadow-[0_0_50px_rgba(168,85,247,0.1)]",
      gradient: "from-purple-500 to-pink-500",
      mockupBorder: "border-purple-500/50",
      mockupBg: "bg-purple-500/10",
      mockupDot: "bg-purple-400",
      mockupLine: "bg-purple-500/50"
    },
    pink: {
      border: "border-pink-500/20",
      text: "text-pink-400",
      glow: "shadow-[0_0_50px_rgba(236,72,153,0.1)]",
      gradient: "from-pink-500 to-rose-500",
      mockupBorder: "border-pink-500/50",
      mockupBg: "bg-pink-500/10",
      mockupDot: "bg-pink-400",
      mockupLine: "bg-pink-500/50"
    },
    amber: {
      border: "border-amber-500/20",
      text: "text-amber-400",
      glow: "shadow-[0_0_50px_rgba(245,158,11,0.1)]",
      gradient: "from-amber-400 to-orange-500",
      mockupBorder: "border-amber-500/50",
      mockupBg: "bg-amber-500/10",
      mockupDot: "bg-amber-400",
      mockupLine: "bg-amber-500/50"
    }
  };

  const theme = colorMap[accentColor] || colorMap.cyan;

  return (
    <div 
      ref={containerRef}
      style={{ willChange: 'transform, opacity' }}
      className={`w-full max-w-6xl mx-auto rounded-[2.5rem] border ${theme.border} bg-white/[0.02] backdrop-blur-3xl shadow-2xl p-8 md:p-12 lg:p-20 transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${theme.glow} ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-[0.98] translate-y-12'}`}
    >
      <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-24 items-center`}>
        
        {/* Text Section */}
        <div className="flex-1 space-y-8">
          <div className="inline-block relative">
            <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} blur-xl opacity-20`}></div>
            <span className={`relative inline-flex items-center px-6 py-2.5 rounded-full border ${theme.border} ${theme.mockupBg} shadow-lg ${theme.text} text-xs font-black tracking-[0.25em] uppercase backdrop-blur-md`}>
              {subtitle}
            </span>
          </div>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-black font-heading text-white tracking-tighter leading-[1.1]">
            {title}
          </h3>
          <p className="text-xl md:text-2xl text-white/50 font-medium font-body leading-relaxed">
            {description}
          </p>
        </div>

        {/* Media Mockup Section */}
        <div className="flex-1 w-full aspect-square md:aspect-[4/3] lg:aspect-square rounded-[2rem] overflow-hidden relative border border-white/[0.05] group bg-black/60 shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col">
          
          {/* macOS Style Glass Header */}
          <div className="h-12 w-full border-b border-white/[0.05] bg-white/[0.02] backdrop-blur-md flex items-center px-6 gap-2 shrink-0 z-20">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/50"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/50"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]/50"></div>
          </div>

          <div className="relative flex-1 w-full overflow-hidden">
            {/* Animated gradient background bloom */}
            <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-700 blur-[100px]`}></div>
          
          {/* Video Player Mockup */}
          {mockupType === "video" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-white/20 transition-all duration-500 cursor-pointer">
                <Play className="text-white w-10 h-10 ml-2" fill="currentColor" />
              </div>
              <div className="mt-8 w-3/4 max-w-sm h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${theme.gradient} w-1/3 rounded-full animate-pulse`}></div>
              </div>
            </div>
          )}
          
          {/* Quiz UI Mockup */}
          {mockupType === "quiz" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-8">
              <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
                <div className="h-4 w-3/4 bg-white/20 rounded-full"></div>
                <div className="h-4 w-1/2 bg-white/20 rounded-full mb-8"></div>
                <div className="space-y-4 pt-4">
                  <div className={`h-14 w-full rounded-xl border border-white/10 flex items-center px-5 hover:bg-white/10 transition-colors cursor-pointer`}>
                    <div className="w-5 h-5 rounded-full border-2 border-white/30 mr-4"></div>
                    <div className="h-3 w-1/3 bg-white/20 rounded-full"></div>
                  </div>
                  <div className={`h-14 w-full rounded-xl border ${theme.mockupBorder} ${theme.mockupBg} flex items-center px-5 cursor-pointer shadow-[0_0_20px_rgba(0,0,0,0.2)]`}>
                    <div className={`w-5 h-5 rounded-full ${theme.mockupDot} mr-4 shadow-[0_0_10px_currentColor]`}></div>
                    <div className={`h-3 w-1/2 ${theme.mockupLine} rounded-full`}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* News UI Mockup */}
          {mockupType === "news" && (
            <div className="absolute inset-0 flex flex-col z-10 p-8 overflow-hidden gap-4 justify-center">
              <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl shrink-0 translate-y-4">
                <div className={`h-3 w-1/4 ${theme.mockupLine} rounded-full mb-4`}></div>
                <div className="h-4 w-3/4 bg-white/30 rounded-full mb-2"></div>
                <div className="h-4 w-1/2 bg-white/30 rounded-full"></div>
              </div>
              <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl shrink-0 translate-y-4 opacity-60">
                <div className={`h-3 w-1/4 ${theme.mockupLine} rounded-full mb-4`}></div>
                <div className="h-4 w-2/3 bg-white/30 rounded-full mb-2"></div>
                <div className="h-4 w-1/3 bg-white/30 rounded-full"></div>
              </div>
            </div>
          )}

          {/* AI Chat Mockup */}
          {mockupType === "ai" && (
            <div className="absolute inset-0 flex flex-col justify-end z-10 p-6 md:p-8">
              <div className="w-full flex justify-end mb-4">
                 <div className="bg-white/10 border border-white/20 rounded-2xl rounded-tr-sm p-5 w-2/3 backdrop-blur-md">
                   <div className="h-3 w-full bg-white/30 rounded-full mb-3"></div>
                   <div className="h-3 w-1/2 bg-white/30 rounded-full"></div>
                 </div>
              </div>
              <div className="w-full flex justify-start mb-6">
                 <div className={`bg-gradient-to-r ${theme.gradient} rounded-2xl rounded-tl-sm p-5 w-3/4 backdrop-blur-md shadow-lg`}>
                   <div className="h-3 w-full bg-white/40 rounded-full mb-3"></div>
                   <div className="h-3 w-5/6 bg-white/40 rounded-full mb-3"></div>
                   <div className="h-3 w-1/2 bg-white/40 rounded-full"></div>
                 </div>
              </div>
              <div className="w-full h-14 bg-white/5 border border-white/10 rounded-full flex items-center px-6">
                <div className="h-3 w-1/3 bg-white/20 rounded-full"></div>
                <div className={`ml-auto w-8 h-8 rounded-full bg-gradient-to-r ${theme.gradient} flex items-center justify-center`}></div>
              </div>
            </div>
          )}

          {/* Scrolling UI elements to simulate "scrolling story" background */}
          <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden mix-blend-overlay">
             <div className="flex flex-col gap-6 p-8 animate-marquee-vertical">
                <div className="w-2/3 h-8 bg-white/20 rounded-lg backdrop-blur-sm"></div>
                <div className="w-full h-32 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/5"></div>
                <div className="w-1/2 h-8 bg-white/20 rounded-lg backdrop-blur-sm"></div>
                <div className="w-full h-32 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/5"></div>
                <div className="w-3/4 h-8 bg-white/20 rounded-lg backdrop-blur-sm"></div>
                <div className="w-full h-32 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/5"></div>
             </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
