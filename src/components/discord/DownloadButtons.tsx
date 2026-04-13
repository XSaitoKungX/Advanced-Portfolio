"use client";

import { FaWindows, FaLinux, FaApple } from "react-icons/fa";
import { FiAlertTriangle } from "react-icons/fi";
import { useSyncExternalStore, useState, useEffect } from "react";
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

interface ReleaseAsset {
  name: string;
  browser_download_url: string;
}

interface ReleaseInfo {
  tag_name: string;
  name: string;
  prerelease: boolean;
  assets?: ReleaseAsset[];
}

export function DownloadButtons() {
  const t = useTranslations("discordCustomRPC");
  const detectedOS = useSyncExternalStore(
    subscribe,
    getOS,
    () => "windows"
  );

  const [release, setRelease] = useState<ReleaseInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.github.com/repos/XSaitoKungX/Discord-CustomRPC/releases/latest")
      .then((res) => res.json())
      .then((data) => {
        setRelease(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const platforms = [
    { icon: FaWindows, platform: "Windows", extension: "exe", os: "windows" as const, assetPattern: /win.*\.exe$/i },
    { icon: FaLinux, platform: "Linux", extension: "deb", os: "linux" as const, assetPattern: /\.deb$/i },
    { icon: FaApple, platform: "Mac", extension: "dmg", os: "mac" as const, assetPattern: /\.dmg$/i },
  ];

  const getDownloadUrl = (pattern: RegExp) => {
    if (!release?.assets?.length) return null;
    const asset = release.assets.find((a) => pattern.test(a.name));
    return asset?.browser_download_url || null;
  };

  return (
    <div className="flex flex-col items-center gap-4 mb-8">
      {/* Beta Warning Banner */}
      {release?.prerelease && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm">
          <FiAlertTriangle className="w-4 h-4" />
          <span>{t("preReleaseNotice")}</span>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-4">
        {platforms.map(({ icon: Icon, platform, extension, os, assetPattern }) => {
          const downloadUrl = getDownloadUrl(assetPattern);
          const isDetected = detectedOS === os;
          const isAvailable = !!downloadUrl;

          return (
            <a
              key={platform}
              href={downloadUrl || "#"}
              onClick={(e) => !downloadUrl && e.preventDefault()}
              className={`flex items-center gap-3 px-5 py-3 rounded-xl font-medium transition-all duration-200 ${
                isAvailable
                  ? isDetected
                    ? "bg-[#5865F2] hover:bg-[#4752C4] text-white shadow-lg shadow-[#5865F2]/25"
                    : "bg-[#5865F2]/20 hover:bg-[#5865F2]/30 border border-[#5865F2]/30 text-white"
                  : "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
              }`}
            >
              <Icon className="w-6 h-6" />
              <div className="text-left">
                <div className="text-xs opacity-70">{t("downloadFor")}</div>
                <div className="text-sm font-semibold flex items-center gap-2">
                  {platform}
                  {release?.prerelease && isAvailable && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {t("betaWarning")}
                    </span>
                  )}
                  {!isAvailable && !loading && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/50">
                      {t("comingSoon")}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs opacity-50 ml-1">.{extension}</span>
            </a>
          );
        })}
      </div>

      {/* Version Info */}
      {release && (
        <p className="text-sm text-white/40">
          {release.tag_name} {release.prerelease && "(Pre-Release)"}
        </p>
      )}
    </div>
  );
}
