"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { RiTerminalBoxFill } from "react-icons/ri";
import { FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
  const locale = useLocale();
  const t = useTranslations("common");

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-lg"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 mb-8">
          <RiTerminalBoxFill className="w-10 h-10 text-[#A78BFA]" />
        </div>

        <div className="font-mono text-[120px] font-bold leading-none text-gradient-purple mb-4">
          404
        </div>

        <div className="font-mono text-sm text-white/30 mb-8 space-y-1">
          <div className="flex items-center justify-center gap-2">
            <span className="text-[#34D399]">[ OK ]</span>
            <span>Loading system...</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-[#34D399]">[ OK ]</span>
            <span>Checking routes...</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-red-400">[FAIL]</span>
            <span>Page not found</span>
          </div>
        </div>

        <p className="text-white/40 text-sm mb-8 leading-relaxed">
          {locale === "de"
            ? "Diese Seite existiert nicht oder wurde verschoben."
            : "This page doesn't exist or has been moved."}
        </p>

        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-linear-to-r from-[#7C3AED] to-[#4F46E5] rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-[#7C3AED]/25"
        >
          <FiArrowLeft className="w-4 h-4" />
          {t("back")}
        </Link>
      </motion.div>
    </div>
  );
}
