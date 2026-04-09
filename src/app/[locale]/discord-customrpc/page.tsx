"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  FiDownload,
  FiGithub,
  FiStar,
  FiZap,
  FiSettings,
  FiMonitor,
  FiShare2,
  FiChevronDown,
  FiChevronUp,
  FiExternalLink,
} from "react-icons/fi";
import { SiDiscord } from "react-icons/si";
import SectionHeader from "@/components/ui/SectionHeader";
import GlassCard from "@/components/ui/GlassCard";
import { DownloadButtons } from "@/components/discord/DownloadButtons";

function useFeatures(t: (key: string) => string) {
  return [
    {
      icon: <FiMonitor className="w-6 h-6" />,
      title: t("featureRichPresence"),
      description: t("featureRichPresenceDesc"),
    },
    {
      icon: <FiSettings className="w-6 h-6" />,
      title: t("featureEasySetup"),
      description: t("featureEasySetupDesc"),
    },
    {
      icon: <FiZap className="w-6 h-6" />,
      title: t("featureLightweight"),
      description: t("featureLightweightDesc"),
    },
    {
      icon: <FiShare2 className="w-6 h-6" />,
      title: t("featureSharing"),
      description: t("featureSharingDesc"),
    },
  ];
}

function useSteps(t: (key: string) => string) {
  return [
    {
      number: "01",
      title: t("step1Title"),
      description: t("step1Desc"),
    },
    {
      number: "02",
      title: t("step2Title"),
      description: t("step2Desc"),
    },
    {
      number: "03",
      title: t("step3Title"),
      description: t("step3Desc"),
    },
  ];
}

function useFaqs(t: (key: string) => string) {
  return [
    {
      question: t("faq1Question"),
      answer: t("faq1Answer"),
    },
    {
      question: t("faq2Question"),
      answer: t("faq2Answer"),
    },
    {
      question: t("faq3Question"),
      answer: t("faq3Answer"),
    },
    {
      question: t("faq4Question"),
      answer: t("faq4Answer"),
    },
    {
      question: t("faq5Question"),
      answer: t("faq5Answer"),
    },
  ];
}

function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
      >
        <span className="font-medium text-white">{question}</span>
        {isOpen ? (
          <FiChevronUp className="w-5 h-5 text-white/60" />
        ) : (
          <FiChevronDown className="w-5 h-5 text-white/60" />
        )}
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="px-4 pb-4"
        >
          <p className="text-sm text-white/60 leading-relaxed">{answer}</p>
        </motion.div>
      )}
    </div>
  );
}

