"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    <div
      className={[
        "prose prose-invert prose-sm max-w-none",
        "prose-headings:font-bold prose-headings:tracking-tight",
        "prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg",
        "prose-p:text-white/60 prose-p:leading-relaxed",
        "prose-a:text-[#A78BFA] prose-a:no-underline hover:prose-a:text-white prose-a:transition-colors",
        "prose-strong:text-white/90 prose-strong:font-semibold",
        "prose-code:text-[#A78BFA] prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none",
        "prose-pre:bg-[#0D1117] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl prose-pre:overflow-x-auto prose-pre:text-sm",
        "prose-blockquote:border-l-[#7C3AED] prose-blockquote:text-white/50 prose-blockquote:not-italic prose-blockquote:bg-white/[0.02] prose-blockquote:rounded-r-lg prose-blockquote:py-0.5",
        "prose-hr:border-white/10",
        "prose-li:text-white/60",
        "prose-ul:text-white/60 prose-ol:text-white/60",
        "prose-table:border-collapse prose-thead:border-white/10 prose-tr:border-white/10 prose-th:text-white/70 prose-td:text-white/50",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
