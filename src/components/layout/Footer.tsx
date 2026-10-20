"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "motion/react";
import { FiGithub, FiExternalLink, FiMail, FiHeart, FiArrowUp } from "react-icons/fi";
import { SiDiscord, SiX, SiNextdotjs, SiTailwindcss, SiTypescript } from "react-icons/si";

export default function Footer() {
  const locale = useLocale();
  const tNav = useTranslations("nav");
  const tLegal = useTranslations("legal");
  const tFooter = useTranslations("footer");

  const navigationLinks = [
    { href: `/${locale}`, label: tNav("home") },
    { href: `/${locale}/about`, label: tNav("about") },
    { href: `/${locale}/skills`, label: tNav("skills") },
    { href: `/${locale}/projects`, label: tNav("projects") },
    { href: `/${locale}/experience`, label: tNav("experience") },
    { href: `/${locale}/contact`, label: tNav("contact") },
    { href: `/${locale}/guestbook`, label: tNav("guestbook") },
  ];

  const projectLinks = [
    {
      href: `/${locale}/discgen-cli`,
      label: "discgen-cli",
      description: "Discord Bot CLI",
      external: false,
    },
    {
      href: `/${locale}/discord-customrpc`,
      label: "Discord CustomRPC",
      description: "Rich Presence Tool",
      external: false,
    },
    {
      href: "https://astra-bot.app",
      label: "Astra Bot",
      description: "Discord Bot",
      external: true,
    },
    {
      href: `/${locale}/system-monitor`,
      label: "System Monitor",
      description: "Tauri + Rust Desktop App",
      external: false,
    },
  ];

  const legalLinks = [
    { href: `/${locale}/privacy`, label: tLegal("privacyTitle") },
    { href: `/${locale}/terms`, label: tLegal("termsTitle") },
    { href: `/${locale}/cookies`, label: tLegal("cookiesTitle") },
  ];

  const social = [
    { href: "https://github.com/XSaitoKungX", icon: FiGithub, label: "GitHub", color: "hover:text-white" },
    { href: "https://discord.com/channels/@me/848917797501141052", icon: SiDiscord, label: "Discord", color: "hover:text-[#5865F2]" },
    { href: "https://x.com/xsait0kungx", icon: SiX, label: "X", color: "hover:text-white" },
  ];

  const techStack = [
    { icon: SiNextdotjs, label: "Next.js" },
    { icon: SiTailwindcss, label: "Tailwind CSS" },
    { icon: SiTypescript, label: "TypeScript" },
  ];

  const columnHeading = (label: string) => (
    <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/35 mb-5">
      <span className="h-1 w-1 rounded-full bg-[#7C3AED]" aria-hidden="true" />
      {label}
    </h3>
  );

  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-[#07060c]">
      {/* Ambient glow + gradient hairline */}
      <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#7C3AED]/50 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute -top-52 left-1/2 h-96 w-200 -translate-x-1/2 rounded-full bg-[#7C3AED]/8 blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid gap-12 lg:grid-cols-[1.2fr_2fr] mb-14"
        >
          {/* Brand Column */}
          <div className="max-w-sm">
            <Link href={`/${locale}`} className="flex items-center gap-2.5 mb-5 group w-fit">
              <span className="relative block h-9 w-9 overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-all duration-300 group-hover:border-white/25">
                <Image
                  src="/assets/mascot/saito-avatar.webp"
                  alt=""
                  width={36}
                  height={36}
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="text-xl font-bold text-white/90 transition-colors duration-200 group-hover:text-white">
                xsaitox<span className="text-[#A78BFA]">.dev</span>
              </span>
            </Link>
            <p className="text-sm text-white/45 leading-relaxed mb-6">
              {tFooter("tagline")}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2">
              {social.map(({ href, icon: Icon, label, color }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`p-2.5 rounded-xl border border-white/10 text-white/40 ${color} hover:border-white/20 hover:bg-white/5 transition-all duration-200`}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Navigation */}
            <div className="col-span-2 sm:col-span-1">
              {columnHeading(tFooter("navigation"))}
              <ul className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-1 sm:gap-x-0">
                {navigationLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/40 hover:text-white/90 transition-colors duration-200 flex items-center gap-1 group"
                    >
                      <span className="w-0 h-px bg-[#7C3AED] group-hover:w-3 transition-all duration-200" aria-hidden="true" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Projects */}
            <div>
              {columnHeading(tFooter("projects"))}
              <ul className="space-y-3">
                {projectLinks.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-white/40 hover:text-white/90 transition-colors duration-200 flex items-start gap-2 group"
                      >
                        <span className="flex-1">
                          <span className="flex items-center gap-1">
                            <span className="group-hover:text-[#A78BFA] transition-colors">{link.label}</span>
                            <FiExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </span>
                          <span className="text-xs text-white/30">{link.description}</span>
                        </span>
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-white/40 hover:text-white/90 transition-colors duration-200 group"
                      >
                        <span className="block group-hover:text-[#A78BFA] transition-colors">{link.label}</span>
                        <span className="text-xs text-white/30">{link.description}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal & Contact */}
            <div>
              {columnHeading(tFooter("legal"))}
              <ul className="space-y-3 mb-7">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/40 hover:text-white/90 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white/60 hover:text-white hover:border-[#7C3AED]/50 hover:bg-[#7C3AED]/10 transition-all duration-200"
              >
                <FiMail className="w-4 h-4" />
                {tFooter("getInTouch")}
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-5">
          <p className="flex items-center gap-2 text-sm text-white/40 order-1">
            <span>© {new Date().getFullYear()} Mark</span>
            <span className="text-white/20" aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              {tFooter("madeWith")} <FiHeart className="w-3 h-3 text-red-400" aria-hidden="true" /> {tFooter("inGermany")}
            </span>
          </p>

          <div className="flex items-center gap-3 order-3 sm:order-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/25">{tFooter("builtWith")}</span>
            <div className="flex items-center gap-1.5">
              {techStack.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  title={label}
                  className="p-2 rounded-lg border border-white/5 text-white/30 hover:text-white/60 hover:border-white/10 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 order-2 sm:order-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
              <span className="text-xs text-emerald-400/80">{tFooter("allSystemsOperational")}</span>
            </div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label={tFooter("backToTop")}
              className="p-2 rounded-full border border-white/10 text-white/40 hover:text-white hover:border-white/25 hover:bg-white/5 transition-all duration-200"
            >
              <FiArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
