# Cherry Phan — Portfolio

Personal portfolio of **Cherry Phan**, product & UX designer at SCAD. *Design with empathy.*

Standalone Next.js 16 / React 19 / TypeScript / Tailwind 4 site. **No database** — the entire site is one JSON file (`content/site-content.json`), validated by a typed schema, edited through a password-gated dashboard, and published by committing to GitHub (which redeploys on Vercel).

## Running it

```bash
npm install
cp .env.example .env.local   # fill in ADMIN_PASSWORD + ADMIN_SESSION_SECRET
npm run dev                  # http://localhost:3000
npm test                     # schema + security unit tests
npm run build                # production build (type-checks everything)
```

## Editing content

Everything a visitor reads lives in `content/site-content.json`, typed by `lib/site-content-schema.ts`. Adding a project = adding a JSON object; no code changes.

Two ways to edit:
1. **The dashboard** — `/dashboard` (password login). In dev it writes the JSON to disk; in production with `GITHUB_*` env vars set it commits to GitHub; on Vercel without them it's read-only.
2. **Directly** — edit the JSON; the schema guard fails the build loudly if the shape breaks.

Section visibility (which pages appear in the nav) is the `visibleSections` array, togglable from the dashboard. `creative` and `play` are built but hidden at launch; they still render if visited directly.

## Env vars

See [.env.example](.env.example) — `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, and optionally `GITHUB_TOKEN` / `GITHUB_REPO_OWNER` / `GITHUB_REPO_NAME` / `GITHUB_CONTENT_BRANCH` / `GITHUB_CONTENT_PATH` for publishing.

## Content TODOs (for Cherry)

Real facts only live in the JSON — these gaps are intentionally left open rather than invented:

- [ ] **Email address** — add to `aboutPage.contactLinks`.
- [ ] **Wally's accent color** — placeholder cornflower in `app/globals.css` (`--accent-wally`, `--grad-wally`).
- [ ] **Tools list** — `aboutPage.tools` is empty; add your real toolkit.
- [ ] **Project imagery** — Aurora deck frames, Everloop screens, Mugmood mockups, Tessera mockups, Wally character sheets. Drop images in `public/` and attach via the dashboard (covers, `previewImages`, and case-study media). Until then, projects render designed gradient/ASCII covers.
- [ ] **Dates** — Cornell CUxD hackathon date; project years other than Everloop (2026).
- [ ] **Headshot** — for the About page / home about teaser.

## Design system

All theming routes through CSS custom properties in `app/globals.css` (colors, per-project accents + gradient stops, fluid type scale, motion tokens). Components reference tokens, never hex. Motif kit lives in `components/motifs/`; ASCII forms are data in `lib/motifs.ts`.

Fonts: Fraunces (display serif), Instrument Sans (body/UI), IBM Plex Mono (meta), Caveat (script accents) — all self-hosted via `next/font`.

`prefers-reduced-motion` is respected everywhere.
