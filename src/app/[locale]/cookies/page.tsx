"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import GlassCard from "@/components/ui/GlassCard";

export default function CookiesPage() {
  const t = useTranslations("legal");

  return (
    <main className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8"
        >
          <FiArrowLeft className="w-4 h-4" />
          {t("backToHome")}
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {t("cookiesTitle")}
        </h1>
        <p className="text-white/60 mb-8">{t("lastUpdated")}: April 9, 2026</p>

        <GlassCard className="p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              {t("cookiesSection1Title")}
            </h2>
            <p className="text-white/70 leading-relaxed">
              {t("cookiesSection1Content")}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              {t("cookiesSection2Title")}
            </h2>
            <p className="text-white/70 leading-relaxed mb-3">
              {t("cookiesSection2Content")}
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li><strong>{t("cookiesEssential")}:</strong> {t("cookiesEssentialDesc")}</li>
              <li><strong>{t("cookiesAuth")}:</strong> {t("cookiesAuthDesc")}</li>
              <li><strong>{t("cookiesPreferences")}:</strong> {t("cookiesPreferencesDesc")}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              {t("cookiesSection3Title")}
            </h2>
            <p className="text-white/70 leading-relaxed">
              {t("cookiesSection3Content")}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              {t("contactTitle")}
            </h2>
            <p className="text-white/70 leading-relaxed">
              {t("contactContent")}:{" "}
              <Link
                href="/contact"
                className="text-[#A78BFA] hover:underline"
              >
                {t("contactLink")}
              </Link>
            </p>
          </section>
        </GlassCard>
      </div>
    </main>
  );
}
