"use client";

import { useTranslations, useLocale } from "next-intl";
import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type FormEvent,
} from "react";
import Image from "next/image";
import {
  FiArrowDownRight,
  FiSend,
  FiMessageSquare,
  FiCheckCircle,
  FiEdit3,
  FiAlertCircle,
  FiTrash2,
  FiRefreshCw,
  FiHeart,
  FiClock,
  FiArrowRight,
} from "react-icons/fi";
import { SiDiscord } from "react-icons/si";
import { authClient, useSession } from "@/lib/auth-client";
import { useHydrated } from "@/hooks/useHydrated";

interface GuestbookEntry {
  id: string;
  message: string;
  name: string;
  image?: string | null;
  isVerified: boolean;
  status: "PENDING" | "APPROVED" | "REJECTED";
  userId?: string | null;
  createdAt: string;
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-4 focus-visible:ring-offset-[#030712]";

function EntryAvatar({ image, name }: { image?: string | null; name: string }) {
  const [failedImage, setFailedImage] = useState<string | null>(null);

  if (image && failedImage !== image) {
    return (
      <Image
        src={image}
        alt=""
        width={44}
        height={44}
        className="h-11 w-11 shrink-0 rounded-2xl object-cover"
        onError={() => setFailedImage(image)}
        unoptimized
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-300/15 bg-violet-300/10 text-lg font-semibold text-violet-200"
    >
      {Array.from(name.trim())[0]?.toLocaleUpperCase() || "?"}
    </span>
  );
}

function SkeletonEntry() {
  return (
    <div
      aria-hidden="true"
      className="rounded-2xl border border-white/8 bg-white/2 p-6"
    >
      <div className="flex gap-3 motion-safe:animate-pulse">
        <div className="h-11 w-11 shrink-0 rounded-2xl bg-white/10" />
        <div className="flex-1 space-y-3 py-1">
          <div className="h-3 w-28 rounded bg-white/10" />
          <div className="h-2 w-20 rounded bg-white/5" />
        </div>
      </div>
      <div className="mt-5 space-y-3 motion-safe:animate-pulse">
        <div className="h-3 w-full rounded bg-white/5" />
        <div className="h-3 w-3/4 rounded bg-white/5" />
      </div>
    </div>
  );
}

export default function GuestbookPage() {
  const locale = useLocale();
  const t = useTranslations("guestbook");
  const { data: sessionData, isPending } = useSession();
  const hydrated = useHydrated();
  const session = hydrated ? sessionData : null;
  const sessionPending = !hydrated || isPending;
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [notice, setNotice] = useState<"saved" | "pending" | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const fetchEntries = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setFetchError(false);
    try {
      const res = await fetch("/api/guestbook", { cache: "no-store", signal });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      if (!Array.isArray(data?.entries))
        throw new Error("Invalid entries response");
      if (!signal?.aborted) setEntries(data.entries);
    } catch {
      if (!signal?.aborted) setFetchError(true);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (sessionPending) return;
    const controller = new AbortController();
    void fetchEntries(controller.signal);
    return () => controller.abort();
  }, [fetchEntries, sessionPending, session?.user?.id]);

  async function handleSignIn() {
    setSigningIn(true);
    setFormError(null);
    try {
      const result = await authClient.signIn.social({
        provider: "discord",
        callbackURL: `/${locale}/guestbook`,
      });
      if (result.error) setFormError(t("error_sign_in"));
    } catch {
      setFormError(t("error_sign_in"));
    } finally {
      setSigningIn(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!message.trim() || submitting || sessionPending || signingIn) return;

    setSubmitting(true);
    setFormError(null);
    setNotice(null);
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          name: name.trim() || session?.user?.name || undefined,
        }),
      });
      if (!res.ok) {
        setFormError(
          t(res.status === 429 ? "error_rate_limit" : "error_submit"),
        );
        return;
      }
      const data = await res.json();
      setMessage("");
      setName("");
      setNotice(data.pending === true ? "pending" : "saved");
      await fetchEntries();
    } catch {
      setFormError(t("error_submit"));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (deletingId || !confirm(t("delete_confirm"))) return;
    setDeletingId(id);
    setDeleteError(false);
    setDeleted(false);
    try {
      const res = await fetch("/api/guestbook", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete");
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
      setDeleted(true);
    } catch {
      setDeleteError(true);
    } finally {
      setDeletingId(null);
    }
  }

  const charactersLeft = 500 - message.length;
  const formDisabled = submitting || sessionPending || signingIn;
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  });

  return (
    <div className="relative min-h-screen pb-24 pt-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-160 overflow-hidden"
      >
        <div className="absolute -right-40 -top-64 h-150 w-150 rounded-full bg-red-500/10 blur-[140px]" />
        <div className="absolute -left-40 top-32 h-100 w-100 rounded-full bg-violet-600/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section
          aria-labelledby="guestbook-title"
          className="grid items-center gap-10 pb-12 pt-10 sm:pb-16 sm:pt-16 lg:grid-cols-[1.2fr_.8fr] lg:gap-20"
        >
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-red-300/20 bg-red-300/5 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-red-200 sm:text-xs">
              <FiMessageSquare aria-hidden="true" className="h-3.5 w-3.5" />
              {t("title")}
            </p>
            <h1
              id="guestbook-title"
              className="mt-6 text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-6xl xl:text-7xl"
            >
              {t("hero_title")}
              <span className="block bg-linear-to-r from-red-200 via-red-400 to-violet-400 bg-clip-text text-transparent">
                {t("hero_highlight")}
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
              {t("hero_description")}
            </p>
            <a
              href="#guestbook-form"
              className={`mt-7 inline-flex items-center gap-2 rounded-md py-1 text-sm font-semibold text-red-200 transition-colors hover:text-white ${focusRing}`}
            >
              {t("write_cta")}
              <FiArrowDownRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>

          <aside className="relative rounded-3xl border border-white/10 bg-linear-to-br from-white/5 to-white/1 p-6 sm:p-8">
            <FiHeart aria-hidden="true" className="mb-6 h-7 w-7 text-red-300" />
            <p className="text-xl font-medium leading-relaxed tracking-tight text-white/90 sm:text-2xl">
              {t("host_note")}
            </p>
            <div className="mt-7 flex items-center gap-3 border-t border-white/10 pt-5">
              <Image
                src="/assets/mascot/saito-avatar.webp"
                alt=""
                width={44}
                height={44}
                className="rounded-2xl"
              />
              <div>
                <p className="text-sm font-semibold text-white">
                  Mark{" "}
                  <span className="font-normal text-white/45">/ xsaitox</span>
                </p>
                <p className="mt-1 text-xs text-white/50">
                  {t("host_signature")}
                </p>
              </div>
            </div>
            <span
              aria-hidden="true"
              className="absolute -right-2 -top-2 flex h-9 w-9 rotate-12 items-center justify-center rounded-xl border border-red-300/25 bg-[#21121c] text-red-200"
            >
              ✦
            </span>
          </aside>
        </section>

        <div className="grid items-start gap-10 border-t border-white/10 pt-10 lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] lg:gap-12 lg:pt-12">
          <section
            id="guestbook-form"
            aria-labelledby="guestbook-form-title"
            className="min-w-0 scroll-mt-28 lg:sticky lg:top-28"
          >
            <div className="rounded-3xl border border-white/10 bg-[#0c0e19]/80 p-5 sm:p-7">
              <div className="mb-6 flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-300/15 bg-red-300/5 text-red-300">
                  <FiEdit3 aria-hidden="true" className="h-4 w-4" />
                </span>
                <div>
                  <h2
                    id="guestbook-form-title"
                    className="text-xl font-bold tracking-tight text-white"
                  >
                    {t("form_title")}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-white/50">
                    {t("form_description")}
                  </p>
                </div>
              </div>

              {sessionPending ? (
                <p role="status" className="mb-6 text-sm text-white/60">
                  {t("loading_session")}
                </p>
              ) : session ? (
                <div className="mb-6 flex items-center gap-3 rounded-2xl border border-violet-300/15 bg-violet-300/5 p-4">
                  <EntryAvatar
                    image={session.user.image}
                    name={session.user.name || t("anonymous")}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {session.user.name || t("anonymous")}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-violet-200">
                      <FiCheckCircle
                        aria-hidden="true"
                        className="h-3.5 w-3.5"
                      />
                      {t("verified_badge")}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <button
                    type="button"
                    onClick={handleSignIn}
                    disabled={signingIn || submitting}
                    className={`flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-[#5865F2] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#4752C4] disabled:cursor-wait disabled:opacity-60 ${focusRing}`}
                  >
                    <SiDiscord
                      aria-hidden="true"
                      className="h-5 w-5 shrink-0"
                    />
                    {signingIn ? t("signing_in") : t("sign_with_discord")}
                  </button>
                  <div className="mt-5 flex items-center gap-3 text-xs text-white/45">
                    <span className="h-px flex-1 bg-white/10" />
                    {t("anonymous_divider")}
                    <span className="h-px flex-1 bg-white/10" />
                  </div>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
                aria-busy={submitting}
              >
                {!session && (
                  <div>
                    <label
                      htmlFor="guestbook-name"
                      className="mb-2 flex items-baseline gap-2 text-sm font-medium text-white/80"
                    >
                      {t("name_label")}
                      <span className="text-xs font-normal text-white/45">
                        {t("optional")}
                      </span>
                    </label>
                    <input
                      id="guestbook-name"
                      type="text"
                      autoComplete="nickname"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t("name_placeholder")}
                      disabled={formDisabled}
                      maxLength={50}
                      className="w-full rounded-xl border border-white/12 bg-white/3 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-violet-300/60 focus:outline-none focus:ring-2 focus:ring-violet-300/15 disabled:opacity-50"
                    />
                  </div>
                )}
                <div>
                  <label
                    htmlFor="guestbook-message"
                    className="mb-2 block text-sm font-medium text-white/80"
                  >
                    {t("message_label")}
                  </label>
                  <textarea
                    ref={messageRef}
                    id="guestbook-message"
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      setNotice(null);
                    }}
                    placeholder={t("message_placeholder")}
                    rows={5}
                    maxLength={500}
                    required
                    disabled={formDisabled}
                    aria-describedby="guestbook-characters guestbook-moderation"
                    className="block min-h-36 w-full resize-y rounded-xl border border-white/12 bg-white/3 px-4 py-3 text-sm leading-7 text-white placeholder:text-white/30 focus:border-violet-300/60 focus:outline-none focus:ring-2 focus:ring-violet-300/15 disabled:opacity-50"
                  />
                  <p
                    id="guestbook-characters"
                    className={`mt-2 text-right font-mono text-[11px] ${charactersLeft < 50 ? "text-amber-300" : "text-white/45"}`}
                  >
                    {t("characters_left", { n: charactersLeft })}
                  </p>
                </div>

                <p
                  id="guestbook-moderation"
                  className="flex items-start gap-2 text-xs leading-5 text-white/50"
                >
                  {session ? (
                    <FiCheckCircle
                      aria-hidden="true"
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-300"
                    />
                  ) : (
                    <FiClock
                      aria-hidden="true"
                      className="mt-0.5 h-3.5 w-3.5 shrink-0"
                    />
                  )}
                  {session ? t("verified_hint") : t("moderation_hint")}
                </p>
                <button
                  type="submit"
                  disabled={formDisabled || !message.trim()}
                  className={`flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#DC2626] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-950/20 transition-colors hover:bg-[#B91C1C] disabled:cursor-not-allowed disabled:opacity-40 ${focusRing}`}
                >
                  {submitting ? (
                    <FiRefreshCw
                      aria-hidden="true"
                      className="h-4 w-4 motion-safe:animate-spin"
                    />
                  ) : (
                    <FiSend aria-hidden="true" className="h-4 w-4" />
                  )}
                  {submitting ? t("submitting") : t("submit")}
                </button>
                {formError && (
                  <p
                    role="alert"
                    className="flex items-start gap-2 rounded-xl border border-red-300/20 bg-red-300/5 p-3 text-sm leading-6 text-red-200"
                  >
                    <FiAlertCircle
                      aria-hidden="true"
                      className="mt-1 h-4 w-4 shrink-0"
                    />
                    {formError}
                  </p>
                )}
                <div role="status" aria-live="polite" aria-atomic="true">
                  {notice && (
                    <p
                      className={`flex items-start gap-2 rounded-xl border p-3 text-sm leading-6 ${notice === "pending" ? "border-amber-300/20 bg-amber-300/5 text-amber-200" : "border-emerald-300/20 bg-emerald-300/5 text-emerald-200"}`}
                    >
                      <FiCheckCircle
                        aria-hidden="true"
                        className="mt-1 h-4 w-4 shrink-0"
                      />
                      {notice === "pending"
                        ? t("pending_success")
                        : t("success_message")}
                    </p>
                  )}
                </div>
              </form>
            </div>
          </section>

          <section
            aria-labelledby="guestbook-entries-title"
            className="min-w-0"
          >
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-red-300">
                  {t("entries_eyebrow")}
                </p>
                <h2
                  id="guestbook-entries-title"
                  className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl"
                >
                  {t("entries_title")}
                </h2>
                <p className="mt-2 text-xs text-white/45">
                  {t("newest_first")}
                </p>
              </div>
              {!loading && !fetchError && (
                <span className="rounded-full border border-white/10 bg-white/3 px-3 py-1.5 text-xs text-white/60">
                  {entries.length === 1
                    ? t("entry_count_one")
                    : t("entry_count_other", { n: entries.length })}
                </span>
              )}
            </div>

            {deleteError && (
              <p
                role="alert"
                className="mb-4 rounded-xl border border-red-300/20 bg-red-300/5 p-4 text-sm text-red-200"
              >
                {t("error_delete")}
              </p>
            )}
            <div role="status" aria-live="polite">
              {deleted && (
                <p className="mb-4 text-sm text-emerald-200">
                  {t("delete_success")}
                </p>
              )}
            </div>

            {loading ? (
              <div role="status" className="space-y-4">
                <span className="sr-only">{t("loading_entries")}</span>
                {Array.from({ length: 3 }, (_, i) => (
                  <SkeletonEntry key={i} />
                ))}
              </div>
            ) : fetchError ? (
              <div
                role="alert"
                className="rounded-2xl border border-white/10 bg-white/2 px-6 py-12 text-center"
              >
                <FiAlertCircle
                  aria-hidden="true"
                  className="mx-auto mb-4 h-8 w-8 text-red-300"
                />
                <p className="mx-auto max-w-sm text-sm leading-6 text-white/60">
                  {t("error_loading")}
                </p>
                <button
                  type="button"
                  onClick={() => void fetchEntries()}
                  className={`mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm text-white transition-colors hover:bg-white/5 ${focusRing}`}
                >
                  <FiRefreshCw aria-hidden="true" className="h-4 w-4" />
                  {t("retry")}
                </button>
              </div>
            ) : entries.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/15 bg-white/2 px-6 py-14 text-center">
                <FiMessageSquare
                  aria-hidden="true"
                  className="mx-auto mb-5 h-9 w-9 text-violet-300"
                />
                <h3 className="text-lg font-semibold text-white">
                  {t("no_entries")}
                </h3>
                <p className="mt-2 text-sm text-white/50">{t("first_entry")}</p>
                <button
                  type="button"
                  onClick={() => messageRef.current?.focus()}
                  className={`mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium text-red-200 hover:text-white ${focusRing}`}
                >
                  {t("write_cta")}
                  <FiArrowRight aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <ul className="space-y-4">
                {entries.map((entry) => (
                  <li key={entry.id}>
                    <article
                      className={`rounded-2xl border bg-white/2 p-5 sm:p-6 ${entry.status === "PENDING" ? "border-amber-300/20" : "border-white/10"}`}
                    >
                      <header className="flex items-start gap-3">
                        <EntryAvatar image={entry.image} name={entry.name} />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <h3 className="min-w-0 text-sm font-semibold break-words text-white [overflow-wrap:anywhere]">
                              {entry.name}
                            </h3>
                            {entry.isVerified && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-violet-300/15 bg-violet-300/8 px-2 py-0.5 text-[10px] font-medium text-violet-200">
                                <FiCheckCircle
                                  aria-hidden="true"
                                  className="h-3 w-3"
                                />
                                {t("verified_badge")}
                              </span>
                            )}
                            {!entry.isVerified && (
                              <span className="text-[10px] text-white/45">
                                {t("anonymous")}
                              </span>
                            )}
                          </div>
                          <time
                            dateTime={entry.createdAt}
                            className="mt-1 block text-xs text-white/45"
                          >
                            {dateFormatter.format(new Date(entry.createdAt))}
                          </time>
                        </div>
                        {session?.user?.id &&
                          entry.userId === session.user.id && (
                            <button
                              type="button"
                              onClick={() => void handleDelete(entry.id)}
                              disabled={deletingId !== null}
                              aria-label={t("delete_own")}
                              title={t("delete_own")}
                              className={`-mr-2 -mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white/40 transition-colors hover:bg-red-300/10 hover:text-red-300 disabled:opacity-40 ${focusRing}`}
                            >
                              {deletingId === entry.id ? (
                                <FiRefreshCw
                                  aria-hidden="true"
                                  className="h-4 w-4 motion-safe:animate-spin"
                                />
                              ) : (
                                <FiTrash2
                                  aria-hidden="true"
                                  className="h-4 w-4"
                                />
                              )}
                            </button>
                          )}
                      </header>
                      <p className="mt-5 text-sm leading-7 whitespace-pre-wrap text-white/75 [overflow-wrap:anywhere]">
                        {entry.message}
                      </p>
                      {entry.status === "PENDING" && (
                        <p className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-amber-300/5 px-2.5 py-1 text-xs text-amber-200">
                          <FiClock aria-hidden="true" className="h-3 w-3" />
                          {t("pending_badge")}
                        </p>
                      )}
                    </article>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
