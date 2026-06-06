<script setup lang="ts">
  import {
    useGeocoder,
    VLookAroundPreview,
    VMap,
    VMarkerAnnotation,
  } from '@geoql/v-mapkit.js';
  import { Input } from '@/components/ui/input';
  import { Button } from '@/components/ui/button';
  import { centerMap, places } from '~/composables/useMapDemo';

  definePageMeta({ layout: 'example' });
  useHead({ title: 'Look Around Preview · mapkit-cn' });

  const { token } = useMapkitToken();
  const { geocode } = useGeocoder();

  const query = ref('Golden Gate Bridge');
  const place = shallowRef<{
    coordinate?: { latitude: number; longitude: number };
  } | null>(null);

  const marker = computed<[number, number] | null>(() =>
    place.value?.coordinate
      ? [place.value.coordinate.latitude, place.value.coordinate.longitude]
      : null,
  );

  let mapInstance: unknown;

  async function loadPlace(): Promise<void> {
    const response = await geocode(query.value);
    const found = response?.results?.[0];
    place.value = (found as never) ?? null;
    if (found?.coordinate && mapInstance) {
      centerMap(
        mapInstance as never,
        [found.coordinate.latitude, found.coordinate.longitude],
        0.05,
      );
    }
  }

  function onMap(map: unknown): void {
    mapInstance = map;
    centerMap(map as never, places.goldenGate, 0.05);
    void loadPlace();
  }

  const code = `<script setup lang="ts">
  import { VLookAroundPreview, useGeocoder } from '@geoql/v-mapkit.js';

  const { geocode } = useGeocoder();
  const place = shallowRef(null);

  const { results } = await geocode('Golden Gate Bridge');
  place.value = results[0];
<\x2Fscript>

<template>
  <VLookAroundPreview v-if="place" :place="place" />
</template>`;
</script>

<template>
  <ExampleCard
    title="Look Around Preview"
    description="VLookAroundPreview shows a static, tappable Look Around thumbnail — perfect for cards and list items. Search a landmark and the preview updates. Tapping it opens the full interactive view."
  >
    <div class="grid gap-4 lg:grid-cols-2">
      <ExampleMapContainer height="h-[22rem]">
        <VMap :access-token="token" color-scheme="dark" @map="onMap">
          <VMarkerAnnotation
            v-if="marker"
            :coordinates="marker"
            :annotation="{ color: '#0a84ff' }"
          />
        </VMap>
      </ExampleMapContainer>

      <div
        class="relative h-[22rem] w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm"
      >
        <ClientOnly>
          <div v-if="place" class="absolute inset-0">
            <VLookAroundPreview :place="place as never" />
          </div>
          <div
            v-else
            class="absolute inset-0 flex items-center justify-center bg-secondary/30 text-sm text-muted-foreground"
          >
            No preview yet
          </div>
        </ClientOnly>
      </div>
    </div>

    <template #controls>
      <form class="flex flex-wrap items-center gap-2" @submit.prevent="loadPlace">
        <Input v-model="query" placeholder="Search a landmark…" class="max-w-xs" />
        <Button type="submit" size="sm">Preview</Button>
      </form>
    </template>

    <template #code>
      <ExampleCodeBlock :code="code" filename="LookAroundPreview.vue" />
    </template>
  </ExampleCard>
</template>
