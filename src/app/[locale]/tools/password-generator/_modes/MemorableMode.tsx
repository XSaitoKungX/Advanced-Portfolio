"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import { randInt, pick } from "../_lib/crypto";
import { ADJECTIVES, NOUNS, VERBS } from "../_lib/wordlists";
import type { MemorableOpts, ModeHandle, ModeProps } from "../_lib/types";

export function genMemorable(o: MemorableOpts): string {
  const cap = (s: string) => o.capitalize ? s[0].toUpperCase() + s.slice(1) : s;
  const num = String(randInt(o.numberRange)).padStart(String(o.numberRange - 1).length, "0");

  const parts: string[] =
    o.pattern === "adj-noun-verb-number"
      ? [cap(pick(ADJECTIVES)), cap(pick(NOUNS)), cap(pick(VERBS)), num]
      : [cap(pick(ADJECTIVES)), cap(pick(NOUNS)), num];

  return parts.join(o.separator);
}

const PRESET_SEPS = ["-", ".", "_", " "] as const;

const DEFAULT: MemorableOpts = {
  pattern: "adj-noun-verb-number", capitalize: true, separator: "-", numberRange: 100,
};

const MemorableMode = forwardRef<ModeHandle, ModeProps>(function MemorableMode({ onGenerate }, ref) {
  const [opts, setOpts] = useState<MemorableOpts>(DEFAULT);
  const [customSep, setCustomSep] = useState("");
  const set = (patch: Partial<MemorableOpts>) => setOpts(o => ({ ...o, ...patch }));

  useImperativeHandle(ref, () => ({
    generate() {
      onGenerate(genMemorable(opts));
    },
  }));

  const handleCustomSep = (v: string) => {
    const trimmed = v.slice(0, 3);
    setCustomSep(trimmed);
    if (trimmed) set({ separator: trimmed });
  };

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Options</p>
      <div>
        <p className="text-sm text-white/60 mb-2">Pattern</p>
        <div className="flex flex-col gap-2">
          {([
            { id: "adj-noun-verb-number", label: "Adj-Noun-Verb-Number", example: "BlueTiger-Runs42" },
            { id: "adj-noun-number",      label: "Adj-Noun-Number",      example: "CalmRiver-07" },
          ] as const).map(p => (
            <button key={p.id}
              onClick={() => set({ pattern: p.id })}
              className={`flex flex-col items-start px-3 py-2.5 rounded-xl border text-sm transition-all ${
                opts.pattern === p.id
                  ? "bg-violet-500/20 border-violet-500/40"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}>
              <span className={`font-medium ${opts.pattern === p.id ? "text-violet-300" : "text-white/50"}`}>{p.label}</span>
              <span className="font-mono text-[11px] text-white/25 mt-0.5">{p.example}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm text-white/60 mb-2">Separator</p>
        <div className="flex gap-2 flex-wrap mb-2">
          {PRESET_SEPS.map(sep => (
            <button key={sep}
              onClick={() => { set({ separator: sep }); setCustomSep(""); }}
              className={`w-9 h-9 rounded-lg border text-sm font-mono transition-all ${
                opts.separator === sep && !customSep
                  ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                  : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
              }`}>
              {sep === " " ? "·" : sep}
            </button>
          ))}
          <input
            type="text"
            placeholder="?"
            value={customSep}
            onChange={e => handleCustomSep(e.target.value)}
            maxLength={3}
            className={`w-16 px-2 rounded-lg border text-sm font-mono text-center bg-white/5 text-white placeholder-white/20 focus:outline-none transition-colors ${
              customSep ? "border-violet-500/40" : "border-white/10 focus:border-white/20"
            }`}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => set({ capitalize: !opts.capitalize })}
          className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${
            opts.capitalize
              ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
              : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
          }`}>
          Capitalize
        </button>
      </div>
      <div>
        <p className="text-sm text-white/60 mb-2">Number range</p>
        <div className="flex gap-2">
          {([10, 100, 1000] as const).map(n => (
            <button key={n}
              onClick={() => set({ numberRange: n })}
              className={`flex-1 py-2 rounded-lg border text-sm font-mono transition-all ${
                opts.numberRange === n
                  ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                  : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
              }`}>
              0–{n - 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

export default MemorableMode;
