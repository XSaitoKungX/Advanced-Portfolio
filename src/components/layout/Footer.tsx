"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { RiTerminalBoxFill } from "react-icons/ri";
import { FiGithub } from "react-icons/fi";
import { SiDiscord, SiX } from "react-icons/si";

export default function Footer() {
  const locale = useLocale();
  const tNav = useTranslations("nav");

  const links = [
    { href: `/${locale}`, label: tNav("home") },
    { href: `/${locale}/about`, label: tNav("about") },
    { href: `/${locale}/projects`, label: tNav("projects") },
    { href: `/${locale}/contact`, label: tNav("contact") },
  ];

  const social = [
    { href: "https://github.com/XSaitoKungX", icon: FiGithub, label: "GitHub" },
    { href: "https://discord.com/channels/@me/848917797501141052", icon: SiDiscord, label: "Discord" },
    { href: "https://x.com/xsait0kungx", icon: SiX, label: "X" },
  ];

  return (
    <footer className="relative border-t border-white/5 bg-[#030712]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
        >
          <div>
            <Link href={`/${locale}`} className="flex items-center gap-2 mb-4">
              <RiTerminalBoxFill className="w-7 h-7 text-[#7C3AED]" />
              <span className="text-lg font-bold text-white">mark.dev</span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed">
              Full-Stack Developer · UI/UX Designer · Open Source
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Navigation</h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/40 hover:text-white/80 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Social</h3>
            <div className="flex items-center gap-3">
              {social.map(({ href, icon: Icon, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-2 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </motion.div>
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Mark. Built with Next.js, Tailwind CSS & ❤️
          </p>
          <div className="flex items-center gap-1 text-xs text-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
