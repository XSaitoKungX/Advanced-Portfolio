"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import { uuidV4, randBytes, toHex } from "../../_lib/crypto";
import type { CsrfOpts, ModeHandle, ModeProps } from "../../_lib/types";

export function genCsrf(o: CsrfOpts): string {
  if (o.style === "uuid-v4") return uuidV4();
  return toHex(randBytes(24));
}

const DEFAULT: CsrfOpts = { style: "uuid-v4" };

const CsrfTab = forwardRef<ModeHandle, ModeProps>(function CsrfTab({ onGenerate }, ref) {
  const [opts, setOpts] = useState<CsrfOpts>(DEFAULT);
  const set = (patch: Partial<CsrfOpts>) => setOpts(o => ({ ...o, ...patch }));

  useImperativeHandle(ref, () => ({
    generate() {
      onGenerate(genCsrf(opts), `CSRF ${opts.style}`);
    },
  }));

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-white/60 mb-2">Token style</p>
        <div className="flex gap-2">
          {([
            { id: "uuid-v4", label: "UUID v4" },
            { id: "hex-24",  label: "Hex-24" },
          ] as const).map(({ id, label }) => (
            <button key={id}
              onClick={() => set({ style: id })}
              className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                opts.style === id
                  ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                  : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
              }`}>
              {label}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-white/25 mt-2 font-mono">
          {opts.style === "uuid-v4" ? "36 chars — RFC 4122 UUID" : "48 chars — 192 bits hex"}
        </p>
      </div>
      <div className="px-3 py-2.5 rounded-lg bg-white/3 border border-white/8">
        <p className="text-[11px] text-white/30 mb-2">Example header</p>
        <p className="font-mono text-[11px] text-white/50">X-CSRF-Token: &lt;token&gt;</p>
        <p className="font-mono text-[11px] text-white/30 mt-1">
          {'<meta name="csrf-token" content="<token>">'}
        </p>
      </div>
      <div className="px-3 py-2.5 rounded-lg bg-green-500/8 border border-green-500/20">
        <p className="text-[11px] text-green-300/70 leading-relaxed">
          Regenerate on every form render. Never reuse tokens across sessions.
        </p>
      </div>
    </div>
  );
});

export default CsrfTab;
