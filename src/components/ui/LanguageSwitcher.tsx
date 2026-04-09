"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  return (
    <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg border border-white/10">
      {(["de", "en"] as const).map((lang) => (
        <motion.button
          key={lang}
          onClick={() => switchLocale(lang)}
          whileTap={{ scale: 0.95 }}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all duration-200 uppercase tracking-wider ${
            locale === lang
              ? "bg-[#7C3AED] text-white shadow-lg shadow-[#7C3AED]/25"
              : "text-white/50 hover:text-white/80"
          }`}
          aria-label={`Switch to ${lang}`}
        >
          {lang}
        </motion.button>
      ))}
    </div>
  );
}
