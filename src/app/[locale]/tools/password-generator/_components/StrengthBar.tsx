"use client";

import { motion } from "framer-motion";

interface StrengthBarProps {
  pct: number;
  color: string;
  label: string;
  entropyBits: number;
}

export default function StrengthBar({ pct, color, label, entropyBits }: StrengthBarProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-white/35">Strength</span>
        <div className="flex items-center gap-3">
          {entropyBits > 0 && (
            <span className="text-[11px] text-white/30 font-mono">~{entropyBits} bits</span>
          )}
          <motion.span
            key={label}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-semibold"
            style={{ color }}
          >
            {label}
          </motion.span>
        </div>
      </div>
      <div className="w-full h-1.5 rounded-full bg-white/8 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
