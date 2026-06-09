<script setup lang="ts">
  import { VImageAnnotation, VMap } from 'v-mapkit.js';
  import { centerMap, places } from '~/composables/useMapDemo';

  definePageMeta({ layout: 'example' });
  useSeoMeta({
    title: 'Image Annotation · mapkit-cn',
    description:
      'Image Annotation example for v-mapkit.js: a live, copy-paste Vue 3 Apple MapKit demo.',
    ogTitle: 'Image Annotation',
    ogDescription:
      'Image Annotation example for v-mapkit.js: a live, copy-paste Vue 3 Apple MapKit demo.',
    twitterCard: 'summary_large_image',
  });
  defineOgImageComponent('MapkitDoc', {
    title: 'Image Annotation',
    description: 'Image Annotation example for v-mapkit.js: a live, copy-paste Vue 3 Apple MapKit demo.',
  });

  const { token } = useMapkitToken();

  // An inline SVG data-URI keeps the example self-contained (no asset hosting).
  const pin = (color: string) =>
    `data:image/svg+xml;utf8,` +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="15" fill="${color}" stroke="white" stroke-width="3"/>
        <circle cx="20" cy="20" r="5" fill="white"/>
      </svg>`,
    );

  const markers: Array<{ at: [number, number]; title: string; color: string }> =
    [
      { at: [40.7128, -74.006], title: 'Lower Manhattan', color: '#0a84ff' },
      { at: [40.7484, -73.9857], title: 'Empire State', color: '#ff375f' },
      { at: [40.7812, -73.9665], title: 'Central Park', color: '#30d158' },
    ];

  function imageAnnotation(marker: (typeof markers)[number]) {
    return {
      title: marker.title,
      url: { 1: pin(marker.color) },
      size: { width: 40, height: 40 },
      anchorOffset: new DOMPoint(0, 0),
    };
  }

  function onMap(map: unknown): void {
    centerMap(map as never, places.newYork, 0.12);
  }

  const code = `<script setup lang="ts">
  import { VMap, VImageAnnotation } from 'v-mapkit.js';
<\x2Fscript>

<template>
  <VMap :access-token="token">
    <VImageAnnotation
      :coordinates="[40.7128, -74.006]"
      :annotation="{
        title: 'Lower Manhattan',
        url: { 1: '/pin.png', 2: '/pin@2x.png' },
        size: { width: 40, height: 40 },
      }"
    />
  </VMap>
</template>`;
</script>

<template>
  <ExampleCard
    title="Image Annotation"
    description="VImageAnnotation swaps the default pin for your own artwork. The url field maps device pixel ratios to image variants, so markers stay crisp on retina displays. Here we use inline SVG data-URIs."
  >
    <ExampleMapContainer>
      <VMap :access-token="token" color-scheme="dark" @map="onMap">
        <VImageAnnotation
          v-for="marker in markers"
          :key="marker.title"
          :coordinates="marker.at"
          :annotation="imageAnnotation(marker)"
        />
      </VMap>
    </ExampleMapContainer>

    <template #code>
      <ExampleCodeBlock :code="code" filename="ImageAnnotation.vue" />
    </template>
  </ExampleCard>
</template>
