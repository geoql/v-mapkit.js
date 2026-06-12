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

| App                           | Description                             |
| ----------------------------- | --------------------------------------- |
| [mapkit-cn](./apps/mapkit-cn) | Showcase site with 24 examples (Nuxt 4) |

## Quick Start

### Install the library

```bash
pnpm add @geoql/v-mapkit
```

```vue
<script setup>
import { VMap, VMarkerAnnotation } from "@geoql/v-mapkit";
import "@geoql/v-mapkit/style.css";
</script>

<template>
  <VMap :options="{ token: 'YOUR_MAPKIT_TOKEN' }" :center="[37.7749, -122.4194]" :zoom="12">
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
│   └── v-mapkit/         # Main library (npm: v-mapkit)
├── apps/
│   └── mapkit-cn/           # Nuxt 4 showcase site
├── package.json             # pnpm workspaces root
├── pnpm-workspace.yaml      # Workspace config
└── pnpm-lock.yaml
```

## License

MIT License - see [LICENSE](./packages/v-mapkit/LICENSE) for details

---

Made with ❤️ by [GeoQL](https://github.com/geoql)
