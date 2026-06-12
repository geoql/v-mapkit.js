<script setup lang="ts">
  import { VCircleOverlay, VMap } from '@geoql/v-mapkit';
  import { Button } from '@/components/ui/button';
  import { centerMap, places } from '~/composables/useMapDemo';

  definePageMeta({ layout: 'example' });
  useSeoMeta({
    title: 'Circle Overlay · mapkit-cn',
    description:
      'Circle Overlay example for v-mapkit: a live, copy-paste Vue 3 Apple MapKit demo.',
    ogTitle: 'Circle Overlay',
    ogDescription:
      'Circle Overlay example for v-mapkit: a live, copy-paste Vue 3 Apple MapKit demo.',
    twitterCard: 'summary_large_image',
  });
  defineOgImageComponent('MapkitDoc', {
    title: 'Circle Overlay',
    description: 'Circle Overlay example for v-mapkit: a live, copy-paste Vue 3 Apple MapKit demo.',
  });

  const { token } = useMapkitToken();

  const radius = ref(1200);
  const radii = [400, 1200, 3000];

  const style = {
    fillColor: '#0a84ff',
    fillOpacity: 0.18,
    strokeColor: '#0a84ff',
    lineWidth: 2,
  };

  function onMap(map: unknown): void {
    centerMap(map as never, places.sanFrancisco, 0.12);
  }

  const code = `<script setup lang="ts">
  import { VMap, VCircleOverlay } from '@geoql/v-mapkit';
<\x2Fscript>

<template>
  <VMap :access-token="token">
    <VCircleOverlay
      :coordinates="[37.7749, -122.4194]"
      :radius="1200"
      :style="{
        fillColor: '#0a84ff',
        fillOpacity: 0.18,
        strokeColor: '#0a84ff',
        lineWidth: 2,
      }"
    />
  </VMap>
</template>`;
</script>

<template>
  <ExampleCard
    title="Circle Overlay"
    description="VCircleOverlay draws a geographic circle from a center coordinate and a radius in meters: ideal for service ranges, geofences, and proximity bubbles. Adjust the radius below."
  >
    <ExampleMapContainer>
      <VMap :access-token="token" color-scheme="light" @map="onMap">
        <VCircleOverlay
          :coordinates="places.sanFrancisco"
          :radius="radius"
          :style="style"
        />
      </VMap>
    </ExampleMapContainer>

    <template #controls>
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-xs font-medium text-muted-foreground">Radius</span>
        <Button
          v-for="value in radii"
          :key="value"
          :variant="radius === value ? 'default' : 'outline'"
          size="sm"
          class="tabular-nums"
          @click="radius = value"
        >
          {{ value }}m
        </Button>
      </div>
    </template>

    <template #code>
      <ExampleCodeBlock :code="code" filename="CircleOverlay.vue" />
    </template>
  </ExampleCard>
</template>
