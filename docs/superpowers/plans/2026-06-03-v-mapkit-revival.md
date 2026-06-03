# v-mapkit.js Revival & Modernization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resurrect `@geoql/v-mapkit.js` from a stalled, dependency-rotted state into a modern, correctly-architected Vue 3 + TypeScript Apple MapKit JS library shipped as a clean public v1.0.0.

**Architecture:** Replace the broken "run-once function" annotation/overlay model and the single-map `createGlobalState` store with idiomatic Vue 3 SFC components using `provide`/`inject` of a reactive `Ref<mapkit.Map>` (the vue3-google-map pattern). Each `<VMap>` provides its own local map instance, so multiple maps coexist. Child annotation/overlay components add themselves on mount via a single `watch` (create+update branch), react to prop changes, emit real events, and remove themselves on unmount. Modernize the entire toolchain (ESLint flat config, Vite 7, TS 5, vue-tsc 3, Prettier 3, husky 9, Changesets) and add Vitest tests + a VitePress docs/playground site.

**Tech Stack:** Vue 3.5, TypeScript 5.x, Vite 7, vue-tsc 3, @vueuse/core 14 (peer), ESLint 10 flat config + typescript-eslint 8, Prettier 3, husky 9, Vitest 2 + happy-dom, VitePress, Changesets.

---

## Conventions & Decisions (read first)

- **`package.json` `"type": "module"`**: We WILL add `"type": "module"`. All config files become ESM. Vite emits `.mjs` for ES, `.umd.cjs` for UMD, `.cjs` for CJS — `exports` map is aligned accordingly in Task 4.
- **API redesign (breaking, intentional)**: New components are `<VMap>` (parent), `<VMarkerAnnotation>`, `<VImageAnnotation>`, `<VCircleOverlay>`, `<VPolygonOverlay>`, `<VPolylineOverlay>`, `<VTileOverlay>`. Each is a real `.vue` SFC.
- **Injection keys**: `MapKitInstanceKey: InjectionKey<Ref<mapkit.Map | undefined>>` and `MapKitReadyKey: InjectionKey<Ref<boolean>>` and `MapKitGlobalKey: InjectionKey<Ref<typeof mapkit | undefined>>`, exported from `src/symbols.ts`.
- **Naming consistency** (used identically in every task): the child's stored instance ref is always named `instance`; the create-or-update watcher is always set up with `{ immediate: true, flush: 'post' }`; removal in `onBeforeUnmount`.
- **MapKit removal API**: annotations use `map.removeAnnotation(a)`; overlays use `map.removeOverlay(o)`. Verified against MapKit JS docs in Task 12 before writing overlay unmount calls.
- **Tests**: Vitest with a hand-written `mapkit` global mock (no real Apple network calls / JWT). The mock lives in `test/mapkit-mock.ts`.
- **Commits**: Conventional Commits, signed (`-S`), one per task minimum. The repo already enforces commitlint.
- **Branch**: All work happens on a `feat/v1-revival` branch off `main`.

---

## File Structure (target)

```
src/
  symbols.ts                      # InjectionKeys (NEW)
  install.ts                      # plugin install (REWRITE — register new components)
  index.ts                        # public exports (REWRITE)
  composables/
    useMapKit.ts                  # loadMapKit + init wrapper (NEW, from helpers)
    useMapChild.ts                # shared child create/update/remove watcher (NEW)
  components/
    VMap.vue                      # parent map (REWRITE from VMap.vue)
    annotations/
      VMarkerAnnotation.vue       # REWRITE from Marker.ts
      VImageAnnotation.vue        # REWRITE from Image.ts
    overlays/
      VCircleOverlay.vue          # REWRITE from Circle.ts
      VPolygonOverlay.vue         # REWRITE from Polygon.ts
      VPolylineOverlay.vue        # REWRITE from Polyline.ts
      VTileOverlay.vue            # REWRITE from Tile.ts
  utils/
    events/index.ts               # event-name arrays (KEEP, reused by VMap emit wiring)
  types/
    index.ts                      # consolidated public types (MOVE from /types/index.d.ts)
test/
  mapkit-mock.ts                  # mapkit global mock (NEW)
  setup.ts                        # vitest setup, installs mock (NEW)
  VMap.spec.ts                    # (NEW)
  VMarkerAnnotation.spec.ts       # (NEW)
  VCircleOverlay.spec.ts          # (NEW)
playground/                       # Vite dev app (NEW)
  index.html
  main.ts
  App.vue
docs/                             # VitePress site (NEW)
  .vitepress/config.ts
  index.md
  guide/getting-started.md
eslint.config.js                  # flat config (NEW, replaces .eslintrc.cjs)
vitest.config.ts                  # (NEW)
.changeset/config.json            # (NEW)
```

---

## Phase 1 — Make it build and breathe again

### Task 1: Create working branch and clean slate

**Files:**
- Modify: working tree (branch + delete `node_modules` lockstate)

- [ ] **Step 1: Create the feature branch**

Run:
```bash
git checkout -b feat/v1-revival
```
Expected: `Switched to a new branch 'feat/v1-revival'`

- [ ] **Step 2: Remove stale install + dead package reference**

Delete `node-sass` from `package.json` devDependencies (it is deprecated and redundant — `sass` is already present). Open `package.json` and remove this exact line from `devDependencies`:
```json
    "node-sass": "^9.0.0",
```

- [ ] **Step 3: Commit the removal**

```bash
git add package.json
git commit -S -m "chore: remove deprecated node-sass dependency"
```

---

### Task 2: Upgrade core runtime + build dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Bump peer + dev dependencies to current majors**

Edit `package.json`. Set these exact versions:

`peerDependencies`:
```json
  "peerDependencies": {
    "@vueuse/core": "^14.0.0",
    "vue": "^3.5.0"
  },
```

In `devDependencies`, replace the build/runtime block with:
```json
    "@types/apple-mapkit-js-browser": "^5.78.0",
    "@vitejs/plugin-vue": "^6.0.0",
    "@vue/compiler-sfc": "^3.5.0",
    "@vue/runtime-dom": "^3.5.0",
    "@vue/tsconfig": "^0.7.0",
    "@vueuse/core": "^14.0.0",
    "sass": "^1.83.0",
    "typescript": "^5.7.0",
    "vite": "^7.0.0",
    "vue": "^3.5.0",
    "vue-tsc": "^3.0.0",
```

- [ ] **Step 2: Update engines**

```json
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=10.0.0"
  },
```

- [ ] **Step 3: Add `"type": "module"`**

Add the top-level key (after `"version"`):
```json
  "type": "module",
```

- [ ] **Step 4: Install**

