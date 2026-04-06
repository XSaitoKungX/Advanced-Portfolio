"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { RiTerminalBoxFill } from "react-icons/ri";
import {
  FiMenu, FiX, FiUser, FiShield, FiLogOut, FiChevronDown, FiGlobe,
} from "react-icons/fi";
import { useSession, signOut } from "@/lib/auth-client";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { isOwner } from "@/lib/is-owner";

export default function Navigation() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const ownerAccess = isOwner(session?.user ?? null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // Extract discordId from avatar URL for profile link
  const avatarUrl = session?.user?.image as string | null;
  const discordIdMatch = avatarUrl?.match(/\/avatars\/(\d+)\//);
  const discordId = discordIdMatch?.[1];
  const profileHref = session?.user
    ? `/${locale}/profile/${discordId ?? session.user.id}`
    : `/${locale}/login`;

  const userMenuItems = [
    {
      icon: FiUser,
      label: "Profile",
      href: profileHref,
      show: !!session,
    },
    {
      icon: FiGlobe,
      label: "Public Profile",
      href: discordId ? `/${locale}/global/profile/${discordId}` : null,
      show: !!session && !!discordId,
    },
    {
      icon: FiShield,
      label: t("admin"),
      href: `/${locale}/admin`,
      show: ownerAccess,
      accent: true,
    },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#030712]/85 backdrop-blur-2xl border-b border-white/[0.06] shadow-xl shadow-black/30"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">

          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="relative">
              <RiTerminalBoxFill className="w-7 h-7 text-[#7C3AED] group-hover:text-[#A78BFA] transition-colors duration-200" />
              <div className="absolute inset-0 bg-[#7C3AED]/30 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent group-hover:from-[#A78BFA] group-hover:to-white/90 transition-all duration-200">
              xsaitox.dev
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive(link.href)
                    ? "text-white"
                    : "text-white/50 hover:text-white/90"
                }`}
              >
                {isActive(link.href) && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-white/[0.08] rounded-lg border border-white/[0.08]"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center gap-2">
            <LanguageSwitcher />

            {session ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-200 group"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={session.user.name ?? "Avatar"}
                      className="w-7 h-7 rounded-full object-cover border border-white/10"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#7C3AED]/40 flex items-center justify-center border border-[#7C3AED]/30">
                      <FiUser className="w-3.5 h-3.5 text-[#A78BFA]" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-white/80 group-hover:text-white max-w-[100px] truncate transition-colors duration-200">
                    {session.user.name?.split(" ")[0] ?? "User"}
                  </span>
                  <FiChevronDown
                    className={`w-3.5 h-3.5 text-white/40 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 top-full mt-2 w-52 bg-[#0d0a14]/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden"
                    >
                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-white/[0.06]">
                        <p className="text-sm font-semibold text-white truncate">
                          {session.user.name ?? "User"}
                        </p>
                        <p className="text-xs text-white/40 truncate mt-0.5">
                          {session.user.email ?? (discordId ? `@${discordId}` : "")}
                        </p>
                      </div>

                      {/* Menu items */}
                      <div className="p-1.5 space-y-0.5">
                        {userMenuItems
                          .filter((item) => item.show && item.href)
                          .map((item) => (
                            <Link
                              key={item.href}
                              href={item.href!}
                              onClick={() => setUserMenuOpen(false)}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                                item.accent
                                  ? "text-[#A78BFA] hover:bg-[#7C3AED]/15"
                                  : "text-white/70 hover:text-white hover:bg-white/[0.06]"
                              }`}
                            >
                              <item.icon className="w-4 h-4 flex-shrink-0" />
                              {item.label}
                            </Link>
                          ))}
                      </div>

                      {/* Logout */}
                      <div className="p-1.5 pt-0 border-t border-white/[0.06] mt-0.5">
                        <button
                          onClick={() => { setUserMenuOpen(false); signOut(); }}
                          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
                        >
                          <FiLogOut className="w-4 h-4 flex-shrink-0" />
                          {t("logout")}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href={`/${locale}/login`}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg shadow-[#7C3AED]/25"
              >
                <FiUser className="w-4 h-4" />
                {t("login")}
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-white/60 hover:text-white transition-colors duration-200"
            aria-label="Menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <FiX className="w-5 h-5" />
                </motion.span>
              ) : (
                <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <FiMenu className="w-5 h-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden bg-[#030712]/95 backdrop-blur-2xl border-b border-white/[0.06]"
          >
            <div className="max-w-7xl mx-auto px-4 pt-3 pb-5 space-y-1">

              {/* Nav links */}
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive(link.href)
                        ? "bg-white/[0.08] text-white border border-white/[0.08]"
                        : "text-white/55 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* User section for mobile */}
              {session && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.28 }}
                  className="pt-3 mt-2 border-t border-white/[0.06] space-y-1"
                >
                  {/* User info */}
                  <div className="flex items-center gap-3 px-4 py-2 mb-2">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="" className="w-9 h-9 rounded-full border border-white/10 object-cover" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#7C3AED]/30 flex items-center justify-center">
                        <FiUser className="w-4 h-4 text-[#A78BFA]" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-white">{session.user.name}</p>
                      <p className="text-xs text-white/40">{session.user.email}</p>
                    </div>
                  </div>

                  {userMenuItems
                    .filter((item) => item.show && item.href)
                    .map((item) => (
                      <Link
                        key={item.href}
                        href={item.href!}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                          item.accent
                            ? "text-[#A78BFA] hover:bg-[#7C3AED]/10"
                            : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </Link>
                    ))}

                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                  >
                    <FiLogOut className="w-4 h-4" />
                    {t("logout")}
                  </button>
                </motion.div>
              )}

              {/* Bottom bar */}
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <LanguageSwitcher />
                {!session && (
                  <Link
                    href={`/${locale}/login`}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] rounded-lg"
                  >
                    <FiUser className="w-4 h-4" />
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
