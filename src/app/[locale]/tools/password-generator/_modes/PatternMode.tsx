"use client";

import { useState, forwardRef, useImperativeHandle, useEffect, useRef } from "react";
import { pick } from "../_lib/crypto";
import type { PatternOpts, ModeHandle, ModeProps } from "../_lib/types";

const LOWER   = "abcdefghijklmnopqrstuvwxyz";
const UPPER   = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS  = "0123456789";
const SYM     = "!@#$%^&*()-_=+[]{}|;:,.<>?";
const ALNUM   = LOWER + UPPER + DIGITS;
const ALL     = LOWER + UPPER + DIGITS + SYM;

export function genPattern(o: PatternOpts): string {
  if (!o.pattern) return "";
  return o.pattern
    .split("")
    .map(c => {
      switch (c) {
        case "A": return pick(UPPER.split(""));
        case "a": return pick(LOWER.split(""));
        case "0": return pick(DIGITS.split(""));
        case "#": return pick(SYM.split(""));
        case "?": return pick(ALNUM.split(""));
        case "*": return pick(ALL.split(""));
        default:  return c;
      }
    })
    .join("");
}

const PRESETS = ["Aaaa0000", "AA-0000-aa", "aaaa-aaaa-0000", "######"] as const;

const LEGEND = [
  { token: "A", desc: "Uppercase letter" },
  { token: "a", desc: "Lowercase letter" },
  { token: "0", desc: "Digit" },
  { token: "#", desc: "Symbol" },
  { token: "?", desc: "Any alphanumeric" },
  { token: "*", desc: "Any character" },
];

const DEFAULT: PatternOpts = { pattern: "Aaaa-0000-####" };

const PatternMode = forwardRef<ModeHandle, ModeProps>(function PatternMode({ onGenerate }, ref) {
  const [opts, setOpts] = useState<PatternOpts>(DEFAULT);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useImperativeHandle(ref, () => ({
    generate() {
      if (opts.pattern) onGenerate(genPattern(opts));
    },
  }));

  // Auto-regenerate on pattern change (debounced 300ms)
  useEffect(() => {
    if (!opts.pattern) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onGenerate(genPattern(opts));
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [onGenerate, opts]);

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Options</p>
      <div>
        <p className="text-sm text-white/60 mb-2">Your pattern</p>
        <input
          type="text"
          value={opts.pattern}
          onChange={e => setOpts({ pattern: e.target.value })}
          placeholder="e.g. Aaaa-0000-####"
          className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white text-sm font-mono placeholder-white/20 focus:outline-none focus:border-violet-500/40 transition-colors"
        />
        <p className="text-[11px] text-white/25 mt-1.5">
          {opts.pattern.length} chars → {opts.pattern ? genPattern(opts).length : 0} chars output
        </p>
      </div>
      <div>
        <p className="text-sm text-white/60 mb-2">Quick presets</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (
            <button key={p}
              onClick={() => setOpts({ pattern: p })}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                opts.pattern === p
                  ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                  : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
              }`}>
              {p}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-xl bg-white/3 border border-white/8 overflow-hidden">
        <p className="text-[11px] font-semibold text-white/30 uppercase tracking-wider px-3 pt-3 pb-2">Pattern legend</p>
        <div className="divide-y divide-white/5">
          {LEGEND.map(({ token, desc }) => (
            <div key={token} className="flex items-center gap-3 px-3 py-2">
              <span className="font-mono text-sm font-bold text-violet-400 w-4">{token}</span>
              <span className="text-xs text-white/40">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default PatternMode;