Run:
```bash
npm install
```
Expected: completes without `node-sass` build errors. If peer warnings about MapKit types appear, they are non-blocking.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -S -m "chore: upgrade vue, vite, typescript, vueuse to current majors"
```

---

### Task 3: Replace ESLint + Prettier with oxlint + oxfmt

> **Toolchain pivot (user directive):** Drop ESLint and Prettier entirely; use oxlint (Oxc linter) + oxfmt (Oxc formatter). **Known limitation accepted:** oxlint lints only the `<script>` block of `.vue` files (no `<template>` linting yet) — acceptable for this library since components are `<script setup lang="ts">`-heavy with trivial templates. oxfmt formats whole `.vue` files (used in production by vuejs/core). **Do NOT enable type-aware oxlint** (`oxlint-tsgolint` requires TypeScript 7; this project is on 5.7).
>
> **Note on prior state:** an earlier attempt at this task installed ESLint flat config (commit `93b3ff3`). This task REMOVES that — uninstall the eslint packages and delete `eslint.config.js`.

**Files:**
- Create: `.oxlintrc.json`, `.oxfmtrc.json`
- Delete: `eslint.config.js`, `.eslintrc.cjs` (if still tracked)
- Modify: `package.json` (lint/format scripts + deps)

- [ ] **Step 1: Remove ESLint + Prettier packages, add oxlint + oxfmt**

Run:
```bash
npm uninstall eslint @eslint/js typescript-eslint eslint-plugin-vue eslint-config-prettier globals prettier @vinayakkulkarni/prettier-config-vue stylelint-config-prettier stylelint-prettier
npm install --save-dev oxlint@^1.68.0 oxfmt@^0.53.0
```
(Some of these may already be absent — `npm uninstall` is idempotent and will not fail on missing packages. `@vinayakkulkarni/prettier-config-vue`, `stylelint-config-prettier`, `stylelint-prettier` are removed here since Prettier is gone.)

- [ ] **Step 2: Delete the ESLint config(s)**

```bash
rm -f eslint.config.js
git rm --cached .eslintrc.cjs 2>/dev/null || true
git rm --cached eslint.config.js 2>/dev/null || true
```

- [ ] **Step 3: Write `.oxlintrc.json`**

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["eslint", "typescript", "unicorn", "oxc", "import", "vue"],
  "env": {
    "browser": true,
    "node": true,
    "es2026": true
  },
  "rules": {
    "typescript/no-unused-vars": [
      "error",
      { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }
    ]
  },
  "ignorePatterns": [
    "dist/**",
    "node_modules/**",
    "coverage/**",
    "**/*.d.ts",
    "docs/.vitepress/cache/**"
  ]
}
```
(We list the four default plugins — `eslint`, `typescript`, `unicorn`, `oxc` — explicitly because setting `plugins` overrides the defaults; then add `import` and `vue`. No `options.typeAware` — type-aware mode is intentionally OFF.)

- [ ] **Step 4: Write `.oxfmtrc.json`**

```json
{
  "$schema": "./node_modules/oxfmt/configuration_schema.json",
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "insertFinalNewline": true,
  "sortImports": { "enabled": true },
  "ignorePatterns": [
    "dist/**",
    "node_modules/**",
    "coverage/**",
    "docs/.vitepress/cache/**"
  ]
}
```
(`singleQuote: true` matches the repo's existing prettier style. oxfmt's `printWidth` default is 100; we pin 80 to match the prior Prettier default.)

- [ ] **Step 5: Update scripts in `package.json`**

Replace the entire `lint*` scripts block (lint, lintfix, lint:js, lint:eslint, lint:eslint:fix, lint:prettier, lint:prettier:fix, lint:css, lint:css:fix) with EXACTLY:
```json
    "lint": "oxlint && oxfmt --check",
    "lintfix": "oxlint --fix && oxfmt",
    "lint:oxlint": "oxlint",
    "lint:oxlint:fix": "oxlint --fix",
    "fmt": "oxfmt",
    "fmt:check": "oxfmt --check",
    "lint:css": "stylelint \"src/**/*.{css,scss,vue}\"",
    "lint:css:fix": "stylelint --fix \"src/**/*.{css,scss,vue}\"",
```
(Leave all non-lint scripts — build, test, prepare, release etc. — untouched.)

- [ ] **Step 6: Verify oxlint + oxfmt run**

