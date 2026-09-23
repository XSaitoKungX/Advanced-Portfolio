"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCopy, FiCheck, FiRefreshCw, FiShield, FiZap, FiEye, FiEyeOff,
  FiDownload, FiLock, FiHash, FiList, FiGrid, FiBookOpen, FiEdit3,
} from "react-icons/fi";
import { RiAppleLine } from "react-icons/ri";
import GlassCard from "@/components/ui/GlassCard";
import StrengthBar from "./_components/StrengthBar";
import HistoryPanel from "./_components/HistoryPanel";
import ClassicMode    from "./_modes/ClassicMode";
import PassphraseMode from "./_modes/PassphraseMode";
import PinMode        from "./_modes/PinMode";
import IphoneMode     from "./_modes/IphoneMode";
import SessionMode    from "./_modes/SessionMode/index";
import BitsMode       from "./_modes/BitsMode";
import UuidMode       from "./_modes/UuidMode";
import MemorableMode  from "./_modes/MemorableMode";
import PatternMode    from "./_modes/PatternMode";
import { calcStrength } from "./_lib/strength";
import type { Mode, HistoryEntry, ModeHandle } from "./_lib/types";

const MODE_TABS: { id: Mode; icon: React.ReactNode; label: string }[] = [
  { id: "classic",    icon: <FiLock className="w-4 h-4" />,      label: "Classic" },
  { id: "passphrase", icon: <FiList className="w-4 h-4" />,      label: "Passphrase" },
  { id: "pin",        icon: <FiHash className="w-4 h-4" />,      label: "PIN" },
  { id: "iphone",     icon: <RiAppleLine className="w-4 h-4" />, label: "iPhone" },
  { id: "session",    icon: <FiZap className="w-4 h-4" />,       label: "Session" },
  { id: "bits",       icon: <FiShield className="w-4 h-4" />,    label: "Bits" },
  { id: "uuid",       icon: <FiGrid className="w-4 h-4" />,      label: "UUID" },
  { id: "memorable",  icon: <FiBookOpen className="w-4 h-4" />,  label: "Memorable" },
  { id: "pattern",    icon: <FiEdit3 className="w-4 h-4" />,     label: "Pattern" },
];

