# Full-Stack Portfolio

A modern, production-ready portfolio built with **Next.js 16**, **TypeScript**, **Tailwind CSS v4**, **Better Auth**, **Prisma 7**, **Neon PostgreSQL**, and **Bun**.

## Features

- ⚡ **Next.js 16** with Turbopack & App Router
- 🔐 **Better Auth** with Discord OAuth
- 🌍 **i18n** — Deutsch & English (next-intl)
- 💾 **Neon PostgreSQL** via **Prisma 7**
- 📧 **Nodemailer** SMTP (Spaceship)
- 🎨 **Tailwind CSS v4** with custom design system
- 🖥️ **Interactive Terminal** in Hero Section
- 📖 **Guestbook** with Discord verification
- 🐳 **Docker-ready** with custom Bun server

## Tech Stack

| Layer     | Technology                  |
|-----------|-----------------------------|
| Framework | Next.js 16 (App Router)     |
| Language  | TypeScript 5                |
| Runtime   | Bun                         |
| Styling   | Tailwind CSS v4             |
| Auth      | Better Auth (Discord OAuth) |
| Database  | Neon PostgreSQL             |
| ORM       | Prisma 7                    |
| Email     | Nodemailer (SMTP)           |
| Animations| Framer Motion               |
| Icons     | React Icons                 |
| Validation| Zod                         |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (v1.2+)
- Neon PostgreSQL database
- Discord OAuth app
- SMTP credentials (Spaceship, Gmail, etc.)

### Installation

```bash
# Clone the repo
git clone https://github.com/XSaitoKungX/Advanced-Portfolio.git
cd Advanced-Portfolio

# Install dependencies
bun install

# Setup environment
cp .env.example .env
# Edit .env with your credentials

# Database setup
bunx prisma db push
bunx prisma generate

# Run dev server
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

```env
# App
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

# Auth (Better Auth)
BETTER_AUTH_SECRET=your_secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret

# Database (Neon)
DATABASE_URL=postgresql://user:pass@endpoint-pooler.region.neon.tech/db?sslmode=require
DIRECT_URL=postgresql://user:pass@endpoint.region.neon.tech/db?sslmode=require

# Email (SMTP)
SMTP_HOST=mail.spacemail.com
SMTP_PORT=465
SMTP_USER=your@email.com
SMTP_PASS=your_password
CONTACT_EMAIL=your@email.com

# Optional: GitHub API Token (higher rate limits)
GITHUB_TOKEN=ghp_xxxx
```

## Available Scripts

| Command                | Description                    |
|------------------------|--------------------------------|
| `bun dev`              | Development server (Turbopack) |
| `bun run build`        | Production build               |
| `bun start:prod`       | Production server with Bun     |
| `bunx prisma db push`  | Push schema to database        |
| `bunx prisma generate` | Generate Prisma client         |

## Project Structure

```markdown
├── prisma/           # Prisma schema
├── src/
│   ├── app/          # Next.js App Router
│   │   ├── [locale]/ # i18n routes (de, en)
│   │   ├── api/      # API routes
│   │   └── ...
│   ├── components/   # React components
│   ├── lib/          # Utilities (auth, prisma, i18n)
│   ├── i18n/         # Translations
│   └── generated/    # Prisma client (generated)
├── .github/          # GitHub Actions
├── index.ts          # Bun production server
└── package.json
```

## Key Features

### 🖥️ Terminal Hero

Interactive terminal in the hero section with commands like `help`, `projects`, `skills`, `about`, `whoami`, `ping`, `date`, `stack`, `clear`.

### 📖 Guestbook

Visitors can leave messages. Discord login = verified badge. Stored in PostgreSQL via Prisma.

### 🔐 Admin Area

Protected admin dashboard accessible only to the owner (Discord ID whitelist).

### 📧 Contact Form

Working contact form with rate limiting, honeypot spam protection, and SMTP delivery.

### 🌐 i18n

Full internationalization with German and English translations.

## Deployment

### Self-Hosted (Recommended)

```bash
# Server setup
git clone <repo>
cd Advanced-Portfolio

# Environment
nano .env  # Add your production env vars

# Install & build
bun install
bunx prisma db push
bun run build

# Start with Bun
bun run start:prod
```

### Docker

```dockerfile
FROM oven/bun:1
WORKDIR /app
COPY . .
RUN bun install && bun run build
EXPOSE 3000
CMD ["bun", "run", "start:prod"]
```

## GitHub Actions

- **CI/CD** — Build & type-check on push/PR
- **CodeQL** — Security scanning
- **Dependabot** — Auto dependency updates
- **Release** — Auto-tagging & changelog

## License

MIT © Mark

---

Built with ❤️ using Next.js, Bun, and Neon.
