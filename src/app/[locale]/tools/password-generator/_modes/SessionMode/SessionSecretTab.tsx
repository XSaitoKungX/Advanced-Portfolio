"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import { randBytes, toHex, toBase64url } from "../../_lib/crypto";
import Slider from "../../_components/Slider";
import type { SessionSecretOpts, ModeHandle, ModeProps } from "../../_lib/types";

export function genSessionSecret(o: SessionSecretOpts): string {
  const buf = randBytes(o.bytes);
  return o.format === "hex" ? toHex(buf) : toBase64url(buf);
}

const DEFAULT: SessionSecretOpts = { bytes: 32, format: "hex" };

const SessionSecretTab = forwardRef<ModeHandle, ModeProps>(function SessionSecretTab({ onGenerate }, ref) {
  const [opts, setOpts] = useState<SessionSecretOpts>(DEFAULT);
  const set = (patch: Partial<SessionSecretOpts>) => setOpts(o => ({ ...o, ...patch }));

  useImperativeHandle(ref, () => ({
    generate() {
      onGenerate(genSessionSecret(opts), "Session Secret");
    },
  }));

  return (
    <div className="space-y-4">
      <Slider
        label={`Bytes (${opts.bytes * 8} bits)`}
        value={opts.bytes}
        min={16}
        max={256}
        step={8}
        onChange={v => set({ bytes: v })}
      />
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
          Use for session secrets, CSRF tokens, or any server-side secret. Not for human-memorized passwords.
        </p>
      </div>
    </div>
  );
});

export default SessionSecretTab;