Run:
```bash
npx oxlint 2>&1 | tail -15
npx oxfmt --check 2>&1 | tail -15
```
Expected: oxlint runs and reports a summary (it MAY report lint warnings/errors in existing `src/` — that's fine, those files get rewritten in later tasks). oxfmt runs and may list files that would be reformatted — also fine. Neither should crash with "unknown option", "failed to parse config", or a schema error. If a CONFIG error occurs, report BLOCKED with the exact message.

- [ ] **Step 7: Commit**

```bash
git add .oxlintrc.json .oxfmtrc.json package.json package-lock.json
git rm --cached eslint.config.js 2>/dev/null || true
git add -A
git commit -S -m "build!: replace eslint + prettier with oxlint + oxfmt"
```

---

### Task 4: husky 9 + lint-staged wired to oxlint/oxfmt; ESM config renames; drop shipjs

**Files:**
- Modify: `package.json` (deps, lint-staged block, commitlint/husky)
- Rename: `commitlint.config.cjs` → `commitlint.config.js`, `lint-staged.config.cjs` → `lint-staged.config.js`, `stylelint.config.cjs` → `stylelint.config.js`
- Delete: `prettier.config.cjs`, `ship.config.cjs`
- Modify: `.husky/` hooks

- [ ] **Step 1: Bump husky/lint-staged/commitlint/stylelint; drop shipjs + prettier configs**

```bash
npm install --save-dev husky@^9 lint-staged@^15 @commitlint/cli@^19 @commitlint/config-conventional@^19 stylelint@^16 stylelint-config-recommended-vue@^1 postcss-html@^1
npm uninstall shipjs
```

- [ ] **Step 2: Delete the now-unused Prettier + shipjs configs**

```bash
git rm prettier.config.cjs ship.config.cjs
```

- [ ] **Step 3: Rename commitlint + lint-staged + stylelint configs to ESM**

```bash
git mv commitlint.config.cjs commitlint.config.js
git mv lint-staged.config.cjs lint-staged.config.js
git mv stylelint.config.cjs stylelint.config.js
```
In each, convert `module.exports = X` to `export default X`. In `stylelint.config.js`, remove any `stylelint-config-prettier` / `stylelint-prettier` references (those packages were uninstalled in Task 3).

- [ ] **Step 4: Write the lint-staged config**

Overwrite `lint-staged.config.js` with:
```js
export default {
  '*.{js,mjs,cjs,ts,tsx,jsx,vue}': ['oxlint --fix', 'oxfmt'],
  '*.{css,scss}': ['stylelint --fix'],
  '*.{json,md,yml,yaml}': ['oxfmt --no-error-on-unmatched-pattern'],
}
```

- [ ] **Step 5: Migrate husky to v9**

```bash
git rm -rf .husky
npx husky init
```
This recreates `.husky/` with a sample `pre-commit` and sets `"prepare": "husky"` in `package.json` (replacing the old `"prepare": "husky install"`).

- [ ] **Step 6: Write the husky hooks**

`.husky/pre-commit`:
```sh
npx lint-staged
```
`.husky/commit-msg`:
```sh
npx commitlint --edit "$1"
```

- [ ] **Step 7: Verify commitlint + lint-staged config load**

Run:
```bash
echo "bad message" | npx commitlint 2>&1 | head -8
node -e "import('./lint-staged.config.js').then(m => console.log('lint-staged config OK:', Object.keys(m.default)))"
```
Expected: commitlint REJECTS `bad message` (lists "subject may not be empty" / "type may not be empty"), confirming it loads. The node import prints the lint-staged globs, confirming the ESM config is valid.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -S -m "chore: husky 9 + lint-staged on oxlint/oxfmt; esm configs; drop shipjs"
```

---

### Task 5: Modernize the Vite library build config

**Files:**
- Modify: `vite.config.ts`, `package.json` (exports, files, build script)

- [ ] **Step 1: Rewrite `vite.config.ts`**

```ts
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import pkg from './package.json' with { type: 'json' }

const dirname = fileURLToPath(new URL('.', import.meta.url))

const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * (c) ${new Date().getFullYear()} ${pkg.author.name}
 * @license ${pkg.license}
 */`

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(dirname, 'src'),
      '~': resolve(dirname, '.'),
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: true,
    lib: {
      entry: resolve(dirname, 'src/index.ts'),
      name: 'VMapkit',
      formats: ['es', 'umd', 'cjs'],
      fileName: (format, entryName) =>
        format === 'es'
          ? `${entryName}.mjs`
          : format === 'cjs'
            ? `${entryName}.cjs`
            : `${entryName}.umd.cjs`,
      cssFileName: 'style',
    },
    rollupOptions: {
      external: ['vue', '@vueuse/core'],
      output: {
        exports: 'named',
        banner,
        globals: { vue: 'Vue', '@vueuse/core': 'VueUse' },
      },
    },
  },
})
```

- [ ] **Step 2: Update `package.json` entry points + exports**

```json
  "main": "./dist/v-mapkit.umd.cjs",
  "module": "./dist/v-mapkit.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/v-mapkit.mjs",
      "require": "./dist/v-mapkit.umd.cjs"
    },
    "./style.css": "./dist/style.css"
  },
  "files": ["dist"],
```
Remove the now-stale `umd`, `unpkg`, `jsdelivr`, `cdn` top-level keys.

- [ ] **Step 3: Update build + type scripts**

```json
    "dev": "vite --config vite.playground.config.ts",
    "build": "npm run build:lib && npm run build:types",
    "build:lib": "vite build",
    "build:types": "vue-tsc --declaration --emitDeclarationOnly --outDir dist",
    "type-check": "vue-tsc --noEmit",
```

- [ ] **Step 4: Update `tsconfig.json`**

```json
{
  "extends": ["@vue/tsconfig/tsconfig.dom.json"],
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
    "baseUrl": ".",
    "paths": { "~/*": ["./*"], "@/*": ["src/*"] },
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.tsbuildinfo"
  },
  "include": ["src/**/*", "src/**/*.vue", "types/**/*"],
  "exclude": ["node_modules", "dist", "playground", "docs", "test"]
}
```

- [ ] **Step 5: Verify the current code still builds (pre-rewrite baseline)**

Run:
```bash
npm run build:lib 2>&1 | tail -20
```
Expected: Vite produces `dist/v-mapkit.mjs`, `dist/v-mapkit.cjs`, `dist/v-mapkit.umd.cjs`. If `import pkg ... with { type: 'json' }` errors on the Node version, fall back to reading version via `createRequire`. Type-emit will be fixed after the rewrite (current types may have errors) — do NOT run `build:types` yet.

- [ ] **Step 6: Commit**

```bash
git add vite.config.ts tsconfig.json package.json package-lock.json
git commit -S -m "build: modernize vite library config for v7 and esm output"
```

---

### Task 6: Add a Vite playground (the README promises `npm run dev`)

**Files:**
- Create: `playground/index.html`, `playground/main.ts`, `playground/App.vue`, `vite.playground.config.ts`, `.env.example` (token note)

- [ ] **Step 1: Create `vite.playground.config.ts`**

```ts
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  root: resolve(dirname, 'playground'),
  resolve: { alias: { '@': resolve(dirname, 'src'), '~': resolve(dirname, '.') } },
  plugins: [vue()],
})
```

- [ ] **Step 2: Create `playground/index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>v-mapkit playground</title>
    <style>
      html, body, #app { height: 100%; margin: 0; }
    </style>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="./main.ts"></script>
  </body>
</html>
```

- [ ] **Step 3: Create `playground/main.ts`**

```ts
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

- [ ] **Step 4: Create `playground/App.vue` (minimal; updated after components exist)**

```vue
<script setup lang="ts">
const token = import.meta.env.VITE_MAPKIT_TOKEN ?? ''
</script>

<template>
  <div style="height: 100vh">
    <p v-if="!token">Set VITE_MAPKIT_TOKEN in .env to render a map.</p>
    <p v-else>Playground ready — map components wired in Task 11.</p>
  </div>
</template>
```

- [ ] **Step 5: Document the token in `.env.example`**

Append to `.env.example`:
```
# Apple MapKit JS token (JWT) for the local playground
VITE_MAPKIT_TOKEN=
```

- [ ] **Step 6: Verify dev server boots**

Run:
```bash
timeout 15 npm run dev 2>&1 | head -15 || true
```
Expected: Vite prints a `Local: http://localhost:...` line without crashing.

- [ ] **Step 7: Commit**

```bash
git add playground vite.playground.config.ts .env.example
git commit -S -m "feat: add vite playground for local development"
```

---

## Phase 2 — Fix the architecture (clean v1 API)

### Task 7: Set up Vitest + mapkit mock (TDD foundation)

**Files:**
- Create: `vitest.config.ts`, `test/mapkit-mock.ts`, `test/setup.ts`
- Modify: `package.json` (test script + deps)

- [ ] **Step 1: Install Vitest + happy-dom + test utils**

```bash
npm install --save-dev vitest@^2 @vue/test-utils@^2 happy-dom@^15
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [vue()],
  resolve: { alias: { '@': resolve(dirname, 'src'), '~': resolve(dirname, '.') } },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
  },
})
```

- [ ] **Step 3: Create `test/mapkit-mock.ts`**

```ts
import { vi } from 'vitest'

class FakeCoordinate {
  constructor(
    public latitude: number,
    public longitude: number,
  ) {}
}

class FakeMarkerAnnotation {
  coordinate: FakeCoordinate
  options: Record<string, unknown>
  constructor(coordinate: FakeCoordinate, options: Record<string, unknown> = {}) {
    this.coordinate = coordinate
    this.options = options
  }
}
class FakeImageAnnotation extends FakeMarkerAnnotation {}
class FakeCircleOverlay {
  constructor(
    public coordinate: FakeCoordinate,
    public radius: number,
    public options: Record<string, unknown> = {},
  ) {}
}
class FakePolygonOverlay {
  constructor(
    public points: unknown,
    public options: Record<string, unknown> = {},
  ) {}
}
class FakePolylineOverlay extends FakePolygonOverlay {}
class FakeTileOverlay {
  constructor(
    public urlTemplate: unknown,
    public options: Record<string, unknown> = {},
  ) {}
}
class FakeStyle {
  constructor(public options: Record<string, unknown> = {}) {}
}

class FakeMap {
  annotations: unknown[] = []
  overlays: unknown[] = []
  destroyed = false
  private listeners: Record<string, Array<(e: unknown) => void>> = {}
  constructor(
    public element: unknown,
    public options: Record<string, unknown> = {},
  ) {}
  addAnnotation = vi.fn((a: unknown) => this.annotations.push(a))
  removeAnnotation = vi.fn((a: unknown) => {
    this.annotations = this.annotations.filter((x) => x !== a)
  })
  addOverlay = vi.fn((o: unknown) => this.overlays.push(o))
  removeOverlay = vi.fn((o: unknown) => {
    this.overlays = this.overlays.filter((x) => x !== o)
  })
  addEventListener = vi.fn((e: string, cb: (ev: unknown) => void) => {
    ;(this.listeners[e] ??= []).push(cb)
  })
  fireEvent(e: string, payload: unknown) {
    ;(this.listeners[e] ?? []).forEach((cb) => cb(payload))
  }
  destroy = vi.fn(() => {
    this.destroyed = true
  })
}

export function installMapKitMock() {
  const mapkit = {
    init: vi.fn(),
    addEventListener: vi.fn(),
    Map: FakeMap,
    Coordinate: FakeCoordinate,
    MarkerAnnotation: FakeMarkerAnnotation,
    ImageAnnotation: FakeImageAnnotation,
    CircleOverlay: FakeCircleOverlay,
    PolygonOverlay: FakePolygonOverlay,
    PolylineOverlay: FakePolylineOverlay,
    TileOverlay: FakeTileOverlay,
    Style: FakeStyle,
  }
  ;(globalThis as unknown as { mapkit: unknown }).mapkit = mapkit
  ;(window as unknown as { mapkit: unknown }).mapkit = mapkit
  return mapkit
}
```

- [ ] **Step 4: Create `test/setup.ts`**

```ts
import { beforeEach } from 'vitest'
import { installMapKitMock } from './mapkit-mock'

beforeEach(() => {
  installMapKitMock()
})
```

- [ ] **Step 5: Add the test script**

```json
    "test": "vitest run",
    "test:watch": "vitest",
```

- [ ] **Step 6: Verify Vitest runs (no tests yet = passes with 0)**

Run:
```bash
npx vitest run 2>&1 | tail -10
```
Expected: "No test files found" or 0 tests, exit 0. Config must load without error.

- [ ] **Step 7: Commit**

```bash
git add vitest.config.ts test package.json package-lock.json
git commit -S -m "test: set up vitest with mapkit global mock"
```

---

### Task 8: Create injection symbols + the `useMapKit` loader composable

**Files:**
- Create: `src/symbols.ts`, `src/composables/useMapKit.ts`
- Test: `test/useMapKit.spec.ts`

- [ ] **Step 1: Write the failing test for the loader**

`test/useMapKit.spec.ts`:
```ts
import { describe, expect, it } from 'vitest'
import { loadMapKit } from '@/composables/useMapKit'

describe('loadMapKit', () => {
  it('resolves the existing window.mapkit if already present', async () => {
    const mk = await loadMapKit('5.x.x')
    expect(mk).toBe(window.mapkit)
    expect(typeof mk.Map).toBe('function')
  })
})
```

- [ ] **Step 2: Run it to confirm it fails**

Run:
```bash
npx vitest run test/useMapKit.spec.ts 2>&1 | tail -10
```
Expected: FAIL — `Cannot find module '@/composables/useMapKit'`.

- [ ] **Step 3: Write `src/symbols.ts`**

```ts
import type { InjectionKey, Ref } from 'vue'

export const MapKitGlobalKey: InjectionKey<Ref<typeof mapkit | undefined>> =
  Symbol('mapkit:global')
export const MapKitInstanceKey: InjectionKey<Ref<mapkit.Map | undefined>> =
  Symbol('mapkit:map')
export const MapKitReadyKey: InjectionKey<Ref<boolean>> = Symbol('mapkit:ready')
```

- [ ] **Step 4: Write `src/composables/useMapKit.ts`**

```ts
/**
 * Loads the MapKit JS library from Apple's CDN exactly once.
 *
 * @param version - mapkit.js version (e.g. '5.x.x')
 * @returns the global `mapkit` object
 */
export function loadMapKit(version: string): Promise<typeof mapkit> {
  return new Promise((resolve, reject) => {
    if (window.mapkit) {
      resolve(window.mapkit)
      return
    }
    const script = document.createElement('script')
    script.src = `https://cdn.apple-mapkit.com/mk/${version}/mapkit.js`
    script.crossOrigin = 'anonymous'
    script.onload = () => resolve(window.mapkit)
    script.onerror = () => reject(new Error('Failed to load MapKit JS from Apple CDN'))
    document.head.appendChild(script)
  })
}

