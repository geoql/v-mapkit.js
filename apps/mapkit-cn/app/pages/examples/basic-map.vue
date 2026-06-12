<script setup lang="ts">
  import { VMap } from '@geoql/v-mapkit.js';
  import { centerMap, places } from '~/composables/useMapDemo';

  definePageMeta({ layout: 'example' });
  useSeoMeta({
    title: 'Basic Map · mapkit-cn',
    description:
      'Basic Map example for v-mapkit.js: a live, copy-paste Vue 3 Apple MapKit demo.',
    ogTitle: 'Basic Map',
    ogDescription:
      'Basic Map example for v-mapkit.js: a live, copy-paste Vue 3 Apple MapKit demo.',
    twitterCard: 'summary_large_image',
  });
  defineOgImageComponent('MapkitDoc', {
    title: 'Basic Map',
    description: 'Basic Map example for v-mapkit.js: a live, copy-paste Vue 3 Apple MapKit demo.',
  });

  const { token } = useMapkitToken();
  const colorMode = useColorMode();
  const scheme = computed(() =>
    colorMode.value === 'dark' ? 'dark' : 'light',
  );

  function onMap(map: unknown): void {
    centerMap(map as never, places.applePark, 0.06);
  }

  const code = `<script setup lang="ts">
  import { VMap } from '@geoql/v-mapkit.js';

  const token = 'YOUR_MAPKIT_TOKEN';

  function onMap(map) {
    // center/region are applied once the map is ready
    map.setRegionAnimated(
      new mapkit.CoordinateRegion(
        new mapkit.Coordinate(37.3349, -122.009),
        new mapkit.CoordinateSpan(0.06, 0.06),
      ),
    );
  }
<\x2Fscript>

<template>
  <VMap :access-token="token" color-scheme="dark" @map="onMap" />
</template>`;
</script>

<template>
  <ExampleCard
    title="Basic Map"
    description="The smallest possible map: pass your MapKit token to VMap, then center it once the map is ready via the @map event. Coordinates and regions aren't props: they're applied through the live MapKit instance."
  >
    <ExampleMapContainer>
      <VMap
        :access-token="token"
        :color-scheme="scheme"
        :shows-zoom-control="true"
        @map="onMap"
      />
    </ExampleMapContainer>

    <template #code>
      <ExampleCodeBlock :code="code" filename="BasicMap.vue" />
    </template>
  </ExampleCard>
</template>
