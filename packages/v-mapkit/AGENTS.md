# AGENTS.md - @geoql/v-mapkit Library Guide

> **For AI Coding Assistants (Claude Code, Cursor, Copilot, etc.)**
> This file helps AI agents understand the library architecture, conventions, and best practices for @geoql/v-mapkit.

---

## Project Overview

**@geoql/v-mapkit** is a Vue 3 component library for Apple MapKit JS. It provides reactive, composable map components with full TypeScript support — a declarative `<VMap>` container, annotation and overlay children, map controls, Look Around, and a set of service composables (search, geocoding, directions, POI, clustering) that wrap the MapKit runtime.

### Key Capabilities

- **Core**: `VMap` — boots the MapKit JS runtime, owns the map instance, provides it to children
- **Annotations**: `VMarkerAnnotation`, `VImageAnnotation`, `VPlaceAnnotation`, `VCustomAnnotation`, `VMapFeatureAnnotation`, `VClusterAnnotation`, `VAnnotationCallout`
- **Overlays**: `VCircleOverlay`, `VPolygonOverlay`, `VPolylineOverlay`, `VTileOverlay`
- **Look Around**: `VLookAround`, `VLookAroundPreview`
- **Controls**: `VControlFullscreen`, `VControlGeolocate`, `VControlLayerSwitcher`, `VControlLegend`
- **Service composables**: `useSearch`, `useGeocoder`, `useDirections`, `usePointsOfInterestSearch`, `useCluster`
- **Runtime composables**: `loadMapKit` / `initMapKit` (`use-map-kit.ts`), `useMapChild` (`use-map-child.ts`)

That is **18 public components + 5 service composables** today. Verify against `src/index.ts` before claiming a component exists — never invent one.

---

## Skills Integration & Priority

This package uses **one** generic, host-provided skill:

| Skill                | When to Load                                       |
| -------------------- | -------------------------------------------------- |
| `vue-best-practices` | Any Vue 3 component / composable / reactivity work |

`mapkit-cn-design` and `nuxt-best-practices` do **not** apply — this is a framework-agnostic library that runs in any Vue 3 host (Nuxt, Vite, Vue CLI, plain HTML). It ships no styling system and no Nuxt-specific code.

**Priority rule: This AGENTS.md ALWAYS takes precedence over generic skills when they conflict.**

### Known Conflicts (AGENTS.md wins)

