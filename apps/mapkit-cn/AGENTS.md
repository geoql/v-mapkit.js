# AGENTS.md - mapkit-cn Development Guide

> **For AI Coding Assistants (Claude Code, Cursor, Copilot, etc.)**
> This file helps AI agents understand the codebase architecture, conventions, and best practices for the mapkit-cn showcase site.

---

## Project Overview

**mapkit-cn** is the showcase and documentation site for `v-mapkit` — "shadcn-vue for Apple Maps". It demonstrates beautiful, theme-aware Apple MapKit components for Vue, built on `@geoql/v-mapkit` and styled with Tailwind CSS v4. The site doubles as a shadcn-vue compatible component registry.

### Key Capabilities

- **Component Showcase**: 23 live example pages — one per annotation, overlay, control, and service composable
- **Registry API**: Serves shadcn-vue compatible components at `/r/[name]`
- **Theme Support**: Full dark/light mode with system preference detection (`@nuxtjs/color-mode`)
- **Live Examples**: Interactive Apple MapKit demos with copy-paste code snippets
- **OG Images**: Build-time Open Graph image generation (`nuxt-og-image` + Satori)

---

## Skills Integration & Priority

This app uses **three** skills — one in-repo design skill plus two host-provided Nuxt/Vue skills:

| Skill                | When to Load                                                                       |
| -------------------- | ---------------------------------------------------------------------------------- |
| `mapkit-cn-design`   | **Any visual work** — CSS, components, layouts, marketing surfaces, design assets. Lives at the repo root: [`.agents/skills/mapkit-cn-design/SKILL.md`](../../.agents/skills/mapkit-cn-design/SKILL.md). |
| `nuxt-best-practices`| Nuxt patterns — data fetching, server routes, auto-imports, rendering modes        |
| `vue-best-practices` | Vue components / reactivity / Composition API                                      |

**Priority rule: This AGENTS.md ALWAYS takes precedence over generic skills when they conflict.**

### Known Conflicts (AGENTS.md wins)

| Skill Says                                                                     | AGENTS.md Says (Use This)                                                                                                                                          |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Use generic `design-discipline` directions catalog                             | **Apple / Modern-Minimal direction is pinned** — see [`mapkit-cn-design`](../../.agents/skills/mapkit-cn-design/SKILL.md). No deviation without explicit user override. |
| Use the Tech Utility (Linear-style, sharp 8px, borders-only) direction         | **No.** MapKit is Apple's engine — soft radii (`rounded-lg`/`xl`), layered shadows, and backdrop-blur chrome are required. Sharp/borders-only fights the brand.    |
| Generic Tailwind color utilities (`bg-blue-500`, `text-emerald-500`)           | **Forbidden.** Only semantic tokens (`bg-primary`, `text-success`, `text-warning`, `text-destructive`) defined in `app/assets/css/main.css`.                       |
| `font-display`, `font-serif`, or any Inter / Space Grotesk / Plus Jakarta Sans | **Forbidden.** ONE family only — `Geist` (sans) + `Geist Mono` (mono), loaded via `@nuxt/fonts`.                                                                   |
| Pure `#000` / `#fff` in dark mode                                              | **Forbidden.** Dark background is `oklch(0.15 ...)`, never `#000`. (Light-mode white canvas is the intentional Apple exception.)                                   |
| Gradient-text headlines (`bg-clip-text` + `bg-gradient-to-*`)                  | **Forbidden.** Solid `text-foreground` / `text-primary` + dramatic weight contrast only.                                                                           |
| Standard `<input type="number">` / `<input type="range">` in example UIs       | Use **shadcn-vue `<Input>`** (in `app/components/ui/`) — consistent with the rest of the app.                                                                      |
| Use raw `maplibregl` / raw `mapkit.Map` setup in examples                      | Use the **`@geoql/v-mapkit` Vue wrappers** (`VMap`, `VMarkerAnnotation`, …) — never instantiate MapKit imperatively in a page.                                  |

### What Skills Add (Not in AGENTS.md)

