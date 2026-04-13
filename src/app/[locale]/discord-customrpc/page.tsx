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
    {
      question: t("faq6Question"),
      answer: t("faq6Answer"),
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

interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  prerelease: boolean;
  html_url: string;
}

export default function DiscordCustomRPCPage() {
  const t = useTranslations("discordCustomRPC");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [stars, setStars] = useState<number | null>(null);
  const [releases, setReleases] = useState<GitHubRelease[]>([]);
  const [releasesLoading, setReleasesLoading] = useState(true);

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

    // Fetch GitHub releases
    fetch("https://api.github.com/repos/XSaitoKungX/Discord-CustomRPC/releases?per_page=5")
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setReleases(Array.isArray(data) ? data : []);
        setReleasesLoading(false);
      })
      .catch(() => {
        setReleases([]);
        setReleasesLoading(false);
      });
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

            {/* Secondary Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
              {/* Profile Sharing Link */}
              <Link
                href="/discord-customrpc/share"
                className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-linear-to-r from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 border border-white/20 hover:border-white/30 text-white transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 hover:-translate-y-0.5"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 group-hover:bg-white/15 transition-colors">
                  <FiShare2 className="w-4 h-4" />
                </span>
                <span className="font-semibold">{t("viewSharedProfiles")}</span>
              </Link>

              {/* GitHub Star Button */}
              <a
                href="https://github.com/XSaitoKungX/Discord-CustomRPC"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-linear-to-r from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 border border-white/20 hover:border-white/30 text-white transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 hover:-translate-y-0.5"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 group-hover:bg-white/15 transition-colors">
                  <FiGithub className="w-4 h-4" />
                </span>
                <span className="font-semibold">{t("starOnGithub")}</span>
                {stars !== null && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 bg-linear-to-r from-[#FBBF24]/20 to-[#F59E0B]/20 text-[#FBBF24] rounded-full text-xs font-bold border border-[#FBBF24]/20">
                    <FiStar className="w-3 h-3 fill-current" />
                    {stars}
                  </span>
                )}
              </a>
            </div>
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

      {/* Profile Sharing CTA */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-[#5865F2]/10 to-transparent" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#5865F2]/20 flex items-center justify-center mx-auto mb-6">
                <FiShare2 className="w-8 h-8 text-[#5865F2]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {t("shareCtaTitle")}
              </h2>
              <p className="text-white/60 mb-8 max-w-lg mx-auto">
                {t("shareCtaDescription")}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/discord-customrpc/share"
                  className="flex items-center gap-2 px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-[#5865F2]/25"
                >
                  <FiExternalLink className="w-5 h-5" />
                  {t("openShareViewer")}
                </Link>
                <a
                  href="https://github.com/XSaitoKungX/Discord-CustomRPC/blob/main/README.md#profile-sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-medium transition-all duration-200"
                >
                  <FiGithub className="w-5 h-5" />
                  {t("learnMore")}
                </a>
              </div>
            </div>
          </GlassCard>
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
            {releasesLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-[#5865F2] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : releases.length > 0 ? (
              <div className="space-y-4">
                {releases.map((release, index) => (
                  <motion.div
                    key={release.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <a
                      href={release.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-white group-hover:text-[#5865F2] transition-colors">
                              {release.name || release.tag_name}
                            </span>
                            {release.prerelease && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                {t("betaWarning")}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-white/40">
                            {t("released")} {new Date(release.published_at).toLocaleDateString()}
                          </p>
                          {release.body && (
                            <p className="text-sm text-white/60 mt-2 line-clamp-2">
                              {release.body.substring(0, 150).replace(/#{1,6}\s/g, '').trim()}...
                            </p>
                          )}
                        </div>
                        <FiExternalLink className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors shrink-0 mt-1" />
                      </div>
                    </a>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiGithub className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/60 mb-4">{t("noReleasesFound")}</p>
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
            )}
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
