"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import {
  FiArrowDown, FiExternalLink, FiGithub, FiX, FiLayers,
  FiCheckCircle, FiClock, FiTool, FiCheck, FiStar,
  FiCode, FiMonitor, FiPenTool, FiZap, FiGlobe, FiSmartphone, FiPlay
} from "react-icons/fi";
import { SiDiscord } from "react-icons/si";
import type { ReactNode } from "react";
import TiltCard from "@/components/ui/TiltCard";
import GlassCard from "@/components/ui/GlassCard";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";
import { projects, type Project, type ProjectCategory, type ProjectStatus } from "@/lib/data/projects";

const STATUS_CONFIG: Record<ProjectStatus, { icon: ReactNode; color: string }> = {
  launched: { icon: <FiCheckCircle className="w-3.5 h-3.5" />, color: "#34D399" },
  planning: { icon: <FiClock className="w-3.5 h-3.5" />, color: "#60A5FA" },
  in_progress: { icon: <FiTool className="w-3.5 h-3.5" />, color: "#FBBF24" },
  completed: { icon: <FiCheck className="w-3.5 h-3.5" />, color: "#34D399" },
  incoming: { icon: <FiStar className="w-3.5 h-3.5" />, color: "#A78BFA" },
};

const CATEGORY_CONFIG: Record<ProjectCategory, { icon: ReactNode }> = {
  discord: { icon: <SiDiscord className="w-4 h-4" /> },
  devtools: { icon: <FiCode className="w-4 h-4" /> },
  system: { icon: <FiMonitor className="w-4 h-4" /> },
  creative: { icon: <FiPenTool className="w-4 h-4" /> },
  utility: { icon: <FiZap className="w-4 h-4" /> },
  web: { icon: <FiGlobe className="w-4 h-4" /> },
  mobile: { icon: <FiSmartphone className="w-4 h-4" /> },
  tool: { icon: <FiTool className="w-4 h-4" /> },
  game: { icon: <FiPlay className="w-4 h-4" /> },
};

const CATEGORY_ORDER: ProjectCategory[] = ["discord", "devtools", "system", "creative", "utility", "web", "mobile", "tool", "game"];

type ProjectsT = ReturnType<typeof useTranslations>;

