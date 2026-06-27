"use client";

import { useEffect, useRef, useState } from 'react';

export default function CinematicHeading({ text, className = "" }) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const letters = text.split('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          // Allow it to trigger again when scrolling back up/down for presentation purposes
          setIsVisible(false);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  return (
    <h2 
      ref={containerRef} 
      className={`flex justify-center flex-wrap cursor-default select-none ${className}`}
    >
      {letters.map((char, i) => {
        // Skip animating spaces
        if (char === ' ') {
          return <span key={i} className="inline-block w-[0.2em]">&nbsp;</span>;
        }

        return (
          <div
            key={i}
            className="inline-block"
            style={{ 
              opacity: isVisible ? 1 : 0.0, 
              transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)', 
              filter: isVisible ? 'drop-shadow(0 0 0 rgba(0,0,0,0))' : 'blur(8px)',
              transition: 'opacity 0.7s, transform 0.7s, filter 0.7s',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)', 
              transitionDelay: `${i * 20}ms`
              // Removed will-change to prevent GPU subpixel antialiasing loss
            }}
          >
            <span 
              className={`inline-block whitespace-pre text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 drop-shadow-[0_4px_24px_rgba(255,255,255,0.25)] ${isVisible ? 'cinematic-float' : ''}`}
              style={{
                animationDelay: `${0.8 + (i * 0.1)}s`
              }}
            >
              {char}
            </span>
          </div>
        );
      })}
    </h2>
  );
}
