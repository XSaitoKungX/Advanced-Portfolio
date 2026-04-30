"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCopy, FiCheck, FiRefreshCw, FiShield, FiZap, FiEye, FiEyeOff,
  FiDownload, FiTrash2, FiLock, FiHash, FiList,
} from "react-icons/fi";
import { RiAppleLine } from "react-icons/ri";
import { useTranslations } from "next-intl";
import GlassCard from "@/components/ui/GlassCard";

// ─── Charsets ────────────────────────────────────────────────────────────────
const LOWER   = "abcdefghijklmnopqrstuvwxyz";
const UPPER   = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS  = "0123456789";
const SYM     = "!@#$%^&*()-_=+[]{}|;:,.<>?";
const B64     = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const SIMILAR = /[il1Lo0O]/g;

// BIP-39-like word list (short but realistic for passphrase demo)
const WORDS = [
  "apple","bridge","castle","dragon","ember","falcon","garden","harbor",
  "island","jungle","knight","lantern","marble","needle","ocean","palace",
  "quartz","river","silver","timber","umbrella","valley","winter","xylene",
  "yellow","zenith","anchor","blizzard","cedar","desert","eagle","forest",
  "glacier","horizon","ivory","jasmine","kelp","lemon","maple","nova",
  "orbit","pine","quill","robin","storm","thunder","ultra","violet",
  "willow","xenon","yarn","zephyr","abyss","beacon","crimson","dawn",
];

