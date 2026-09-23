"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef, useReducer } from "react";
import { useTranslations } from "next-intl";
import {
  FiGithub,
  FiTerminal,
  FiPackage,
  FiZap,
  FiLayers,
  FiCode,
  FiDatabase,
  FiGlobe,
  FiShield,
  FiChevronDown,
  FiChevronUp,
  FiHeart,
  FiStar,
  FiExternalLink,
  FiCopy,
  FiCheck,
} from "react-icons/fi";
import {
  SiTypescript,
  SiDiscord,
  SiNpm,
} from "react-icons/si";
import SectionHeader from "@/components/ui/SectionHeader";
import GlassCard from "@/components/ui/GlassCard";

const GITHUB_REPO = "https://github.com/XSaitoKungX/discgen-cli";
const NPM_URL = "https://npmx.dev/package/discgen-cli";

// ── Features ────────────────────────────────────────────────────────────────
function useFeatures(t: (k: string) => string) {
  return [
    {
      icon: <FiTerminal className="w-6 h-6" />,
      title: t("featureWizard"),
      description: t("featureWizardDesc"),
      color: "#a78bfa",
    },
    {
      icon: <FiLayers className="w-6 h-6" />,
      title: t("featureTemplates"),
      description: t("featureTemplatesDesc"),
      color: "#60a5fa",
    },
    {
      icon: <FiDatabase className="w-6 h-6" />,
      title: t("featureDatabase"),
      description: t("featuresDatabaseDesc"),
      color: "#34d399",
    },
    {
      icon: <FiGlobe className="w-6 h-6" />,
      title: t("featureI18n"),
      description: t("featureI18nDesc"),
      color: "#f59e0b",
    },
    {
      icon: <FiShield className="w-6 h-6" />,
      title: t("featureComponents"),
      description: t("featureComponentsDesc"),
      color: "#f472b6",
    },
    {
      icon: <FiZap className="w-6 h-6" />,
      title: t("featureGenerate"),
      description: t("featureGenerateDesc"),
      color: "#fb923c",
    },
  ];
}

function useSteps(t: (k: string) => string) {
  return [
    { number: "01", title: t("step1Title"), description: t("step1Desc") },
    { number: "02", title: t("step2Title"), description: t("step2Desc") },
    { number: "03", title: t("step3Title"), description: t("step3Desc") },
  ];
}

function useFaqs(t: (k: string) => string) {
  return [
    { question: t("faq1Question"), answer: t("faq1Answer") },
    { question: t("faq2Question"), answer: t("faq2Answer") },
    { question: t("faq3Question"), answer: t("faq3Answer") },
    { question: t("faq4Question"), answer: t("faq4Answer") },
    { question: t("faq5Question"), answer: t("faq5Answer") },
    { question: t("faq6Question"), answer: t("faq6Answer") },
  ];
}

// ── Tech Stack ───────────────────────────────────────────────────────────────
const TECH_STACK = [
  { icon: <SiTypescript className="w-4 h-4" />, label: "TypeScript", color: "#3b82f6" },
  { icon: <SiDiscord className="w-4 h-4" />, label: "discord.js v14", color: "#5865F2" },
  { icon: <SiNpm className="w-4 h-4" />, label: "npm", color: "#cb3837" },
  { icon: <FiTerminal className="w-4 h-4" />, label: "@clack/prompts", color: "#a78bfa" },
  { icon: <FiPackage className="w-4 h-4" />, label: "commander", color: "#60a5fa" },
  { icon: <FiCode className="w-4 h-4" />, label: "vitest", color: "#34d399" },
];

// ── Presets ──────────────────────────────────────────────────────────────────
function usePresets(t: (k: string) => string) {
  return [
    {
      name: "basic",
      label: t("presetBasic"),
      description: t("presetBasicDesc"),
      features: ["Slash Commands", "Event Handler", "TypeScript", "ESLint"],
      color: "#60a5fa",
    },
    {
      name: "moderation",
      label: t("presetModeration"),
      description: t("presetModerationDesc"),
      features: ["ban / kick / timeout / warn", "Utility Commands", "Components v2", "Cooldown System"],
      color: "#f59e0b",
      badge: t("recommended"),
    },
    {
      name: "full",
      label: t("presetFull"),
      description: t("presetFullDesc"),
      features: ["All Commands", "Economy + DB", "i18n (EN/DE)", "Paginator + Embeds"],
      color: "#a78bfa",
      badge: t("featured"),
    },
  ];
}

