---
title: Getting Started
description: Get started with v-mapkit in your Vue 3 or Nuxt project
---

# Getting Started

v-mapkit provides Vue 3 components for Apple MapKit JS, enabling declarative map rendering with reactive annotations, overlays, and services.

## Installation

::code-group
```bash [pnpm]
pnpm add @geoql/v-mapkit
```

```bash [npm]
npm install @geoql/v-mapkit
```

```bash [yarn]
yarn add @geoql/v-mapkit
```
::

## Usage

Import the components and styles in your Vue application:

```vue
<script setup>
import { VMap, VMarkerAnnotation } from '@geoql/v-mapkit';
import '@geoql/v-mapkit/style.css';
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

## MapKit Token

You need a MapKit JS token from Apple. Get one from the [Apple Developer Portal](https://developer.apple.com/maps/mapkitjs/).

## Nuxt Integration

For Nuxt projects, you can auto-import the components:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@geoql/v-mapkit/nuxt'],
});
```

## Next Steps

- Browse all 18 components and 4 composables in the [live examples](https://mapkit-cn.geoql.in)
- Star the project on [GitHub](https://github.com/geoql/v-mapkit)
