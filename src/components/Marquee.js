"use client";

export default function Marquee({ items, speed = 30, className = "", reverse = false }) {
  // Duplicate items for seamless loop
  const doubledItems = [...items, ...items];

  return (
    <div className={`overflow-hidden relative ${className}`}>
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#050505] to-transparent pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none"></div>
      
      <div 
        className={`flex gap-8 items-center whitespace-nowrap ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {doubledItems.map((item, i) => (
          <div
            key={i}
            className="flex-shrink-0 px-6 py-3 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm text-sm font-semibold text-white/60 hover:text-white/90 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300 cursor-default select-none"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