// ── Generate Commands ────────────────────────────────────────────────────────
const GENERATE_TYPES = [
  { type: "command", color: "#60a5fa" },
  { type: "event", color: "#34d399" },
  { type: "guard", color: "#f59e0b" },
  { type: "button", color: "#f472b6" },
  { type: "select", color: "#fb923c" },
  { type: "modal", color: "#a78bfa" },
  { type: "service", color: "#94a3b8" },
];

// ── Accordion FAQ ────────────────────────────────────────────────────────────
function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
      >
        <span className="font-medium text-white/90 text-sm">{question}</span>
        {isOpen ? (
          <FiChevronUp className="w-4 h-4 text-white/40 shrink-0" />
        ) : (
          <FiChevronDown className="w-4 h-4 text-white/40 shrink-0" />
        )}
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="px-4 pb-4 border-t border-white/5"
        >
          <p className="text-sm text-white/55 leading-relaxed pt-3">{answer}</p>
        </motion.div>
      )}
    </div>
  );
}

// ── Copy Button ──────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className="ml-2 p-1.5 rounded-md hover:bg-white/10 transition-colors text-white/40 hover:text-white/80"
      title="Copy"
    >
      {copied ? <FiCheck className="w-3.5 h-3.5 text-green-400" /> : <FiCopy className="w-3.5 h-3.5" />}
    </button>
  );
}

// ── Terminal Live Demo ───────────────────────────────────────────────────────
const DEMO_SESSIONS: Array<{
  label: string;
  lines: Array<{ type: "cmd" | "out" | "highlight" | "blank" | "prompt"; text: string }>;
}> = [
  {
    label: "Full Bot",
    lines: [
      { type: "cmd", text: "npx discgen-cli my-bot" },
      { type: "out", text: "  ◆  What kind of commands?" },
      { type: "highlight", text: "  ●  Slash Commands" },
      { type: "out", text: "  ◆  Select features:" },
      { type: "highlight", text: "  ◆  ✔ Moderation  ✔ Economy  ✔ i18n" },
      { type: "out", text: "  ◆  Database:" },
      { type: "highlight", text: "  ●  SQLite (better-sqlite3)" },
      { type: "blank", text: "" },
      { type: "out", text: "  ✔  Created my-bot/" },
      { type: "out", text: "  ✔  Installing dependencies (bun)..." },
      { type: "out", text: "  ✔  git init" },
      { type: "blank", text: "" },
      { type: "highlight", text: "  🚀  Done! cd my-bot && bun run dev" },
    ],
  },
  {
    label: "Generate",
    lines: [
      { type: "cmd", text: "discgen-cli g command greet" },
      { type: "out", text: "  ✔  src/commands/slash/greet.ts" },
      { type: "blank", text: "" },
      { type: "cmd", text: "discgen-cli g event guildMemberAdd" },
      { type: "out", text: "  ✔  src/events/guildMemberAdd.ts" },
      { type: "blank", text: "" },
      { type: "cmd", text: "discgen-cli g service economy" },
      { type: "out", text: "  ✔  src/services/EconomyService.ts" },
      { type: "blank", text: "" },
      { type: "cmd", text: "discgen-cli g button confirm" },
      { type: "out", text: "  ✔  src/interactions/buttons/confirm.ts" },
    ],
  },
  {
    label: "Dry Run",
    lines: [
      { type: "cmd", text: "npx discgen-cli my-bot --template full --dry-run" },
      { type: "blank", text: "" },
      { type: "out", text: "  [dry-run] Would write 28 files:" },
      { type: "out", text: "  ├── src/index.ts" },
      { type: "out", text: "  ├── src/commands/slash/ping.ts" },
      { type: "out", text: "  ├── src/commands/slash/help.ts" },
      { type: "out", text: "  ├── src/commands/slash/ban.ts" },
      { type: "out", text: "  ├── src/commands/slash/balance.ts" },
      { type: "out", text: "  ├── src/i18n/en.ts" },
      { type: "out", text: "  ├── src/i18n/de.ts" },
      { type: "out", text: "  ├── src/utils/embed.ts" },
      { type: "out", text: "  ├── src/utils/paginator.ts" },
      { type: "highlight", text: "  └── ... 19 more" },
      { type: "blank", text: "" },
      { type: "highlight", text: "  No files written (--dry-run)" },
    ],
  },
];

