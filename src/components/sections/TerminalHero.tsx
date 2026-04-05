"use client";

import { useEffect, useRef, useState, useCallback, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";

interface TerminalLine {
  id: number;
  type: "status" | "command" | "output" | "menu" | "ascii" | "separator" | "error" | "info";
  content: string;
  prefix?: string;
  prefixColor?: string;
  instant?: boolean;
}

const ASCII_NAME = [
' ███╗   ███╗ █████╗ ██████╗ ██╗  ██╗',
' ████╗ ████║██╔══██╗██╔══██╗██║ ██╔╝',
' ██╔████╔██║███████║██████╔╝█████╔╝ ',
' ██║╚██╔╝██║██╔══██║██╔══██╗██╔═██╗ ',
' ██║ ╚═╝ ██║██║  ██║██║  ██║██║  ██╗',
' ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝',
];

const BOOT_LINES: Omit<TerminalLine, "id">[] = [
  { type: "status", content: "boot",           prefix: "[INIT]", prefixColor: "#A78BFA" },
  { type: "status", content: "loading_modules",prefix: "[ OK ]", prefixColor: "#34D399" },
  { type: "status", content: "connecting",     prefix: "[ OK ]", prefixColor: "#34D399" },
  { type: "status", content: "ready",          prefix: "[ OK ]", prefixColor: "#34D399" },
  { type: "separator", content: "" },
  { type: "ascii", content: ASCII_NAME[0], instant: true },
  { type: "ascii", content: ASCII_NAME[1], instant: true },
  { type: "ascii", content: ASCII_NAME[2], instant: true },
  { type: "ascii", content: ASCII_NAME[3], instant: true },
  { type: "ascii", content: ASCII_NAME[4], instant: true },
  { type: "separator", content: "" },
  { type: "status", content: "fetching",       prefix: "[LOAD]", prefixColor: "#FBBF24" },
  { type: "status", content: "portfolio_ready",prefix: "[ OK ]", prefixColor: "#34D399" },
  { type: "separator", content: "" },
];

const BOOT_DELAYS = [400, 500, 400, 350, 300, 50, 50, 50, 50, 50, 200, 400, 600, 200];

const MENU_LINES: Omit<TerminalLine, "id">[] = [
  { type: "menu", content: "menu_projects", prefix: "[1]", prefixColor: "#A78BFA" },
  { type: "menu", content: "menu_skills",   prefix: "[2]", prefixColor: "#60A5FA" },
  { type: "menu", content: "menu_contact",  prefix: "[3]", prefixColor: "#34D399" },
  { type: "separator", content: "" },
  { type: "info", content: "menu_hint" },
];

function Prompt() {
  return (
    <span className="flex items-center gap-0.5 shrink-0">
      <span className="text-[#34D399]">mark</span>
      <span className="text-white/30">@</span>
      <span className="text-[#60A5FA]">dev</span>
      <span className="text-white/30">:</span>
      <span className="text-[#A78BFA]">~</span>
      <span className="text-[#FBBF24] ml-1">$</span>
    </span>
  );
}

let lineIdCounter = 0;
function nextId() { return ++lineIdCounter; }

export default function TerminalHero() {
  const t = useTranslations("home.terminal");
  const locale = useLocale();
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [interactive, setInteractive] = useState(false);

  const push = useCallback((...newLines: Omit<TerminalLine, "id">[]) => {
    setLines((prev) => [
      ...prev,
      ...newLines.map((l) => ({ ...l, id: nextId() })),
    ]);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      for (let i = 0; i < BOOT_LINES.length; i++) {
        if (cancelled) break;
        await new Promise((r) => setTimeout(r, BOOT_DELAYS[i] ?? 200));
        if (cancelled) break;
        const raw = BOOT_LINES[i];
        const content = raw.type === "status" || raw.type === "info"
          ? t(raw.content as Parameters<typeof t>[0])
          : raw.content;
        push({ ...raw, content });
      }
      if (!cancelled) {
        MENU_LINES.forEach((l) => {
          const content = l.type === "info" || l.type === "menu"
            ? t(l.content as Parameters<typeof t>[0])
            : l.content;
          push({ ...l, content });
        });
        setInteractive(true);
      }
    };
    run();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [lines, input]);

  useEffect(() => {
    if (interactive) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [interactive]);

  const runCommand = useCallback((raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;

    push({ type: "command", content: cmd });
    setHistory((h) => [cmd, ...h.slice(0, 49)]);
    setHistoryIdx(-1);

    const lower = cmd.toLowerCase();

    if (lower === "1" || lower === "/projects") {
      push(
        { type: "output", content: t("cmd_projects_title") },
        { type: "separator", content: "" },
        ...["Astra Bot", "Astra Bot v3", "Portfolio", "Biolink Platform", "Game Hosting Panel"].map((p) => ({
          type: "output" as const, content: `  → ${p}`,
        })),
        { type: "separator", content: "" },
        { type: "info", content: t("cmd_navigate", { path: `/${locale}/projects` }) },
      );
      setTimeout(() => router.push(`/${locale}/projects`), 1200);
      return;
    }

    if (lower === "2" || lower === "/skills") {
      push(
        { type: "output", content: t("cmd_skills_title") },
        { type: "separator", content: "" },
        { type: "output", content: "  Frontend  → TypeScript, React, Next.js, Tailwind CSS" },
        { type: "output", content: "  Backend   → Node.js, Bun, Python, PostgreSQL, Prisma" },
        { type: "output", content: "  DevOps    → Docker, Nginx, Git, Vercel, Linux" },
        { type: "output", content: "  Tools     → Windsurf, VS Code, IntelliJ IDEA" },
        { type: "separator", content: "" },
        { type: "info", content: t("cmd_navigate", { path: `/${locale}/skills` }) },
      );
      setTimeout(() => router.push(`/${locale}/skills`), 1400);
      return;
    }

    if (lower === "3" || lower === "/contact") {
      push(
        { type: "output", content: t("cmd_contact_title") },
        { type: "separator", content: "" },
        { type: "output", content: "  Email  → via contact form" },
        { type: "output", content: "  GitHub → github.com/markdev" },
        { type: "separator", content: "" },
        { type: "info", content: t("cmd_navigate", { path: `/${locale}/contact` }) },
      );
      setTimeout(() => router.push(`/${locale}/contact`), 1200);
      return;
    }

    if (lower === "/help") {
      push(
        { type: "output", content: t("cmd_help_title") },
        { type: "separator", content: "" },
        { type: "output", content: "  1  /projects    →  " + t("menu_projects") },
        { type: "output", content: "  2  /skills      →  " + t("menu_skills") },
        { type: "output", content: "  3  /contact     →  " + t("menu_contact") },
        { type: "output", content: "     /experience  →  " + t("menu_experience") },
        { type: "output", content: "     /about       →  " + t("menu_about") },
        { type: "output", content: "     /whoami      →  " + t("cmd_whoami_title") },
        { type: "output", content: "     /ping        →  " + t("cmd_ping_title") },
        { type: "output", content: "     /date        →  " + t("cmd_date_title") },
        { type: "output", content: "     /stack       →  " + t("cmd_stack_title") },
        { type: "output", content: "     /astra       →  " + t("cmd_astra_title") },
        { type: "output", content: "     /clear       →  " + t("cmd_clear_title") },
        { type: "separator", content: "" },
      );
      return;
    }

    if (lower === "/whoami") {
      push(
        { type: "output", content: "mark" },
        { type: "separator", content: "" },
        { type: "output", content: "  " + t("cmd_whoami_role") },
        { type: "output", content: "  " + t("cmd_whoami_company") },
        { type: "output", content: "  " + t("cmd_whoami_location") },
        { type: "separator", content: "" },
      );
      return;
    }

    if (lower === "/ping") {
      push({ type: "info", content: t("cmd_ping_sending") });
      setTimeout(() => {
        const ms = Math.floor(Math.random() * 12) + 2;
        push(
          { type: "output", content: `PING mark.dev (127.0.0.1): 56 bytes` },
          { type: "output", content: `64 bytes from mark.dev: icmp_seq=0 time=${ms} ms` },
          { type: "output", content: `64 bytes from mark.dev: icmp_seq=1 time=${ms + 1} ms` },
          { type: "output", content: `64 bytes from mark.dev: icmp_seq=2 time=${ms - 1} ms` },
          { type: "separator", content: "" },
          { type: "info", content: t("cmd_ping_result", { ms: String(ms) }) },
        );
      }, 600);
      return;
    }

    if (lower === "/date") {
      const now = new Date();
      const iso = now.toISOString();
      const local = now.toLocaleString(locale === "de" ? "de-DE" : "en-US", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
        hour: "2-digit", minute: "2-digit", second: "2-digit",
      });
      push(
        { type: "output", content: local },
        { type: "output", content: `UTC: ${iso}` },
        { type: "separator", content: "" },
      );
      return;
    }

    if (lower === "/stack") {
      push(
        { type: "output", content: t("cmd_stack_title") },
        { type: "separator", content: "" },
        { type: "output", content: "  Runtime    → Bun v1.x + Node.js v22" },
        { type: "output", content: "  Framework  → Next.js 16 (Turbopack)" },
        { type: "output", content: "  Styling    → Tailwind CSS v4" },
        { type: "output", content: "  Auth       → Better Auth (Discord)" },
        { type: "output", content: "  i18n       → next-intl (de/en)" },
        { type: "output", content: "  Anim       → Framer Motion" },
        { type: "output", content: "  Deploy     → Vercel + Docker" },
        { type: "separator", content: "" },
      );
      return;
    }

    if (lower === "/astra") {
      push(
        { type: "output", content: "  Astra Bot — astra-bot.app" },
        { type: "separator", content: "" },
        { type: "output", content: "  Status   → 🟢 online" },
        { type: "output", content: "  Servers  → 90+" },
        { type: "output", content: "  Tech     → discord.js + TypeScript + PostgreSQL" },
        { type: "output", content: "  Features → Moderation, Music, Custom Commands" },
        { type: "separator", content: "" },
        { type: "info", content: "https://astra-bot.app" },
      );
      return;
    }

    if (lower === "/experience") {
      push(
        { type: "output", content: t("cmd_experience_title") },
        { type: "separator", content: "" },
        { type: "output", content: "  2018  → Erste Schritte (Scorpion-Inspiration)" },
        { type: "output", content: "  2019  → Python, discord.py, Unity" },
        { type: "output", content: "  2021  → JavaScript, Node.js, discord.js" },
        { type: "output", content: "  2022  → BBS2: C++, Elektrotechnik" },
        { type: "output", content: "  2023  → React, Next.js, Astra Bot" },
        { type: "output", content: "  2024  → Leuphana Azubi + BBS1 Godot Game" },
        { type: "separator", content: "" },
        { type: "info", content: t("cmd_navigate", { path: `/${locale}/experience` }) },
      );
      return;
    }

    if (lower === "/about") {
      push(
        { type: "output", content: t("cmd_about_title") },
        { type: "separator", content: "" },
        { type: "output", content: "  Name    → Mark" },
        { type: "output", content: "  Age     → " + t("cmd_about_age") },
        { type: "output", content: "  Status  → " + t("cmd_about_status") },
        { type: "output", content: "  Until   → 2027" },
        { type: "separator", content: "" },
        { type: "info", content: t("cmd_navigate", { path: `/${locale}/about` }) },
      );
      return;
    }

    if (lower === "/clear" || lower === "clear") {
      setLines([]);
      return;
    }

    if (lower === "menu" || lower === "/menu") {
      push({ type: "separator", content: "" });
      MENU_LINES.forEach((l) => {
        const content = l.type === "info" || l.type === "menu"
          ? t(l.content as Parameters<typeof t>[0])
          : l.content;
        push({ ...l, content });
      });
      return;
    }

    push(
      { type: "error", content: t("cmd_not_found", { cmd }) },
      { type: "info", content: t("cmd_try_help") },
    );
  }, [t, locale, router, push]);

  const handleKey = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const val = input;
      setInput("");
      runCommand(val);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHistoryIdx((idx) => {
        const next = Math.min(idx + 1, history.length - 1);
        setInput(history[next] ?? "");
        return next;
      });
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHistoryIdx((idx) => {
        const next = Math.max(idx - 1, -1);
        setInput(next === -1 ? "" : (history[next] ?? ""));
        return next;
      });
    }
  }, [input, history, runCommand]);

  return (
    <div
      className="relative w-full max-w-2xl mx-auto cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-[#7C3AED]/30 via-[#4F46E5]/20 to-[#7C3AED]/30 rounded-2xl blur-xl opacity-60" />

      <div className="relative bg-[#0D1117]/95 border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#161B22] border-b border-white/5">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57] shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-[#27C840] shadow-sm" />
          </div>
          <div className="flex-1 flex justify-center">
            <span className="text-xs text-white/30 font-mono tracking-wider">mark.dev — terminal</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-emerald-500/70 font-mono">online</span>
          </div>
        </div>

        {/* Output area */}
        <div className="relative h-[360px] overflow-y-auto scrollbar-none p-4 font-mono text-sm">
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.008) 2px, rgba(255,255,255,0.008) 4px)",
          }} />

          <AnimatePresence initial={false}>
            {lines.map((line) => (
              <motion.div
                key={line.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className="leading-relaxed"
              >
                {line.type === "separator" ? (
                  <div className="h-2" />
                ) : line.type === "ascii" ? (
                  <div
                    className="text-[#A78BFA] text-[11px] leading-[1.3] whitespace-pre font-mono font-bold"
                    style={{ textShadow: "0 0 18px rgba(167,139,250,0.8), 0 0 6px rgba(167,139,250,0.5)" }}
                  >
                    {line.content}
                  </div>
                ) : line.type === "command" ? (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Prompt />
                    <span className="text-white ml-1">{line.content}</span>
                  </div>
                ) : line.type === "output" ? (
                  <div className="text-white/55 text-[13px] leading-snug pl-1">{line.content}</div>
                ) : line.type === "error" ? (
                  <div className="flex items-center gap-2 text-red-400 text-[13px]">
                    <span className="text-red-500 font-bold">✗</span>
                    {line.content}
                  </div>
                ) : line.type === "info" ? (
                  <div className="text-[#60A5FA]/70 text-[12px] pl-1">{line.content}</div>
                ) : line.type === "menu" ? (
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-bold" style={{ color: line.prefixColor }}>{line.prefix}</span>
                    <span className="text-white/80">{line.content}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-semibold text-xs tracking-wider" style={{ color: line.prefixColor ?? "#6B7280" }}>
                      {line.prefix}
                    </span>
                    <span className="text-white/70">{line.content}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Interactive input row */}
          {interactive && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <Prompt />
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                className="flex-1 bg-transparent outline-none text-white caret-[#FBBF24] ml-1 min-w-0"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-label="terminal input"
              />
              {input.length === 0 && (
                <span className="inline-block w-[7px] h-[15px] bg-white/60 animate-pulse" />
              )}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Status bar */}
        <div className="px-4 py-2 bg-[#161B22]/50 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-white/20 font-mono">bun v1.x</span>
            <span className="text-[10px] text-white/20 font-mono">next 16</span>
          </div>
          <div className="flex items-center gap-3">
            {interactive && (
              <span className="text-[10px] text-white/25 font-mono">/help for commands</span>
            )}
            <span className="text-[10px] text-[#34D399]/60 font-mono animate-pulse">● running</span>
          </div>
        </div>
      </div>
    </div>
  );
}
