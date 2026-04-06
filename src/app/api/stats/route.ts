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
    // Fetch commits only for this portfolio repo
    const commitsRes = await fetch(
      "https://api.github.com/repos/XSaitoKungX/Advanced-Portfolio/commits?per_page=100",
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          }),
        },
        next: { revalidate: 300 },
      }
    );

    if (!commitsRes.ok) {
      // Try alternative repo name
      const altRes = await fetch(
        "https://api.github.com/repos/XSaitoKungX/portfolio/commits?per_page=100",
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
            ...(process.env.GITHUB_TOKEN && {
              Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            }),
          },
        }
      );
      
      if (altRes.ok) {
        const linkHeader = altRes.headers.get("link");
        const total = linkHeader?.match(/page=(\d+)[^>]*>;\s*rel="last"/)?.[1];
        const count = total ? parseInt(total, 10) : (await altRes.json()).length || 100;
        cachedCommits = count;
        cacheTime = Date.now();
        return count;
      }
      
      throw new Error(`GitHub API error: ${commitsRes.status}`);
    }

    // Get total commit count from Link header (pagination)
    const linkHeader = commitsRes.headers.get("link");
    const totalPages = linkHeader?.match(/page=(\d+)[^>]*>;\s*rel="last"/)?.[1];
    
    // If no pagination, count returned commits
    const commits = await commitsRes.json();
    const totalCommits = totalPages ? parseInt(totalPages, 10) * 100 : commits.length || 100;
    const finalCount = totalCommits > 0 ? totalCommits : 100;
    cachedCommits = finalCount;
    cacheTime = Date.now();
    return finalCount;
  } catch {
    return cachedCommits ?? 100;
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