type DemoState = { activeTab: number; displayed: number; done: boolean };
type DemoAction =
  | { type: "switch"; tab: number }
  | { type: "tick"; total: number };

function demoReducer(state: DemoState, action: DemoAction): DemoState {
  if (action.type === "switch") {
    return { activeTab: action.tab, displayed: 0, done: false };
  }
  if (action.type === "tick") {
    const next = state.displayed + 1;
    return { ...state, displayed: next, done: next >= action.total };
  }
  return state;
}

function TerminalDemo() {
  const [state, dispatch] = useReducer(demoReducer, {
    activeTab: 0,
    displayed: 0,
    done: false,
  });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const session = DEMO_SESSIONS[state.activeTab];

  useEffect(() => {
    if (state.done) return;
    const total = session.lines.length;
    if (state.displayed >= total) return;
    const delay = session.lines[state.displayed].type === "blank" ? 120 : 160;
    timerRef.current = setTimeout(
      () => dispatch({ type: "tick", total }),
      delay,
    );
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [state.displayed, state.done, session.lines]);

  const lineColor = (type: string) => {
    if (type === "cmd") return "text-[#a78bfa]";
    if (type === "highlight") return "text-[#34d399]";
    return "text-white/55";
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0d0f14] shadow-2xl shadow-black/40">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.03] border-b border-white/[0.06]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <span className="ml-2 text-xs text-white/30 font-mono">discgen-cli — terminal</span>
        <div className="ml-auto flex gap-1">
          {DEMO_SESSIONS.map((s, i) => (
            <button
              key={s.label}
              onClick={() => dispatch({ type: "switch", tab: i })}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                i === state.activeTab
                  ? "bg-[#a78bfa]/20 text-[#a78bfa] border border-[#a78bfa]/30"
                  : "text-white/30 hover:text-white/60"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal body */}
      <div className="p-5 font-mono text-sm min-h-[280px]">
        <div className="flex items-center gap-2 mb-4 text-white/20 text-xs">
          <FiTerminal className="w-3 h-3" />
          <span>user@dev:~/projects$</span>
        </div>

        {session.lines.slice(0, state.displayed).map((line, i) => (
          <div key={i} className={`leading-relaxed ${line.type === "blank" ? "h-2" : ""}`}>
            {line.type !== "blank" && (
              <span className={lineColor(line.type)}>
                {line.type === "cmd" && (
                  <span className="text-white/25 mr-2">$</span>
                )}
                {line.text}
              </span>
            )}
          </div>
        ))}

        {!state.done && state.displayed < session.lines.length && (
          <span className="inline-block w-2 h-4 bg-[#a78bfa] animate-pulse ml-0.5 align-middle" />
        )}
      </div>
    </div>
  );
}

// ── GitHub Stars ─────────────────────────────────────────────────────────────
function useGitHubStars() {
  const [stars, setStars] = useState<number | null>(null);
  useEffect(() => {
    fetch("https://api.github.com/repos/XSaitoKungX/discgen-cli")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setStars(d.stargazers_count ?? null))
      .catch(() => setStars(null));
  }, []);
  return stars;
}

// ── GitHub Releases ──────────────────────────────────────────────────────────
interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  prerelease: boolean;
  html_url: string;
}

