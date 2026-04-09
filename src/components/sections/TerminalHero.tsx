"use client";

import { useEffect, useRef, useState, useCallback, useMemo, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { registry, CommandContext } from "@/lib/terminal/commands";

interface TerminalLine {
  id: number;
  type: "status" | "command" | "output" | "menu" | "ascii" | "separator" | "error" | "info";
  content: string;
  prefix?: string;
  prefixColor?: string;
  instant?: boolean;
}


const BOOT_LINES: Omit<TerminalLine, "id">[] = [
  { type: "status", content: "boot",           prefix: "[INIT]", prefixColor: "#A78BFA" },
  { type: "status", content: "loading_modules",prefix: "[ OK ]", prefixColor: "#34D399" },
  { type: "status", content: "connecting",     prefix: "[ OK ]", prefixColor: "#34D399" },
  { type: "status", content: "ready",          prefix: "[ OK ]", prefixColor: "#34D399" },
  { type: "separator", content: "" },
  { type: "status", content: "session_start",  prefix: "[SYSTEM]", prefixColor: "#A78BFA" },
  { type: "status", content: "__SESSION_INFO__", prefix: "[TIME]", prefixColor: "#FBBF24", instant: true },
  { type: "separator", content: "" },
  { type: "status", content: "fetching",       prefix: "[LOAD]", prefixColor: "#FBBF24" },
  { type: "status", content: "portfolio_ready",prefix: "[ OK ]", prefixColor: "#34D399" },
  { type: "separator", content: "" },
];

// BOOT_DELAYS for 10 entries
const BOOT_DELAYS = [400, 500, 400, 350, 300, 400, 200, 300, 400, 600, 200];

const MENU_LINES: Omit<TerminalLine, "id">[] = [
  { type: "menu", content: "menu_projects", prefix: "[1]", prefixColor: "#A78BFA" },
  { type: "menu", content: "menu_skills",   prefix: "[2]", prefixColor: "#60A5FA" },
  { type: "menu", content: "menu_contact",  prefix: "[3]", prefixColor: "#34D399" },
  { type: "separator", content: "" },
  { type: "info", content: "menu_hint" },
];

function Prompt({ username }: { username: string }) {
  return (
    <span className="flex items-center gap-0.5 shrink-0">
      <span className="text-[#34D399]">{username}</span>
      <span className="text-white/30">@</span>
      <span className="text-[#60A5FA]">dev</span>
      <span className="text-white/30">:</span>
      <span className="text-[#A78BFA]">~</span>
      <span className="text-[#FBBF24] ml-1">$</span>
    </span>
  );
}

export default function TerminalHero() {
  const t = useTranslations("home.terminal");
  const locale = useLocale();
  const router = useRouter();
  const { data: session } = useSession();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lineIdCounter = useRef(0);
  const nextId = useCallback(() => ++lineIdCounter.current, []);

  const username = useMemo(
    () => (session?.user?.name ?? "guest").toLowerCase().replace(/\s+/g, ""),
    [session?.user?.name]
  );
  const usernameRef = useRef(username);
  useEffect(() => { usernameRef.current = username; }, [username]);

  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    lineIdCounter.current = 0;
    setLines([]);
  }, []);

  const push = useCallback((...newLines: Omit<TerminalLine, "id">[]) => {
    setLines((prev) => [
      ...prev,
      ...newLines.map((l) => ({ ...l, id: nextId() })),
    ]);
  }, [nextId]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      for (let i = 0; i < BOOT_LINES.length; i++) {
        if (cancelled) break;
        await new Promise((r) => setTimeout(r, BOOT_DELAYS[i] ?? 200));
        if (cancelled) break;
        const raw = BOOT_LINES[i];
        let content: string;
        if (raw.content === "__SESSION_INFO__") {
          const now = new Date();
          const timeStr = now.toLocaleString(locale, {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
          content = `${timeStr} — ${locale === "de" ? "Angemeldet als" : "Logged in as"} ${usernameRef.current}`;
        } else {
          content = raw.type === "status" || raw.type === "info"
            ? t(raw.content as Parameters<typeof t>[0])
            : raw.content;
        }
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
  }, [push, t, locale]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [lines, input]);

  useEffect(() => {
    if (interactive) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [interactive]);

  const runCommand = useCallback(async (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;

    push({ type: "command", content: cmd });
    setHistory((h) => [cmd, ...h.slice(0, 49)]);
    setHistoryIdx(-1);

    const parts = cmd.split(" ");
    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1);

    const commandType = registry.resolve(commandName);

    if (commandType) {
      const ctx: CommandContext = {
        username,
        locale,
        router: { push: (path: string) => router.push(path) },
        t,
      };

      const result = await registry.execute(commandType, args, ctx);

      if (result.clear) {
        setLines([]);
        return;
      }

      result.lines.forEach((l) => push({ type: l.type, content: l.content }));

      if (result.redirect) {
        setTimeout(() => router.push(result.redirect!.path), result.redirect.delay);
      }
    } else {
      push(
        { type: "error", content: t("cmd_not_found", { cmd: commandName }) },
        { type: "info", content: t("cmd_try_help") },
        { type: "separator", content: "" },
      );
    }
  }, [push, t, locale, router, username]);

  const handleKey = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const val = input;
      setInput("");
      setHistoryIdx(-1);
      runCommand(val);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const nextIdx = Math.min(historyIdx + 1, history.length - 1);
      setHistoryIdx(nextIdx);
      setInput(history[nextIdx] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIdx = Math.max(historyIdx - 1, -1);
      setHistoryIdx(nextIdx);
      setInput(nextIdx === -1 ? "" : (history[nextIdx] ?? ""));
    }
  }, [input, history, historyIdx, runCommand]);

  return (
    <div
      className="relative w-full max-w-3xl mx-auto cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="absolute -inset-1 bg-linear-to-r from-[#7C3AED]/30 via-[#4F46E5]/20 to-[#7C3AED]/30 rounded-2xl blur-xl opacity-60" />

      <div className="relative bg-[#0D1117]/95 border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#161B22] border-b border-white/5">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57] shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-[#27C840] shadow-sm" />
          </div>
          <div className="flex-1 flex justify-center">
            <span className="text-xs text-white/30 font-mono tracking-wider">xsaitox.dev — terminal</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-emerald-500/70 font-mono">online</span>
          </div>
        </div>

        {/* Output area */}
        <div className="relative h-[420px] overflow-y-auto scrollbar-none p-4 font-mono text-sm">
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
                    <Prompt username={username} />
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
              <Prompt username={username} />
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
