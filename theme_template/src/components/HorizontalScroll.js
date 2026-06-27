"use client";

import { useEffect, useRef } from 'react';

export default function HorizontalScroll({ children, className = "" }) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    let animationFrameId = null;

    const handleScroll = () => {
      if (!containerRef.current || !trackRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const windowH = window.innerHeight;

      // When the sticky container is in view, map vertical scroll to horizontal progress
      const stickyStart = rect.top;
      const scrollableHeight = container.offsetHeight - windowH;

      if (stickyStart <= 0 && scrollableHeight > 0) {
        const progress = Math.min(1, Math.max(0, -stickyStart / scrollableHeight));
        const track = trackRef.current;
        const maxScroll = track.scrollWidth - window.innerWidth;
        
        // Use direct DOM mutation for 60fps performance without React re-renders
        track.style.transform = `translate3d(-${progress * maxScroll}px, 0, 0)`;
      } else if (stickyStart > 0) {
        trackRef.current.style.transform = `translate3d(0px, 0, 0)`;
      } else if (-stickyStart > scrollableHeight) {
        const track = trackRef.current;
        const maxScroll = track.scrollWidth - window.innerWidth;
        track.style.transform = `translate3d(-${maxScroll}px, 0, 0)`;
      }
    };

    const onScroll = () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Run once on mount and resize to ensure correct initial layout
    handleScroll();
    window.addEventListener('resize', onScroll);
    
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ height: '250vh' }}
    >
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
        <div
          ref={trackRef}
          className="flex items-stretch gap-6 md:gap-10 px-4 md:px-12 w-max will-change-transform"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
