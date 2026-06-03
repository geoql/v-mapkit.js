<script setup lang="ts">
import { ref } from 'vue';

import { VMap, VMarkerAnnotation, VCircleOverlay } from '../src';

const token = import.meta.env.VITE_MAPKIT_TOKEN ?? '';
const center = ref<[number, number]>([37.3349, -122.009]);
</script>

<template>
  <div style="height: 100vh">
    <p v-if="!token" style="padding: 1rem">
      Set <code>VITE_MAPKIT_TOKEN</code> in <code>.env</code> to render a map.
    </p>
    <VMap v-else :access-token="token" :map-options="{ center: undefined }">
      <VMarkerAnnotation
        :coordinates="center"
        :annotation="{ title: 'Apple Park' }"
      />
      <VCircleOverlay :coordinates="center" :radius="500" />
    </VMap>
  </div>
</template>
