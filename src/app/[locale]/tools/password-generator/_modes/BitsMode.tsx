"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";
import { randBytes, toHex, toBase58, uuidV4, ulid as genUlid } from "../_lib/crypto";
import Toggle from "../_components/Toggle";
import type { BitsOpts, ModeHandle, ModeProps } from "../_lib/types";

export function genBits(o: BitsOpts): string {
  const bytes = o.bits / 8;
  const buf = randBytes(bytes);
  if (o.format === "hex") return toHex(buf);
  if (o.format === "b58") return toBase58(buf);
  return btoa(String.fromCharCode(...buf));
}

const DEFAULT: BitsOpts = {
  bits: 256, format: "hex", includeUuid: false, includeUlid: false,
};

const BitsMode = forwardRef<ModeHandle, ModeProps>(function BitsMode({ onGenerate }, ref) {
  const [opts, setOpts] = useState<BitsOpts>(DEFAULT);
  const set = (patch: Partial<BitsOpts>) => setOpts(o => ({ ...o, ...patch }));

  const [uuidVal, setUuidVal]   = useState<string | null>(null);
  const [ulidVal, setUlidVal]   = useState<string | null>(null);
  const [copiedUuid, setCopiedUuid] = useState(false);
  const [copiedUlid, setCopiedUlid] = useState(false);

  const copyExtra = async (val: string, type: "uuid" | "ulid") => {
    await navigator.clipboard.writeText(val);
    if (type === "uuid") { setCopiedUuid(true); setTimeout(() => setCopiedUuid(false), 1800); }
    else                 { setCopiedUlid(true); setTimeout(() => setCopiedUlid(false), 1800); }
  };

  useImperativeHandle(ref, () => ({
    generate() {
      if (opts.includeUuid) setUuidVal(uuidV4());
      if (opts.includeUlid) setUlidVal(genUlid());
      onGenerate(genBits(opts), `${opts.bits}-bit`);
    },
  }));

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Options</p>
      <div>
        <p className="text-sm text-white/60 mb-2">Key size (bits)</p>
        <div className="flex gap-2">
          {([128, 192, 256] as const).map(b => (
            <button key={b}
              onClick={() => set({ bits: b })}
              className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                opts.bits === b
                  ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                  : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
              }`}>
              {b}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm text-white/60 mb-2">Format</p>
        <div className="flex gap-2">
          {([
            { id: "hex", label: "hex" },
            { id: "b64", label: "base64" },
            { id: "b58", label: "base58" },
          ] as { id: BitsOpts["format"]; label: string }[]).map(f => (
            <button key={f.id}
              onClick={() => set({ format: f.id })}
              className={`flex-1 py-2 rounded-lg border text-sm font-mono transition-all ${
                opts.format === f.id
                  ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                  : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
              }`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Toggle label="Also generate UUID v4" checked={opts.includeUuid} onChange={v => { set({ includeUuid: v }); if (!v) setUuidVal(null); }} />
        <Toggle label="Also generate ULID"    checked={opts.includeUlid} onChange={v => { set({ includeUlid: v }); if (!v) setUlidVal(null); }} />
      </div>
      {uuidVal && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/3 border border-white/8 group">
          <span className="text-[10px] text-white/25 shrink-0 w-10">UUID</span>
          <span className="flex-1 font-mono text-xs text-white/55 truncate">{uuidVal}</span>
          <button onClick={() => copyExtra(uuidVal, "uuid")} className="shrink-0">
            {copiedUuid ? <FiCheck className="w-3.5 h-3.5 text-green-400" /> : <FiCopy className="w-3.5 h-3.5 text-white/30 hover:text-white" />}
          </button>
        </div>
      )}
      {ulidVal && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/3 border border-white/8 group">
          <span className="text-[10px] text-white/25 shrink-0 w-10">ULID</span>
          <span className="flex-1 font-mono text-xs text-white/55 truncate">{ulidVal}</span>
          <button onClick={() => copyExtra(ulidVal, "ulid")} className="shrink-0">
            {copiedUlid ? <FiCheck className="w-3.5 h-3.5 text-green-400" /> : <FiCopy className="w-3.5 h-3.5 text-white/30 hover:text-white" />}
          </button>
        </div>
      )}
      <div className="px-3 py-2.5 rounded-lg bg-blue-500/8 border border-blue-500/20">
        <p className="text-[11px] text-blue-300/70 leading-relaxed">
          Use for cryptographic keys (AES-128, AES-192, AES-256). Not intended as a human-readable password.
        </p>
      </div>
    </div>
  );
});

export default BitsMode;