- **`mapkit-cn-design`** — Full OKLch token contract, weight/tracking rules, the Distinctive-Moment catalog, the hero composition rules, and the refusal protocol when a request conflicts with the pinned Apple direction.
- **`nuxt-best-practices`** — Server-route file layout, `useFetch`/`useAsyncData` caching semantics, route grouping, auto-import organization, Nitro config.
- **`vue-best-practices`** — Reactivity (`ref` vs `reactive`, `shallowRef`, `toRaw` for large data), performance (`v-once`, `v-memo`, `defineAsyncComponent`, `KeepAlive`), template hygiene (`v-show` vs `v-if`, `:key`, no `v-if` + `v-for`).

---

## CRITICAL RULES - NEVER VIOLATE THESE

> **STOP AND READ BEFORE WRITING ANY CODE**
>
> These rules are **NON-NEGOTIABLE**.

Hard bans specific to this app (from the pinned Apple direction):

- NO gradient-text headlines — no `bg-clip-text` with `bg-gradient-to-*`.
- NO `font-display` / `font-serif` utilities — one family only (`Geist`).
- NO raw Tailwind color utilities (`bg-blue-*`, `text-emerald-*`, `bg-red-*`). Use semantic tokens (`bg-primary`, `text-success`, `text-warning`, `text-destructive`).
- NO pure `#000` / `#fff` in dark mode.
- NO banned fonts: Inter, Plus Jakarta, Space Grotesk, Roboto, Poppins, Outfit.
- NO raw MapKit instantiation in example pages — always the `@geoql/v-mapkit` wrappers.

### Rule #1: NEVER Define Types/Interfaces Inline

Place shared types in `app/types/`, import via the `~/types/...` alias. Don't inline `interface`/`type` in `.vue` files, composables, or server routes.

```typescript
// WRONG - type in a component
interface MapState { center: [number, number]; }

// CORRECT - app/types/map.ts
export interface MapState {
  center: [number, number];
  zoom: number;
}
// then: import type { MapState } from '~/types/map';
```

### Rule #2: Use @geoql/v-mapkit Components - Not Raw MapKit

```vue
<!-- WRONG - raw MapKit -->
<script setup lang="ts">
  onMounted(() => {
    const map = new mapkit.Map(el);
  });
</script>

<!-- CORRECT - the Vue wrappers -->
<script setup lang="ts">
  import { VMap, VMarkerAnnotation } from '@geoql/v-mapkit';
</script>

<template>
  <VMap :access-token="token">
    <VMarkerAnnotation :coordinates="[37.3349, -122.009]" />
  </VMap>
</template>
```

### Rule #3: Follow Import Paths Strictly

| Alias | Points To    | Use For                                    |
| ----- | ------------ | ------------------------------------------ |
| `~/`  | `app/`       | Frontend code (types, composables, utils)  |
| `@/`  | `app/`       | Alternative to `~/` (both work)            |
| `~~/` | Project root | Rarely needed in components                |

```typescript
// CORRECT
import type { MapState } from '~/types/map';
import { useMapDemo } from '~/composables/useMapDemo';
import { cn } from '~/lib/utils';

// WRONG - relative cross-directory paths
import type { MapState } from '../../../types/map';
```

### Rule #4: Use Icons via @nuxt/icon - No Inline SVGs

```vue
<!-- WRONG -->
<svg xmlns="http://www.w3.org/2000/svg" class="size-4">…</svg>

<!-- CORRECT -->
<Icon name="lucide:map" class="size-4" />
<Icon name="simple-icons:apple" class="size-4" />
```

Available sets: `lucide:*` (general, primary) and `simple-icons:*` (brand) — provided by `@iconify-json/lucide` and `@iconify-json/simple-icons`.

### Rule #5: Use `size-*` for Square Elements

```vue
<!-- WRONG -->
<Icon name="lucide:check" class="w-4 h-4" />
<!-- CORRECT -->
<Icon name="lucide:check" class="size-4" />
```

### Rule #6: Follow shadcn-vue Component Patterns

UI primitives live in `app/components/ui/` (configured via `shadcn-nuxt`, no prefix). The folder is the namespace; files are PascalCase; Nuxt auto-imports them.

