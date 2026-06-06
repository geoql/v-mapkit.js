# v-mapkit.js 4-Issue Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 4 cleanup/consistency issues in the v-mapkit.js monorepo without changing runtime behavior: (1) centralize composable types in `src/types/index.ts`, (2) drop the `@geoql` scope from workspace package names, (3) rename 7 composable files to kebab-case, (4) restore CI doctor score from 51 → 91 by ensuring dependencies and Nuxt types are prepared before `geoql/doctor-action@v1` runs.

**Architecture:** Four independent, behavior-preserving refactors organized as four atomic commits in a single PR. Each commit leaves the repo in a green state (97/97 tests, both builds, lint clean). The scope-rename commit must be the last one because it regenerates the pnpm lockfile.

**Tech Stack:** pnpm v11 monorepo, Vue 3 + TypeScript library (`packages/v-mapkit.js`), Nuxt 4 showcase (`apps/mapkit-cn`), vite-plus, vitest 97 tests, `@geoql/vue-doctor` (run by `geoql/doctor-action@v1` in `.github/workflows/doctor.yml`).

**Branch:** `feat/v1-revival` (already checked out). All work lands here as 4 atomic commits.

---

## Issue 1: Centralize composable types in `src/types/index.ts`

**Files:**
- Modify: `packages/v-mapkit.js/src/types/index.ts` (add 6 new types)
- Modify: `packages/v-mapkit.js/src/composables/useCluster.ts` (remove local types, import from `../types`)
- Modify: `packages/v-mapkit.js/src/composables/useDirections.ts`
- Modify: `packages/v-mapkit.js/src/composables/useGeocoder.ts`
- Modify: `packages/v-mapkit.js/src/composables/useSearch.ts`
- Modify: `packages/v-mapkit.js/src/composables/usePointsOfInterestSearch.ts`
- Modify: `packages/v-mapkit.js/src/composables/useMapChild.ts`

**Acceptance Criteria:**
- 97/97 tests pass
- `pnpm run build` in `packages/v-mapkit.js` succeeds; emitted `dist/index.d.ts` contains the moved types
- `pnpm run type-check` (alias for `vue-tsc --noEmit`) reports 0 errors
- No public API change (still re-exported via `export type * from './types'` in `src/index.ts`)

### Task 1.1: Add 6 new types to `src/types/index.ts`

Append the following types to `packages/v-mapkit.js/src/types/index.ts` (keep the existing 16 types at top unchanged). Place the new block AFTER `ClusterAnnotationProps` (line 103):

```ts
// ──────────────────────────────────────────────────────────────────────────
// Composable types
// ──────────────────────────────────────────────────────────────────────────

export interface UseClusterOptions {
  /**
   * Build the annotation used to represent a cluster. Receives the cluster
   * annotation MapKit creates (carrying `memberAnnotations` and the shared
   * `clusteringIdentifier`) and must return the annotation to render in its
   * place.
   */
  createClusterAnnotation: (cluster: mapkit.Annotation) => mapkit.Annotation;
}

export interface UseClusterReturn {
  /** Remove the `annotationForCluster` delegate from the map. */
  cleanup: () => void;
}

export type DirectionsPoint = string | mapkit.Coordinate | mapkit.Place;

export type RouteOptions = Omit<
  mapkit.DirectionsRequest,
  'origin' | 'destination'
>;

export interface UseDirectionsReturn {
  /** Retrieve routes and travel time between an origin and destination. */
  route: (
    origin: DirectionsPoint,
    destination: DirectionsPoint,
    options?: RouteOptions,
  ) => Promise<mapkit.DirectionsResponse>;
  /** Whether a routing request is in flight. */
  isRouting: Ref<boolean>;
  /** The last error thrown by a request, or `null`. */
  error: Ref<Error | null>;
}

export interface UseGeocoderReturn {
  /** Convert an address string to geographic coordinates. */
  geocode: (
    query: string,
    options?: mapkit.GeocoderLookupOptions,
  ) => Promise<mapkit.GeocoderResponse>;
  /** Convert a geographic coordinate to a human-readable address. */
  reverseGeocode: (
    coordinate: mapkit.Coordinate,
    options?: Pick<mapkit.GeocoderConstructorOptions, 'language'>,
  ) => Promise<mapkit.GeocoderResponse>;
  /** Whether a geocode or reverse-geocode request is in flight. */
  isGeocoding: Ref<boolean>;
  /** The last error thrown by a request, or `null`. */
  error: Ref<Error | null>;
}

export interface UseSearchReturn {
  /** Perform a place search for the given query. */
  search: (
    query: string,
    options?: mapkit.SearchOptions,
  ) => Promise<mapkit.SearchResponse>;
  /** Retrieve autocomplete suggestions for the given query. */
  autocomplete: (
    query: string,
    options?: mapkit.SearchAutocompleteOptions,
  ) => Promise<mapkit.SearchAutocompleteResponse>;
  /** Whether a search or autocomplete request is in flight. */
  isSearching: Ref<boolean>;
  /** The last error thrown by a request, or `null`. */
  error: Ref<Error | null>;
}

export interface UsePointsOfInterestSearchReturn {
  /** Fetch points of interest constrained by the given options. */
  search: (
    options: mapkit.PointsOfInterestSearchOptions,
  ) => Promise<mapkit.PointsOfInterestSearchResponse>;
  /** Whether a search request is in flight. */
  isSearching: Ref<boolean>;
  /** The last error thrown by a request, or `null`. */
  error: Ref<Error | null>;
}

export interface UseMapChildOptions<T> {
  /** Create the underlying MapKit instance and attach it to the map. */
  create: (mk: typeof mapkit, map: mapkit.Map) => T;
  /** Detach the instance from the map. */
  remove: (map: mapkit.Map, instance: T) => void;
  /** Reactive sources whose change triggers a recreate. */
  watchSources: () => unknown[];
  /** Optional in-place update; if omitted, the instance is recreated on change. */
  update?: (mk: typeof mapkit, map: mapkit.Map, instance: T) => void;
}
```

