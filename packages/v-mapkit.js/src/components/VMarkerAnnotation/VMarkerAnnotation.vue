<script setup lang="ts">
  import { provide, type Ref } from 'vue';

  import { useMapChild } from '../../composables/use-map-child';
  import { MapKitAnnotationKey } from '../../symbols';

  const props = defineProps<{
    coordinates: [number, number];
    annotation?: mapkit.MarkerAnnotationConstructorOptions;
    clusteringIdentifier?: string;
  }>();

  const instance = useMapChild<mapkit.MarkerAnnotation>({
    create: (mk, map) => {
      const coord = new mk.Coordinate(
        props.coordinates[0],
        props.coordinates[1],
      );
      const a = new mk.MarkerAnnotation(coord, props.annotation ?? {});
      if (props.clusteringIdentifier != null) {
        a.clusteringIdentifier = props.clusteringIdentifier;
      }
      map.addAnnotation(a);
      return a;
    },
    remove: (map, a) => map.removeAnnotation(a),
    watchSources: () => [
      props.coordinates,
      props.annotation,
      props.clusteringIdentifier,
    ],
  });

  provide(MapKitAnnotationKey, instance as Ref<mapkit.Annotation | undefined>);

  defineExpose({ annotation: instance });
</script>

<template><slot /></template>
