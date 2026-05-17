"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import { rand32 } from "../_lib/crypto";
import Slider from "../_components/Slider";
import Toggle from "../_components/Toggle";
import type { IphoneOpts, ModeHandle, ModeProps } from "../_lib/types";

const LOWER  = "abcdefghijklmnopqrstuvwxyz";
const UPPER  = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";

export function genIphone(o: IphoneOpts): string {
  const cs = o.mixedCase ? LOWER + UPPER + DIGITS : LOWER + DIGITS;
  const groups = Array.from({ length: o.groups }, () =>
    Array.from(rand32(o.groupLen), n => cs[n % cs.length]).join("")
  );
  return groups.join(o.separator);
}

const PRESET_SEPS = ["-", ".", "_", "~"] as const;

const DEFAULT: IphoneOpts = {
  groups: 3, groupLen: 6, separator: "-", mixedCase: false,
};

const IphoneMode = forwardRef<ModeHandle, ModeProps>(function IphoneMode({ onGenerate }, ref) {
  const [opts, setOpts] = useState<IphoneOpts>(DEFAULT);
  const [customSep, setCustomSep] = useState("");
  const set = (patch: Partial<IphoneOpts>) => setOpts(o => ({ ...o, ...patch }));

  useImperativeHandle(ref, () => ({
    generate() {
      onGenerate(genIphone(opts));
    },
  }));

  const handleCustomSep = (v: string) => {
    const c = v.slice(0, 1);
    setCustomSep(c);
    if (c) set({ separator: c });
  };

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Options</p>
      <Slider label="Groups" value={opts.groups} min={2} max={6} onChange={v => set({ groups: v })} />
      <Slider label="Characters per group" value={opts.groupLen} min={3} max={8} onChange={v => set({ groupLen: v })} />
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
              {sep}
            </button>
          ))}
          <input
            type="text"
            placeholder="?"
            value={customSep}
            onChange={e => handleCustomSep(e.target.value)}
            maxLength={1}
            className={`w-9 h-9 rounded-lg border text-sm font-mono text-center bg-white/5 text-white placeholder-white/20 focus:outline-none transition-colors ${
              customSep ? "border-violet-500/40" : "border-white/10 focus:border-white/20"
            }`}
          />
        </div>
      </div>
      <Toggle label="Mixed case" desc="Includes uppercase letters" checked={opts.mixedCase} onChange={v => set({ mixedCase: v })} />
      <div className="px-4 py-3 rounded-xl bg-white/3 border border-white/8 text-center">
        <p className="text-[11px] text-white/30 mb-1">Format preview</p>
        <p className="font-mono text-white/60 text-sm">
          {Array.from({ length: opts.groups }, (_, i) =>
            (i === 0 ? "" : opts.separator) + "x".repeat(opts.groupLen)
          ).join("")}
        </p>
      </div>
    </div>
  );
});

export default IphoneMode;
