"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiExternalLink, FiGithub, FiX, FiLayers,
  FiCheckCircle, FiClock, FiTool, FiCheck, FiStar,
  FiCode, FiMonitor, FiPenTool, FiZap, FiGlobe, FiSmartphone, FiPlay
} from "react-icons/fi";
import { SiDiscord } from "react-icons/si";
import type { ReactNode } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import TiltCard from "@/components/ui/TiltCard";
import GlassCard from "@/components/ui/GlassCard";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";
import { projects, type Project, type ProjectCategory, type ProjectStatus } from "@/lib/data/projects";

const STATUS_CONFIG: Record<ProjectStatus, { icon: ReactNode; label: string; bg: string; border: string; text: string }> = {
  launched: { icon: <FiCheckCircle className="w-3.5 h-3.5" />, label: "Launched", bg: "#10B981/15", border: "#10B981/30", text: "#34D399" },
  planning: { icon: <FiClock className="w-3.5 h-3.5" />, label: "Planning", bg: "#3B82F6/15", border: "#3B82F6/30", text: "#60A5FA" },
  in_progress: { icon: <FiTool className="w-3.5 h-3.5" />, label: "In Progress", bg: "#F59E0B/15", border: "#F59E0B/30", text: "#FBBF24" },
  completed: { icon: <FiCheck className="w-3.5 h-3.5" />, label: "Completed", bg: "#10B981/15", border: "#10B981/30", text: "#34D399" },
  incoming: { icon: <FiStar className="w-3.5 h-3.5" />, label: "Incoming", bg: "#A855F7/15", border: "#A855F7/30", text: "#A78BFA" },
};

const CATEGORY_CONFIG: Record<ProjectCategory, { icon: ReactNode; label: string }> = {
  discord: { icon: <SiDiscord className="w-4 h-4" />, label: "Discord / Bot" },
  devtools: { icon: <FiCode className="w-4 h-4" />, label: "Developer Tools" },
  system: { icon: <FiMonitor className="w-4 h-4" />, label: "System & Linux" },
  creative: { icon: <FiPenTool className="w-4 h-4" />, label: "Kreativ & Design" },
  utility: { icon: <FiZap className="w-4 h-4" />, label: "Utility / Fun" },
  web: { icon: <FiGlobe className="w-4 h-4" />, label: "Web" },
  mobile: { icon: <FiSmartphone className="w-4 h-4" />, label: "Mobile" },
  tool: { icon: <FiTool className="w-4 h-4" />, label: "Tool" },
  game: { icon: <FiPlay className="w-4 h-4" />, label: "Game" },
};

