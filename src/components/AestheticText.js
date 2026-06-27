"use client";

import { useEffect, useRef, useState } from 'react';

export default function AestheticText({ text, className = "" }) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  
  const words = text.split(' ');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => { if (containerRef.current) observer.unobserve(containerRef.current); };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`flex flex-wrap justify-center items-center ${className}`}
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block mr-[0.3em]"
          style={{ 
            opacity: isVisible ? 1 : 0, 
            transform: isVisible ? 'translateY(0) rotateX(0deg)' : 'translateY(25px) rotateX(45deg)',
            filter: isVisible ? 'drop-shadow(0 0 0 rgba(0,0,0,0))' : 'blur(12px)',
            transition: 'opacity 0.9s, transform 0.9s, filter 0.9s',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            transitionDelay: `${i * 40}ms`,
            transformOrigin: 'bottom center'
          }}
        >
          {word}
        </span>
      ))}
    </div>
  );
}
