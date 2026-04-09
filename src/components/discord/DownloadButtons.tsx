"use client";

import { FaWindows, FaLinux, FaApple } from "react-icons/fa";
import { useSyncExternalStore } from "react";

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

interface DownloadButtonProps {
  icon: React.ReactNode;
  platform: string;
  extension: string;
  href: string;
  downloadFor: string;
  primary?: boolean;
}

function DownloadButton({ icon, platform, extension, href, downloadFor, primary }: DownloadButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-3 px-5 py-3 rounded-xl font-medium transition-all duration-200 ${
        primary
          ? "bg-[#5865F2] hover:bg-[#4752C4] text-white shadow-lg shadow-[#5865F2]/25"
          : "bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white"
      }`}
    >
      {icon}
      <div className="text-left">
        <div className="text-xs opacity-70">{downloadFor}</div>
        <div className="text-sm font-semibold">{platform}</div>
      </div>
      <span className="text-xs opacity-50 ml-1">.{extension}</span>
    </a>
  );
}

interface DownloadButtonsProps {
  downloadFor: string;
}

export function DownloadButtons({ downloadFor }: DownloadButtonsProps) {
  const detectedOS = useSyncExternalStore(
    subscribe,
    getOS,
    () => "windows" // Server snapshot
  );

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      <DownloadButton
        icon={<FaWindows className="w-6 h-6" />}
        platform="Windows"
        extension="exe"
        href="https://github.com/XSaitoKungX/Discord-CustomRPC/releases/latest/download/discord-customrpc-windows.exe"
        downloadFor={downloadFor}
        primary={detectedOS === "windows"}
      />
      <DownloadButton
        icon={<FaLinux className="w-6 h-6" />}
        platform="Linux"
        extension="deb"
        href="https://github.com/XSaitoKungX/Discord-CustomRPC/releases/latest/download/discord-customrpc-linux.deb"
        downloadFor={downloadFor}
        primary={detectedOS === "linux"}
      />
      <DownloadButton
        icon={<FaApple className="w-6 h-6" />}
        platform="Mac"
        extension="dmg"
        href="https://github.com/XSaitoKungX/Discord-CustomRPC/releases/latest/download/discord-customrpc-mac.dmg"
        downloadFor={downloadFor}
        primary={detectedOS === "mac"}
      />
    </div>
  );
}
