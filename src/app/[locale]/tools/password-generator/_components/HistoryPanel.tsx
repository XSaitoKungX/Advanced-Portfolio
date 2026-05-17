"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiCopy, FiCheck, FiTrash2 } from "react-icons/fi";
import type { HistoryEntry } from "../_lib/types";

interface HistoryPanelProps {
  history: HistoryEntry[];
  onClear: () => void;
}

export default function HistoryPanel({ history, onClear }: HistoryPanelProps) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const copyEntry = async (pw: string, idx: number) => {
    await navigator.clipboard.writeText(pw);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1800);
  };

  if (history.length === 0) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">History</p>
        <button
          onClick={onClear}
          className="flex items-center gap-1 text-[11px] text-white/25 hover:text-red-400 transition-colors"
        >
          <FiTrash2 className="w-3 h-3" /> Clear
        </button>
      </div>
      <div className="space-y-1.5">
        {history.map((entry, i) => (
          <motion.div
            key={entry.ts}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/3 border border-white/6 group hover:border-white/10 transition-colors"
          >
            <span className="text-[9px] font-semibold text-white/20 uppercase shrink-0 w-16 truncate">
              {entry.label ?? entry.mode}
            </span>
            <span className="flex-1 font-mono text-xs text-white/45 truncate">{entry.pw}</span>
            <span className="text-[10px] text-white/20 shrink-0">
              {new Date(entry.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
            <button
              onClick={() => copyEntry(entry.pw, i)}
              className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            >
              {copiedIdx === i
                ? <FiCheck className="w-3.5 h-3.5 text-green-400" />
                : <FiCopy className="w-3.5 h-3.5 text-white/35 hover:text-white" />}
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