function ProjectCard({
  project,
  locale,
  onOpen,
  t,
}: {
  project: Project;
  locale: string;
  onOpen: (p: Project) => void;
  t: ProjectsT;
}) {
  const status = STATUS_CONFIG[project.status];
  const [labelsExpanded, setLabelsExpanded] = useState(false);
  const [stackExpanded, setStackExpanded] = useState(false);

  const hasMoreLabels = project.labels.length > 2;
  const hasMoreStack = project.stack.length > 3;

  return (
    <TiltCard intensity={5} className="group h-full">
      <div className={`relative h-full rounded-2xl overflow-hidden ${project.featured ? "ring-1 ring-[#818CF8]/50 shadow-lg shadow-[#818CF8]/15" : ""}`}>
        {project.featured && (
          <div className="absolute -inset-px bg-linear-to-r from-[#818CF8]/20 via-[#4F46E5]/10 to-[#818CF8]/20 rounded-2xl blur-sm opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
        )}
        <GlassCard hover className="relative h-full min-h-80 flex flex-col p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className={`flex flex-wrap gap-1.5 min-w-0 ${labelsExpanded ? "" : "max-h-7 overflow-hidden"}`}>
              {(labelsExpanded ? project.labels : project.labels.slice(0, 2)).map((label) => (
                <span
                  key={label}
                  className="px-2 py-0.5 text-[10px] font-medium text-white/60 bg-white/5 border border-white/10 rounded-full whitespace-nowrap"
                >
                  {label}
                </span>
              ))}
              {hasMoreLabels && (
                <button
                  onClick={() => setLabelsExpanded((v) => !v)}
                  aria-label={labelsExpanded ? t("collapse") : t("expand")}
                  className="px-1.5 py-0.5 text-[10px] text-white/40 hover:text-white/70 transition-colors whitespace-nowrap"
                >
                  {labelsExpanded ? "−" : `+${project.labels.length - 2}`}
                </button>
              )}
            </div>
            <span
              className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full shrink-0 whitespace-nowrap"
              style={{
                background: `color-mix(in srgb, ${status.color} 15%, transparent)`,
                border: `1px solid color-mix(in srgb, ${status.color} 30%, transparent)`,
                color: status.color,
              }}
            >
              {status.icon}
              <span className="hidden sm:inline">{t(`status.${project.status}`)}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-white/40 mb-2 h-4">
            {CATEGORY_CONFIG[project.category].icon}
            <span className="uppercase tracking-wider">{t(`categories.${project.category}`)}</span>
          </div>

          <h3 className="font-bold text-white mb-2 group-hover:text-[#A5B4FC] transition-colors duration-200 text-lg line-clamp-1 h-6">
            {project.title}
          </h3>

          <p className="text-sm text-white/50 leading-relaxed mb-3 line-clamp-3 min-h-15">
            {project.description[locale as "de" | "en"]}
          </p>

          <div className={`flex flex-wrap gap-1.5 mb-3 ${stackExpanded ? "" : "max-h-10 overflow-hidden content-start"}`}>
            {(stackExpanded ? project.stack : project.stack.slice(0, 3)).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-[10px] font-medium text-[#A5B4FC] bg-[#6366F1]/10 border border-[#6366F1]/20 rounded-md whitespace-nowrap"
              >
                {tech}
              </span>
            ))}
            {hasMoreStack && (
              <button
                onClick={() => setStackExpanded((v) => !v)}
                aria-label={stackExpanded ? t("collapse") : t("expand")}
                className="px-1.5 py-0.5 text-[10px] text-white/40 hover:text-white/70 transition-colors whitespace-nowrap"
              >
                {stackExpanded ? "−" : `+${project.stack.length - 3}`}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 mt-auto pt-3 border-t border-white/5">
            {project.longDescription ? (
              <button
                onClick={() => onOpen(project)}
                className="flex-1 px-3 py-2 text-xs font-medium text-white/70 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                {t("view_details")}
              </button>
            ) : (
              <div className="flex-1" />
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all duration-200"
                aria-label={t("view_demo")}
                title={t("view_demo")}
              >
                <FiExternalLink className="w-4 h-4" />
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all duration-200"
                aria-label={t("view_code")}
                title={t("view_code")}
              >
                <FiGithub className="w-4 h-4" />
              </a>
            )}
          </div>
        </GlassCard>
      </div>
    </TiltCard>
  );
}

export default function ProjectsPage() {
  const t = useTranslations("projects");
  const locale = useLocale();
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | "all">("all");
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    if (selected) {
      window.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [selected]);

  const usedCategories = CATEGORY_ORDER.filter((cat) => projects.some((p) => p.category === cat));
  const releasedCount = projects.filter((p) => p.status === "launched" || p.status === "completed").length;
  const activeCount = projects.length - releasedCount;
  const ossCount = projects.filter((p) => p.github).length;

  const stats = [
    { value: `${projects.length}`, label: t("statProjects") },
    { value: `${releasedCount}`, label: t("statReleased") },
    { value: `${activeCount}`, label: t("statActive") },
    { value: `${usedCategories.length}`, label: t("statCategories") },
  ];

  const filtered = activeCategory === "all"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  const groupedProjects = (activeCategory === "all" ? usedCategories : [activeCategory])
    .map((cat) => ({
      category: cat,
      projects: filtered
        .filter((p) => p.category === cat)
        .sort((a, b) => Number(b.featured) - Number(a.featured)),
    }))
    .filter((g) => g.projects.length > 0);

  return (
    <div className="relative min-h-screen overflow-hidden pb-24 pt-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-190 overflow-hidden">
        <div
          className="absolute -right-24 -top-40 h-140 w-140 rounded-full opacity-20 blur-[150px]"
          style={{ background: "radial-gradient(circle, #6366f1, transparent 68%)" }}
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
            <p className="inline-flex items-center gap-2 rounded-full border border-indigo-300/20 bg-indigo-300/6 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-indigo-200 sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-300 shadow-[0_0_10px_#6366f1]" />
              {t("subtitle")}
            </p>
            <h1 className="mt-6 min-w-0 max-w-3xl text-[clamp(1.6rem,7vw,3rem)] font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
              <span className="block">{t("title")}</span>
              <span className="block bg-linear-to-r from-indigo-200 via-indigo-400 to-[#A78BFA] bg-clip-text text-transparent">
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
              href="#projects-grid"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white/75 transition-colors hover:text-indigo-200"
            >
              {t("scrollCta")}
              <FiArrowDown aria-hidden="true" className="h-4 w-4 text-indigo-300" />
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
              style={{ background: "radial-gradient(circle, rgba(99,102,241,.26), rgba(124,58,237,.12) 48%, transparent 72%)" }}
            />
            <div className="absolute inset-[5%] rounded-full border border-indigo-200/10" aria-hidden="true" />
            <Image
              src="/assets/mascot/projects-mascot.webp"
              alt=""
              width={1254}
              height={1254}
              sizes="(max-width: 1024px) 80vw, 42vw"
              preload
              className="relative z-10 h-auto w-full object-contain drop-shadow-[0_28px_70px_rgba(99,102,241,0.22)]"
            />
            <div className="absolute bottom-[4%] left-0 z-20 rounded-xl border border-white/10 bg-[#08090d]/85 px-4 py-3 font-mono text-sm text-white/80 shadow-2xl backdrop-blur-xl">
              <FiGithub aria-hidden="true" className="mr-2 inline h-4 w-4 -translate-y-px text-indigo-300" />
              <span className="text-indigo-200">{ossCount}</span> Open Source
            </div>
          </motion.div>
        </section>

        <section id="projects-grid" aria-label={t("title")} className="scroll-mt-28 pt-6 sm:pt-10">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex flex-wrap justify-center gap-2 mb-12"
          >
            <button
              onClick={() => setActiveCategory("all")}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border transition-all duration-200 ${
                activeCategory === "all"
                  ? "bg-[#6366F1] border-[#6366F1] text-white shadow-lg shadow-[#6366F1]/25"
                  : "bg-white/3 border-white/10 text-white/50 hover:text-white hover:border-white/20"
              }`}
            >
              <FiLayers aria-hidden="true" className="w-4 h-4" />
              {t("filter_all")}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                activeCategory === "all" ? "bg-white/20 text-white" : "bg-white/10 text-white/40"
              }`}>
                {projects.length}
              </span>
            </button>
            {usedCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-[#6366F1] border-[#6366F1] text-white shadow-lg shadow-[#6366F1]/25"
                    : "bg-white/3 border-white/10 text-white/50 hover:text-white hover:border-white/20"
                }`}
              >
                <span aria-hidden="true">{CATEGORY_CONFIG[cat].icon}</span>
                <span className="hidden sm:inline">{t(`categories.${cat}`)}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeCategory === cat ? "bg-white/20 text-white" : "bg-white/10 text-white/40"
                }`}>
                  {projects.filter((p) => p.category === cat).length}
                </span>
              </button>
            ))}
          </motion.div>

          <div className="space-y-14">
            {groupedProjects.map(({ category, projects: catProjects }) => (
              <div key={category}>
                <div className="flex items-center gap-3 mb-7">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-300/20 bg-indigo-300/8 text-indigo-300" aria-hidden="true">
                    {CATEGORY_CONFIG[category].icon}
                  </span>
                  <h2 className="text-lg font-semibold tracking-tight text-white">{t(`categories.${category}`)}</h2>
                  <div className="h-px flex-1 bg-linear-to-r from-white/10 to-transparent" aria-hidden="true" />
                  <span className="text-xs font-medium text-white/40">{t("projectCount", { count: catProjects.length })}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 auto-rows-fr">
                  <AnimatePresence mode="popLayout">
                    {catProjects.map((project, i) => (
                      <motion.div
                        key={project.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: i * 0.04 }}
                        className="h-full"
                      >
                        <ProjectCard project={project} locale={locale} onOpen={setSelected} t={t} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-white/40 py-20"
            >
              {t("no_results")}
            </motion.p>
          )}
        </section>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", bounce: 0.2 }}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#0D1117] border border-white/10 rounded-2xl shadow-2xl"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[#0D1117]/90 backdrop-blur-sm border-b border-white/5">
                <h2 className="text-xl font-bold text-white min-w-0 truncate">{selected.title}</h2>
                <div className="flex items-center gap-3 shrink-0">
                  {selected.demo && (
                    <a
                      href={selected.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t("view_demo")}
                      className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200"
                    >
                      <FiExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {selected.github && (
                    <a
                      href={selected.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t("view_code")}
                      className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200"
                    >
                      <FiGithub className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => setSelected(null)}
                    aria-label="Close"
                    className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                    style={{
                      background: `color-mix(in srgb, ${STATUS_CONFIG[selected.status].color} 15%, transparent)`,
                      border: `1px solid color-mix(in srgb, ${STATUS_CONFIG[selected.status].color} 30%, transparent)`,
                      color: STATUS_CONFIG[selected.status].color,
                    }}
                  >
                    {STATUS_CONFIG[selected.status].icon}
                    <span>{t(`status.${selected.status}`)}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-white/40">
                    {CATEGORY_CONFIG[selected.category].icon}
                    <span>{t(`categories.${selected.category}`)}</span>
                  </span>
                  <span className="text-xs text-white/30">{selected.year}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {selected.labels.map((label) => (
                    <span
                      key={label}
                      className="px-2 py-0.5 text-[11px] text-white/50 bg-white/5 border border-white/10 rounded-full"
                    >
                      {label}
                    </span>
                  ))}
                </div>

                <MarkdownRenderer
                  content={selected.longDescription?.[locale as "de" | "en"] ?? selected.description[locale as "de" | "en"]}
                />

                <div className="mt-6 pt-4 border-t border-white/5">
                  <p className="text-xs text-white/30 uppercase tracking-wider mb-3">Stack</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-xs font-medium text-[#A5B4FC] bg-[#6366F1]/10 border border-[#6366F1]/20 rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
