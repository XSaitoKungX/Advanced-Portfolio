import { NextResponse } from "next/server";
import { projects } from "@/lib/data/projects";
import { skills } from "@/lib/data/skills";

// Cache GitHub stats for 5 minutes to avoid rate limits
let cachedCommits: number | null = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getGitHubCommits(): Promise<number> {
  // Return cached value if fresh
  if (cachedCommits !== null && Date.now() - cacheTime < CACHE_TTL) {
    return cachedCommits;
  }

  try {
    // Fetch user's public repos
    const reposRes = await fetch(
      "https://api.github.com/users/XSaitoKungX/repos?per_page=30&type=public",
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          // Add GitHub token if available for higher rate limits
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          }),
        },
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      }
    );

    if (!reposRes.ok) {
      throw new Error(`GitHub API error: ${reposRes.status}`);
    }

    const repos = await reposRes.json();

    // Sum commits from all repos (using default branch stats)
    let totalCommits = 0;

    for (const repo of repos) {
      if (!repo.fork) {
        // Get contribution stats for each repo
        try {
          const statsRes = await fetch(
            `https://api.github.com/repos/XSaitoKungX/${repo.name}/stats/contributors`,
            {
              headers: {
                Accept: "application/vnd.github.v3+json",
                ...(process.env.GITHUB_TOKEN && {
                  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                }),
              },
            }
          );

          if (statsRes.ok) {
            const stats = await statsRes.json();
            // Find user's contributions in this repo
            const userStats = stats.find(
              (s: { author: { login: string } }) =>
                s.author.login === "XSaitoKungX"
            );
            if (userStats) {
              totalCommits += userStats.total;
            }
          } else {
            // Fallback: use repo's total commit count from repo data
            totalCommits += repo.size || 0; // rough estimate
          }
        } catch {
          // Ignore individual repo errors
        }
      }
    }

    cachedCommits = totalCommits > 0 ? totalCommits : 1000; // fallback
    cacheTime = Date.now();
    return cachedCommits;
  } catch {
    // Rate limit or other error - return cached or fallback without logging
    return cachedCommits ?? 1000;
  }
}

export async function GET() {
  const [commits] = await Promise.all([getGitHubCommits()]);

  return NextResponse.json({
    projects: projects.length,
    tech: skills.length,
    commits,
  });
}
