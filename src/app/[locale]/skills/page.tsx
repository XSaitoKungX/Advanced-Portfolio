"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import * as SiIcons from "react-icons/si";
import SectionHeader from "@/components/ui/SectionHeader";
import TiltCard from "@/components/ui/TiltCard";
import { skills, type SkillCategory } from "@/lib/data/skills";


function SkillIcon({ name }: { name: string }) {
  const Icon = (SiIcons as Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>>)[name];
  if (!Icon) return <div className="w-7 h-7 rounded bg-white/10" />;
  return <Icon className="w-7 h-7" />;
}

export default function SkillsPage() {
  const t = useTranslations("skills");
  const [activeCategory, setActiveCategory] = useState<SkillCategory | "all">("all");

  const tProjects = useTranslations("projects");
  const categoryCounts: Record<string, number> = {
    all: skills.length,
    frontend: skills.filter((s) => s.category === "frontend").length,
    backend: skills.filter((s) => s.category === "backend").length,
    devops: skills.filter((s) => s.category === "devops").length,
    tools: skills.filter((s) => s.category === "tools").length,
  };

  const categories: Array<{ key: SkillCategory | "all"; label: string }> = [
    { key: "all", label: tProjects("filter_all") },
    { key: "frontend", label: t("categories.frontend") },
    { key: "backend", label: t("categories.backend") },
    { key: "devops", label: t("categories.devops") },
    { key: "tools", label: t("categories.tools") },
  ];

  const filtered = activeCategory === "all"
    ? skills
    : skills.filter((s) => s.category === activeCategory);

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t("title")} subtitle={t("subtitle")} />

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center text-sm text-white/40 max-w-xl mx-auto -mt-10 mb-10 leading-relaxed"
        >
          {t("note")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border transition-all duration-200 ${
                activeCategory === key
                  ? "bg-[#7C3AED] border-[#7C3AED] text-white shadow-lg shadow-[#7C3AED]/25"
                  : "bg-white/3 border-white/10 text-white/50 hover:text-white hover:border-white/20"
              }`}
            >
              {label}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                activeCategory === key ? "bg-white/20 text-white" : "bg-white/10 text-white/40"
              }`}>
                {categoryCounts[key]}
              </span>
            </button>
          ))}
        </motion.div>

        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
        >
          <AnimatePresence mode="popLayout">
          {filtered.map((skill, i) => (
            <motion.div
              key={skill.name}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
            >
              <TiltCard
                intensity={6}
                className="group h-full"
              >
                <div className="relative bg-white/3 border border-white/10 rounded-2xl p-5 h-full flex flex-col items-center gap-3 transition-all duration-300 group-hover:bg-white/7 group-hover:border-white/20">
                  <div
                    className="relative p-3 rounded-xl transition-all duration-300"
                    style={{
                      background: `${skill.color}12`,
                      border: `1px solid ${skill.color}20`,
                    }}
                  >
                    <div style={{ color: skill.color }}>
                      <SkillIcon name={skill.icon} />
                    </div>
                    <div
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"
                      style={{ background: `${skill.color}20` }}
                    />
                  </div>

                  <p className="text-xs font-semibold text-white/80 text-center leading-tight">
                    {skill.name}
                  </p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
