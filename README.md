# v-mapkit

> Vue 3 components for Apple MapKit JS - Monorepo for v-mapkit and mapkit-cn

[![npm version](https://badge.fury.io/js/@geoql%2Fv-mapkit.svg)](https://www.npmjs.com/package/@geoql/v-mapkit)
[![JSR](https://jsr.io/badges/@geoql/v-mapkit)](https://jsr.io/@geoql/v-mapkit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Packages

| Package                         | Description                          |
| ------------------------------- | ------------------------------------ |
| [v-mapkit](./packages/v-mapkit) | Vue 3 components for Apple MapKit JS |

## Apps

| App                           | Description                                   |
| ----------------------------- | --------------------------------------------- |
| [mapkit-cn](./apps/mapkit-cn) | Showcase site with 23 live examples (Nuxt 4)  |
| [docs](./apps/docs)           | Documentation site (Nuxt 4 + `@nuxt/content`) |

## Quick Start

### Install the library

```bash
pnpm add @geoql/v-mapkit
```

```vue
<script setup lang="ts">
import { VMap, VMarkerAnnotation } from "@geoql/v-mapkit";
import "@geoql/v-mapkit/style.css";

const token = "YOUR_MAPKIT_TOKEN";

// Coordinates aren't props — MapKit owns the live map, so set the
// initial region once the instance is ready via the @map event.
function onMap(map: mapkit.Map) {
  map.setRegionAnimated(
    new mapkit.CoordinateRegion(
      new mapkit.Coordinate(37.7749, -122.4194),
      new mapkit.CoordinateSpan(0.1, 0.1),
    ),
  );
}
</script>

<template>
  <VMap :access-token="token" @map="onMap">
    <VMarkerAnnotation :coordinates="[37.7749, -122.4194]" />
  </VMap>
</template>
```

### Use mapkit-cn (shadcn-vue style)

```bash
npx shadcn-vue@latest add https://mapkit-cn.geoql.in/r/v-map
```

## Development

This monorepo uses [pnpm v11](https://pnpm.io) workspaces.

```bash
# Install all dependencies
pnpm install

# Development
pnpm run dev:lib      # Watch mode for library
pnpm run dev:app      # Showcase site

# Build
pnpm run build        # Build all packages
pnpm run build:app    # Build showcase site

# Test
pnpm run test

# Lint & Format
pnpm run lint
pnpm run format
```

## Monorepo Structure

```
v-mapkit/
├── packages/
│   └── v-mapkit/            # Core library (npm + jsr: @geoql/v-mapkit)
├── apps/
│   ├── mapkit-cn/           # Nuxt 4 showcase site (23 live examples + registry)
│   └── docs/                # Nuxt 4 documentation site (@nuxt/content)
├── package.json             # pnpm workspaces root
├── pnpm-workspace.yaml      # Workspace config
└── pnpm-lock.yaml
```

## License

MIT License - see [LICENSE](./packages/v-mapkit/LICENSE) for details

---

Made with ❤️ by [GeoQL](https://github.com/geoql)