| Skill Says                                            | AGENTS.md Says (Use This)                                                                                                                                        |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pass map/state via props for clarity                  | Use **`inject(MapKitInstanceKey)`** — every annotation, overlay, and control receives the parent map via `provide/inject`, never via props (see Rule #2)         |
| Auto-clean DOM via Vue lifecycle                      | **Manually remove the annotation/overlay** in `onBeforeUnmount` — MapKit owns its own object graph; Vue's unmount won't strip map artifacts (see Rule #3)        |
| Use `ref()` for the map instance                      | Use **`shallowRef()`** for the `mapkit.Map` and the global `mapkit` namespace — deep reactivity on a live MapKit instance is wasteful and breaks identity checks |
| Centralize child lifecycle yourself in each component | Use the shared **`useMapChild()`** composable — it owns create/update/remove and the `ready`-gated watch for every annotation and overlay (see Rule #7)          |
| Use `useFetch` for search / geocode / directions      | **Don't.** Library code can't import Nuxt composables. The service composables call MapKit's own `Search`, `Geocoder`, and `Directions` classes directly.        |
| `defineProps<Props>()` with optional inferred types   | Use **`withDefaults(defineProps<Props>(), { ... })`** with explicit defaults — Vue's runtime needs concrete defaults for optional props                          |
| `as any` to silence MapKit typing gaps                | **Forbidden.** Use the `@types/apple-mapkit-js-browser` types or narrow `unknown`; project-specific gaps live in `src/types/mapkit-augment.d.ts`                 |

### What Skills Add (Not in AGENTS.md)

- **`vue-best-practices`** — `ref` vs `reactive`, `shallowRef`, avoiding destructure on reactive objects, `v-once`/`v-memo`, `defineAsyncComponent`, `KeepAlive`, single-responsibility composables, return refs not reactive objects, `v-show` vs `v-if`, proper `:key` usage

---

## CRITICAL RULES - NEVER VIOLATE THESE

### Rule #1: All Components Must Use Vue 3 Composition API

```vue
<!-- CORRECT -->
<script setup lang="ts">
  import { inject, onBeforeUnmount, watch } from 'vue';
  import { MapKitInstanceKey } from '../../symbols';
</script>

<!-- WRONG - Options API -->
<script lang="ts">
  export default {
    data() {},
    methods: {},
  };
</script>
```

### Rule #2: Access the Parent Map via `inject`, Not Props

Every annotation, overlay, and control reads the shared map (and the global `mapkit` namespace, and the `ready` flag) from the injection keys defined in `src/symbols.ts`. `VMap` is the only provider.

```typescript
// CORRECT - inject the shared instance
import {
  MapKitGlobalKey,
  MapKitInstanceKey,
  MapKitReadyKey,
} from '../../symbols';

const mk = inject(MapKitGlobalKey);
const map = inject(MapKitInstanceKey);
const ready = inject(MapKitReadyKey);

// WRONG - prop drilling the map
const props = defineProps<{ map: mapkit.Map }>();
```

`VMap` provides three keys; a fourth (`MapKitAnnotationKey`) lets callout-style children inject their parent annotation:

```typescript
// src/symbols.ts
export const MapKitGlobalKey: InjectionKey<Ref<typeof mapkit | undefined>>;
export const MapKitInstanceKey: InjectionKey<Ref<mapkit.Map | undefined>>;
export const MapKitReadyKey: InjectionKey<Ref<boolean>>;
export const MapKitAnnotationKey: InjectionKey<
  Ref<mapkit.Annotation | undefined>
>;
```

Multiple `<VMap>` instances on one page are fully supported — each provides its own scoped trio, so children always resolve the nearest map.

### Rule #3: Components Must Handle Lifecycle Properly

MapKit owns its object graph. Add on the `ready` edge, remove on unmount.

```typescript
// CORRECT - create when ready, remove on unmount
watch(
  [map, ready],
  () => {
    if (!map.value || !ready.value) return;
    annotation = new mk.value!.MarkerAnnotation(coord, options);
    map.value.addAnnotation(annotation);
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  if (annotation && map.value) map.value.removeAnnotation(annotation);
});

// WRONG - missing cleanup, leaks the annotation onto the map
watch(ready, () => map.value?.addAnnotation(annotation));
```

In practice you should not hand-write this — use `useMapChild` (Rule #7), which encodes exactly this pattern once.

### Rule #4: Use TypeScript for All Props and Events

```typescript
// CORRECT - fully typed, explicit defaults
const props = withDefaults(
  defineProps<{
    accessToken: string;
    version?: string;
    language?: string;
  }>(),
  { version: '5.x.x', language: 'en' },
);

const emit = defineEmits<{
  map: [map: mapkit.Map];
  'map-loaded': [ok: boolean];
}>();

// WRONG - untyped
const props = defineProps(['accessToken', 'version']);
```

### Rule #5: No `any` Type - Ever

Use the `@types/apple-mapkit-js-browser` ambient `mapkit` namespace. Where Apple's types lag, narrow `unknown` or add a targeted augmentation in `src/types/mapkit-augment.d.ts` — never reach for `any`.

```typescript
// WRONG
const a: any = new mapkit.MarkerAnnotation(coord);

// CORRECT
const a: mapkit.MarkerAnnotation = new mk.value.MarkerAnnotation(
  coord,
  options,
);
```

### Rule #6: Export All Components from index.ts

Every new component and composable must be exported from `src/index.ts` (the published barrel) AND registered in `src/install.ts` (the global Vue plugin). Both, or it ships broken.

```typescript
// src/index.ts
export { default as VMarkerAnnotation } from './components/VMarkerAnnotation';
export { useSearch } from './composables/use-search';

// src/install.ts
app.component('VMarkerAnnotation', VMarkerAnnotation);
```

### Rule #7: Annotations & Overlays Must Use `useMapChild`

`useMapChild` is the single source of truth for child lifecycle. It injects the map/global/ready trio, creates the instance once the map is ready, reacts to prop changes via `watchSources`, and removes the instance on unmount. Feed it `create`, `remove`, and optionally `update`.

```typescript
// CORRECT - declarative child via the shared composable
const instance = useMapChild<mapkit.CircleOverlay>({
  watchSources: () => [props.coordinates, props.radius],
  create: (mk, map) => {
    const overlay = new mk.CircleOverlay(
      coord(props.coordinates),
      props.radius,
    );
    map.addOverlay(overlay);
    return overlay;
  },
  remove: (map, overlay) => map.removeOverlay(overlay),
});

// WRONG - re-implementing inject + watch + onBeforeUnmount per component
const map = inject(MapKitInstanceKey);
watch(map, () => {
  /* ad-hoc create/remove */
});
```

`useMapChild`'s watch runs with `{ immediate: true, deep: true, flush: 'post' }` and throws if used outside a `<VMap>`. If `update` is omitted, a prop change does a remove-then-recreate.

### Rule #8: Component File Structure

One folder per component, PascalCase folder name, a `.vue` SFC and an `index.ts` barrel inside it:

```
src/
├── components/
│   ├── VMap/
│   │   ├── VMap.vue
│   │   └── index.ts
│   ├── VMarkerAnnotation/
│   │   ├── VMarkerAnnotation.vue
│   │   └── index.ts
│   └── …                     # one folder per public component
├── composables/               # use-map-kit, use-map-child, use-search, use-geocoder, use-directions, use-points-of-interest-search, use-cluster (kebab-case files)
├── constants/
│   └── events/                # MapKit event-name groups (display, interaction, …)
├── types/
│   ├── index.ts
│   └── mapkit-augment.d.ts    # local MapKit type augmentations
├── symbols.ts                 # provide/inject InjectionKeys
├── install.ts                 # Vue plugin (default export)
└── index.ts                   # public barrel
```

**Composable files are kebab-case** (`use-map-child.ts`) but their **exports are camelCase** (`useMapChild`). The runtime entry points `loadMapKit` and `initMapKit` both live in `use-map-kit.ts`.

### Rule #9: Published-Package Dependency Pinning (CRITICAL)

This package is **published to npm and jsr** as `@geoql/v-mapkit` (`"private": false`). End users install it with `npm`, `yarn`, `pnpm`, `bun`, or via jsr — **none of which understand pnpm's `catalog:` protocol**.

The rest of the monorepo (root + both apps) centralizes versions in **pnpm catalogs** (`pnpm-workspace.yaml`), but **this package is the deliberate exception**: every entry in `dependencies`, `devDependencies`, and `peerDependencies` here MUST use real semver — never `catalog:` or `workspace:*`. Catalog/workspace refs would break `npm install` and `jsr add` for end users. Keep `package.json` and `jsr.json` in sync — both are public publish targets and both must resolve without pnpm.

```jsonc
// CORRECT - real semver in every dep block
"peerDependencies": {
  "@vueuse/core": "^14.0.0",
  "vue": "^3.5.0"
}

// WRONG - catalog refs break `npm install` and `jsr add` for end users
"peerDependencies": {
  "vue": "catalog:"
}
```

**When adding a dependency:** add it as real semver to this `package.json`; if it must be importable from jsr, mirror it under `imports` in `jsr.json` (e.g. `"vue": "npm:vue@^3.5.0"`). Dependabot (`.github/dependabot.yml`) watches `/packages/v-mapkit` — keep `package.json` and `jsr.json` pins aligned to avoid cross-target drift.

---

## Tech Stack

| Concern        | Technology                                                    |
| -------------- | ------------------------------------------------------------- |
| **Framework**  | Vue 3.5+ (Composition API, `<script setup>`)                  |
| **Build**      | `vite-plus` (`vp pack`) — bundles ESM + types in one step     |
| **Testing**    | Vitest + Vue Test Utils + happy-dom                           |
| **Types**      | TypeScript 6.x, `vue-tsc` for `type-check`, `@vue/tsconfig`   |
| **Lint / Fmt** | `vite-plus` (`vp lint`, `vp fmt`) + stylelint for CSS in SFCs |
| **Core Dep**   | Apple MapKit JS (`@types/apple-mapkit-js-browser`)            |
| **Peer Deps**  | `vue ^3.5.0`, `@vueuse/core ^14.0.0`                          |

The MapKit JS runtime itself is loaded at runtime by `loadMapKit` (it injects Apple's CDN script), so it is **not** a bundled dependency — only its types are a devDependency.

---

## Toolchain: vite-plus (NOT plain vite / eslint / prettier)

This package's build, lint, and format are owned by **vite-plus**. Use its `vp` commands; do not invoke standalone `eslint`, `prettier`, `tsc`, or `vite build`.

| Need            | Command                           |
| --------------- | --------------------------------- |
| Package the lib | `pnpm run build` → `vp pack`      |
| Lint            | `pnpm run lint` → `vp lint`       |
| Lint + autofix  | `pnpm run lint:fix`               |
| Format          | `pnpm run format` → `vp fmt`      |
| Format check    | `pnpm run format:check`           |
| Type-check      | `pnpm run type-check` → `vue-tsc` |
| CSS lint        | `pnpm run lint:css` → stylelint   |

Output is **ESM-only** with a single `style.css` side-effect entry (`exports`: `.` → `./dist/index.js`, `./style.css`).

---

## Component Patterns

### Core Component (`VMap`)

`VMap` is the only stateful boot component. It loads MapKit, creates the `mapkit.Map`, and provides the trio. It uses `shallowRef` for the map and global namespace, gates children with a `ready` ref, wires every MapKit event group from `constants/events`, and tears everything down in `onBeforeUnmount`.

```vue
<script setup lang="ts">
  import { onBeforeUnmount, onMounted, provide, ref, shallowRef } from 'vue';
  import { initMapKit, loadMapKit } from '../../composables/use-map-kit';
  import {
    MapKitGlobalKey,
    MapKitInstanceKey,
    MapKitReadyKey,
  } from '../../symbols';

  const props = withDefaults(
    defineProps<{ accessToken: string; version?: string }>(),
    {
      version: '5.x.x',
    },
  );

  const root = ref<HTMLDivElement>();
  const mapkitGlobal = shallowRef<typeof mapkit>();
  const map = shallowRef<mapkit.Map>();
  const ready = ref(false);

  provide(MapKitGlobalKey, mapkitGlobal);
  provide(MapKitInstanceKey, map);
  provide(MapKitReadyKey, ready);

  onMounted(async () => {
    const mk = await loadMapKit(props.version);
    mapkitGlobal.value = mk;
    initMapKit(mk, props.accessToken);
    map.value = new mk.Map(root.value!, props.mapOptions);
    ready.value = true;
  });

  onBeforeUnmount(() => map.value?.destroy());
</script>

<template>
  <div ref="root" class="v-mapkit">
    <slot v-bind="{ ready, map }" />
  </div>
</template>
```

> The real `VMap.vue` is larger than the 100-line guideline because it is the single boot surface that fans out every MapKit option + event group; it is the deliberate exception, and all its imperative MapKit work is already factored into `use-map-kit.ts`. New components do **not** get this exemption.

### Annotation / Overlay Component (via `useMapChild`)

```vue
<script setup lang="ts">
  import { useMapChild } from '../../composables/use-map-child';

  const props = defineProps<{
    coordinates: [number, number];
    annotation?: mapkit.MarkerAnnotationConstructorOptions;
  }>();

  useMapChild<mapkit.MarkerAnnotation>({
    watchSources: () => [props.coordinates, props.annotation],
    create: (mk, map) => {
      const coord = new mk.Coordinate(
        props.coordinates[0],
        props.coordinates[1],
      );
      const a = new mk.MarkerAnnotation(coord, props.annotation);
      map.addAnnotation(a);
      return a;
    },
    remove: (map, a) => map.removeAnnotation(a),
  });
</script>

<template>
  <slot />
</template>
```

### Service Composable (e.g. `useSearch`)

Service composables wrap MapKit's own classes and return refs + a trigger function. They inject the global `mapkit` namespace; they never reach for Nuxt or `fetch`.

```typescript
// src/composables/use-search.ts (shape)
export function useSearch() {
  const mk = inject(MapKitGlobalKey);
  const results = ref<mapkit.SearchResult[]>([]);

  async function search(query: string) {
    const search = new mk!.value!.Search();
    // …resolve via MapKit's Search API, assign results.value
  }

  return { results, search };
}
```

---

## Testing Patterns

Tests live in `test/` as Vitest `*.spec.ts` files. A hand-written MapKit stub (`test/mapkit-mock.ts`) stands in for Apple's runtime so specs never hit the network; `test/setup.ts` installs it. Mount components with Vue Test Utils, providing the injection keys for child-component tests.

```typescript
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import {
  MapKitGlobalKey,
  MapKitInstanceKey,
  MapKitReadyKey,
} from '../src/symbols';
import VMarkerAnnotation from '../src/components/VMarkerAnnotation/VMarkerAnnotation.vue';

const mapStub = { addAnnotation: vi.fn(), removeAnnotation: vi.fn() };

mount(VMarkerAnnotation, {
  global: {
    provide: {
      [MapKitGlobalKey as symbol]: ref(mapkitMock),
      [MapKitInstanceKey as symbol]: ref(mapStub),
      [MapKitReadyKey as symbol]: ref(true),
    },
  },
  props: { coordinates: [37.3349, -122.009] },
});
```

```bash
pnpm run test           # run once
pnpm run test:watch     # watch mode
pnpm run test:coverage  # v8 coverage
```

---

## Adding a New Component

1. **Create the folder + SFC**

   ```bash
   mkdir -p src/components/VNewThing
   # src/components/VNewThing/VNewThing.vue
   ```

2. **Add the index barrel**

   ```typescript
   // src/components/VNewThing/index.ts
   export { default } from './VNewThing.vue';
   ```

3. **Export from the public barrel**

   ```typescript
   // src/index.ts
   export { default as VNewThing } from './components/VNewThing';
   ```

4. **Register in the plugin**

   ```typescript
   // src/install.ts
   app.component('VNewThing', VNewThing);
   ```

5. **Add a spec** in `test/VNewThing.spec.ts` (provide the injection trio).

6. **Keep it under ~100 lines** — push lifecycle into `useMapChild` and any heavy logic into a composable.

---

## AI Assistant Pre-Flight Checklist

Before every code change:

1. **Composition API?** — `<script setup lang="ts">`, imports from `vue`.
2. **Map access?** — `inject(MapKitInstanceKey)`, never a `map` prop.
3. **Lifecycle?** — child built through `useMapChild`; map artifacts removed on unmount.
4. **Types?** — props/emits typed, no `any`, `withDefaults` for optional props.
5. **File structure?** — folder + SFC + `index.ts`; exported from `src/index.ts` AND registered in `src/install.ts`.
6. **Under 100 lines?** — if not, extract a composable or split.
7. **Deps?** — real semver in `package.json` (NEVER `catalog:`/`workspace:*` — this is the catalog exception); jsr `imports` kept in sync.
8. **Toolchain?** — verify with `vp lint` / `vp fmt` / `vitest`, not standalone tools.

### Preferred Patterns

1. **Composition API** with `<script setup>`
2. **`inject` the map trio** from `symbols.ts`
3. **`useMapChild`** for every annotation/overlay
4. **`shallowRef`** for the live MapKit instance
5. **`withDefaults`** for optional props
6. **Export from `index.ts` + register in `install.ts`** for every new component
7. **Write a Vitest spec** for new components

---

Made with care by GeoQL.
