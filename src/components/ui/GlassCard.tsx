"use client";

import { forwardRef } from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  glowColor?: string;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className = "", hover = true, glow = false, glowColor = "#7C3AED" }, ref) => {
    const base =
      "relative bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl overflow-hidden";
    const hoverClass = hover
      ? "transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.15]"
      : "";

    return (
      <div ref={ref} className={`${base} ${hoverClass} ${className}`}>
        {glow && (
          <div
            className="absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
            style={{
              background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor}20, transparent 40%)`,
            }}
          />
        )}
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export default GlassCard;
