"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "@/lib/auth-client";
import { FiSend, FiMessageSquare, FiCheckCircle, FiUser, FiHash } from "react-icons/fi";
import { SiDiscord } from "react-icons/si";
import { authClient } from "@/lib/auth-client";
import GlassCard from "@/components/ui/GlassCard";

interface GuestbookEntry {
  id: string;
  message: string;
  name: string;
  email?: string;
  image?: string;
  isVerified: boolean;
  createdAt: string;
}

interface GuestbookData {
  entries: GuestbookEntry[];
}

function formatTimeAgo(date: string, t: (key: string, values?: Record<string, string | number>) => string): string {
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

export default function GuestbookPage() {
  const locale = useLocale();
  const t = useTranslations();
  const { data: session } = useSession();
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    try {
      const res = await fetch("/api/guestbook");
      const data: GuestbookData = await res.json();
      setEntries(data.entries);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }

  const [pending, setPending] = useState(false);

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
        if (!data.pending) fetchEntries();
        setTimeout(() => setSuccess(false), 5000);
      }
    } finally {
      setSubmitting(false);
    }
  }

  const charactersLeft = 500 - message.length;

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
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Discord Sign-in Button */}
              {!session && (
                <div className="flex items-center gap-4 pb-4 border-b border-white/10">
                  <button
                    type="button"
                    onClick={() => authClient.signIn.social({ provider: "discord", callbackURL: `/${locale}/guestbook` })}
                    className="flex items-center gap-2 px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg transition-colors"
                  >
                    <SiDiscord className="w-5 h-5" />
                    {t("guestbook.sign_with_discord")}
                  </button>
                  <span className="text-white/40 text-sm">{t("guestbook.sign_anonymous")}</span>
                </div>
              )}

              {/* Name Input (only for anonymous) */}
              {!session && (
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("guestbook.name_placeholder")}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#7C3AED] transition-colors"
                    maxLength={50}
                  />
                </div>
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

              {/* Submit Button */}
              <div className="flex items-center gap-4">
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

                {/* Success Message */}
                <AnimatePresence>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={`flex items-center gap-2 ${pending ? "text-yellow-400" : "text-green-400"}`}
                    >
                      <FiCheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        {pending
                          ? "Submitted! Awaiting admin approval."
                          : t("guestbook.success_title")}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </GlassCard>
        </motion.div>

        {/* Entries */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-white/60 flex items-center gap-2">
            <FiHash className="w-4 h-4" />
            {entries.length} {entries.length === 1 ? "Entry" : "Entries"}
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
            </div>
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
                  transition={{ delay: index * 0.05 }}
                >
                  <GlassCard className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {entry.image ? (
                          <img
                            src={entry.image}
                            alt={entry.name}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                            <FiUser className="w-5 h-5 text-white/40" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-white">{entry.name}</span>
                          {entry.isVerified && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-[#7C3AED]/20 text-[#7C3AED] border border-[#7C3AED]/30">
                              <FiCheckCircle className="w-3 h-3" />
                              {t("guestbook.verified_badge")}
                            </span>
                          )}
                          {!entry.isVerified && (
                            <span className="text-xs text-white/40">
                              {t("guestbook.anonymous")}
                            </span>
                          )}
                        </div>
                        <p className="text-white/80 whitespace-pre-wrap">{entry.message}</p>
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
