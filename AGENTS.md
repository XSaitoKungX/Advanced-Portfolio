<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project workflow

- Use Bun 1.4.2, pinned by `packageManager`; keep `bun.lock` synchronized.
- Before submitting changes, run `bun install --frozen-lockfile`, `bun run lint`, `bun run type-check`, and `bun run build`.
- Keep `.env` and production credentials out of Git. Pelican production uses its own stable `BETTER_AUTH_SECRET`; CI uses the separate optional `CI_BETTER_AUTH_SECRET` or its test-only fallback.
- Discord deauthorization cleanup requires `DISCORD_PUBLIC_KEY` and an `APPLICATION_DEAUTHORIZED` webhook configured at the endpoint documented in `README.md`.
- Astra server counts come from the public stats endpoint; preserve the unavailable fallback rather than hardcoding counts.
- Production currently runs in a Hetzner/Pelican container. The Homelab is not public yet; do not deploy without an explicit request.
- Avoid dependency overrides unless no compatible non-override solution exists.
