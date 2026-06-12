# AGENTS.md - v-mapkit.js Monorepo Guide

> **For AI Coding Assistants (Claude Code, Cursor, Copilot, OpenCode, etc.)**
> This is the canonical agent guide for the v-mapkit.js monorepo. `CLAUDE.md` is a symlink to this file so Claude Code finds it under its expected name — there is only one source of truth.
>
> Humans should start at [`README.md`](./README.md). Agents should read this first, then navigate to the appropriate sub-project guide.

---

## Monorepo Overview

**v-mapkit.js** is a monorepo for Vue 3 components that wrap Apple MapKit JS — the core library plus a Nuxt 4 showcase site ("shadcn-vue for Apple Maps") and a Docus API docs site.

| Package/App            | Description                                         | Guide                                                                |
| ---------------------- | --------------------------------------------------- | -------------------------------------------------------------------- |
| `packages/v-mapkit.js` | Core Vue 3 component library (`@geoql/v-mapkit.js`) | [`packages/v-mapkit.js/AGENTS.md`](./packages/v-mapkit.js/AGENTS.md) |
| `apps/mapkit-cn`       | Showcase site with live examples (Nuxt 4)           | [`apps/mapkit-cn/AGENTS.md`](./apps/mapkit-cn/AGENTS.md)             |
| `apps/docs`            | API documentation (Docus)                           | [`apps/docs/AGENTS.md`](./apps/docs/AGENTS.md)                       |

---

## Quick Navigation

**What are you working on?**

| Task                                | Read This Guide                  |
| ----------------------------------- | -------------------------------- |
| Adding/modifying Vue map components | `packages/v-mapkit.js/AGENTS.md` |
| Adding examples or showcase pages   | `apps/mapkit-cn/AGENTS.md`       |
| Writing API documentation           | `apps/docs/AGENTS.md`            |

---

## Skills (Project-Pinned AI Guidance)

This monorepo leans on a mix of in-repo and workspace-level skills. The only **in-repo** skill is [`apps/mapkit-cn/.agents/skills/mapkit-cn-design`](./apps/mapkit-cn/.agents/skills/mapkit-cn-design/SKILL.md) (pins the Apple / Modern-Minimal direction for the showcase). The generic `vue-best-practices` and `nuxt-best-practices` skills are provided by the agent host and apply per the matrix below. Load the relevant skill **before** writing code. Loading an irrelevant skill costs nothing; missing the relevant one produces measurably worse output.

### Priority Rule (NON-NEGOTIABLE)

**Per-package `AGENTS.md` ALWAYS takes precedence over generic skills when they conflict.**

