"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "motion/react";
import {
  FiArrowDown,
  FiArrowUpRight,
  FiBookOpen,
  FiCalendar,
  FiCode,
  FiDownload,
  FiFileText,
  FiLayout,
  FiMapPin,
  FiZap,
} from "react-icons/fi";
import { SiDiscord } from "react-icons/si";
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

Angefangen hat alles mit der US-Serie **"Scorpion"** – die Geschichte um Walter O'Brien und sein Team hat mich mit 13 fasziniert. Mit 14 begann ich selbst zu programmieren und wollte verstehen, wie Software wirklich funktioniert.

Ich habe mir das Programmieren größtenteils selbst beigebracht – von ersten Python-Skripten und Discord-Bots bis hin zu modernen Web-Apps mit React und Next.js. Außerdem entwickle ich den öffentlichen Discord-Bot **Astra**.

## Was mich antreibt

Ich baue Software, die ich selbst gerne nutzen würde – funktional, schnell und visuell ansprechend. Mir ist wichtig:

- **Sauberer Code** – wartbar, verständlich, strukturiert
- **Gutes Design** – visuelle Qualität und durchdachte UX
- **Ehrliches Handwerk** – solide Grundlagen statt Buzzword-Bingo
- **Weiterentwicklung** – neugierig bleiben, Dinge ausprobieren

## Tech-Stack

Mein aktueller Hauptstack: **TypeScript**, **Next.js**, **React**, **Node.js / Bun** und **PostgreSQL**. Diese Website läuft aktuell in einem Bun-Container auf einem Hetzner-Server mit Pelican; der Umzug ins eigene Homelab ist geplant.

Ich bin kein Experte in allem – aber ich bringe in jedem dieser Bereiche echte Projekterfahrung mit.`;
  }
  return `## Who I Am

I'm Mark, ${age} years old, from Germany, currently doing my apprenticeship as an **IT Specialist for Application Development** at Leuphana University (expected graduation: 2027).

It all started with the TV show **"Scorpion"** – the story of Walter O'Brien and his team fascinated me at 13. I started programming at 14 because I wanted to understand how software actually works.

I'm largely self-taught – from early Python scripts and Discord bots to modern web apps with React and Next.js. I also develop the public Discord bot **Astra**.

## What Drives Me

I build software I'd want to use myself – functional, fast and visually polished. What matters to me:

- **Clean code** – maintainable, readable, well-structured
- **Good design** – visual quality and thoughtful UX
- **Honest craft** – solid foundations over buzzword-driven choices
- **Continuous growth** – staying curious, trying things out

## Tech Stack

My current main stack: **TypeScript**, **Next.js**, **React**, **Node.js / Bun** and **PostgreSQL**. This website currently runs in a Bun container on a Hetzner server managed with Pelican; migration to my own homelab is planned.

I'm not an expert in everything – but I bring real project experience to each of these areas.`;
}

const VALUES = [
  { icon: FiCode, key: "clean_code", color: "#A78BFA" },
  { icon: FiZap, key: "performance", color: "#FBBF24" },
  { icon: FiLayout, key: "design", color: "#34D399" },
  { icon: FiBookOpen, key: "learning", color: "#60A5FA" },
] as const;

const FACTS = [
  { icon: FiMapPin, labelKey: "factLocation", valueKey: "factLocationValue" },
  { icon: FiBookOpen, labelKey: "factEducation", valueKey: "factEducationValue" },
  { icon: FiCode, labelKey: "factFocus", valueKey: "factFocusValue" },
  { icon: FiCalendar, labelKey: "factSince", valueKey: "factSinceValue" },
] as const;