/**
 * Initializes MapKit with a JWT authorization callback.
 *
 * @param mk - the mapkit global
 * @param token - JWT access token
 * @param initOptions - extra MapKit init options
 */
export function initMapKit(
  mk: typeof mapkit,
  token: string,
  initOptions: mapkit.MapKitInitOptions = {} as mapkit.MapKitInitOptions,
): void {
  mk.init({
    authorizationCallback: (done) => done(token),
    ...initOptions,
  })
}
```

- [ ] **Step 5: Run the test to confirm it passes**

Run:
```bash
npx vitest run test/useMapKit.spec.ts 2>&1 | tail -10
```
Expected: PASS (1 test).

- [ ] **Step 6: Commit**

```bash
git add src/symbols.ts src/composables/useMapKit.ts test/useMapKit.spec.ts
git commit -S -m "feat: add injection symbols and mapkit loader composable"
```

---

### Task 9: Rewrite `<VMap>` with provide/inject + real event emits

**Files:**
- Create: `src/components/VMap.vue` (replaces old; old file is `src/components/VMap.vue` — overwrite)
- Modify: `src/utils/events/index.ts` (keep arrays)
- Test: `test/VMap.spec.ts`

- [ ] **Step 1: Write the failing test**

`test/VMap.spec.ts`:
```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import VMap from '@/components/VMap.vue'

