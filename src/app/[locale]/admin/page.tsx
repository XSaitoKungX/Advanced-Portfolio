"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowLeft, FiShield, FiUser, FiMail, FiCode, FiCheck, FiX, FiTrash2, FiMessageSquare } from "react-icons/fi";
import { RiTerminalBoxFill } from "react-icons/ri";
import { useSession } from "@/lib/auth-client";
import { isOwner } from "@/lib/is-owner";
import GlassCard from "@/components/ui/GlassCard";
import { projects } from "@/lib/data/projects";
import { skills } from "@/lib/data/skills";
import { experiences } from "@/lib/data/experience";
import { FiLayers, FiCpu, FiBriefcase } from "react-icons/fi";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const locale = useLocale();
  const t = useTranslations("auth");
  const { data: session, isPending } = useSession();
  const ownerAccess = isOwner(session?.user ?? null);

  const [pendingEntries, setPendingEntries] = useState<Array<{
    id: string; name: string; message: string; createdAt: string; email?: string;
  }>>([]);
  const [loadingEntries, setLoadingEntries] = useState(false);

  useEffect(() => {
    if (ownerAccess) fetchPending();
  }, [ownerAccess]);

  async function fetchPending() {
    setLoadingEntries(true);
    try {
      const res = await fetch("/api/admin/guestbook");
      if (res.ok) {
        const data = await res.json();
        setPendingEntries(data.pending ?? []);
      }
    } finally {
      setLoadingEntries(false);
    }
  }

  async function moderateEntry(id: string, action: "approve" | "reject" | "delete") {
    await fetch("/api/admin/guestbook", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    setPendingEntries((prev) => prev.filter((e) => e.id !== id));
  }

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-t-[#7C3AED] border-white/10 animate-spin" />
      </div>
    );
  }

  if (!session || !ownerAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
        >
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <FiShield className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{t("unauthorized")}</h1>
          <p className="text-white/40 text-sm mb-6">{t("unauthorized_desc")}</p>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white/70 border border-white/10 rounded-xl hover:bg-white/5 transition-all duration-200"
          >
            <FiArrowLeft className="w-4 h-4" />
            {locale === "de" ? "Zurück zur Startseite" : "Back to Home"}
          </Link>
        </motion.div>
      </div>
    );
  }

  const stats = [
    { icon: FiUser, label: locale === "de" ? "Angemeldet als" : "Signed in as", value: session.user.name ?? "Owner", color: "#A78BFA" },
    { icon: FiShield, label: "Role", value: "Owner / Admin", color: "#34D399" },
    { icon: FiMail, label: "E-Mail", value: session.user.email ?? "—", color: "#60A5FA" },
    { icon: FiCode, label: "Discord", value: "Verified", color: "#FBBF24" },
  ];

  const quickLinks = [
    { href: `/${locale}`, label: locale === "de" ? "Startseite" : "Home" },
    { href: `/${locale}/projects`, label: locale === "de" ? "Projekte" : "Projects" },
    { href: `/${locale}/skills`, label: "Skills" },
    { href: `/${locale}/contact`, label: "Contact" },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="p-3 rounded-2xl bg-[#7C3AED]/10 border border-[#7C3AED]/20">
              <RiTerminalBoxFill className="w-7 h-7 text-[#A78BFA]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{t("admin_area")}</h1>
              <p className="text-sm text-white/40 mt-0.5">
                {locale === "de" ? "Willkommen zurück, Owner." : "Welcome back, Owner."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {stats.map(({ icon: Icon, label, value, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <GlassCard className="p-5 flex items-center gap-4">
                  <div
                    className="p-3 rounded-xl flex-shrink-0"
                    style={{ background: `${color}15`, border: `1px solid ${color}25` }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-white/40 mb-0.5">{label}</p>
                    <p className="text-sm font-semibold text-white truncate">{value}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <GlassCard className="p-6 mb-8">
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">
              {locale === "de" ? "Schnellzugriff" : "Quick Access"}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="px-4 py-3 text-sm font-medium text-white/70 border border-white/10 rounded-xl hover:bg-white/5 hover:text-white hover:border-white/20 text-center transition-all duration-200"
                >
                  {label}
                </Link>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6 mb-8">
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">
              {locale === "de" ? "Portfolio Daten" : "Portfolio Data"}
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: FiLayers, label: locale === "de" ? "Projekte" : "Projects", value: projects.length, color: "#A78BFA" },
                { icon: FiCpu, label: "Skills", value: skills.length, color: "#60A5FA" },
                { icon: FiBriefcase, label: locale === "de" ? "Stationen" : "Experiences", value: experiences.length, color: "#34D399" },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <Icon className="w-5 h-5 mx-auto mb-2" style={{ color }} />
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-xs text-white/40 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest flex items-center gap-2">
                <FiMessageSquare className="w-4 h-4" />
                {locale === "de" ? "Gästebuch Moderation" : "Guestbook Moderation"}
              </h2>
              {pendingEntries.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                  {pendingEntries.length} pending
                </span>
              )}
            </div>

            {loadingEntries ? (
              <div className="flex justify-center py-6">
                <div className="w-6 h-6 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : pendingEntries.length === 0 ? (
              <p className="text-white/30 text-sm py-4 text-center">
                {locale === "de" ? "Keine ausstehenden Einträge." : "No pending entries."}
              </p>
            ) : (
              <div className="space-y-3">
                {pendingEntries.map((entry) => (
                  <div key={entry.id} className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <span className="font-medium text-white text-sm">{entry.name}</span>
                        {entry.email && (
                          <span className="text-white/40 text-xs ml-2">{entry.email}</span>
                        )}
                      </div>
                      <span className="text-white/30 text-xs flex-shrink-0">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-white/70 text-sm mb-3 whitespace-pre-wrap">{entry.message}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => moderateEntry(entry.id, "approve")}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 text-xs rounded-lg border border-green-500/30 transition-colors"
                      >
                        <FiCheck className="w-3 h-3" />
                        Approve
                      </button>
                      <button
                        onClick={() => moderateEntry(entry.id, "reject")}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs rounded-lg border border-red-500/30 transition-colors"
                      >
                        <FiX className="w-3 h-3" />
                        Reject
                      </button>
                      <button
                        onClick={() => moderateEntry(entry.id, "delete")}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/40 text-xs rounded-lg border border-white/10 transition-colors"
                      >
                        <FiTrash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          <GlassCard className="p-6 border-[#7C3AED]/20 bg-[#7C3AED]/5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">
                {locale === "de" ? "Systemstatus" : "System Status"}
              </span>
            </div>
            <div className="space-y-2 font-mono text-sm">
              {[
                { key: "Auth", status: "operational" },
                { key: "API", status: "operational" },
                { key: "i18n", status: "operational" },
                { key: "Database", status: "operational" },
                { key: "SMTP", status: "operational" },
              ].map(({ key, status }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-white/50">{key}</span>
                  <span className={status === "operational" ? "text-emerald-400" : "text-yellow-400"}>
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
