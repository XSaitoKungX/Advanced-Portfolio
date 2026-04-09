"use client";

import { useEffect, useRef } from "react";

function StarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const STAR_COUNT = 120;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.2 + 0.2,
      alpha: Math.random() * 0.6 + 0.1,
      speed: Math.random() * 0.3 + 0.05,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));

    let t = 0;
    const draw = () => {
      t += 0.008;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const s of stars) {
        const twinkle = Math.sin(t * s.speed * 6 + s.twinkleOffset) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.alpha * twinkle})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.6 }}
    />
  );
}

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-background" />

      <StarCanvas />

      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(ellipse 80% 60% at 50% -20%, rgba(124, 58, 237, 0.18) 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(ellipse 50% 35% at 85% 85%, rgba(79, 70, 229, 0.10) 0%, transparent 60%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(ellipse 40% 30% at 10% 60%, rgba(124, 58, 237, 0.06) 0%, transparent 60%)`,
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
        }}
      />

      <div
        className="absolute left-0 right-0 h-px pointer-events-none animate-scan"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.15), rgba(167,139,250,0.08), rgba(124,58,237,0.15), transparent)",
          top: 0,
        }}
      />

      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#7C3AED]/4 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: "10s" }} />
      <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-[#4F46E5]/5 rounded-full blur-[60px] animate-pulse" style={{ animationDuration: "14s", animationDelay: "5s" }} />
    </div>
  );
}
