"use client";

import { useEffect, useRef, useState } from 'react';

export default function AnimatedCounter({ target, suffix = "", prefix = "", duration = 2000, className = "" }) {
  const ref = useRef(null);
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    let animationFrame;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Restart animation from 0
          setCount(0);
          
          const startTime = performance.now();
          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Eased progress (ease-out cubic)
            const eased = 1 - Math.pow(1 - progress, 3);
            
            setCount(Math.floor(eased * target));
            
            if (progress < 1) {
              animationFrame = requestAnimationFrame(animate);
            } else {
              setCount(target);
            }
          };
          
          animationFrame = requestAnimationFrame(animate);
        } else {
          // Stop animation if it leaves view and reset to 0
          if (animationFrame) cancelAnimationFrame(animationFrame);
          setCount(0);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, [target, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}
