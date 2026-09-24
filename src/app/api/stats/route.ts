import { NextResponse } from "next/server";
import { projects } from "@/lib/data/projects";
import { skills } from "@/lib/data/skills";
import { z } from "zod";

const PAGE_SIZE = 100;
const CACHE_TTL = 5 * 60 * 1000;
let cachedCommits: number | null = null;
let cacheTime = 0;

const astraStatsSchema = z.object({ guilds: z.number().int().nonnegative() });

async function getAstraServerCount(): Promise<number | null> {
  try {
    const response = await fetch("https://astra-bot.app/api/stats", {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) return null;

    const result = astraStatsSchema.safeParse(await response.json());
    return result.success ? result.data.guilds : null;
  } catch {
    return null;
  }
}

function githubHeaders() {
  return {
    Accept: "application/vnd.github+json",
    ...(process.env.GITHUB_TOKEN && {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    }),
  };
}

async function fetchCommitsPage(page?: number) {
  const url = new URL("https://api.github.com/repos/XSaitoKungX/Advanced-Portfolio/commits");
  url.searchParams.set("per_page", String(PAGE_SIZE));
  if (page) url.searchParams.set("page", String(page));

  const response = await fetch(url, {
    headers: githubHeaders(),
    next: { revalidate: 300 },
  });

  if (!response.ok) return null;
  const commits: unknown = await response.json();
  return Array.isArray(commits)
    ? { commits, linkHeader: response.headers.get("link") }
    : null;
}

async function getGitHubCommits(): Promise<number | null> {
  if (cachedCommits !== null && Date.now() - cacheTime < CACHE_TTL) {
    return cachedCommits;
  }

  try {
    const firstPage = await fetchCommitsPage();
    if (!firstPage) return null;

    const lastPage = Number(firstPage.linkHeader?.match(/<[^>]*[?&]page=(\d+)[^>]*>\s*;\s*rel="last"/)?.[1] ?? 1);
    let count = firstPage.commits.length;

    if (lastPage > 1) {
      const finalPage = await fetchCommitsPage(lastPage);
      if (!finalPage) return null;
      count = (lastPage - 1) * PAGE_SIZE + finalPage.commits.length;
    }

    cachedCommits = count;
    cacheTime = Date.now();
    return count;
  } catch {
    return null;
  }
}

export async function GET() {
  const [commits, astraServers] = await Promise.all([
    getGitHubCommits(),
    getAstraServerCount(),
  ]);

  return NextResponse.json({
    projects: projects.length,
    tech: skills.length,
    commits,
    astraServers,
  });
}