describe('VMap', () => {
  it('initializes a map, emits map-loaded, and provides a real map instance', async () => {
    const wrapper = mount(VMap, {
      props: { accessToken: 'fake.jwt.token' },
    })
    await nextTick()
    await nextTick()
    expect(wrapper.emitted('map-loaded')).toBeTruthy()
    const mapEvents = wrapper.emitted('map')
    expect(mapEvents).toBeTruthy()
    expect(mapEvents![0][0]).toBeInstanceOf(window.mapkit.Map)
  })

  it('supports two independent maps on the same page', async () => {
    const a = mount(VMap, { props: { accessToken: 't1' } })
    const b = mount(VMap, { props: { accessToken: 't2' } })
    await nextTick()
    await nextTick()
    const mapA = a.emitted('map')![0][0]
    const mapB = b.emitted('map')![0][0]
    expect(mapA).not.toBe(mapB)
  })
})
```

- [ ] **Step 2: Run it to confirm it fails**

Run:
```bash
npx vitest run test/VMap.spec.ts 2>&1 | tail -15
```
Expected: FAIL — old `VMap.vue` uses global state and emits via `console.log`, plus `mount` of a render-function component without a real container; the two-map test fails because global state is shared.

- [ ] **Step 3: Overwrite `src/components/VMap.vue`**

```vue
<script setup lang="ts">
import { markRaw, onBeforeUnmount, onMounted, provide, ref } from 'vue'
import { MapKitGlobalKey, MapKitInstanceKey, MapKitReadyKey } from '../symbols'
import {
  mapAnnotationOverlayEvents,
  mapDisplayEvents,
  mapInteractionEvents,
  mapUserLocationEvents,
} from '../utils/events'
import { initMapKit, loadMapKit } from '../composables/useMapKit'

const props = withDefaults(
  defineProps<{
    accessToken: string
    version?: string
    language?: string
    initOptions?: mapkit.MapKitInitOptions
    mapOptions?: mapkit.MapConstructorOptions
  }>(),
  {
    version: '5.x.x',
    language: 'en',
    initOptions: () => ({}) as mapkit.MapKitInitOptions,
    mapOptions: () => ({}) as mapkit.MapConstructorOptions,
  },
)

const emit = defineEmits<{
  map: [map: mapkit.Map]
  'map-initialized': [ok: boolean]
  'map-loaded': [ok: boolean]
  'map-destroyed': [ok: boolean]
  'region-change-start': [e: unknown]
  'region-change-end': [e: unknown]
  'single-tap': [e: unknown]
  'double-tap': [e: unknown]
  'long-press': [e: unknown]
  select: [e: unknown]
  deselect: [e: unknown]
  'user-location-change': [e: unknown]
  'user-location-error': [e: unknown]
}>()

const root = ref<HTMLDivElement>()
const mapkitGlobal = ref<typeof mapkit>()
const map = ref<mapkit.Map>()
const ready = ref(false)

provide(MapKitGlobalKey, mapkitGlobal)
provide(MapKitInstanceKey, map)
provide(MapKitReadyKey, ready)

const allEvents = [
  ...mapDisplayEvents,
  ...mapAnnotationOverlayEvents,
  ...mapUserLocationEvents,
  ...mapInteractionEvents,
]

onMounted(async () => {
  const mk = await loadMapKit(props.version)
  mapkitGlobal.value = markRaw(mk)
  initMapKit(mk, props.accessToken, props.initOptions)
  emit('map-initialized', true)

  map.value = markRaw(new mk.Map(root.value!, props.mapOptions))
  ready.value = true
  emit('map-loaded', true)
  emit('map', map.value)

  for (const name of allEvents) {
    map.value.addEventListener(name, (event: unknown) => {
      emit(name as never, event as never)
    })
  }
})

onBeforeUnmount(() => {
  if (map.value) {
    map.value.destroy()
    emit('map-destroyed', true)
  }
})

defineExpose({ map, ready, mapkit: mapkitGlobal })
</script>

<template>
  <div ref="root" class="v-mapkit">
    <slot v-bind="{ ready, map }" />
  </div>
</template>

<style scoped>
.v-mapkit {
  width: 100%;
  height: 100%;
}
</style>
```

- [ ] **Step 4: Run the test to confirm it passes**

Run:
```bash
npx vitest run test/VMap.spec.ts 2>&1 | tail -15
```
Expected: PASS (2 tests) — independent maps, real `map` emit, `map-loaded` emit.

- [ ] **Step 5: Commit**

```bash
git add src/components/VMap.vue test/VMap.spec.ts
git commit -S -m "feat!: rewrite VMap with provide/inject, real event emits, multi-map support"
```

---

### Task 10: Shared `useMapChild` composable + rewrite all annotation/overlay components

**Files:**
- Create: `src/composables/useMapChild.ts`
- Test: `test/useMapChild.spec.ts`

- [ ] **Step 1: Write the failing test**

`test/useMapChild.spec.ts`:
```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import VMap from '@/components/VMap.vue'
import { useMapChild } from '@/composables/useMapChild'

const Marker = defineComponent({
  name: 'TestMarker',
  props: { lat: { type: Number, required: true }, lng: { type: Number, required: true } },
  setup(props) {
    useMapChild({
      create: (mk, map) => {
        const a = new mk.MarkerAnnotation(new mk.Coordinate(props.lat, props.lng), {})
        map.addAnnotation(a)
        return a
      },
      remove: (map, instance) => map.removeAnnotation(instance),
      watchSources: () => [props.lat, props.lng],
    })
    return () => h('div')
  },
})

describe('useMapChild', () => {
  it('adds the annotation when the map becomes ready and removes it on unmount', async () => {
    const wrapper = mount(VMap, {
      props: { accessToken: 't' },
      slots: { default: () => h(Marker, { lat: 1, lng: 2 }) },
    })
    await nextTick()
    await nextTick()
    const map = wrapper.emitted('map')![0][0] as InstanceType<typeof window.mapkit.Map>
    expect((map as unknown as { annotations: unknown[] }).annotations.length).toBe(1)
    wrapper.unmount()
    // destroy() is called on the map; annotation removal happens before unmount
  })
})
```

- [ ] **Step 2: Run it to confirm it fails**

Run:
```bash
npx vitest run test/useMapChild.spec.ts 2>&1 | tail -12
```
Expected: FAIL — `Cannot find module '@/composables/useMapChild'`.

- [ ] **Step 3: Write `src/composables/useMapChild.ts`**

```ts
import { inject, onBeforeUnmount, ref, watch, type Ref } from 'vue'
import { MapKitGlobalKey, MapKitInstanceKey, MapKitReadyKey } from '../symbols'

