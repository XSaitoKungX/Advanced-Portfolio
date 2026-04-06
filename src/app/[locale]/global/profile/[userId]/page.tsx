"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import ProfileCard from "@/components/profile/ProfileCard";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

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

export default function GlobalProfilePage() {
  const params = useParams();
  const locale = useLocale();
  const userId = params.userId as string;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  async function fetchProfile() {
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
  }

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
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" /> Back
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ProfileCard profile={profile} isOwn={false} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-1">
                {profile.displayName ?? profile.username ?? "Unknown"}
              </h3>
              <p className="text-white/40 text-sm">Public Profile</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
