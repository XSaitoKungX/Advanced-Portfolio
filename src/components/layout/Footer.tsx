"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { RiTerminalBoxFill } from "react-icons/ri";
import { FiGithub, FiExternalLink, FiMail, FiHeart } from "react-icons/fi";
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
      href: `/${locale}/discord-customrpc`, 
      label: "Discord CustomRPC",
      description: "Rich Presence Tool",
      external: false 
    },
    { 
      href: "https://github.com/XSaitoKungX/astra-bot", 
      label: "Astra Bot",
      description: "Discord Bot",
      external: true 
    },
    { 
      href: "https://github.com/XSaitoKungX/rpc-manager", 
      label: "RPC Manager",
      description: "Multi-Account RPC",
      external: true 
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

  return (
    <footer className="relative border-t border-white/5 bg-[#0a0a0f]/90 backdrop-blur-2xl">
      {/* Gradient Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#7C3AED]/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12"
        >
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href={`/${locale}`} className="flex items-center gap-2 mb-5 group">
              <div className="relative">
                <RiTerminalBoxFill className="w-8 h-8 text-[#7C3AED] transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-[#7C3AED]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="text-xl font-bold bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent">
                xsaitox.dev
              </span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed mb-6">
              Full-Stack Developer crafting modern web experiences with React, Next.js, and TypeScript. Open source enthusiast.
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

          {/* Navigation Column */}
          <div>
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-5">
              {tNav("home")}
            </h3>
            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/40 hover:text-white/90 transition-colors duration-200 flex items-center gap-1 group"
                  >
                    <span className="w-0 h-px bg-[#7C3AED] group-hover:w-3 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Projects Column */}
          <div>
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-5">
              {tFooter("projects")}
            </h3>
            <ul className="space-y-3">
              {projectLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-sm text-white/40 hover:text-white/90 transition-colors duration-200 flex items-start gap-2 group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <span className="group-hover:text-[#7C3AED] transition-colors">{link.label}</span>
                        {link.external && <FiExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                      </div>
                      <span className="text-xs text-white/30">{link.description}</span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Contact Column */}
          <div>
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-5">
              {tFooter("legal")}
            </h3>
            <ul className="space-y-3 mb-8">
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
            
            {/* Contact CTA */}
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white/60 hover:text-white hover:border-[#7C3AED]/50 hover:bg-[#7C3AED]/10 transition-all duration-200"
            >
              <FiMail className="w-4 h-4" />
              {tFooter("getInTouch")}
            </Link>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <div className="flex items-center gap-2 text-sm text-white/40">
            <span>© {new Date().getFullYear()} Mark</span>
            <span className="text-white/20">·</span>
            <span className="flex items-center gap-1">
              {tFooter("madeWith")} <FiHeart className="w-3 h-3 text-red-400" /> {tFooter("inGermany")}
            </span>
          </div>

          {/* Tech Stack */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/30 uppercase tracking-wider">{tFooter("builtWith")}</span>
            <div className="flex items-center gap-2">
              {techStack.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="p-2 rounded-lg border border-white/5 text-white/30 hover:text-white/60 hover:border-white/10 transition-all duration-200"
                  title={label}
                >
                  <Icon className="w-4 h-4" />
                </div>
              ))}
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-emerald-400/80">{tFooter("allSystemsOperational")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