export default function AboutPage() {
  const t = useTranslations("about");
  const locale = useLocale();
  const age = calcAge(BIRTH_DATE);
  const [astraServers, setAstraServers] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/stats")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch stats");
        return response.json() as Promise<{ astraServers?: unknown }>;
      })
      .then((data) => {
        if (active) setAstraServers(typeof data.astraServers === "number" ? data.astraServers : null);
      })
      .catch(() => {
        if (active) setAstraServers(null);
      });

    return () => {
      active = false;
    };
  }, []);

  const stats = [
    { value: `${age}`, label: t("stats.age") },
    { value: "3", label: t("stats.experience") },
    { value: astraServers === null ? "—" : astraServers.toLocaleString(), label: t("stats.servers") },
    { value: "2027", label: t("stats.graduation") },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden pb-24 pt-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-190 overflow-hidden">
        <div
          className="absolute -left-24 -top-40 h-140 w-140 rounded-full opacity-20 blur-[150px]"
          style={{ background: "radial-gradient(circle, #7c3aed, transparent 68%)" }}
        />
        <div
          className="absolute right-[8%] top-32 h-105 w-105 rounded-full opacity-15 blur-[140px]"
          style={{ background: "radial-gradient(circle, #4f46e5, transparent 70%)" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_55%,#030712_100%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="grid items-center gap-10 py-10 md:py-16 lg:min-h-[min(780px,calc(100svh-6rem))] lg:grid-cols-[1.05fr_.95fr] lg:gap-4">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="relative z-10 min-w-0"
          >
            <p className="inline-flex items-center gap-2 rounded-full border border-[#A78BFA]/20 bg-[#A78BFA]/6 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[#C4B5FD] sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#A78BFA] shadow-[0_0_10px_#7c3aed]" />
              {t("subtitle")}
            </p>
            <h1 className="mt-6 min-w-0 max-w-3xl text-[clamp(1.6rem,7vw,3rem)] font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
              <span className="block">{t("title")}</span>
              <span className="block bg-linear-to-r from-[#C4B5FD] via-[#A78BFA] to-[#60A5FA] bg-clip-text text-transparent">
                {t("titleHighlight")}
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
              {t("description")}
            </p>

            <div className="mt-9 grid max-w-2xl grid-cols-2 gap-x-4 gap-y-6 border-y border-white/10 py-5 sm:grid-cols-4 sm:divide-x sm:divide-white/10 sm:gap-x-0 sm:gap-y-0">
              {stats.map((stat) => (
                <div key={stat.label} className="min-w-0 sm:px-5 sm:first:pl-0 sm:last:pr-0">
                  <p className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{stat.value}</p>
                  <p className="mt-1 text-[10px] leading-4 text-white/40 sm:text-xs">{stat.label}</p>
                </div>
              ))}
            </div>

            <a
              href="#about-story"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white/75 transition-colors hover:text-[#C4B5FD]"
            >
              {t("scrollCta")}
              <FiArrowDown aria-hidden="true" className="h-4 w-4 text-[#A78BFA]" />
            </a>
          </motion.div>

          <motion.div
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="relative mx-auto w-full max-w-105"
          >
            <div
              aria-hidden="true"
              className="absolute inset-[12%] rounded-full opacity-60 blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(124,58,237,.28), rgba(79,70,229,.14) 48%, transparent 72%)" }}
            />
            <div className="absolute inset-[5%] rounded-full border border-[#A78BFA]/10" aria-hidden="true" />
            <Image
              src="/assets/mascot/saito-avatar.webp"
              alt=""
              width={1024}
              height={1024}
              sizes="(max-width: 1024px) 80vw, 42vw"
              preload
              className="relative z-10 h-auto w-full object-contain drop-shadow-[0_28px_70px_rgba(124,58,237,0.25)]"
            />
            <div className="absolute bottom-[4%] left-0 z-20 max-w-[85%] rounded-xl border border-white/10 bg-[#08090d]/85 px-4 py-3 shadow-2xl backdrop-blur-xl">
              <p className="text-sm font-bold text-white">
                Mark <span className="text-white/30">·</span> <span className="font-medium text-[#C4B5FD]">{t("role")}</span>
              </p>
              <p className="mt-1.5 inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {t("availability")}
              </p>
            </div>
          </motion.div>
        </section>

        <section id="about-story" aria-labelledby="about-story-title" className="scroll-mt-28 pt-10 sm:pt-16">
          <div className="mb-10 max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#A78BFA]">{t("storyEyebrow")}</p>
            <h2 id="about-story-title" className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {t("storyTitle")}
            </h2>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:gap-14">
            <motion.div
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-64px" }}
              transition={{ duration: 0.5 }}
              className="min-w-0"
            >
              <MarkdownRenderer content={getAboutContent(locale as "de" | "en", age)} />
            </motion.div>

            <div className="min-w-0 space-y-5">
              <motion.div
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-64px" }}
                transition={{ duration: 0.5, delay: 0.05 }}
              >
                <GlassCard hover={false} className="p-6">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/40">
                    {t("factsTitle")}
                  </h3>
                  <dl className="mt-5 space-y-4">
                    {FACTS.map(({ icon: Icon, labelKey, valueKey }) => (
                      <div key={labelKey} className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#A78BFA]/20 bg-[#A78BFA]/10">
                          <Icon aria-hidden="true" className="h-3.5 w-3.5 text-[#C4B5FD]" />
                        </div>
                        <div className="min-w-0">
                          <dt className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
                            {t(labelKey)}
                          </dt>
                          <dd className="mt-0.5 text-sm font-medium leading-5 text-white/80">
                            {t(valueKey)}
                          </dd>
                        </div>
                      </div>
                    ))}
                  </dl>
                </GlassCard>
              </motion.div>

              <motion.a
                href="https://discord.gg/FNcAvF2aGQ"
                target="_blank"
                rel="noopener noreferrer"
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-64px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="block"
              >
                <GlassCard className="group relative p-5 cursor-pointer">
                  <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100">
                    <FiArrowUpRight aria-hidden="true" className="h-4 w-4 text-white/50" />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#5865F2]/30 bg-[#5865F2]/20">
                      <SiDiscord aria-hidden="true" className="h-6 w-6 text-[#5865F2]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-base font-bold text-white">Astra Bot</p>
                        <span className="rounded border border-[#5865F2]/20 bg-[#5865F2]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#8b94ff]">
                          v2.0
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-sm text-white/50">
                        {t("astraTrustedBy", { count: astraServers?.toLocaleString() ?? "—" })}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-3 text-xs text-white/40">
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {t("astraOnline")}
                    </span>
                    <span aria-hidden="true">•</span>
                    <span>{t("astraLive")}</span>
                  </div>
                </GlassCard>
              </motion.a>

              <motion.div
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-64px" }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <GlassCard hover={false} className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                      <FiFileText aria-hidden="true" className="h-6 w-6 text-white/60" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-white">{t("cvTitle")}</h3>
                      <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-amber-300/20 bg-amber-300/8 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-200">
                        <span className="h-1 w-1 rounded-full bg-amber-300" />
                        {t("cvBadge")}
                      </span>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-white/50">{t("cvDescription")}</p>
                  <button
                    type="button"
                    disabled
                    className="mt-5 inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/35"
                  >
                    <FiDownload aria-hidden="true" className="h-4 w-4" />
                    {t("download_cv")}
                  </button>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </section>

        <section aria-labelledby="about-values-title" className="pt-16 sm:pt-24">
          <div className="mb-10 max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#A78BFA]">{t("valuesEyebrow")}</p>
            <h2 id="about-values-title" className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {t("values.title")}
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, key, color }, i) => (
              <motion.div
                key={key}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-64px" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
              >
                <GlassCard className="h-full p-6">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ background: `${color}15`, border: `1px solid ${color}30`, color }}
                  >
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-base font-bold text-white">{t(`values.${key}`)}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/50">{t(`values.${key}_desc`)}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
