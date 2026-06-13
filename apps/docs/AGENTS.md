# AGENTS.md - v-mapkit Documentation Guide

> **For AI Coding Assistants (Claude Code, Cursor, Copilot, etc.)**
> This file helps AI agents understand the codebase architecture, conventions, and best practices for the v-mapkit documentation site.

---

## Project Overview

**v-mapkit docs** is the documentation site for the `v-mapkit` library. It is a custom Nuxt 4 app (NOT Docus) — `@nuxt/content` for Markdown, `shadcn-nuxt` + Tailwind CSS v4 for the UI, and the pinned **Apple / Modern-Minimal** design (shared with `apps/mapkit-cn`). It provides guides and reference for the Vue 3 Apple MapKit JS components.

### Key Capabilities

- **Guides**: Installation, usage, and getting started
- **Component Documentation**: Annotations, overlays, controls, services, Look Around
- **Custom Apple-styled theme**: own layout, hero, sidebar, prose — matching the showcase

---

## Skills Integration & Priority

This app owns its theme, so the design skill now applies (unlike the old Docus setup):

| Skill                       | When to Load                                                                                                       |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `mapkit-cn-design`          | **Any visual work** — CSS, layout, components, hero. Pins the Apple direction + token contract. Repo root: [`.agents/skills/mapkit-cn-design/SKILL.md`](../../.agents/skills/mapkit-cn-design/SKILL.md). |
| `nuxt-best-practices`       | Nuxt config / data loading (`queryCollection`) / Nitro / server routes                                             |
| `nuxt-seo-best-practices`   | SEO / OG images / Cloudflare config / JSON-LD                                                                      |
| `vue-best-practices`        | Custom Vue components / composables / reactivity                                                                   |

**Priority rule: This AGENTS.md ALWAYS takes precedence over generic skills when they conflict.**

### Known Conflicts (AGENTS.md wins)

| Skill Says                                                              | AGENTS.md Says (Use This)                                                                                          |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Use the generic `design-discipline` directions catalog                  | **Apple / Modern-Minimal is pinned** — same token contract as `apps/mapkit-cn`. Semantic tokens only, Geist only.  |
| Use Tech Utility (sharp 8px, borders-only) direction                    | **No.** Soft radii (`rounded-lg`/`xl`), layered shadows, backdrop-blur chrome. MapKit is Apple's — match it.        |
| Raw Tailwind color utilities (`bg-blue-500`, `text-emerald-500`)        | **Forbidden.** Only semantic tokens (`bg-primary`, `text-success`, `text-warning`, `text-destructive`).            |
| Inter / Plus Jakarta / Space Grotesk / `font-serif`                     | **Forbidden.** ONE family — `Geist` (sans) + `Geist Mono` (mono), via `@nuxt/fonts`.                               |
| Pure `#000` / `#fff` in dark mode                                       | **Forbidden.** Dark background is `oklch(0.15 ...)`. (Light-mode white canvas is the Apple exception.)             |

---

## Architecture

- **Framework**: Nuxt 4 (custom app — NOT Docus)
- **Content**: `@nuxt/content` v3 (`queryCollection('content')`) backed by Cloudflare D1 (binding `DB`, database `v-mapkit-docs-db`)
- **UI**: `shadcn-nuxt` (reka-ui) + Tailwind CSS v4 (`@nuxtjs/tailwindcss`)
- **Fonts**: `@nuxt/fonts` — Geist + Geist Mono (Google provider)
- **Color mode**: `@nuxtjs/color-mode` (`preference: system`, fallback dark)
- **Deployment**: Cloudflare Pages (project `v-mapkit-docs`), `cloudflare-pages` Nitro preset
- **Analytics**: `@nuxtjs/plausible` (`v-mapkit.geoql.in`)
- **Lint**: `oxlint` (run `pnpm lint`)

## Project Structure

```
apps/docs/
├── app/
│   ├── assets/css/main.css       # Tailwind v4 entry + Apple design tokens
│   ├── components/
│   │   ├── content/              # Alert, Callout, Card, CardGroup, CodeGroup, ProsePre
│   │   ├── docs/PageFooter.vue    # prev/next + edit/report
│   │   ├── layout/                # Header (glass), Sidebar, Footer
│   │   └── ui/button/             # shadcn-vue Button
│   ├── composables/               # use-docs-navigation, use-page-seo, use-theme-toggle
│   ├── layouts/default.vue        # Header + Sidebar + Footer shell
│   ├── lib/utils.ts               # cn() helper
│   ├── pages/
│   │   ├── index.vue              # Apple-hero homepage (layout: false)
│   │   └── [...slug].vue          # Markdown doc page via ContentRenderer
│   ├── types/                     # NavItem, NavSection
│   └── app.vue
├── content/                       # Markdown docs (guide/*)
├── nuxt.config.ts                 # Nuxt + Nitro/Cloudflare (D1) + fonts + plausible + shadcn
├── components.json                # shadcn-vue config
└── package.json
```

## Conventions

1. **Markdown for docs content; Vue for chrome.** Author docs as Markdown under `content/` (rendered by `[...slug].vue` via `<ContentRenderer>`). The theme (layout, hero, prose) is custom Vue — edit it directly.
2. **Sidebar nav is manual.** Add new doc pages to the `sections` array in `app/composables/use-docs-navigation.ts`.
3. **Semantic tokens only.** All colors via `bg-*`/`text-*` semantic tokens in `app/assets/css/main.css`. Never raw Tailwind colors or hardcoded `oklch()`.
4. **100-line rule.** `.vue` files stay under ~100 lines — extract sub-components (the layout is split into Header/Sidebar/Footer for this reason).
5. **D1 binding is required.** The `DB` binding feeds the content database in production; do not remove it from `nuxt.config.ts` wrangler config.
6. **No standalone wrangler.json.** Cloudflare config is inlined in `nuxt.config.ts` under `nitro.cloudflare.wrangler` (matches the `apps/mapkit-cn` convention).
7. **Dependency versions via catalog.** `package.json` references `catalog:app:docs` / `catalog:default` — versions live in `pnpm-workspace.yaml`. Never hard-code.
8. **postinstall runs `nuxt prepare`.** Requires `enable-pre-post-scripts=true` in `.npmrc`.
9. **Composables are kebab-case files.** Name composable files `use-x.ts` (e.g. `use-docs-navigation.ts`), exports stay camelCase (`useDocsNavigation`). This matches the reference docs apps (tileserver-rs/geolith) and the library — and is the **opposite** of the sibling `apps/mapkit-cn`, whose composables are camelCase files. Do not drift back to camelCase here.

## Commands

```bash
pnpm dev        # local dev server
pnpm build      # production build
pnpm preview    # preview the production build
pnpm typecheck  # nuxt typecheck (vue-tsc)
pnpm lint       # oxlint
```

---

Made with care by GeoQL.
