"use client";

import { motion } from "framer-motion";

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  desc?: string;
}

export default function Toggle({ label, checked, onChange, desc }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border transition-all duration-200 text-left group ${
        checked ? "bg-violet-500/10 border-violet-500/30" : "bg-white/3 border-white/8 hover:border-white/15"
      }`}
    >
      <div>
        <p className={`text-sm font-medium transition-colors ${checked ? "text-white" : "text-white/55 group-hover:text-white/80"}`}>
          {label}
        </p>
        {desc && <p className="text-[11px] text-white/25 mt-0.5 font-mono">{desc}</p>}
      </div>
      <div className={`w-9 h-5 rounded-full relative shrink-0 transition-colors duration-200 ${checked ? "bg-violet-500" : "bg-white/15"}`}>
        <motion.div
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
          animate={{ left: checked ? "calc(100% - 18px)" : "2px" }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
    </button>
  );
}
