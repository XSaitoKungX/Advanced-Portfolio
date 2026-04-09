export enum CommandType {
  HELP = "help",
  CLEAR = "clear",
  LS = "ls",
  CD = "cd",
  PWD = "pwd",
  CAT = "cat",
  WHOAMI = "whoami",
  PING = "ping",
  DATE = "date",
  STACK = "stack",
  ASTRA = "astra",
  EXPERIENCE = "experience",
  ABOUT = "about",
  PROJECTS = "projects",
  SKILLS = "skills",
  CONTACT = "contact",
  MENU = "menu",
  ECHO = "echo",
  UNAME = "uname",
  NEOFETCH = "neofetch",
  HISTORY = "history",
  EXIT = "exit",
  UNKNOWN = "unknown",
}

export interface CommandContext {
  username: string;
  locale: string;
  router: { push: (path: string) => void };
  t: (key: string, params?: Record<string, string>) => string;
}

export interface CommandResult {
  lines: { type: "output" | "info" | "error" | "separator"; content: string }[];
  redirect?: { path: string; delay: number };
  clear?: boolean;
}

export type CommandHandler = (args: string[], ctx: CommandContext) => CommandResult | Promise<CommandResult>;

class CommandRegistry {
  private handlers = new Map<CommandType, CommandHandler>();
  private aliases = new Map<string, CommandType>();

  register(type: CommandType, handler: CommandHandler) {
    this.handlers.set(type, handler);
  }

  alias(alias: string, type: CommandType) {
    this.aliases.set(alias.toLowerCase(), type);
  }

  resolve(name: string): CommandType | undefined {
    const lower = name.toLowerCase();
    if (this.aliases.has(lower)) {
      return this.aliases.get(lower);
    }
    return Object.values(CommandType).find((t) => t === lower) as CommandType | undefined;
  }

  async execute(type: CommandType, args: string[], ctx: CommandContext): Promise<CommandResult> {
    const handler = this.handlers.get(type);
    if (!handler) {
      return {
        lines: [
          { type: "error", content: `${type}: command not found` },
          { type: "separator", content: "" },
        ],
      };
    }
    return handler(args, ctx);
  }
}

export const registry = new CommandRegistry();

// Built-in commands
registry.register(CommandType.HELP, (_args, ctx) => ({
  lines: [
    { type: "output", content: ctx.t("cmd_help_title") },
    { type: "separator", content: "" },
    { type: "output", content: "Navigation:" },
    { type: "output", content: "  ls          → List available sections" },
    { type: "output", content: "  cd projects → Navigate to projects" },
    { type: "output", content: "  cd skills   → Navigate to skills" },
    { type: "output", content: "  cd contact  → Navigate to contact" },
    { type: "separator", content: "" },
    { type: "output", content: "System:" },
    { type: "output", content: "  whoami      → Display user info" },
    { type: "output", content: "  date        → Show current date/time" },
    { type: "output", content: "  uname       → System information" },
    { type: "output", content: "  neofetch    → Display system stats" },
    { type: "separator", content: "" },
    { type: "output", content: "Info:" },
    { type: "output", content: "  stack       → Show tech stack" },
    { type: "output", content: "  astra       → Astra Bot details" },
    { type: "output", content: "  about       → Personal info" },
    { type: "output", content: "  experience  → Timeline" },
    { type: "separator", content: "" },
    { type: "output", content: "Terminal:" },
    { type: "output", content: "  clear       → Clear terminal" },
    { type: "output", content: "  history     → Command history" },
    { type: "output", content: "  ping        → Test connection" },
    { type: "separator", content: "" },
  ],
}));

registry.register(CommandType.CLEAR, () => ({
  lines: [],
  clear: true,
}));

registry.register(CommandType.LS, (_args, ctx) => ({
  lines: [
    { type: "output", content: "Available sections:" },
    { type: "separator", content: "" },
    { type: "output", content: "drwxr-xr-x  projects/    " + ctx.t("menu_projects") },
    { type: "output", content: "drwxr-xr-x  skills/      " + ctx.t("menu_skills") },
    { type: "output", content: "drwxr-xr-x  contact/     " + ctx.t("menu_contact") },
    { type: "output", content: "drwxr-xr-x  about/       " + ctx.t("menu_about") },
    { type: "output", content: "drwxr-xr-x  experience/  " + ctx.t("menu_experience") },
    { type: "separator", content: "" },
    { type: "info", content: "Use 'cd <section>' to navigate" },
    { type: "separator", content: "" },
  ],
}));

