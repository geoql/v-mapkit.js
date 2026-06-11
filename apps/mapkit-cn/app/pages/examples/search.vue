<script setup lang="ts">
  import { useSearch, VMap, VMarkerAnnotation } from '@geoql/v-mapkit.js';
  import { Input } from '@/components/ui/input';
  import { centerMap, places } from '~/composables/useMapDemo';

  definePageMeta({ layout: 'example' });
  useSeoMeta({
    title: 'Search · mapkit-cn',
    description:
      'Search example for v-mapkit.js: a live, copy-paste Vue 3 Apple MapKit demo.',
    ogTitle: 'Search',
    ogDescription:
      'Search example for v-mapkit.js: a live, copy-paste Vue 3 Apple MapKit demo.',
    twitterCard: 'summary_large_image',
  });
  defineOgImageComponent('MapkitDoc', {
    title: 'Search',
    description: 'Search example for v-mapkit.js: a live, copy-paste Vue 3 Apple MapKit demo.',
  });

  const { token } = useMapkitToken();
  const { autocomplete, search, isSearching, error } = useSearch();

  const query = ref('');
  const suggestions = shallowRef<Array<{ displayLines?: string[] }>>([]);
  const results = shallowRef<
    Array<{ coordinate: { latitude: number; longitude: number }; name?: string }>
  >([]);

  const debounced = useDebounceFn(async (value: string) => {
    if (!value.trim()) {
      suggestions.value = [];
      return;
    }
    const response = await autocomplete(value);
    suggestions.value = (response?.results ?? []) as never;
  }, 250);

  watch(query, (value) => debounced(value));

  async function runSearch(value: string): Promise<void> {
    query.value = value;
    suggestions.value = [];
    const response = await search(value);
    results.value = (response?.places ?? []) as never;
  }

  function placeCoordinates(place: { coordinate: { latitude: number; longitude: number } }) {
    return [place.coordinate.latitude, place.coordinate.longitude] as [number, number];
  }

  function placeAnnotation(place: { name?: string }) {
    return { title: place.name, color: '#0a84ff' };
  }

  function onMap(map: unknown): void {
    centerMap(map as never, places.newYork, 0.3);
  }

  const code = `<script setup lang="ts">
  import { VMap, VMarkerAnnotation, useSearch } from '@geoql/v-mapkit.js';

  const { autocomplete, search } = useSearch();
  const suggestions = shallowRef([]);

  // live autocomplete as the user types
  async function onInput(value) {
    const res = await autocomplete(value);
    suggestions.value = res.results;
  }

  // full search → place results
  async function runSearch(value) {
    const res = await search(value);
    results.value = res.places;
  }
<\x2Fscript>`;
</script>

<template>
  <ExampleCard
    title="Search"
    description="useSearch wraps MapKit's search service with promise-based autocomplete and search methods. Type to get live suggestions, then pick one to drop results on the map."
  >
    <ExampleMapContainer>
      <VMap :access-token="token" color-scheme="light" @map="onMap">
        <VMarkerAnnotation
          v-for="(place, index) in results"
          :key="index"
          :coordinates="placeCoordinates(place)"
          :annotation="placeAnnotation(place)"
        />
      </VMap>
    </ExampleMapContainer>

    <template #controls>
      <div class="relative max-w-md">
        <Input
          v-model="query"
          placeholder="Search for a place…"
          @keydown.enter="runSearch(query)"
        />
        <ul
          v-if="suggestions.length"
          class="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-border bg-popover shadow-lg"
        >
          <li
            v-for="(item, index) in suggestions.slice(0, 6)"
            :key="index"
          >
            <button
              type="button"
              class="flex w-full flex-col gap-0.5 px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
              @click="runSearch((item.displayLines ?? []).join(' '))"
            >
              <span class="text-foreground">
                {{ (item.displayLines ?? [])[0] }}
              </span>
              <span
                v-if="(item.displayLines ?? [])[1]"
                class="text-xs text-muted-foreground"
              >
                {{ (item.displayLines ?? [])[1] }}
              </span>
            </button>
          </li>
        </ul>
        <p
          v-if="isSearching"
          class="mt-1.5 text-xs text-muted-foreground"
        >
          Searching…
        </p>
        <p v-if="error" class="mt-1.5 text-xs text-destructive">
          {{ error.message }}
        </p>
      </div>
    </template>

    <template #code>
      <ExampleCodeBlock :code="code" filename="Search.vue" />
    </template>
  </ExampleCard>
</template>
