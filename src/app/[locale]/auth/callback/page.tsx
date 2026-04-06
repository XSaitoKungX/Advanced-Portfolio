"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useSession } from "@/lib/auth-client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const locale = useLocale();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) return;
    if (session?.user) {
      router.replace(`/${locale}/profile/${session.user.id}`);
    } else {
      router.replace(`/${locale}/login`);
    }
  }, [session, isPending]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
