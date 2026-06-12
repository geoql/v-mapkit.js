# AGENTS.md - v-mapkit.js Documentation Guide

> **For AI Coding Assistants (Claude Code, Cursor, Copilot, etc.)**
> This file helps AI agents understand the codebase architecture, conventions, and best practices for the v-mapkit.js documentation site.

---

## Project Overview

**v-mapkit.js docs** is the API documentation site for the `v-mapkit.js` library. Built with Docus (a Nuxt-based documentation theme), it provides comprehensive guides and API reference for Vue 3 Apple MapKit JS components.

### Key Capabilities

- **API Documentation**: Component reference for 18+ map components and 4 composables
- **Getting Started Guides**: Installation and basic usage
- **Component Documentation**: Annotations, overlays, controls, services, Look Around
- **Search**: Built-in documentation search via Docus
- **LLM Support**: `/llms.txt` endpoint for AI agent context

---

## Skills Integration & Priority

This app relies on the workspace-level Nuxt skills from [`.agents/skills/`](../../.agents/skills/) when present:

| Skill                       | When to Load                                          |
| --------------------------- | ----------------------------------------------------- |
| `nuxt-best-practices`       | Nuxt config / data loading / Nitro / server routes    |
| `nuxt-seo-best-practices`   | SEO / OG images / Cloudflare config / JSON-LD         |

`vue-best-practices` is rarely needed (no custom Vue components — Docus owns its theme). `mapkit-cn-design` does **not** apply (Docus owns layout and tokens).

**Priority rule: This AGENTS.md ALWAYS takes precedence over generic skills when they conflict.**

### Known Conflicts (AGENTS.md wins)

| Skill Says                            | AGENTS.md Says (Use This)                                                                                            |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Build custom layouts and components   | **Don't.** Docus owns the theme. Write content (Markdown) only.                                                      |
| Use `useFetch` / `useAsyncData`       | **Docus handles content loading via `@nuxt/content`** + Cloudflare D1 binding (`DB`). Don't add manual fetch layers. |

---

## Architecture

- **Framework**: Nuxt 4 + Docus theme (`extends: ['docus']`)
- **Content**: `@nuxt/content` backed by Cloudflare D1 (binding `DB`, database `v-mapkit-docs-db`)
- **Deployment**: Cloudflare Pages (project `v-mapkit-docs`), `cloudflare-pages` Nitro preset
- **Analytics**: `@nuxtjs/plausible` (`v-mapkit.js.geoql.in`)
- **Lint/Format**: `oxlint` (run `pnpm lint`)

## Conventions

1. **Content only.** Author docs as Markdown under `content/`. Do not hand-roll Vue pages or layouts.
2. **D1 binding is required.** The `DB` binding feeds the content database in production; do not remove it from `nuxt.config.ts` wrangler config.
3. **No standalone wrangler.json.** Cloudflare config is inlined in `nuxt.config.ts` under `nitro.cloudflare.wrangler` (matches the `apps/mapkit-cn` convention).
4. **postinstall runs `nuxt prepare`.** Requires `enable-pre-post-scripts=true` in `.npmrc`.

## Commands

```bash
pnpm dev      # local dev server (docus theme)
pnpm build    # production build → dist/
pnpm preview  # preview the production build
pnpm lint     # oxlint
```

---

Made with care by GeoQL.