```
app/components/ui/
├── badge/
├── button/
├── card/
└── input/
```

### Rule #7: No `any` Type - Ever

Use a precise type, or `unknown` + a type guard. Never `any`.

### Rule #8: Use VueUse - Don't Reinvent

```typescript
// WRONG - manual matchMedia
// CORRECT
import { useColorMode } from '@vueuse/core';
const { isDark } = useColorMode();
```

`@vueuse/nuxt` is installed, so VueUse composables are auto-imported.

### Rule #9: Prefer `computed` Over `watch`

```typescript
// WRONG
watch(isOpen, (v) => (state.value = v ? 'expanded' : 'collapsed'), { immediate: true });
// CORRECT
const state = computed(() => (isOpen.value ? 'expanded' : 'collapsed'));
```

### Rule #10: Composable File Naming Convention

App composables are **camelCase filenames** (matching the existing `app/composables/` — `useMapDemo.ts`, `useMapkitToken.ts`, `useShiki.ts`, `useHighlightedCode.ts`), with camelCase exports.

> Note: this is the **opposite** of the library (`packages/v-mapkit`), whose composable files are kebab-case (`use-map-child.ts`). Match the app's existing convention here — camelCase file + camelCase export.

| File Name           | Export Name      |
| ------------------- | ---------------- |
| `useMapDemo.ts`     | `useMapDemo()`   |
| `useMapkitToken.ts` | `useMapkitToken()` |
| `useShiki.ts`       | `useShiki()`     |

### Rule #11: Component Names Must NOT Duplicate Folder Path

Nuxt auto-imports components using the folder path as prefix. Don't repeat the folder name in the file.

```
# WRONG → auto-imported as ExampleExampleCard
app/components/example/ExampleCard.vue   # only if it duplicated "Example" twice
# CORRECT → ExampleCard, ExampleGalleryCard, ExampleMapContainer
app/components/example/GalleryCard.vue
app/components/example/MapContainer.vue
```

### Rule #12: Vue Components Must Be Under 100 Lines

**`.vue` files should NOT exceed ~100 lines.** When a page grows:

1. **Extract sub-components** into the feature folder (e.g. `app/components/example/`).
2. **Move logic + constants to composables** (`app/composables/useX.ts`).
3. **Move types to `app/types/`.**

```
BEFORE: app/pages/examples/clustering.vue   # 400 lines — TOO LARGE
AFTER:  app/pages/examples/clustering.vue        # ~80 lines (orchestration)
        app/components/example/MapContainer.vue  # live map frame
        app/composables/useMapDemo.ts            # demo state + helpers
        app/types/map.ts                         # shared types
```

### Rule #13: No Inline Arrow Functions in Vue Templates

Extract multi-parameter handlers and accessor functions to named functions in `<script setup>`. Simple single-arg passthroughs (`@click="emit('close')"`) are fine inline.

### Rule #14: NEVER Use Inline `import()` in Type Annotations

Always use top-level `import type` statements — never `import('maplibre-gl').MapOptions` inside an annotation.

### Rule #15: Map Demos Must Support Color Mode

The pinned design is dual-theme. Drive the MapKit `color-scheme` (and any style choices) from `useColorMode()`:

```typescript
const colorMode = useColorMode();
const scheme = computed(() => (colorMode.value === 'dark' ? 'dark' : 'light'));
// <VMap :access-token="token" :color-scheme="scheme" />
```

### Rule #16: Dependency Versions — Use Catalogs

App dependency versions are centralized in **pnpm catalogs** (`pnpm-workspace.yaml`). This `package.json` references them via the `catalog:` protocol — never hard-code a version here. Use `workspace:*` only for the internal library reference. Versions live in two catalogs: `catalog:default` (deps shared with the docs app and root tooling: `nuxt`, `wrangler`, `@nuxtjs/plausible`) and `catalog:app:mapkit-cn` (everything else for this app).

