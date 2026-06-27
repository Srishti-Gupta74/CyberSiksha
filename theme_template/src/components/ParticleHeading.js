"use client";

import { useEffect, useRef, useState } from 'react';

export default function ParticleHeading({ 
  text = "Why CyberSiksha", 
  className = "" 
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDissolving, setIsDissolving] = useState(false);
  
  // Animation state refs to avoid re-renders
  const animationRef = useRef({
    particles: [],
    spheres: [],
    width: 0,
    height: 0,
    ctx: null,
    dissolveProgress: 0,
    isDissolving: false
  });

  // Setup
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    animationRef.current.ctx = ctx;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = 400 * dpr; // fixed height for the effect
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `400px`;
      
      animationRef.current.width = canvas.width;
      animationRef.current.height = canvas.height;
      ctx.scale(dpr, dpr);
      
      // Re-init scene on resize only if not already dissolving
      if (!animationRef.current.isDissolving) {
        initScene(rect.width, 400);
      }
    };

    window.addEventListener('resize', resize);
    
    // We need to wait for fonts to be ready before drawing text to canvas
    document.fonts.ready.then(() => {
      resize();
    });
    // Fallback if fonts.ready fails or takes too long
    setTimeout(resize, 500);

    let frameId;
    const render = () => {
      drawScene(ctx, animationRef.current.width / (window.devicePixelRatio || 1), 400);
      frameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameId);
    };
  }, [text]);

  const initScene = (w, h) => {
    const state = animationRef.current;
    state.particles = [];
    state.spheres = [];
    state.dissolveProgress = 0;
    state.isDissolving = false;
    setIsDissolving(false);
    
    // Create floating spheres (cyan, magenta, gold)
    const colors = ['#22d3ee', '#ec4899', '#facc15']; 
    for (let i = 0; i < 12; i++) {
      state.spheres.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 40 + 10,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        color: colors[i % colors.length]
      });
    }

    createParticlesFromText(w, h);
  };

  const createParticlesFromText = (w, h) => {
    const state = animationRef.current;
    const offCanvas = document.createElement('canvas');
    offCanvas.width = w;
    offCanvas.height = h;
    const octx = offCanvas.getContext('2d', { willReadFrequently: true });
    
    // Calculate responsive font size
    const fontSize = w < 600 ? 50 : (w < 900 ? 80 : 100);
    octx.font = `900 ${fontSize}px system-ui, -apple-system, sans-serif`;
    octx.textAlign = 'center';
    octx.textBaseline = 'middle';
    
    const textX = w / 2;
    const textY = h / 2;

    // 1. Draw thicker, darker yellow blur/stroke for glow
    octx.strokeStyle = '#a16207'; // dark yellow/orange
    octx.lineWidth = 6;
    octx.strokeText(text, textX, textY);
    
    // 2. Draw thin, bright yellow neon line inside
    octx.strokeStyle = '#fde047'; 
    octx.lineWidth = 2;
    octx.strokeText(text, textX, textY);

    // 3. Draw solid white body
    octx.fillStyle = '#ffffff';
    octx.fillText(text, textX, textY);

    // Extract pixels
    const imgData = octx.getImageData(0, 0, w, h);
    const data = imgData.data;
    
    // Gap determines particle density (higher = fewer particles)
    const gap = 3; 
    
    for (let y = 0; y < h; y += gap) {
      for (let x = 0; x < w; x += gap) {
        const index = (y * w + x) * 4;
        const alpha = data[index + 3];
        
        if (alpha > 50) {
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          
          // Heuristic to check if this is an outline pixel or fill pixel
          const isOutline = (r > 150 && g > 150 && b < 150);
          
          state.particles.push({
            x: x,
            y: y,
            baseX: x,
            baseY: y,
            vx: (Math.random() - 0.5) * 3,
            vy: Math.random() * -4 - 1, // Base upward velocity
            color: isOutline ? '#fde047' : '#ffffff',
            isOutline,
            size: isOutline ? Math.random() * 2 + 1 : Math.random() * 2.5 + 0.5,
            alpha: 1,
            delay: Math.random() * 120, // Staggered start delay
            active: false
          });
        }
      }
    }
  };

  const drawScene = (ctx, w, h) => {
    const state = animationRef.current;
    
    // Clear canvas
    ctx.clearRect(0, 0, w, h);
    
    // 1. Draw Dark Hexagonal Background
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    const hexSize = 25;
    const hexHeight = hexSize * Math.sqrt(3);
    const hexWidth = hexSize * 2;
    
    for (let y = -hexHeight; y < h + hexHeight; y += hexHeight) {
      for (let x = -hexWidth; x < w + hexWidth; x += hexWidth * 0.75) {
        let offsetY = (Math.round(x / (hexWidth * 0.75)) % 2 === 0) ? 0 : hexHeight / 2;
        drawHexagon(ctx, x, y + offsetY, hexSize);
      }
    }

    // 2. Draw Floating Spheres
    ctx.globalCompositeOperation = 'screen';
    state.spheres.forEach(s => {
      s.x += s.vx;
      s.y += s.vy;
      
      // Wrap around edges softly
      if (s.x < -100) s.x = w + 100;
      if (s.x > w + 100) s.x = -100;
      if (s.y < -100) s.y = h + 100;
      if (s.y > h + 100) s.y = -100;

      const gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r);
      const c = hexToRgb(s.color);
      gradient.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, 0.25)`);
      gradient.addColorStop(1, `rgba(${c.r}, ${c.g}, ${c.b}, 0)`);
      
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    });
    ctx.globalCompositeOperation = 'source-over';

    // 3. Update and Draw Particles
    if (state.isDissolving) {
      state.dissolveProgress++;
      
      // Optional: Add a gentle camera pan effect by translating context slightly based on progress
      ctx.save();
      const panY = Math.min(state.dissolveProgress * 0.5, 100);
      ctx.translate(0, panY * 0.2);
    } else {
      ctx.save();
    }

    // Performance optimization: only apply shadow glow if few particles, 
    // or batch them by color to reduce context state changes.
    // We will apply a global shadow for neon effect.
    ctx.shadowBlur = 8;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';

    // We can iterate backwards to remove dead particles, but for simplicity we just skip drawing them
    for (let i = 0; i < state.particles.length; i++) {
      const p = state.particles[i];
      
      if (state.isDissolving && state.dissolveProgress > p.delay) {
        p.active = true;
      }

      if (p.active) {
        // Anti-gravity turbulence and rising
        p.vx += (Math.random() - 0.5) * 0.3;
        p.vy -= Math.random() * 0.08; // accelerating upwards
        
        // Swirl effect based on x position
        p.vx += Math.sin(p.y * 0.02) * 0.2;
        
        p.x += p.vx;
        p.y += p.vy;
        
        // Dissolve (fade out)
        p.alpha -= Math.random() * 0.008;
      }

      if (p.alpha > 0) {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        
        if (p.isOutline) {
          // Render outlines as tiny strokes/wires
          ctx.fillRect(p.x, p.y, p.size * 1.5, p.size * 0.5);
        } else {
          // Render fill as dots
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }
      }
    }
    
    ctx.restore();
  };

  const drawHexagon = (ctx, x, y, size) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const hx = x + size * Math.cos(angle);
      const hy = y + size * Math.sin(angle);
      if (i === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
    ctx.stroke();
  };

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
  };

  const triggerDissolve = () => {
    if (!isDissolving) {
      setIsDissolving(true);
      animationRef.current.isDissolving = true;
      animationRef.current.dissolveProgress = 0;
    }
  };

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full overflow-hidden flex items-center justify-center cursor-crosshair group ${className}`}
      onMouseEnter={triggerDissolve}
      onClick={triggerDissolve}
    >
      <canvas 
        ref={canvasRef} 
        className="block relative z-10"
      />
      
      {/* Invisible placeholder for screen readers & SEO */}
      <h2 className="sr-only">{text}</h2>
      
      {/* Reset button that appears after dissolve */}
      <div 
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 transition-all duration-1000 z-20 ${isDissolving ? 'opacity-100 pointer-events-auto delay-1000' : 'opacity-0 pointer-events-none'}`}
      >
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (animationRef.current.width) {
              initScene(animationRef.current.width / (window.devicePixelRatio || 1), 400);
            }
          }}
          className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full text-xs font-bold text-white/50 hover:text-white tracking-widest uppercase backdrop-blur-md transition-colors"
        >
          Reassemble Data
        </button>
      </div>
    </div>
  );
}
