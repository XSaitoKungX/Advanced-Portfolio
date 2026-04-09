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
      de: `## Astra Bot\n\nAstra ist mein bisher größtes und ambitioniertestes Projekt: ein vollständig selbst entwickelter Discord-Bot, der aktuell in über **100 Servern** aktiv ist.\n\n### Features\n\n- Moderationskommandos (Ban, Kick, Mute, Warn-System)\n- Musik-Wiedergabe mit Queue-Management\n- Custom Commands pro Server\n- Slash-Command-Support (Discord Interactions API)\n- Konfigurierbares Präfix-System\n- Persistente Datenbank pro Guild\n\n### Tech Stack\n\n- **Node.js** + **Discord.js**\n- **JavaScript** für schnelle Iteration\n- **PostgreSQL** für persistente Daten\n- **Docker** für das Deployment\n\nDie zugehörige Website [astra-bot.app](https://astra-bot.app) wurde mit **Next.js** und **Tailwind CSS** umgesetzt.`,
      en: `## Astra Bot\n\nAstra is my largest and most ambitious project: a fully self-built Discord bot currently active in over **100 servers**.\n\n### Features\n\n- Moderation commands (ban, kick, mute, warn system)\n- Music playback with queue management\n- Per-server custom commands\n- Slash command support (Discord Interactions API)\n- Configurable prefix system\n- Persistent per-guild database\n\n### Tech Stack\n\n- **Node.js** + **Discord.js**\n- **JavaScript** for rapid iteration\n- **PostgreSQL** for persistent data\n- **Docker** for deployment\n\nThe accompanying website [astra-bot.app](https://astra-bot.app) was built with **Next.js** and **Tailwind CSS**.`,
    },
    tags: ["Discord", "Bot", "Node.js"],
    labels: ["Discord", "Bot"],
    stack: ["JavaScript", "Node.js"],
    category: "discord",
    status: "launched",
    featured: true,
    year: 2025,
    demo: "https://astra-bot.app",
  },
  {
    id: "bot-dashboard",
    slug: "bot-dashboard",
    title: "Discord Bot Dashboard",
    description: {
      de: "GUI für Bot-Management, Live-Logs, Commands ein/ausschalten, Stats.",
      en: "GUI for bot management, live logs, toggle commands, stats.",
    },
    tags: ["Desktop", "Web", "Windows", "Linux"],
    labels: ["Desktop", "Web", "Windows", "Linux"],
    stack: ["Electron", "Node.js", "EJS/HTML", "CSS"],
    category: "discord",
    status: "planning",
    featured: false,
    year: 2025,
  },
  {
    id: "rpc-manager",
    slug: "rpc-manager",
    title: "Discord RPC Manager",
    description: {
      de: "Eigene Rich Presence Profile erstellen & wechseln, Presets speichern.",
      en: "Create & switch custom Rich Presence profiles, save presets.",
    },
    longDescription: {
      de: `## Discord CustomRPC

Ein Desktop-Tool zur Erstellung und Verwaltung von **Discord Rich Presence** Profilen. Zeige deinen Freunden, was du gerade machst — mit custom Images, Text und Timestamps.

### Features

- **Profile erstellen**: Eigene Images, Details, State & Buttons
- **Presets speichern**: Schnelles Wechseln zwischen verschiedenen Status
- **Profile teilen**: Exportiere als Link oder Datei — andere können importieren
- **Live Preview**: Sieh deinen Status, bevor du ihn veröffentlichst
- **Cross-Platform**: Windows (.exe), Linux (.deb), Mac (.dmg)

### Web Version

Die Landing Page auf [xsaitox.dev/discord-customrpc](https://xsaitox.dev/discord-customrpc) bietet:
- Download-Links für alle Plattformen
- Profile Sharing Viewer (\`/share?data=BASE64\`)
- Changelog & FAQ

### Tech Stack

- **Electron** für Desktop-App
- **JavaScript** für schnelle Entwicklung
- **Discord RPC API** für Rich Presence
- **Next.js** für Web-Landingpage`,
      en: `## Discord CustomRPC

A desktop tool for creating and managing **Discord Rich Presence** profiles. Show your friends what you're up to — with custom images, text and timestamps.

### Features

- **Create profiles**: Custom images, details, state & buttons
- **Save presets**: Quickly switch between different statuses
- **Share profiles**: Export as link or file — others can import
- **Live preview**: See your status before publishing
- **Cross-platform**: Windows (.exe), Linux (.deb), Mac (.dmg)

### Web Version

The landing page at [xsaitox.dev/discord-customrpc](https://xsaitox.dev/discord-customrpc) offers:
- Download links for all platforms
- Profile Sharing Viewer (\`/share?data=BASE64\`)
- Changelog & FAQ

### Tech Stack

- **Electron** for desktop app
- **JavaScript** for rapid development
- **Discord RPC API** for Rich Presence
- **Next.js** for web landing page`,
    },
    tags: ["Desktop", "Windows", "Linux", "Mac"],
    labels: ["Desktop", "Windows", "Linux", "Mac"],
    stack: ["Electron", "JavaScript"],
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
    id: "bot-monitor",
    slug: "bot-monitor",
    title: "Bot Status Monitor",
    description: {
      de: "Uptime, Ping, Push-Alerts wenn Bot offline geht.",
      en: "Uptime, ping, push alerts when bot goes offline.",
    },
    tags: ["Mobile", "iOS", "Android", "Web"],
    labels: ["Mobile", "iOS", "Android", "Web"],
    stack: ["React Native", "Expo", "Node.js"],
    category: "discord",
    status: "planning",
    featured: false,
    year: 2025,
  },

  // 🛠️ Developer Tools
  {
    id: "snippet-manager",
    slug: "snippet-manager",
    title: "Snippet Manager",
    description: {
      de: "Code-Snippets speichern, taggen, suchen — mit Syntax-Highlighting.",
      en: "Save, tag, search code snippets — with syntax highlighting.",
    },
    tags: ["Desktop", "Windows", "Linux", "Mac"],
    labels: ["Desktop", "Windows", "Linux", "Mac"],
    stack: ["Electron", "JavaScript", "SQLite"],
    category: "devtools",
    status: "planning",
    featured: false,
    year: 2025,
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
  {
    id: "api-tester",
    slug: "api-tester",
    title: "API Tester",
    description: {
      de: "Schlanker REST/GraphQL Client — Mini Postman mit Glassmorphism-UI.",
      en: "Lean REST/GraphQL client — mini Postman with glassmorphism UI.",
    },
    tags: ["Web", "Desktop"],
    labels: ["Web", "Desktop"],
    stack: ["Electron", "JavaScript"],
    category: "devtools",
    status: "planning",
    featured: false,
    year: 2025,
  },
  {
    id: "dotfiles-manager",
    slug: "dotfiles-manager",
    title: "Dotfiles Manager",
    description: {
      de: "Hyprland/Ubuntu Configs verwalten, Backup & Sync.",
      en: "Manage Hyprland/Ubuntu configs, backup & sync.",
    },
    tags: ["Desktop", "Linux"],
    labels: ["Desktop", "Linux"],
    stack: ["Electron", "Bash", "Node.js"],
    category: "devtools",
    status: "incoming",
    featured: false,
    year: 2025,
  },
  {
    id: "port-manager",
    slug: "port-manager",
    title: "Port Manager",
    description: {
      de: "Laufende Ports anzeigen, Prozesse killen — schnelles Dev-Tool.",
      en: "Show running ports, kill processes — quick dev tool.",
    },
    tags: ["Desktop", "Linux", "Windows"],
    labels: ["Desktop", "Linux", "Windows"],
    stack: ["Electron", "Node.js"],
    category: "devtools",
    status: "incoming",
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
  {
    id: "hyprland-editor",
    slug: "hyprland-editor",
    title: "Hyprland Config Editor",
    description: {
      de: "GUI für Hyprland-Dotfiles mit Live-Preview von Keybinds & Themes.",
      en: "GUI for Hyprland dotfiles with live preview of keybinds & themes.",
    },
    tags: ["Desktop", "Linux"],
    labels: ["Desktop", "Linux"],
    stack: ["Electron", "Bash"],
    category: "system",
    status: "incoming",
    featured: false,
    year: 2025,
  },

  // 🎨 Kreativ & Design
  {
    id: "glassmorphism-generator",
    slug: "glassmorphism-generator",
    title: "Glassmorphism UI Kit Generator",
    description: {
      de: "CSS/Tailwind Code für Glassmorphism-Komponenten on-demand generieren.",
      en: "Generate CSS/Tailwind code for glassmorphism components on-demand.",
    },
    tags: ["Web"],
    labels: ["Web"],
    stack: ["HTML", "CSS", "JavaScript"],
    category: "creative",
    status: "planning",
    featured: false,
    year: 2025,
  },
  {
    id: "color-palette",
    slug: "color-palette",
    title: "Color Palette Tool",
    description: {
      de: "Paletten erstellen, exportieren — optimiert für Web & App Design.",
      en: "Create, export palettes — optimized for web & app design.",
    },
    tags: ["Web", "Desktop"],
    labels: ["Web", "Desktop"],
    stack: ["JavaScript", "Electron", "Canvas API"],
    category: "creative",
    status: "planning",
    featured: false,
    year: 2025,
  },
  {
    id: "wallpaper-engine",
    slug: "wallpaper-engine",
    title: "Wallpaper Engine (Hyprland)",
    description: {
      de: "Animated Wallpapers für Hyprland mit eigenem Preset-Format.",
      en: "Animated wallpapers for Hyprland with custom preset format.",
    },
    tags: ["Desktop", "Linux"],
    labels: ["Desktop", "Linux"],
    stack: ["Bash", "JavaScript", "Electron"],
    category: "creative",
    status: "incoming",
    featured: false,
    year: 2025,
  },

  // ⚡ Utility / Fun
  {
    id: "pomodoro",
    slug: "pomodoro",
    title: "Pomodoro Timer",
    description: {
      de: "System Tray Timer, minimalistisch, Dev-Focus-Modus mit Task-Tracking.",
      en: "System tray timer, minimalist, dev focus mode with task tracking.",
    },
    tags: ["Desktop", "Mobile", "Windows", "Linux"],
    labels: ["Desktop", "Mobile", "Windows", "Linux"],
    stack: ["Electron", "React Native"],
    category: "utility",
    status: "planning",
    featured: false,
    year: 2025,
  },
  {
    id: "clipboard-manager",
    slug: "clipboard-manager",
    title: "Clipboard Manager",
    description: {
      de: "Clipboard-History mit Suche, Code-freundlich, Pinning von Einträgen.",
      en: "Clipboard history with search, code-friendly, pin entries.",
    },
    tags: ["Desktop", "Linux", "Windows"],
    labels: ["Desktop", "Linux", "Windows"],
    stack: ["Electron", "SQLite", "Node.js"],
    category: "utility",
    status: "planning",
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

  // 🔧 Legacy / Existing Projects
  {
    id: "astra-v3",
    slug: "astra-v3",
    title: "Astra Bot v3",
    description: {
      de: "Komplette Neuentwicklung von Astra mit modularer Architektur, eigenem Dashboard und verbesserter Skalierbarkeit.",
      en: "Full rewrite of Astra with a modular architecture, dedicated dashboard and improved scalability.",
    },
    longDescription: {
      de: `## Astra Bot v3\n\nVersion 3 ist eine vollständige Neuentwicklung von Astra – mit einem cleanen Architektur-Ansatz von Grund auf.\n\n### Geplante Verbesserungen\n\n- Komplett modulares Plugin-System\n- Eigenes Web-Dashboard für Server-Admins\n- Verbesserte Performance und Fehlerbehandlung\n- REST-API für externe Integrationen\n- Umfangreiches Logging und Monitoring\n\n### Ziel\n\nAstra v3 soll die solide Basis von v2 nehmen und daraus ein robustes, wartbares System machen – mit klarer Trennung von Concerns und professioneller Codequalität.`,
      en: `## Astra Bot v3\n\nVersion 3 is a complete rewrite of Astra – built from the ground up with a clean architectural approach.\n\n### Planned Improvements\n\n- Fully modular plugin system\n- Dedicated web dashboard for server admins\n- Improved performance and error handling\n- REST API for external integrations\n- Comprehensive logging and monitoring\n\n### Goal\n\nAstra v3 takes the solid foundation of v2 and turns it into a robust, maintainable system – with clear separation of concerns and professional code quality.`,
    },
    tags: ["Node.js", "TypeScript", "Discord.js", "Next.js", "PostgreSQL", "Docker"],
    labels: ["Discord", "Bot", "Dashboard"],
    stack: ["Node.js", "TypeScript", "Discord.js", "Next.js", "PostgreSQL"],
    category: "discord",
    status: "planning",
    featured: true,
    year: 2025,
  },
  {
    id: "biolink",
    slug: "biolink",
    title: "Biolink Platform",
    description: {
      de: "Eine moderne Link-in-Bio Plattform als Alternative zu Linktree – mit Custom Pages, Analytics und eigenem Theme-System.",
      en: "A modern link-in-bio platform as an alternative to Linktree – with custom pages, analytics and a theme system.",
    },
    longDescription: {
      de: `## Biolink Platform\n\nEin selbst gehostetes Link-in-Bio Tool, das ich als Alternative zu bestehenden Diensten wie Linktree entwickle.\n\n### Geplante Features\n\n- Custom Profilseiten mit eigenem Theme-System\n- Klick-Analytics pro Link\n- Benutzerdefinierte Domains\n- Admin-Dashboard\n- Öffentliche API\n\n### Motivation\n\nViele bestehende Biolink-Dienste sind entweder kostenpflichtig, eingeschränkt oder datenschutzrechtlich bedenklich. Ziel ist eine schlanke, selbst hostbare Alternative.`,
      en: `## Biolink Platform\n\nA self-hosted link-in-bio tool I'm developing as an alternative to existing services like Linktree.\n\n### Planned Features\n\n- Custom profile pages with a theme system\n- Per-link click analytics\n- Custom domains\n- Admin dashboard\n- Public API\n\n### Motivation\n\nMany existing biolink services are either paid, limited or privacy-questionable. The goal is a lean, self-hostable alternative.`,
    },
    tags: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind CSS"],
    labels: ["Web", "SaaS", "Analytics"],
    stack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind CSS"],
    category: "web",
    status: "planning",
    featured: true,
    year: 2025,
  },
  {
    id: "game-hosting-panel",
    slug: "game-hosting-panel",
    title: "Game Hosting Panel",
    description: {
      de: "Self-hosted Game-Server Management Panel mit Echtzeit-Konsole, Ressourcen-Monitoring und Multi-User-Support.",
      en: "Self-hosted game server management panel with real-time console, resource monitoring and multi-user support.",
    },
    longDescription: {
      de: `## Game Hosting Panel\n\nEin eigenes Game-Server-Management-Panel, das ich als Alternative zu Diensten wie Pterodactyl entwickle.\n\n### Geplante Features\n\n- Echtzeit-Konsole per WebSocket\n- CPU/RAM/Netzwerk Monitoring\n- Mehrere Benutzer mit Rollen und Berechtigungen\n- Automatische Backups\n- Unterstützung für Minecraft, CS2, Rust und weitere\n\n### Motivation\n\nExistierende Panels sind oft komplex in der Einrichtung oder zu ressourcenintensiv. Ziel ist ein leichtgewichtiges, gut dokumentiertes Panel für eigene Server.`,
      en: `## Game Hosting Panel\n\nA custom game server management panel I'm developing as an alternative to services like Pterodactyl.\n\n### Planned Features\n\n- Real-time console via WebSocket\n- CPU/RAM/network monitoring\n- Multi-user support with roles and permissions\n- Automated backups\n- Support for Minecraft, CS2, Rust and more\n\n### Motivation\n\nExisting panels are often complex to set up or too resource-heavy. The goal is a lightweight, well-documented panel for personal servers.`,
    },
    tags: ["Node.js", "TypeScript", "WebSocket", "Docker", "Next.js", "PostgreSQL"],
    labels: ["Web", "Panel", "Gaming"],
    stack: ["Node.js", "TypeScript", "WebSocket", "Docker", "Next.js"],
    category: "tool",
    status: "planning",
    featured: false,
    year: 2023,
    demo: "https://panel.novaplex.xyz",
  },

  // Portfolio
  {
    id: "portfolio",
    slug: "portfolio",
    title: "Portfolio Website",
    description: {
      de: "Dieses Portfolio – gebaut mit Next.js 16, TypeScript, Tailwind CSS v4, Better Auth und next-intl.",
      en: "This portfolio – built with Next.js 16, TypeScript, Tailwind CSS v4, Better Auth and next-intl.",
    },
    longDescription: {
      de: `## Portfolio Website\n\nDieses Portfolio ist selbst ein Projekt, auf das ich stolz bin. Es vereint moderne Technologien mit durchdachtem Design.\n\n### Tech Stack\n\n- **Next.js 16** mit App Router\n- **TypeScript** für vollständige Typsicherheit\n- **Tailwind CSS v4** für das Styling\n- **Better Auth** für Discord OAuth Login\n- **Framer Motion** für Animationen\n- **next-intl** für Zweisprachigkeit (DE/EN)\n\n### Design\n\nDunkles Space-Thema mit Glassmorphismus, animiertem Sternenhintergrund und einer durchgehend konsistenten visuellen Sprache.`,
      en: `## Portfolio Website\n\nThis portfolio is itself a project I'm proud of – combining modern technology with thoughtful design.\n\n### Tech Stack\n\n- **Next.js 16** with App Router\n- **TypeScript** for full type safety\n- **Tailwind CSS v4** for styling\n- **Better Auth** for Discord OAuth login\n- **Framer Motion** for animations\n- **next-intl** for bilingual support (DE/EN)\n\n### Design\n\nDark space theme with glassmorphism, animated star background and a consistently clean visual language throughout.`,
    },
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Web"],
    labels: ["Web"],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Better Auth"],
    category: "web",
    status: "completed",
    featured: true,
    year: 2025,
    demo: "https://xsaitox.dev",
  },
];
