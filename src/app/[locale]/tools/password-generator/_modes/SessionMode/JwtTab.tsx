"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import { randBytes, toHex, toBase64url } from "../../_lib/crypto";
import type { JwtOpts, ModeHandle, ModeProps } from "../../_lib/types";

const BYTE_SIZES: Record<JwtOpts["algorithm"], number> = {
  HS256: 32,
  HS384: 48,
  HS512: 64,
};

export function genJwtSecret(o: JwtOpts): string {
  const buf = randBytes(BYTE_SIZES[o.algorithm]);
  return o.format === "hex" ? toHex(buf) : toBase64url(buf);
}

const DEFAULT: JwtOpts = { algorithm: "HS256", format: "base64url" };

const JwtTab = forwardRef<ModeHandle, ModeProps>(function JwtTab({ onGenerate }, ref) {
  const [opts, setOpts] = useState<JwtOpts>(DEFAULT);
  const set = (patch: Partial<JwtOpts>) => setOpts(o => ({ ...o, ...patch }));

  useImperativeHandle(ref, () => ({
    generate() {
      onGenerate(genJwtSecret(opts), `JWT ${opts.algorithm}`);
    },
  }));

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-white/60 mb-2">Algorithm</p>
        <div className="flex gap-2">
          {(["HS256", "HS384", "HS512"] as const).map(alg => (
            <button key={alg}
              onClick={() => set({ algorithm: alg })}
              className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                opts.algorithm === alg
                  ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                  : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
              }`}>
              {alg}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-white/25 mt-2 font-mono">
          {opts.algorithm} → {BYTE_SIZES[opts.algorithm]} bytes / {BYTE_SIZES[opts.algorithm] * 8} bits
        </p>
      </div>
      <div>
        <p className="text-sm text-white/60 mb-2">Format</p>
        <div className="flex gap-2">
          {(["hex", "base64url"] as const).map(f => (
            <button key={f}
              onClick={() => set({ format: f })}
              className={`flex-1 py-2 rounded-lg border text-sm font-mono transition-all ${
                opts.format === f
                  ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                  : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="px-3 py-2.5 rounded-lg bg-amber-500/8 border border-amber-500/20">
        <p className="text-[11px] text-amber-300/70 leading-relaxed">
          Raw HMAC signing secret. Pass as the <span className="font-mono">secret</span> param in your JWT library (e.g. jsonwebtoken, jose). Minimum 256 bits recommended for HS256.
        </p>
      </div>
    </div>
  );
});

export default JwtTab;