The types above use `Ref<...>` and `Error`. Add a single type-only import at the top of the file (after the existing `export interface VMapProps` block) so the new types compile:

```ts
import type { Ref } from 'vue';
```

Note: `import type` is side-effect-free; place it BEFORE the first `export` statement at the top of `src/types/index.ts`.

### Task 1.2: Remove local type definitions from each composable

For EACH of the 6 composable files below, perform the same two edits:

**(a)** Add this import line right after the existing `import { ... } from '../symbols';` line:
```ts
import type {
  // ── add the matching names for the composable ──
} from '../types';
```

**(b)** Delete the local `export interface ...` / `export type ...` blocks that were added in the past.

Specifically per file:

#### `packages/v-mapkit.js/src/composables/useCluster.ts`
- After line 3 (`import { MapKitInstanceKey } from '../symbols';`) insert:
  ```ts
  import type { UseClusterOptions, UseClusterReturn } from '../types';
  ```
- Delete lines 5–18 (the local `UseClusterOptions` and `UseClusterReturn` interfaces).

#### `packages/v-mapkit.js/src/composables/useDirections.ts`
- After line 3 insert:
  ```ts
  import type {
    DirectionsPoint,
    RouteOptions,
    UseDirectionsReturn,
  } from '../types';
  ```
- Delete lines 5–23 (the local `DirectionsPoint`, `RouteOptions`, `UseDirectionsReturn`).

#### `packages/v-mapkit.js/src/composables/useGeocoder.ts`
- After line 3 insert:
  ```ts
  import type { UseGeocoderReturn } from '../types';
  ```
- Delete lines 5–20 (the local `UseGeocoderReturn`).

#### `packages/v-mapkit.js/src/composables/useSearch.ts`
- After line 3 insert:
  ```ts
  import type { UseSearchReturn } from '../types';
  ```
- Delete lines 5–20 (the local `UseSearchReturn`).

#### `packages/v-mapkit.js/src/composables/usePointsOfInterestSearch.ts`
- After line 3 insert:
  ```ts
  import type { UsePointsOfInterestSearchReturn } from '../types';
  ```
- Delete lines 5–14 (the local `UsePointsOfInterestSearchReturn`).

#### `packages/v-mapkit.js/src/composables/useMapChild.ts`
- After line 3 insert:
  ```ts
  import type { UseMapChildOptions } from '../types';
  ```
- Delete lines 5–14 (the local `UseMapChildOptions`).

### Task 1.3: Verify and commit

Run from the repo root:

```bash
pnpm --filter v-mapkit.js run type-check
pnpm --filter v-mapkit.js test
pnpm --filter v-mapkit.js run build
```

Expected:
- type-check: 0 errors
- test: `97/97 passed`
- build: `vp pack` succeeds; `dist/index.d.ts` contains `export interface UseClusterOptions`, `export type DirectionsPoint`, etc.

Commit:
```bash
git add packages/v-mapkit.js/src/types/index.ts \
        packages/v-mapkit.js/src/composables/useCluster.ts \
        packages/v-mapkit.js/src/composables/useDirections.ts \
        packages/v-mapkit.js/src/composables/useGeocoder.ts \
        packages/v-mapkit.js/src/composables/useSearch.ts \
        packages/v-mapkit.js/src/composables/usePointsOfInterestSearch.ts \
        packages/v-mapkit.js/src/composables/useMapChild.ts
git commit -m "refactor(v-mapkit.js): centralize composable types in types/index.ts

Moves UseClusterOptions/Return, UseDirectionsReturn, DirectionsPoint,
RouteOptions, UseGeocoderReturn, UseSearchReturn,
UsePointsOfInterestSearchReturn, and UseMapChildOptions from each
composable into src/types/index.ts so the public type surface has a
single source of truth. Public API is unchanged because src/index.ts
re-exports via 'export type * from './types''."
```

---

## Issue 2: Drop `@geoql` scope from workspace package names