export interface UseMapChildOptions<T> {
  /** Create the underlying MapKit instance and attach it to the map. */
  create: (mk: typeof mapkit, map: mapkit.Map) => T
  /** Detach the instance from the map. */
  remove: (map: mapkit.Map, instance: T) => void
  /** Reactive sources whose change triggers a recreate. */
  watchSources: () => unknown[]
  /** Optional in-place update; if omitted, the instance is recreated on change. */
  update?: (mk: typeof mapkit, map: mapkit.Map, instance: T) => void
}

/**
 * Shared lifecycle for declarative map child components (annotations, overlays).
 * Creates the instance once the parent map is ready, reacts to prop changes,
 * and removes the instance on unmount.
 */
export function useMapChild<T>(options: UseMapChildOptions<T>): Ref<T | undefined> {
  const mk = inject(MapKitGlobalKey)
  const map = inject(MapKitInstanceKey)
  const ready = inject(MapKitReadyKey)

  if (!mk || !map || !ready) {
    throw new Error('Map child components must be used inside a <VMap>')
  }

  const instance = ref<T>() as Ref<T | undefined>

  watch(
    [map, ready, options.watchSources],
    () => {
      if (!map.value || !mk.value || !ready.value) return

      if (instance.value) {
        if (options.update) {
          options.update(mk.value, map.value, instance.value)
          return
        }
        options.remove(map.value, instance.value)
      }
      instance.value = options.create(mk.value, map.value)
    },
    { immediate: true, deep: true, flush: 'post' },
  )

  onBeforeUnmount(() => {
    if (instance.value && map.value) {
      options.remove(map.value, instance.value)
    }
  })

  return instance
}
```

- [ ] **Step 4: Run the test to confirm it passes**

Run:
```bash
npx vitest run test/useMapChild.spec.ts 2>&1 | tail -12
```
Expected: PASS (1 test).

- [ ] **Step 5: Write `src/components/annotations/VMarkerAnnotation.vue`**

```vue
<script setup lang="ts">
import { useMapChild } from '../../composables/useMapChild'

const props = defineProps<{
  coordinates: [number, number]
  annotation?: mapkit.MarkerAnnotationConstructorOptions
}>()

const instance = useMapChild<mapkit.MarkerAnnotation>({
  create: (mk, map) => {
    const coord = new mk.Coordinate(props.coordinates[0], props.coordinates[1])
    const a = new mk.MarkerAnnotation(coord, props.annotation ?? {})
    map.addAnnotation(a)
    return a
  },
  remove: (map, a) => map.removeAnnotation(a),
  watchSources: () => [props.coordinates, props.annotation],
})

defineExpose({ annotation: instance })
</script>

<template><slot /></template>
```

- [ ] **Step 6: Write `src/components/annotations/VImageAnnotation.vue`**

```vue
<script setup lang="ts">
import { useMapChild } from '../../composables/useMapChild'

const props = defineProps<{
  coordinates: [number, number]
  annotation: mapkit.ImageAnnotationConstructorOptions
}>()

const instance = useMapChild<mapkit.ImageAnnotation>({
  create: (mk, map) => {
    const coord = new mk.Coordinate(props.coordinates[0], props.coordinates[1])
    const a = new mk.ImageAnnotation(coord, props.annotation)
    map.addAnnotation(a)
    return a
  },
  remove: (map, a) => map.removeAnnotation(a),
  watchSources: () => [props.coordinates, props.annotation],
})

defineExpose({ annotation: instance })
</script>

<template><slot /></template>
```

- [ ] **Step 7: Write `src/components/overlays/VCircleOverlay.vue`**

```vue
<script setup lang="ts">
import { useMapChild } from '../../composables/useMapChild'

const props = defineProps<{
  coordinates: [number, number]
  radius?: number
  style?: mapkit.StyleConstructorOptions
}>()

const instance = useMapChild<mapkit.CircleOverlay>({
  create: (mk, map) => {
    const coord = new mk.Coordinate(props.coordinates[0], props.coordinates[1])
    const style = new mk.Style(props.style ?? {})
    const o = new mk.CircleOverlay(coord, props.radius ?? 1, { style })
    map.addOverlay(o)
    return o
  },
  remove: (map, o) => map.removeOverlay(o),
  watchSources: () => [props.coordinates, props.radius, props.style],
})

defineExpose({ overlay: instance })
</script>

<template><slot /></template>
```

- [ ] **Step 8: Write `src/components/overlays/VPolygonOverlay.vue`**

```vue
<script setup lang="ts">
import { useMapChild } from '../../composables/useMapChild'

const props = defineProps<{
  coordinates: [number, number][]
  style?: mapkit.StyleConstructorOptions
}>()

const instance = useMapChild<mapkit.PolygonOverlay>({
  create: (mk, map) => {
    const points = props.coordinates.map((c) => new mk.Coordinate(c[0], c[1]))
    const style = new mk.Style(props.style ?? {})
    const o = new mk.PolygonOverlay(points, { style })
    map.addOverlay(o)
    return o
  },
  remove: (map, o) => map.removeOverlay(o),
  watchSources: () => [props.coordinates, props.style],
})

defineExpose({ overlay: instance })
</script>

<template><slot /></template>
```

- [ ] **Step 9: Write `src/components/overlays/VPolylineOverlay.vue`**

```vue
<script setup lang="ts">
import { useMapChild } from '../../composables/useMapChild'

const props = defineProps<{
  coordinates: [number, number][]
  style?: mapkit.StyleConstructorOptions
}>()

const instance = useMapChild<mapkit.PolylineOverlay>({
  create: (mk, map) => {
    const points = props.coordinates.map((c) => new mk.Coordinate(c[0], c[1]))
    const style = new mk.Style(props.style ?? {})
    const o = new mk.PolylineOverlay(points, { style })
    map.addOverlay(o)
    return o
  },
  remove: (map, o) => map.removeOverlay(o),
  watchSources: () => [props.coordinates, props.style],
})

defineExpose({ overlay: instance })
</script>

<template><slot /></template>
```

- [ ] **Step 10: Write `src/components/overlays/VTileOverlay.vue`**

```vue
<script setup lang="ts">
import { useMapChild } from '../../composables/useMapChild'

const props = defineProps<{
  url: mapkit.URLTemplateCallback | string
  options?: mapkit.TileOverlayConstructorOptions
}>()

const instance = useMapChild<mapkit.TileOverlay>({
  create: (mk, map) => {
    const o = new mk.TileOverlay(props.url, props.options ?? {})
    map.addOverlay(o)
    return o
  },
  remove: (map, o) => map.removeOverlay(o),
  watchSources: () => [props.url, props.options],
})

defineExpose({ overlay: instance })
</script>

