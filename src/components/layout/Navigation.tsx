"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";
import { RiTerminalBoxFill } from "react-icons/ri";
import { useSession, signOut } from "@/lib/auth-client";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { isOwner } from "@/lib/is-owner";

export default function Navigation() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();

  const ownerAccess = isOwner(session?.user ?? null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/about`, label: t("about") },
    { href: `/${locale}/skills`, label: t("skills") },
    { href: `/${locale}/projects`, label: t("projects") },
    { href: `/${locale}/experience`, label: t("experience") },
    { href: `/${locale}/contact`, label: t("contact") },
    { href: `/${locale}/guestbook`, label: "Guestbook" },
  ];

  const isActive = (href: string) => {
    if (href === `/${locale}`) return pathname === `/${locale}` || pathname === `/${locale}/`;
    return pathname.startsWith(href);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#030712]/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href={`/${locale}`} className="flex items-center gap-2 group">
            <div className="relative">
              <RiTerminalBoxFill className="w-8 h-8 text-[#7C3AED] group-hover:text-[#A78BFA] transition-colors duration-200" />
              <div className="absolute inset-0 bg-[#7C3AED]/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent group-hover:from-[#A78BFA] group-hover:to-white transition-all duration-200">
              mark.dev
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive(link.href)
                    ? "text-white"
                    : "text-white/60 hover:text-white/90"
                }`}
              >
                {isActive(link.href) && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-white/10 rounded-lg border border-white/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />
            {session ? (
              <div className="flex items-center gap-2">
                {ownerAccess && (
                  <Link
                    href={`/${locale}/admin`}
                    className="px-3 py-1.5 text-xs font-medium text-[#A78BFA] border border-[#7C3AED]/40 rounded-lg hover:bg-[#7C3AED]/20 transition-colors duration-200"
                  >
                    {t("admin")}
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white border border-white/10 rounded-lg hover:bg-white/5 transition-all duration-200"
                >
                  {t("logout")}
                </button>
              </div>
            ) : (
              <Link
                href={`/${locale}/login`}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] rounded-lg hover:opacity-90 transition-opacity duration-200 shadow-lg shadow-[#7C3AED]/25"
              >
                {t("login")}
              </Link>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-white/70 hover:text-white transition-colors duration-200"
            aria-label="Menu"
          >
            {mobileOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-[#030712]/95 backdrop-blur-xl border-b border-white/5"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive(link.href)
                      ? "bg-white/10 text-white border border-white/10"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {ownerAccess && (
                <Link
                  href={`/${locale}/admin`}
                  className={`block px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive(`/${locale}/admin`)
                      ? "bg-white/10 text-[#A78BFA] border border-[#7C3AED]/30"
                      : "text-[#A78BFA]/70 hover:text-[#A78BFA] hover:bg-[#7C3AED]/10"
                  }`}
                >
                  {t("admin")}
                </Link>
              )}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <LanguageSwitcher />
                {session ? (
                  <button
                    onClick={() => signOut()}
                    className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white border border-white/10 rounded-lg hover:bg-white/5 transition-all duration-200"
                  >
                    {t("logout")}
                  </button>
                ) : (
                  <Link
                    href={`/${locale}/login`}
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] rounded-lg"
                  >
                    {t("login")}
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
