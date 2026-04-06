"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowRight, FiGithub } from "react-icons/fi";
import { SiDiscord, SiTypescript, SiReact, SiNextdotjs, SiTailwindcss, SiBun } from "react-icons/si";
import { HiArrowDown } from "react-icons/hi";
import TerminalHero from "@/components/sections/TerminalHero";
import RoleTyper from "@/components/sections/RoleTyper";

interface Stats {
  projects: number;
  tech: number;
  commits: number;
}

function useStats() {
  const [stats, setStats] = useState<Stats>({ projects: 0, tech: 0, commits: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback values on error
        setStats({ projects: 6, tech: 26, commits: 1000 });
        setLoading(false);
      });
  }, []);

  return { stats, loading };
}

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === 0) return;
    const duration = 1000;
    const steps = 30;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <>{display.toLocaleString()}{suffix}</>;
}

export default function HomePage() {
  const t = useTranslations("home");
  const locale = useLocale();
  const { stats, loading } = useStats();

  return (
    <div className="relative min-h-screen flex flex-col">
      <section className="relative flex-1 flex items-center min-h-screen pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="order-2 lg:order-1"
            >
              <div className="mb-4">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold tracking-widest text-[#A78BFA] bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-full uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Available for projects
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-4 leading-[1.05]">
                <span className="text-white/70 text-3xl sm:text-4xl font-medium block mb-2">
                  {t("greeting")}
                </span>
                <span className="text-gradient">{t("name")}</span>
              </h1>

              <div className="h-12 mb-6">
                <RoleTyper />
              </div>

              <p className="text-lg text-white/50 leading-relaxed max-w-xl mb-10">
                {t("description")}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href={`/${locale}/projects`}
                  className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] rounded-xl hover:opacity-90 transition-all duration-200 shadow-lg shadow-[#7C3AED]/25 hover:shadow-[#7C3AED]/40"
                >
                  {t("cta_projects")}
                  <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white/80 border border-white/10 rounded-xl hover:bg-white/5 hover:border-white/20 transition-all duration-200"
                >
                  {t("cta_contact")}
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-8">
                {[
                  { icon: SiNextdotjs, label: "Next.js", color: "#fff" },
                  { icon: SiTypescript, label: "TypeScript", color: "#3178C6" },
                  { icon: SiReact, label: "React", color: "#61DAFB" },
                  { icon: SiTailwindcss, label: "Tailwind", color: "#06B6D4" },
                  { icon: SiBun, label: "Bun", color: "#FBF0DF" },
                ].map(({ icon: Icon, label, color }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border border-white/10 bg-white/[0.03] text-white/50"
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color }} />
                    {label}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 mt-6">
                <a
                  href="https://github.com/XSaitoKungX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-white/10 text-white/40 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all duration-200"
                  aria-label="GitHub"
                >
                  <FiGithub className="w-5 h-5" />
                </a>
                <a
                  href="https://discord.com/channels/@me/848917797501141052"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-white/10 text-white/40 hover:text-[#5865F2] hover:border-[#5865F2]/30 hover:bg-[#5865F2]/10 transition-all duration-200"
                  aria-label="Discord"
                >
                  <SiDiscord className="w-5 h-5" />
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="order-1 lg:order-2"
            >
              <TerminalHero />
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20"
        >
          <span className="text-xs tracking-widest uppercase">{t("scroll")}</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <HiArrowDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </section>

      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-8 lg:gap-16"
          >
            {[
              { value: stats.projects, label: locale === "de" ? "Projekte" : "Projects", suffix: "" },
              { value: 2, label: locale === "de" ? "Jahre Erfahrung" : "Years Experience", suffix: "+" },
              { value: stats.tech, label: locale === "de" ? "Technologien" : "Technologies", suffix: "" },
              { value: stats.commits, label: "Commits", suffix: "+" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className={`text-3xl sm:text-4xl font-bold text-gradient-purple mb-1 ${loading ? "animate-pulse" : ""}`}>
                  {loading ? "—" : <AnimatedNumber value={stat.value} suffix={stat.suffix} />}
                </div>
                <div className="text-sm text-white/40">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
