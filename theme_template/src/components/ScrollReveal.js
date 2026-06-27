"use client";

import { useEffect, useRef, useState } from 'react';

export default function ScrollReveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { 
        threshold: 0.1, 
        rootMargin: "0px 0px -40px 0px" // Trigger slightly before full bottom
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-[800ms] cubic-bezier(0.16, 1, 0.3, 1) ${
        isVisible 
          ? "opacity-100 translate-y-0 blur-none scale-100" 
          : "opacity-0 translate-y-12 blur-[4px] scale-[0.97]"
      } ${className}`}
    >
      {children}
    </div>
  );
}
