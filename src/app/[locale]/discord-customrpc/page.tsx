"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
import { FaWindows, FaLinux, FaApple } from "react-icons/fa";
import { SiDiscord } from "react-icons/si";
import SectionHeader from "@/components/ui/SectionHeader";
import GlassCard from "@/components/ui/GlassCard";

const FEATURES = [
  {
    icon: <FiMonitor className="w-6 h-6" />,
    title: "Rich Presence",
    description: "Show your current activity with custom images, text and timestamps",
  },
  {
    icon: <FiSettings className="w-6 h-6" />,
    title: "Easy Setup",
    description: "No coding required - configure everything through a simple interface",
  },
  {
    icon: <FiZap className="w-6 h-6" />,
    title: "Lightweight",
    description: "Minimal resource usage - runs silently in the background",
  },
  {
    icon: <FiShare2 className="w-6 h-6" />,
    title: "Profile Sharing",
    description: "Share your custom profiles with friends via link or import files",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Download",
    description: "Get the app for your platform - Windows, Linux or Mac",
  },
  {
    number: "02",
    title: "Configure",
    description: "Set up your custom status with images, text and buttons",
  },
  {
    number: "03",
    title: "Connect",
    description: "Link with Discord and your Rich Presence goes live instantly",
  },
];

const FAQS = [
  {
    question: "Is this safe?",
    answer: "Yes! The application is fully open source. Your Discord token is never stored on any server - everything runs locally on your machine. You can verify the code yourself on GitHub.",
  },
  {
    question: "Do I need to be a developer?",
    answer: "Not at all! Discord CustomRPC is designed to be user-friendly. Just fill in the fields, upload images, and you're ready to go. No programming knowledge required.",
  },
  {
    question: "Is this against Discord TOS?",
    answer: "No - Discord Rich Presence is an official Discord feature supported by their API. This tool uses the official RPC protocol and is completely within Discord's Terms of Service.",
  },
  {
    question: "Can I use custom images?",
    answer: "Yes! You can upload your own images or use any image URL. The app supports PNG, JPG and GIF formats for animated statuses.",
  },
  {
    question: "Does it work with Discord on browser?",
    answer: "Discord CustomRPC requires the Discord desktop app to be running. It connects directly to the Discord client via RPC.",
  },
];

function DownloadButton({
  icon,
  platform,
  extension,
  href,
  primary = false,
}: {
  icon: React.ReactNode;
  platform: string;
  extension: string;
  href: string;
  primary?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-3 px-5 py-3 rounded-xl font-medium transition-all duration-200 ${
        primary
          ? "bg-[#5865F2] hover:bg-[#4752C4] text-white shadow-lg shadow-[#5865F2]/25"
          : "bg-white/5 hover:bg-white/10 border border-white/10 text-white"
      }`}
    >
      {icon}
      <div className="flex flex-col items-start">
        <span className="text-xs text-white/60">Download for</span>
        <span className="text-sm font-semibold">{platform}</span>
      </div>
      <span className="text-xs text-white/40 ml-2">.{extension}</span>
    </a>
  );
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

function ProfileShareViewer() {
  const searchParams = useSearchParams();
  const data = searchParams.get("data");

  const { profile, error } = useMemo(() => {
    if (!data) return { profile: null, error: null };
    try {
      const decoded = JSON.parse(atob(data));
      return { profile: decoded, error: null };
    } catch {
      return { profile: null, error: "Invalid profile data" };
    }
  }, [data]);

  if (!data) return null;

  return (
    <section className="py-8">
      <GlassCard className="max-w-2xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-4">
          <FiShare2 className="w-5 h-5 text-[#5865F2]" />
          <h2 className="text-xl font-bold text-white">Shared Profile</h2>
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
                Import Profile
              </a>
            </div>
          </div>
        ) : (
          <p className="text-white/60">Loading profile...</p>
        )}
      </GlassCard>
    </section>
  );
}

export default function DiscordCustomRPCPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [stars, setStars] = useState<number | null>(null);

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
              Discord Rich Presence Tool
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Create your perfect
              <br />
              <span className="text-[#5865F2]">Discord Rich Presence</span>
            </h1>

            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-8">
              Customize your Discord status with custom images, text, buttons and timestamps.
              Easy to use, open source, and completely free.
            </p>

            {/* Download Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <DownloadButton
                icon={<FaWindows className="w-6 h-6" />}
                platform="Windows"
                extension="exe"
                href="https://github.com/XSaitoKungX/Discord-CustomRPC/releases/latest/download/discord-customrpc-windows.exe"
                primary
              />
              <DownloadButton
                icon={<FaLinux className="w-6 h-6" />}
                platform="Linux"
                extension="deb"
                href="https://github.com/XSaitoKungX/Discord-CustomRPC/releases/latest/download/discord-customrpc-linux.deb"
              />
              <DownloadButton
                icon={<FaApple className="w-6 h-6" />}
                platform="Mac"
                extension="dmg"
                href="https://github.com/XSaitoKungX/Discord-CustomRPC/releases/latest/download/discord-customrpc-mac.dmg"
              />
            </div>

            {/* GitHub Star Button */}
            <a
              href="https://github.com/XSaitoKungX/Discord-CustomRPC"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all duration-200"
            >
              <FiGithub className="w-5 h-5" />
              <span className="font-medium">Star on GitHub</span>
              {stars !== null && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-[#FBBF24]/10 text-[#FBBF24] rounded-full text-xs">
                  <FiStar className="w-3 h-3" />
                  {stars}
                </span>
              )}
            </a>
          </motion.div>

          {/* Profile Share Viewer (if data param present) */}
          <ProfileShareViewer />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            title="Features"
            subtitle="Everything you need to create stunning Discord statuses"
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
            title="How it Works"
            subtitle="Get started in three simple steps"
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
            title="FAQ"
            subtitle="Frequently asked questions"
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
              title="Changelog"
              subtitle="Latest releases and updates"
            />
            <a
              href="https://github.com/XSaitoKungX/Discord-CustomRPC/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
            >
              View all releases
              <FiExternalLink className="w-4 h-4" />
            </a>
          </div>

          <GlassCard className="p-6">
            <div className="text-center py-8">
              <FiGithub className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60 mb-4">
                View the complete changelog and all releases on GitHub
              </p>
              <a
                href="https://github.com/XSaitoKungX/Discord-CustomRPC/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#5865F2]/10 hover:bg-[#5865F2]/20 border border-[#5865F2]/20 text-[#5865F2] rounded-xl font-medium transition-all duration-200"
              >
                <FiExternalLink className="w-4 h-4" />
                View Releases on GitHub
              </a>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to customize your Discord?
          </h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            Join thousands of users who have already enhanced their Discord experience
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://github.com/XSaitoKungX/Discord-CustomRPC/releases/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-[#5865F2]/25"
            >
              <FiDownload className="w-5 h-5" />
              Download Now
            </a>
            <a
              href="https://github.com/XSaitoKungX/Discord-CustomRPC"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-medium transition-all duration-200"
            >
              <FiGithub className="w-5 h-5" />
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white/40 text-sm">
            <span>Made with</span>
            <span className="text-red-500">♥</span>
            <span>by</span>
            <Link href="/" className="text-[#5865F2] hover:underline">
              xSaitoX
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
              MIT License
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
