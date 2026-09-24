export type ProjectStatus = "launched" | "planning" | "in_progress" | "completed" | "incoming";
export type ProjectCategory = "discord" | "devtools" | "system" | "creative" | "utility" | "web" | "mobile" | "tool" | "game";

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: { de: string; en: string };
  longDescription?: { de: string; en: string };
  tags: string[];
  labels: string[];
  stack: string[];
  category: ProjectCategory;
  status: ProjectStatus;
  image?: string;
  demo?: string;
  github?: string;
  featured: boolean;
  year: number;
}

export const projects: Project[] = [
  // 🚀 Discord / Bot
  {
    id: "astra-bot",
    slug: "astra-bot",
    title: "Astra Bot",
    description: {
      de: "Multifunktionaler Discord-Bot mit Moderation, Musik, Levelsystem, Economy, Tickets und Dashboard.",
      en: "Multi-functional Discord bot with moderation, music, leveling, economy, tickets and a web dashboard.",
    },
    longDescription: {
      de: `## Astra Bot

Astra ist mein bisher größtes und ambitioniertestes Projekt: ein vollständig selbst entwickelter Discord-Bot mit umfangreichen Community-Features.

### Features

- **Moderation**: Ban, kick, timeout, warn, automod, anti-spam — all in one
- **Music System**: YouTube, Spotify, SoundCloud, Apple Music with 20+ filters
- **Leveling & XP**: Custom rank cards, role rewards, voice XP, and server leaderboards
- **Economy System**: Currency, shops, gambling, boosts, inventory, and daily rewards
- **Web Dashboard**: Manage everything from a beautiful, modern interface
- **Ticket System**: Custom panels, staff roles, auto-transcripts, and category management
- **Giveaways**: Multiple winners, role requirements, bonus entries, and scheduled end times

### Tech Stack

- **Node.js** + **Discord.js**
- **TypeScript** für volle Typsicherheit
- **Neon** als Framework
- **PostgreSQL** für persistente Daten
- **Eigenes Hosting Panel** für das Deployment

Die zugehörige Website [astra-bot.app](https://astra-bot.app) wurde mit **Next.js** und **Tailwind CSS** umgesetzt.`,
      en: `## Astra Bot

Astra is my largest and most ambitious project: a fully self-built Discord bot with a broad set of community features.

### Features

- **Moderation**: Ban, kick, timeout, warn, automod, anti-spam — all in one
- **Music System**: YouTube, Spotify, SoundCloud, Apple Music with 20+ filters
- **Leveling & XP**: Custom rank cards, role rewards, voice XP, and server leaderboards
- **Economy System**: Currency, shops, gambling, boosts, inventory, and daily rewards
- **Web Dashboard**: Manage everything from a beautiful, modern interface
- **Ticket System**: Custom panels, staff roles, auto-transcripts, and category management
- **Giveaways**: Multiple winners, role requirements, bonus entries, and scheduled end times

### Tech Stack

- **Node.js** + **Discord.js**
- **TypeScript** for full type safety
- **Neon** as framework
- **PostgreSQL** for persistent data
- **Self-built Hosting Panel** for deployment

The accompanying website [astra-bot.app](https://astra-bot.app) was built with **Next.js** and **Tailwind CSS**.`,
    },
    tags: ["Discord", "Bot", "TypeScript", "PostgreSQL"],
    labels: ["Discord", "Bot", "Dashboard"],
    stack: ["TypeScript", "Node.js", "Neon", "PostgreSQL"],
    category: "discord",
    status: "launched",
    featured: true,
    year: 2025,
    demo: "https://astra-bot.app",
  },
  {
    id: "rpc-manager",
    slug: "rpc-manager",
    title: "Discord CustomRPC",
    description: {
      de: "Eigene Rich Presence Profile erstellen & wechseln, Presets speichern.",
      en: "Create & switch custom Rich Presence profiles, save presets.",
    },
    longDescription: {
      de: `## Discord CustomRPC

Ein Desktop-Tool zur Erstellung und Verwaltung von **Discord Rich Presence** Profilen. Zeige deinen Freunden, was du gerade machst — mit custom Images, Text und Timestamps.

### Features

- **Profile Management**: Erstellen, bearbeiten, duplizieren, löschen
- **Drag & Drop**: Profile sortieren per Drag & Drop
- **Import/Export**: JSON Export/Import einzeln oder alle
- **Profile teilen**: Base64 Share Links — andere können direkt importieren
- **Live Preview**: Discord-ähnliche UI Preview in Echtzeit
- **RPC Steuerung**: Activate/Deactivate mit Live Status
- **Themes**: Default, Dark, Light, Space, Anime, Kawaii, Dev
- **Auto-Update**: Via GitHub Releases

### Tech Stack

- **Electron** + **Vite** + **electron-vite**
- **TypeScript** (strikt, überall)
- **React 19** + **React Router**
- **Tailwind CSS v4** für Styling
- **shadcn/ui** für UI Komponenten
- **Drizzle ORM** + **better-sqlite3** für Datenbank
- **discord-rpc** für Rich Presence
- **electron-store** für Settings
- **electron-updater** für Auto-Updates

Open Source unter MIT Lizenz auf [GitHub](https://github.com/XSaitoKungX/Discord-CustomRPC).`,
      en: `## Discord CustomRPC

A desktop tool for creating and managing **Discord Rich Presence** profiles. Show your friends what you're up to — with custom images, text and timestamps.

### Features

- **Profile Management**: Create, edit, duplicate, delete profiles
- **Drag & Drop**: Sort profiles via drag & drop
- **Import/Export**: JSON export/import single or all profiles
- **Share profiles**: Base64 share links — others can import directly
- **Live Preview**: Discord-like UI preview in real-time
- **RPC Control**: Activate/Deactivate with live status
- **Themes**: Default, Dark, Light, Space, Anime, Kawaii, Dev
- **Auto-Update**: Via GitHub Releases

### Tech Stack

- **Electron** + **Vite** + **electron-vite**
- **TypeScript** (strict, everywhere)
- **React 19** + **React Router**
- **Tailwind CSS v4** for styling
- **shadcn/ui** for UI components
- **Drizzle ORM** + **better-sqlite3** for database
- **discord-rpc** for Rich Presence
- **electron-store** for settings
- **electron-updater** for auto-updates

Open source under MIT license on [GitHub](https://github.com/XSaitoKungX/Discord-CustomRPC).`,
    },
    tags: ["Desktop", "Windows", "Linux", "Mac", "Open Source"],
    labels: ["Desktop", "Windows", "Linux", "Mac"],
    stack: ["TypeScript", "Electron", "React", "Tailwind CSS", "Drizzle"],
    category: "discord",
    status: "planning",
    featured: false,
    year: 2025,
    demo: "https://xsaitox.dev/discord-customrpc"
  },
  {
    id: "embed-builder",
    slug: "embed-builder",
    title: "Discord Embed & Components v2 Builder",
    description: {
      de: "Visueller Builder für Discord Embeds & Components v2 mit Live-Preview und JSON-Export.",
      en: "Visual builder for Discord Embeds & Components v2 with live preview and JSON export.",
    },
    tags: ["Web", "Desktop"],
    labels: ["Web", "Desktop"],
    stack: ["JavaScript", "HTML", "CSS"],
    category: "discord",
    status: "planning",
    featured: false,
    year: 2025,
  },
  {
    id: "astra-rebran",
    slug: "astra-rebran",
    title: "Astra Rebran",
    description: {
      de: "Weiterentwicklung von Astra als All-in-One-Discord-Plattform mit Bot-Runtime, Echtzeit-Dashboard, Moderation und Levelsystem.",
      en: "Astra's next iteration as an all-in-one Discord platform with a bot runtime, realtime dashboard, moderation and leveling.",
    },
    longDescription: {
      de: `## Astra Rebran

Astra Rebran führt Discord-Gateway, Fastify-API, React-Dashboard und PostgreSQL-Persistenz in einer gemeinsamen Plattform zusammen.

### Bereits umgesetzt

- Discord-Gateway, Moderation und duale Nachrichten-/Voice-Leveling-Systeme
- OAuth-Sitzungen, Fastify-API und Echtzeit-Updates über SSE
- Konfigurierbares Dashboard und PostgreSQL mit Drizzle ORM
- Gemeinsame englische und deutsche Sprachkataloge`,
      en: `## Astra Rebran

Astra Rebran brings the Discord Gateway runtime, Fastify API, React dashboard and PostgreSQL persistence together in one platform.

### Implemented

- Discord Gateway, moderation and dual message/voice leveling tracks
- OAuth sessions, Fastify API and realtime SSE updates
- Configurable dashboard and PostgreSQL persistence with Drizzle ORM
- Shared English and German locale catalogs`,
    },
    tags: ["Discord", "Bot", "TypeScript", "Fastify", "PostgreSQL"],
    labels: ["Discord", "Bot", "Dashboard"],
    stack: ["Node.js 24", "TypeScript 7", "Discord.js", "Fastify", "React", "PostgreSQL", "Drizzle ORM"],
    category: "discord",
    status: "in_progress",
    featured: true,
    year: 2026,
  },
  {
    id: "advanced-modmail",
    slug: "advanced-modmail",
    title: "Advanced Modmail",
    description: {
      de: "Open-Source-Modmail für Discord mit konfigurierbaren Support-Workflows. Das Projekt Relaya befindet sich in der Pre-Alpha-Architekturphase.",
      en: "Open-source Discord modmail with configurable support workflows. The Relaya project is in its pre-alpha architecture phase.",
    },
    longDescription: {
      de: `## Advanced Modmail — Relaya

Ein Architekturprojekt für sichere, konfigurierbare Modmail-Workflows mit Mehrserver-Isolation, nachvollziehbarer Moderation, Transkripten und Lokalisierung. Die Umsetzung steht noch am Anfang; diese Punkte sind Projektziele, keine bereits ausgelieferten Features.`,
      en: `## Advanced Modmail — Relaya

An architecture-stage project for secure, configurable Discord modmail workflows, with goals including multi-guild isolation, auditable moderation, transcripts and localization. Implementation is at an early stage; these are project goals, not shipped features.`,
    },
    tags: ["Discord", "Modmail", "Open Source", "TypeScript"],
    labels: ["Discord", "Modmail", "Open Source"],
    stack: ["Node.js 24", "TypeScript 7", "PostgreSQL", "Drizzle ORM"],
    category: "discord",
    status: "planning",
    featured: false,
    year: 2026,
    github: "https://github.com/XSaitoKungX/advanced-modmail",
  },

  // 🛠️ Developer Tools
  {
    id: "discgen-cli",
    slug: "discgen-cli",
    title: "discgen-cli",
    description: {
      de: "Interaktiver CLI zum Generieren produktionsreifer TypeScript Discord Bots — mit discord.js v14, Components v2, Economy, i18n, SQLite/PostgreSQL und mehr.",
      en: "Interactive CLI to scaffold production-ready TypeScript Discord bots — with discord.js v14, Components v2, economy, i18n, SQLite/PostgreSQL and more.",
    },
    longDescription: {
      de: `## discgen-cli

Ein interaktiver CLI-Generator für Discord Bots — von null zu einem vollständig typisierten, produktionsreifen Bot mit einem einzigen Befehl.

### Features

- **Interaktiver Wizard**: Powered by @clack/prompts — schönes Setup mit smarten Defaults
- **Template-Presets**: \`basic\`, \`moderation\` und \`full\` — jeder Preset verkabelt Commands, Events und Utilities automatisch
- **Components v2**: Jeder generierte Command nutzt ContainerBuilder, TextDisplayBuilder und MessageFlags.IsComponentsV2
- **Datenbank-Support**: SQLite via better-sqlite3 oder PostgreSQL via Drizzle ORM
- **i18n eingebaut**: TypeScript-Locale-Dateien (kein JSON), useT()-Helper, /locale-Command mit ManageGuild-Permission
- **Code-Generator**: \`discgen-cli g command|event|guard|button|select|modal|service <name>\`
- **Prefix + Slash**: Unterstützung für Slash Commands, Prefix Commands oder beides
- **184 Unit Tests**: Vollständige Test-Abdeckung mit vitest

### Tech Stack

- **TypeScript** + **Node.js**
- **discord.js v14**
- **@clack/prompts** für den interaktiven Wizard
- **commander** für Argument-Parsing
- **vitest** für Tests`,
      en: `## discgen-cli

An interactive CLI generator for Discord bots — from zero to a fully-typed, production-ready bot with a single command.

### Features

- **Interactive Wizard**: Powered by @clack/prompts — beautiful setup with smart defaults
- **Template Presets**: \`basic\`, \`moderation\` and \`full\` — each preset wires up commands, events and utilities automatically
- **Components v2**: Every generated command uses ContainerBuilder, TextDisplayBuilder and MessageFlags.IsComponentsV2
- **Database Support**: SQLite via better-sqlite3 or PostgreSQL via Drizzle ORM
- **i18n Built-in**: TypeScript locale files (not JSON), useT() helper, /locale command with ManageGuild permission
- **Code Generator**: \`discgen-cli g command|event|guard|button|select|modal|service <name>\`
- **Prefix + Slash**: Support for slash commands, prefix commands or both
- **184 Unit Tests**: Full test coverage with vitest

### Tech Stack

- **TypeScript** + **Node.js**
- **discord.js v14**
- **@clack/prompts** for the interactive wizard
- **commander** for argument parsing
- **vitest** for tests`,
    },
    tags: ["CLI", "TypeScript", "Discord.js", "Open Source", "npm"],
    labels: ["CLI", "TypeScript", "Open Source", "npm"],
    stack: ["TypeScript", "Node.js", "discord.js", "vitest"],
    category: "devtools",
    status: "launched",
    featured: true,
    year: 2025,
    github: "https://github.com/XSaitoKungX/discgen-cli",
    demo: "https://xsaitox.dev/en/discgen-cli",
  },
  {
    id: "readme-generator",
    slug: "readme-generator",
    title: "README Generator",
    description: {
      de: "Visueller Drag & Drop Editor für professionelle GitHub READMEs.",
      en: "Visual drag & drop editor for professional GitHub READMEs.",
    },
    tags: ["Web", "Desktop"],
    labels: ["Web", "Desktop"],
    stack: ["HTML/CSS", "JavaScript", "Electron"],
    category: "devtools",
    status: "planning",
    featured: false,
    year: 2025,
  },

  // 🐧 System & Linux Tools
  {
    id: "system-monitor",
    slug: "system-monitor",
    title: "System Monitor",
    description: {
      de: "CPU, RAM, GPU, Disk und Netzwerk live überwachen — modernes Glassmorphism-Dashboard mit Tauri v2 + Rust.",
      en: "Monitor CPU, RAM, GPU, disk and network live — modern glassmorphism dashboard built with Tauri v2 + Rust.",
    },
    longDescription: {
      de: `## System Monitor

Ein modernes, Open-Source-Desktop-App zur Echtzeit-Überwachung aller wichtigen Systemressourcen. Entwickelt als schlanker Ersatz für Task Manager, htop und btop.

### Features

- **Dashboard**: Glassmorphism-Übersicht mit Live-Karten für alle Metriken
- **CPU**: Pro-Kern-Auslastung, Taktfrequenz, Temperatur und Verlaufsdiagramm
- **GPU**: VRAM, Last, Temperatur via sysfs (Linux) und WMI (Windows)
- **Netzwerk**: Upload/Download-Speed, pro-Interface-Statistiken
- **Speedtest**: Eingebaut via Cloudflare — Ping, Jitter, Down- und Upload
- **Prozesse**: Live-Liste mit Kill-Funktion
- **System Tray**: Minimiert in die Taskleiste, vollständig per Tray steuerbar
- **Auto-Update**: Automatische Update-Prüfung via GitHub Releases
- **Themes**: Default, Dark, Light, Space, Dev

### Tech Stack

- **Tauri v2** + **Rust** als Backend
- **React 18** + **TypeScript** (strikt)
- **TailwindCSS v4** für Styling
- **Recharts** für Diagramme
- **Zustand** für State Management
- **sysinfo** für Systemdaten

Open Source unter MIT Lizenz auf [GitHub](https://github.com/XSaitoKungX/System-Monitor).`,
      en: `## System Monitor

A modern, open source desktop app for real-time monitoring of all key system resources. Built as a lightweight replacement for Task Manager, htop and btop.

### Features

- **Dashboard**: Glassmorphism overview with live cards for all metrics
- **CPU**: Per-core usage, clock speed, temperature and history chart
- **GPU**: VRAM, load, temperature via sysfs (Linux) and WMI (Windows)
- **Network**: Upload/download speed, per-interface statistics
- **Speedtest**: Built-in via Cloudflare — ping, jitter, down- and upload
- **Processes**: Live list with kill functionality
- **System Tray**: Minimizes to tray, fully controllable from tray menu
- **Auto-Update**: Automatic update check via GitHub Releases
- **Themes**: Default, Dark, Light, Space, Dev

### Tech Stack

- **Tauri v2** + **Rust** as backend
- **React 18** + **TypeScript** (strict)
- **TailwindCSS v4** for styling
- **Recharts** for charts
- **Zustand** for state management
- **sysinfo** for system data

Open source under MIT license on [GitHub](https://github.com/XSaitoKungX/System-Monitor).`,
    },
    tags: ["Desktop", "Linux", "Windows", "Mac", "Open Source"],
    labels: ["Desktop", "Tauri", "Rust", "Open Source"],
    stack: ["Tauri v2", "Rust", "React", "TypeScript", "TailwindCSS"],
    category: "system",
    status: "launched",
    featured: true,
    year: 2025,
    github: "https://github.com/XSaitoKungX/System-Monitor",
    demo: "https://xsaitox.dev/en/system-monitor",
  },
  {
    id: "startup-manager",
    slug: "startup-manager",
    title: "Startup Manager",
    description: {
      de: "Autostart-Apps verwalten, einfacher & schöner als Terminal.",
      en: "Manage autostart apps, easier & nicer than terminal.",
    },
    tags: ["Desktop", "Linux", "Windows"],
    labels: ["Desktop", "Linux", "Windows"],
    stack: ["Electron", "Node.js", "Bash"],
    category: "system",
    status: "planning",
    featured: false,
    year: 2025,
  },
  {
    id: "file-watcher",
    slug: "file-watcher",
    title: "File Watcher",
    description: {
      de: "Ordner überwachen, bei Änderungen Scripts automatisch ausführen.",
      en: "Watch folders, auto-run scripts on changes.",
    },
    tags: ["Desktop", "Linux"],
    labels: ["Desktop", "Linux"],
    stack: ["Electron", "Node.js"],
    category: "system",
    status: "planning",
    featured: false,
    year: 2025,
  },



  // ⚡ Utility / Fun
  {
    id: "password-generator",
    slug: "password-generator",
    title: "Password Generator",
    description: {
      de: "Kryptografisch sichere Passwörter direkt im Browser — kein Server, kein Tracking, keine Datenübertragung.",
      en: "Cryptographically secure password generator that runs entirely in the browser — no server, no tracking, no data sent.",
    },
    tags: ["Web", "Tool", "Security"],
    labels: ["Web", "Security", "Tool"],
    stack: ["Next.js", "TypeScript", "Web Crypto API", "Tailwind CSS"],
    category: "utility",
    status: "launched",
    demo: "https://xsaitox.dev/en/tools/password-generator",
    featured: false,
    year: 2025,
  },

  {
    id: "project-tracker",
    slug: "project-tracker",
    title: "Project Tracker",
    description: {
      de: "Launched / Planning / Completed Projekte verwalten & mit Portfolio-Website synchronisieren.",
      en: "Manage Launched / Planning / Completed projects & sync with portfolio website.",
    },
    tags: ["Desktop", "Mobile", "Web"],
    labels: ["Desktop", "Mobile", "Web"],
    stack: ["Electron", "React Native", "Node.js"],
    category: "utility",
    status: "incoming",
    featured: false,
    year: 2025,
  },
];
