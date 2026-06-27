"use client";

import { useEffect, useRef, useState } from 'react';

export default function ParallaxSection({ children, speed = 0.3, className = "" }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      
      // Calculate how far into the viewport this element is
      const center = rect.top + rect.height / 2;
      const viewportCenter = windowH / 2;
      const distance = center - viewportCenter;
      
      setOffset(distance * speed * -1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div
        className="will-change-transform"
        style={{ transform: `translateY(${offset}px)` }}
      >
        {children}
      </div>
    </div>
  );
}