```jsonc
// CORRECT — workspace ref + catalog refs
"dependencies": {
  "@geoql/v-mapkit": "workspace:*",
  "nuxt": "catalog:default",
  "@vueuse/core": "catalog:app:mapkit-cn",
  "reka-ui": "catalog:app:mapkit-cn"
}

// WRONG — hard-coded version (belongs in the catalog)
"dependencies": {
  "reka-ui": "^2.9.10"
}
```

To bump a version, edit the entry in `pnpm-workspace.yaml` (one source of truth for the whole monorepo), then `pnpm install`. The published library (`packages/v-mapkit`) is the **only** exception — it stays on real semver because npm/jsr consumers can't resolve the `catalog:` protocol.

---

## Tech Stack & Architecture

| Concern        | Technology                                              |
| -------------- | ------------------------------------------------------- |
| **Framework**  | Nuxt 4 + Vue 3.5 (Composition API)                      |
| **Maps**       | `@geoql/v-mapkit` (workspace) + Apple MapKit JS      |
| **UI**         | shadcn-nuxt (reka-ui primitives) + Tailwind CSS v4      |
| **Tailwind**   | `@nuxtjs/tailwindcss` v4 + `@tailwindcss/typography`    |
| **Icons**      | `@nuxt/icon` (lucide + simple-icons via Iconify)        |
| **Fonts**      | `@nuxt/fonts` — Geist + Geist Mono (Google provider)    |
| **Color Mode** | `@nuxtjs/color-mode` (`preference: system`, fallback dark) |
| **Code render**| `shiki` (`useShiki` / `useHighlightedCode`)             |
| **OG Images**  | `nuxt-og-image` + `satori` + `@resvg/resvg-wasm`        |
| **Analytics**  | `@nuxtjs/plausible` (`mapkit-cn.geoql.in`)              |
| **Server**     | Nitro — registry route at `app/server/api/r/[name].ts` |
| **Deployment** | Cloudflare Pages (Nitro `cloudflare-pages` preset, project `mapkit-cn`) |

Cloudflare config is **inlined in `nuxt.config.ts`** under `nitro.cloudflare.wrangler` — there is no standalone `wrangler.json`.

---

## Project Structure

```
apps/mapkit-cn/
├── app/
│   ├── assets/css/main.css        # Tailwind v4 entry + all design tokens
│   ├── components/
│   │   ├── example/               # ExampleCard, GalleryCard, MapContainer,
│   │   │                          #   CodeBlock, TokenDialog
│   │   ├── layout/                # Header (glass), Footer
│   │   ├── OgImage/               # OG image templates (Satori)
│   │   └── ui/                    # shadcn-vue primitives (badge, button, card, input)
│   ├── composables/               # useHighlightedCode, useMapDemo, useMapkitToken, useShiki (camelCase files)
│   ├── layouts/                   # default layout
│   ├── lib/utils.ts               # cn() helper
│   ├── pages/
│   │   ├── index.vue              # Homepage (the canonical Apple-hero surface)
│   │   └── examples/              # 23 live example pages (see below)
│   ├── plugins/
│   ├── registry/                  # Registry JSON sources (index, v-map, …)
│   ├── server/api/r/[name].ts     # shadcn-vue registry endpoint
│   └── app.vue
├── nuxt.config.ts                 # Nuxt + Nitro/Cloudflare + fonts + plausible
└── package.json
```

The 23 example pages under `app/pages/examples/` cover the full library surface — `basic-map`, `marker-annotation`, `image-annotation`, `place-annotation`, `custom-annotation`, `annotation-callout`, `clustering`, `circle-overlay`, `polygon-overlay`, `polyline-overlay`, `tile-overlay`, `look-around`, `look-around-preview`, `fullscreen-control`, `geolocate-control`, `layer-switcher`, `legend`, `search`, `geocoding`, `directions`, `map-types`, `map-configuration`, and `property-toggles`.

---

## Registry API

The site serves a shadcn-vue compatible registry at `/r/[name]`, handled by `app/server/api/r/[name].ts` and backed by the JSON sources in `app/registry/`.

```bash
npx shadcn-vue@latest add https://mapkit-cn.geoql.in/r/v-map
```

| Endpoint               | Description                       |
| ---------------------- | --------------------------------- |
| `/r/v-map`             | Core `VMap` component             |
| `/r/v-marker-annotation` | `VMarkerAnnotation` component    |