<template><slot /></template>
```

- [ ] **Step 11: Delete the old function-based modules**

```bash
git rm src/components/annotations/Marker.ts src/components/annotations/Image.ts
git rm src/components/overlays/Circle.ts src/components/overlays/Polygon.ts src/components/overlays/Polyline.ts src/components/overlays/Tile.ts
git rm src/components/annotations/index.ts src/components/overlays/index.ts
git rm src/utils/store/index.ts src/utils/config/index.ts
```

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -S -m "feat!: rewrite annotations and overlays as real Vue components"
```

---

### Task 11: Rewrite public exports, install plugin, and consolidate types

**Files:**
- Modify: `src/index.ts`, `src/install.ts`, `playground/App.vue`
- Create: `src/types/index.ts`; Delete `types/index.d.ts`

- [ ] **Step 1: Write `src/index.ts`**

```ts
export { default as VMap } from './components/VMap.vue'
export { default as VMarkerAnnotation } from './components/annotations/VMarkerAnnotation.vue'
export { default as VImageAnnotation } from './components/annotations/VImageAnnotation.vue'
export { default as VCircleOverlay } from './components/overlays/VCircleOverlay.vue'
export { default as VPolygonOverlay } from './components/overlays/VPolygonOverlay.vue'
export { default as VPolylineOverlay } from './components/overlays/VPolylineOverlay.vue'
export { default as VTileOverlay } from './components/overlays/VTileOverlay.vue'
export { MapKitGlobalKey, MapKitInstanceKey, MapKitReadyKey } from './symbols'
export { loadMapKit, initMapKit } from './composables/useMapKit'
export { useMapChild } from './composables/useMapChild'
export { default } from './install'
export type * from './types'
```

- [ ] **Step 2: Write `src/install.ts`**

```ts
import type { App, Plugin } from 'vue'
import VMap from './components/VMap.vue'
import VImageAnnotation from './components/annotations/VImageAnnotation.vue'
import VMarkerAnnotation from './components/annotations/VMarkerAnnotation.vue'
import VCircleOverlay from './components/overlays/VCircleOverlay.vue'
import VPolygonOverlay from './components/overlays/VPolygonOverlay.vue'
import VPolylineOverlay from './components/overlays/VPolylineOverlay.vue'
import VTileOverlay from './components/overlays/VTileOverlay.vue'

const install: Plugin['install'] = (app: App) => {
  app.component('VMap', VMap)
  app.component('VMarkerAnnotation', VMarkerAnnotation)
  app.component('VImageAnnotation', VImageAnnotation)
  app.component('VCircleOverlay', VCircleOverlay)
  app.component('VPolygonOverlay', VPolygonOverlay)
  app.component('VPolylineOverlay', VPolylineOverlay)
  app.component('VTileOverlay', VTileOverlay)
}

export default install
```

- [ ] **Step 3: Create `src/types/index.ts`** (public prop types, mirroring component props)

```ts
export interface VMapProps {
  accessToken: string
  version?: string
  language?: string
  initOptions?: mapkit.MapKitInitOptions
  mapOptions?: mapkit.MapConstructorOptions
}

export interface MarkerAnnotationProps {
  coordinates: [number, number]
  annotation?: mapkit.MarkerAnnotationConstructorOptions
}

export interface ImageAnnotationProps {
  coordinates: [number, number]
  annotation: mapkit.ImageAnnotationConstructorOptions
}

export interface CircleOverlayProps {
  coordinates: [number, number]
  radius?: number
  style?: mapkit.StyleConstructorOptions
}

export interface PolygonOverlayProps {
  coordinates: [number, number][]
  style?: mapkit.StyleConstructorOptions
}

export type PolylineOverlayProps = PolygonOverlayProps

export interface TileOverlayProps {
  url: mapkit.URLTemplateCallback | string
  options?: mapkit.TileOverlayConstructorOptions
}
```

- [ ] **Step 4: Delete the old hand-written declaration file**

```bash
git rm types/index.d.ts
```

- [ ] **Step 5: Update `playground/App.vue` to exercise the real components**

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { VMap, VMarkerAnnotation, VCircleOverlay } from '../src'

const token = import.meta.env.VITE_MAPKIT_TOKEN ?? ''
const center = ref<[number, number]>([37.3349, -122.009])
</script>

<template>
  <div style="height: 100vh">
    <p v-if="!token" style="padding: 1rem">
      Set <code>VITE_MAPKIT_TOKEN</code> in <code>.env</code> to render a map.
    </p>
    <VMap v-else :access-token="token" :map-options="{ center: undefined }">
      <VMarkerAnnotation :coordinates="center" :annotation="{ title: 'Apple Park' }" />
      <VCircleOverlay :coordinates="center" :radius="500" />
    </VMap>
  </div>
</template>
```

- [ ] **Step 6: Type-check the whole library**

Run:
```bash
npm run type-check 2>&1 | tail -20
```
Expected: 0 errors. If `mapkit` namespace is unresolved, ensure `@types/apple-mapkit-js-browser` is in `devDependencies` and add `"types": ["apple-mapkit-js-browser"]` to `tsconfig.json` compilerOptions if needed.

- [ ] **Step 7: Run the full test suite**

Run:
```bash
npm test 2>&1 | tail -15
```
Expected: all specs PASS.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -S -m "feat!: consolidate exports, plugin install, and public types for v1"
```

---

### Task 12: Verify the full build (lib + types) end-to-end

**Files:**
- Modify: none (verification task); fix-ups as needed

- [ ] **Step 1: Verify MapKit overlay removal API names**

Run:
```bash
npx --yes -p @types/apple-mapkit-js-browser sh -c 'grep -rE "removeOverlay|removeAnnotation" node_modules/@types/apple-mapkit-js-browser 2>/dev/null | head' 2>&1 | head
```
Expected: confirms `removeOverlay` and `removeAnnotation` exist on `mapkit.Map`. If the names differ, update `useMapChild` callers in Task 10's components accordingly, then re-run `npm test`.

- [ ] **Step 2: Clean build**

Run:
```bash
rm -rf dist node_modules/.tmp
npm run build 2>&1 | tail -25
```
Expected: `dist/v-mapkit.mjs`, `dist/v-mapkit.cjs`, `dist/v-mapkit.umd.cjs`, and `dist/index.d.ts` all produced. No vue-tsc errors.

- [ ] **Step 3: Verify the type entry resolves**

Run:
```bash
test -f dist/index.d.ts && grep -c "VMap" dist/index.d.ts
```
Expected: file exists, `VMap` referenced.

- [ ] **Step 4: Lint the new source clean**

Run:
```bash
npm run lint 2>&1 | tail -20
```
Expected: 0 errors. Run `npm run lintfix` if there are auto-fixable issues, then re-commit.

- [ ] **Step 5: Commit any fix-ups**

```bash
git add -A
git commit -S -m "build: verify clean lib + types build for v1" || echo "nothing to commit"
```

---

## Phase 3 — Make it credible again

