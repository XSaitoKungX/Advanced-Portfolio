"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import { randBytes, toHex, toBase62, toBase64url } from "../../_lib/crypto";
import Slider from "../../_components/Slider";
import type { ApiKeyOpts, ModeHandle, ModeProps } from "../../_lib/types";

export function genApiKey(o: ApiKeyOpts): string {
  const buf = randBytes(o.bodyBytes);
  let body: string;
  switch (o.bodyFormat) {
    case "hex":       body = toHex(buf); break;
    case "base62":    body = toBase62(buf); break;
    case "base64url": body = toBase64url(buf); break;
  }
  return o.prefix + body;
}

function previewLength(o: ApiKeyOpts): number {
  const bodyLen = o.bodyFormat === "hex"
    ? o.bodyBytes * 2
    : o.bodyFormat === "base64url"
      ? Math.ceil((o.bodyBytes * 4) / 3)
      : o.bodyBytes; // base62 ≈ same as bodyBytes
  return o.prefix.length + bodyLen;
}

const DEFAULT: ApiKeyOpts = { prefix: "sk_live_", bodyFormat: "hex", bodyBytes: 24 };

const ApiKeyTab = forwardRef<ModeHandle, ModeProps>(function ApiKeyTab({ onGenerate }, ref) {
  const [opts, setOpts] = useState<ApiKeyOpts>(DEFAULT);
  const set = (patch: Partial<ApiKeyOpts>) => setOpts(o => ({ ...o, ...patch }));

  useImperativeHandle(ref, () => ({
    generate() {
      onGenerate(genApiKey(opts), `API Key ${opts.prefix || "(no prefix)"}`);
    },
  }));

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-white/60 mb-2">Key prefix</p>
        <input
          type="text"
          placeholder="e.g. sk_live_, api_, pk_test_"
          value={opts.prefix}
          onChange={e => set({ prefix: e.target.value.slice(0, 16) })}
          maxLength={16}
          className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white text-sm font-mono placeholder-white/20 focus:outline-none focus:border-violet-500/40 transition-colors"
        />
      </div>
      <div>
        <p className="text-sm text-white/60 mb-2">Body format</p>
        <div className="flex gap-2">
          {(["hex", "base62", "base64url"] as const).map(f => (
            <button key={f}
              onClick={() => set({ bodyFormat: f })}
              className={`flex-1 py-2 rounded-lg border text-xs font-mono transition-all ${
                opts.bodyFormat === f
                  ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                  : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <Slider
        label={`Body length (${previewLength(opts)} chars total)`}
        value={opts.bodyBytes}
        min={16}
        max={48}
        step={4}
        onChange={v => set({ bodyBytes: v })}
      />
      <div className="px-3 py-2.5 rounded-lg bg-white/3 border border-white/8">
        <p className="text-[11px] text-white/30 mb-1">Preview format</p>
        <p className="font-mono text-xs text-white/50">
          {opts.prefix || "<prefix>"}<span className="text-white/20">{"x".repeat(Math.min(previewLength(opts) - opts.prefix.length, 32))}</span>
        </p>
      </div>
    </div>
  );
});

export default ApiKeyTab;
