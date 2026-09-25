"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "motion/react";
import {
  FiArrowDown,
  FiBook,
  FiBriefcase,
  FiCalendar,
  FiCode,
  FiMapPin,
  FiStar,
} from "react-icons/fi";
import type { Experience } from "@/lib/data/experience";
import { experiences } from "@/lib/data/experience";
import GlassCard from "@/components/ui/GlassCard";

const TYPE_META: Record<Experience["type"], { icon: typeof FiBriefcase; color: string }> = {
  work: { icon: FiBriefcase, color: "#FB4D5A" },
  education: { icon: FiBook, color: "#A78BFA" },
  freelance: { icon: FiStar, color: "#34D399" },
  personal: { icon: FiCode, color: "#FBBF24" },
};

const TYPE_LABELS: Record<Experience["type"], string> = {
  work: "typeWork",
  education: "typeEducation",
  freelance: "typeFreelance",
  personal: "typePersonal",
};

function formatDate(dateStr: string, locale: string) {
  const [year, month] = dateStr.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString(locale === "de" ? "de-DE" : "en-US", {
    month: "short",
    year: "numeric",
  });
}

function ExperienceCard({
  exp,
  locale,
  t,
  index,
}: {
  exp: Experience;
  locale: string;
  t: ReturnType<typeof useTranslations>;
  index: number;
}) {
  const { icon: Icon, color } = TYPE_META[exp.type];
  const isCurrent = !exp.endDate;

  return (
    <li className="relative pl-11 sm:pl-14">
      <span
        aria-hidden="true"
        className="absolute left-0 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full border bg-[#08090d] shadow-[0_0_24px_rgba(251,77,90,0.14)]"
        style={{ borderColor: `${color}70`, color }}
      >
        <Icon className="h-4 w-4" />
      </span>
      <motion.article
        initial={false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-64px" }}
        transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.2) }}
      >
        <GlassCard hover={false} className="relative p-5 sm:p-7">
          <div
            aria-hidden="true"
            className="absolute inset-x-6 top-0 h-px opacity-70"
            style={{ background: `linear-gradient(90deg, transparent, ${color}90, transparent)` }}
          />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em]"
                  style={{ color, borderColor: `${color}45`, backgroundColor: `${color}12` }}
                >
                  {t(TYPE_LABELS[exp.type])}
                </span>
                {isCurrent && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-300/20 bg-rose-300/8 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-rose-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-300" />
                    {t("current")}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold leading-snug text-white sm:text-xl">
                {exp.role[locale as "de" | "en"]}
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/50">
                <span className="font-medium text-white/75">{exp.company}</span>
                {exp.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <FiMapPin aria-hidden="true" className="h-3.5 w-3.5" />
                    {exp.location}
                  </span>
                )}
              </div>
            </div>
            <div className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-white/8 bg-white/3 px-3 py-2 font-mono text-xs text-white/55">
              <FiCalendar aria-hidden="true" className="h-3.5 w-3.5 text-rose-300/80" />
              <span>{formatDate(exp.startDate, locale)}</span>
              <span className="text-white/25">—</span>
              <span>{exp.endDate ? formatDate(exp.endDate, locale) : t("present")}</span>
            </div>
          </div>

          <p className="mt-5 max-w-3xl text-sm leading-7 text-white/60">
            {exp.description[locale as "de" | "en"]}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {exp.technologies.map((technology) => (
              <span
                key={technology}
                className="rounded-md border border-white/[0.07] bg-black/20 px-2.5 py-1 text-[11px] font-medium text-white/55"
              >
                {technology}
              </span>
            ))}
          </div>
        </GlassCard>
      </motion.article>
    </li>
  );
}

export default function ExperiencePage() {
  const t = useTranslations("experience");
  const locale = useLocale();
  const timeline = [...experiences].sort((a, b) => a.startDate.localeCompare(b.startDate));
  const stats = [
    { value: "14", label: t("statStarted") },
    { value: "3", label: t("statExperience") },
    { value: "2027", label: t("statGraduation") },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden pb-24 pt-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-190 overflow-hidden">
        <div
          className="absolute -right-24 -top-40 h-140 w-140 rounded-full opacity-20 blur-[150px]"
          style={{ background: "radial-gradient(circle, #fb4d5a, transparent 68%)" }}
        />
        <div
          className="absolute left-[8%] top-32 h-105 w-105 rounded-full opacity-15 blur-[140px]"
          style={{ background: "radial-gradient(circle, #7c3aed, transparent 70%)" }}
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
            <p className="inline-flex items-center gap-2 rounded-full border border-rose-300/20 bg-rose-300/6 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-rose-200 sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-300 shadow-[0_0_10px_#fb4d5a]" />
              {t("subtitle")}
            </p>
            <h1 className="mt-6 min-w-0 max-w-3xl text-[clamp(1.6rem,7vw,3rem)] font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
              <span className="block">{t("title")}</span>
              <span className="block bg-linear-to-r from-rose-200 via-rose-400 to-[#A78BFA] bg-clip-text text-transparent">{t("titleHighlight")}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
              {t("description")}
            </p>

            <div className="mt-9 grid max-w-xl grid-cols-3 divide-x divide-white/10 border-y border-white/10 py-4">
              {stats.map((stat) => (
                <div key={stat.label} className="px-3 first:pl-0 last:pr-0 sm:px-5">
                  <p className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{stat.value}</p>
                  <p className="mt-1 text-[10px] leading-4 text-white/40 sm:text-xs">{stat.label}</p>
                </div>
              ))}
            </div>

            <a
              href="#experience-timeline"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white/75 transition-colors hover:text-rose-200"
            >
              {t("scrollCta")}
              <FiArrowDown aria-hidden="true" className="h-4 w-4 text-rose-300" />
            </a>
          </motion.div>

          <motion.div
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="relative mx-auto w-full max-w-140"
          >
            <div
              aria-hidden="true"
              className="absolute inset-[12%] rounded-full opacity-60 blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(251,77,90,.24), rgba(124,58,237,.12) 48%, transparent 72%)" }}
            />
            <div className="absolute inset-[5%] rounded-full border border-rose-200/8" aria-hidden="true" />
            <Image
              src="/assets/mascot/experience-mascot.webp"
              alt=""
              width={1254}
              height={1254}
              sizes="(max-width: 1024px) 86vw, 48vw"
              preload
              className="relative z-10 h-auto w-full object-contain drop-shadow-[0_28px_70px_rgba(251,77,90,0.18)]"
            />
            <div className="absolute bottom-[9%] left-0 z-20 rounded-xl border border-white/10 bg-[#08090d]/85 px-4 py-3 font-mono text-sm text-white/80 shadow-2xl backdrop-blur-xl">
              2018 <span className="text-rose-300">—</span> 2027
            </div>
          </motion.div>
        </section>

        <section id="experience-timeline" aria-labelledby="experience-timeline-title" className="scroll-mt-28 pt-10 sm:pt-16">
          <div className="mb-10 max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-rose-300">{t("timelineEyebrow")}</p>
            <h2 id="experience-timeline-title" className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {t("timelineTitle")}
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/50 sm:text-base">{t("timelineDescription")}</p>
          </div>

          <ol className="relative space-y-5 before:absolute before:bottom-6 before:left-3.75 before:top-6 before:w-px before:bg-linear-to-b before:from-rose-400/70 before:via-white/10 before:to-transparent sm:before:left-4.75">
            {timeline.map((exp, index) => (
              <ExperienceCard
                key={exp.id}
                exp={exp}
                locale={locale}
                t={t}
                index={index}
              />
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
