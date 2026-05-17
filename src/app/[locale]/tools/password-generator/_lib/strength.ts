import type { Mode, StrengthResult } from "./types";
import { EFF_WORDS } from "./wordlists";

export function calcStrength(pw: string, mode: Mode, wordCount?: number): StrengthResult {
  if (!pw) return { pct: 0, label: "Weak", color: "#ef4444", entropyBits: 0 };

  if (mode === "pin") {
    const hasNoRepeat = new Set(pw.split("")).size === pw.length;
    let score = pw.length >= 8 ? 55 : pw.length >= 6 ? 35 : 15;
    if (hasNoRepeat && pw.length >= 6) score += 10;
    const label = score >= 60 ? "Good" : score >= 45 ? "Fair" : "Weak";
    const color = score >= 60 ? "#eab308" : score >= 45 ? "#f97316" : "#ef4444";
    return { pct: Math.min(score, 100), label, color, entropyBits: Math.round(pw.length * Math.log2(10)) };
  }

  if (mode === "bits") {
    const bits = pw.length >= 64 ? 256 : pw.length >= 48 ? 192 : 128;
    const pct = bits === 256 ? 100 : bits === 192 ? 80 : 65;
    return { pct, label: `${bits}-bit`, color: "#10b981", entropyBits: bits };
  }

  if (mode === "uuid") {
    return { pct: 88, label: "Strong", color: "#22c55e", entropyBits: 122 };
  }

  if (mode === "session") {
    const entropyBits = Math.round(pw.length * (pw.includes("-") || pw.includes("_") ? 6 : 4));
    const pct = Math.min(100, Math.round((entropyBits / 256) * 100));
    const label = entropyBits >= 192 ? "Very Strong" : entropyBits >= 128 ? "Strong" : "Good";
    const color = entropyBits >= 192 ? "#10b981" : "#22c55e";
    return { pct, label, color, entropyBits };
  }

  if (mode === "passphrase") {
    const wc = wordCount ?? pw.split(/[-._# ~]/).length;
    const entropyBits = Math.round(wc * Math.log2(EFF_WORDS.length));
    const pct = Math.min(100, Math.round((entropyBits / 100) * 100));
    const label = wc >= 6 ? "Very Strong" : wc >= 4 ? "Strong" : wc >= 3 ? "Good" : "Fair";
    const color = wc >= 6 ? "#10b981" : wc >= 4 ? "#22c55e" : wc >= 3 ? "#eab308" : "#f97316";
    return { pct, label, color, entropyBits };
  }

  // Classic, iPhone, Memorable, Pattern — heuristic score
  let charsetSize = 0;
  if (/[a-z]/.test(pw)) charsetSize += 26;
  if (/[A-Z]/.test(pw)) charsetSize += 26;
  if (/[0-9]/.test(pw)) charsetSize += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) charsetSize += 32;
  if (charsetSize === 0) charsetSize = 26;

  const entropyBits = Math.round(pw.length * Math.log2(charsetSize));

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

  if (s <= 3) return { pct, label: "Weak",        color: "#ef4444", entropyBits };
  if (s <= 5) return { pct, label: "Fair",        color: "#f97316", entropyBits };
  if (s <= 7) return { pct, label: "Good",        color: "#eab308", entropyBits };
  if (s <= 8) return { pct, label: "Strong",      color: "#22c55e", entropyBits };
  return             { pct, label: "Very Strong", color: "#10b981", entropyBits };
}
