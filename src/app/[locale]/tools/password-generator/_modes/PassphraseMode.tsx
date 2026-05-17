"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import { rand32, pick } from "../_lib/crypto";
import { EFF_WORDS } from "../_lib/wordlists";
import Toggle from "../_components/Toggle";
import Slider from "../_components/Slider";
import type { PassphraseOpts, ModeHandle, ModeProps } from "../_lib/types";

export function genPassphrase(o: PassphraseOpts): string {
  const ws = Array.from({ length: o.words }, () => {
    const w = pick(EFF_WORDS);
    return o.capitalize ? w[0].toUpperCase() + w.slice(1) : w;
  });
  if (!o.addNumber) return ws.join(o.separator);

  const num = String(rand32(1)[0] % 100).padStart(2, "0");
  if (o.numberPosition === "prefix") return num + o.separator + ws.join(o.separator);
  if (o.numberPosition === "random") {
    const pos = rand32(1)[0] % (ws.length + 1);
    ws.splice(pos, 0, num);
    return ws.join(o.separator);
  }
  // suffix (default)
  return ws.join(o.separator) + o.separator + num;
}

const PRESET_SEPS = ["-", ".", "_", " ", "#", "~"] as const;

const DEFAULT: PassphraseOpts = {
  words: 4, separator: "-", capitalize: true, addNumber: true, numberPosition: "suffix",
};

const PassphraseMode = forwardRef<ModeHandle, ModeProps>(function PassphraseMode({ onGenerate }, ref) {
  const [opts, setOpts] = useState<PassphraseOpts>(DEFAULT);
  const [customSep, setCustomSep] = useState("");
  const set = (patch: Partial<PassphraseOpts>) => setOpts(o => ({ ...o, ...patch }));

  useImperativeHandle(ref, () => ({
    generate() {
      onGenerate(genPassphrase(opts));
    },
  }));

  const handleCustomSep = (v: string) => {
    const trimmed = v.slice(0, 5);
    setCustomSep(trimmed);
    if (trimmed) set({ separator: trimmed });
  };

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Options</p>
      <Slider label="Word count" value={opts.words} min={2} max={10} onChange={v => set({ words: v })} />
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
        </div>
        <input
          type="text"
          placeholder="Custom (max 5 chars)"
          value={customSep}
          onChange={e => handleCustomSep(e.target.value)}
          maxLength={5}
          className={`w-full px-3 py-2 rounded-lg border text-sm font-mono bg-white/5 text-white placeholder-white/20 focus:outline-none transition-colors ${
            customSep ? "border-violet-500/40" : "border-white/10 focus:border-white/20"
          }`}
        />
      </div>
      <Toggle label="Capitalize words" checked={opts.capitalize} onChange={v => set({ capitalize: v })} />
      <Toggle label="Append number"    checked={opts.addNumber}  onChange={v => set({ addNumber: v })} />
      {opts.addNumber && (
        <div>
          <p className="text-sm text-white/60 mb-2">Number position</p>
          <div className="flex gap-2">
            {(["prefix", "suffix", "random"] as const).map(pos => (
              <button key={pos}
                onClick={() => set({ numberPosition: pos })}
                className={`flex-1 py-2 rounded-lg border text-xs font-medium capitalize transition-all ${
                  opts.numberPosition === pos
                    ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                    : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
                }`}>
                {pos}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export default PassphraseMode;
