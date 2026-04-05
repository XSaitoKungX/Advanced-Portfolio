"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { FiExternalLink, FiGithub, FiX } from "react-icons/fi";
import SectionHeader from "@/components/ui/SectionHeader";
import TiltCard from "@/components/ui/TiltCard";
import GlassCard from "@/components/ui/GlassCard";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";
import { projects, type Project, type ProjectCategory } from "@/lib/data/projects";

const STATUS_COLORS = {
  completed: { bg: "#34D399/10", border: "#34D399/20", text: "#34D399" },
  in_progress: { bg: "#FBBF24/10", border: "#FBBF24/20", text: "#FBBF24" },
  planned: { bg: "#60A5FA/10", border: "#60A5FA/20", text: "#60A5FA" },
};

function ProjectCard({
  project,
  locale,
  t,
  onOpen,
}: {
  project: Project;
  locale: string;
  t: ReturnType<typeof useTranslations>;
  onOpen: (p: Project) => void;
}) {
  const status = STATUS_COLORS[project.status];
  return (
    <TiltCard intensity={5} className="group h-full">
      <GlassCard hover className="h-full flex flex-col p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-wrap gap-2">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[10px] font-semibold text-white/50 bg-white/5 border border-white/10 rounded-full uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>
          <span
            className="text-[10px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ml-2"
            style={{
              background: `color-mix(in srgb, ${status.text} 10%, transparent)`,
              border: `1px solid color-mix(in srgb, ${status.text} 20%, transparent)`,
              color: status.text,
            }}
          >
            {t(`status.${project.status}`)}
          </span>
        </div>

        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#A78BFA] transition-colors duration-200">
          {project.title}
        </h3>
        <p className="text-sm text-white/50 leading-relaxed flex-1 mb-6">
          {project.description[locale as "de" | "en"]}
        </p>

        <div className="flex items-center gap-2 mt-auto">
          {project.longDescription && (
            <button
              onClick={() => onOpen(project)}
              className="flex-1 px-4 py-2 text-sm font-medium text-white/70 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:text-white transition-all duration-200"
            >
              {t("view_details")}
            </button>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all duration-200"
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
              className="p-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all duration-200"
              title={t("view_code")}
            >
              <FiGithub className="w-4 h-4" />
            </a>
          )}
        </div>
      </GlassCard>
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

  const categories: Array<{ key: ProjectCategory | "all"; label: string }> = [
    { key: "all", label: t("filter_all") },
    { key: "web", label: "Web" },
    { key: "tool", label: "Tools" },
    { key: "mobile", label: "Mobile" },
    { key: "other", label: "Other" },
  ];

  const filtered =
    activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const featured = filtered.filter((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t("title")} subtitle={t("subtitle")} />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-4 py-2 text-sm font-medium rounded-xl border transition-all duration-200 ${
                activeCategory === key
                  ? "bg-[#7C3AED] border-[#7C3AED] text-white shadow-lg shadow-[#7C3AED]/25"
                  : "bg-white/[0.03] border-white/10 text-white/50 hover:text-white hover:border-white/20"
              }`}
            >
              {label}
            </button>
          ))}
        </motion.div>

        {featured.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-5">Featured</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {featured.map((project, i) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                  >
                    <ProjectCard project={project} locale={locale} t={t} onOpen={setSelected} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {rest.length > 0 && (
          <div>
            {featured.length > 0 && (
              <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-5">
                {locale === "de" ? "Weitere Projekte" : "More Projects"}
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {rest.map((project, i) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                  >
                    <ProjectCard project={project} locale={locale} t={t} onOpen={setSelected} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

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
                <MarkdownRenderer
                  content={selected.longDescription?.[locale as "de" | "en"] ?? selected.description[locale as "de" | "en"]}
                />
                <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/5">
                  {selected.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-medium text-[#A78BFA] bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
