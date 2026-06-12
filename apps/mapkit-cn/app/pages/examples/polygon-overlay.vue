<script setup lang="ts">
  import { VMap, VPolygonOverlay } from '@geoql/v-mapkit';
  import { centerMap } from '~/composables/useMapDemo';

  definePageMeta({ layout: 'example' });
  useSeoMeta({
    title: 'Polygon Overlay · mapkit-cn',
    description:
      'Polygon Overlay example for v-mapkit: a live, copy-paste Vue 3 Apple MapKit demo.',
    ogTitle: 'Polygon Overlay',
    ogDescription:
      'Polygon Overlay example for v-mapkit: a live, copy-paste Vue 3 Apple MapKit demo.',
    twitterCard: 'summary_large_image',
  });
  defineOgImageComponent('MapkitDoc', {
    title: 'Polygon Overlay',
    description: 'Polygon Overlay example for v-mapkit: a live, copy-paste Vue 3 Apple MapKit demo.',
  });

  const { token } = useMapkitToken();

  // A rough triangle around downtown San Francisco.
  const region: [number, number][] = [
    [37.8085, -122.4101],
    [37.7956, -122.3937],
    [37.7648, -122.4186],
    [37.7793, -122.4423],
    [37.8009, -122.4365],
  ];

  const center: [number, number] = [37.785, -122.42];

  const style = {
    fillColor: '#30d158',
    fillOpacity: 0.2,
    strokeColor: '#30d158',
    lineWidth: 2,
  };

  function onMap(map: unknown): void {
    centerMap(map as never, center, 0.1);
  }

  const code = `<script setup lang="ts">
  import { VMap, VPolygonOverlay } from '@geoql/v-mapkit';

  const region = [
    [37.8085, -122.4101],
    [37.7956, -122.3937],
    [37.7648, -122.4186],
    [37.7793, -122.4423],
  ];
<\x2Fscript>

<template>
  <VMap :access-token="token">
    <VPolygonOverlay
      :coordinates="region"
      :style="{ fillColor: '#30d158', fillOpacity: 0.2, strokeColor: '#30d158' }"
    />
  </VMap>
</template>`;
</script>

<template>
  <ExampleCard
    title="Polygon Overlay"
    description="VPolygonOverlay fills a closed ring of coordinates: neighborhoods, delivery zones, coverage areas. Pass an array of [lat, lng] points and a style object."
  >
    <ExampleMapContainer>
      <VMap :access-token="token" color-scheme="light" @map="onMap">
        <VPolygonOverlay :coordinates="region" :style="style" />
      </VMap>
    </ExampleMapContainer>

    <template #code>
      <ExampleCodeBlock :code="code" filename="PolygonOverlay.vue" />
    </template>
  </ExampleCard>
</template>