function useGitHubReleases() {
  const [releases, setReleases] = useState<GitHubRelease[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("https://api.github.com/repos/XSaitoKungX/discgen-cli/releases?per_page=5")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => { setReleases(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => { setReleases([]); setLoading(false); });
  }, []);
  return { releases, loading };
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function DiscgenCliPage() {
  const t = useTranslations("discgenCli");
  const stars = useGitHubStars();
  const { releases, loading: releasesLoading } = useGitHubReleases();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const features = useFeatures(t);
  const steps = useSteps(t);
  const faqs = useFaqs(t);
  const presets = usePresets(t);

  const installCmd = "npx discgen-cli my-bot";

  return (
    <div className="min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
            style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }} />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-8"
            style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }} />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6 border"
              style={{ background: "rgba(124,58,237,0.1)", borderColor: "rgba(124,58,237,0.3)", color: "#a78bfa" }}>
              <FiTerminal className="w-3.5 h-3.5" />
              {t("badge")}
            </span>

            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
              {t("title")}{" "}
              <span className="bg-linear-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                {t("titleHighlight")}
              </span>
            </h1>

            <p className="text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
              {t("description")}
            </p>

            {/* Install command */}
            <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.04] border border-white/10 font-mono text-sm text-white/80">
                <span className="text-[#a78bfa]">$</span>
                <span>{installCmd}</span>
                <CopyButton text={installCmd} />
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={NPM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg shadow-violet-900/30 hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}
              >
                <SiNpm className="w-4 h-4" />
                {t("viewOnNpm")}
              </a>
              <a
                href={GITHUB_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-white/70 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300 hover:-translate-y-0.5"
              >
                <FiGithub className="w-4 h-4" />
                {t("viewOnGithub")}
                {stars !== null && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold">
                    <FiStar className="w-3 h-3 fill-current" />
                    {stars}
                  </span>
                )}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Terminal Live Demo ────────────────────────────────────────────── */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title={t("demoTitle")} subtitle={t("demoSubtitle")} />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-12"
          >
            <TerminalDemo />
          </motion.div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title={t("featuresTitle")} subtitle={t("featuresSubtitle")} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <GlassCard className="p-6 h-full hover:bg-white/[0.04] transition-colors">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${f.color}18`, color: f.color }}>
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{f.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Presets ──────────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title={t("presetsTitle")} subtitle={t("presetsSubtitle")} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {presets.map((preset, i) => (
              <motion.div
                key={preset.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="p-6 h-full relative overflow-hidden">
                  {preset.badge && (
                    <span className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full border"
                      style={{ background: `${preset.color}18`, borderColor: `${preset.color}40`, color: preset.color }}>
                      {preset.badge}
                    </span>
                  )}
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 font-mono text-sm font-bold"
                    style={{ background: `${preset.color}18`, color: preset.color }}>
                    {preset.name === "basic" ? "B" : preset.name === "moderation" ? "M" : "F"}
                  </div>
                  <h3 className="font-bold text-white mb-1">{preset.label}</h3>
                  <p className="text-xs text-white/40 mb-4 leading-relaxed">{preset.description}</p>
                  <ul className="space-y-1.5">
                    {preset.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-white/60">
                        <span style={{ color: preset.color }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 pt-4 border-t border-white/5">
                    <code className="text-xs font-mono text-white/40">
                      --template {preset.name}
                    </code>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Generate Subcommand ───────────────────────────────────────────── */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title={t("generateTitle")} subtitle={t("generateSubtitle")} />
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {GENERATE_TYPES.map((g, i) => {
              const cmd = `discgen-cli g ${g.type} <name>`;
              return (
                <motion.div
                  key={g.type}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <GlassCard className="flex items-center justify-between px-4 py-3 hover:bg-white/[0.04] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ background: g.color }} />
                      <code className="text-sm font-mono text-white/70">{cmd}</code>
                    </div>
                    <CopyButton text={cmd} />
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <GlassCard className="p-5 border-[#a78bfa]/20">
              <div className="flex items-start gap-3">
                <FiCode className="w-5 h-5 text-[#a78bfa] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-white mb-1">{t("generateNote")}</p>
                  <p className="text-xs text-white/50 leading-relaxed">{t("generateNoteDesc")}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* ── How it Works ─────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title={t("howItWorksTitle")} subtitle={t("howItWorksSubtitle")} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-7 left-full w-full h-px bg-linear-to-r from-white/15 to-transparent" />
                )}
                <div className="text-5xl font-black mb-4 select-none"
                  style={{ color: "rgba(167,139,250,0.12)" }}>
                  {step.number}
                </div>
                <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech Stack ───────────────────────────────────────────────────── */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-bold text-white mb-8">{t("stackTitle")}</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {TECH_STACK.map((tech) => (
              <div
                key={tech.label}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] transition-colors"
                style={{ color: tech.color }}
              >
                {tech.icon}
                <span className="text-sm font-medium text-white/80">{tech.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title={t("faqTitle")} subtitle={t("faqSubtitle")} />
          <div className="space-y-2.5 mt-10">
            {faqs.map((faq, index) => (
              <FaqItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaq === index}
                onToggle={() => setOpenFaq(openFaq === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Changelog ────────────────────────────────────────────────────── */}
      <section className="py-16 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <SectionHeader title={t("changelogTitle")} subtitle={t("changelogSubtitle")} />
            <a
              href={`${GITHUB_REPO}/releases`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors shrink-0"
            >
              {t("viewAllReleases")} <FiExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <GlassCard className="p-5">
            {releasesLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-7 h-7 border-2 border-[#a78bfa] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : releases.length > 0 ? (
              <div className="space-y-3">
                {releases.map((release, index) => (
                  <motion.a
                    key={release.id}
                    href={release.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="group block p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] hover:border-white/10 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-white group-hover:text-[#a78bfa] transition-colors">
                            {release.name || release.tag_name}
                          </span>
                          {release.prerelease && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25">
                              pre-release
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-white/35">
                          {t("released")} {new Date(release.published_at).toLocaleDateString()}
                        </p>
                        {release.body && (
                          <p className="text-xs text-white/50 mt-2 line-clamp-2">
                            {release.body.substring(0, 140).replace(/#{1,6}\s/g, "").trim()}
                          </p>
                        )}
                      </div>
                      <FiExternalLink className="w-3.5 h-3.5 text-white/25 group-hover:text-white/50 transition-colors shrink-0 mt-1" />
                    </div>
                  </motion.a>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiGithub className="w-10 h-10 text-white/15 mx-auto mb-3" />
                <p className="text-sm text-white/50 mb-4">{t("noReleasesFound")}</p>
                <a
                  href={`${GITHUB_REPO}/releases`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#a78bfa]/10 hover:bg-[#a78bfa]/15 border border-[#a78bfa]/20 text-[#a78bfa] text-sm font-medium transition-all"
                >
                  <FiExternalLink className="w-4 h-4" />
                  {t("viewReleasesOnGithub")}
                </a>
              </div>
            )}
          </GlassCard>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-10 relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at top right, rgba(124,58,237,0.08), transparent 60%)" }} />
              <h2 className="text-3xl font-bold text-white mb-3">{t("ctaTitle")}</h2>
              <p className="text-white/50 mb-8 max-w-lg mx-auto leading-relaxed">{t("ctaDescription")}</p>

              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.06] border border-white/10 font-mono text-sm text-white/70">
                  <span className="text-[#a78bfa]">$</span>
                  <span>{installCmd}</span>
                  <CopyButton text={installCmd} />
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href={NPM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg shadow-violet-900/25 hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}
                >
                  <SiNpm className="w-4 h-4" />
                  {t("viewOnNpm")}
                </a>
                <a
                  href={GITHUB_REPO}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-white/60 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300"
                >
                  <FiGithub className="w-4 h-4" />
                  {t("viewOnGithub")}
                </a>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <div className="pb-16 text-center">
        <div className="flex items-center justify-center gap-5 text-sm text-white/25 flex-wrap">
          <span className="flex items-center gap-1.5">
            {t("madeWith")} <FiHeart className="w-3.5 h-3.5 text-red-400" /> {t("by")} XSaitoKungX
          </span>
          <span>·</span>
          <a href={`${GITHUB_REPO}/blob/main/LICENSE`} target="_blank" rel="noopener noreferrer"
            className="hover:text-white/60 transition-colors">
            {t("license")}
          </a>
          <span>·</span>
          <a href={NPM_URL} target="_blank" rel="noopener noreferrer"
            className="hover:text-white/60 transition-colors flex items-center gap-1">
            <SiNpm className="w-3.5 h-3.5" /> npm
          </a>
          <span>·</span>
          <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer"
            className="hover:text-white/60 transition-colors flex items-center gap-1">
            <FiGithub className="w-3.5 h-3.5" /> GitHub
          </a>
        </div>
      </div>

    </div>
  );
}
