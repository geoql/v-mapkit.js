<script setup lang="ts">
  import { provide } from 'vue';

  import { useMapChild } from '../../composables/use-map-child';
  import { MapKitAnnotationKey } from '../../symbols';

  const props = defineProps<{
    coordinates: [number, number];
    element: () => HTMLElement;
    annotation?: mapkit.AnnotationConstructorOptions;
    clusteringIdentifier?: string;
  }>();

  const instance = useMapChild<mapkit.Annotation>({
    create: (mk, map) => {
      const coord = new mk.Coordinate(
        props.coordinates[0],
        props.coordinates[1],
      );
      const a = new mk.Annotation(
        coord,
        () => props.element(),
        props.annotation ?? {},
      );
      if (props.clusteringIdentifier != null) {
        a.clusteringIdentifier = props.clusteringIdentifier;
      }
      map.addAnnotation(a);
      return a;
    },
    remove: (map, a) => map.removeAnnotation(a),
    watchSources: () => [
      props.coordinates,
      props.element,
      props.annotation,
      props.clusteringIdentifier,
    ],
  });

  provide(MapKitAnnotationKey, instance);

  defineExpose({ annotation: instance });
</script>

<template><slot /></template>