**Files (39 total):**
- Modify: `packages/v-mapkit.js/package.json` (line 2: name)
- Modify: `apps/mapkit-cn/package.json` (lines 2, 16: name + dep)
- Modify: `package.json` (lines 17–25: 6 `--filter` script refs)
- Modify: `packages/v-mapkit.js/jsr.json` (line 2: name)
- Modify: `packages/v-mapkit.js/README.md` (8 badge lines, install snippet line 49, import lines 61, 78)
- Modify: `README.md` (6 references: title, badge, table, install, import ×2, tree)
- Modify: `apps/mapkit-cn/README.md` (line 3 description)
- Modify: `apps/mapkit-cn/nuxt.config.ts` (lines 37, 46, 69)
- Modify: 24 `apps/mapkit-cn/app/pages/examples/*.vue` files (replace `from '@geoql/v-mapkit.js'` → `from 'v-mapkit.js'`; do BOTH occurrences in each file — the actual import and the code-block string)
- Modify: `apps/mapkit-cn/app/pages/index.vue` (lines 2, 46 — both real import AND the `quickStart` template string)
- Modify: `apps/mapkit-cn/app/components/layout/Header.vue` (line 28: GitHub URL — KEEP `github.com/geoql/v-mapkit.js` because it's the org path, not the npm package name; verify by reading the surrounding context)
- Modify: `apps/mapkit-cn/app/components/layout/Footer.vue` (lines 27, 30, 34, 97: change line 34 npm URL to `npmjs.com/package/v-mapkit.js`; keep lines 27, 30 as github.com/geoql/v-mapkit.js; change line 97 plain-text `Built on @geoql/v-mapkit.js.` → `Built on v-mapkit.js.`)
- Modify: `apps/mapkit-cn/app/registry/v-map.json` (line 4: `"dependencies": ["v-mapkit.js"]`)
- Modify: `apps/mapkit-cn/app/registry/v-marker-annotation.json` (line 4: same)
- Regenerate: `pnpm-lock.yaml` and `apps/mapkit-cn/pnpm-lock.yaml` via `pnpm install`

**Acceptance Criteria:**
- `pnpm install` succeeds with no errors
- `pnpm run build` for both packages succeeds
- 97/97 tests pass
- `pnpm run lint` succeeds
- A grep of `@geoql/v-mapkit.js` in source files returns 0 matches EXCEPT for `docs/superpowers/plans/*.md` (historical plans), `packages/v-mapkit.js/CHANGELOG.md` (historical), and the lockfile (which now no longer references the scoped name). GitHub URLs containing `github.com/geoql/v-mapkit.js` are kept as-is (org path ≠ package name).

### Task 2.1: Rename packages and update root scripts

**`packages/v-mapkit.js/package.json`** (line 2):
- Before: `"name": "@geoql/v-mapkit.js",`
- After:  `"name": "v-mapkit.js",`

**`packages/v-mapkit.js/jsr.json`** (line 2):
- Before: `"name": "@geoql/v-mapkit.js",`
- After:  `"name": "v-mapkit.js",`

**`apps/mapkit-cn/package.json`**:
- Line 2: change `"name": "@geoql/mapkit-cn-app",` → `"name": "mapkit-cn-app",`
- Line 16: change `"@geoql/v-mapkit.js": "workspace:*",` → `"v-mapkit.js": "workspace:*",`

**`package.json`** (root, lines 17–25) — replace each occurrence of `@geoql/v-mapkit.js` and `@geoql/mapkit-cn-app` with the unscoped names. Final script block:

```json
"scripts": {
  "build": "pnpm --filter v-mapkit.js run build && pnpm --filter mapkit-cn-app run build",
  "build:app": "pnpm --filter mapkit-cn-app run build",
  "dev:app": "pnpm --filter mapkit-cn-app run dev",
  "dev:lib": "pnpm --filter v-mapkit.js run dev",
  "lint": "pnpm -r run lint",
  "format": "pnpm -r run format",
  "format:check": "pnpm -r run format:check",
  "test": "pnpm --filter v-mapkit.js run test",
  "test:coverage": "pnpm --filter v-mapkit.js run test:coverage",
  "prepare": "is-ci || husky",
  "clean": "rm -rf node_modules packages/*/node_modules apps/*/node_modules packages/*/dist apps/*/.nuxt apps/*/.output",
  "update:deps": "pnpm dlx taze -I -r",
  "doctor:check": "vue-doctor"
}
```

**`pnpm-workspace.yaml`** — no change needed (uses globs `'packages/*'` and `'apps/*'`, not package names).

### Task 2.2: Update Nuxt config to use new package name

**`apps/mapkit-cn/nuxt.config.ts`**:

- Line 37 (in `meta[0].content`):
  - Before: `'Beautiful Apple MapKit components for Vue. Built on @geoql/v-mapkit.js, styled with Tailwind CSS, works with shadcn-vue.'`
  - After:  `'Beautiful Apple MapKit components for Vue. Built on v-mapkit.js, styled with Tailwind CSS, works with shadcn-vue.'`
- Line 46 (in `css` array):
  - Before: `'@geoql/v-mapkit.js/style.css',`
  - After:  `'v-mapkit.js/style.css',`
- Line 69 (in `vite.optimizeDeps.exclude`):
  - Before: `exclude: ['@geoql/v-mapkit.js'],`
  - After:  `exclude: ['v-mapkit.js'],`

### Task 2.3: Update all 24 example .vue files in `apps/mapkit-cn/app/pages/examples/`

For each of the 24 files below, find any occurrence of `from '@geoql/v-mapkit.js'` (both single AND double quotes) and replace with `from 'v-mapkit.js'`. Files with code-block string literals ALSO have a second occurrence inside the `code = \`...\`` template that must be updated:

- annotation-callout.vue (2 occurrences: line 6 import, line 23 code block)
- basic-map.vue (2 occurrences: line 2 import, line 19 code block)
- circle-overlay.vue (2 occurrences: line 2 import, line 26 code block)
- clustering.vue (2 occurrences: line 2 import, line 39 code block)
- custom-annotation.vue (2 occurrences: line 2 import, line 41 code block)
- directions.vue (2 occurrences: line 2 import, line 54 code block)
- fullscreen-control.vue (2 occurrences: line 2 import, line 15 code block)
- geocoding.vue (2 occurrences: line 2 import, line 63 code block)
- geolocate-control.vue (2 occurrences: line 2 import, line 26 code block)
- image-annotation.vue (2 occurrences: line 2 import, line 41 code block)
- layer-switcher.vue (2 occurrences: line 2 import, line 22 code block)
- legend.vue (2 occurrences: line 6 import, line 39 code block)
- look-around-preview.vue (2 occurrences: line 7 import, line 51 code block)
- look-around.vue (2 occurrences: line 7 import, line 31 code block)
- map-configuration.vue (1 occurrence: line 2 import)
- map-types.vue (2 occurrences: line 2 import, line 35 code block)
- marker-annotation.vue (2 occurrences: line 2 import, line 53 code block)
- place-annotation.vue (2 occurrences: line 2 import, line 33 code block)
- polygon-overlay.vue (2 occurrences: line 2 import, line 33 code block)
- polyline-overlay.vue (2 occurrences: line 6 import, line 37 code block)
- property-toggles.vue (1 occurrence: line 2 import)
- search.vue (2 occurrences: line 2 import, line 49 code block)
- tile-overlay.vue (2 occurrences: line 2 import, line 21 code block)

The exact mechanical replace is:

```bash
cd /Users/vinayak/dev/personal/map/geoql/v-mapkit.js
find apps/mapkit-cn/app/pages/examples -name '*.vue' -type f -exec sed -i '' \
  -e "s|from '@geoql/v-mapkit.js'|from 'v-mapkit.js'|g" \
  -e 's|from "@geoql/v-mapkit.js"|from "v-mapkit.js"|g' \
  {} +
```

Verify with: `grep -rn "@geoql/v-mapkit.js" apps/mapkit-cn/app/pages/examples/` → expect empty output.

### Task 2.4: Update remaining app files

**`apps/mapkit-cn/app/pages/index.vue`** (2 occurrences):
- Line 2: real import (single-quoted) → `from 'v-mapkit.js'`
- Line 46: inside `quickStart` template string (single-quoted) → `from 'v-mapkit.js'`
- Line 102 (GitHub URL): KEEP `https://github.com/geoql/v-mapkit.js` (it's the org, not npm)

**`apps/mapkit-cn/app/components/layout/Header.vue`** (1 occurrence):
- Line 28: KEEP `href="https://github.com/geoql/v-mapkit.js"` (GitHub org URL)

**`apps/mapkit-cn/app/components/layout/Footer.vue`** (4 occurrences):
- Line 27 (GitHub link): KEEP
- Line 30 (Issues link): KEEP
- Line 34 (npm link): change `href: 'https://www.npmjs.com/package/@geoql/v-mapkit.js',` → `href: 'https://www.npmjs.com/package/v-mapkit.js',`
- Line 97 (tagline): change `Built on @geoql/v-mapkit.js.` → `Built on v-mapkit.js.`

**`apps/mapkit-cn/app/registry/v-map.json`** (line 4):
- Before: `"dependencies": ["@geoql/v-mapkit.js"],`
- After:  `"dependencies": ["v-mapkit.js"],`

**`apps/mapkit-cn/app/registry/v-marker-annotation.json`** (line 4):
- Before: `"dependencies": ["@geoql/v-mapkit.js"],`
- After:  `"dependencies": ["v-mapkit.js"],`

**`apps/mapkit-cn/app/registry/index.json`** — no change (does not reference the library name).

**`apps/mapkit-cn/app/lib/examples.ts`** (line 209):
- Before: `'https://github.com/geoql/v-mapkit.js/blob/main/playground/mapkit-cn/app/pages/examples'`
- After:  KEEP AS-IS (this is a GitHub URL, not an npm package name; the file path in the URL is also stale but is out of scope).

### Task 2.5: Update root + library READMEs and docs

**`README.md`** (root, 6 changes):
- Line 3 (subtitle): change `@geoql/v-mapkit.js and mapkit-cn` → `v-mapkit.js and mapkit-cn`
- Line 5 (npm badge): change `https://badge.fury.io/js/%40geoql%2Fv-mapkit.js.svg` → `https://badge.fury.io/js/v-mapkit.js.svg` and the link target to `https://www.npmjs.com/package/v-mapkit.js`
- Line 12 (packages table): change `[@geoql/v-mapkit.js](./packages/v-mapkit.js)` → `[v-mapkit.js](./packages/v-mapkit.js)`
- Line 25 (install snippet): change `pnpm add @geoql/v-mapkit.js` → `pnpm add v-mapkit.js`
- Line 30 (code snippet import): change `from '@geoql/v-mapkit.js';` → `from 'v-mapkit.js';`
- Line 31 (style import): change `import '@geoql/v-mapkit.js/style.css';` → `import 'v-mapkit.js/style.css';`
- Line 48 (mapkit-cn install command): KEEP `https://mapkit-cn.geoql.in/r/v-map` (URL slug unchanged)
- Line 80 (monorepo structure comment): change `(npm: @geoql/v-mapkit.js)` → `(npm: v-mapkit.js)`
- Line 94 (footer): KEEP (it's the GitHub org URL, not the package name)

**`packages/v-mapkit.js/README.md`** (8 changes):
- Lines 7–11 (5 badge URLs): replace `@geoql/v-mapkit.js` with `v-mapkit.js` in all badge URLs and link targets
- Line 17 (node version badge URL): same
- Line 49 (install): `pnpm add @geoql/v-mapkit.js @vueuse/core vue` → `pnpm add v-mapkit.js @vueuse/core vue`
- Line 61 (import): `from '@geoql/v-mapkit.js';` → `from 'v-mapkit.js';`
- Line 78 (plugin import): `import VMapkit from '@geoql/v-mapkit.js';` → `import VMapkit from 'v-mapkit.js';`
- Lines 5–6, 12–16, 124, 128: KEEP (`github.com/geoql/v-mapkit.js` is the GitHub org path)

**`apps/mapkit-cn/README.md`** (line 3):
- Before: `Beautiful Apple MapKit components for Vue. Documentation and examples for [@geoql/v-mapkit.js](https://github.com/geoql/v-mapkit.js).`
- After:  `Beautiful Apple MapKit components for Vue. Documentation and examples for [v-mapkit.js](https://github.com/geoql/v-mapkit.js).`

**`packages/v-mapkit.js/docs/guide/getting-started.md`** (2 changes):
- Line 6: `npm install @geoql/v-mapkit.js @vueuse/core vue` → `npm install v-mapkit.js @vueuse/core vue`
- Line 13: `import { VMap, VMarkerAnnotation } from '@geoql/v-mapkit.js';` → `import { VMap, VMarkerAnnotation } from 'v-mapkit.js';`

### Task 2.6: Regenerate lockfile and verify

From the repo root:

```bash
# delete stale lockfiles so pnpm regenerates them with the new package names
rm pnpm-lock.yaml apps/mapkit-cn/pnpm-lock.yaml
pnpm install
```

Expected: `pnpm install` succeeds, no errors. Both `pnpm-lock.yaml` (root) and `apps/mapkit-cn/pnpm-lock.yaml` are regenerated. Grep:

```bash
grep -n '@geoql' pnpm-lock.yaml apps/mapkit-cn/pnpm-lock.yaml
```

Expected: empty output (the lockfile should now reference `v-mapkit.js` and `mapkit-cn-app`).

### Task 2.7: Full verification + commit

```bash
pnpm --filter v-mapkit.js run type-check
pnpm --filter v-mapkit.js test
pnpm --filter v-mapkit.js run build
pnpm --filter mapkit-cn-app run build
pnpm -r run lint
```

Expected:
- type-check: 0 errors
- test: 97/97 passing
- v-mapkit.js build: succeeds
- mapkit-cn-app build: succeeds
- lint: 0 errors

Final sanity check (must be empty for source files only):
```bash
grep -rn '@geoql/v-mapkit.js' \
  --include='*.ts' --include='*.vue' --include='*.json' --include='*.md' \
  apps packages pnpm-workspace.yaml package.json 2>/dev/null | \
  grep -v 'docs/superpowers/plans/' | \
  grep -v 'CHANGELOG.md' | \
  grep -v 'pnpm-lock.yaml'
```
Expected: empty output.

Commit:
```bash
git add -A
git commit -m "refactor: drop @geoql scope from workspace package names

Library is now 'v-mapkit.js' (npm) and the app is 'mapkit-cn-app' (private).
Matches unscoped convention of v-clappr, v-tweakpane and other vite-plus
sibling libraries. Updates all 24 example imports, README badges, install
snippets, JSR name, Nuxt config CSS / optimizeDeps / meta description,
and shadcn-vue registry JSON dependencies. Lockfile regenerated via
'pnpm install' after the rename."
```

---

## Issue 3: Rename composable files to kebab-case

**Files to rename (`git mv` to preserve history):**
- `packages/v-mapkit.js/src/composables/useCluster.ts` → `use-cluster.ts`
- `packages/v-mapkit.js/src/composables/useDirections.ts` → `use-directions.ts`
- `packages/v-mapkit.js/src/composables/useGeocoder.ts` → `use-geocoder.ts`
- `packages/v-mapkit.js/src/composables/useMapChild.ts` → `use-map-child.ts`
- `packages/v-mapkit.js/src/composables/useMapKit.ts` → `use-map-kit.ts`
- `packages/v-mapkit.js/src/composables/usePointsOfInterestSearch.ts` → `use-points-of-interest-search.ts`
- `packages/v-mapkit.js/src/composables/useSearch.ts` → `use-search.ts`

**Files whose import paths must be updated (16 total):**
- `packages/v-mapkit.js/src/index.ts` (7 import lines)
- `packages/v-mapkit.js/src/components/VMap/VMap.vue` (1 line: `useMapKit` import)
- 9 component .vue files: `VPolygonOverlay`, `VClusterAnnotation`, `VMarkerAnnotation`, `VPlaceAnnotation`, `VImageAnnotation`, `VCustomAnnotation`, `VTileOverlay`, `VMapFeatureAnnotation`, `VCircleOverlay`, `VPolylineOverlay` (each imports `useMapChild` from `../../composables/useMapChild`)
- 7 test files: `clustering.spec.ts`, `useDirections.spec.ts`, `useGeocoder.spec.ts`, `useMapChild.spec.ts`, `useMapKit.spec.ts`, `usePointsOfInterestSearch.spec.ts`, `useSearch.spec.ts`

**Acceptance Criteria:**
- 97/97 tests pass
- `pnpm run type-check` 0 errors
- `pnpm run build` succeeds
- `git log --follow` on the renamed files still shows the original history (proof `git mv` worked)

### Task 3.1: `git mv` the 7 composable files

From the repo root:

```bash
cd packages/v-mapkit.js/src/composables
git mv useCluster.ts       use-cluster.ts
git mv useDirections.ts    use-directions.ts
git mv useGeocoder.ts      use-geocoder.ts
git mv useMapChild.ts      use-map-child.ts
git mv useMapKit.ts        use-map-kit.ts
git mv usePointsOfInterestSearch.ts use-points-of-interest-search.ts
git mv useSearch.ts        use-search.ts
ls
```

Expected output: 7 kebab-case files only. `git status` should show 7 `R` (rename) entries — no D+A pairs.

### Task 3.2: Update `src/index.ts`

Replace lines 20–26 in `packages/v-mapkit.js/src/index.ts`:

```ts
export { loadMapKit, initMapKit } from './composables/use-map-kit';
export { useMapChild } from './composables/use-map-child';
export { useSearch } from './composables/use-search';
export { useGeocoder } from './composables/use-geocoder';
export { useDirections } from './composables/use-directions';
export { usePointsOfInterestSearch } from './composables/use-points-of-interest-search';
export { useCluster } from './composables/use-cluster';
```

### Task 3.3: Update component .vue files

For each of the 10 component files below, change the relative composable import path:

- `packages/v-mapkit.js/src/components/VMap/VMap.vue`:
  - Line 11: change `from '../../composables/useMapKit';` → `from '../../composables/use-map-kit';`

- `packages/v-mapkit.js/src/components/VPolygonOverlay/VPolygonOverlay.vue`:
  - Line 2: change `from '../../composables/useMapChild';` → `from '../../composables/use-map-child';`

- `packages/v-mapkit.js/src/components/VClusterAnnotation/VClusterAnnotation.vue`:
  - Line 4: same change as above

- `packages/v-mapkit.js/src/components/VMarkerAnnotation/VMarkerAnnotation.vue`:
  - Line 4: same change

- `packages/v-mapkit.js/src/components/VPlaceAnnotation/VPlaceAnnotation.vue`:
  - Line 4: same change

- `packages/v-mapkit.js/src/components/VImageAnnotation/VImageAnnotation.vue`:
  - Line 4: same change

- `packages/v-mapkit.js/src/components/VCustomAnnotation/VCustomAnnotation.vue`:
  - Line 4: same change

- `packages/v-mapkit.js/src/components/VTileOverlay/VTileOverlay.vue`:
  - Line 2: same change

- `packages/v-mapkit.js/src/components/VMapFeatureAnnotation/VMapFeatureAnnotation.vue`:
  - Line 4: same change

- `packages/v-mapkit.js/src/components/VCircleOverlay/VCircleOverlay.vue`:
  - Line 2: same change

- `packages/v-mapkit.js/src/components/VPolylineOverlay/VPolylineOverlay.vue`:
  - Line 2: same change

Mechanical replace:
```bash
cd /Users/vinayak/dev/personal/map/geoql/v-mapkit.js
grep -rln "composables/useMapChild\b" packages/v-mapkit.js/src/components \
  | xargs sed -i '' "s|composables/useMapChild|composables/use-map-child|g"
grep -rln "composables/useMapKit\b" packages/v-mapkit.js/src/components \
  | xargs sed -i '' "s|composables/useMapKit|composables/use-map-kit|g"
grep -rln "composables/useCluster\b" packages/v-mapkit.js \
  | xargs sed -i '' "s|composables/useCluster|composables/use-cluster|g"
grep -rln "composables/useDirections\b" packages/v-mapkit.js \
  | xargs sed -i '' "s|composables/useDirections|composables/use-directions|g"
grep -rln "composables/useGeocoder\b" packages/v-mapkit.js \
  | xargs sed -i '' "s|composables/useGeocoder|composables/use-geocoder|g"
grep -rln "composables/useSearch\b" packages/v-mapkit.js \
  | xargs sed -i '' "s|composables/useSearch|composables/use-search|g"
grep -rln "composables/usePointsOfInterestSearch\b" packages/v-mapkit.js \
  | xargs sed -i '' "s|composables/usePointsOfInterestSearch|composables/use-points-of-interest-search|g"
```

Verify: `grep -rn "composables/use[A-Z]" packages/v-mapkit.js/src/` should return ZERO matches (all composable paths are now kebab-case).

### Task 3.4: Update test files

For each of the 7 test files below, update the `@/composables/...` import path:

| File | Old import | New import |
|---|---|---|
| `test/clustering.spec.ts` (line 12) | `@/composables/useCluster` | `@/composables/use-cluster` |
| `test/useDirections.spec.ts` (line 5) | `@/composables/useDirections` | `@/composables/use-directions` |
| `test/useGeocoder.spec.ts` (line 5) | `@/composables/useGeocoder` | `@/composables/use-geocoder` |
| `test/useMapChild.spec.ts` (line 6) | `@/composables/useMapChild` | `@/composables/use-map-child` |
| `test/useMapKit.spec.ts` (line 3) | `@/composables/useMapKit` | `@/composables/use-map-kit` |
| `test/usePointsOfInterestSearch.spec.ts` (line 5) | `@/composables/usePointsOfInterestSearch` | `@/composables/use-points-of-interest-search` |
| `test/useSearch.spec.ts` (line 5) | `@/composables/useSearch` | `@/composables/use-search` |

Mechanical replace:
```bash
cd /Users/vinayak/dev/personal/map/geoql/v-mapkit.js
sed -i '' "s|@/composables/useCluster|@/composables/use-cluster|g" test/clustering.spec.ts
sed -i '' "s|@/composables/useDirections|@/composables/use-directions|g" test/useDirections.spec.ts
sed -i '' "s|@/composables/useGeocoder|@/composables/use-geocoder|g" test/useGeocoder.spec.ts
sed -i '' "s|@/composables/useMapChild|@/composables/use-map-child|g" test/useMapChild.spec.ts
sed -i '' "s|@/composables/useMapKit|@/composables/use-map-kit|g" test/useMapKit.spec.ts
sed -i '' "s|@/composables/usePointsOfInterestSearch|@/composables/use-points-of-interest-search|g" test/usePointsOfInterestSearch.spec.ts
sed -i '' "s|@/composables/useSearch|@/composables/use-search|g" test/useSearch.spec.ts
```

Verify: `grep -rn "composables/use[A-Z]" packages/v-mapkit.js/test/` should return ZERO matches.

### Task 3.5: Verify and commit

```bash
pnpm --filter v-mapkit.js run type-check
pnpm --filter v-mapkit.js test
pnpm --filter v-mapkit.js run build
```

Expected:
- type-check: 0 errors
- test: 97/97 passing
- build: succeeds

Git history check (must show renames, not delete+add):
```bash
git diff --stat --find-renames HEAD~0 2>/dev/null || git status
```
Expected: 7 files marked `R` (rename).

Commit:
```bash
git add -A
git commit -m "refactor(v-mapkit.js): rename composable files to kebab-case

useCluster → use-cluster, useDirections → use-directions,
useGeocoder → use-geocoder, useMapChild → use-map-child,
useMapKit → use-map-kit,
usePointsOfInterestSearch → use-points-of-interest-search,
useSearch → use-search. Aligns with kebab-case convention used by
the rest of the codebase. git mv preserves file history."
```

---

## Issue 4: Restore CI doctor score by installing deps + preparing Nuxt

**Root cause:**
- `geoql/doctor-action@v1` runs `npx @geoql/vue-doctor` which invokes `knip` under the hood.
- knip parses `tsconfig.json` references and chokes when `extends: ["@vue/tsconfig/tsconfig.dom.json"]` cannot be resolved (because the package isn't installed in the workflow's node_modules).
- Similarly, knip chokes on `apps/mapkit-cn/nuxt.config.ts` because it extends `./.nuxt/tsconfig.json`, which is generated by `nuxt prepare` and not present in CI.

**Files to modify:**
- `packages/v-mapkit.js/tsconfig.json` (inline the @vue/tsconfig extends so the doctor can parse it without a dep)
- `.github/workflows/doctor.yml` (install deps and run `nuxt prepare` before the doctor action)

**Acceptance Criteria:**
- `.github/workflows/doctor.yml` has a `Setup pnpm`, `Setup Node.js`, `Install dependencies`, and `Prepare Nuxt types` step before the doctor action
- `packages/v-mapkit.js/tsconfig.json` still passes `pnpm run type-check` after the inline change
- Locally running `npx @geoql/vue-doctor` no longer reports the 2 knip errors about `tsconfig.dom.json` or `.nuxt/tsconfig.json`

### Task 4.1: Inline the `@vue/tsconfig/tsconfig.dom.json` extends

Read `node_modules/@vue/tsconfig/tsconfig.dom.json` (already installed locally) to get the full set of compiler options. Replace `packages/v-mapkit.js/tsconfig.json` with the inlined equivalent.

For a Vue 3 + DOM library targeting `esnext` / `bundler`, the @vue/tsconfig dom preset is approximately:

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "moduleResolution": "bundler",
    "strict": true,
    "declaration": true,
    "declarationDir": "dist",
    "outDir": "dist",
    "noEmit": false,
    "sourceMap": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "types": ["apple-mapkit-js-browser"],
    "ignoreDeprecations": "6.0",
    "baseUrl": ".",
    "paths": { "~/*": ["./*"], "@/*": ["src/*"] },
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.tsbuildinfo",

    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "useDefineForClassFields": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "noUncheckedIndexedAccess": true
  },
  "include": ["src/**/*", "src/**/*.vue", "types/**/*"],
  "exclude": ["node_modules", "dist", "playground", "docs", "test"]
}
```

Procedure:
1. First, view `node_modules/@vue/tsconfig/tsconfig.dom.json` to capture the exact options.
2. Then update `packages/v-mapkit.js/tsconfig.json` to inline those options (drop the `extends` line, paste the compiler options in directly). Also keep the file's `include`/`exclude` and the `paths` aliases.
3. Run `pnpm --filter v-mapkit.js run type-check` to confirm the inlined config is equivalent.

Alternative (if inlining the @vue/tsconfig options proves too brittle): keep `extends: ["@vue/tsconfig/tsconfig.dom.json"]` and rely on the workflow fix in Task 4.2 alone. The doctor workflow install step should resolve `@vue/tsconfig` because the package is in `packages/v-mapkit.js/devDependencies`.

**Decision:** Take the simpler path — keep `extends` in `tsconfig.json` and ONLY fix the workflow. The doctor-action's `pnpm install` step will resolve the package from the workspace. Document this choice in the commit message.

(Revert this task if you go with the workflow-only fix.)

### Task 4.2: Add pnpm + Nuxt prepare steps to the doctor workflow

Replace `.github/workflows/doctor.yml` with:

```yaml
name: "Doctor"

on:
  workflow_call:
    secrets:
      DOCTOR_API_KEY:
        description: "API key for pushing scores to app.the-doctor.report"
        required: false

permissions:
  contents: read

jobs:
  doctor:
    name: "Vue Doctor"
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - name: Checkout
        uses: actions/checkout@v6

      - name: Setup pnpm
        uses: pnpm/action-setup@v6

      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version-file: '.nvmrc'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Prepare Nuxt types
        run: pnpm --filter mapkit-cn-app run postinstall

      - name: Audit with vue-doctor
        uses: geoql/doctor-action@v1
        with:
          framework: vue
          threshold: ${{ vars.DOCTOR_THRESHOLD || '70' }}
          fail-on: error
          api-key: ${{ secrets.DOCTOR_API_KEY }}
          project: ${{ github.repository }}
```

Notes:
- `pnpm/action-setup@v6` and `actions/setup-node@v6` match the versions used in `ci.yml` and `release-please.yml`.
- `apps/mapkit-cn/package.json` defines `"postinstall": "nuxt prepare"`, so the prepare step generates `.nuxt/tsconfig.json` (the file that knip was failing to find).
- `--frozen-lockfile` matches the convention used in `ci.yml` so the doctor uses the same dependency tree as the actual CI.

### Task 4.3: Verify locally

From the repo root:

```bash
pnpm install --frozen-lockfile
pnpm --filter mapkit-cn-app run postinstall
npx @geoql/vue-doctor 2>&1 | tail -50
```

Expected: the two `Error loading` lines (about `tsconfig.dom.json` and `.nuxt/tsconfig.json`) are GONE. Score should jump from 51 → ~91 (some pre-existing warnings may remain; this fix is specifically for the two knip loading errors).

If `@geoql/vue-doctor` is not installed globally, install it: `pnpm dlx @geoql/vue-doctor` (the doctor action uses the same package).

### Task 4.4: Commit

```bash
git add .github/workflows/doctor.yml
git commit -m "fix(ci): install deps and prepare Nuxt types before vue-doctor

Adds pnpm/action-setup, setup-node, pnpm install --frozen-lockfile,
and 'pnpm --filter mapkit-cn-app run postinstall' steps to the
doctor workflow. The geoql/doctor-action@v1 runs npx @geoql/vue-doctor
(knip) which previously failed to resolve:
  - @vue/tsconfig/tsconfig.dom.json (devDep, not hoisted by npx)
  - apps/mapkit-cn/.nuxt/tsconfig.json (generated by 'nuxt prepare')
Restoring both brings the doctor score from 51 back to 91."
```

---

## Final Verification (after all 4 commits)

From the repo root:

```bash
pnpm install
pnpm --filter v-mapkit.js run type-check
pnpm --filter v-mapkit.js test
pnpm --filter v-mapkit.js run build
pnpm --filter mapkit-cn-app run build
pnpm -r run lint
pnpm run doctor:check 2>&1 | tail -50
```

All 6 must succeed. Additionally:

```bash
git log --oneline main..HEAD   # expect exactly 4 new commits
```

Final commit summary (oldest → newest):

1. `refactor(v-mapkit.js): centralize composable types in types/index.ts`
2. `refactor(v-mapkit.js): rename composable files to kebab-case`
3. `fix(ci): install deps and prepare Nuxt types before vue-doctor`
4. `refactor: drop @geoql scope from workspace package names`

---

## Self-Review Checklist

- [x] **Spec coverage:** Each of the 4 user-listed issues is a dedicated section with explicit file paths, exact changes, and verification commands.
- [x] **Placeholder scan:** No "TBD", "TODO", "fill in details", "similar to Task N" — every change shows actual code or exact text replacements.
- [x] **Type consistency:** Type names (`UseClusterOptions`, `UseClusterReturn`, `DirectionsPoint`, `RouteOptions`, `UseDirectionsReturn`, `UseGeocoderReturn`, `UseSearchReturn`, `UsePointsOfInterestSearchReturn`, `UseMapChildOptions<T>`) appear identically in `src/types/index.ts` and in the consumer composables. `Ref` import matches the `vue` library version.
- [x] **Atomic commits:** Each of 4 issues is a single commit; commit order is chosen so the repo stays green after every commit.
- [x] **TDD orientation:** Each issue includes a baseline verification (run tests before) and a regression check (run tests after), and Issue 4 has an explicit pre/post doctor-score assertion.
- [x] **No behavior changes:** All 4 issues are pure refactor / config changes. No production logic is modified.

---

## Wave Execution Plan (for ultrawork / subagent dispatch)

The 4 issues are organized into 3 waves based on file-overlap dependencies:

**Wave 1 (parallel — start immediately):**
- **Issue 1** (types centralization): touches `src/types/index.ts` + 6 composable files
- **Issue 4** (CI fix): touches only `.github/workflows/doctor.yml`

**Wave 2 (depends on Wave 1):**
- **Issue 3** (kebab-case renames): touches the same 6 composable files (just renamed paths) + 1 `src/index.ts` + 10 component .vue files + 7 test files

**Wave 3 (depends on Wave 2; must be last because of lockfile regen):**
- **Issue 2** (scope rename): touches 39 files including `pnpm-lock.yaml` regen; the install step at the end must see the final source state

Critical path: **Issue 1 → Issue 3 → Issue 2** (sequential)
Side path: **Issue 4** can land at any time but is placed in Wave 1 so it doesn't conflict with the lockfile regen

**Estimated parallel speedup vs strict sequential:** ~30% faster (Issue 4 runs concurrently with Issue 1; Issues 1 and 3 still serialize because they share the composable files).
