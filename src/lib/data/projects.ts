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
      de: "Multifunktionaler Discord Bot — aktuell auf 100+ Servern. Weitere Invites pending (Discord Verifizierung ausstehend).",
      en: "Multi-functional Discord bot — currently on 100+ servers. More invites pending (Discord verification in progress).",
    },
    longDescription: {
      de: `## Astra Bot

Astra ist mein bisher größtes und ambitioniertestes Projekt: ein vollständig selbst entwickelter Discord-Bot, der aktuell in über **100 Servern** aktiv ist.

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

Astra is my largest and most ambitious project: a fully self-built Discord bot currently active in over **100 servers**.

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
    id: "astra-v3",
    slug: "astra-v3",
    title: "Astra Bot v3",
    description: {
      de: "Komplette Neuentwicklung von Astra mit modularer Architektur, eigenem Dashboard und verbesserter Skalierbarkeit.",
      en: "Full rewrite of Astra with a modular architecture, dedicated dashboard and improved scalability.",
    },
    longDescription: {
      de: `## Astra Bot v3

Version 3 ist eine vollständige Neuentwicklung von Astra – mit einem cleanen Architektur-Ansatz von Grund auf.

### Geplante Verbesserungen

- Komplett modulares Plugin-System
- Eigenes Web-Dashboard für Server-Admins
- Verbesserte Performance und Fehlerbehandlung
- REST-API für externe Integrationen
- Umfangreiches Logging und Monitoring

### Ziel

Astra v3 soll die solide Basis von v2 nehmen und daraus ein robustes, wartbares System machen – mit klarer Trennung von Concerns und professioneller Codequalität.`,
      en: `## Astra Bot v3

Version 3 is a complete rewrite of Astra – built from the ground up with a clean architectural approach.

### Planned Improvements

- Fully modular plugin system
- Dedicated web dashboard for server admins
- Improved performance and error handling
- REST API for external integrations
- Comprehensive logging and monitoring

### Goal

Astra v3 takes the solid foundation of v2 and turns it into a robust, maintainable system – with clear separation of concerns and professional code quality.`,
    },
    tags: ["Node.js", "TypeScript", "Discord.js", "Next.js", "PostgreSQL", "Docker"],
    labels: ["Discord", "Bot", "Dashboard"],
    stack: ["Node.js", "TypeScript", "Discord.js", "Next.js", "PostgreSQL"],
    category: "discord",
    status: "planning",
    featured: true,
    year: 2025,
  },

  // 🛠️ Developer Tools
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
      de: "CPU, RAM, GPU live überwachen — Glassmorphism-Dashboard.",
      en: "Monitor CPU, RAM, GPU live — glassmorphism dashboard.",
    },
    tags: ["Desktop", "Linux", "Windows"],
    labels: ["Desktop", "Linux", "Windows"],
    stack: ["Electron", "Node.js", "Chart.js"],
    category: "system",
    status: "planning",
    featured: false,
    year: 2025,
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
