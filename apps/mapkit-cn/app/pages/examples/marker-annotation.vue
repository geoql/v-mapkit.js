<script setup lang="ts">
  import { VMap, VMarkerAnnotation } from '@geoql/v-mapkit.js';
  import { centerMap, places } from '~/composables/useMapDemo';

  definePageMeta({ layout: 'example' });
  useHead({ title: 'Marker Annotation · mapkit-cn' });

  const { token } = useMapkitToken();

  const markers: Array<{
    at: [number, number];
    title: string;
    subtitle: string;
    color: string;
    glyphText?: string;
  }> = [
    {
      at: [37.7749, -122.4194],
      title: 'San Francisco',
      subtitle: 'City Hall',
      color: '#0a84ff',
      glyphText: '★',
    },
    {
      at: [37.8087, -122.4098],
      title: "Fisherman's Wharf",
      subtitle: 'Pier 39',
      color: '#ff375f',
    },
    {
      at: [37.7694, -122.4862],
      title: 'Golden Gate Park',
      subtitle: 'de Young Museum',
      color: '#30d158',
    },
  ];

  function markerAnnotation(marker: (typeof markers)[number]) {
    return {
      title: marker.title,
      subtitle: marker.subtitle,
      color: marker.color,
      glyphText: marker.glyphText,
      selected: false,
    };
  }

  function onMap(map: unknown): void {
    centerMap(map as never, places.sanFrancisco, 0.14);
  }

  const code = `<script setup lang="ts">
  import { VMap, VMarkerAnnotation } from '@geoql/v-mapkit.js';
<\x2Fscript>

<template>
  <VMap :access-token="token">
    <VMarkerAnnotation
      :coordinates="[37.7749, -122.4194]"
      :annotation="{
        title: 'San Francisco',
        subtitle: 'City Hall',
        color: '#0a84ff',
        glyphText: '★',
      }"
    />
  </VMap>
</template>`;
</script>

<template>
  <ExampleCard
    title="Marker Annotation"
    description="VMarkerAnnotation renders MapKit's classic teardrop pin. Pass a [lat, lng] tuple plus an annotation object for the title, subtitle, color, and an optional glyph. Click a pin to see its callout."
  >
    <ExampleMapContainer>
      <VMap :access-token="token" color-scheme="light" @map="onMap">
        <VMarkerAnnotation
          v-for="marker in markers"
          :key="marker.title"
          :coordinates="marker.at"
          :annotation="markerAnnotation(marker)"
        />
      </VMap>
    </ExampleMapContainer>

    <template #code>
      <ExampleCodeBlock :code="code" filename="MarkerAnnotation.vue" />
    </template>
  </ExampleCard>
</template>
