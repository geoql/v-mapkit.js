<script setup lang="ts">
  import {
    VControlLegend,
    VMap,
    VMarkerAnnotation,
  } from '@geoql/v-mapkit.js';
  import { centerMap, places } from '~/composables/useMapDemo';

  definePageMeta({ layout: 'example' });
  useHead({ title: 'Legend · mapkit-cn' });

  const { token } = useMapkitToken();

  const legend = [
    { color: '#0a84ff', label: 'Offices' },
    { color: '#30d158', label: 'Parks' },
    { color: '#ff375f', label: 'Transit' },
  ];

  const pins: Array<{ at: [number, number]; color: string }> = [
    { at: [37.3349, -122.009], color: '#0a84ff' },
    { at: [37.3318, -122.0312], color: '#30d158' },
    { at: [37.3239, -122.0322], color: '#ff375f' },
  ];

  function onMap(map: unknown): void {
    centerMap(map as never, places.cupertino, 0.05);
  }

  const code = `<script setup lang="ts">
  import { VMap, VControlLegend } from '@geoql/v-mapkit.js';
<\/script>

<template>
  <VMap :access-token="token">
    <VControlLegend position="bottom-right">
      <div class="legend">
        <span style="background:#0a84ff"></span> Offices
        <span style="background:#30d158"></span> Parks
      </div>
    </VControlLegend>
  </VMap>
</template>`;
</script>

<template>
  <ExampleCard
    title="Legend"
    description="VControlLegend positions a panel over the map and renders whatever you put in its slot. Use it to explain marker colors, overlay meaning, or data sources."
  >
    <ExampleMapContainer>
      <VMap :access-token="token" color-scheme="light" @map="onMap">
        <VMarkerAnnotation
          v-for="pin in pins"
          :key="pin.color"
          :coordinates="pin.at"
          :annotation="{ color: pin.color }"
        />
        <VControlLegend position="bottom-right">
          <div
            class="space-y-1.5 rounded-lg bg-white/90 p-3 text-left shadow-md backdrop-blur"
          >
            <p class="text-[0.6875rem] font-semibold uppercase tracking-wide text-neutral-500">
              Legend
            </p>
            <div
              v-for="item in legend"
              :key="item.label"
              class="flex items-center gap-2 text-xs text-neutral-700"
            >
              <span
                class="size-2.5 rounded-full"
                :style="{ backgroundColor: item.color }"
              ></span>
              {{ item.label }}
            </div>
          </div>
        </VControlLegend>
      </VMap>
    </ExampleMapContainer>

    <template #code>
      <ExampleCodeBlock :code="code" filename="Legend.vue" />
    </template>
  </ExampleCard>
</template>
