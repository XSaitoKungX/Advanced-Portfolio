export interface DiscordAPIUser {
  id: string;
  username: string;
  global_name: string | null;
  avatar: string | null;
  banner: string | null;
  banner_color: string | null;
  bio: string | null;
  accent_color: number | null;
  premium_type: number | null;
  public_flags: number | null;
  locale: string | null;
  primary_guild?: {
    identity_guild_id: string | null;
    identity_enabled: boolean | null;
    tag: string | null;
    badge: string | null;
  } | null;
}

export async function fetchDiscordUser(accessToken: string): Promise<DiscordAPIUser | null> {
  try {
    const res = await fetch("https://discord.com/api/v10/users/@me", {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export function avatarUrl(id: string, hash: string | null) {
  if (!hash) return null;
  const ext = hash.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/avatars/${id}/${hash}.${ext}?size=256`;
}

export function bannerUrl(id: string, hash: string | null) {
  if (!hash) return null;
  const ext = hash.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/banners/${id}/${hash}.${ext}?size=600`;
}
