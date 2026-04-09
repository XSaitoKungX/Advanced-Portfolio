"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { FiBriefcase, FiBook, FiStar, FiCode } from "react-icons/fi";
import SectionHeader from "@/components/ui/SectionHeader";
import GlassCard from "@/components/ui/GlassCard";
import { experiences, type Experience } from "@/lib/data/experience";

const TYPE_ICONS = {
  work: FiBriefcase,
  education: FiBook,
  freelance: FiStar,
  personal: FiCode,
};

const TYPE_COLORS = {
  work: "#A78BFA",
  education: "#60A5FA",
  freelance: "#34D399",
  personal: "#FBBF24",
};

function formatDate(dateStr: string, locale: string) {
  const [year, month] = dateStr.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString(locale === "de" ? "de-DE" : "en-US", {
    month: "short",
    year: "numeric",
  });
}

function ExperienceItem({ exp, locale, t, index }: { exp: Experience; locale: string; t: ReturnType<typeof useTranslations>; index: number }) {
  const Icon = TYPE_ICONS[exp.type];
  const color = TYPE_COLORS[exp.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative pl-10"
    >
      <div
        className="absolute left-0 top-0 w-8 h-8 rounded-xl flex items-center justify-center z-10"
        style={{ background: `${color}15`, border: `1px solid ${color}30` }}
      >
        <Icon className="w-4 h-4" style={{ color }} />
      </div>

      <div className="absolute left-4 top-8 bottom-0 w-px bg-white/5" />

      <GlassCard className="p-6 mb-6 ml-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
          <div>
            <h3 className="text-base font-bold text-white">{exp.role[locale as "de" | "en"]}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-medium text-[#A78BFA]">{exp.company}</span>
              {exp.location && (
                <>
                  <span className="text-white/20">·</span>
                  <span className="text-xs text-white/40">{exp.location}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white/40 whitespace-nowrap shrink-0">
            <span>{formatDate(exp.startDate, locale)}</span>
            <span>—</span>
            <span>{exp.endDate ? formatDate(exp.endDate, locale) : t("present")}</span>
          </div>
        </div>

        <p className="text-sm text-white/50 leading-relaxed mb-4">
          {exp.description[locale as "de" | "en"]}
        </p>

        <div className="flex flex-wrap gap-2">
          {exp.technologies.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 text-xs font-medium text-white/60 bg-white/4 border border-white/8 rounded-lg"
            >
              {tech}
            </span>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}

export default function ExperiencePage() {
  const t = useTranslations("experience");
  const locale = useLocale();

  const work = experiences.filter((e) => e.type === "work" || e.type === "freelance" || e.type === "personal");
  const education = experiences.filter((e) => e.type === "education");

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t("title")} subtitle={t("subtitle")} align="left" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 mb-8"
            >
              <FiBriefcase className="w-4 h-4 text-[#A78BFA]" />
              <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest">
                {locale === "de" ? "Berufserfahrung" : "Work Experience"}
              </h2>
            </motion.div>
            <div className="space-y-0">
              {work.map((exp, i) => (
                <ExperienceItem key={exp.id} exp={exp} locale={locale} t={t} index={i} />
              ))}
            </div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 mb-8"
            >
              <FiBook className="w-4 h-4 text-[#60A5FA]" />
              <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest">
                {locale === "de" ? "Ausbildung" : "Education"}
              </h2>
            </motion.div>
            <div className="space-y-0">
              {education.map((exp, i) => (
                <ExperienceItem key={exp.id} exp={exp} locale={locale} t={t} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
