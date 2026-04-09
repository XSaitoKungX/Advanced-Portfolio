"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { FiArrowLeft, FiCalendar, FiMessageSquare, FiUser, FiHash, FiExternalLink } from "react-icons/fi";
import { SiDiscord } from "react-icons/si";
import Link from "next/link";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Image from "next/image";

interface UserProfile {
  id: string;
  userId: string;
  discordId?: string | null;
  username?: string | null;
  displayName?: string | null;
  globalName?: string | null;
  avatar?: string | null;
  banner?: string | null;
  bannerColor?: string | null;
  bio?: string | null;
  accentColor?: number | null;
  premiumType?: number | null;
  publicFlags?: number | null;
  createdAt: string;
}

// Discord Snowflake IDs contain timestamp - extract account creation date
function getDiscordCreationDate(discordId: string): Date {
  const discordEpoch = BigInt(1420070400000);
  const timestamp = (BigInt(discordId) >> BigInt(22)) + discordEpoch;
  return new Date(Number(timestamp));
}

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function GlobalProfilePage() {
  const params = useParams();
  const locale = useLocale();
  const userId = params.userId as string;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch(`/api/profile/${userId}`);
      if (res.status === 404) { setNotFound(true); return; }
      const data = await res.json();
      setProfile(data.profile);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-white/50">
        <p className="text-xl">Profile not found</p>
        <Link href={`/${locale}`} className="flex items-center gap-2 text-[#7C3AED] hover:underline">
          <FiArrowLeft className="w-4 h-4" /> Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </motion.div>

        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div
            className="relative h-32 sm:h-40 rounded-2xl overflow-hidden"
            style={{ backgroundColor: profile.bannerColor ?? "#7C3AED" }}
          >
            {profile.banner && (
              <Image
                src={profile.banner}
                alt="Profile Banner"
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                unoptimized={profile.banner.endsWith(".gif")}
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          </div>

          <div className="relative px-4 sm:px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12 sm:-mt-16">
              {profile.avatar ? (
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0">
                  <Image
                    src={profile.avatar}
                    alt={profile.displayName ?? "Avatar"}
                    fill
                    sizes="(max-width: 640px) 96px, 128px"
                    loading="eager"
                    unoptimized={profile.avatar.endsWith(".gif")}
                    className="rounded-2xl border-4 border-[#0d0a14] object-cover shadow-xl"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-[#0d0a14] bg-[#7C3AED] flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                  {(profile.displayName ?? profile.username ?? "?")[0].toUpperCase()}
                </div>
              )}
              <div className="flex-1 pt-2 sm:pb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {profile.displayName ?? profile.username ?? "Unknown"}
                </h1>
                {profile.username && (
                  <p className="text-white/50 font-mono text-sm">@{profile.username}</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <GlassCard className="p-4 space-y-3">
                <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">
                  Information
                </h3>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-[#5865F2]/10 flex items-center justify-center shrink-0">
                    <SiDiscord className="w-4 h-4 text-[#5865F2]" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs">Discord</p>
                    <p className="text-white font-medium">{profile.username ?? "-"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center shrink-0">
                    <FiCalendar className="w-4 h-4 text-[#7C3AED]" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs">Member Since</p>
                    <p className="text-white font-medium">
                      {profile.discordId ? formatDate(getDiscordCreationDate(profile.discordId)) : formatDate(profile.createdAt)}
                    </p>
                  </div>
                </div>
                {profile.discordId && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                      <FiHash className="w-4 h-4 text-white/40" />
                    </div>
                    <div>
                      <p className="text-white/40 text-xs">Discord ID</p>
                      <p className="text-white/60 font-mono text-xs">{profile.discordId}</p>
                    </div>
                  </div>
                )}
              </GlassCard>
            </motion.div>

            {/* Guestbook CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link href={`/${locale}/guestbook`}>
                <GlassCard className="p-4 hover:bg-white/8 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FBBF24]/10 flex items-center justify-center group-hover:bg-[#FBBF24]/20 transition-colors">
                      <FiMessageSquare className="w-5 h-5 text-[#FBBF24]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">Guestbook</p>
                      <p className="text-xs text-white/40">Leave a message</p>
                    </div>
                    <FiExternalLink className="w-4 h-4 text-white/20 group-hover:text-white/40" />
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          </div>

          {/* Right Column - Bio & Details */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <GlassCard className="p-6 h-full">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center">
                    <FiUser className="w-4 h-4 text-[#7C3AED]" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">About</h2>
                </div>
                {profile.bio ? (
                  <p className="text-white/70 leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
                ) : (
                  <p className="text-white/40 italic">
                    This user hasn&apos;t added a bio yet.
                  </p>
                )}
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
