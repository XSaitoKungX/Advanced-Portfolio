"use client";

import { motion } from "framer-motion";
import { FiCalendar, FiEdit2, FiCheck } from "react-icons/fi";
import { SiDiscord } from "react-icons/si";
import { useState } from "react";

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
  // Discord Primary Guild / Server Tag
  identityGuildId?: string | null;
  identityEnabled?: boolean | null;
  tag?: string | null;
  badge?: string | null;
}

interface ProfileCardProps {
  profile: UserProfile;
  isOwn: boolean;
}

function getPremiumLabel(type: number | null | undefined): string | null {
  if (!type) return null;
  const labels: Record<number, string> = { 1: "Nitro Classic", 2: "Nitro", 3: "Nitro Basic" };
  return labels[type] ?? null;
}

function getDiscordFlags(flags: number | null | undefined): string[] {
  if (!flags) return [];
  const badges: Record<number, string> = {
    1: "Discord Staff",
    2: "Discord Partner",
    4: "HypeSquad Events",
    8: "Bug Hunter Lv1",
    64: "HypeSquad Bravery",
    128: "HypeSquad Brilliance",
    256: "HypeSquad Balance",
    512: "Early Supporter",
    16384: "Bug Hunter Lv2",
    131072: "Verified Bot Developer",
    4194304: "Active Developer",
  };
  return Object.entries(badges)
    .filter(([bit]) => (flags & Number(bit)) !== 0)
    .map(([, label]) => label);
}

export default function ProfileCard({ profile, isOwn }: ProfileCardProps) {
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState(profile.bio ?? "");
  const [savingBio, setSavingBio] = useState(false);

  const bannerStyle = profile.banner
    ? { backgroundImage: `url(${profile.banner})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { backgroundColor: profile.bannerColor ?? "#7C3AED" };

  const premiumLabel = getPremiumLabel(profile.premiumType);
  const badges = getDiscordFlags(profile.publicFlags);

  async function saveBio() {
    setSavingBio(true);
    try {
      await fetch(`/api/profile/${profile.userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio }),
      });
      setEditingBio(false);
    } finally {
      setSavingBio(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto rounded-2xl overflow-hidden bg-[#1a1023] border border-white/10 shadow-2xl"
    >
      {/* Banner */}
      <div className="h-28 w-full relative" style={bannerStyle} />

      {/* Avatar */}
      <div className="px-5 pb-4">
        <div className="flex items-end justify-between -mt-10 mb-4">
          <div className="relative">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.displayName ?? "Avatar"}
                className="w-20 h-20 rounded-full border-4 border-[#1a1023] object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full border-4 border-[#1a1023] bg-[#7C3AED] flex items-center justify-center text-2xl font-bold text-white">
                {(profile.displayName ?? "?")[0].toUpperCase()}
              </div>
            )}
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#1a1023]" />
          </div>

          {isOwn && (
            <button
              onClick={() => setEditingBio(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-white/20 rounded-lg text-sm text-white/70 hover:text-white hover:border-white/40 transition-all"
            >
              <FiEdit2 className="w-3 h-3" />
              Edit
            </button>
          )}
        </div>

        {/* Name + Username */}
        <div className="mb-3">
          <h2 className="text-xl font-bold text-white leading-tight">
            {profile.displayName ?? profile.username ?? "Unknown"}
          </h2>
          {profile.username && (
            <p className="text-white/50 text-sm">@{profile.username}</p>
          )}
        </div>

        {/* Badges + Server Tag */}
        {(badges.length > 0 || premiumLabel || profile.tag) && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {premiumLabel && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-[#7C3AED]/20 text-[#A78BFA] border border-[#7C3AED]/30">
                <SiDiscord className="w-3 h-3" />
                {premiumLabel}
              </span>
            )}
            {badges.map((badge) => (
              <span key={badge} className="px-2 py-0.5 rounded-full text-xs bg-white/5 text-white/60 border border-white/10">
                {badge}
              </span>
            ))}
            {profile.tag && profile.identityEnabled && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs bg-[#1a1023] text-white border border-white/20">
                {profile.badge && profile.identityGuildId && (
                  <img
                    src={`https://cdn.discordapp.com/guild-tag-badges/${profile.identityGuildId}/${profile.badge}.png`}
                    alt=""
                    className="w-4 h-4 object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
                <span className="font-semibold text-[#A78BFA]">{profile.tag}</span>
              </span>
            )}
          </div>
        )}

        {/* Bio */}
        <div className="mb-4">
          {editingBio ? (
            <div className="space-y-2">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={500}
                rows={3}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#7C3AED] resize-none"
                placeholder="Write something about yourself..."
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={saveBio}
                  disabled={savingBio}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#7C3AED] text-white text-xs rounded-lg hover:bg-[#6D28D9] transition-colors"
                >
                  <FiCheck className="w-3 h-3" />
                  {savingBio ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => { setEditingBio(false); setBio(profile.bio ?? ""); }}
                  className="px-3 py-1.5 border border-white/10 text-white/60 text-xs rounded-lg hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-white/60 text-sm leading-relaxed">
              {bio || (isOwn ? <span className="text-white/30 italic">No bio yet — click Edit to add one</span> : <span className="text-white/30 italic">No bio</span>)}
            </p>
          )}
        </div>

        {/* Discord info */}
        {profile.discordId && (
          <div className="pt-3 border-t border-white/10 space-y-2 text-sm">
            <div className="flex items-center gap-2 text-white/50">
              <SiDiscord className="w-4 h-4 text-[#5865F2]" />
              <span>Discord ID: <span className="text-white/70 font-mono">{profile.discordId}</span></span>
            </div>
            <div className="flex items-center gap-2 text-white/50">
              <FiCalendar className="w-4 h-4" />
              <span>Member since <span className="text-white/70">{new Date(profile.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span></span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
