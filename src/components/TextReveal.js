"use client";

import { useEffect, useRef } from 'react';

export default function TextReveal({ text, className = "" }) {
  const containerRef = useRef(null);
  const wordRefs = useRef([]);
  const words = text.split(' ');

  useEffect(() => {
    let animationFrameId = null;

    const handleScroll = () => {
      if (!containerRef.current || !wordRefs.current.length) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      
      // Calculate scroll progress through the element
      // 0 = element just entered bottom of viewport, 1 = element has passed top
      const scrollProgress = Math.max(0, Math.min(1, 
        (windowH - rect.top) / (windowH + rect.height)
      ));
      
      // Batch DOM updates directly for 60fps performance (bypasses React renders)
      wordRefs.current.forEach((span, i) => {
        if (!span) return;
        const wordProgress = i / words.length;
        // Each word activates based on scroll progress with stagger
        const activation = (scrollProgress - wordProgress * 0.6) / 0.4;
        const targetOpacity = Math.max(0.15, Math.min(1, activation));
        
        // Direct DOM mutation is vastly faster for scroll events
        span.style.opacity = targetOpacity;
      });
    };

    const onScroll = () => {
      // Use requestAnimationFrame to throttle to monitor refresh rate
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [words.length]);

  return (
    <div ref={containerRef} className={`${className}`}>
      {words.map((word, i) => (
        <span
          key={i}
          ref={(el) => (wordRefs.current[i] = el)}
          style={{ opacity: 0.15, transition: 'opacity 0.1s ease-out' }}
        >
          {word}{' '}
        </span>
      ))}
    </div>
  );
}