export default function PasswordGeneratorPage() {
  const [mode, setMode]       = useState<Mode>("classic");
  const [password, setPassword] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);
  const [copied, setCopied]   = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [bulkCount, setBulkCount] = useState(5);
  const [bulk, setBulk]       = useState<string[]>([]);
  const [copiedBulkIdx, setCopiedBulkIdx] = useState<number | null>(null);

  const modeRef = useRef<ModeHandle>(null);

  const handleGenerate = useCallback(() => {
    modeRef.current?.generate();
  }, []);

  // Bulk uses a side-channel ref to collect without polluting history
  const bulkCollectRef = useRef<string[] | null>(null);

  const handleModeOutputWithBulk = useCallback((pw: string, label?: string) => {
    if (!pw) return;
    if (bulkCollectRef.current !== null) {
      bulkCollectRef.current.push(pw);
      return;
    }
    setPassword(pw);
    setCopied(false);
    setHistory(h => [{ pw, ts: Date.now(), mode, label }, ...h].slice(0, 12));
    setBulk([]);
  }, [mode]);

  const handleBulkFinal = useCallback(() => {
    bulkCollectRef.current = [];
    for (let i = 0; i < Math.min(bulkCount, 50); i++) {
      modeRef.current?.generate();
    }
    const results = bulkCollectRef.current ?? [];
    bulkCollectRef.current = null;
    setBulk(results);
  }, [bulkCount]);

  const copyPw = async (pw: string, slot?: "main" | number) => {
    await navigator.clipboard.writeText(pw);
    if (slot === "main") {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } else if (typeof slot === "number") {
      setCopiedBulkIdx(slot);
      setTimeout(() => setCopiedBulkIdx(null), 1800);
    }
  };

  const downloadBulk = () => {
    const blob = new Blob([bulk.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "passwords.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  const strength = password ? calcStrength(password, mode) : null;
  const isEmpty  = password === null;

  const modeProps = { onGenerate: handleModeOutputWithBulk };

  return (
    <div className="min-h-screen pt-28 pb-24">
      {/* BG glows */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full blur-[130px] opacity-[0.055]"
          style={{ background: "radial-gradient(circle, #7C3AED, transparent)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[110px] opacity-[0.035]"
          style={{ background: "radial-gradient(circle, #4F46E5, transparent)" }} />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5 border"
            style={{ background: "rgba(124,58,237,0.1)", borderColor: "rgba(124,58,237,0.3)", color: "#a78bfa" }}>
            <FiShield className="w-3.5 h-3.5" />
            Browser-side · No data sent
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 tracking-tight">Password Generator</h1>
          <p className="text-white/45 max-w-lg mx-auto leading-relaxed text-sm">
            Generate cryptographically secure passwords instantly. Everything runs locally in your browser — nothing is ever transmitted.
          </p>
        </motion.div>

        {/* Mode Tabs */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-8">
          {MODE_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setMode(tab.id); setPassword(null); setBulk([]); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${
                mode === tab.id
                  ? "bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/25"
                  : "bg-white/3 border-white/8 text-white/50 hover:text-white hover:border-white/20"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── Left: Options + Bulk ──────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, delay: 0.15 }}
            className="lg:col-span-2 space-y-4">

            <GlassCard className="p-5">
              <AnimatePresence mode="wait">
                <motion.div key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {mode === "classic"    && <ClassicMode    ref={modeRef} {...modeProps} />}
                  {mode === "passphrase" && <PassphraseMode ref={modeRef} {...modeProps} />}
                  {mode === "pin"        && <PinMode        ref={modeRef} {...modeProps} />}
                  {mode === "iphone"     && <IphoneMode     ref={modeRef} {...modeProps} />}
                  {mode === "session"    && <SessionMode    ref={modeRef} {...modeProps} />}
                  {mode === "bits"       && <BitsMode       ref={modeRef} {...modeProps} />}
                  {mode === "uuid"       && <UuidMode       ref={modeRef} {...modeProps} />}
                  {mode === "memorable"  && <MemorableMode  ref={modeRef} {...modeProps} />}
                  {mode === "pattern"    && <PatternMode    ref={modeRef} {...modeProps} />}
                </motion.div>
              </AnimatePresence>
            </GlassCard>

            {/* Bulk generator */}
            <GlassCard className="p-5">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Bulk generator</p>
              <div className="flex items-center gap-3 mb-3">
                <input type="number" min={1} max={50} value={bulkCount}
                  onChange={e => setBulkCount(Math.min(50, Math.max(1, Number(e.target.value))))}
                  className="w-20 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm text-center focus:outline-none focus:border-violet-500/50" />
                <button onClick={handleBulkFinal}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-violet-500/15 border border-violet-500/30 text-violet-300 text-sm font-medium hover:bg-violet-500/25 transition-all">
                  <FiZap className="w-3.5 h-3.5" /> Generate
                </button>
              </div>
              {bulk.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1 mb-3">
                    {bulk.map((pw, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/3 border border-white/6 group">
                        <span className="flex-1 font-mono text-xs text-white/65 truncate">{pw}</span>
                        <button onClick={() => copyPw(pw, i)} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          {copiedBulkIdx === i
                            ? <FiCheck className="w-3.5 h-3.5 text-green-400" />
                            : <FiCopy className="w-3.5 h-3.5 text-white/40 hover:text-white" />}
                        </button>
                      </div>
                    ))}
                  </div>
                  <button onClick={downloadBulk}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/55 text-sm hover:text-white hover:bg-white/8 transition-all">
                    <FiDownload className="w-3.5 h-3.5" /> Download .txt
                  </button>
                </motion.div>
              )}
            </GlassCard>
          </motion.div>

          {/* ── Right: Output ─────────────────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-4">

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, delay: 0.2 }}>
              <GlassCard className="p-6">

                {/* Output display */}
                <div className="relative mb-5">
                  <div className={`w-full min-h-[80px] flex items-center px-5 py-4 rounded-xl border font-mono leading-relaxed transition-colors duration-200 ${
                    isEmpty
                      ? "bg-white/2 border-dashed border-white/10 text-white/20 text-sm"
                      : "bg-black/30 border-white/8 text-white text-base tracking-wider select-all"
                  }`} style={{ wordBreak: "break-all" }}>
                    {isEmpty
                      ? 'Click "Generate" to create a password'
                      : visible ? password : "•".repeat(Math.min(password!.length, 80))}
                  </div>
                  {!isEmpty && (
                    <div className="absolute top-3 right-3 flex gap-1">
                      <button onClick={() => setVisible(v => !v)}
                        className="p-1.5 rounded-lg text-white/25 hover:text-white hover:bg-white/8 transition-all">
                        {visible ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Strength + entropy */}
                {strength && password && (
                  <div className="mb-5">
                    <StrengthBar
                      pct={strength.pct}
                      color={strength.color}
                      label={strength.label}
                      entropyBits={strength.entropyBits}
                    />
                  </div>
                )}

                {/* Stats row */}
                {password && (
                  <div className="grid grid-cols-4 gap-2 mb-5">
                    {[
                      { label: "Characters", value: password.length, color: "#a78bfa" },
                      { label: "Uppercase",  value: /[A-Z]/.test(password) ? "✓" : "✗", color: /[A-Z]/.test(password) ? "#22c55e" : "#ef4444" },
                      { label: "Digits",     value: /[0-9]/.test(password) ? "✓" : "✗", color: /[0-9]/.test(password) ? "#22c55e" : "#ef4444" },
                      { label: "Symbols",    value: /[^a-zA-Z0-9]/.test(password) ? "✓" : "✗", color: /[^a-zA-Z0-9]/.test(password) ? "#22c55e" : "#ef4444" },
                    ].map(s => (
                      <div key={s.label} className="flex flex-col items-center py-3 rounded-xl bg-white/3 border border-white/6">
                        <span className="text-base font-bold tabular-nums" style={{ color: s.color }}>{s.value}</span>
                        <span className="text-[10px] text-white/25 mt-0.5 text-center">{s.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button onClick={handleGenerate}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm bg-linear-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/25 transition-all duration-200 active:scale-[0.98]">
                    <FiRefreshCw className="w-4 h-4" />
                    {isEmpty ? "Generate" : "Regenerate"}
                  </button>
                  {!isEmpty && (
                    <button onClick={() => copyPw(password!, "main")}
                      className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-medium text-sm border transition-all duration-200 ${
                        copied
                          ? "bg-green-500/20 border-green-500/40 text-green-400"
                          : "bg-white/5 border-white/10 text-white/65 hover:text-white hover:bg-white/10"
                      }`}>
                      <AnimatePresence mode="wait" initial={false}>
                        {copied
                          ? <motion.span key="ok" initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                              <FiCheck className="w-4 h-4" /> Copied!
                            </motion.span>
                          : <motion.span key="cp" initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                              <FiCopy className="w-4 h-4" /> Copy
                            </motion.span>}
                      </AnimatePresence>
                    </button>
                  )}
                </div>
              </GlassCard>
            </motion.div>

            {/* History */}
            {history.length > 0 && (
              <GlassCard className="p-5">
                <HistoryPanel history={history} onClear={() => setHistory([])} />
              </GlassCard>
            )}

            {/* Security note */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
              <GlassCard className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg shrink-0" style={{ background: "rgba(124,58,237,0.12)" }}>
                    <FiShield className="w-4 h-4 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white/65 mb-1">100% Client-side</p>
                    <p className="text-xs text-white/35 leading-relaxed">
                      All passwords are generated using the Web Crypto API (crypto.getRandomValues) directly in your browser. No data is ever sent to a server.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
