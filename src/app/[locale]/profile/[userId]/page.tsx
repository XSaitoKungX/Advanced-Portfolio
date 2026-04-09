"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useSession } from "@/lib/auth-client";
import ProfileCard from "@/components/profile/ProfileCard";
import { FiArrowLeft, FiLink, FiEye, FiEdit2, FiCheck, FiCalendar, FiMessageSquare } from "react-icons/fi";
import { SiDiscord } from "react-icons/si";
import Link from "next/link";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";

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

export default function OwnProfilePage() {
  const params = useParams();
  const locale = useLocale();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const userId = params.userId as string;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState("");
  const [savingBio, setSavingBio] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch(`/api/profile/${userId}`);
      if (res.status === 404) { setNotFound(true); return; }
      const data = await res.json();
      if (!data.isOwn) {
        router.replace(`/${locale}/global/profile/${data.profile.discordId ?? userId}`);
        return;
      }
      setProfile(data.profile);
      setBio(data.profile.bio ?? "");
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [userId, locale, router]);

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.push(`/${locale}/login`);
      return;
    }
    fetchProfile();
  }, [isPending, session, router, locale, fetchProfile]);

  async function saveBio() {
    if (!profile) return;
    setSavingBio(true);
    try {
      const res = await fetch(`/api/profile/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio }),
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        setEditingBio(false);
      }
    } finally {
      setSavingBio(false);
    }
  }

  const publicProfileUrl = profile?.discordId
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/${locale}/global/profile/${profile.discordId}`
    : "";

  if (isPending || loading) {
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProfileCard profile={profile} isOwn={true} />
            </motion.div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Welcome Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <GlassCard className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-1">
                      Welcome back, {profile.displayName ?? profile.username ?? "User"}!
                    </h1>
                    <p className="text-white/50 text-sm">
                      Manage your public profile and settings
                    </p>
                  </div>
                  <Link
                    href={`/${locale}/global/profile/${profile.discordId ?? userId}`}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <FiEye className="w-4 h-4" />
                    View Public
                  </Link>
                </div>
              </GlassCard>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              <GlassCard className="p-4 text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-[#5865F2]/10 flex items-center justify-center">
                  <SiDiscord className="w-5 h-5 text-[#5865F2]" />
                </div>
                <p className="text-xs text-white/40 uppercase tracking-wider">Discord</p>
                <p className="text-sm font-semibold text-white">{profile.username ?? "-"}</p>
              </GlassCard>
              <GlassCard className="p-4 text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center">
                  <FiCalendar className="w-5 h-5 text-[#7C3AED]" />
                </div>
                <p className="text-xs text-white/40 uppercase tracking-wider">Joined</p>
                <p className="text-sm font-semibold text-white">
                  {profile.discordId ? formatDate(getDiscordCreationDate(profile.discordId)) : formatDate(profile.createdAt)}
                </p>
              </GlassCard>
              <GlassCard className="p-4 text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <FiCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-xs text-white/40 uppercase tracking-wider">Status</p>
                <p className="text-sm font-semibold text-emerald-400">Active</p>
              </GlassCard>
              <GlassCard className="p-4 text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-[#FBBF24]/10 flex items-center justify-center">
                  <FiMessageSquare className="w-5 h-5 text-[#FBBF24]" />
                </div>
                <p className="text-xs text-white/40 uppercase tracking-wider">Guestbook</p>
                <p className="text-sm font-semibold text-white">Verified</p>
              </GlassCard>
            </motion.div>

            {/* Bio Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">About You</h3>
                  {!editingBio ? (
                    <button
                      onClick={() => setEditingBio(true)}
                      className="flex items-center gap-2 text-sm text-[#7C3AED] hover:text-[#A78BFA] transition-colors"
                    >
                      <FiEdit2 className="w-4 h-4" /> Edit
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setEditingBio(false); setBio(profile.bio ?? ""); }}
                        className="text-sm text-white/50 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveBio}
                        disabled={savingBio}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg transition-colors disabled:opacity-50"
                      >
                        {savingBio ? "Saving..." : <><FiCheck className="w-4 h-4" /> Save</>}
                      </button>
                    </div>
                  )}
                </div>
                {editingBio ? (
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell others about yourself..."
                    maxLength={500}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#7C3AED] resize-none"
                  />
                ) : (
                  <p className="text-white/70 leading-relaxed">
                    {profile.bio || (
                      <span className="text-white/40 italic">
                        No bio yet. Click Edit to tell others about yourself.
                      </span>
                    )}
                  </p>
                )}
              </GlassCard>
            </motion.div>

            {/* Public Profile Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center">
                    <FiLink className="w-5 h-5 text-[#7C3AED]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Public Profile URL</h3>
                    <p className="text-xs text-white/40">Share this link with others</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-4 py-3 bg-black/30 rounded-lg text-sm text-[#A78BFA] font-mono break-all">
                    /global/profile/{profile.discordId ?? userId}
                  </code>
                  <button
                    onClick={() => navigator.clipboard.writeText(publicProfileUrl)}
                    className="px-4 py-3 text-sm text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Copy Link
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
