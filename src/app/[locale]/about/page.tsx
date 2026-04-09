"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { FiDownload, FiCode, FiZap, FiLayout, FiBookOpen } from "react-icons/fi";
import SectionHeader from "@/components/ui/SectionHeader";
import GlassCard from "@/components/ui/GlassCard";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";

function calcAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

const BIRTH_DATE = new Date(2004, 8, 22); // 22.09.2004

function getAboutContent(locale: "de" | "en", age: number) {
  if (locale === "de") {
    return `## Wer ich bin

Ich bin Mark, ${age} Jahre alt, aus Deutschland und aktuell in der Ausbildung zum **Fachinformatiker für Anwendungsentwicklung** an der Leuphana Universität (voraussichtlicher Abschluss: 2027).

Angefangen hat alles mit der US-Serie **"Scorpion"** – die Geschichte um Walter O'Brien und sein Team hat mich als 13-Jähriger so fasziniert, dass ich anfing zu verstehen, wie Software wirklich funktioniert. Seitdem höre ich nicht mehr auf.

Ich habe mir das Programmieren größtenteils selbst beigebracht – von ersten Python-Skripten und Discord-Bots bis hin zu modernen Web-Apps mit React und Next.js. Mein öffentlicher Discord-Bot **Astra** läuft inzwischen in über 90 Servern.

## Was mich antreibt

Ich baue Software, die ich selbst gerne nutzen würde – funktional, schnell und visuell ansprechend. Mir ist wichtig:

- **Sauberer Code** – wartbar, verständlich, strukturiert
- **Gutes Design** – visuelle Qualität und durchdachte UX
- **Ehrliches Handwerk** – solide Grundlagen statt Buzzword-Bingo
- **Weiterentwicklung** – neugierig bleiben, Dinge ausprobieren

## Tech-Stack

Mein aktueller Hauptstack: **TypeScript**, **Next.js**, **React**, **Node.js / Bun** und **PostgreSQL**. Für Deployment und Infrastruktur nutze ich **Docker**, **Nginx** und **Vercel**.

Ich bin kein Experte in allem – aber ich bringe in jedem dieser Bereiche echte Projekterfahrung mit.`;
  }
  return `## Who I Am

I'm Mark, ${age} years old, from Germany, currently doing my apprenticeship as an **IT Specialist for Application Development** at Leuphana University (expected graduation: 2027).

It all started with the TV show **"Scorpion"** – the story of Walter O'Brien and his team fascinated me at age 13 and made me want to understand how software actually works. I haven't stopped since.

I'm largely self-taught – from early Python scripts and Discord bots to modern web apps with React and Next.js. My public Discord bot **Astra** is now running in over 90 servers.

## What Drives Me

I build software I'd want to use myself – functional, fast and visually polished. What matters to me:

- **Clean code** – maintainable, readable, well-structured
- **Good design** – visual quality and thoughtful UX
- **Honest craft** – solid foundations over buzzword-driven choices
- **Continuous growth** – staying curious, trying things out

## Tech Stack

My current main stack: **TypeScript**, **Next.js**, **React**, **Node.js / Bun** and **PostgreSQL**. For deployment and infrastructure I use **Docker**, **Nginx** and **Vercel**.

I'm not an expert in everything – but I bring real project experience to each of these areas.`;
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function AboutPage() {
  const t = useTranslations("about");
  const locale = useLocale();
  const age = calcAge(BIRTH_DATE);

  const values = [
    { icon: FiCode, key: "clean_code", color: "#A78BFA" },
    { icon: FiZap, key: "performance", color: "#FBBF24" },
    { icon: FiLayout, key: "design", color: "#34D399" },
    { icon: FiBookOpen, key: "learning", color: "#60A5FA" },
  ] as const;

  const stats = [
    { value: `${age}`, label: t("stats.age") },
    { value: "2", label: t("stats.experience") },
    { value: "90+", label: t("stats.servers") },
    { value: "2027", label: t("stats.graduation") },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t("title")} subtitle={t("subtitle")} align="left" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <motion.div {...fadeUp}>
            <MarkdownRenderer content={getAboutContent(locale as "de" | "en", age)} />
            <motion.a
              href="/cv.pdf"
              download
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 text-sm font-semibold text-white bg-linear-to-r from-[#7C3AED] to-[#4F46E5] rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-[#7C3AED]/25"
            >
              <FiDownload className="w-4 h-4" />
              {t("download_cv")}
            </motion.a>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <GlassCard className="p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#7C3AED] to-[#4F46E5] flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-[#7C3AED]/30">
                  M
                </div>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-background" />
              </div>
              <div>
                <p className="text-base font-bold text-white">Mark</p>
                <p className="text-sm text-[#A78BFA]">{locale === "de" ? "Azubi Fachinformatiker" : "CS Apprentice"}</p>
                <span className="inline-flex items-center gap-1.5 mt-1.5 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                  {locale === "de" ? "Verfügbar" : "Available"}
                </span>
              </div>
            </div>
          </GlassCard>

          <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlassCard className="p-6 text-center">
                    <div className="text-3xl font-bold text-gradient-purple mb-1">{stat.value}</div>
                    <div className="text-sm text-white/50">{stat.label}</div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            <GlassCard className="p-6">
              <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">
                {t("values.title")}
              </h3>
              <div className="space-y-4">
                {values.map(({ icon: Icon, key, color }, i) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div
                      className="mt-0.5 p-2 rounded-lg shrink-0"
                      style={{ background: `${color}15`, border: `1px solid ${color}25` }}
                    >
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white/80">{t(`values.${key}`)}</div>
                      <div className="text-xs text-white/40 mt-0.5">{t(`values.${key}_desc`)}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
