"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  FiGithub,
  FiMonitor,
  FiCpu,
  FiActivity,
  FiWifi,
  FiZap,
  FiList,
  FiChevronDown,
  FiChevronUp,
  FiHeart,
} from "react-icons/fi";
import { SiRust, SiReact, SiTailwindcss, SiTypescript } from "react-icons/si";
import { FaLinux, FaWindows, FaApple } from "react-icons/fa";
import { useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import GlassCard from "@/components/ui/GlassCard";
import { SystemMonitorDownloadButtons } from "@/components/system-monitor/DownloadButtons";

const GITHUB_REPO = "https://github.com/XSaitoKungX/System-Monitor";

function useFeatures(t: (k: string) => string) {
  return [
    { icon: <FiMonitor className="w-6 h-6" />, title: t("featureDashboard"), description: t("featureDashboardDesc") },
    { icon: <FiCpu className="w-6 h-6" />, title: t("featureCpu"), description: t("featureCpuDesc") },
    { icon: <FiActivity className="w-6 h-6" />, title: t("featureGpu"), description: t("featureGpuDesc") },
    { icon: <FiWifi className="w-6 h-6" />, title: t("featureNetwork"), description: t("featureNetworkDesc") },
    { icon: <FiZap className="w-6 h-6" />, title: t("featureSpeedtest"), description: t("featureSpeedtestDesc") },
    { icon: <FiList className="w-6 h-6" />, title: t("featureProcesses"), description: t("featureProcessesDesc") },
  ];
}

function usePlatforms(t: (k: string) => string) {
  return [
    { icon: FaLinux, name: t("platformLinux"), desc: t("platformLinuxDesc"), color: "#f97316" },
    { icon: FaWindows, name: t("platformWindows"), desc: t("platformWindowsDesc"), color: "#3b82f6" },
    { icon: FaApple, name: t("platformMac"), desc: t("platformMacDesc"), color: "#a855f7" },
  ];
}

function useSteps(t: (k: string) => string) {
  return [
    { number: "01", title: t("installStep1"), description: t("installStep1Desc") },
    { number: "02", title: t("installStep2"), description: t("installStep2Desc") },
    { number: "03", title: t("installStep3"), description: t("installStep3Desc") },
  ];
}

function useFaqs(t: (k: string) => string) {
  return [
    { question: t("faq1Question"), answer: t("faq1Answer") },
    { question: t("faq2Question"), answer: t("faq2Answer") },
    { question: t("faq3Question"), answer: t("faq3Answer") },
    { question: t("faq4Question"), answer: t("faq4Answer") },
  ];
}

const TECH_STACK = [
  { icon: <SiRust className="w-5 h-5" />, label: "Rust", color: "#f97316" },
  { icon: <SiReact className="w-5 h-5" />, label: "React 19", color: "#38bdf8" },
  { icon: <SiTypescript className="w-5 h-5" />, label: "TypeScript", color: "#3b82f6" },
  { icon: <SiTailwindcss className="w-5 h-5" />, label: "Tailwind CSS v4", color: "#06b6d4" },
  { icon: <span className="text-base font-bold">T2</span>, label: "Tauri v2", color: "#fcd34d" },
  { icon: <span className="text-base font-bold">R</span>, label: "Recharts", color: "#22c55e" },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors"
      >
        <span className="text-sm font-medium text-white/80">{question}</span>
        {open ? (
          <FiChevronUp className="w-4 h-4 text-white/40 shrink-0" />
        ) : (
          <FiChevronDown className="w-4 h-4 text-white/40 shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-white/50 leading-relaxed border-t border-white/5">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function SystemMonitorPage() {
  const t = useTranslations("systemMonitor");
  const features = useFeatures(t);
  const platforms = usePlatforms(t);
  const steps = useSteps(t);
  const faqs = useFaqs(t);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
            style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }} />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-8"
            style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }} />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6 border"
              style={{ background: "rgba(59,130,246,0.1)", borderColor: "rgba(59,130,246,0.3)", color: "#60a5fa" }}>
              <FiMonitor className="w-3.5 h-3.5" />
              {t("badge")}
            </span>

            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
              {t("title")}{" "}
              <span className="bg-linear-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                {t("titleHighlight")}
              </span>
            </h1>

            <p className="text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
              {t("description")}
            </p>

            <SystemMonitorDownloadButtons />
            <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
              <a
                href={GITHUB_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-medium text-white/60 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300 text-sm"
              >
                <FiGithub className="w-4 h-4" />
                {t("viewOnGithub")}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title={t("featuresTitle")} subtitle={t("featuresSubtitle")} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <GlassCard className="p-6 h-full">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: "rgba(59,130,246,0.12)", color: "#60a5fa" }}>
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

      {/* Platform Support */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title={t("platformsTitle")} subtitle={t("platformsSubtitle")} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-12">
            {platforms.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="p-6 text-center">
                  <span className="text-4xl mb-3 block" style={{ color: p.color }}>
                    <p.icon />
                  </span>
                  <h3 className="font-bold text-white mb-2">{p.name}</h3>
                  <p className="text-xs text-white/50 leading-relaxed">{p.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20">
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

      {/* Installation Steps */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title={t("installTitle")} subtitle={t("installSubtitle")} />
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
                <div className="text-5xl font-black mb-4 select-none"
                  style={{ color: "rgba(59,130,246,0.15)" }}>
                  {step.number}
                </div>
                <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{step.description}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 -right-4 text-white/10 text-2xl">→</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title={t("faqTitle")} subtitle="" />
          <div className="space-y-3 mt-10">
            {faqs.map((faq) => (
              <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-10 relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at top right, rgba(59,130,246,0.08), transparent 60%)" }} />
              <h2 className="text-3xl font-bold text-white mb-3">{t("ctaTitle")}</h2>
              <p className="text-white/50 mb-8 max-w-lg mx-auto">{t("ctaDescription")}</p>
              <SystemMonitorDownloadButtons />
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                <a
                  href={GITHUB_REPO}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white/60 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300 text-sm"
                >
                  <FiGithub className="w-4 h-4" />
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
    </div>
  );
}