function rand32(n: number) {
  const buf = new Uint32Array(n);
  crypto.getRandomValues(buf);
  return buf;
}
function pick<T>(arr: T[]): T {
  const [r] = rand32(1);
  return arr[r % arr.length];
}
function shuffle(arr: string[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const [r] = rand32(1);
    const j = r % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ─── Modes ────────────────────────────────────────────────────────────────────
type Mode = "classic" | "passphrase" | "pin" | "iphone" | "session" | "bits";

interface ClassicOpts {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeSimilar: boolean;
}
interface PassphraseOpts { words: number; separator: string; capitalize: boolean; addNumber: boolean; }
interface PinOpts         { length: number; }
interface IphoneOpts      { groups: number; groupLen: number; }
interface SessionOpts     { bytes: number; format: "hex" | "base64url"; }
interface BitsOpts        { bits: 128 | 192 | 256; format: "hex" | "b64"; }

function genClassic(o: ClassicOpts): string {
  let cs = "";
  if (o.lowercase) cs += LOWER;
  if (o.uppercase) cs += UPPER;
  if (o.numbers)   cs += DIGITS;
  if (o.symbols)   cs += SYM;
  if (!cs) cs = LOWER;
  if (o.excludeSimilar) cs = cs.replace(SIMILAR, "");
  const buf = rand32(o.length);
  const arr = Array.from(buf, n => cs[n % cs.length]);
  const mandatory: string[] = [];
  const safeL = o.excludeSimilar ? LOWER.replace(SIMILAR,"") : LOWER;
  const safeU = o.excludeSimilar ? UPPER.replace(SIMILAR,"") : UPPER;
  const safeD = o.excludeSimilar ? DIGITS.replace(SIMILAR,"") : DIGITS;
  if (o.lowercase) mandatory.push(pick(safeL.split("")));
  if (o.uppercase) mandatory.push(pick(safeU.split("")));
  if (o.numbers)   mandatory.push(pick(safeD.split("")));
  if (o.symbols)   mandatory.push(pick(SYM.split("")));
  mandatory.forEach((c, i) => { arr[i] = c; });
  return shuffle(arr).join("");
}

function genPassphrase(o: PassphraseOpts): string {
  const ws = Array.from({ length: o.words }, () => {
    const w = pick(WORDS);
    return o.capitalize ? w[0].toUpperCase() + w.slice(1) : w;
  });
  const num = o.addNumber ? String(rand32(1)[0] % 100).padStart(2, "0") : "";
  return ws.join(o.separator) + (num ? o.separator + num : "");
}

function genPin(o: PinOpts): string {
  return Array.from(rand32(o.length), n => DIGITS[n % 10]).join("");
}

function genIphone(o: IphoneOpts): string {
  const cs = LOWER + DIGITS;
  const groups = Array.from({ length: o.groups }, () =>
    Array.from(rand32(o.groupLen), n => cs[n % cs.length]).join("")
  );
  return groups.join("-");
}

function genSession(o: SessionOpts): string {
  const buf = new Uint8Array(o.bytes);
  crypto.getRandomValues(buf);
  if (o.format === "hex") return Array.from(buf, b => b.toString(16).padStart(2,"0")).join("");
  // base64url
  const b64 = btoa(String.fromCharCode(...buf));
  return b64.replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}

function genBits(o: BitsOpts): string {
  const bytes = o.bits / 8;
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  if (o.format === "hex") return Array.from(buf, b => b.toString(16).padStart(2,"0")).join("");
  const charset = B64;
  return Array.from(rand32(bytes), n => charset[n % charset.length]).join("");
}

// ─── Strength ─────────────────────────────────────────────────────────────────
function calcStrength(pw: string, mode: Mode): { pct: number; label: string; color: string } {
  if (mode === "pin") {
    const pct = pw.length >= 8 ? 55 : pw.length >= 6 ? 35 : 15;
    return { pct, label: pct >= 55 ? "Fair" : "Weak", color: pct >= 55 ? "#f97316" : "#ef4444" };
  }
  if (mode === "bits") {
    const bits = pw.length >= 64 ? 256 : pw.length >= 48 ? 192 : 128;
    const pct = bits === 256 ? 100 : bits === 192 ? 80 : 65;
    return { pct, label: `${bits}-bit`, color: "#10b981" };
  }
  let s = 0;
  if (pw.length >= 8)  s++;
  if (pw.length >= 12) s++;
  if (pw.length >= 16) s++;
  if (pw.length >= 24) s++;
  if (pw.length >= 32) s++;
  if (/[a-z]/.test(pw)) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^a-zA-Z0-9]/.test(pw)) s++;
  const pct = Math.round((s / 9) * 100);
  if (s <= 3) return { pct, label: "Weak",        color: "#ef4444" };
  if (s <= 5) return { pct, label: "Fair",        color: "#f97316" };
  if (s <= 7) return { pct, label: "Good",        color: "#eab308" };
  if (s <= 8) return { pct, label: "Strong",      color: "#22c55e" };
  return             { pct, label: "Very Strong", color: "#10b981" };
}

// ─── Entropy display ──────────────────────────────────────────────────────────
function entropyBits(pw: string): number {
  const uniq = new Set(pw.split("")).size;
  if (uniq === 0) return 0;
  return Math.round(pw.length * Math.log2(uniq));
}

// ─── Shared types ─────────────────────────────────────────────────────────────
interface HistoryEntry { pw: string; ts: number; mode: Mode; }

// ─── Sub-components ───────────────────────────────────────────────────────────
function StrengthBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="w-full h-1.5 rounded-full bg-white/8 overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </div>
  );
}

