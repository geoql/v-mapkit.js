# V-Mapkit.js 🌎

<!-- Badges -->

[![Pipeline](https://img.shields.io/github/actions/workflow/status/geoql/v-mapkit/pipeline.yml?branch=main&logo=github-actions&label=pipeline)](https://github.com/geoql/v-mapkit/actions/workflows/pipeline.yml)
[![GitHub release](https://img.shields.io/github/v/release/geoql/v-mapkit?sort=semver&logo=github&label=release)](https://github.com/geoql/v-mapkit/releases)
[![npm](https://img.shields.io/npm/v/@geoql/v-mapkit?logo=npm&label=npm)](https://www.npmjs.com/package/@geoql/v-mapkit)
[![JSR](https://img.shields.io/jsr/v/@geoql/v-mapkit?logo=jsr&label=jsr)](https://jsr.io/@geoql/v-mapkit)
[![npm downloads](https://img.shields.io/npm/dm/@geoql/v-mapkit?logo=npm&label=downloads)](http://npm-stat.com/charts.html?package=@geoql/v-mapkit)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@geoql/v-mapkit?label=size)](https://bundlephobia.com/package/@geoql/v-mapkit@latest)
[![types](https://img.shields.io/npm/types/@geoql/v-mapkit?logo=typescript&label=types)](https://github.com/geoql/v-mapkit/blob/main/package.json)
[![License](https://img.shields.io/github/license/geoql/v-mapkit?logo=github&label=license)](./LICENSE)

[![vite-plus](https://img.shields.io/github/package-json/dependency-version/geoql/v-mapkit/dev/vite-plus?logo=vite&label=vite-plus)](https://github.com/voidzero-dev/vite-plus)
[![typescript](https://img.shields.io/github/package-json/dependency-version/geoql/v-mapkit/dev/typescript?logo=TypeScript&label=typescript)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/github/package-json/packageManager/geoql/v-mapkit?label=pnpm&logo=pnpm)](https://pnpm.io/)
[![node](https://img.shields.io/node/v/v-mapkit?logo=node.js&label=node)](https://nodejs.org/)

<!-- End Badges -->

---

**⚠️ Note ⚠️**
This project is still under heavy development and is missing features. Contributions are welcome!

Power of [Vue 3](https://v3.vuejs.org) with awesomeness of [Mapkit](https://developer.apple.com/documentation/mapkitjs)!

## Features

- 💪 Built with [TypeScript](https://www.typescriptlang.org/).
- 🌠 Built with the all new [Vue 3](https://v3.vuejs.org/)

## Table of Contents

- [V-Mapkit.js 🌎](#v-mapkitjs-)
  - [Features](#features)
  - [Table of Contents](#table-of-contents)
    - [Installation](#installation)
    - [Usage](#usage)
    - [API](#api)
    - [Build Setup](#build-setup)
  - [Built with](#built-with)
  - [Contributing](#contributing)
  - [License](#license)

### Installation

```sh
pnpm add @geoql/v-mapkit @vueuse/core vue
```

### Usage

Drop a `<VMap>` into your template and nest annotations or overlays as child
components. You need an Apple MapKit JS JWT token; see Apple's
[MapKit JS docs](https://developer.apple.com/documentation/mapkitjs) for
generating one.

```vue
<script setup lang="ts">
  import { VMap, VMarkerAnnotation } from '@geoql/v-mapkit';
</script>

<template>
  <VMap :access-token="token">
    <VMarkerAnnotation
      :coordinates="[37.3349, -122.009]"
      :annotation="{ title: 'Apple Park' }"
    />
  </VMap>
</template>
```

Prefer global registration? Install the default plugin:

```ts
import { createApp } from 'vue';
import VMapkit from '@geoql/v-mapkit';

createApp(App).use(VMapkit).mount('#app');
```

### API

**Components**

- `VMap` — the map container. Props: `access-token` (required), `version`,
  `language`, `init-options`, `map-options`. Emits: `map`, `map-loaded`,
  `map-initialized`, `map-destroyed`, plus MapKit map events
  (region, rotation, scroll, zoom, select, drag, user-location, tap, etc.).
- `VMarkerAnnotation`, `VImageAnnotation` — annotations. Take `coordinates`
  plus their MapKit options.
- `VCircleOverlay`, `VPolygonOverlay`, `VPolylineOverlay`, `VTileOverlay` —
  overlays. Take `coordinates` plus their MapKit options.

**Composables**

- `loadMapKit` / `initMapKit` — load and initialize the MapKit JS runtime.
- `useMapChild` — register an annotation or overlay with its parent `VMap`.

### Build Setup

```bash
# install dependencies
$ pnpm install

# start the Vite playground (local dev sandbox)
$ pnpm run dev

# package the library
$ pnpm run build

# run the docs site locally
$ pnpm run docs:dev
```

## Built with

- [TypeScript](https://www.typescriptlang.org/)
- [Vue 3](https://v3.vuejs.org)

## Contributing

1. Fork it ( [https://github.com/geoql/v-mapkit/fork](https://github.com/geoql/v-mapkit/fork) )
2. Create your feature branch (`git checkout -b feat/new-feature`)
3. Commit your changes (`git commit -Sam 'feat: add feature'`)
4. Push to the branch (`git push origin feat/new-feature`)
5. Create a new [Pull Request](https://github.com/geoql/v-mapkit/compare)

_Note_:

1. Please contribute using [GitHub Flow](https://web.archive.org/web/20191104103724/https://guides.github.com/introduction/flow/)
2. Commits & PRs will be allowed only if the commit messages & PR titles follow the [conventional commit standard](https://www.conventionalcommits.org/), _read more about it [here](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional#type-enum)_
3. PS. Ensure your commits are signed. _[Read why](https://withblue.ink/2020/05/17/how-and-why-to-sign-git-commits.html)_

## License

MIT &copy; Vinayak Kulkarni
