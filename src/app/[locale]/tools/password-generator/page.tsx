"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCopy, FiCheck, FiRefreshCw, FiShield, FiZap, FiEye, FiEyeOff,
  FiDownload, FiTrash2,
} from "react-icons/fi";
import { useTranslations } from "next-intl";
import GlassCard from "@/components/ui/GlassCard";

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{}|;:,.<>?";
const SIMILAR = /[il1Lo0O]/g;

function generatePassword(opts: PasswordOptions): string {
  let charset = "";
  if (opts.lowercase) charset += LOWERCASE;
  if (opts.uppercase) charset += UPPERCASE;
  if (opts.numbers) charset += NUMBERS;
  if (opts.symbols) charset += SYMBOLS;
  if (!charset) charset = LOWERCASE;

  if (opts.excludeSimilar) charset = charset.replace(SIMILAR, "");

  const array = new Uint32Array(opts.length);
  crypto.getRandomValues(array);
  let result = Array.from(array, (n) => charset[n % charset.length]).join("");

  // Guarantee at least one char from each enabled group
  const mandatory: string[] = [];
  if (opts.lowercase) mandatory.push(LOWERCASE.replace(SIMILAR, "")[Math.floor(Math.random() * 20)]);
  if (opts.uppercase) mandatory.push(UPPERCASE.replace(SIMILAR, "")[Math.floor(Math.random() * 20)]);
  if (opts.numbers)   mandatory.push(NUMBERS.replace(SIMILAR, "")[Math.floor(Math.random() * 8)]);
  if (opts.symbols)   mandatory.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);

  const arr = result.split("");
  mandatory.forEach((ch, i) => { arr[i] = ch; });
  // Shuffle
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join("");
}

function calcStrength(pw: string, opts: PasswordOptions): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (pw.length >= 16) score++;
  if (pw.length >= 24) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  if (opts.excludeSimilar) score++;

  if (score <= 3) return { score, label: "Weak",   color: "#ef4444" };
  if (score <= 5) return { score, label: "Fair",   color: "#f97316" };
  if (score <= 7) return { score, label: "Good",   color: "#eab308" };
  if (score <= 8) return { score, label: "Strong", color: "#22c55e" };
  return               { score, label: "Very Strong", color: "#10b981" };
}

interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeSimilar: boolean;
}

const DEFAULT_OPTS: PasswordOptions = {
  length: 16,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  excludeSimilar: false,
};

interface HistoryEntry { pw: string; ts: number; }

