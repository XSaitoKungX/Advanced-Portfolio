"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { FiMail, FiMapPin, FiCheckCircle, FiAlertCircle, FiSend, FiClock } from "react-icons/fi";
import { SiDiscord, SiGithub, SiX } from "react-icons/si";
import SectionHeader from "@/components/ui/SectionHeader";
import GlassCard from "@/components/ui/GlassCard";
import { createContactSchema, type ContactFormData } from "@/lib/validations/contact";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ContactPage() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const schema = useMemo(() => createContactSchema(locale as "de" | "en"), [locale]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  const socialLinks = [
    { href: "https://github.com/XSaitoKungX", icon: SiGithub, label: "GitHub" },
    { href: "https://discord.com/channels/@me/848917797501141052", icon: SiDiscord, label: "Discord" },
    { href: "https://x.com/xsait0kungx", icon: SiX, label: "X / Twitter" },
  ];

  const inputClass =
    "w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#7C3AED]/60 focus:bg-white/[0.06] transition-all duration-200";

  const errorClass = "mt-1.5 text-xs text-red-400";

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t("title")} subtitle={t("subtitle")} />

        <p className="text-center text-white/50 max-w-lg mx-auto -mt-8 mb-14 leading-relaxed">
          {t("description")}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-5"
          >
            <GlassCard className="p-6">
              <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-5">
                {locale === "de" ? "Kontaktinfo" : "Contact Info"}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#7C3AED]/10 border border-[#7C3AED]/20">
                    <FiMail className="w-4 h-4 text-[#A78BFA]" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40">{t("info.email")}</p>
                    <p className="text-sm font-medium text-white/80">mark@xsaitox.dev</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#34D399]/10 border border-[#34D399]/20">
                    <FiMapPin className="w-4 h-4 text-[#34D399]" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40">{t("info.location")}</p>
                    <p className="text-sm font-medium text-white/80">Deutschland 🇩🇪</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#FBBF24]/10 border border-[#FBBF24]/20">
                    <FiClock className="w-4 h-4 text-[#FBBF24]" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40">{t("info.availability")}</p>
                    <p className="text-sm font-medium text-[#34D399]">{t("info.available")}</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-5">
                {t("social")}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map(({ href, icon: Icon, label }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-white/8 text-white/50 hover:text-white hover:bg-white/6 hover:border-white/15 transition-all duration-200"
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-medium">{label}</span>
                  </a>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <GlassCard className="p-8">
              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-[#34D399]/10 border border-[#34D399]/20 flex items-center justify-center mb-4">
                    <FiCheckCircle className="w-8 h-8 text-[#34D399]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{t("form.success_title")}</h3>
                  <p className="text-white/50 text-sm max-w-sm">{t("form.success_message")}</p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-6 px-6 py-2.5 text-sm font-medium text-white/70 border border-white/10 rounded-xl hover:bg-white/5 transition-all duration-200"
                  >
                    {locale === "de" ? "Neue Nachricht" : "New Message"}
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <input type="text" {...register("honeypot")} className="hidden" tabIndex={-1} aria-hidden="true" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                        {t("form.name")}
                      </label>
                      <input
                        {...register("name")}
                        type="text"
                        placeholder={t("form.name_placeholder")}
                        className={inputClass}
                        autoComplete="name"
                      />
                      {errors.name && <p className={errorClass}>{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                        {t("form.email")}
                      </label>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder={t("form.email_placeholder")}
                        className={inputClass}
                        autoComplete="email"
                      />
                      {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                      {t("form.subject")}
                    </label>
                    <input
                      {...register("subject")}
                      type="text"
                      placeholder={t("form.subject_placeholder")}
                      className={inputClass}
                    />
                    {errors.subject && <p className={errorClass}>{errors.subject.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                      {t("form.message")}
                    </label>
                    <textarea
                      {...register("message")}
                      rows={6}
                      placeholder={t("form.message_placeholder")}
                      className={`${inputClass} resize-none`}
                    />
                    {errors.message && <p className={errorClass}>{errors.message.message}</p>}
                  </div>

                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                    >
                      <FiAlertCircle className="w-4 h-4 shrink-0" />
                      {t("form.error_message")}
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={status === "submitting"}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-linear-to-r from-[#7C3AED] to-[#4F46E5] rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-[#7C3AED]/25"
                  >
                    {status === "submitting" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t("form.submitting")}
                      </>
                    ) : (
                      <>
                        <FiSend className="w-4 h-4" />
                        {t("form.submit")}
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
