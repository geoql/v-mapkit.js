# v-mapkit.js

> Vue 3 components for Apple MapKit JS - Monorepo for v-mapkit.js and mapkit-cn

[![npm version](https://badge.fury.io/js/v-mapkit.js.svg)](https://www.npmjs.com/package/v-mapkit.js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Packages

| Package | Description |
| --- | --- |
| [v-mapkit.js](./packages/v-mapkit.js) | Vue 3 components for Apple MapKit JS |

## Apps

| App | Description |
| --- | --- |
| [mapkit-cn](./apps/mapkit-cn) | Showcase site with 24 examples (Nuxt 4) |

## Quick Start

### Install the library

```bash
pnpm add v-mapkit.js
```

```vue
<script setup>
import { VMap, VMarkerAnnotation } from 'v-mapkit.js';
import 'v-mapkit.js/style.css';
</script>

<template>
  <VMap
    :options="{ token: 'YOUR_MAPKIT_TOKEN' }"
    :center="[37.7749, -122.4194]"
    :zoom="12"
  >
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
v-mapkit.js/
├── packages/
│   └── v-mapkit.js/         # Main library (npm: v-mapkit.js)
├── apps/
│   └── mapkit-cn/           # Nuxt 4 showcase site
├── package.json             # pnpm workspaces root
├── pnpm-workspace.yaml      # Workspace config
└── pnpm-lock.yaml
```

## License

MIT License - see [LICENSE](./packages/v-mapkit.js/LICENSE) for details

---

Made with ❤️ by [GeoQL](https://github.com/geoql)