registry.register(CommandType.CD, (args, ctx) => {
  const target = args[0]?.toLowerCase();
  const validPaths: Record<string, string> = {
    projects: "/projects",
    skills: "/skills",
    contact: "/contact",
    about: "/about",
    experience: "/experience",
    home: "/",
    "~": "/",
    "..": "/",
  };

  if (!target || target === "~" || target === "home") {
    return {
      lines: [{ type: "output", content: "cd ~" }],
      redirect: { path: `/${ctx.locale}`, delay: 600 },
    };
  }

  const path = validPaths[target];
  if (path) {
    return {
      lines: [{ type: "output", content: `cd ${target}` }],
      redirect: { path: `/${ctx.locale}${path}`, delay: 600 },
    };
  }

  return {
    lines: [
      { type: "error", content: `bash: cd: ${target}: No such file or directory` },
      { type: "separator", content: "" },
    ],
  };
});

registry.register(CommandType.PWD, (_args, ctx) => ({
  lines: [
    { type: "output", content: `/${ctx.locale}/~` },
    { type: "separator", content: "" },
  ],
}));

registry.register(CommandType.WHOAMI, (_args, ctx) => ({
  lines: [
    { type: "output", content: ctx.username },
    { type: "separator", content: "" },
    { type: "output", content: "  " + ctx.t("cmd_whoami_role") },
    { type: "output", content: "  " + ctx.t("cmd_whoami_company") },
    { type: "output", content: "  " + ctx.t("cmd_whoami_location") },
    { type: "separator", content: "" },
  ],
}));

registry.register(CommandType.PING, (_args, ctx) => {
  const ms = Math.floor(Math.random() * 12) + 2;
  return {
    lines: [
      { type: "info", content: ctx.t("cmd_ping_sending") },
      { type: "output", content: `PING xsaitox.dev (127.0.0.1): 56 bytes` },
      { type: "output", content: `64 bytes from xsaitox.dev: icmp_seq=0 time=${ms} ms` },
      { type: "output", content: `64 bytes from xsaitox.dev: icmp_seq=1 time=${ms + 1} ms` },
      { type: "output", content: `64 bytes from xsaitox.dev: icmp_seq=2 time=${ms - 1} ms` },
      { type: "separator", content: "" },
      { type: "info", content: ctx.t("cmd_ping_result", { ms: String(ms) }) },
      { type: "separator", content: "" },
    ],
  };
});

