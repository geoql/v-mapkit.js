<script setup lang="ts">
  import { VControlLayerSwitcher, VMap } from '@geoql/v-mapkit.js';
  import { centerMap, places } from '~/composables/useMapDemo';

  definePageMeta({ layout: 'example' });
  useSeoMeta({
    title: 'Layer Switcher · mapkit-cn',
    description:
      'Layer Switcher example for v-mapkit.js: a live, copy-paste Vue 3 Apple MapKit demo.',
    ogTitle: 'Layer Switcher',
    ogDescription:
      'Layer Switcher example for v-mapkit.js: a live, copy-paste Vue 3 Apple MapKit demo.',
    twitterCard: 'summary_large_image',
  });
  defineOgImageComponent('MapkitDoc', {
    title: 'Layer Switcher',
    description: 'Layer Switcher example for v-mapkit.js: a live, copy-paste Vue 3 Apple MapKit demo.',
  });

  const { token } = useMapkitToken();

  const mapTypes = [
    { type: 'standard' as const, label: 'Standard' },
    { type: 'mutedStandard' as const, label: 'Muted' },
    { type: 'hybrid' as const, label: 'Hybrid' },
    { type: 'satellite' as const, label: 'Satellite' },
  ];

  function onMap(map: unknown): void {
    centerMap(map as never, places.goldenGate, 0.1);
  }

  const code = `<script setup lang="ts">
  import { VMap, VControlLayerSwitcher } from '@geoql/v-mapkit.js';

  const mapTypes = [
    { type: 'standard', label: 'Standard' },
    { type: 'hybrid', label: 'Hybrid' },
    { type: 'satellite', label: 'Satellite' },
  ];
<\x2Fscript>

<template>
  <VMap :access-token="token">
    <VControlLayerSwitcher position="top-left" :map-types="mapTypes" />
  </VMap>
</template>`;
</script>

<template>
  <ExampleCard
    title="Layer Switcher"
    description="VControlLayerSwitcher renders a dropdown bound to the map's type. Provide your own list of map types and labels, or rely on the sensible defaults. Use the selector on the map."
  >
    <ExampleMapContainer>
      <VMap :access-token="token" color-scheme="light" @map="onMap">
        <VControlLayerSwitcher position="top-left" :map-types="mapTypes" />
      </VMap>
    </ExampleMapContainer>

    <template #code>
      <ExampleCodeBlock :code="code" filename="LayerSwitcher.vue" />
    </template>
  </ExampleCard>
</template>
