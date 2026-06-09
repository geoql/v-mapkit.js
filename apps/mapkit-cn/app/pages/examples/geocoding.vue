<script setup lang="ts">
  import { useGeocoder, VMap, VMarkerAnnotation } from 'v-mapkit.js';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { centerMap, places, toCoordinate } from '~/composables/useMapDemo';

  definePageMeta({ layout: 'example' });
  useSeoMeta({
    title: 'Geocoding · mapkit-cn',
    description:
      'Geocoding example for v-mapkit.js: a live, copy-paste Vue 3 Apple MapKit demo.',
    ogTitle: 'Geocoding',
    ogDescription:
      'Geocoding example for v-mapkit.js: a live, copy-paste Vue 3 Apple MapKit demo.',
    twitterCard: 'summary_large_image',
  });
  defineOgImageComponent('MapkitDoc', {
    title: 'Geocoding',
    description: 'Geocoding example for v-mapkit.js: a live, copy-paste Vue 3 Apple MapKit demo.',
  });

  const { token } = useMapkitToken();
  const { geocode, reverseGeocode, isGeocoding, error } = useGeocoder();

  const address = ref('Apple Park, Cupertino');
  const result = shallowRef<{
    name?: string;
    formattedAddress?: string;
    coordinate?: { latitude: number; longitude: number };
  } | null>(null);

  const pin = computed<[number, number] | null>(() =>
    result.value?.coordinate
      ? [result.value.coordinate.latitude, result.value.coordinate.longitude]
      : null,
  );

  let mapInstance: unknown;

  async function forward(): Promise<void> {
    const response = await geocode(address.value);
    const place = response?.results?.[0];
    if (place) {
      result.value = place as never;
      if (mapInstance && place.coordinate) {
        centerMap(
          mapInstance as never,
          [place.coordinate.latitude, place.coordinate.longitude],
          0.05,
        );
      }
    }
  }

  async function reverse(): Promise<void> {
    const coord = toCoordinate(places.london);
    if (!coord) return;
    const response = await reverseGeocode(coord as never);
    const place = response?.results?.[0];
    if (place) {
      result.value = place as never;
      address.value = (place as { formattedAddress?: string })
        .formattedAddress ?? 'London';
      if (mapInstance) centerMap(mapInstance as never, places.london, 0.05);
    }
  }

  function onMap(map: unknown): void {
    mapInstance = map;
    centerMap(map as never, places.applePark, 0.05);
    void forward();
  }

  const code = `<script setup lang="ts">
  import { VMap, useGeocoder } from 'v-mapkit.js';

  const { geocode, reverseGeocode } = useGeocoder();

  // address → coordinate
  const { results } = await geocode('Apple Park, Cupertino');

  // coordinate → address
  const back = await reverseGeocode(
    new mapkit.Coordinate(51.5074, -0.1278),
  );
<\x2Fscript>`;
</script>

<template>
  <ExampleCard
    title="Geocoding"
    description="useGeocoder converts between addresses and coordinates. geocode turns text into places; reverseGeocode turns a coordinate back into an address. The result is pinned on the map."
  >
    <ExampleMapContainer>
      <VMap :access-token="token" color-scheme="light" @map="onMap">
        <VMarkerAnnotation
          v-if="pin"
          :coordinates="pin"
          :annotation="{ title: result?.name, color: '#0a84ff' }"
        />
      </VMap>
    </ExampleMapContainer>

    <template #controls>
      <div class="flex flex-col gap-3">
        <form
          class="flex flex-wrap items-center gap-2"
          @submit.prevent="forward"
        >
          <Input
            v-model="address"
            placeholder="Enter an address…"
            class="max-w-xs"
          />
          <Button type="submit" size="sm" :disabled="isGeocoding">
            Geocode
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            :disabled="isGeocoding"
            @click="reverse"
          >
            Reverse (London)
          </Button>
        </form>

        <p
          v-if="result?.formattedAddress"
          class="rounded-lg bg-secondary/50 px-3 py-2 text-xs text-muted-foreground"
        >
          {{ result.formattedAddress }}
        </p>
        <p v-if="error" class="text-xs text-destructive">
          {{ error.message }}
        </p>
      </div>
    </template>

    <template #code>
      <ExampleCodeBlock :code="code" filename="Geocoding.vue" />
    </template>
  </ExampleCard>
</template>