registry.register(CommandType.DATE, (_args, ctx) => {
  const now = new Date();
  const iso = now.toISOString();
  const local = now.toLocaleString(ctx.locale === "de" ? "de-DE" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return {
    lines: [
      { type: "output", content: local },
      { type: "output", content: `UTC: ${iso}` },
      { type: "separator", content: "" },
    ],
  };
});

registry.register(CommandType.STACK, (_args, ctx) => ({
  lines: [
    { type: "output", content: ctx.t("cmd_stack_title") },
    { type: "separator", content: "" },
    { type: "output", content: "  Runtime    → Bun v1.x + Node.js v22" },
    { type: "output", content: "  Framework  → Next.js 16 (Turbopack)" },
    { type: "output", content: "  Styling    → Tailwind CSS v4" },
    { type: "output", content: "  Auth       → Better Auth (Discord)" },
    { type: "output", content: "  i18n       → next-intl (de/en)" },
    { type: "output", content: "  Anim       → Framer Motion" },
    { type: "output", content: "  Deploy     → Pelican Panel (Bun Egg)" },
    { type: "separator", content: "" },
  ],
}));

registry.register(CommandType.ASTRA, () => ({
  lines: [
    { type: "output", content: "  Astra Bot — astra-bot.app" },
    { type: "separator", content: "" },
    { type: "output", content: "  Status   → 🟢 online" },
    { type: "output", content: "  Servers  → 100+" },
    { type: "output", content: "  Tech     → discord.js + TypeScript + PostgreSQL" },
    { type: "output", content: "  Features → Moderation, Music, Custom Commands" },
    { type: "separator", content: "" },
    { type: "info", content: "https://astra-bot.app" },
    { type: "separator", content: "" },
  ],
}));

registry.register(CommandType.EXPERIENCE, () => ({
  lines: [
    { type: "output", content: "Experience Timeline:" },
    { type: "separator", content: "" },
    { type: "output", content: "  2025  → 100+ Servers with Astra Bot" },
    { type: "output", content: "  2024  → Leuphana Azubi + BBS1 Godot Game" },
    { type: "output", content: "  2023  → React, Next.js, TypeScript mastery" },
    { type: "output", content: "  2022  → BBS2: C++, Elektrotechnik" },
    { type: "output", content: "  2021  → JavaScript, Node.js, discord.js" },
    { type: "output", content: "  2020  → Python, discord.py experiments" },
    { type: "output", content: "  2019  → Unity, first game attempts" },
    { type: "output", content: "  2018  → Scorpion-inspired start" },
    { type: "separator", content: "" },
  ],
}));

registry.register(CommandType.ABOUT, (_args, ctx) => ({
  lines: [
    { type: "output", content: ctx.t("cmd_about_title") },
    { type: "separator", content: "" },
    { type: "output", content: "  Name    → Mark" },
    { type: "output", content: "  Role    → " + ctx.t("cmd_whoami_role") },
    { type: "output", content: "  Status  → " + ctx.t("cmd_about_status") },
    { type: "output", content: "  Until   → 2027 (graduation)" },
    { type: "separator", content: "" },
    { type: "info", content: ctx.t("cmd_navigate", { path: `/${ctx.locale}/about` }) },
    { type: "separator", content: "" },
  ],
  redirect: { path: `/${ctx.locale}/about`, delay: 1500 },
}));

registry.register(CommandType.UNAME, () => ({
  lines: [
    { type: "output", content: "Linux xsaitox 6.8.0-generic #42 SMP x86_64 GNU/Linux" },
    { type: "separator", content: "" },
  ],
}));

registry.register(CommandType.NEOFETCH, (_args, ctx) => ({
  lines: [
    { type: "output", content: "                    ▟█▙               " + ctx.username + "@xsaitox" },
    { type: "output", content: "                   ▟███▙              ─────────────────────────────" },
    { type: "output", content: "                  ▟█████▙             OS: Portfolio OS x86_64" },
    { type: "output", content: "                 ▟███████▙            Host: Pelican Panel (Bun Egg)" },
    { type: "output", content: "                ▟███◥◤███▙           Kernel: Next.js 16 (Turbopack)" },
    { type: "output", content: "               ▟███▙  ▟███▙          Uptime: 100+ Discord servers" },
    { type: "output", content: "              ▟█████▙▟█████▙         Packages: Bun v1.x, React 19" },
    { type: "output", content: "             ▟█████████████▙        Shell: bun" },
    { type: "output", content: "            ▟██████◥◤███████▙        Theme: Tailwind CSS v4" },
    { type: "output", content: "           ▟██████▙  ▟███████▙       Lang: TypeScript 5.7" },
    { type: "output", content: "          ▟███████▙▟█████████▙      User: " + ctx.t("cmd_whoami_role") },
    { type: "output", content: "         ▟███████████████████▙     Locale: " + ctx.locale },
    { type: "separator", content: "" },
    { type: "output", content: "        ● ● ● ● ● ● ● ● ● ●          " + (ctx.locale === "de" ? "Farben: Lila Blau Grün Gelb Rot" : "Colors: Purple Blue Green Yellow Red") },
    { type: "separator", content: "" },
  ],
}));

registry.register(CommandType.ECHO, (args) => ({
  lines: [
    { type: "output", content: args.join(" ") },
    { type: "separator", content: "" },
  ],
}));

registry.register(CommandType.HISTORY, (args, ctx) => {
  const limit = args[0] ? parseInt(args[0], 10) : 10;
  return {
    lines: [
      { type: "output", content: `Command history (last ${limit} commands):` },
      { type: "separator", content: "" },
      { type: "info", content: `User: ${ctx.username} | Locale: ${ctx.locale}` },
      { type: "output", content: "Use ↑/↓ arrows to navigate previous commands" },
      { type: "separator", content: "" },
    ],
  };
});

registry.register(CommandType.EXIT, (_args, ctx) => ({
  lines: [
    { type: "output", content: "logout" },
    { type: "separator", content: "" },
    { type: "info", content: "Session ended. Refresh to reconnect." },
    { type: "separator", content: "" },
  ],
  redirect: { path: `/${ctx.locale}`, delay: 1000 },
}));

// Aliases
registry.alias("1", CommandType.PROJECTS);
registry.alias("2", CommandType.SKILLS);
registry.alias("3", CommandType.CONTACT);
registry.alias("h", CommandType.HELP);
registry.alias("c", CommandType.CLEAR);
registry.alias("dir", CommandType.LS);
registry.alias("ll", CommandType.LS);