function Toggle({ label, checked, onChange, desc }: {
  label: string; checked: boolean; onChange: (v: boolean) => void; desc?: string;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border transition-all duration-200 text-left group ${
        checked ? "bg-violet-500/10 border-violet-500/30" : "bg-white/3 border-white/8 hover:border-white/15"
      }`}
    >
      <div>
        <p className={`text-sm font-medium transition-colors ${checked ? "text-white" : "text-white/55 group-hover:text-white/80"}`}>{label}</p>
        {desc && <p className="text-[11px] text-white/25 mt-0.5 font-mono">{desc}</p>}
      </div>
      <div className={`w-9 h-5 rounded-full relative shrink-0 transition-colors duration-200 ${checked ? "bg-violet-500" : "bg-white/15"}`}>
        <motion.div
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
          animate={{ left: checked ? "calc(100% - 18px)" : "2px" }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
    </button>
  );
}

function Slider({ label, value, min, max, onChange }: {
  label: string; value: number; min: number; max: number; onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm text-white/60">{label}</span>
        <span className="text-sm font-bold text-violet-400 tabular-nums">{value}</span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-violet-500"
        style={{ background: `linear-gradient(to right, #7C3AED ${pct}%, rgba(255,255,255,0.1) 0%)` }}
      />
    </div>
  );
}

// ─── Mode Tab config ──────────────────────────────────────────────────────────
const MODE_TABS: { id: Mode; icon: React.ReactNode; label: string }[] = [
  { id: "classic",    icon: <FiLock className="w-4 h-4" />,      label: "Classic" },
  { id: "passphrase", icon: <FiList className="w-4 h-4" />,      label: "Passphrase" },
  { id: "pin",        icon: <FiHash className="w-4 h-4" />,      label: "PIN" },
  { id: "iphone",     icon: <RiAppleLine className="w-4 h-4" />, label: "iPhone" },
  { id: "session",    icon: <FiZap className="w-4 h-4" />,       label: "Session" },
  { id: "bits",       icon: <FiShield className="w-4 h-4" />,    label: "Bits" },
];

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function PasswordGeneratorPage() {
  const t = useTranslations("passwordGenerator");

  // Mode
  const [mode, setMode] = useState<Mode>("classic");

  // Per-mode options
  const [classicOpts, setClassicOpts] = useState<ClassicOpts>({
    length: 20, uppercase: true, lowercase: true, numbers: true, symbols: true, excludeSimilar: false,
  });
  const [ppOpts, setPpOpts] = useState<PassphraseOpts>({
    words: 4, separator: "-", capitalize: true, addNumber: true,
  });
  const [pinOpts, setPinOpts] = useState<PinOpts>({ length: 6 });
  const [iphoneOpts, setIphoneOpts] = useState<IphoneOpts>({ groups: 3, groupLen: 6 });
  const [sessionOpts, setSessionOpts] = useState<SessionOpts>({ bytes: 32, format: "hex" });
  const [bitsOpts, setBitsOpts] = useState<BitsOpts>({ bits: 256, format: "hex" });

  // Output
  const [password, setPassword] = useState<string | null>(null);
  const [visible, setVisible]   = useState(true);
  const [copied, setCopied]     = useState(false);
  const [history, setHistory]   = useState<HistoryEntry[]>([]);
  const [copiedHistIdx, setCopiedHistIdx] = useState<number | null>(null);

  // Bulk
  const [bulkCount, setBulkCount] = useState(5);
  const [bulk, setBulk]           = useState<string[]>([]);
  const [copiedBulkIdx, setCopiedBulkIdx] = useState<number | null>(null);

  const buildPw = useCallback((): string => {
    switch (mode) {
      case "classic":    return genClassic(classicOpts);
      case "passphrase": return genPassphrase(ppOpts);
      case "pin":        return genPin(pinOpts);
      case "iphone":     return genIphone(iphoneOpts);
      case "session":    return genSession(sessionOpts);
      case "bits":       return genBits(bitsOpts);
    }
  }, [mode, classicOpts, ppOpts, pinOpts, iphoneOpts, sessionOpts, bitsOpts]);

  const handleGenerate = useCallback(() => {
    const pw = buildPw();
    setPassword(pw);
    setCopied(false);
    setHistory(h => [{ pw, ts: Date.now(), mode }, ...h].slice(0, 12));
    setBulk([]);
  }, [buildPw, mode]);

  const handleBulk = useCallback(() => {
    const pws = Array.from({ length: bulkCount }, buildPw);
    setBulk(pws);
  }, [buildPw, bulkCount]);

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

  const copyHistEntry = async (pw: string, idx: number) => {
    await navigator.clipboard.writeText(pw);
    setCopiedHistIdx(idx);
    setTimeout(() => setCopiedHistIdx(null), 1800);
  };

  const downloadBulk = () => {
    const blob = new Blob([bulk.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "passwords.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  const strength = password ? calcStrength(password, mode) : null;
  const entropy  = password ? entropyBits(password) : null;
  const isEmpty  = password === null;

  // ── Render ──────────────────────────────────────────────────────────────────
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
            {t("badge")}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 tracking-tight">{t("title")}</h1>
          <p className="text-white/45 max-w-lg mx-auto leading-relaxed text-sm">{t("description")}</p>
        </motion.div>

        {/* Mode Tabs */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-8">
          {MODE_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setMode(tab.id); setPassword(null); }}
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

          {/* ── Left: Options panel ──────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, delay: 0.15 }}
            className="lg:col-span-2 space-y-4">

            <GlassCard className="p-5">
              <AnimatePresence mode="wait">
                {/* ─ Classic ─ */}
                {mode === "classic" && (
                  <motion.div key="classic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">{t("options")}</p>
                    <Slider label={t("length")} value={classicOpts.length} min={4} max={128}
                      onChange={v => setClassicOpts(o => ({ ...o, length: v }))} />
                    <div className="space-y-2">
                      <Toggle label={t("uppercase")} desc="A–Z" checked={classicOpts.uppercase} onChange={v => setClassicOpts(o => ({ ...o, uppercase: v }))} />
                      <Toggle label={t("lowercase")} desc="a–z" checked={classicOpts.lowercase} onChange={v => setClassicOpts(o => ({ ...o, lowercase: v }))} />
                      <Toggle label={t("numbers")}   desc="0–9" checked={classicOpts.numbers}   onChange={v => setClassicOpts(o => ({ ...o, numbers: v }))} />
                      <Toggle label={t("symbols")}   desc="! @ # $ % …" checked={classicOpts.symbols}  onChange={v => setClassicOpts(o => ({ ...o, symbols: v }))} />
                      <Toggle label={t("excludeSimilar")} desc="i l 1 L o 0 O" checked={classicOpts.excludeSimilar} onChange={v => setClassicOpts(o => ({ ...o, excludeSimilar: v }))} />
                    </div>
                  </motion.div>
                )}

                {/* ─ Passphrase ─ */}
                {mode === "passphrase" && (
                  <motion.div key="passphrase" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">{t("options")}</p>
                    <Slider label={t("wordCount")} value={ppOpts.words} min={2} max={10}
                      onChange={v => setPpOpts(o => ({ ...o, words: v }))} />
                    <div>
                      <p className="text-sm text-white/60 mb-2">{t("separator")}</p>
                      <div className="flex gap-2 flex-wrap">
                        {["-", ".", "_", " ", "#", "~"].map(sep => (
                          <button key={sep} onClick={() => setPpOpts(o => ({ ...o, separator: sep }))}
                            className={`w-9 h-9 rounded-lg border text-sm font-mono transition-all ${
                              ppOpts.separator === sep
                                ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                                : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
                            }`}>
                            {sep === " " ? "·" : sep}
                          </button>
                        ))}
                      </div>
                    </div>
                    <Toggle label={t("capitalize")} checked={ppOpts.capitalize} onChange={v => setPpOpts(o => ({ ...o, capitalize: v }))} />
                    <Toggle label={t("addNumber")}  checked={ppOpts.addNumber}  onChange={v => setPpOpts(o => ({ ...o, addNumber: v }))} />
                  </motion.div>
                )}

                {/* ─ PIN ─ */}
                {mode === "pin" && (
                  <motion.div key="pin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">{t("options")}</p>
                    <Slider label={t("pinLength")} value={pinOpts.length} min={4} max={16}
                      onChange={v => setPinOpts(o => ({ ...o, length: v }))} />
                    <div className="flex flex-wrap gap-2 mt-1">
                      {[4, 6, 8, 10].map(n => (
                        <button key={n} onClick={() => setPinOpts({ length: n })}
                          className={`px-4 py-1.5 rounded-lg border text-sm transition-all ${
                            pinOpts.length === n
                              ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                              : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
                          }`}>
                          {n}-digit
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ─ iPhone ─ */}
                {mode === "iphone" && (
                  <motion.div key="iphone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">{t("options")}</p>
                    <Slider label={t("groups")} value={iphoneOpts.groups} min={2} max={6}
                      onChange={v => setIphoneOpts(o => ({ ...o, groups: v }))} />
                    <Slider label={t("groupLen")} value={iphoneOpts.groupLen} min={3} max={8}
                      onChange={v => setIphoneOpts(o => ({ ...o, groupLen: v }))} />
                    <div className="px-4 py-3 rounded-xl bg-white/3 border border-white/8 text-center">
                      <p className="text-[11px] text-white/30 mb-1">{t("preview")}</p>
                      <p className="font-mono text-white/60 text-sm">
                        {Array.from({ length: iphoneOpts.groups }, (_, i) =>
                          i === 0 ? "x".repeat(iphoneOpts.groupLen) : "-" + "x".repeat(iphoneOpts.groupLen)
                        ).join("")}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* ─ Session token ─ */}
                {mode === "session" && (
                  <motion.div key="session" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">{t("options")}</p>
                    <Slider label={`${t("bytes")} (${sessionOpts.bytes * 8} bits)`} value={sessionOpts.bytes} min={16} max={64}
                      onChange={v => setSessionOpts(o => ({ ...o, bytes: v }))} />
                    <div>
                      <p className="text-sm text-white/60 mb-2">{t("format")}</p>
                      <div className="flex gap-2">
                        {(["hex","base64url"] as const).map(f => (
                          <button key={f} onClick={() => setSessionOpts(o => ({ ...o, format: f }))}
                            className={`flex-1 py-2 rounded-lg border text-sm font-mono transition-all ${
                              sessionOpts.format === f
                                ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                                : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
                            }`}>{f}</button>
                        ))}
                      </div>
                    </div>
                    <div className="px-3 py-2.5 rounded-lg bg-amber-500/8 border border-amber-500/20">
                      <p className="text-[11px] text-amber-300/70 leading-relaxed">{t("sessionNote")}</p>
                    </div>
                  </motion.div>
                )}

                {/* ─ Bits ─ */}
                {mode === "bits" && (
                  <motion.div key="bits" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">{t("options")}</p>
                    <div>
                      <p className="text-sm text-white/60 mb-2">{t("keySize")}</p>
                      <div className="flex gap-2">
                        {([128, 192, 256] as const).map(b => (
                          <button key={b} onClick={() => setBitsOpts(o => ({ ...o, bits: b }))}
                            className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                              bitsOpts.bits === b
                                ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                                : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
                            }`}>{b}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-white/60 mb-2">{t("format")}</p>
                      <div className="flex gap-2">
                        {(["hex","b64"] as const).map(f => (
                          <button key={f} onClick={() => setBitsOpts(o => ({ ...o, format: f }))}
                            className={`flex-1 py-2 rounded-lg border text-sm font-mono transition-all ${
                              bitsOpts.format === f
                                ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                                : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
                            }`}>{f}</button>
                        ))}
                      </div>
                    </div>
                    <div className="px-3 py-2.5 rounded-lg bg-blue-500/8 border border-blue-500/20">
                      <p className="text-[11px] text-blue-300/70 leading-relaxed">{t("bitsNote")}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>

            {/* Bulk generator */}
            <GlassCard className="p-5">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">{t("bulk")}</p>
              <div className="flex items-center gap-3 mb-3">
                <input type="number" min={1} max={50} value={bulkCount}
                  onChange={e => setBulkCount(Math.min(50, Math.max(1, Number(e.target.value))))}
                  className="w-20 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm text-center focus:outline-none focus:border-violet-500/50" />
                <button onClick={handleBulk}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-violet-500/15 border border-violet-500/30 text-violet-300 text-sm font-medium hover:bg-violet-500/25 transition-all">
                  <FiZap className="w-3.5 h-3.5" /> {t("generate")}
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
                    <FiDownload className="w-3.5 h-3.5" /> {t("download")}
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
                      ? t("placeholder")
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
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-white/35">{t("strength")}</span>
                      <div className="flex items-center gap-3">
                        {entropy !== null && (
                          <span className="text-[11px] text-white/30 font-mono">~{entropy} bits</span>
                        )}
                        <motion.span key={strength.label} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                          className="text-xs font-semibold" style={{ color: strength.color }}>
                          {strength.label}
                        </motion.span>
                      </div>
                    </div>
                    <StrengthBar pct={strength.pct} color={strength.color} />
                  </div>
                )}

                {/* Stats row */}
                {password && (
                  <div className="grid grid-cols-4 gap-2 mb-5">
                    {[
                      { label: t("chars"),     value: password.length, color: "#a78bfa" },
                      { label: t("hasUpper"),  value: /[A-Z]/.test(password) ? "✓" : "✗", color: /[A-Z]/.test(password) ? "#22c55e" : "#ef4444" },
                      { label: t("hasDigit"),  value: /[0-9]/.test(password) ? "✓" : "✗", color: /[0-9]/.test(password) ? "#22c55e" : "#ef4444" },
                      { label: t("hasSymbol"), value: /[^a-zA-Z0-9]/.test(password) ? "✓" : "✗", color: /[^a-zA-Z0-9]/.test(password) ? "#22c55e" : "#ef4444" },
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
                  {/* Generate */}
                  <button onClick={handleGenerate}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm bg-linear-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/25 transition-all duration-200 active:scale-[0.98]">
                    <FiRefreshCw className="w-4 h-4" />
                    {isEmpty ? t("generate") : t("regenerate")}
                  </button>
                  {/* Copy */}
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
                              <FiCheck className="w-4 h-4" /> {t("copied")}
                            </motion.span>
                          : <motion.span key="cp" initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                              <FiCopy className="w-4 h-4" /> {t("copy")}
                            </motion.span>}
                      </AnimatePresence>
                    </button>
                  )}
                </div>
              </GlassCard>
            </motion.div>

            {/* History */}
            {history.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <GlassCard className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">{t("history")}</p>
                    <button onClick={() => setHistory([])}
                      className="flex items-center gap-1 text-[11px] text-white/25 hover:text-red-400 transition-colors">
                      <FiTrash2 className="w-3 h-3" /> {t("clear")}
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {history.map((entry, i) => (
                      <motion.div key={entry.ts}
                        initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/3 border border-white/6 group hover:border-white/10 transition-colors">
                        <span className="text-[9px] font-semibold text-white/20 uppercase shrink-0 w-16">{entry.mode}</span>
                        <span className="flex-1 font-mono text-xs text-white/45 truncate">{entry.pw}</span>
                        <span className="text-[10px] text-white/20 shrink-0">
                          {new Date(entry.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        <button onClick={() => copyHistEntry(entry.pw, i)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          {copiedHistIdx === i
                            ? <FiCheck className="w-3.5 h-3.5 text-green-400" />
                            : <FiCopy className="w-3.5 h-3.5 text-white/35 hover:text-white" />}
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Security note */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
              <GlassCard className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg shrink-0" style={{ background: "rgba(124,58,237,0.12)" }}>
                    <FiShield className="w-4 h-4 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white/65 mb-1">{t("secureTitle")}</p>
                    <p className="text-xs text-white/35 leading-relaxed">{t("secureDesc")}</p>
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
