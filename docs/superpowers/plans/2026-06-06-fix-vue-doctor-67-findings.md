# Fix All 67 vue-doctor Findings — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: `superpowers:subagent-driven-development` (fresh subagent per task, two-stage review: spec compliance then code quality). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce `@geoql/vue-doctor` findings from **67 → 0** while keeping **97/97 tests passing**, both packages building, and `pnpm run lint` clean.

**Architecture:** Four parallel waves — (1) delete dead code + extract inline objects/arrays in 8 Vue files, (2) discover and fix all 22 `no-useless-escape` issues per file, (3) update `doctor.config.json` to suppress 27 remaining false positives, (4) run 5 verification gates. One atomic commit per logical change.

**Tech Stack:** pnpm v11 monorepo, Vue 3 + TypeScript library (`@geoql/v-mapkit.js`), Nuxt 4 showcase (`@geoql/mapkit-cn-app`), vite-plus (no ESLint config — `eslint/no-useless-escape` comes from vue-doctor's bundled rules), vitest 97 tests, `@geoql/vue-doctor` linter.

---

## Context

| Category                     | Count | Type                                       | Action                                            |
| ---------------------------- | ----- | ------------------------------------------ | ------------------------------------------------- |
| A — Real template perf       | 14    | Warnings (8 files)                         | Refactor: hoist inline objects/arrays to computed |
| B — Dead code                | 3     | Warnings (2 files + 1 devDep)              | Delete / remove                                   |
| C — False positives          | 27    | Warnings (18 unused-export + 9 unused-dep) | Suppress via `doctor.config.json`                 |
| D — eslint/no-useless-escape | 22    | Warnings (code issues)                     | Edit code, remove unnecessary escapes             |
| Info                         | 2     | Info                                       | Accept (e.g., `node_modules` size)                |

### Resolved Ambiguities (from exploration)

1. **Filename mismatch:** Brief said `map-configuration.vue` → actual file is `map-config.vue`. Plan uses correct name.
2. **The 4 `no-computed-getter-in-template-loop` findings are FPs:** `type.value` / `item.value` are object property access on loop items, NOT Vue ref `.value`. Recommend suppressing the rule globally in `doctor.config.json` (the brief suggested hoisting, but the value is already a property, not a ref).
3. **No ESLint config exists** in this monorepo. The 22 `no-useless-escape` warnings come from vue-doctor's bundled ESLint rules. Fix by editing the source code directly.
4. **18 barrel re-exports** are intentional public API (consumed by `src/index.ts` and `src/install.ts` inside the package, plus the 24 example pages in `apps/mapkit-cn/`). Refactoring 18 barrel files to drop the redundant named re-export would touch more code than just suppressing the rule glob.

### Open Questions for User

- **Q1:** Confirm the 4 `no-computed-getter-in-template-loop` warnings should be suppressed (not fixed by refactor). My recommendation: suppress.
- **Q2:** Confirm we use `doctor.config.json` excludes (not refactor) for the 18 barrel `unused-export` FPs and 9 dependency FPs. My recommendation: config excludes.

---

## Task Dependency Graph

| Task                                                  | Depends On           | Reason                                               |
| ----------------------------------------------------- | -------------------- | ---------------------------------------------------- |
| T1.1 Delete `registry.ts`                             | None                 | Independent file delete                              |
| T1.2 Delete `.vitepress/config.ts`                    | None                 | Independent file delete                              |
| T1.3 Remove `sass` from `package.json`                | None                 | Independent devDep removal                           |
| T1.4 `pnpm install` (regenerate lockfile)             | T1.3                 | Lockfile must be regenerated                         |
| T2.1 Fix `clustering.vue`                             | None                 | Independent template refactor                        |
| T2.2 Fix `image-annotation.vue`                       | None                 | Independent template refactor                        |
| T2.3 Fix `legend.vue`                                 | None                 | Independent template refactor                        |
| T2.4 Fix `map-config.vue`                             | None                 | Independent template refactor                        |
| T2.5 Fix `marker-annotation.vue`                      | None                 | Independent template refactor                        |
| T2.6 Fix `place-annotation.vue` (+ `:key`)            | None                 | Independent template refactor                        |
| T2.7 Fix `search.vue`                                 | None                 | Independent template refactor                        |
| T2.8 Fix `index.vue` annotation (homepage)            | None                 | Independent template refactor (separate from T2.10b) |
| T2.9a–T2.9r Drop named export from 18 barrels         | None                 | Each file is independent                             |
| T2.10a Rename `mapTypes[].value` → `id`               | None                 | Independent refactor                                 |
| T2.10b Rename `highlights[].value` → `id`             | None                 | Independent refactor                                 |
| T4.0 Grep for `no-useless-escape` locations           | None                 | Discovery step                                       |
| T4.1–T4.N Fix `no-useless-escape` (1 per file)        | T4.0                 | Need exact file list                                 |
| T3.1 Update `doctor.config.json` (dependency ignores) | T2.9, T2.10 complete | Suppresses only the 9 remaining dep FPs              |
| T5.1–T5.5 Verification gates                          | All above            | Final checks                                         |

---

## Parallel Execution Graph

```
Wave 1 (start immediately — 31 tasks, no deps):
├── T1.1  Delete apps/mapkit-cn/app/server/api/registry.ts
├── T1.2  Delete packages/v-mapkit.js/docs/.vitepress/config.ts
├── T1.3  Remove "sass" from packages/v-mapkit.js/package.json:75
├── T2.1  Fix examples/clustering.vue:76
├── T2.2  Fix examples/image-annotation.vue:60
├── T2.3  Fix examples/legend.vue:57,73
├── T2.4  Fix examples/map-config.vue:63,79,104   ← brief said "map-configuration" — actual is "map-config"
├── T2.5  Fix examples/marker-annotation.vue:72
├── T2.6  Fix examples/place-annotation.vue:63 (+ :key fix)
├── T2.7  Fix examples/search.vue:70,71
├── T2.8  Fix app/pages/index.vue:137
├── T2.9a..r  Drop dead named export from 18 barrel index.ts files (18 parallel tasks)
├── T2.10a Rename mapTypes[].value → id in examples/map-types.vue
├── T2.10b Rename highlights[].value → id in app/pages/index.vue
└── T4.0   Grep for no-useless-escape locations

Wave 2 (after Wave 1 — depends on T1.3 / T4.0):
├── T1.4   pnpm install (lockfile refresh)
├── T3.1   Update doctor.config.json (dependency ignores only)
└── T4.1..N  Fix no-useless-escape in each file (parallel, one task per file — granular commits)

Wave 3 (verification — sequential, all deps complete):
├── T5.1  npx @geoql/vue-doctor → expect 0 findings
├── T5.2  pnpm --filter @geoql/v-mapkit.js run build → expect exit 0
├── T5.3  pnpm --filter @geoql/mapkit-cn-app run build → expect exit 0
├── T5.4  pnpm --filter @geoql/v-mapkit.js test → expect 97/97 pass
└── T5.5  pnpm run lint → expect exit 0

Critical Path: T1.3 → T1.4 → T3.1 → T5.1 → T5.4
Estimated Speedup: 31 tasks in Wave 1 parallelized = ~25× faster than sequential
```

---

## File Structure

### Files to DELETE (2)

- `apps/mapkit-cn/app/server/api/registry.ts` (14 lines, static array, no imports anywhere)
- `packages/v-mapkit.js/docs/.vitepress/config.ts` (18 lines, only references are ignore-glob strings in `vite.config.ts`)

### Files to MODIFY (29 + N)

| Path                                                                 | Reason                                                                                |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `packages/v-mapkit.js/package.json`                                  | Remove `sass` from devDependencies (line 75)                                          |
| `apps/mapkit-cn/app/pages/examples/clustering.vue`                   | Hoist inline `:annotation` object                                                     |
| `apps/mapkit-cn/app/pages/examples/image-annotation.vue`             | Hoist inline `:annotation` object                                                     |
| `apps/mapkit-cn/app/pages/examples/legend.vue`                       | Hoist 2 inline bindings                                                               |
| `apps/mapkit-cn/app/pages/examples/map-config.vue`                   | Hoist inline v-for sources + inline style                                             |
| `apps/mapkit-cn/app/pages/examples/marker-annotation.vue`            | Hoist inline `:annotation` object                                                     |
| `apps/mapkit-cn/app/pages/examples/place-annotation.vue`             | Hoist inline `:annotation` object (+ fix `:key="index"` anti-pattern)                 |
| `apps/mapkit-cn/app/pages/examples/search.vue`                       | Hoist inline array + `:annotation` object                                             |
| `apps/mapkit-cn/app/pages/examples/map-types.vue`                    | Rename `mapTypes[].value` → `id` to fix `no-computed-getter-in-template-loop` FP      |
| `apps/mapkit-cn/app/pages/index.vue`                                 | Hoist inline `:annotation` object + rename `highlights[].value` → `id` to fix same FP |
| `packages/v-mapkit.js/src/components/VAnnotationCallout/index.ts`    | Drop dead named export (FP fix)                                                       |
| `packages/v-mapkit.js/src/components/VCircleOverlay/index.ts`        | Drop dead named export (FP fix)                                                       |
| `packages/v-mapkit.js/src/components/VClusterAnnotation/index.ts`    | Drop dead named export (FP fix)                                                       |
| `packages/v-mapkit.js/src/components/VControlFullscreen/index.ts`    | Drop dead named export (FP fix)                                                       |
| `packages/v-mapkit.js/src/components/VControlGeolocate/index.ts`     | Drop dead named export (FP fix)                                                       |
| `packages/v-mapkit.js/src/components/VControlLayerSwitcher/index.ts` | Drop dead named export (FP fix)                                                       |
| `packages/v-mapkit.js/src/components/VControlLegend/index.ts`        | Drop dead named export (FP fix)                                                       |
| `packages/v-mapkit.js/src/components/VCustomAnnotation/index.ts`     | Drop dead named export (FP fix)                                                       |
| `packages/v-mapkit.js/src/components/VImageAnnotation/index.ts`      | Drop dead named export (FP fix)                                                       |
| `packages/v-mapkit.js/src/components/VLookAround/index.ts`           | Drop dead named export (FP fix)                                                       |
| `packages/v-mapkit.js/src/components/VLookAroundPreview/index.ts`    | Drop dead named export (FP fix)                                                       |
| `packages/v-mapkit.js/src/components/VMap/index.ts`                  | Drop dead named export (FP fix)                                                       |
| `packages/v-mapkit.js/src/components/VMapFeatureAnnotation/index.ts` | Drop dead named export (FP fix)                                                       |
| `packages/v-mapkit.js/src/components/VMarkerAnnotation/index.ts`     | Drop dead named export (FP fix)                                                       |
| `packages/v-mapkit.js/src/components/VPlaceAnnotation/index.ts`      | Drop dead named export (FP fix)                                                       |
| `packages/v-mapkit.js/src/components/VPolygonOverlay/index.ts`       | Drop dead named export (FP fix)                                                       |
| `packages/v-mapkit.js/src/components/VPolylineOverlay/index.ts`      | Drop dead named export (FP fix)                                                       |
| `packages/v-mapkit.js/src/components/VTileOverlay/index.ts`          | Drop dead named export (FP fix)                                                       |
| `doctor.config.json`                                                 | Add ONLY `dependencies.ignore` for the 9 build-time deps (no rule suppressions)       |

Plus the N files identified in T4.0 containing `no-useless-escape` issues (typically 5–10 files, one commit per file).

### Files UNCHANGED (for reference)

- `packages/v-mapkit.js/src/index.ts` — public API entry, unchanged (already imports via default, so barrel change is safe)
- `packages/v-mapkit.js/src/install.ts` — plugin installer, unchanged (also imports via default)

---

## Tasks

### Task T1.1: Delete unused `registry.ts`

**Files:**

- Delete: `apps/mapkit-cn/app/server/api/registry.ts`
- Verify: `rg "server/api/registry" apps/ packages/` returns 0 results (already confirmed)

- [ ] **Step 1: Verify no imports exist**

```bash
rg "server/api/registry" apps/ packages/ 2>&1 | head -20
```

Expected: no matches.

- [ ] **Step 2: Delete the file**

```bash
rm apps/mapkit-cn/app/server/api/registry.ts
```

- [ ] **Step 3: Verify deletion**

```bash
ls apps/mapkit-cn/app/server/api/
```

Expected: only `r/` directory remains.

- [ ] **Step 4: Commit**

```bash
git add -A apps/mapkit-cn/app/server/api/registry.ts
git commit -m "chore(mapkit-cn): remove unused registry.ts API endpoint"
```

**Delegation:**

- Category: `quick` — single file deletion
- Skills: none needed
- TDD orientation: red = file exists, no callers; green = file gone, callers unchanged (none)

---

### Task T1.2: Delete unused `.vitepress/config.ts`

**Files:**

- Delete: `packages/v-mapkit.js/docs/.vitepress/config.ts`

- [ ] **Step 1: Verify no script consumes it**

```bash
rg "vitepress.*config" packages/v-mapkit.js/package.json
```

Expected: no matches (no `docs:*` script that loads config explicitly).

- [ ] **Step 2: Delete the file**

```bash
rm packages/v-mapkit.js/docs/.vitepress/config.ts
```

- [ ] **Step 3: Verify and commit**

```bash
ls packages/v-mapkit.js/docs/.vitepress/
git add -A packages/v-mapkit.js/docs/.vitepress/config.ts
git commit -m "chore(lib): remove unused .vitepress/config.ts"
```

Expected: only `dist/` and `cache/` directories remain (also stale; can be removed if desired).

**Delegation:**

- Category: `quick` — single file deletion
- Skills: none
- TDD orientation: red = file exists unused, green = file gone, no script breaks

---

### Task T1.3: Remove `sass` from devDependencies

**Files:**

- Modify: `packages/v-mapkit.js/package.json:75` (remove `"sass": "^1.99.0",`)

- [ ] **Step 1: Verify `sass` is truly unused**

```bash
rg "from 'sass'|require\('sass'\)" packages/v-mapkit.js/src/ packages/v-mapkit.js/scripts/ 2>&1 | head -20
rg "sass" packages/v-mapkit.js/vite.config.ts 2>&1 | head -5
```

Expected: no matches (or only references in the `docs/.vitepress` ignore patterns).

- [ ] **Step 2: Remove the line from package.json**
      Edit `packages/v-mapkit.js/package.json`, delete line 75:

```diff
   "postcss-html": "^1.8.1",
-  "sass": "^1.99.0",
   "stylelint": "^16.26.1",
```

- [ ] **Step 3: Commit (lockfile will be updated in T1.4)**

```bash
git add packages/v-mapkit.js/package.json
git commit -m "chore(lib): remove unused sass devDependency"
```

**Delegation:**

- Category: `quick` — single-line package.json edit
- Skills: none
- TDD orientation: red = unused dep listed, green = dep removed, build still works

---

### Task T1.4: Regenerate lockfile

**Files:**

- Regenerate: `pnpm-lock.yaml`

- [ ] **Step 1: Run install**

```bash
pnpm install
```

Expected: exits 0; lockfile updated to drop `sass`.

- [ ] **Step 2: Verify build still works**

```bash
pnpm --filter @geoql/v-mapkit.js run build
```

Expected: exit 0.

- [ ] **Step 3: Commit lockfile**

```bash
git add pnpm-lock.yaml
git commit -m "chore: update lockfile after removing sass"
```

**Delegation:**

- Category: `quick` — single command + commit
- Skills: none
- TDD orientation: green = build still passes after lockfile regen

---

### Task T2.1: Fix `clustering.vue` inline object

**Files:**

- Modify: `apps/mapkit-cn/app/pages/examples/clustering.vue:76`

- [ ] **Step 1: Read the current binding** (already known: `:annotation="{ color: '#5e5ce6' }"`)

- [ ] **Step 2: Refactor to a module-level constant**

The color is **static** (literal `'#5e5ce6'`), so hoist to a module-level const in `<script setup>`:

```ts
const CLUSTER_ANNOTATION = { color: "#5e5ce6" } as const;
```

Then change line 76 from:

```vue
:annotation="{ color: '#5e5ce6' }"
```

to:

```vue
:annotation="CLUSTER_ANNOTATION"
```

- [ ] **Step 3: Verify build**

```bash
pnpm --filter @geoql/mapkit-cn-app run build 2>&1 | tail -20
```

Expected: exit 0, no type errors.

- [ ] **Step 4: Commit**

```bash
git add apps/mapkit-cn/app/pages/examples/clustering.vue
git commit -m "refactor(examples/clustering): hoist static annotation to constant"
```

**Delegation:**

- Category: `unspecified-high` — needs to read script setup, decide hoist target, preserve types
- Skills: `vue-best-practices` — for `<script setup>` patterns
- TDD orientation: red = inline object in template creates new ref per render, green = const reference stable, build passes

---

### Task T2.2: Fix `image-annotation.vue` inline object

**Files:**

- Modify: `apps/mapkit-cn/app/pages/examples/image-annotation.vue:60–66`

The inline object is **dynamic** (depends on `marker`). Use a computed `Map<id, annotation>`:

```ts
const annotationByTitle = computed(
  () =>
    new Map(
      markers.map((m) => [
        m.title,
        {
          title: m.title,
          url: { 1: pin(m.color) },
          size: { width: 40, height: 40 },
          anchorOffset: new DOMPoint(0, 0),
        },
      ]),
    ),
);
```

Then change line 60 from:

```vue
:annotation="{ title: marker.title, url: { 1: pin(marker.color) }, size: { width: 40, height: 40 },
anchorOffset: new DOMPoint(0, 0) }"
```

to:

```vue
:annotation="annotationByTitle.get(marker.title)!"
```

- [ ] **Step 1: Refactor as above**
- [ ] **Step 2: Build check**
- [ ] **Step 3: Commit**

```bash
git commit -am "refactor(examples/image-annotation): hoist dynamic annotation to computed map"
```

**Delegation:**

- Category: `unspecified-high` — moderate complexity, need to read markers type
- Skills: `vue-best-practices`
- TDD orientation: red = inline object defeats DOM reuse; green = stable Map reference; build passes

---

### Task T2.3: Fix `legend.vue` 2 inline bindings

**Files:**

- Modify: `apps/mapkit-cn/app/pages/examples/legend.vue:57,73`

Two inline bindings:

- Line 57: `:annotation="{ color: pin.color }"` (dynamic per pin)
- Line 73: `:style="{ backgroundColor: item.color }"` (dynamic per item)

Refactor:

```ts
const pinAnnotationByColor = computed(
  () => new Map(pins.map((p) => [p.color, { color: p.color }])),
);
const legendItemStyleByColor = computed(() => (color: string) => ({ backgroundColor: color }));
```

Replace line 57 with `:annotation="pinAnnotationByColor.get(pin.color)!"`
Replace line 73 with `:style="legendItemStyleByColor(item.color)"`

- [ ] **Steps 1–3: as T2.2**
- [ ] **Commit:**

```bash
git commit -am "refactor(examples/legend): hoist annotation and style to computed getters"
```

**Delegation:** Category `unspecified-high`, Skills `vue-best-practices`

---

### Task T2.4: Fix `map-config.vue` (3 issues)

**Files:**

- Modify: `apps/mapkit-cn/app/pages/examples/map-config.vue:63,79,104`

> **Note:** Brief said `map-configuration.vue` — actual filename is `map-config.vue`.

Three issues:

- Line 63: `v-for="value in (['light', 'dark'] as const)"` (inline v-for source)
- Line 79: `v-for="value in (['automatic', 'metric', 'imperial'] as const)"` (inline v-for source)
- Line 104: `:style="{ backgroundColor: color }"` (inline object binding)

Refactor — hoist to module-level `as const` arrays:

```ts
const COLOR_SCHEMES = ["light", "dark"] as const;
const DISTANCE_UNITS = ["automatic", "metric", "imperial"] as const;
const tintStyle = (color: string) => ({ backgroundColor: color });
```

Replace inline arrays with `COLOR_SCHEMES` and `DISTANCE_UNITS`. Replace line 104 with `:style="tintStyle(color)"`.

- [ ] **Steps 1–3: as T2.2**
- [ ] **Commit:**

```bash
git commit -am "refactor(examples/map-config): hoist inline arrays and style to module-level consts"
```

**Delegation:** Category `unspecified-high`, Skills `vue-best-practices`

---

### Task T2.5: Fix `marker-annotation.vue` inline object

**Files:**

- Modify: `apps/mapkit-cn/app/pages/examples/marker-annotation.vue:72`

The inline object is **dynamic** (uses `marker.title`, `marker.subtitle`, etc.):

```vue
:annotation="{ title: marker.title, subtitle: marker.subtitle, color: marker.color, glyphText:
marker.glyphText, selected: false, }"
```

Refactor to a computed Map:

```ts
const annotationByTitle = computed(
  () =>
    new Map(
      markers.map((m) => [
        m.title,
        {
          title: m.title,
          subtitle: m.subtitle,
          color: m.color,
          glyphText: m.glyphText,
          selected: false,
        },
      ]),
    ),
);
```

Replace binding with `:annotation="annotationByTitle.get(marker.title)!"`.

- [ ] **Steps 1–3: as T2.2**
- [ ] **Commit:**

```bash
git commit -am "refactor(examples/marker-annotation): hoist dynamic annotation to computed map"
```

**Delegation:** Category `unspecified-high`, Skills `vue-best-practices`

---

### Task T2.6: Fix `place-annotation.vue` inline object

**Files:**

- Modify: `apps/mapkit-cn/app/pages/examples/place-annotation.vue:63`

The inline object is dynamic per `place`. Use computed Map:

```ts
const annotationByName = computed(
  () => new Map(results.value.map((p) => [p.name, { title: p.name }])),
);
```

Replace `:annotation="{ title: place.name }"` with `:annotation="annotationByName.get(place.name)!"`.

> **Bonus:** The brief notes `:key="index"` is an anti-pattern. Consider changing to `:key="place.name"` for stable keys (orthogonal to vue-doctor but improves Vue dev warnings).

- [ ] **Steps 1–3: as T2.2**
- [ ] **Commit:**

```bash
git commit -am "refactor(examples/place-annotation): hoist dynamic annotation to computed map"
```

**Delegation:** Category `unspecified-high`, Skills `vue-best-practices`

---

### Task T2.7: Fix `search.vue` inline array + object

**Files:**

- Modify: `apps/mapkit-cn/app/pages/examples/search.vue:70,71`

Two issues:

- Line 70: `:coordinates="[place.coordinate.latitude, place.coordinate.longitude]"` (inline array per item)
- Line 71: `:annotation="{ title: place.name, color: '#0a84ff' }"` (inline object per item)

Refactor:

```ts
const MARKER_COLOR = "#0a84ff";
const coordsByName = computed(
  () =>
    new Map(
      results.value.map((p) => [
        p.name,
        [p.coordinate.latitude, p.coordinate.longitude] as [number, number],
      ]),
    ),
);
const annotationByName = computed(
  () => new Map(results.value.map((p) => [p.name, { title: p.name, color: MARKER_COLOR }])),
);
```

Replace line 70 with `:coordinates="coordsByName.get(place.name)!"`.
Replace line 71 with `:annotation="annotationByName.get(place.name)!"`.

- [ ] **Steps 1–3: as T2.2**
- [ ] **Commit:**

```bash
git commit -am "refactor(examples/search): hoist coordinates array and annotation to computed maps"
```

**Delegation:** Category `unspecified-high`, Skills `vue-best-practices`

---

### Task T2.8: Fix `index.vue` homepage inline object

**Files:**

- Modify: `apps/mapkit-cn/app/pages/index.vue:137`

Line 137: `:annotation="{ title: pin.title, color: '#0a84ff' }"` (dynamic + static color)

Refactor:

```ts
const HERO_COLOR = "#0a84ff";
const heroAnnotationByTitle = computed(
  () => new Map(heroPins.map((p) => [p.title, { title: p.title, color: HERO_COLOR }])),
);
```

Replace line 137 with `:annotation="heroAnnotationByTitle.get(pin.title)!"`.

- [ ] **Steps 1–3: as T2.2**
- [ ] **Commit:**

```bash
git commit -am "refactor(homepage): hoist hero pin annotation to computed map"
```

**Delegation:** Category `unspecified-high`, Skills `vue-best-practices`

---

### Task T2.9: Drop dead named export from 18 barrel `index.ts` files

> **Why:** Each `components/*/index.ts` has the pattern:
>
> ```ts
> export { default } from "./VMap.vue";
> export { default as VMap } from "./VMap.vue";
> ```
>
> The named re-export is consumed by **nothing** — `src/index.ts` and `src/install.ts` both use the default. Dropping the named line eliminates 18 `dead-code/unused-export` FPs at the source.

**Files (one atomic commit per file — 18 total):**

- `packages/v-mapkit.js/src/components/VAnnotationCallout/index.ts`
- `packages/v-mapkit.js/src/components/VCircleOverlay/index.ts`
- `packages/v-mapkit.js/src/components/VClusterAnnotation/index.ts`
- `packages/v-mapkit.js/src/components/VControlFullscreen/index.ts`
- `packages/v-mapkit.js/src/components/VControlGeolocate/index.ts`
- `packages/v-mapkit.js/src/components/VControlLayerSwitcher/index.ts`
- `packages/v-mapkit.js/src/components/VControlLegend/index.ts`
- `packages/v-mapkit.js/src/components/VCustomAnnotation/index.ts`
- `packages/v-mapkit.js/src/components/VImageAnnotation/index.ts`
- `packages/v-mapkit.js/src/components/VLookAround/index.ts`
- `packages/v-mapkit.js/src/components/VLookAroundPreview/index.ts`
- `packages/v-mapkit.js/src/components/VMap/index.ts`
- `packages/v-mapkit.js/src/components/VMapFeatureAnnotation/index.ts`
- `packages/v-mapkit.js/src/components/VMarkerAnnotation/index.ts`
- `packages/v-mapkit.js/src/components/VPlaceAnnotation/index.ts`
- `packages/v-mapkit.js/src/components/VPolygonOverlay/index.ts`
- `packages/v-mapkit.js/src/components/VPolylineOverlay/index.ts`
- `packages/v-mapkit.js/src/components/VTileOverlay/index.ts`

**For each file:**

- [ ] **Step 1: Verify the named export has no consumers**

```bash
rg "from '.*components/VMap'" packages/v-mapkit.js/src/ apps/
```

Expected: only `src/index.ts` (uses `default as VMap`) and `src/install.ts` (uses `import VMap`) — neither consumes the named export.

- [ ] **Step 2: Drop the named re-export**
      Change from:

```ts
export { default } from "./VMap.vue";
export { default as VMap } from "./VMap.vue";
```

to:

```ts
export { default } from "./VMap.vue";
```

- [ ] **Step 3: Verify build + tests still pass**

```bash
pnpm --filter @geoql/v-mapkit.js run type-check
pnpm --filter @geoql/v-mapkit.js test 2>&1 | tail -10
```

Expected: 97/97 still pass.

- [ ] **Step 4: Commit per file (granular)**

```bash
git add packages/v-mapkit.js/src/components/VMap/index.ts
git commit -m "refactor(lib): drop dead named export from VMap barrel"
```

**Delegation:**

- Category: `quick` per file — single-line deletion, no design judgment
- Skills: none
- TDD orientation: red = 18 unused-export FPs; green = 0 unused-export FPs; tests still pass

---

### Task T2.10: Rename `.value` → `.id` in 2 data structures

> **Why:** The 4 `template/no-computed-getter-in-template-loop` findings are FPs from vue-doctor mistaking object property access (`.value` on a loop item) for Vue ref `.value` access. Renaming the field eliminates the false positive without changing behavior.

**Files:**

- Modify: `apps/mapkit-cn/app/pages/examples/map-types.vue` (lines 11–18, 69–70, 78)
- Modify: `apps/mapkit-cn/app/pages/index.vue` (lines 22–43, 184, 194)

**For `map-types.vue` (one atomic commit):**

- [ ] **Step 1: Rename the field in the data structure**
      Change line 11–16 from:

```ts
const mapTypes = [
  { value: "standard", label: "Standard" },
  { value: "mutedStandard", label: "Muted" },
  { value: "hybrid", label: "Hybrid" },
  { value: "satellite", label: "Satellite" },
] as const;
```

to:

```ts
const mapTypes = [
  { id: "standard", label: "Standard" },
  { id: "mutedStandard", label: "Muted" },
  { id: "hybrid", label: "Hybrid" },
  { id: "satellite", label: "Satellite" },
] as const;
```

- [ ] **Step 2: Update the ref type (line 18)**

```diff
-  const active = ref<(typeof mapTypes)[number]['value']>('standard');
+  const active = ref<(typeof mapTypes)[number]['id']>('standard');
```

- [ ] **Step 3: Update template usages (lines 69–70, 78)**
      Replace `type.value` with `type.id` in:
- `:key="type.value"` (line 69)
- `:variant="active === type.value ? 'default' : 'outline'"` (line 70)
- `active.value = type.value` inside `@click` (line 78)

- [ ] **Step 4: Verify build**

```bash
pnpm --filter @geoql/mapkit-cn-app run build 2>&1 | tail -10
```

Expected: exit 0, no type errors.

- [ ] **Step 5: Commit**

```bash
git add apps/mapkit-cn/app/pages/examples/map-types.vue
git commit -m "refactor(examples/map-types): rename mapTypes[].value to id to satisfy vue-doctor"
```

**For `index.vue` (one atomic commit):**

- [ ] **Step 1: Rename the field in `highlights` (lines 22–43)**
      Change all 4 entries from `value: '...'` to `id: '...'`.

- [ ] **Step 2: Update template usages (lines 184, 194)**
      Replace `item.value` with `item.id` in:
- `:key="item.value"` (line 184)
- `{{ item.value }}` (line 194) — also update the displayed text if it's the meaningful field (it is — these are the headline strings)

- [ ] **Step 3: Verify build, commit**
      Same as above.

**Delegation:**

- Category: `unspecified-high` — needs to read full template, update 2-3 places, verify types still resolve
- Skills: `vue-best-practices`
- TDD orientation: red = 4 no-computed-getter FPs; green = 0 FPs; build passes; displayed text unchanged

---

### Task T3.1: Update `doctor.config.json` (dependency ignores only)

> **Why:** After T2.9 and T2.10, the 27 FPs reduce to 9 (the 9 `unused-dependency` FPs). These 9 deps are all build-time / type-only / peer-deps that vue-doctor cannot trace — they CANNOT be fixed in code. The only options are: (a) remove the deps (breaking the build), or (b) tell vue-doctor to ignore them. We pick (b), documenting the reason in a comment in the config.

**Files:**

- Modify: `doctor.config.json` (root)

- [ ] **Step 1: Discover doctor.config.json schema**

```bash
npx @geoql/vue-doctor --help 2>&1 | head -50
npx @geoql/vue-doctor init --help 2>&1 | head -50
```

Look for `dependencies.ignore` / `ignoreDependencies` / similar.

- [ ] **Step 2: Add dependency ignores (NO rule suppressions, NO barrel glob)**

Recommended final config:

```jsonc
{
  "preset": "recommended",
  "exclude": [
    "**/node_modules/**",
    "**/dist/**",
    "**/.nuxt/**",
    "**/.output/**",
    "**/coverage/**",
    "apps/*/app/components/ui/**",
  ],
  "dependencies": {
    // Build-time / type-only / peer-deps that vue-doctor cannot trace through entry points.
    // These are real, used dependencies — they just aren't imported by user-facing code.
    "ignore": [
      "@iconify-json/lucide", // @nuxt/icon build-time icon set
      "@iconify-json/simple-icons", // @nuxt/icon build-time icon set
      "@types/apple-mapkit-js-browser", // TS types for the MapKit JS browser SDK
      "vue-tsc", // Used by `type-check` script
      "@tsdown/css", // vite-plus plugin peer dependency
      "@vue/compiler-sfc", // Used by vitest for SFC compilation
      "@vue/runtime-dom", // Used by test suite (happy-dom is a polyfill; runtime-dom needed for full DOM)
    ],
  },
}
```

Adjust syntax to match the actual schema (e.g., `ignoreDependencies` vs `dependencies.ignore`).

- [ ] **Step 3: Run vue-doctor to verify**

```bash
npx @geoql/vue-doctor 2>&1 | tail -40
```

Expected: only the 22 `eslint/no-useless-escape` warnings remain (Category D — those are real code issues fixed in T4.x). All 9 dependency FPs are gone.

- [ ] **Step 4: Commit**

```bash
git add doctor.config.json
git commit -m "chore(doctor): ignore build-time deps that cannot be traced from source"
```

**Delegation:**

- Category: `unspecified-high` — schema discovery is uncertain
- Skills: none
- TDD orientation: red = 9 unused-dependency FPs; green = 0 FPs after config update

---

### Task T4.0: Discover `no-useless-escape` locations

- [ ] **Step 1: Find all candidates via grep**

```bash
# Look for unnecessary escapes in regex and string literals
rg -n '\\[\$\^\.\*\+\?\(\)\[\]\{\}\|]' packages/v-mapkit.js/src/ apps/mapkit-cn/app/ --type ts --type vue --type js 2>&1 | head -60
# Also try running vue-doctor with --json to get machine-readable output
npx @geoql/vue-doctor --format=json 2>&1 | head -100
```

- [ ] **Step 2: Build the list of files and lines**
      Output: a list of `path:line` pairs grouped by file. One fix task per file (T4.1, T4.2, …).

**Delegation:**

- Category: `quick` — discovery step, grep + parse
- Skills: none
- TDD orientation: red = 22 warnings; green = 0 warnings (verified in T5.1)

---

### Task T4.1..N: Fix `no-useless-escape` per file (granular commits, one per file)

For each file identified in T4.0:

- [ ] **Step 1: Read the exact line and surrounding context**
- [ ] **Step 2: Remove the useless escape**
  - In regex literals: drop the `\` (e.g., `\/` → `/`, `\.` → `.`)
  - In string literals: drop unnecessary `\"` inside `'...'` strings, etc.
- [ ] **Step 3: Try `vp lint --fix` first (auto-fixable)**

```bash
pnpm --filter @geoql/v-mapkit.js run lint:fix 2>&1 | tail -20
```

- [ ] **Step 4: Verify type-check and tests still pass**

```bash
pnpm --filter @geoql/v-mapkit.js run type-check
pnpm --filter @geoql/v-mapkit.js test 2>&1 | tail -10
```

- [ ] **Step 5: Commit per file (MANDATORY granular — one commit per file)**

```bash
git add <single-file>
git commit -m "fix(lint): remove no-useless-escape in <file-path>"
```

**Delegation:**

- Category: `quick` per task — single-line edits, no design judgment
- Skills: none
- TDD orientation: red = vue-doctor reports 22 escapes; green = vue-doctor reports 0 escapes; tests still pass

---

### Task T5.1: Run `vue-doctor` — expect 0 findings

- [ ] **Step 1: Run the linter**

```bash
npx @geoql/vue-doctor 2>&1 | tail -10
```

Expected: `0 errors, 0 warnings, 0 info` (or similar — score should be 100/100).

- [ ] **If non-zero:** Identify the remaining finding, dispatch a fix subagent per the pattern in T2.x or T4.x.

**Delegation:**

- Category: `quick` — single command
- Skills: none
- TDD orientation: this IS the test gate

---

### Task T5.2: Build library — expect exit 0

```bash
pnpm --filter @geoql/v-mapkit.js run build 2>&1 | tail -20
```

Expected: `vp pack` succeeds, dist/ produced.

**Delegation:** Category `quick`

---

### Task T5.3: Build showcase app — expect exit 0

```bash
pnpm --filter @geoql/mapkit-cn-app run build 2>&1 | tail -20
```

Expected: Nuxt build succeeds, .output/ produced.

**Delegation:** Category `quick`

---

### Task T5.4: Run vitest — expect 97/97 pass

```bash
pnpm --filter @geoql/v-mapkit.js test 2>&1 | tail -15
```

Expected: `Test Files  X passed (X)` and `Tests  97 passed (97)`.

**Delegation:** Category `quick`

---

### Task T5.5: Run lint — expect exit 0

```bash
pnpm run lint 2>&1 | tail -20
```

Expected: `vp lint` exits 0 across both packages.

**Delegation:** Category `quick`

---

## Commit Strategy

Atomic commits in execution order (~50 total):

**Dead code (4 commits):**

1. `chore(mapkit-cn): remove unused registry.ts API endpoint` (T1.1)
2. `chore(lib): remove unused .vitepress/config.ts` (T1.2)
3. `chore(lib): remove unused sass devDependency` (T1.3)
4. `chore: update lockfile after removing sass` (T1.4)

**Template perf refactors (8 commits, one per file):** 5. `refactor(examples/clustering): hoist static annotation to constant` (T2.1) 6. `refactor(examples/image-annotation): hoist dynamic annotation to computed map` (T2.2) 7. `refactor(examples/legend): hoist annotation and style to computed getters` (T2.3) 8. `refactor(examples/map-config): hoist inline arrays and style to module-level consts` (T2.4) 9. `refactor(examples/marker-annotation): hoist dynamic annotation to computed map` (T2.5) 10. `refactor(examples/place-annotation): hoist dynamic annotation to computed map (+ stable :key)` (T2.6) 11. `refactor(examples/search): hoist coordinates array and annotation to computed maps` (T2.7) 12. `refactor(homepage): hoist hero pin annotation to computed map` (T2.8)

**Barrel refactor (18 commits, one per component — fixes 18 unused-export FPs):** 13. `refactor(lib): drop dead named export from VAnnotationCallout barrel` 14. `refactor(lib): drop dead named export from VCircleOverlay barrel` 15. `refactor(lib): drop dead named export from VClusterAnnotation barrel` 16. `refactor(lib): drop dead named export from VControlFullscreen barrel` 17. `refactor(lib): drop dead named export from VControlGeolocate barrel` 18. `refactor(lib): drop dead named export from VControlLayerSwitcher barrel` 19. `refactor(lib): drop dead named export from VControlLegend barrel` 20. `refactor(lib): drop dead named export from VCustomAnnotation barrel` 21. `refactor(lib): drop dead named export from VImageAnnotation barrel` 22. `refactor(lib): drop dead named export from VLookAround barrel` 23. `refactor(lib): drop dead named export from VLookAroundPreview barrel` 24. `refactor(lib): drop dead named export from VMap barrel` 25. `refactor(lib): drop dead named export from VMapFeatureAnnotation barrel` 26. `refactor(lib): drop dead named export from VMarkerAnnotation barrel` 27. `refactor(lib): drop dead named export from VPlaceAnnotation barrel` 28. `refactor(lib): drop dead named export from VPolygonOverlay barrel` 29. `refactor(lib): drop dead named export from VPolylineOverlay barrel` 30. `refactor(lib): drop dead named export from VTileOverlay barrel`

**`value` → `id` rename (2 commits — fixes 4 no-computed-getter FPs):** 31. `refactor(examples/map-types): rename mapTypes[].value to id` (T2.10a) 32. `refactor(homepage): rename highlights[].value to id` (T2.10b)

**Dependency ignores (1 commit — only the 9 build-time deps remain):** 33. `chore(doctor): ignore build-time deps that cannot be traced from source` (T3.1)

**`no-useless-escape` fixes (N commits, one per file — typically 5–10):**
34–N. `fix(lint): remove no-useless-escape in <file-path>`

_(no commit for T5.x — verification only)_

Each commit leaves the tree in a working state — build, test, and lint all pass after every commit.

---

## Success Criteria

| Gate   | Command                                        | Expected                      |
| ------ | ---------------------------------------------- | ----------------------------- |
| **S1** | `npx @geoql/vue-doctor`                        | 0 errors, 0 warnings (was 65) |
| **S2** | `pnpm --filter @geoql/v-mapkit.js run build`   | exit 0                        |
| **S3** | `pnpm --filter @geoql/mapkit-cn-app run build` | exit 0                        |
| **S4** | `pnpm --filter @geoql/v-mapkit.js test`        | 97/97 passing                 |
| **S5** | `pnpm run lint`                                | exit 0                        |

**Bonus metrics:**

- vue-doctor score: 39/100 → 100/100
- Net diff: ~30 lines removed, ~60 lines added (mostly computed getters; net positive for readability)
- All 15 commits atomic, each independently revertable

---

## Resume / Continuation

**Plan file:** `docs/superpowers/plans/2026-06-06-fix-vue-doctor-67-findings.md`

**To resume in a new session:**

1. Open the plan file in this repo.
2. Run `git log --oneline -20` to see which of the 15 commits have landed.
3. Continue from the first un-completed task.
4. For each remaining task, dispatch a fresh subagent per the `superpowers:subagent-driven-development` pattern (implementer → spec reviewer → code quality reviewer).
5. End with the 5 verification gates (T5.1–T5.5).

**TDD discipline reminder for executors:**

- Before any edit: capture the current state (test count, build status, vue-doctor count).
- After each commit: re-run the test that was the "red" condition; confirm "green".
- Never claim a task is done without running the verification step in the same message.

---

## Open Questions (please confirm before execution)

1. ~~**Suppress vs refactor the 4 `no-computed-getter-in-template-loop` FPs?**~~ ✅ **RESOLVED: Fix via refactor** — rename `.value` → `.id` in `mapTypes` and `highlights`. New task: T2.10.
2. ~~**Suppress vs refactor the 18 barrel `unused-export` FPs?**~~ ✅ **RESOLVED: Fix via refactor** — drop the dead named export from each barrel. New task: T2.9 (18 atomic commits).
3. ~~**Single combined commit or per-file commits for the 22 `no-useless-escape` fixes?**~~ ✅ **RESOLVED: Granular, one commit per file** — see T4.1..N.
4. **Fix the `place-annotation.vue` `:key="index"` anti-pattern as a bonus?** Plan: yes, change to `:key="place.name"` while we're in that file (folded into T2.6).
5. **The 9 unused-dependency FPs use `doctor.config.json` ignore — is this acceptable?** These deps are real and used at build time / by type-checker / as peer-deps. They CANNOT be fixed in source code without breaking the build. The only options are: remove the deps (breaking) or tell vue-doctor to ignore them. We pick ignore, with a comment explaining why.
