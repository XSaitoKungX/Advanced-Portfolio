"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function RoleTyper() {
  const t = useTranslations("home");
  const roles = t.raw("roles") as string[];

  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<"typing" | "pause" | "erasing">("typing");

  useEffect(() => {
    const current = roles[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (displayed.length < current.length) {
        timeout = setTimeout(() => {
          setDisplayed(current.slice(0, displayed.length + 1));
        }, 60 + Math.random() * 40);
      } else {
        timeout = setTimeout(() => setPhase("pause"), 1800);
      }
    } else if (phase === "pause") {
      timeout = setTimeout(() => setPhase("erasing"), 400);
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => {
          setDisplayed(displayed.slice(0, -1));
        }, 30);
      } else {
        setRoleIndex((i) => (i + 1) % roles.length);
        setPhase("typing");
      }
    }

    return () => clearTimeout(timeout);
  }, [displayed, phase, roleIndex, roles]);

  return (
    <div className="flex items-center gap-2 h-full">
      <span className="text-2xl sm:text-3xl font-semibold text-gradient-purple">
        {displayed}
      </span>
      <span className="inline-block w-0.5 h-7 sm:h-8 bg-[#A78BFA] animate-pulse rounded-full" />
    </div>
  );
}