Add new registry entries by dropping a JSON file in `app/registry/` and listing it in `app/registry/index.json`.

---

## Map Component Patterns

### Basic Map (color-mode aware)

```vue
<script setup lang="ts">
  import { VMap, VMarkerAnnotation, VControlGeolocate } from '@geoql/v-mapkit';

  const { token } = useMapkitToken();
  const colorMode = useColorMode();
  const scheme = computed(() => (colorMode.value === 'dark' ? 'dark' : 'light'));
</script>

<template>
  <ClientOnly>
    <VMap :access-token="token" :color-scheme="scheme" class="h-[500px] rounded-lg">
      <VMarkerAnnotation :coordinates="[37.3349, -122.009]" :annotation="{ title: 'Apple Park' }" />
      <VControlGeolocate />
    </VMap>
    <template #fallback>
      <div class="h-[500px] bg-muted animate-pulse rounded-lg" />
    </template>
  </ClientOnly>
</template>
```

### Client-Only Rendering

MapKit JS needs the browser (it injects Apple's CDN script and uses WebGL). Wrap maps in `<ClientOnly>` (or use a `.client.vue` component) so SSR doesn't try to boot MapKit on the server.

---

## Example Page Pattern

Each example page is thin orchestration: resolve the token, set up color-mode-aware options, render the live `<VMap>` with the relevant child component, and show a `<CodeBlock>` (or `example/CodeBlock.vue`) with the copy-paste snippet. Heavy state goes in a composable; the page stays under ~100 lines.

---

## Development Commands

```bash
# From this directory
pnpm run dev          # Nuxt dev server (http://localhost:3000)
pnpm run dev:host     # Expose on LAN
pnpm run build        # Production build (.output/)
pnpm run preview      # Preview the production build
pnpm run typecheck    # nuxt typecheck (vue-tsc)

# From monorepo root
pnpm run dev:app      # Start this app
pnpm run build:app    # Build this app
```

---

## Deployment

Cloudflare Pages via the Nitro `cloudflare-pages` preset. Config is inlined in `nuxt.config.ts`:

```typescript
nitro: {
  preset: 'cloudflare-pages',
  cloudflare: {
    deployConfig: true,
    nodeCompat: true,
    wrangler: { name: 'mapkit-cn', compatibility_flags: ['nodejs_compat'] },
  },
}
```

The MapKit token is supplied at runtime via `runtimeConfig.public.mapkitToken` (and the `TokenDialog` lets users paste their own JWT for the live demos). No standalone `wrangler.json`.

---

## AI Assistant Pre-Flight Checklist

Before every code change:

1. **Visual work?** — loaded `mapkit-cn-design`? Apple direction, semantic tokens, Geist only?
2. **Type/interface?** — placed in `app/types/`, imported via `~/types/...`?
3. **Map component?** — `@geoql/v-mapkit` wrappers, not raw MapKit? Color-mode aware? Wrapped in `<ClientOnly>`?
4. **Imports?** — `~/` alias, not `../../../`?
5. **Icon?** — `<Icon name="lucide:..." />`, not inline SVG? `size-*` for squares?
6. **Component?** — shadcn-vue folder structure, under ~100 lines, no template multi-arg arrows?
7. **Composable?** — camelCase file + export (app convention)?
8. **Deps?** — `catalog:` refs (versions in `pnpm-workspace.yaml`), `workspace:*` only for `@geoql/v-mapkit`?

### Preferred Patterns

1. **Load `mapkit-cn-design` first** for any visual change
2. **Use `@geoql/v-mapkit` wrappers** for all map functionality
3. **Support dark/light** via `useColorMode()` + `:color-scheme`
4. **Use VueUse** instead of manual implementations
5. **Keep components small** — extract to composables
6. **Follow shadcn-vue conventions** for UI primitives
7. **`size-*`** for square elements
8. **`computed`** for derived state, not `watch`
9. **Top-level `import type`** — never inline `import()` in types
10. **Named functions** for multi-parameter event handlers

---

Made with care by GeoQL.
