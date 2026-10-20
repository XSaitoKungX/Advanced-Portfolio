"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import {
  FiArrowDown, FiCloud, FiCode, FiLayers, FiLayout, FiServer, FiTool,
} from "react-icons/fi";
import * as SiIcons from "react-icons/si";
import TiltCard from "@/components/ui/TiltCard";
import { skills, type SkillCategory } from "@/lib/data/skills";
import type { ReactNode } from "react";

const CATEGORY_META: Record<SkillCategory, { icon: ReactNode }> = {
  frontend: { icon: <FiLayout className="w-4 h-4" /> },
  backend: { icon: <FiServer className="w-4 h-4" /> },
  devops: { icon: <FiCloud className="w-4 h-4" /> },
  tools: { icon: <FiTool className="w-4 h-4" /> },
};

const CATEGORY_ORDER: SkillCategory[] = ["frontend", "backend", "devops", "tools"];

function SkillIcon({ name }: { name: string }) {
  const Icon = (SiIcons as Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>>)[name];
  if (!Icon) return <div className="w-7 h-7 rounded bg-white/10" />;
  return <Icon className="w-7 h-7" />;
}

function SkillCard({ skill, index }: { skill: (typeof skills)[number]; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      className="h-full"
    >
      <TiltCard intensity={6} className="group h-full">
        <div className="relative h-full rounded-2xl border border-white/10 bg-white/3 p-5 flex flex-col items-center gap-3 transition-all duration-300 group-hover:bg-white/7 group-hover:border-white/20">
          <div
            className="relative p-3 rounded-xl transition-all duration-300"
            style={{ background: `${skill.color}12`, border: `1px solid ${skill.color}20` }}
          >
            <div style={{ color: skill.color }}>
              <SkillIcon name={skill.icon} />
            </div>
            <div
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"
              style={{ background: `${skill.color}20` }}
              aria-hidden="true"
            />
          </div>

          <p className="text-xs font-semibold text-white/80 text-center leading-tight">
            {skill.name}
          </p>
        </div>
      </TiltCard>
    </motion.div>
  );
}

