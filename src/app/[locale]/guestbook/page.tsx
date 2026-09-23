"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "@/lib/auth-client";
import { FiSend, FiMessageSquare, FiCheckCircle, FiUser, FiHash, FiAlertCircle, FiTrash2, FiRefreshCw } from "react-icons/fi";
import { SiDiscord } from "react-icons/si";
import { authClient } from "@/lib/auth-client";
import GlassCard from "@/components/ui/GlassCard";
import Image from "next/image";

interface GuestbookEntry {
  id: string;
  message: string;
  name: string;
  image?: string;
  isVerified: boolean;
  status: "PENDING" | "APPROVED" | "REJECTED";
  userId?: string;
  createdAt: string;
}

function formatTimeAgo(date: string, t: ReturnType<typeof useTranslations>): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) return t("guestbook.time_just_now");
  if (diffMinutes < 60) return t("guestbook.time_minutes_ago", { n: diffMinutes });
  if (diffHours < 24) return t("guestbook.time_hours_ago", { n: diffHours });
  return t("guestbook.time_days_ago", { n: diffDays });
}

function EntryAvatar({ image, name, isPending }: { image?: string; name: string; isPending: boolean }) {
  const [imgError, setImgError] = useState(false);

  if (image && !imgError) {
    return (
      <Image
        src={image}
        alt={name}
        width={40}
        height={40}
        className={`rounded-full object-cover ${isPending ? "opacity-60" : ""}`}
        onError={() => setImgError(true)}
        unoptimized
      />
    );
  }

  return (
    <div className={`w-10 h-10 rounded-full bg-white/10 flex items-center justify-center ${isPending ? "opacity-60" : ""}`}>
      <FiUser className="w-5 h-5 text-white/40" />
    </div>
  );
}

function SkeletonEntry() {
  return (
    <GlassCard className="p-5">
      <div className="flex items-start gap-4 animate-pulse">
        <div className="w-10 h-10 rounded-full bg-white/10 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-white/10 rounded w-32" />
          <div className="h-4 bg-white/10 rounded w-full" />
          <div className="h-4 bg-white/10 rounded w-3/4" />
          <div className="h-3 bg-white/5 rounded w-20" />
        </div>
      </div>
    </GlassCard>
  );
}

