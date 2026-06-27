"use client";

import { useEffect, useRef, useState, Children } from 'react';

export default function AestheticParagraphs({ children, className = "" }) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      // Lower threshold prevents flickering for very tall text blocks
      { threshold: 0.05, rootMargin: '-15% 0px -15% 0px' }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => { if (containerRef.current) observer.unobserve(containerRef.current); };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {Children.map(children, (child, i) => {
        if (!child) return null;
        return (
          <div
            key={i}
            style={{
              willChange: 'transform, opacity, filter',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
              filter: isVisible ? 'blur(0px)' : 'blur(12px)',
              transition: 'opacity 1s, transform 1s, filter 1s',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: `${i * 150}ms` // Smoother stagger
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}
