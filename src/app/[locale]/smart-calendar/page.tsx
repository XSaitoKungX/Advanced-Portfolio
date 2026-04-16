"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  FiCalendar,
  FiGithub,
  FiCpu,
  FiBell,
  FiClock,
  FiMessageSquare,
  FiKey,
  FiChevronDown,
  FiChevronUp,
  FiHeart,
  FiZap,
  FiStar,
} from "react-icons/fi";
import { FaLinux } from "react-icons/fa";
import { SiDart, SiFlutter, SiSqlite, SiGooglegemini } from "react-icons/si";
import { useState, useEffect } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import GlassCard from "@/components/ui/GlassCard";

const GITHUB_REPO = "https://github.com/XSaitoKungX/Smart-Calendar";
const ACCENT = "#7C3AED";
const ACCENT_LIGHT = "#A78BFA";

const TECH_STACK = [
  { icon: <SiFlutter className="w-5 h-5" />, label: "Flutter", color: "#54C5F8" },
  { icon: <SiDart className="w-5 h-5" />, label: "Dart", color: "#0175C2" },
  { icon: <SiSqlite className="w-5 h-5" />, label: "Drift / SQLite", color: "#4DB33D" },
  { icon: <SiGooglegemini className="w-5 h-5" />, label: "Gemini / Claude", color: "#8B5CF6" },
  { icon: <span className="text-sm font-bold">OR</span>, label: "OpenRouter", color: "#10B981" },
  { icon: <FaLinux className="w-5 h-5" />, label: "Linux Desktop", color: "#F97316" },
];

function useFeatures(t: (k: string) => string) {
  return [
    {
      icon: <FiCalendar className="w-6 h-6" />,
      title: t("featureCalendar"),
      description: t("featureCalendarDesc"),
    },
    {
      icon: <FiMessageSquare className="w-6 h-6" />,
      title: t("featureKana"),
      description: t("featureKanaDesc"),
    },
    {
      icon: <FiBell className="w-6 h-6" />,
      title: t("featureReminders"),
      description: t("featureRemindersDesc"),
    },
    {
      icon: <FiClock className="w-6 h-6" />,
      title: t("featureClock"),
      description: t("featureClockDesc"),
    },
    {
      icon: <FiKey className="w-6 h-6" />,
      title: t("featureAiKeys"),
      description: t("featureAiKeysDesc"),
    },
    {
      icon: <FiCpu className="w-6 h-6" />,
      title: t("featureOffline"),
      description: t("featureOfflineDesc"),
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
  ];
}

function FaqItem({ question, answer, isOpen, onToggle }: {
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
        <span className="font-medium text-white">{question}</span>
        {isOpen
          ? <FiChevronUp className="w-5 h-5 text-white/60 shrink-0" />
          : <FiChevronDown className="w-5 h-5 text-white/60 shrink-0" />
        }
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="px-4 pb-4"
        >
          <p className="text-sm text-white/60 leading-relaxed">{answer}</p>
        </motion.div>
      )}
    </div>
  );
}

interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  prerelease: boolean;
  html_url: string;
}

