<script setup lang="ts">
  import { VMap, VMarkerAnnotation } from '@geoql/v-mapkit.js';
  import { centerMap, places } from '~/composables/useMapDemo';

  definePageMeta({ layout: 'example' });
  useHead({ title: 'Clustering · mapkit-cn' });

  const { token } = useMapkitToken();

  // 40 random pins around San Francisco that share a clustering identifier.
  const markers = Array.from({ length: 40 }, (_, index) => {
    const lat = 37.7749 + (Math.random() - 0.5) * 0.12;
    const lng = -122.4194 + (Math.random() - 0.5) * 0.12;
    return { id: index, at: [lat, lng] as [number, number] };
  });

  const CLUSTER_ANNOTATION = { color: '#5e5ce6' } as const;

  // Render clusters as a single blue marker showing the member count.
  function clusterAnnotation(cluster: unknown): unknown {
    const mk = (globalThis as unknown as { mapkit?: typeof mapkit }).mapkit;
    const c = cluster as {
      coordinate: unknown;
      memberAnnotations: unknown[];
    };
    if (!mk) return cluster;
    return new mk.MarkerAnnotation(c.coordinate as never, {
      color: '#0a84ff',
      glyphText: String(c.memberAnnotations.length),
      title: `${c.memberAnnotations.length} places`,
    });
  }

  function onMap(map: unknown): void {
    centerMap(map as never, places.sanFrancisco, 0.18);
  }

  const code = `<script setup lang="ts">
  import { VMap, VMarkerAnnotation } from '@geoql/v-mapkit.js';

  function clusterAnnotation(cluster) {
    return new mapkit.MarkerAnnotation(cluster.coordinate, {
      color: '#0a84ff',
      glyphText: String(cluster.memberAnnotations.length),
    });
  }
<\/script>

<template>
  <VMap :access-token="token" :cluster-annotation="clusterAnnotation">
    <VMarkerAnnotation
      v-for="m in markers"
      :key="m.id"
      :coordinates="m.at"
      clustering-identifier="places"
    />
  </VMap>
</template>`;
</script>

<template>
  <ExampleCard
    title="Clustering"
    description="Give annotations a shared clustering-identifier and MapKit groups nearby pins automatically. The cluster-annotation prop on VMap controls how each group renders. Zoom in to split clusters apart."
  >
    <ExampleMapContainer>
      <VMap
        :access-token="token"
        color-scheme="light"
        :cluster-annotation="clusterAnnotation as never"
        @map="onMap"
      >
        <VMarkerAnnotation
          v-for="marker in markers"
          :key="marker.id"
          :coordinates="marker.at"
          clustering-identifier="places"
          :annotation="CLUSTER_ANNOTATION"
        />
      </VMap>
    </ExampleMapContainer>

    <template #code>
      <ExampleCodeBlock :code="code" filename="Clustering.vue" />
    </template>
  </ExampleCard>
</template>
