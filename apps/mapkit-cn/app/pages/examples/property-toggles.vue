<script setup lang="ts">
  import { VMap } from '@geoql/v-mapkit.js';
  import { centerMap, places } from '~/composables/useMapDemo';

  definePageMeta({ layout: 'example' });
  useHead({ title: 'Property Toggles · mapkit-cn' });

  const { token } = useMapkitToken();

  const showsCompass = ref(true);
  const showsZoomControl = ref(true);
  const showsScale = ref(true);
  const showsMapTypeControl = ref(false);
  const showsUserLocationControl = ref(false);
  const showsPointsOfInterest = ref(true);

  // VMap maps boolean compass/scale toggles to 'adaptive' | 'hidden'.
  const compass = computed(() => (showsCompass.value ? 'adaptive' : 'hidden'));
  const scale = computed(() => (showsScale.value ? 'adaptive' : 'hidden'));

  const toggles = [
    { model: showsCompass, label: 'Compass' },
    { model: showsZoomControl, label: 'Zoom control' },
    { model: showsScale, label: 'Scale' },
    { model: showsMapTypeControl, label: 'Map type control' },
    { model: showsUserLocationControl, label: 'User location control' },
    { model: showsPointsOfInterest, label: 'Points of interest' },
  ];

  function onMap(map: unknown): void {
    centerMap(map as never, places.sanFrancisco, 0.08);
  }

  const code = `<template>
  <VMap
    :access-token="token"
    :shows-compass="showsCompass ? 'adaptive' : 'hidden'"
    :shows-zoom-control="showsZoomControl"
    :shows-scale="showsScale ? 'adaptive' : 'hidden'"
    :shows-map-type-control="showsMapTypeControl"
    :shows-user-location-control="showsUserLocationControl"
    :shows-points-of-interest="showsPointsOfInterest"
  />
</template>`;
</script>

<template>
  <ExampleCard
    title="Property Toggles"
    description="VMap exposes the full set of MapKit chrome as reactive props. Flip the switches below and watch the compass, zoom control, scale, and other UI appear or disappear live."
  >
    <ExampleMapContainer>
      <VMap
        :access-token="token"
        color-scheme="light"
        :shows-compass="compass"
        :shows-zoom-control="showsZoomControl"
        :shows-scale="scale"
        :shows-map-type-control="showsMapTypeControl"
        :shows-user-location-control="showsUserLocationControl"
        :shows-points-of-interest="showsPointsOfInterest"
        @map="onMap"
      />
    </ExampleMapContainer>

    <template #controls>
      <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <label
          v-for="toggle in toggles"
          :key="toggle.label"
          class="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:bg-accent"
        >
          <input
            v-model="toggle.model.value"
            type="checkbox"
            class="size-4 accent-primary"
          />
          <span class="text-foreground">{{ toggle.label }}</span>
        </label>
      </div>
    </template>

    <template #code>
      <ExampleCodeBlock :code="code" filename="PropertyToggles.vue" />
    </template>
  </ExampleCard>
</template>
