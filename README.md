# Citadel Cinema

A Next.js (App Router, TypeScript) recreation of the Citadel Cinema design
prototype: a homepage with a dynamic movie hero (backdrop crossfade, rating
ring, Now Playing / Upcoming carousel) and an About page with scroll-snap,
word-reveal sections.

## Getting started

```bash
npm install
cp .env.local.example .env.local
```

Then fill in `TMDB_API_TOKEN` in `.env.local` with a TMDB **API Read Access
Token (v4 auth)** — get one for free at
https://www.themoviedb.org/settings/api. It's used server-side only (in the
`/api/tmdb/*` route handlers) and is never sent to the browser.

```bash
npm run dev
```

Open http://localhost:3000.

## Structure

- `src/app/page.tsx` — home page (hero + carousel)
- `src/app/about/page.tsx` — about page (scroll-snap sections)
- `src/app/api/tmdb/*` — server-side route handlers that proxy The Movie
  Database API using `TMDB_API_TOKEN`
- `src/components/` — shared UI (header, fullscreen nav menu, footer, hero,
  about sections)
- `src/lib/` — TMDB client helpers, types, nav links, about copy

## Build

```bash
npm run build
npm start
```
