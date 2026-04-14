"use client";

import { FaWindows, FaLinux, FaApple } from "react-icons/fa";
import { FiAlertTriangle } from "react-icons/fi";
import { useSyncExternalStore, useState, useEffect } from "react";
import { useTranslations } from "next-intl";

function getOS(): "windows" | "mac" | "linux" {
  if (typeof window === "undefined") return "linux";
  const ua = window.navigator.userAgent.toLowerCase();
  if (ua.includes("win")) return "windows";
  if (ua.includes("mac")) return "mac";
  return "linux";
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
  prerelease: boolean;
  assets?: ReleaseAsset[];
}

const PLATFORMS = [
  {
    icon: FaWindows,
    platform: "Windows",
    extension: "exe",
    os: "windows" as const,
    // matches: System.Monitor_0.2.2_x64-setup.exe  OR  System.Monitor_0.2.2_x64_en-US.msi
    assetPattern: /\.(exe|msi)$/i,
  },
  {
    icon: FaLinux,
    platform: "Linux",
    extension: "deb",
    os: "linux" as const,
    // matches: System.Monitor_0.2.2_amd64.deb  (prefer .deb over AppImage/rpm)
    assetPattern: /\.deb$/i,
  },
  {
    icon: FaApple,
    platform: "Mac",
    extension: "dmg",
    os: "mac" as const,
    // matches: System.Monitor_0.2.2_aarch64.dmg  OR  System.Monitor_0.2.2_x64.dmg
    assetPattern: /\.dmg$/i,
  },
];

export function SystemMonitorDownloadButtons() {
  const t = useTranslations("systemMonitor");
  const detectedOS = useSyncExternalStore(subscribe, getOS, () => "linux");

  const [release, setRelease] = useState<ReleaseInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      "https://api.github.com/repos/XSaitoKungX/System-Monitor/releases/latest"
    )
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then((data: ReleaseInfo) => {
        setRelease(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getDownloadUrl = (pattern: RegExp) => {
    if (!release?.assets?.length) return null;
    const asset = release.assets.find((a) => pattern.test(a.name));
    return asset?.browser_download_url ?? null;
  };

  return (
    <div className="flex flex-col items-center gap-4 mb-8">
      {release?.prerelease && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm">
          <FiAlertTriangle className="w-4 h-4" />
          <span>{t("preReleaseNotice")}</span>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-4">
        {PLATFORMS.map(({ icon: Icon, platform, extension, os, assetPattern }) => {
          const downloadUrl = getDownloadUrl(assetPattern);
          const isDetected = detectedOS === os;
          const isAvailable = !!downloadUrl;

          return (
            <a
              key={platform}
              href={downloadUrl ?? "#"}
              onClick={(e) => !downloadUrl && e.preventDefault()}
              download
              className={`flex items-center gap-3 px-5 py-3 rounded-xl font-medium transition-all duration-200 ${
                isAvailable
                  ? isDetected
                    ? "bg-linear-to-r from-blue-500 to-violet-500 hover:from-blue-400 hover:to-violet-400 text-white shadow-lg shadow-blue-500/25"
                    : "bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-white"
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
                      Beta
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

      {release && (
        <p className="text-sm text-white/40">
          {release.tag_name}
          {release.prerelease && " (Pre-Release)"}
        </p>
      )}
    </div>
  );
}