export default function GuestbookPage() {
  const locale = useLocale();
  const t = useTranslations();
  const { data: session } = useSession();
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    setFetchError(false);
    try {
      const res = await fetch("/api/guestbook");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setEntries(Array.isArray(data?.entries) ? data.entries : []);
    } catch {
      setFetchError(true);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          name: name.trim() || session?.user?.name || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessage("");
        setName("");
        setSuccess(true);
        setPending(data.pending === true);
        await fetchEntries();
        setTimeout(() => setSuccess(false), 5000);
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t("guestbook.delete_confirm"))) return;
    setDeletingId(id);
    try {
      const res = await fetch("/api/guestbook", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setEntries((prev) => prev.filter((e) => e.id !== id));
      }
    } finally {
      setDeletingId(null);
    }
  }

  const charactersLeft = 500 - message.length;
  const entryCount = entries.length;

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 mb-6">
            <FiMessageSquare className="w-8 h-8 text-[#7C3AED]" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{t("guestbook.title")}</h1>
          <p className="text-xl text-white/60 mb-2">{t("guestbook.subtitle")}</p>
          <p className="text-white/40 max-w-lg mx-auto">{t("guestbook.description")}</p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <GlassCard className="p-6">
            {session && (
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-white/10">
                {session.user?.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? ""}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                    unoptimized
                  />
                )}
                <div>
                  <p className="text-sm font-medium text-white">{session.user?.name}</p>
                  <div className="flex items-center gap-1 text-xs text-[#7C3AED]">
                    <FiCheckCircle className="w-3 h-3" />
                    {t("guestbook.verified_badge")}
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Discord Sign-in Button */}
              {!session && (
                <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-white/10">
                  <button
                    type="button"
                    onClick={() => authClient.signIn.social({ provider: "discord", callbackURL: `/${locale}/guestbook` })}
                    className="flex items-center gap-2 px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white text-sm rounded-lg transition-colors"
                  >
                    <SiDiscord className="w-4 h-4" />
                    {t("guestbook.sign_with_discord")}
                  </button>
                  <span className="text-white/40 text-sm">{t("guestbook.sign_anonymous")}</span>
                </div>
              )}

              {/* Name Input (only for anonymous) */}
              {!session && (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("guestbook.name_placeholder")}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#7C3AED] transition-colors"
                  maxLength={50}
                />
              )}

              {/* Message Input */}
              <div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t("guestbook.message_placeholder")}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#7C3AED] transition-colors resize-none"
                  rows={4}
                  maxLength={500}
                  required
                />
                <div className="flex justify-end mt-1">
                  <span className={`text-xs ${charactersLeft < 50 ? "text-red-400" : "text-white/40"}`}>
                    {t("guestbook.characters_left", { n: charactersLeft })}
                  </span>
                </div>
              </div>

              {/* Submit Button + Success */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={submitting || !message.trim()}
                  className="flex items-center gap-2 px-6 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t("guestbook.submitting")}
                    </>
                  ) : (
                    <>
                      <FiSend className="w-4 h-4" />
                      {t("guestbook.submit")}
                    </>
                  )}
                </button>

                <AnimatePresence>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className={`flex items-center gap-2 ${pending ? "text-yellow-400" : "text-green-400"}`}
                    >
                      <FiCheckCircle className="w-4 h-4 shrink-0" />
                      <span className="text-sm font-medium">
                        {pending ? t("guestbook.pending_success") : t("guestbook.success_title")}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </GlassCard>
        </motion.div>

        {/* Entries header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-white/60 flex items-center gap-2">
              <FiHash className="w-4 h-4" />
              {loading
                ? "..."
                : entryCount === 1
                  ? t("guestbook.entry_count_one")
                  : t("guestbook.entry_count_other", { n: entryCount })}
            </h2>
            {fetchError && (
              <button
                onClick={() => { setLoading(true); fetchEntries(); }}
                className="flex items-center gap-1 text-sm text-white/40 hover:text-white/70 transition-colors"
              >
                <FiRefreshCw className="w-3.5 h-3.5" />
                {t("guestbook.retry")}
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid gap-4">
              {[...Array(3)].map((_, i) => <SkeletonEntry key={i} />)}
            </div>
          ) : fetchError ? (
            <GlassCard className="p-10 text-center">
              <FiAlertCircle className="w-10 h-10 text-red-400/60 mx-auto mb-3" />
              <p className="text-white/50 text-sm">{t("guestbook.error_loading")}</p>
            </GlassCard>
          ) : entries.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <FiMessageSquare className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/40">{t("guestbook.no_entries")}</p>
              <p className="text-white/60 font-medium mt-2">{t("guestbook.first_entry")}</p>
            </GlassCard>
          ) : (
            <div className="grid gap-4">
              {entries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <GlassCard className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="shrink-0">
                        <EntryAvatar
                          image={entry.image}
                          name={entry.name}
                          isPending={entry.status === "PENDING"}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium text-white">{entry.name}</span>
                            {entry.isVerified && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-[#7C3AED]/20 text-[#7C3AED] border border-[#7C3AED]/30">
                                <FiCheckCircle className="w-3 h-3" />
                                {t("guestbook.verified_badge")}
                              </span>
                            )}
                            {entry.status === "PENDING" && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                {t("guestbook.pending_badge")}
                              </span>
                            )}
                            {!entry.isVerified && entry.status === "APPROVED" && (
                              <span className="text-xs text-white/40">
                                {t("guestbook.anonymous")}
                              </span>
                            )}
                          </div>

                          {/* Delete own entry */}
                          {session?.user?.id && entry.userId === session.user.id && (
                            <button
                              onClick={() => handleDelete(entry.id)}
                              disabled={deletingId === entry.id}
                              title={t("guestbook.delete_own")}
                              className="shrink-0 p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-40"
                            >
                              {deletingId === entry.id ? (
                                <div className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />
                              ) : (
                                <FiTrash2 className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                        </div>
                        <p className="text-white/80 whitespace-pre-wrap warp-break-word">{entry.message}</p>
                        <p className="text-xs text-white/40 mt-2">
                          {formatTimeAgo(entry.createdAt, t)}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
