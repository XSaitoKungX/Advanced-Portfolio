"use client";

import { FaWindows, FaLinux, FaApple } from "react-icons/fa";
import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";

function getOS(): "windows" | "mac" | "linux" {
  if (typeof window === "undefined") return "windows";
  const userAgent = window.navigator.userAgent.toLowerCase();
  if (userAgent.includes("mac")) return "mac";
  if (userAgent.includes("linux")) return "linux";
  return "windows";
}

function subscribe() {
  return () => {};
}

export function DownloadButtons() {
  const t = useTranslations("discordCustomRPC");
  const detectedOS = useSyncExternalStore(
    subscribe,
    getOS,
    () => "windows" // Server snapshot
  );

  const platforms = [
    { icon: FaWindows, platform: "Windows", extension: "exe", os: "windows" as const },
    { icon: FaLinux, platform: "Linux", extension: "deb", os: "linux" as const },
    { icon: FaApple, platform: "Mac", extension: "dmg", os: "mac" as const },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {platforms.map(({ icon: Icon, platform, extension, os }) => (
        <div
          key={platform}
          className={`flex items-center gap-3 px-5 py-3 rounded-xl font-medium transition-all duration-200 cursor-not-allowed ${
            detectedOS === os
              ? "bg-[#5865F2]/30 border border-[#5865F2]/30 text-white/60"
              : "bg-white/5 border border-white/10 text-white/40"
          }`}
          title={t("comingSoon")}
        >
          <Icon className="w-6 h-6" />
          <div className="text-left">
            <div className="text-xs opacity-50">{t("downloadFor")}</div>
            <div className="text-sm font-semibold flex items-center gap-2">
              {platform}
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/50">
                {t("comingSoon")}
              </span>
            </div>
          </div>
          <span className="text-xs opacity-30 ml-1">.{extension}</span>
        </div>
      ))}
    </div>
  );
}
