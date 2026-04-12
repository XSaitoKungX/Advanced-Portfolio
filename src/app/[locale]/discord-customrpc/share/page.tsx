"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiDownload, FiCheckCircle, FiAlertCircle, FiCopy, FiExternalLink } from "react-icons/fi";
import { SiDiscord } from "react-icons/si";

interface SharedProfile {
  name: string;
  applicationId: string;
  details?: string;
  state?: string;
  largeImageKey?: string;
  largeImageText?: string;
  smallImageKey?: string;
  smallImageText?: string;
  button1Label?: string;
  button1Url?: string;
  button2Label?: string;
  button2Url?: string;
}

function decodeProfile(data: string): SharedProfile | null {
  try {
    const json = atob(data);
    return JSON.parse(json) as SharedProfile;
  } catch {
    return null;
  }
}

export default function SharePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const data = searchParams.get("data");

  const { profile, error } = useMemo(() => {
    if (!data) return { profile: null, error: "No profile data provided." };
    const decoded = decodeProfile(data);
    if (!decoded) return { profile: null, error: "Invalid or corrupted profile data." };
    return { profile: decoded, error: null };
  }, [data]);

  const handleOpenInApp = () => {
    window.location.href = `discordrpc://import?data=${data}`;
  };

  const handleCopyDeeplink = async () => {
    await navigator.clipboard.writeText(`discordrpc://import?data=${data}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <SiDiscord className="w-10 h-10 text-[#5865F2]" />
            <h1 className="text-2xl font-bold text-white">Discord Custom RPC</h1>
          </div>
          <p className="text-zinc-400 text-sm">Shared Profile</p>
        </div>

        {error ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
            <FiAlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p className="text-red-300 font-medium">{error}</p>
            <button
              onClick={() => router.push("/discord-customrpc")}
              className="mt-4 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              ← Back to Discord Custom RPC
            </button>
          </div>
        ) : profile ? (
          <>
            {/* Profile Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 backdrop-blur-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">{profile.name}</h2>
                  <p className="text-zinc-500 text-sm font-mono mt-0.5">ID: {profile.applicationId}</p>
                </div>
                <div className="bg-[#5865F2]/20 text-[#5865F2] text-xs font-medium px-2.5 py-1 rounded-full border border-[#5865F2]/30">
                  RPC Profile
                </div>
              </div>

              <div className="space-y-2.5 text-sm">
                {profile.details && (
                  <div className="flex gap-2">
                    <span className="text-zinc-500 w-20 shrink-0">Details</span>
                    <span className="text-zinc-200">{profile.details}</span>
                  </div>
                )}
                {profile.state && (
                  <div className="flex gap-2">
                    <span className="text-zinc-500 w-20 shrink-0">State</span>
                    <span className="text-zinc-200">{profile.state}</span>
                  </div>
                )}
                {profile.largeImageKey && (
                  <div className="flex gap-2">
                    <span className="text-zinc-500 w-20 shrink-0">Large Image</span>
                    <span className="text-zinc-200 font-mono">{profile.largeImageKey}</span>
                  </div>
                )}
                {profile.smallImageKey && (
                  <div className="flex gap-2">
                    <span className="text-zinc-500 w-20 shrink-0">Small Image</span>
                    <span className="text-zinc-200 font-mono">{profile.smallImageKey}</span>
                  </div>
                )}
                {(profile.button1Label || profile.button2Label) && (
                  <div className="pt-2 border-t border-white/5 flex flex-wrap gap-2">
                    {profile.button1Label && (
                      <span className="bg-white/10 text-zinc-300 text-xs px-3 py-1 rounded-full">
                        {profile.button1Label}
                      </span>
                    )}
                    {profile.button2Label && (
                      <span className="bg-white/10 text-zinc-300 text-xs px-3 py-1 rounded-full">
                        {profile.button2Label}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleOpenInApp}
                className="w-full flex items-center justify-center gap-2.5 bg-[#5865F2] hover:bg-[#4752c4] text-white font-semibold py-3.5 px-6 rounded-xl transition-colors"
              >
                <FiExternalLink className="w-5 h-5" />
                Open in Discord Custom RPC
              </button>

              <button
                onClick={handleCopyDeeplink}
                className="w-full flex items-center justify-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 font-medium py-3 px-6 rounded-xl transition-colors"
              >
                {copied ? (
                  <>
                    <FiCheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <FiCopy className="w-4 h-4" />
                    Copy deeplink
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/discord-customrpc"
                  className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-1.5"
                >
                  <FiDownload className="w-3.5 h-3.5" />
                  Don&apos;t have the app? Download it here
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#5865F2] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </motion.div>
    </div>
  );
}
