<script setup lang="ts">
  import { VMap, VTileOverlay } from '@geoql/v-mapkit.js';
  import { Button } from '@/components/ui/button';
  import { centerMap, places } from '~/composables/useMapDemo';

  definePageMeta({ layout: 'example' });
  useHead({ title: 'Tile Overlay · mapkit-cn' });

  const { token } = useMapkitToken();

  const visible = ref(true);

  // OpenStreetMap raster tiles as a demo custom layer.
  const tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

  function onMap(map: unknown): void {
    centerMap(map as never, places.london, 0.08);
  }

  const code = `<script setup lang="ts">
  import { VMap, VTileOverlay } from '@geoql/v-mapkit.js';

  const url = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
<\/script>

<template>
  <VMap :access-token="token">
    <VTileOverlay :url="url" :options="{ opacity: 0.8 }" />
  </VMap>
</template>`;
</script>

<template>
  <ExampleCard
    title="Tile Overlay"
    description="VTileOverlay layers custom raster tiles on top of the base map using a {z}/{x}/{y} URL template — weather, terrain, or third-party basemaps. Toggle the OpenStreetMap layer below."
  >
    <ExampleMapContainer>
      <VMap :access-token="token" color-scheme="light" @map="onMap">
        <VTileOverlay
          v-if="visible"
          :url="tileUrl"
          :options="{ opacity: 0.85 }"
        />
      </VMap>
    </ExampleMapContainer>

    <template #controls>
      <Button
        :variant="visible ? 'default' : 'outline'"
        size="sm"
        @click="visible = !visible"
      >
        {{ visible ? 'Hide tile layer' : 'Show tile layer' }}
      </Button>
    </template>

    <template #code>
      <ExampleCodeBlock :code="code" filename="TileOverlay.vue" />
    </template>
  </ExampleCard>
</template>
