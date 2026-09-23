"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import { rand32 } from "../_lib/crypto";
import Toggle from "../_components/Toggle";
import Slider from "../_components/Slider";
import type { PinOpts, ModeHandle, ModeProps } from "../_lib/types";

const DIGITS = "0123456789";

export function genPin(o: PinOpts): string {
  let digits: number[] = [];
  let attempts = 0;

  while (digits.length < o.length && attempts < 1000) {
    attempts++;
    const d = rand32(1)[0] % 10;
    if (o.noRepeating && digits.includes(d) && o.length <= 10) continue;
    digits.push(d);
  }

  if (o.noSequential) {
    digits = removeSequential(digits, o.length);
  }

  return digits.map(d => DIGITS[d]).join("");
}

function removeSequential(digits: number[], targetLen: number): number[] {
  const result = [...digits];
  for (let i = 0; i < result.length - 2; i++) {
    const a = result[i], b = result[i + 1], c = result[i + 2];
    const isAsc = b === a + 1 && c === b + 1;
    const isDesc = b === a - 1 && c === b - 1;
    if (isAsc || isDesc) {
      // Replace the third digit with a non-sequential one
      let replacement = rand32(1)[0] % 10;
      let tries = 0;
      while (tries < 20 && (replacement === result[i + 1] + 1 || replacement === result[i + 1] - 1)) {
        replacement = rand32(1)[0] % 10;
        tries++;
      }
      result[i + 2] = replacement;
    }
  }
  return result.slice(0, targetLen);
}

const DEFAULT: PinOpts = {
  length: 6, noRepeating: false, noSequential: false, groupDisplay: false, groupSize: 4,
};

const PinMode = forwardRef<ModeHandle, ModeProps>(function PinMode({ onGenerate }, ref) {
  const [opts, setOpts] = useState<PinOpts>(DEFAULT);
  const set = (patch: Partial<PinOpts>) => setOpts(o => ({ ...o, ...patch }));

  useImperativeHandle(ref, () => ({
    generate() {
      onGenerate(genPin(opts));
    },
  }));

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Options</p>
      <Slider label="PIN length" value={opts.length} min={4} max={16} onChange={v => set({ length: v })} />
      <div className="flex flex-wrap gap-2">
        {[4, 6, 8, 10].map(n => (
          <button key={n}
            onClick={() => set({ length: n })}
            className={`px-4 py-1.5 rounded-lg border text-sm transition-all ${
              opts.length === n
                ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
            }`}>
            {n}-digit
          </button>
        ))}
      </div>
      <div className="space-y-2">
        <Toggle
          label="No repeating digits"
          desc={opts.length > 10 ? "Disabled when length > 10" : undefined}
          checked={opts.noRepeating && opts.length <= 10}
          onChange={v => set({ noRepeating: v })}
        />
        <Toggle label="No sequential digits" desc="Avoids 123, 987, etc." checked={opts.noSequential} onChange={v => set({ noSequential: v })} />
        <Toggle label="Group display"         desc="Spaces added for readability" checked={opts.groupDisplay} onChange={v => set({ groupDisplay: v })} />
      </div>
      {opts.groupDisplay && (
        <Slider label="Group size" value={opts.groupSize} min={2} max={5} onChange={v => set({ groupSize: v })} />
      )}
      {opts.groupDisplay && (
        <div className="px-4 py-3 rounded-xl bg-white/3 border border-white/8 text-center">
          <p className="text-[11px] text-white/30 mb-1">Display preview</p>
          <p className="font-mono text-white/60 text-sm">
            {"0".repeat(opts.length).match(new RegExp(`.{1,${opts.groupSize}}`, "g"))?.join(" ")}
          </p>
        </div>
      )}
    </div>
  );
});

export default PinMode;
