"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiAlertTriangle, FiArrowLeft, FiRefreshCw } from "react-icons/fi";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useLocale();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-lg"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 mb-8">
          <FiAlertTriangle className="w-10 h-10 text-red-400" />
        </div>

        <h1 className="text-4xl font-bold text-white mb-4">
          {locale === "de" ? "Etwas ist schiefgelaufen" : "Something went wrong"}
        </h1>

        <p className="text-white/40 text-sm mb-8 leading-relaxed">
          {locale === "de"
            ? "Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut."
            : "An unexpected error occurred. Please try again."}
        </p>

        {error.digest && (
          <p className="font-mono text-xs text-white/20 mb-8">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-linear-to-r from-[#7C3AED] to-[#4F46E5] rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-[#7C3AED]/25"
          >
            <FiRefreshCw className="w-4 h-4" />
            {locale === "de" ? "Erneut versuchen" : "Try again"}
          </button>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white/70 border border-white/10 rounded-xl hover:bg-white/5 transition-all duration-200"
          >
            <FiArrowLeft className="w-4 h-4" />
            {locale === "de" ? "Startseite" : "Home"}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
