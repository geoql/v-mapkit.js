# Getting Started

## Installation

```sh
npm install v-mapkit.js @vueuse/core vue
```

## Usage

```vue
<script setup lang="ts">
  import { VMap, VMarkerAnnotation } from 'v-mapkit.js';
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

You need an Apple MapKit JS JWT token. See Apple's MapKit JS docs for generating one.
