<script setup lang="ts">
  import {
    VMap,
    VMarkerAnnotation,
    VPolylineOverlay,
  } from 'v-mapkit.js';
  import { centerMap } from '~/composables/useMapDemo';

  definePageMeta({ layout: 'example' });
  useHead({ title: 'Polyline Overlay · mapkit-cn' });

  const { token } = useMapkitToken();

  // A walking path along the San Francisco waterfront.
  const path: [number, number][] = [
    [37.8087, -122.4098],
    [37.8024, -122.4058],
    [37.7955, -122.3937],
    [37.7905, -122.3899],
    [37.7857, -122.3908],
  ];

  const center: [number, number] = [37.797, -122.4];

  const style = {
    strokeColor: '#ff375f',
    lineWidth: 4,
    lineJoin: 'round',
    lineCap: 'round',
  };

  function onMap(map: unknown): void {
    centerMap(map as never, center, 0.06);
  }

  const code = `<script setup lang="ts">
  import { VMap, VPolylineOverlay } from 'v-mapkit.js';

  const path = [
    [37.8087, -122.4098],
    [37.8024, -122.4058],
    [37.7955, -122.3937],
    [37.7857, -122.3908],
  ];
<\x2Fscript>

<template>
  <VMap :access-token="token">
    <VPolylineOverlay
      :coordinates="path"
      :style="{ strokeColor: '#ff375f', lineWidth: 4, lineCap: 'round' }"
    />
  </VMap>
</template>`;
</script>

<template>
  <ExampleCard
    title="Polyline Overlay"
    description="VPolylineOverlay connects coordinates into a line — routes, GPS traces, transit paths. Same coordinate-array API as polygons, but open-ended. Endpoints are marked here for clarity."
  >
    <ExampleMapContainer>
      <VMap :access-token="token" color-scheme="dark" @map="onMap">
        <VPolylineOverlay :coordinates="path" :style="style" />
        <VMarkerAnnotation
          :coordinates="path[0]!"
          :annotation="{ title: 'Start', color: '#30d158', glyphText: 'A' }"
        />
        <VMarkerAnnotation
          :coordinates="path[path.length - 1]!"
          :annotation="{ title: 'End', color: '#ff375f', glyphText: 'B' }"
        />
      </VMap>
    </ExampleMapContainer>

    <template #code>
      <ExampleCodeBlock :code="code" filename="PolylineOverlay.vue" />
    </template>
  </ExampleCard>
</template>