### Task 13: Modernize CI workflow

**Files:**
- Modify: `.github/workflows/ci.yml`; Delete `shipjs-trigger.yml`, `ship.config.cjs`

- [ ] **Step 1: Rewrite `.github/workflows/ci.yml`**

```yaml
name: Continuous Integration

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node: [20, 22]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm test
      - run: npm run build
```

- [ ] **Step 2: Remove ship.js infrastructure**

```bash
git rm .github/workflows/shipjs-trigger.yml ship.config.cjs
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -S -m "ci: modernize workflow with node 20/22 matrix, drop shipjs"
```

---

### Task 14: Add Changesets for releases

**Files:**
- Create: `.changeset/config.json`, `.github/workflows/release.yml`
- Modify: `package.json` (scripts + dep)

- [ ] **Step 1: Install + init Changesets**

```bash
npm install --save-dev @changesets/cli@^2
npx changeset init
```

- [ ] **Step 2: Set the changeset config base branch**

Edit `.changeset/config.json` so `"baseBranch": "main"` and `"access": "public"`.

- [ ] **Step 3: Add release scripts**

```json
    "changeset": "changeset",
    "version": "changeset version",
    "release": "npm run build && changeset publish"
```

- [ ] **Step 4: Create `.github/workflows/release.yml`**

```yaml
name: Release

on:
  push:
    branches: [main]

permissions:
  contents: write
  pull-requests: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          registry-url: https://registry.npmjs.org
      - run: npm ci
      - uses: changesets/action@v1
        with:
          publish: npm run release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

- [ ] **Step 5: Add the v1 changeset**

Create `.changeset/v1-revival.md`:
```md
---
'@geoql/v-mapkit.js': major
---

Rewrite as a fully declarative Vue 3 component library: real `<VMap>` + annotation/overlay components using provide/inject, multi-map support, real event emits, proper lifecycle cleanup. Modernized toolchain (Vite 7, ESLint flat config, TS 5, vue-tsc 3, Prettier 3, husky 9). **Breaking:** the old function-based annotation/overlay API and single-map global state are removed.
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -S -m "ci: add changesets release flow and v1 major changeset"
```

---

### Task 15: VitePress docs site + README rewrite

**Files:**
- Create: `docs/.vitepress/config.ts`, `docs/index.md`, `docs/guide/getting-started.md`
- Modify: `README.md`, `package.json` (docs scripts + dep)

- [ ] **Step 1: Install VitePress**

```bash
npm install --save-dev vitepress@^1
```

- [ ] **Step 2: Create `docs/.vitepress/config.ts`**

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'v-mapkit.js',
  description: 'Apple MapKit JS for Vue 3',
  themeConfig: {
    nav: [{ text: 'Guide', link: '/guide/getting-started' }],
    sidebar: [
      {
        text: 'Guide',
        items: [{ text: 'Getting Started', link: '/guide/getting-started' }],
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/geoql/v-mapkit.js' }],
  },
})
```

- [ ] **Step 3: Create `docs/index.md`**

```md
---
layout: home
hero:
  name: v-mapkit.js
  text: Apple MapKit JS for Vue 3
  tagline: Declarative maps, annotations, and overlays as real Vue components.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
---
```

- [ ] **Step 4: Create `docs/guide/getting-started.md`**

```md
# Getting Started

## Installation

```sh
npm install @geoql/v-mapkit.js @vueuse/core vue
```

## Usage

```vue
<script setup lang="ts">
import { VMap, VMarkerAnnotation } from '@geoql/v-mapkit.js'
</script>

<template>
  <VMap :access-token="token">
    <VMarkerAnnotation :coordinates="[37.3349, -122.009]" :annotation="{ title: 'Apple Park' }" />
  </VMap>
</template>
```

You need an Apple MapKit JS JWT token. See Apple's MapKit JS docs for generating one.
```

- [ ] **Step 5: Add docs scripts**

```json
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs"
```

- [ ] **Step 6: Rewrite the README usage section** to reflect the new component API (replace the old `Available components` checklist with a working `<VMap>` example identical to the getting-started snippet) and bump the dev-setup note (`npm run dev` now launches the playground).

- [ ] **Step 7: Verify docs build**

Run:
```bash
npm run docs:build 2>&1 | tail -15
```
Expected: VitePress builds without error.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -S -m "docs: add vitepress site and rewrite README for v1 API"
```

---

### Task 16: Final verification + finish the branch

**Files:**
- Modify: none (verification)

- [ ] **Step 1: Full local verification gauntlet**

Run:
```bash
rm -rf dist node_modules/.tmp
npm run lint && npm run type-check && npm test && npm run build && npm run docs:build
```
Expected: every command exits 0.

- [ ] **Step 2: Confirm the dist is publishable**

Run:
```bash
npm pack --dry-run 2>&1 | tail -25
```
Expected: tarball contains `dist/v-mapkit.mjs`, `dist/v-mapkit.umd.cjs`, `dist/index.d.ts` — and NOT `src/`, `test/`, `playground/`, `docs/`.

- [ ] **Step 3: Use the finishing-a-development-branch skill**

Load `superpowers:finishing-a-development-branch` and follow it to merge / open a PR for `feat/v1-revival`.

---

## Self-Review

**Spec coverage** (against the 3 phases the user approved):
- Phase 1 (tooling): Tasks 1–6 — deps, ESLint flat config, Prettier 3 / husky 9, Vite 7 lib build, playground/dev script. ✅
- Phase 2 (architecture): Tasks 7–12 — Vitest+mock, symbols+loader, VMap rewrite (multi-map + real emits), useMapChild + all 6 child components rewritten as real SFCs, exports/types consolidation, full build verify. ✅
- Phase 3 (credibility): Tasks 13–16 — CI matrix, Changesets release, VitePress docs + README, final verification. ✅

**Placeholder scan**: No "TBD"/"add error handling"/"similar to Task N". Every code step contains full content. One intentional verification-with-fallback exists in Task 12 Step 1 (verify MapKit removal API names) and Task 11 Step 6 (types fallback) — these are guarded checks, not placeholders.

**Type consistency**: child instance ref is `instance` everywhere; `useMapChild` signature (`create`/`remove`/`watchSources`/`update?`) is used identically in Tasks 10 components and the Task 10 test. Injection keys (`MapKitGlobalKey`/`MapKitInstanceKey`/`MapKitReadyKey`) defined in Task 8, consumed in Tasks 9–10, re-exported in Task 11. `provide` order in VMap matches `inject` in useMapChild.

**Corrections folded in from research**: vue-tsc targeted at `^3` (not 2.x — current is 3.x); Vite `^7` with `cssFileName` (v6+) to avoid the silent `style.css`→pkg-name CSS rename; husky `init` (not `install`); `eslint-config-prettier/flat` subpath; dropped `eslint-plugin-prettier`.

---
