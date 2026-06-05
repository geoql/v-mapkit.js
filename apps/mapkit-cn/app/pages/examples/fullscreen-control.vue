<script setup lang="ts">
  import { VControlFullscreen, VMap } from '@geoql/v-mapkit.js';
  import { centerMap, places } from '~/composables/useMapDemo';

  definePageMeta({ layout: 'example' });
  useHead({ title: 'Fullscreen Control · mapkit-cn' });

  const { token } = useMapkitToken();

  function onMap(map: unknown): void {
    centerMap(map as never, places.tokyo, 0.1);
  }

  const code = `<script setup lang="ts">
  import { VMap, VControlFullscreen } from '@geoql/v-mapkit.js';
<\/script>

<template>
  <VMap :access-token="token">
    <VControlFullscreen position="top-right" />
  </VMap>
</template>`;
</script>

<template>
  <ExampleCard
    title="Fullscreen Control"
    description="VControlFullscreen adds a button that expands the map to fill the viewport via the Fullscreen API. Drop it anywhere inside VMap and position it in any corner. Click the ⛶ button on the map."
  >
    <ExampleMapContainer>
      <VMap :access-token="token" color-scheme="light" @map="onMap">
        <VControlFullscreen position="top-right" />
      </VMap>
    </ExampleMapContainer>

    <template #code>
      <ExampleCodeBlock :code="code" filename="FullscreenControl.vue" />
    </template>
  </ExampleCard>
</template>
