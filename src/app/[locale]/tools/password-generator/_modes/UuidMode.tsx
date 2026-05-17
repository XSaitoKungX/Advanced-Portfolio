"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import { uuidV4, uuidV7, ulid, nanoidStyle } from "../_lib/crypto";
import type { UuidOpts, ModeHandle, ModeProps } from "../_lib/types";

export function genUuid(o: UuidOpts): string {
  switch (o.variant) {
    case "v4":    return uuidV4();
    case "v7":    return uuidV7();
    case "ulid":  return ulid();
    case "nanoid": return nanoidStyle(21);
  }
}

const VARIANTS: { id: UuidOpts["variant"]; label: string; desc: string }[] = [
  { id: "v4",    label: "UUID v4",  desc: "Random, RFC 4122 compliant. Universal uniqueness." },
  { id: "v7",    label: "UUID v7",  desc: "Time-sortable UUID. First 48 bits encode millisecond timestamp. Database-friendly." },
  { id: "ulid",  label: "ULID",     desc: "Universally Unique Lexicographically Sortable. 26 chars, Crockford Base32." },
  { id: "nanoid",label: "nanoid",   desc: "21 URL-safe chars. Compact. ~126 bits of entropy." },
];

const DEFAULT: UuidOpts = { variant: "v4" };

const UuidMode = forwardRef<ModeHandle, ModeProps>(function UuidMode({ onGenerate }, ref) {
  const [opts, setOpts] = useState<UuidOpts>(DEFAULT);

  useImperativeHandle(ref, () => ({
    generate() {
      onGenerate(genUuid(opts), opts.variant.toUpperCase());
    },
  }));

  const active = VARIANTS.find(v => v.id === opts.variant)!;

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Options</p>
      <div className="grid grid-cols-2 gap-2">
        {VARIANTS.map(v => (
          <button key={v.id}
            onClick={() => setOpts({ variant: v.id })}
            className={`py-2.5 px-3 rounded-xl border text-sm font-semibold transition-all text-left ${
              opts.variant === v.id
                ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
            }`}>
            {v.label}
          </button>
        ))}
      </div>
      <div className="px-3 py-2.5 rounded-lg bg-white/3 border border-white/8">
        <p className="text-[11px] text-white/50 font-semibold mb-1">{active.label}</p>
        <p className="text-[11px] text-white/30 leading-relaxed">{active.desc}</p>
      </div>
    </div>
  );
});

export default UuidMode;
