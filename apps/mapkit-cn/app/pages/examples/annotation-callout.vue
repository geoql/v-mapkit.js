<script setup lang="ts">
  import {
    VAnnotationCallout,
    VMap,
    VMarkerAnnotation,
  } from '@geoql/v-mapkit.js';
  import { centerMap, places } from '~/composables/useMapDemo';

  definePageMeta({ layout: 'example' });
  useSeoMeta({
    title: 'Annotation Callout · mapkit-cn',
    description:
      'Annotation Callout example for v-mapkit.js: a live, copy-paste Vue 3 Apple MapKit demo.',
    ogTitle: 'Annotation Callout',
    ogDescription:
      'Annotation Callout example for v-mapkit.js: a live, copy-paste Vue 3 Apple MapKit demo.',
    twitterCard: 'summary_large_image',
  });
  defineOgImageComponent('MapkitDoc', {
    title: 'Annotation Callout',
    description: 'Annotation Callout example for v-mapkit.js: a live, copy-paste Vue 3 Apple MapKit demo.',
  });

  const { token } = useMapkitToken();

  function onMap(map: unknown): void {
    centerMap(map as never, places.applePark, 0.04);
  }

  const code = `<script setup lang="ts">
  import {
    VMap,
    VMarkerAnnotation,
    VAnnotationCallout,
  } from '@geoql/v-mapkit.js';
<\x2Fscript>

<template>
  <VMap :access-token="token">
    <VMarkerAnnotation
      :coordinates="[37.3349, -122.009]"
      :annotation="{ title: 'Apple Park', selected: true }"
    >
      <VAnnotationCallout>
        <div class="callout">
          <h3>Apple Park</h3>
          <p>One Apple Park Way, Cupertino</p>
          <a href="#">Directions →</a>
        </div>
      </VAnnotationCallout>
    </VMarkerAnnotation>
  </VMap>
</template>`;
</script>

<template>
  <ExampleCard
    title="Annotation Callout"
    description="Nest VAnnotationCallout inside any annotation to replace the default bubble with your own markup. It wires itself up as the annotation's callout delegate. Click the pin to open it."
  >
    <ExampleMapContainer>
      <VMap :access-token="token" color-scheme="light" @map="onMap">
        <VMarkerAnnotation
          :coordinates="places.applePark"
          :annotation="{
            title: 'Apple Park',
            color: '#0a84ff',
            selected: true,
          }"
        >
          <VAnnotationCallout>
            <div
              class="w-56 space-y-2 rounded-xl bg-white p-4 text-left shadow-xl"
            >
              <h3 class="text-sm font-semibold text-neutral-900">
                Apple Park
              </h3>
              <p class="text-xs leading-relaxed text-neutral-500">
                One Apple Park Way, Cupertino, CA 95014
              </p>
              <a
                href="https://maps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1 text-xs font-medium text-[#0a84ff]"
              >
                Directions
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </VAnnotationCallout>
        </VMarkerAnnotation>
      </VMap>
    </ExampleMapContainer>

    <template #code>
      <ExampleCodeBlock :code="code" filename="AnnotationCallout.vue" />
    </template>
  </ExampleCard>
</template>
