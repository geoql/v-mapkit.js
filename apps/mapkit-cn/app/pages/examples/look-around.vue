<script setup lang="ts">
  import {
    useGeocoder,
    VLookAround,
    VMap,
    VMarkerAnnotation,
  } from '@geoql/v-mapkit.js';
  import { centerMap, places } from '~/composables/useMapDemo';

  definePageMeta({ layout: 'example' });
  useSeoMeta({
    title: 'Look Around · mapkit-cn',
    description:
      'Look Around example for v-mapkit.js: a live, copy-paste Vue 3 Apple MapKit demo.',
    ogTitle: 'Look Around',
    ogDescription:
      'Look Around example for v-mapkit.js: a live, copy-paste Vue 3 Apple MapKit demo.',
    twitterCard: 'summary_large_image',
  });
  defineOgImageComponent('MapkitDoc', {
    title: 'Look Around',
    description: 'Look Around example for v-mapkit.js: a live, copy-paste Vue 3 Apple MapKit demo.',
  });

  const { token } = useMapkitToken();
  const { geocode } = useGeocoder();

  // VLookAround needs a mapkit.Place: fetch one once the runtime is loaded.
  const place = shallowRef<unknown>(null);
  const marker: [number, number] = [37.7956, -122.3934]; // Ferry Building, SF

  async function loadPlace(): Promise<void> {
    const response = await geocode('Ferry Building, San Francisco');
    place.value = response?.results?.[0] ?? null;
  }

  function onMap(map: unknown): void {
    centerMap(map as never, places.sanFrancisco, 0.04);
    void loadPlace();
  }

  const code = `<script setup lang="ts">
  import { VLookAround, useGeocoder } from '@geoql/v-mapkit.js';

  const { geocode } = useGeocoder();
  const place = shallowRef(null);

  const { results } = await geocode('Ferry Building, San Francisco');
  place.value = results[0];
<\x2Fscript>

<template>
  <!-- VLookAround is standalone: not a child of VMap -->
  <VLookAround
    v-if="place"
    :place="place"
    :options="{ showsRoadLabels: true }"
  />
</template>`;
</script>

<template>
  <ExampleCard
    title="Look Around"
    description="VLookAround embeds Apple's interactive street-level imagery. It's a standalone component: pass it a MapKit Place (from search or geocoding) and users can pan and move through the scene."
  >
    <div class="grid gap-4 lg:grid-cols-2">
      <ExampleMapContainer height="h-[24rem]">
        <VMap :access-token="token" color-scheme="light" @map="onMap">
          <VMarkerAnnotation
            :coordinates="marker"
            :annotation="{ title: 'Ferry Building', color: '#0a84ff' }"
          />
        </VMap>
      </ExampleMapContainer>

      <div
        class="relative h-[24rem] w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm"
      >
        <ClientOnly>
          <div v-if="place" class="absolute inset-0">
            <VLookAround
              :place="place as never"
              :options="{ showsRoadLabels: true }"
            />
          </div>
          <div
            v-else
            class="absolute inset-0 flex items-center justify-center bg-secondary/30 text-sm text-muted-foreground"
          >
            Loading Look Around…
          </div>
        </ClientOnly>
      </div>
    </div>

    <template #code>
      <ExampleCodeBlock :code="code" filename="LookAround.vue" />
    </template>
  </ExampleCard>
</template>
