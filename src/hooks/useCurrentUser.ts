"use client";

import { useState, useEffect } from "react";

export interface UserProfile {
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
  updatedAt: string;
  identityGuildId?: string | null;
  identityEnabled?: boolean | null;
  tag?: string | null;
  badge?: string | null;
  locale?: string | null;
}

export function useCurrentUser() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/me", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setProfile(data.profile ?? null);
        }
      } catch {
        // silently fail, keep existing state
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => { cancelled = true; };
  }, []);

  return { profile, loading };
}