export default function SkillsPage() {
  const t = useTranslations("skills");
  const tProjects = useTranslations("projects");
  const [activeCategory, setActiveCategory] = useState<SkillCategory | "all">("all");

  const usedCategories = CATEGORY_ORDER.filter((cat) => skills.some((s) => s.category === cat));

  const stats = [
    { value: `${skills.length}`, label: t("statSkills") },
    ...usedCategories.map((cat) => ({
      value: `${skills.filter((s) => s.category === cat).length}`,
      label: t(`categories.${cat}`),
    })),
  ];

  const groupedSkills = (activeCategory === "all" ? usedCategories : [activeCategory])
    .map((cat) => ({
      category: cat,
      skills: skills.filter((s) => s.category === cat),
    }))
    .filter((g) => g.skills.length > 0);

  return (
    <div className="relative min-h-screen overflow-hidden pb-24 pt-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-190 overflow-hidden">
        <div
          className="absolute -right-24 -top-40 h-140 w-140 rounded-full opacity-20 blur-[150px]"
          style={{ background: "radial-gradient(circle, #ef4444, transparent 68%)" }}
        />
        <div
          className="absolute left-[8%] top-32 h-105 w-105 rounded-full opacity-15 blur-[140px]"
          style={{ background: "radial-gradient(circle, #7c3aed, transparent 70%)" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_55%,#030712_100%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="grid items-center gap-10 py-10 md:py-16 lg:min-h-[min(700px,calc(100svh-6rem))] lg:grid-cols-[1.05fr_.95fr] lg:gap-4">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="relative z-10 min-w-0"
          >
            <p className="inline-flex items-center gap-2 rounded-full border border-red-300/20 bg-red-300/6 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-red-200 sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-red-300 shadow-[0_0_10px_#ef4444]" />
              {t("subtitle")}
            </p>
            <h1 className="mt-6 min-w-0 max-w-3xl text-[clamp(1.6rem,7vw,3rem)] font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
              <span className="block">{t("title")}</span>
              <span className="block bg-linear-to-r from-red-200 via-red-400 to-[#A78BFA] bg-clip-text text-transparent">
                {t("titleHighlight")}
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
              {t("description")}
            </p>

            <div className="mt-9 grid max-w-2xl grid-cols-2 gap-x-4 gap-y-6 border-y border-white/10 py-5 sm:grid-cols-3 lg:grid-cols-5 sm:divide-x sm:divide-white/10 sm:gap-x-0 sm:gap-y-0">
              {stats.map((stat) => (
                <div key={stat.label} className="min-w-0 sm:px-5 sm:first:pl-0 sm:last:pr-0">
                  <p className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{stat.value}</p>
                  <p className="mt-1 text-[10px] leading-4 text-white/40 sm:text-xs">{stat.label}</p>
                </div>
              ))}
            </div>

            <a
              href="#skills-grid"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white/75 transition-colors hover:text-red-200"
            >
              {t("scrollCta")}
              <FiArrowDown aria-hidden="true" className="h-4 w-4 text-red-300" />
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
              style={{ background: "radial-gradient(circle, rgba(239,68,68,.22), rgba(124,58,237,.12) 48%, transparent 72%)" }}
            />
            <div className="absolute inset-[5%] rounded-full border border-red-200/10" aria-hidden="true" />
            <Image
              src="/assets/mascot/skills-mascot.webp"
              alt=""
              width={1254}
              height={1254}
              sizes="(max-width: 1024px) 80vw, 42vw"
              preload
              className="relative z-10 h-auto w-full object-contain drop-shadow-[0_28px_70px_rgba(239,68,68,0.18)]"
            />
            <div className="absolute bottom-[4%] left-0 z-20 rounded-xl border border-white/10 bg-[#08090d]/85 px-4 py-3 font-mono text-sm text-white/80 shadow-2xl backdrop-blur-xl">
              <FiCode aria-hidden="true" className="mr-2 inline h-4 w-4 -translate-y-px text-red-300" />
              TypeScript <span className="text-red-300">·</span> Next.js <span className="text-red-300">·</span> Bun
            </div>
          </motion.div>
        </section>

        <section id="skills-grid" aria-labelledby="skills-grid-title" className="scroll-mt-28 pt-6 sm:pt-10">
          <div className="mb-8 max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-red-300">{t("gridEyebrow")}</p>
            <h2 id="skills-grid-title" className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {t("gridTitle")}
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/50">{t("note")}</p>
          </div>

          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex flex-wrap gap-2 mb-12"
          >
            <button
              onClick={() => setActiveCategory("all")}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border transition-all duration-200 ${
                activeCategory === "all"
                  ? "bg-[#DC2626] border-[#DC2626] text-white shadow-lg shadow-[#DC2626]/25"
                  : "bg-white/3 border-white/10 text-white/50 hover:text-white hover:border-white/20"
              }`}
            >
              <FiLayers aria-hidden="true" className="w-4 h-4" />
              {tProjects("filter_all")}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                activeCategory === "all" ? "bg-white/20 text-white" : "bg-white/10 text-white/40"
              }`}>
                {skills.length}
              </span>
            </button>
            {usedCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-[#DC2626] border-[#DC2626] text-white shadow-lg shadow-[#DC2626]/25"
                    : "bg-white/3 border-white/10 text-white/50 hover:text-white hover:border-white/20"
                }`}
              >
                <span aria-hidden="true">{CATEGORY_META[cat].icon}</span>
                {t(`categories.${cat}`)}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeCategory === cat ? "bg-white/20 text-white" : "bg-white/10 text-white/40"
                }`}>
                  {skills.filter((s) => s.category === cat).length}
                </span>
              </button>
            ))}
          </motion.div>

          <div className="space-y-14">
            {groupedSkills.map(({ category, skills: catSkills }) => (
              <div key={category}>
                <div className="flex items-center gap-3 mb-7">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-300/20 bg-red-300/8 text-red-300" aria-hidden="true">
                    {CATEGORY_META[category].icon}
                  </span>
                  <h3 className="text-lg font-semibold tracking-tight text-white">{t(`categories.${category}`)}</h3>
                  <div className="h-px flex-1 bg-linear-to-r from-white/10 to-transparent" aria-hidden="true" />
                  <span className="text-xs font-medium text-white/40">{t("skillCount", { count: catSkills.length })}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  <AnimatePresence mode="popLayout">
                    {catSkills.map((skill, i) => (
                      <SkillCard key={skill.name} skill={skill} index={i} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
