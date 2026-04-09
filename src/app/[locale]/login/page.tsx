"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { SiDiscord } from "react-icons/si";
import { FiUser, FiBookOpen, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import { signIn, useSession } from "@/lib/auth-client";
import Link from "next/link";

export default function LoginPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  if (session) {
    router.replace(`/${locale}/profile/${session.user.id}`);
    return null;
  }

  const handleDiscordLogin = async () => {
    setLoading(true);
    try {
      await signIn.social({
        provider: "discord",
        callbackURL: `/${locale}/auth/callback`,
      });
    } catch {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: FiUser, text: t("profile_access") },
    { icon: FiBookOpen, text: t("guestbook_verified") },
    { icon: FiCheckCircle, text: locale === "de" ? "Sicherer Discord OAuth" : "Secure Discord OAuth" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#5865F2]/10 border border-[#5865F2]/20 mb-4"
          >
            <SiDiscord className="w-8 h-8 text-[#5865F2]" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white">{t("public_login_title")}</h1>
          <p className="text-sm text-white/40 mt-2 max-w-xs mx-auto">{t("public_login_desc")}</p>
        </div>

        <div className="relative bg-white/3 border border-white/8 rounded-2xl p-8">
          <div className="absolute -inset-px bg-linear-to-b from-white/5 to-transparent rounded-2xl pointer-events-none" />

          <ul className="space-y-3 mb-7">
            {benefits.map(({ icon: Icon, text }, i) => (
              <motion.li
                key={text}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="flex items-center gap-3 text-sm text-white/50"
              >
                <Icon className="w-4 h-4 text-[#5865F2] shrink-0" />
                {text}
              </motion.li>
            ))}
          </ul>

          <motion.button
            onClick={handleDiscordLogin}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative w-full flex items-center justify-center gap-3 px-6 py-4 text-sm font-semibold text-white bg-[#5865F2] hover:bg-[#4752C4] disabled:opacity-60 disabled:cursor-not-allowed rounded-xl transition-all duration-200 shadow-lg shadow-[#5865F2]/25"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t("logging_in")}
              </>
            ) : (
              <>
                <SiDiscord className="w-5 h-5" />
                {t("login_with_discord")}
              </>
            )}
          </motion.button>

          <div className="pt-4 border-t border-white/10 space-y-3">
            <Link
              href={`/${locale}`}
              className="flex items-center justify-center gap-2 text-sm text-white/40 hover:text-white/60 transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              {t("back_to_home")}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
