"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import GlassCard from "@/components/ui/GlassCard";

export default function PrivacyPage() {
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
          {t("privacyTitle")}
        </h1>
        <p className="text-white/60 mb-8">{t("lastUpdated")}: April 9, 2026</p>

        <GlassCard className="p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              {t("privacySection1Title")}
            </h2>
            <p className="text-white/70 leading-relaxed">
              {t("privacySection1Content")}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              {t("privacySection2Title")}
            </h2>
            <p className="text-white/70 leading-relaxed mb-3">
              {t("privacySection2Content")}
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li>{t("privacySection2Item1")}</li>
              <li>{t("privacySection2Item2")}</li>
              <li>{t("privacySection2Item3")}</li>
              <li>{t("privacySection2Item4")}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              {t("privacySection3Title")}
            </h2>
            <p className="text-white/70 leading-relaxed">
              {t("privacySection3Content")}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              {t("privacySection4Title")}
            </h2>
            <p className="text-white/70 leading-relaxed">
              {t("privacySection4Content")}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">
              {t("privacySection5Title")}
            </h2>
            <p className="text-white/70 leading-relaxed">
              {t("privacySection5Content")}
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
