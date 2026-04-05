"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  align?: "left" | "center";
}

export default function SectionHeader({ title, subtitle, align = "center" }: SectionHeaderProps) {
  const isCenter = align === "center";
  return (
    <div className={`mb-16 ${isCenter ? "text-center" : "text-left"}`}>
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={`inline-flex items-center gap-2 text-xs font-semibold tracking-[0.3em] text-[#A78BFA] uppercase mb-3 ${isCenter ? "justify-center" : ""}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] shadow-[0_0_6px_#7C3AED]" />
        {subtitle}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl sm:text-5xl font-bold text-white tracking-tight"
      >
        {title}
      </motion.h2>
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
        style={{ transformOrigin: isCenter ? "center" : "left" }}
        className={`mt-4 h-px w-16 bg-gradient-to-r from-[#7C3AED] to-transparent ${isCenter ? "mx-auto" : ""}`}
      />
    </div>
  );
}