Skills are GENERIC (they apply to many Vue/Nuxt projects). Per-package `AGENTS.md` files are PROJECT-SPECIFIC (they encode this codebase's actual conventions). Each `AGENTS.md` documents its **Known Conflicts** with the loaded skills as an explicit table — read that section first, before applying generic skill advice.

| Package                | Conflicts Table                                                                                                                                            |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/v-mapkit.js` | [Known Conflicts](./packages/v-mapkit.js/AGENTS.md#known-conflicts-agentsmd-wins) — inject over props / `useMapChild` lifecycle / `shallowRef` for the map |
| `apps/mapkit-cn`       | [Known Conflicts](./apps/mapkit-cn/AGENTS.md#known-conflicts-agentsmd-wins) — Apple direction pinned, semantic tokens only, Geist only, shadcn-vue inputs  |
| `apps/docs`            | [Known Conflicts](./apps/docs/AGENTS.md#known-conflicts-agentsmd-wins) — Docus owns the theme, content (Markdown) only                                     |

| Skill                 | When to Load                                                                                                                                        |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mapkit-cn-design`    | Any visual work in `apps/mapkit-cn` — pins the Apple / Modern-Minimal direction, token contract, font stack (Geist + Geist Mono), and the ban-list. |
| `nuxt-best-practices` | Any Nuxt 3/4 work in `apps/mapkit-cn` or `apps/docs` — data fetching, server routes, auto-imports, rendering modes, type organization.              |
| `vue-best-practices`  | Any Vue 3 component / composable / reactivity / Composition-API work in any package or app.                                                         |

### Per-Package Skill Matrix

| Package / App          | Skills to Load (in order)                                                                      |
| ---------------------- | ---------------------------------------------------------------------------------------------- |
| `packages/v-mapkit.js` | `vue-best-practices`                                                                           |
| `apps/mapkit-cn`       | `mapkit-cn-design` (FIRST, for any visual work) → `nuxt-best-practices` → `vue-best-practices` |
| `apps/docs`            | `nuxt-best-practices` (Markdown content needs no skill)                                        |

### Decision Tree

```
You receive a task. Before writing code:

1. Which directory does it touch?
   ├── packages/v-mapkit.js       → load `vue-best-practices`
   ├── apps/mapkit-cn
   │   ├── any visual work?       → load `mapkit-cn-design` FIRST (mandatory)
   │   ├── then Nuxt-specific?    → load `nuxt-best-practices`
   │   └── Vue component / hook?  → load `vue-best-practices`
   └── apps/docs
       ├── content / Docus only?  → no skill required (Markdown only)
       └── Nuxt config?           → load `nuxt-best-practices`

2. Read the package's AGENTS.md for conventions, file structure, "no-no" list.

3. Then write code.
```

---

## Monorepo Structure

```
v-mapkit.js/
├── packages/
│   └── v-mapkit.js/          # Core library (@geoql/v-mapkit.js on npm + jsr)
│       ├── src/
│       │   ├── components/   # One folder per component (VMap, VMarkerAnnotation, …)
│       │   ├── composables/  # use-map-kit, use-map-child, use-search, …
│       │   ├── constants/    # MapKit event-name groups
│       │   ├── types/        # Shared types + mapkit-augment.d.ts
│       │   ├── symbols.ts    # provide/inject InjectionKeys
│       │   ├── install.ts    # Vue plugin (global registration)
│       │   └── index.ts      # Public barrel export
│       └── test/             # Vitest specs + mapkit-mock
│
├── apps/
│   ├── mapkit-cn/            # Nuxt 4 showcase site ("shadcn-vue for Apple Maps")
│   │   ├── app/              # Frontend (pages, components, composables)
│   │   └── app/server/       # Registry API route (/r/[name])
│   │
│   └── docs/                 # Docus documentation site
│       └── content/          # API reference Markdown
│
├── package.json             # pnpm workspaces root
├── pnpm-workspace.yaml       # Workspace globs (packages/*, apps/*)
├── pnpm-lock.yaml
├── release-please-config.json   # Automated release config
├── AGENTS.md                # This file (canonical)
└── CLAUDE.md                # Symlink → AGENTS.md
```

---

## Global Conventions

### Package Manager: pnpm v11

This monorepo uses **pnpm v11** with workspaces (`packageManager: pnpm@11.5.3`, Node `>=24`). All three projects share a single lockfile and install in one command. No Bun, no npm, no yarn.

```bash
# Install all dependencies
pnpm install
```

### Workspace Commands

Run from the repo root:

```bash
# Development
pnpm run dev:lib    # Watch/dev for @geoql/v-mapkit.js
pnpm run dev:app    # Start the mapkit-cn showcase site
pnpm run dev:docs   # Start the Docus docs site

# Build
pnpm run build      # Build library + showcase + docs (in order)
pnpm run build:app  # Build showcase only
pnpm run build:docs # Build docs only

# Test (library only — apps have no unit tests)
pnpm run test
pnpm run test:coverage

# Lint & Format (recursive across all workspaces)
pnpm run lint          # pnpm -r run lint
pnpm run format        # pnpm -r run format
pnpm run format:check  # pnpm -r run format:check

# Maintenance
pnpm run update:deps   # pnpm dlx taze -I -r
pnpm run clean         # Remove node_modules + build artifacts
```

### Cross-Package Dependencies

```
apps/mapkit-cn ──depends on──> packages/v-mapkit.js (workspace:*)
apps/docs ──────workspace member (own deps, no cross-package link)
```

### Dependency Versions

There are **no pnpm catalogs** in this repo. Each `package.json` pins its own real semver. Use `workspace:*` only for internal monorepo references (e.g. `apps/mapkit-cn` → `@geoql/v-mapkit.js`). The published library (`packages/v-mapkit.js`) is consumed by `npm`/`yarn`/`jsr` users who do not understand pnpm protocols, so its dependency blocks MUST stay real semver — see the library guide.

---

## Hard Constraints (Apply Everywhere)

These override per-package rules. Violating any of these = wasted work.

| #   | Constraint                                                                                                                                             | Why                                                              |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| 1   | **TypeScript only.** No `.js` files except configs.                                                                                                    | Type safety, autocompletion                                      |
| 2   | **No `any` type.** Use `unknown` + narrowing, or precise MapKit types.                                                                                 | Prevents silent failures                                         |
| 3   | **Vue 3 Composition API only** (`<script setup lang="ts">`). No Options API.                                                                           | Tree-shaking, type inference                                     |
| 4   | **pnpm v11 only.** No Bun, no npm, no yarn for development.                                                                                            | Reliable CI/CD                                                   |
| 5   | **100-line maximum per component/file.** Extract logic into composables to stay under it. Hard rule, every package.                                    | Readability, single responsibility, testability                  |
| 6   | **`workspace:*`** only for internal package refs; real semver everywhere else (no catalogs exist).                                                     | Avoid version mismatch + keep the published library installable  |
| 7   | **NEVER** introduce Inter, Plus Jakarta Sans, Space Grotesk, gradient-text, or raw Tailwind color utilities (`bg-blue-500`, etc.) in `apps/mapkit-cn`. | The pinned Apple / Modern-Minimal design discipline forbids them |
| 8   | **Use the MapKit toolchain truthfully.** Lint/format/pack via `vite-plus` (`vp lint`, `vp fmt`, `vp pack`) — not standalone eslint/prettier/vite.      | The library build pipeline is owned by vite-plus                 |

---

## The 100-Line Rule (House Rule, Repeated Because It Matters)

**No single component or file should exceed ~100 lines of code.** When a file grows past that:

1. **Extract a composable** — move imperative MapKit lifecycle, search/geocode logic, or state into `composables/use-*.ts`.
2. **Split into sub-components** in the same feature folder.
3. **Move constants and option tables** out of the `.vue`/`.ts` body into a composable or `constants/`.

This is enforced in both the library and the showcase. The library already models it: `VMap.vue` delegates MapKit boot to `use-map-kit.ts`, and every annotation/overlay delegates its create/update/remove lifecycle to `use-map-child.ts`.

---

## Release Workflow

Releases are automated with **release-please** (`release-please-config.json`, `.release-please-manifest.json`, `.github/workflows/release-please.yml`). Conventional-commit history drives version bumps and changelog generation; merging the release PR tags the version and the pipeline publishes `@geoql/v-mapkit.js` to **both npm and jsr**. Do not hand-edit version numbers or run a manual `npm publish`.

---

## Getting Started

1. **Clone and install:**

   ```bash
   git clone https://github.com/geoql/v-mapkit.js.git
   cd v-mapkit.js
   pnpm install   # all three workspace projects in one shot
   ```

2. **Start development:**

   ```bash
   pnpm run dev:lib   # If working on the library
   pnpm run dev:app   # If working on the showcase
   ```

3. **Read the appropriate guide** based on what you're working on (see Quick Navigation above).

---

Made with care by GeoQL.
