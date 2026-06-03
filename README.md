# V-Mapkit.js 🌎

[![Continuous Integration](https://github.com/geoql/v-mapkit.js/actions/workflows/ci.yml/badge.svg)](https://github.com/geoql/v-mapkit.js/actions/workflows/ci.yml)
[![CodeQL](https://github.com/geoql/v-mapkit.js/actions/workflows/codeql.yml/badge.svg)](https://github.com/geoql/v-mapkit.js/actions/workflows/codeql.yml)
[![Ship js trigger](https://github.com/geoql/v-mapkit.js/actions/workflows/shipjs-trigger.yml/badge.svg)](https://github.com/geoql/v-mapkit.js/actions/workflows/shipjs-trigger.yml)
[![npm](https://img.shields.io/npm/dm/@geoql/v-mapkit.js?logo=npm)](http://npm-stat.com/charts.html?package=@geoql/v-mapkit.js)
[![npm](https://img.shields.io/npm/v/@geoql/v-mapkit.js/latest?logo=npm)](https://www.npmjs.com/package/@geoql/v-mapkit.js)
[![npm bundle size (version)](https://img.shields.io/bundlephobia/min/@geoql/v-mapkit.js/latest?label=@latest%20size&logo=vue.js)](https://bundlephobia.com/package/@geoql/v-mapkit.js@latest)
[![npm type definitions](https://img.shields.io/npm/types/@geoql/v-mapkit.js)](https://github.com/geoql/v-mapkit.js/blob/master/package.json)
[![DeepScan grade](https://deepscan.io/api/teams/15032/projects/18161/branches/438551/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=15032&pid=18161&bid=438551)
[![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/geoql/v-mapkit.js)](https://snyk.io/test/github/geoql/v-mapkit.js)
[![GitHub contributors](https://img.shields.io/github/contributors/geoql/v-mapkit.js?logo=github)](https://github.com/geoql/v-mapkit.js/graphs/contributors)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fgeoql%2Fv-mapkit.js.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fgeoql%2Fv-mapkit.js?ref=badge_shield)

[![eslint](https://img.shields.io/npm/dependency-version/@geoql/v-mapkit.js/dev/eslint?logo=eslint)](https://eslint.org/)
[![prettier](https://img.shields.io/npm/dependency-version/@geoql/v-mapkit.js/dev/prettier?logo=prettier)](https://prettier.io/)
[![vite](https://img.shields.io/npm/dependency-version/@geoql/v-mapkit.js/dev/vite?logo=vite)](https://vitejs.dev/)
[![vue](https://img.shields.io/npm/dependency-version/@geoql/v-mapkit.js/dev/vue?logo=vue.js)](https://vuejs.org/)
[![typescript](https://img.shields.io/npm/dependency-version/@geoql/v-mapkit.js/dev/typescript?logo=TypeScript)](https://www.typescriptlang.org/)

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
npm install @geoql/v-mapkit.js @vueuse/core vue
```

### Usage

Drop a `<VMap>` into your template and nest annotations or overlays as child
components. You need an Apple MapKit JS JWT token; see Apple's
[MapKit JS docs](https://developer.apple.com/documentation/mapkitjs) for
generating one.

```vue
<script setup lang="ts">
import { VMap, VMarkerAnnotation } from '@geoql/v-mapkit.js';
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
import VMapkit from '@geoql/v-mapkit.js';

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
$ npm install

# start the Vite playground (local dev sandbox)
$ npm run dev

# package the library
$ npm run build

# run the docs site locally
$ npm run docs:dev
```

## Built with

- [TypeScript](https://www.typescriptlang.org/)
- [Vue 3](https://v3.vuejs.org)

## Contributing

1. Fork it ( [https://github.com/geoql/v-mapkit.js/fork](https://github.com/geoql/v-mapkit.js/fork) )
2. Create your feature branch (`git checkout -b feat/new-feature`)
3. Commit your changes (`git commit -Sam 'feat: add feature'`)
4. Push to the branch (`git push origin feat/new-feature`)
5. Create a new [Pull Request](https://github.com/geoql/v-mapkit.js/compare)

_Note_:

1. Please contribute using [GitHub Flow](https://web.archive.org/web/20191104103724/https://guides.github.com/introduction/flow/)
2. Commits & PRs will be allowed only if the commit messages & PR titles follow the [conventional commit standard](https://www.conventionalcommits.org/), _read more about it [here](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional#type-enum)_
3. PS. Ensure your commits are signed. _[Read why](https://withblue.ink/2020/05/17/how-and-why-to-sign-git-commits.html)_

## License

MIT &copy; Vinayak Kulkarni
