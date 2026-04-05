export type ProjectStatus = "completed" | "in_progress" | "planned";
export type ProjectCategory = "web" | "mobile" | "tool" | "game" | "other";

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: { de: string; en: string };
  longDescription?: { de: string; en: string };
  tags: string[];
  category: ProjectCategory;
  status: ProjectStatus;
  image?: string;
  demo?: string;
  github?: string;
  featured: boolean;
  year: number;
}

export const projects: Project[] = [
  {
    id: "1",
    slug: "astra-bot",
    title: "Astra Bot",
    description: {
      de: "Öffentlicher Discord-Bot in 90+ Servern – mit Moderation, Musik, Custom Commands und einer modernen Web-Präsenz.",
      en: "Public Discord bot active in 90+ servers – featuring moderation, music, custom commands and a modern web presence.",
    },
    longDescription: {
      de: `## Astra Bot\n\nAstra ist mein bisher größtes und ambitioniertestes Projekt: ein vollständig selbst entwickelter Discord-Bot, der aktuell in über **90 Servern** aktiv ist.\n\n### Features\n\n- Moderationskommandos (Ban, Kick, Mute, Warn-System)\n- Musik-Wiedergabe mit Queue-Management\n- Custom Commands pro Server\n- Slash-Command-Support (Discord Interactions API)\n- Konfigurierbares Präfix-System\n- Persistente Datenbank pro Guild\n\n### Tech Stack\n\n- **Node.js** + **Discord.js**\n- **TypeScript** für Typsicherheit\n- **PostgreSQL** für persistente Daten\n- **Prisma** als ORM\n- **Docker** für das Deployment\n\nDie zugehörige Website [astra-bot.app](https://astra-bot.app) wurde mit **Next.js** und **Tailwind CSS** umgesetzt.`,
      en: `## Astra Bot\n\nAstra is my largest and most ambitious project: a fully self-built Discord bot currently active in over **90 servers**.\n\n### Features\n\n- Moderation commands (ban, kick, mute, warn system)\n- Music playback with queue management\n- Per-server custom commands\n- Slash command support (Discord Interactions API)\n- Configurable prefix system\n- Persistent per-guild database\n\n### Tech Stack\n\n- **Node.js** + **Discord.js**\n- **TypeScript** for type safety\n- **PostgreSQL** for persistent data\n- **Prisma** as ORM\n- **Docker** for deployment\n\nThe accompanying website [astra-bot.app](https://astra-bot.app) was built with **Next.js** and **Tailwind CSS**.`,
    },
    tags: ["Node.js", "TypeScript", "Discord.js", "PostgreSQL", "Prisma", "Docker"],
    category: "tool",
    status: "in_progress",
    featured: true,
    year: 2024,
    demo: "https://astra-bot.app",
  },
  {
    id: "2",
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
    category: "tool",
    status: "planned",
    featured: true,
    year: 2025,
  },
  {
    id: "3",
    slug: "portfolio",
    title: "Portfolio Website",
    description: {
      de: "Dieses Portfolio – gebaut mit Next.js 16, TypeScript, Tailwind CSS v4, Better Auth und next-intl.",
      en: "This portfolio – built with Next.js 16, TypeScript, Tailwind CSS v4, Better Auth and next-intl.",
    },
    longDescription: {
      de: `## Portfolio Website\n\nDieses Portfolio ist selbst ein Projekt, auf das ich stolz bin. Es vereint moderne Technologien mit durchdachtem Design.\n\n### Tech Stack\n\n- **Next.js 16** mit App Router\n- **TypeScript** für vollständige Typsicherheit\n- **Tailwind CSS v4** für das Styling\n- **Better Auth** für Discord OAuth Login\n- **Framer Motion** für Animationen\n- **next-intl** für Zweisprachigkeit (DE/EN)\n- **Resend** für das Kontaktformular\n\n### Design\n\nDunkles Space-Thema mit Glassmorphismus, animiertem Sternenhintergrund und einer durchgehend konsistenten visuellen Sprache.`,
      en: `## Portfolio Website\n\nThis portfolio is itself a project I'm proud of – combining modern technology with thoughtful design.\n\n### Tech Stack\n\n- **Next.js 16** with App Router\n- **TypeScript** for full type safety\n- **Tailwind CSS v4** for styling\n- **Better Auth** for Discord OAuth login\n- **Framer Motion** for animations\n- **next-intl** for bilingual support (DE/EN)\n- **Resend** for the contact form\n\n### Design\n\nDark space theme with glassmorphism, animated star background and a consistently clean visual language throughout.`,
    },
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Better Auth", "Framer Motion", "Bun"],
    category: "web",
    status: "completed",
    featured: true,
    year: 2025,
    demo: "https://example.com",
  },
  {
    id: "4",
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
    category: "web",
    status: "planned",
    featured: true,
    year: 2025,
  },
  {
    id: "5",
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
    category: "tool",
    status: "planned",
    featured: false,
    year: 2025,
  },
  {
    id: "6",
    slug: "souls-game",
    title: "Souls-like Game (BBS1)",
    description: {
      de: "Teambasiertes Schul-Projekt: Entwicklung eines Souls-like-Spiels mit Godot Engine und C++ Erweiterungen.",
      en: "Team-based school project: developing a Souls-like game using Godot Engine with C++ extensions.",
    },
    longDescription: {
      de: `## Souls-like Game – BBS1 Teamprojekt\n\nIm Rahmen meiner Ausbildung an der BBS1 entwickle ich gemeinsam mit einem Team ein Souls-like Spiel in der **Godot Engine**.\n\n### Meine Aufgaben\n\n- Architekturentscheidungen und technisches Design\n- Implementierung von Spielmechaniken in **GDScript** und **C++**\n- Kollisions- und Bewegungssystem\n- Teamkoordination und Code Reviews\n\n### Was ich mitnehme\n\nDas Projekt vermittelt neben technischen Fähigkeiten auch echte Teamarbeit: gemeinsame Entscheidungen, Konflikte lösen, und ein gemeinsames Ziel verfolgen.`,
      en: `## Souls-like Game – BBS1 Team Project\n\nAs part of my apprenticeship at BBS1, I'm collaborating with a team to build a Souls-like game in the **Godot Engine**.\n\n### My Responsibilities\n\n- Architecture decisions and technical design\n- Implementing game mechanics in **GDScript** and **C++**\n- Collision and movement systems\n- Team coordination and code reviews\n\n### What I'm Taking Away\n\nBeyond technical skills, this project teaches real teamwork: making shared decisions, resolving disagreements and working towards a common goal.`,
    },
    tags: ["Godot", "GDScript", "C++", "Game Dev", "Teamwork"],
    category: "game",
    status: "in_progress",
    featured: false,
    year: 2025,
  },
];