function ProjectCard({
  project,
  locale,
  onOpen,
}: {
  project: Project;
  locale: string;
  onOpen: (p: Project) => void;
}) {
  const status = STATUS_CONFIG[project.status];
  const category = CATEGORY_CONFIG[project.category];
  const [labelsExpanded, setLabelsExpanded] = useState(false);
  const [stackExpanded, setStackExpanded] = useState(false);

  const hasMoreLabels = project.labels.length > 2;
  const hasMoreStack = project.stack.length > 3;

  return (
    <TiltCard intensity={5} className="group h-full">
      <div className={`relative h-full min-h-[320px] rounded-2xl overflow-hidden ${project.featured ? "ring-1 ring-[#7C3AED]/50 shadow-lg shadow-[#7C3AED]/20" : ""}`}>
        {/* Glow effect for featured */}
        {project.featured && (
          <div className="absolute -inset-px bg-linear-to-r from-[#7C3AED]/20 via-[#4F46E5]/10 to-[#7C3AED]/20 rounded-2xl blur-sm opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
        )}
        <GlassCard hover className="relative h-full min-h-[320px] flex flex-col p-5">
          {/* Header: Labels & Status */}
          <div className="flex items-start justify-between mb-2">
            <div className={`flex flex-wrap gap-1.5 ${labelsExpanded ? "" : "max-h-7 overflow-hidden"}`}>
              {(labelsExpanded ? project.labels : project.labels.slice(0, 2)).map((label) => (
                <span
                  key={label}
                  className="px-2 py-0.5 text-[10px] font-medium text-white/60 bg-white/5 border border-white/10 rounded-full whitespace-nowrap"
                >
                  {label}
                </span>
              ))}
              {hasMoreLabels && !labelsExpanded && (
                <button
                  onClick={() => setLabelsExpanded(true)}
                  className="px-2 py-0.5 text-[10px] text-white/40 hover:text-white/70 transition-colors whitespace-nowrap"
                  title="Show all labels"
                >
                  +{project.labels.length - 2}
                </button>
              )}
              {labelsExpanded && hasMoreLabels && (
                <button
                  onClick={() => setLabelsExpanded(false)}
                  className="px-2 py-0.5 text-[10px] text-white/40 hover:text-white/70 transition-colors whitespace-nowrap"
                  title="Hide labels"
                >
                  −
                </button>
              )}
            </div>
            <span
              className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full shrink-0 whitespace-nowrap"
              style={{
                background: `color-mix(in srgb, ${status.text} 15%, transparent)`,
                border: `1px solid color-mix(in srgb, ${status.text} 30%, transparent)`,
                color: status.text,
              }}
              title={status.label}
            >
              {status.icon}
              <span className="hidden sm:inline">{status.label}</span>
            </span>
          </div>

          {/* Category - Fixed height */}
          <div className="flex items-center gap-1.5 text-[11px] text-white/40 mb-2 h-4">
            {category.icon}
            <span className="uppercase tracking-wider">{category.label}</span>
          </div>

          {/* Title - Fixed height with line clamp */}
          <h3 className="font-bold text-white mb-2 group-hover:text-[#A78BFA] transition-colors duration-200 text-lg line-clamp-1 h-6">
            {project.title}
          </h3>

          {/* Description - Fixed height with line clamp */}
          <p className="text-sm text-white/50 leading-relaxed mb-3 line-clamp-3 h-[60px]">
            {project.description[locale as "de" | "en"]}
          </p>

          {/* Stack */}
          <div className={`flex flex-wrap gap-1.5 mb-3 ${stackExpanded ? "" : "max-h-10 overflow-hidden content-start"}`}>
            {(stackExpanded ? project.stack : project.stack.slice(0, 3)).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-[10px] font-medium text-[#A78BFA] bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-md whitespace-nowrap"
              >
                {tech}
              </span>
            ))}
            {hasMoreStack && !stackExpanded && (
              <button
                onClick={() => setStackExpanded(true)}
                className="px-2 py-0.5 text-[10px] text-white/40 hover:text-white/70 transition-colors whitespace-nowrap"
                title="Show all technologies"
              >
                +{project.stack.length - 3}
              </button>
            )}
            {stackExpanded && hasMoreStack && (
              <button
                onClick={() => setStackExpanded(false)}
                className="px-2 py-0.5 text-[10px] text-white/40 hover:text-white/70 transition-colors whitespace-nowrap"
                title="Hide technologies"
              >
                −
              </button>
            )}
          </div>

          {/* Actions - Always at bottom */}
          <div className="flex items-center gap-2 mt-auto pt-3 border-t border-white/5">
            {project.longDescription && (
              <button
                onClick={() => onOpen(project)}
                className="flex-1 px-3 py-2 text-xs font-medium text-white/70 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                Details
              </button>
            )}
            {!project.longDescription && <div className="flex-1" />}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all duration-200"
                title="Demo"
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
                title="Code"
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

const mainCategories: ProjectCategory[] = ["discord", "devtools", "system", "creative", "utility", "web"];

function StatusLegend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-white/50">
      <span className="text-white/30 uppercase tracking-wider">Status:</span>
      {Object.entries(STATUS_CONFIG).map(([key, config]) => (
        <span key={key} className="flex items-center gap-1">
          <span style={{ color: config.text }}>{config.icon}</span>
          <span style={{ color: config.text }}>{config.label}</span>
        </span>
      ))}
    </div>
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

  const filtered = activeCategory === "all"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  // Group by category when showing all
  const groupedProjects = activeCategory === "all"
    ? mainCategories.map(cat => ({
        category: cat,
        projects: filtered.filter(p => p.category === cat),
      })).filter(g => g.projects.length > 0)
    : [{ category: activeCategory, projects: filtered }];

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t("title")} subtitle={t("subtitle")} />

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-2 mb-6"
        >
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 text-sm font-medium rounded-xl border transition-all duration-200 flex items-center gap-2 ${
              activeCategory === "all"
                ? "bg-[#7C3AED] border-[#7C3AED] text-white shadow-lg shadow-[#7C3AED]/25"
                : "bg-white/3 border-white/10 text-white/50 hover:text-white hover:border-white/20"
            }`}
          >
            <FiLayers className="w-4 h-4" />
            All
          </button>
          {mainCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-sm font-medium rounded-xl border transition-all duration-200 flex items-center gap-2 ${
                activeCategory === cat
                  ? "bg-[#7C3AED] border-[#7C3AED] text-white shadow-lg shadow-[#7C3AED]/25"
                  : "bg-white/3 border-white/10 text-white/50 hover:text-white hover:border-white/20"
              }`}
            >
              <span>{CATEGORY_CONFIG[cat].icon}</span>
              <span className="hidden sm:inline">{CATEGORY_CONFIG[cat].label}</span>
            </button>
          ))}
        </motion.div>

        {/* Status Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <StatusLegend />
        </motion.div>

        {/* Projects by Category */}
        <div className="space-y-12">
          {groupedProjects.map(({ category, projects: catProjects }) => {
            const featured = catProjects.filter((p) => p.featured);
            const rest = catProjects.filter((p) => !p.featured);

            return (
              <div key={category}>
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">{CATEGORY_CONFIG[category].icon}</span>
                  <h2 className="text-lg font-semibold text-white">{CATEGORY_CONFIG[category].label}</h2>
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-sm text-white/40">{catProjects.length} projects</span>
                </div>

                {/* Featured Projects */}
                {featured.length > 0 && (
                  <div className="mb-6">
                    <p className="text-xs font-semibold text-[#A78BFA] uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#A78BFA] animate-pulse" />
                      Featured
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                      <AnimatePresence mode="popLayout">
                        {featured.map((project, i) => (
                          <motion.div
                            key={project.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, delay: i * 0.06 }}
                            className="h-full"
                          >
                            <ProjectCard project={project} locale={locale} onOpen={setSelected} />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {/* Regular Projects */}
                {rest.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 auto-rows-fr">
                    <AnimatePresence mode="popLayout">
                      {rest.map((project, i) => (
                        <motion.div
                          key={project.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3, delay: i * 0.04 }}
                          className="h-full"
                        >
                          <ProjectCard project={project} locale={locale} onOpen={setSelected} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            );
          })}
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
                <h2 className="text-xl font-bold text-white">{selected.title}</h2>
                <div className="flex items-center gap-3">
                  {selected.demo && (
                    <a
                      href={selected.demo}
                      target="_blank"
                      rel="noopener noreferrer"
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
                      className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200"
                    >
                      <FiGithub className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => setSelected(null)}
                    className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                {/* Status & Meta */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                    style={{
                      background: `color-mix(in srgb, ${STATUS_CONFIG[selected.status].text} 15%, transparent)`,
                      border: `1px solid color-mix(in srgb, ${STATUS_CONFIG[selected.status].text} 30%, transparent)`,
                      color: STATUS_CONFIG[selected.status].text,
                    }}
                  >
                    {STATUS_CONFIG[selected.status].icon}
                    <span>{STATUS_CONFIG[selected.status].label}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-white/40">
                    {CATEGORY_CONFIG[selected.category].icon}
                    <span>{CATEGORY_CONFIG[selected.category].label}</span>
                  </span>
                  <span className="text-xs text-white/30">{selected.year}</span>
                </div>

                {/* Labels */}
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

                {/* Stack */}
                <div className="mt-6 pt-4 border-t border-white/5">
                  <p className="text-xs text-white/30 uppercase tracking-wider mb-3">Stack</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-xs font-medium text-[#A78BFA] bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-md"
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
