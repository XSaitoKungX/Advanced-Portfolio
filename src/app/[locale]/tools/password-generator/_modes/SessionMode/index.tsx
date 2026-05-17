"use client";

import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import SessionSecretTab from "./SessionSecretTab";
import JwtTab from "./JwtTab";
import ApiKeyTab from "./ApiKeyTab";
import CsrfTab from "./CsrfTab";
import type { SessionTab, ModeHandle, ModeProps } from "../../_lib/types";

const TABS: { id: SessionTab; label: string }[] = [
  { id: "secret", label: "Session Secret" },
  { id: "jwt",    label: "JWT Secret" },
  { id: "apikey", label: "API Key" },
  { id: "csrf",   label: "CSRF / Nonce" },
];

const SessionMode = forwardRef<ModeHandle, ModeProps>(function SessionMode({ onGenerate }, ref) {
  const [tab, setTab] = useState<SessionTab>("secret");
  const tabRef = useRef<ModeHandle>(null);

  useImperativeHandle(ref, () => ({
    generate() {
      tabRef.current?.generate();
    },
  }));

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Options</p>
      {/* Sub-tab pill bar */}
      <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-white/3 border border-white/8">
        {TABS.map(t => (
          <button key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
              tab === t.id
                ? "bg-violet-600 text-white shadow-sm"
                : "text-white/40 hover:text-white/70"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "secret" && <SessionSecretTab ref={tabRef} onGenerate={onGenerate} />}
      {tab === "jwt"    && <JwtTab           ref={tabRef} onGenerate={onGenerate} />}
      {tab === "apikey" && <ApiKeyTab        ref={tabRef} onGenerate={onGenerate} />}
      {tab === "csrf"   && <CsrfTab          ref={tabRef} onGenerate={onGenerate} />}
    </div>
  );
});

export default SessionMode;