export default function SmartCalendarPage() {
  const t = useTranslations("smartCalendar");
  const features = useFeatures(t);
  const steps = useSteps(t);
  const faqs = useFaqs(t);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [stars, setStars] = useState<number | null>(null);
  const [releases, setReleases] = useState<GitHubRelease[]>([]);
  const [releasesLoading, setReleasesLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.github.com/repos/XSaitoKungX/Smart-Calendar")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => setStars(d.stargazers_count ?? null))
      .catch(() => setStars(null));

    fetch("https://api.github.com/repos/XSaitoKungX/Smart-Calendar/releases?per_page=5")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => { setReleases(Array.isArray(d) ? d : []); setReleasesLoading(false); })
      .catch(() => { setReleases([]); setReleasesLoading(false); });
  }, []);

  return (
    <main className="min-h-screen">

      {/* Hero */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
            style={{ background: `radial-gradient(circle, ${ACCENT}, transparent)` }} />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-8"
            style={{ background: `radial-gradient(circle, ${ACCENT_LIGHT}, transparent)` }} />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6 border"
              style={{ background: `rgba(124,58,237,0.1)`, borderColor: `rgba(124,58,237,0.3)`, color: ACCENT_LIGHT }}
            >
              <FiCalendar className="w-3.5 h-3.5" />
              {t("badge")}
            </span>

            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
              {t("title")}{" "}
              <span className="bg-linear-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                {t("titleHighlight")}
              </span>
            </h1>

            <p className="text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
              {t("description")}
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={`${GITHUB_REPO}/releases/latest`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg hover:-translate-y-0.5"
                style={{ background: `linear-gradient(135deg, ${ACCENT}, #6D28D9)`, boxShadow: `0 8px 24px ${ACCENT}40` }}
              >
                <FiZap className="w-4 h-4" />
                {t("downloadLatest")}
              </a>
              <a
                href={GITHUB_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-medium text-white/70 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300 text-sm"
              >
                <FiGithub className="w-4 h-4" />
                {t("viewOnGithub")}
                {stars !== null && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border"
                    style={{ background: "rgba(251,191,36,0.1)", borderColor: "rgba(251,191,36,0.2)", color: "#FBBF24" }}>
                    <FiStar className="w-3 h-3 fill-current" />
                    {stars}
                  </span>
                )}
              </a>
            </div>

            {/* Platform badge */}
            <div className="flex items-center justify-center gap-2 mt-6 text-sm text-white/30">
              <FaLinux className="w-4 h-4" />
              <span>{t("platformNote")}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
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
                <GlassCard className="p-6 h-full">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `rgba(124,58,237,0.12)`, color: ACCENT_LIGHT }}
                  >
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

      {/* Tech Stack */}
      <section className="py-20 border-t border-white/5 bg-white/2">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-10">{t("stackTitle")}</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {TECH_STACK.map((tech) => (
              <div
                key={tech.label}
                className="flex items-center gap-2.5 px-5 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/8 transition-colors"
                style={{ color: tech.color }}
              >
                {tech.icon}
                <span className="text-sm font-semibold text-white">{tech.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kana AI Highlight */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <GlassCard className="p-8 md:p-12 relative overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at top right, rgba(124,58,237,0.12), transparent 60%)` }}
            />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: `rgba(124,58,237,0.15)` }}
              >
                <FiMessageSquare className="w-10 h-10" style={{ color: ACCENT_LIGHT }} />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{t("kanaTitle")}</h2>
                <p className="text-white/60 leading-relaxed mb-4">{t("kanaDescription")}</p>
                <div className="flex flex-wrap gap-2">
                  {[t("kanaProvider1"), t("kanaProvider2"), t("kanaProvider3"), t("kanaProvider4")].map((p) => (
                    <span key={p} className="px-3 py-1 rounded-full text-xs font-medium border"
                      style={{ background: `rgba(124,58,237,0.1)`, borderColor: `rgba(124,58,237,0.25)`, color: ACCENT_LIGHT }}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 border-t border-white/5 bg-white/2">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title={t("stepsTitle")} subtitle={t("stepsSubtitle")} />
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
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-linear-to-r from-white/20 to-transparent" />
                )}
                <div className="text-5xl font-black mb-4 select-none"
                  style={{ color: `rgba(124,58,237,0.18)` }}>
                  {step.number}
                </div>
                <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title={t("faqTitle")} subtitle="" />
          <div className="space-y-3 mt-10">
            {faqs.map((faq, i) => (
              <FaqItem
                key={i}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Changelog */}
      <section className="py-20 border-t border-white/5 bg-white/2">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <SectionHeader title={t("changelogTitle")} subtitle={t("changelogSubtitle")} />
            <a
              href={`${GITHUB_REPO}/releases`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors shrink-0 mb-16"
            >
              {t("viewAllReleases")}
              <FiGithub className="w-4 h-4" />
            </a>
          </div>
          <GlassCard className="p-6">
            {releasesLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
                  style={{ borderColor: `${ACCENT} transparent transparent transparent` }} />
              </div>
            ) : releases.length > 0 ? (
              <div className="space-y-4">
                {releases.map((release, i) => (
                  <motion.div
                    key={release.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <a
                      href={release.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 rounded-xl bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-white group-hover:text-violet-400 transition-colors">
                              {release.name || release.tag_name}
                            </span>
                            {release.prerelease && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                pre-release
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-white/40">
                            {new Date(release.published_at).toLocaleDateString()}
                          </p>
                          {release.body && (
                            <p className="text-sm text-white/50 mt-2 line-clamp-2">
                              {release.body.substring(0, 150).replace(/#{1,6}\s/g, "").trim()}...
                            </p>
                          )}
                        </div>
                        <FiGithub className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors shrink-0 mt-1" />
                      </div>
                    </a>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiGithub className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/50 mb-4">{t("noReleasesFound")}</p>
                <a
                  href={`${GITHUB_REPO}/releases`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 border text-sm"
                  style={{ background: `rgba(124,58,237,0.1)`, borderColor: `rgba(124,58,237,0.2)`, color: ACCENT_LIGHT }}
                >
                  <FiGithub className="w-4 h-4" />
                  {t("viewReleasesOnGithub")}
                </a>
              </div>
            )}
          </GlassCard>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-10 relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at top right, rgba(124,58,237,0.08), transparent 60%)` }} />
              <h2 className="text-3xl font-bold text-white mb-3">{t("ctaTitle")}</h2>
              <p className="text-white/50 mb-8 max-w-lg mx-auto">{t("ctaDescription")}</p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href={`${GITHUB_REPO}/releases/latest`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${ACCENT}, #6D28D9)`, boxShadow: `0 8px 24px ${ACCENT}40` }}
                >
                  <FiZap className="w-4 h-4" />
                  {t("downloadLatest")}
                </a>
                <a
                  href={GITHUB_REPO}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white/60 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300 text-sm"
                >
                  <FiGithub className="w-5 h-5" />
                  {t("viewOnGithub")}
                </a>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <div className="pb-16 text-center">
        <div className="flex items-center justify-center gap-5 text-sm text-white/30">
          <span className="flex items-center gap-1.5">
            {t("madeWith")} <FiHeart className="w-3.5 h-3.5 text-red-400" /> {t("by")} XSaitoKungX
          </span>
          <span>·</span>
          <a href={`${GITHUB_REPO}/blob/main/LICENSE`} target="_blank" rel="noopener noreferrer"
            className="hover:text-white/60 transition-colors">
            {t("license")}
          </a>
          <span>·</span>
          <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer"
            className="hover:text-white/60 transition-colors flex items-center gap-1">
            <FiGithub className="w-3.5 h-3.5" /> GitHub
          </a>
        </div>
      </div>
    </main>
  );
}
