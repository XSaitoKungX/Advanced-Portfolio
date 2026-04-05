import { createServer } from "http";
import { parse } from "url";
import { existsSync } from "fs";
import { spawnSync } from "child_process";
import next from "next";

// ── ANSI helpers ──────────────────────────────────────────────────────────────
const c = {
  reset:  "\x1b[0m",
  bold:   "\x1b[1m",
  dim:    "\x1b[2m",
  // fg
  white:  "\x1b[97m",
  gray:   "\x1b[90m",
  green:  "\x1b[92m",
  yellow: "\x1b[93m",
  blue:   "\x1b[94m",
  purple: "\x1b[95m",
  cyan:   "\x1b[96m",
  red:    "\x1b[91m",
  // bg
  bgGreen:  "\x1b[42m",
  bgRed:    "\x1b[41m",
  bgYellow: "\x1b[43m",
  bgBlue:   "\x1b[44m",
  bgPurple: "\x1b[45m",
  bgGray:   "\x1b[100m",
};

const tag = {
  ok:     `${c.bold}${c.bgGreen}\x1b[30m OK ${c.reset}`,
  fail:   `${c.bold}${c.bgRed}\x1b[97m FAIL ${c.reset}`,
  warn:   `${c.bold}${c.bgYellow}\x1b[30m WARN ${c.reset}`,
  build:  `${c.bold}${c.bgPurple}\x1b[97m BUILD ${c.reset}`,
  server: `${c.bold}${c.bgBlue}\x1b[97m SERVER ${c.reset}`,
  info:   `${c.bold}${c.bgGray}\x1b[97m INFO ${c.reset}`,
};

function line(char = "─", len = 52) {
  return c.gray + char.repeat(len) + c.reset;
}

function log(badge: string, msg: string, detail?: string) {
  const ts = new Date().toLocaleTimeString("de-DE", { hour12: false });
  const time = `${c.gray}${ts}${c.reset}`;
  const text = detail
    ? `${c.white}${msg}${c.reset} ${c.gray}${detail}${c.reset}`
    : `${c.white}${msg}${c.reset}`;
  console.log(`  ${time}  ${badge}  ${text}`);
}

// ── Config ────────────────────────────────────────────────────────────────────
const nodeEnv = process.env.NODE_ENV ?? "development";
const dev     = nodeEnv !== "production";
const port    = parseInt(process.env.PORT ?? "3000", 10);
const hostname = process.env.HOSTNAME ?? "0.0.0.0";
const appUrl  = process.env.APP_URL ?? `http://localhost:${port}`;

// ── Banner ────────────────────────────────────────────────────────────────────
console.log();
console.log(`  ${c.bold}${c.purple}▲ Advanced Portfolio${c.reset}  ${c.gray}by Mark · ${nodeEnv}${c.reset}`);
console.log(line());

// ── Build check ───────────────────────────────────────────────────────────────
if (!dev && !existsSync(".next/BUILD_ID")) {
  log(tag.build, "No production build found — starting next build...");
  console.log(line());

  const result = spawnSync("bun", ["run", "build"], {
    stdio: "inherit",
    env: { ...process.env, NODE_ENV: "production" },
  });

  console.log(line());

  if (result.status !== 0) {
    log(tag.fail, "Build failed — server will not start");
    console.log();
    process.exit(1);
  }

  log(tag.ok, "Build successful");
  console.log(line());
}

// ── Start server ──────────────────────────────────────────────────────────────
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url ?? "/", true);
    handle(req, res, parsedUrl);
  }).listen(port, hostname, () => {
    console.log();
    log(tag.server, "Server started at", `${c.cyan}${c.bold}http://${hostname}:${port}${c.reset}`);
    log(tag.info,   "Domain:  ", `${c.cyan}${appUrl}${c.reset}`);
    log(tag.info,   "Environment:", `${c.yellow}${nodeEnv}${c.reset}`);
    log(tag.info,   "Runtime: ", `Bun ${c.gray}${process.versions.bun ?? "unknown"}${c.reset}`);
    console.log(line());
    console.log();
  });

  process.on("SIGTERM", () => {
    console.log();
    log(tag.warn, "SIGTERM received — shutting down server...");
    console.log();
    process.exit(0);
  });

  process.on("SIGINT", () => {
    console.log();
    log(tag.warn, "SIGINT received — shutting down server...");
    console.log();
    process.exit(0);
  });
});