function ProfileShareViewer({ t }: { t: (key: string) => string }) {
  const searchParams = useSearchParams();
  const data = searchParams.get("data");

  const { profile, error } = useMemo(() => {
    if (!data) return { profile: null, error: null };
    try {
      const decoded = JSON.parse(atob(data));
      return { profile: decoded, error: null };
    } catch {
      return { profile: null, error: t("invalidProfileData") };
    }
  }, [data, t]);

  if (!data) return null;

  return (
    <section className="py-8">
      <GlassCard className="max-w-2xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-4">
          <FiShare2 className="w-5 h-5 text-[#5865F2]" />
          <h2 className="text-xl font-bold text-white">{t("sharedProfile")}</h2>
        </div>

        {error ? (
          <p className="text-red-400">{error}</p>
        ) : profile ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {profile.largeImage && (
                <Image
                  src={profile.largeImage}
                  alt="Profile"
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-lg object-cover"
                  unoptimized
                />
              )}
              <div>
                {profile.name && (
                  <p className="font-semibold text-white">{profile.name}</p>
                )}
                {profile.details && (
                  <p className="text-sm text-white/60">{profile.details}</p>
                )}
                {profile.state && (
                  <p className="text-sm text-white/40">{profile.state}</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <a
                href={`/api/discord-customrpc/download?data=${encodeURIComponent(data)}`}
                className="flex items-center gap-2 px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg text-sm font-medium transition-colors"
              >
                <FiDownload className="w-4 h-4" />
                {t("importProfile")}
              </a>
            </div>
          </div>
        ) : (
          <p className="text-white/60">{t("loadingProfile")}</p>
        )}
      </GlassCard>
    </section>
  );
}

export default function DiscordCustomRPCPage() {
  const t = useTranslations("discordCustomRPC");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [stars, setStars] = useState<number | null>(null);

  const FEATURES = useFeatures(t);
  const STEPS = useSteps(t);
  const FAQS = useFaqs(t);

  useEffect(() => {
    // Fetch GitHub stars (silently fail if repo not found/private)
    fetch("https://api.github.com/repos/XSaitoKungX/Discord-CustomRPC")
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => setStars(data.stargazers_count ?? null))
      .catch(() => setStars(null));
  }, []);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#5865F2]/10 border border-[#5865F2]/20 text-[#5865F2] text-sm font-medium mb-6">
              <SiDiscord className="w-4 h-4" />
              {t("badge")}
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {t("title")}
              <br />
              <span className="text-[#5865F2]">{t("titleHighlight")}</span>
            </h1>

            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-8">
              {t("description")}
            </p>

            {/* Download Buttons */}
            <DownloadButtons />

            {/* GitHub Star Button */}
            <a
              href="https://github.com/XSaitoKungX/Discord-CustomRPC"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all duration-200"
            >
              <FiGithub className="w-5 h-5" />
              <span className="font-medium">{t("starOnGithub")}</span>
              {stars !== null && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-[#FBBF24]/10 text-[#FBBF24] rounded-full text-xs">
                  <FiStar className="w-3 h-3" />
                  {stars}
                </span>
              )}
            </a>
          </motion.div>

          {/* Profile Share Viewer (if data param present) */}
          <ProfileShareViewer t={t} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            title={t("featuresTitle")}
            subtitle={t("featuresSubtitle")}
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="h-full p-6 hover:bg-white/5 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-[#5865F2]/10 flex items-center justify-center text-[#5865F2] mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-white/60">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 px-4 border-t border-white/5 bg-white/2">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            title={t("howItWorksTitle")}
            subtitle={t("howItWorksSubtitle")}
          />

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {STEPS.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                {index < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-linear-to-r from-white/20 to-transparent" />
                )}
                <div className="text-6xl font-bold text-white/5 mb-4">{step.number}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-white/60">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            title={t("faqTitle")}
            subtitle={t("faqSubtitle")}
          />

          <div className="space-y-3 mt-12">
            {FAQS.map((faq, index) => (
              <FaqItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaq === index}
                onToggle={() => setOpenFaq(openFaq === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Changelog Section */}
      <section className="py-16 px-4 border-t border-white/5 bg-white/2">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <SectionHeader
              title={t("changelogTitle")}
              subtitle={t("changelogSubtitle")}
            />
            <a
              href="https://github.com/XSaitoKungX/Discord-CustomRPC/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
            >
              {t("viewAllReleases")}
              <FiExternalLink className="w-4 h-4" />
            </a>
          </div>

          <GlassCard className="p-6">
            <div className="text-center py-8">
              <FiGithub className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60 mb-4">
                {t("changelogPlaceholder")}
              </p>
              <a
                href="https://github.com/XSaitoKungX/Discord-CustomRPC/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#5865F2]/10 hover:bg-[#5865F2]/20 border border-[#5865F2]/20 text-[#5865F2] rounded-xl font-medium transition-all duration-200"
              >
                <FiExternalLink className="w-4 h-4" />
                {t("viewReleasesOnGithub")}
              </a>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("ctaTitle")}
          </h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            {t("ctaDescription")}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://github.com/XSaitoKungX/Discord-CustomRPC/releases/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-[#5865F2]/25"
            >
              <FiDownload className="w-5 h-5" />
              {t("downloadNow")}
            </a>
            <a
              href="https://github.com/XSaitoKungX/Discord-CustomRPC"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-medium transition-all duration-200"
            >
              <FiGithub className="w-5 h-5" />
              {t("viewOnGithub")}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white/40 text-sm">
            <span>{t("madeWith")}</span>
            <span className="text-red-500">♥</span>
            <span>{t("by")}</span>
            <Link href="https://github.com/XSaitoKungX" className="text-[#5865F2] hover:underline">
              XSaitoKungX
            </Link>
          </div>

          <div className="flex items-center gap-6 text-sm text-white/40">
            <a
              href="https://github.com/XSaitoKungX/Discord-CustomRPC"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://github.com/XSaitoKungX/Discord-CustomRPC/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              {t("license")}
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
