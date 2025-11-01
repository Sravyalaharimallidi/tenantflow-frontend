import React, { useEffect, useRef } from 'react';

// Lightweight background animation using animateplus-like logic implemented directly
// This creates a canvas-based particle animation placed behind the UI. It's non-interactive
// and sized to the viewport. CSS ensures it stays behind content and doesn't intercept events.

const BackgroundAnimation = ({ className }) => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = Math.max(30, Math.round((width * height) / 80000));

    function rand(min, max) { return Math.random() * (max - min) + min; }

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: rand(0, width),
        y: rand(0, height),
        r: rand(1, 3),
        vx: rand(-0.2, 0.2),
        vy: rand(-0.1, 0.1),
        hue: rand(200, 260),
        alpha: rand(0.03, 0.12)
      });
    }

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);

    function draw() {
      ctx.clearRect(0, 0, width, height);

      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -50) p.x = width + 50;
        if (p.x > width + 50) p.x = -50;
        if (p.y < -50) p.y = height + 50;
        if (p.y > height + 50) p.y = -50;

        ctx.beginPath();
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 12);
        g.addColorStop(0, `hsla(${p.hue}, 70%, 60%, ${p.alpha})`);
        g.addColorStop(1, `hsla(${p.hue}, 70%, 60%, 0)`);
        ctx.fillStyle = g;
        ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 -z-10 w-full h-full ${className || ''}`}
      aria-hidden="true"
    />
  );
};

export default BackgroundAnimation;