function StrengthBar({ score, color }: { score: number; color: string }) {
  const max = 9;
  const pct = Math.round((score / max) * 100);
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

function Toggle({
  label, checked, onChange, description,
}: { label: string; checked: boolean; onChange: (v: boolean) => void; description?: string }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border transition-all duration-200 text-left group ${
        checked
          ? "bg-violet-500/10 border-violet-500/30"
          : "bg-white/3 border-white/8 hover:border-white/15"
      }`}
    >
      <div>
        <p className={`text-sm font-medium transition-colors ${checked ? "text-white" : "text-white/60 group-hover:text-white/80"}`}>
          {label}
        </p>
        {description && (
          <p className="text-[11px] text-white/30 mt-0.5">{description}</p>
        )}
      </div>
      <div className={`w-9 h-5 rounded-full transition-colors duration-200 relative flex-shrink-0 ${checked ? "bg-violet-500" : "bg-white/15"}`}>
        <motion.div
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
          animate={{ left: checked ? "calc(100% - 18px)" : "2px" }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
    </button>
  );
}

export default function PasswordGeneratorPage() {
  const t = useTranslations("passwordGenerator");
  const [opts, setOpts] = useState<PasswordOptions>(DEFAULT_OPTS);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(true);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [copiedHistory, setCopiedHistory] = useState<number | null>(null);
  const [count, setCount] = useState(1);
  const [bulk, setBulk] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const generate = useCallback((o = opts) => {
    const pw = generatePassword(o);
    setPassword(pw);
    setHistory((h) => [{ pw, ts: Date.now() }, ...h].slice(0, 10));
    setBulk([]);
  }, [opts]);

  const generateBulk = useCallback(() => {
    const pws = Array.from({ length: count }, () => generatePassword(opts));
    setBulk(pws);
  }, [opts, count]);

  useEffect(() => { generate(DEFAULT_OPTS); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const copyPw = async (pw: string, idx?: number) => {
    await navigator.clipboard.writeText(pw);
    if (idx === undefined) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } else {
      setCopiedHistory(idx);
      setTimeout(() => setCopiedHistory(null), 1800);
    }
  };

  const downloadBulk = () => {
    const blob = new Blob([bulk.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "passwords.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  const set = <K extends keyof PasswordOptions>(key: K, val: PasswordOptions[K]) => {
    const next = { ...opts, [key]: val };
    setOpts(next);
    generate(next);
  };

  const strength = password ? calcStrength(password, opts) : null;

  return (
    <div className="min-h-screen pt-28 pb-24">
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full blur-[120px] opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #7C3AED, transparent)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #4F46E5, transparent)" }} />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6 border"
            style={{ background: "rgba(124,58,237,0.1)", borderColor: "rgba(124,58,237,0.3)", color: "#a78bfa" }}>
            <FiShield className="w-3.5 h-3.5" />
            {t("badge")}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            {t("title")}
          </h1>
          <p className="text-white/50 max-w-xl mx-auto leading-relaxed">
            {t("description")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Left: Options */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-2 space-y-4"
          >
            <GlassCard className="p-5">
              <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">{t("options")}</h2>

              {/* Length slider */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/70">{t("length")}</span>
                  <span className="text-sm font-bold text-violet-400 tabular-nums w-8 text-right">{opts.length}</span>
                </div>
                <input
                  ref={inputRef}
                  type="range" min={4} max={128}
                  value={opts.length}
                  onChange={(e) => set("length", Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-violet-500"
                  style={{ background: `linear-gradient(to right, #7C3AED ${((opts.length - 4) / 124) * 100}%, rgba(255,255,255,0.1) 0%)` }}
                />
                <div className="flex justify-between text-[10px] text-white/20 mt-1">
                  <span>4</span><span>32</span><span>64</span><span>128</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2">
                <Toggle label={t("uppercase")} description="A–Z" checked={opts.uppercase} onChange={(v) => set("uppercase", v)} />
                <Toggle label={t("lowercase")} description="a–z" checked={opts.lowercase} onChange={(v) => set("lowercase", v)} />
                <Toggle label={t("numbers")}   description="0–9" checked={opts.numbers}   onChange={(v) => set("numbers", v)} />
                <Toggle label={t("symbols")}   description="! @ # $ % …" checked={opts.symbols}  onChange={(v) => set("symbols", v)} />
                <Toggle label={t("excludeSimilar")} description="i l 1 L o 0 O" checked={opts.excludeSimilar} onChange={(v) => set("excludeSimilar", v)} />
              </div>
            </GlassCard>

            {/* Bulk generator */}
            <GlassCard className="p-5">
              <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">{t("bulk")}</h2>
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="number" min={1} max={50} value={count}
                  onChange={(e) => setCount(Math.min(50, Math.max(1, Number(e.target.value))))}
                  className="w-20 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm text-center focus:outline-none focus:border-violet-500/50"
                />
                <button
                  onClick={generateBulk}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-violet-500/15 border border-violet-500/30 text-violet-300 text-sm font-medium hover:bg-violet-500/25 transition-all"
                >
                  <FiZap className="w-3.5 h-3.5" />
                  {t("generate")}
                </button>
              </div>
              {bulk.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 mb-3">
                    {bulk.map((pw, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/3 border border-white/6 group">
                        <span className="flex-1 font-mono text-xs text-white/70 truncate">{pw}</span>
                        <button onClick={() => copyPw(pw, i)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                          {copiedHistory === i
                            ? <FiCheck className="w-3.5 h-3.5 text-green-400" />
                            : <FiCopy className="w-3.5 h-3.5 text-white/40 hover:text-white" />}
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={downloadBulk}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-sm hover:text-white hover:bg-white/8 transition-all"
                  >
                    <FiDownload className="w-3.5 h-3.5" />
                    {t("download")}
                  </button>
                </motion.div>
              )}
            </GlassCard>
          </motion.div>

          {/* Right: Password display + history */}
          <div className="lg:col-span-3 space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <GlassCard className="p-6">
                {/* Password display */}
                <div className="relative mb-4">
                  <div className="w-full min-h-[72px] flex items-center px-5 py-4 rounded-xl bg-black/30 border border-white/8 font-mono text-lg tracking-widest text-white break-all select-all leading-relaxed"
                    style={{ wordBreak: "break-all" }}
                  >
                    {visible ? password : "•".repeat(password.length)}
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1">
                    <button
                      onClick={() => setVisible((v) => !v)}
                      className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/8 transition-all"
                    >
                      {visible ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Strength */}
                {strength && (
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-white/40">{t("strength")}</span>
                      <motion.span
                        key={strength.label}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs font-semibold"
                        style={{ color: strength.color }}
                      >
                        {strength.label}
                      </motion.span>
                    </div>
                    <StrengthBar score={strength.score} color={strength.color} />
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: t("chars"), value: password.length },
                    { label: t("hasUpper"), value: /[A-Z]/.test(password) ? "✓" : "✗", ok: /[A-Z]/.test(password) },
                    { label: t("hasSymbol"), value: /[^a-zA-Z0-9]/.test(password) ? "✓" : "✗", ok: /[^a-zA-Z0-9]/.test(password) },
                  ].map(({ label, value, ok }) => (
                    <div key={label} className="flex flex-col items-center py-3 rounded-xl bg-white/3 border border-white/6">
                      <span className="text-lg font-bold tabular-nums"
                        style={{ color: ok === undefined ? "#a78bfa" : ok ? "#22c55e" : "#ef4444" }}>
                        {value}
                      </span>
                      <span className="text-[10px] text-white/30 mt-0.5 text-center">{label}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => copyPw(password)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                      copied
                        ? "bg-green-500/20 border border-green-500/40 text-green-400"
                        : "bg-violet-500/15 border border-violet-500/30 text-violet-300 hover:bg-violet-500/25"
                    }`}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {copied
                        ? <motion.span key="ok" initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                            <FiCheck className="w-4 h-4" /> {t("copied")}
                          </motion.span>
                        : <motion.span key="copy" initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                            <FiCopy className="w-4 h-4" /> {t("copy")}
                          </motion.span>
                      }
                    </AnimatePresence>
                  </button>
                  <button
                    onClick={() => generate()}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/10 bg-white/5 text-white/60 text-sm font-medium hover:text-white hover:bg-white/10 transition-all"
                  >
                    <FiRefreshCw className="w-4 h-4" />
                    {t("regenerate")}
                  </button>
                </div>
              </GlassCard>
            </motion.div>

            {/* History */}
            {history.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <GlassCard className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">{t("history")}</h2>
                    <button
                      onClick={() => setHistory([])}
                      className="flex items-center gap-1 text-[11px] text-white/30 hover:text-red-400 transition-colors"
                    >
                      <FiTrash2 className="w-3 h-3" /> {t("clear")}
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {history.slice(1).map((entry, i) => (
                      <motion.div
                        key={entry.ts}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/3 border border-white/6 group hover:border-white/12 transition-colors"
                      >
                        <span className="flex-1 font-mono text-xs text-white/50 truncate">{entry.pw}</span>
                        <span className="text-[10px] text-white/20 shrink-0">
                          {new Date(entry.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        <button
                          onClick={() => copyPw(entry.pw, i + 100)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {copiedHistory === i + 100
                            ? <FiCheck className="w-3.5 h-3.5 text-green-400" />
                            : <FiCopy className="w-3.5 h-3.5 text-white/40 hover:text-white" />}
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Security note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg shrink-0" style={{ background: "rgba(124,58,237,0.12)" }}>
                    <FiShield className="w-4 h-4 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white/70 mb-1">{t("secureTitle")}</p>
                    <p className="text-xs text-white/40 leading-relaxed">{t("secureDesc")}</p>
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
