<script setup lang="ts">
  import { useSearch, VMap, VPlaceAnnotation } from '@geoql/v-mapkit';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { centerMap, places } from '~/composables/useMapDemo';

  definePageMeta({ layout: 'example' });
  useSeoMeta({
    title: 'Place Annotation · mapkit-cn',
    description:
      'Place Annotation example for v-mapkit: a live, copy-paste Vue 3 Apple MapKit demo.',
    ogTitle: 'Place Annotation',
    ogDescription:
      'Place Annotation example for v-mapkit: a live, copy-paste Vue 3 Apple MapKit demo.',
    twitterCard: 'summary_large_image',
  });
  defineOgImageComponent('MapkitDoc', {
    title: 'Place Annotation',
    description: 'Place Annotation example for v-mapkit: a live, copy-paste Vue 3 Apple MapKit demo.',
  });

  const { token } = useMapkitToken();
  const { search, isSearching, error } = useSearch();

  const query = ref('coffee');
  // mapkit.Place[]: typed loosely to avoid pulling the ambient namespace here.
  const results = shallowRef<Array<{ coordinate: unknown; name?: string }>>([]);

  async function runSearch(): Promise<void> {
    if (!query.value.trim()) return;
    const response = await search(query.value);
    results.value = (response?.places ?? []) as never;
  }

  function placeAnnotation(place: { name?: string }) {
    return { title: place.name };
  }

  function onMap(map: unknown): void {
    centerMap(map as never, places.sanFrancisco, 0.1);
    void runSearch();
  }

  const code = `<script setup lang="ts">
  import { VMap, VPlaceAnnotation, useSearch } from '@geoql/v-mapkit';

  const { search } = useSearch();
  const results = shallowRef([]);

  async function runSearch() {
    const response = await search('coffee');
    results.value = response.places;
  }
<\x2Fscript>

<template>
  <VMap :access-token="token">
    <VPlaceAnnotation
      v-for="place in results"
      :key="place.id"
      :place="place"
      :annotation="{ title: place.name }"
    />
  </VMap>
</template>`;
</script>

<template>
  <ExampleCard
    title="Place Annotation"
    description="VPlaceAnnotation builds an annotation from a real MapKit Place: the rich result type returned by search, geocoding, and POI queries. Search below and the results drop onto the map as place pins."
  >
    <ExampleMapContainer>
      <VMap :access-token="token" color-scheme="light" @map="onMap">
        <VPlaceAnnotation
          v-for="place in results"
          :key="place.name ?? ''"
          :place="place as never"
          :annotation="placeAnnotation(place)"
        />
      </VMap>
    </ExampleMapContainer>

    <template #controls>
      <div class="flex flex-col gap-2">
        <form
          class="flex flex-wrap items-center gap-2"
          @submit.prevent="runSearch"
        >
          <Input
            v-model="query"
            placeholder="Search places…"
            class="max-w-xs"
          />
          <Button type="submit" size="sm" :disabled="isSearching">
            {{ isSearching ? 'Searching…' : 'Search' }}
          </Button>
          <span class="text-xs text-muted-foreground tabular-nums">
            {{ results.length }} result{{ results.length === 1 ? '' : 's' }}
          </span>
        </form>
        <p v-if="error" class="text-xs text-destructive">
          {{ error.message }}
        </p>
      </div>
    </template>

    <template #code>
      <ExampleCodeBlock :code="code" filename="PlaceAnnotation.vue" />
    </template>
  </ExampleCard>
</template>
