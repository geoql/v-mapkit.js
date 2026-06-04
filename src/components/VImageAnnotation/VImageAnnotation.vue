<script setup lang="ts">
  import { useMapChild } from '../../composables/useMapChild';

  const props = defineProps<{
    coordinates: [number, number];
    annotation: mapkit.ImageAnnotationConstructorOptions;
  }>();

  const instance = useMapChild<mapkit.ImageAnnotation>({
    create: (mk, map) => {
      const coord = new mk.Coordinate(
        props.coordinates[0],
        props.coordinates[1],
      );
      const a = new mk.ImageAnnotation(coord, props.annotation);
      map.addAnnotation(a);
      return a;
    },
    remove: (map, a) => map.removeAnnotation(a),
    watchSources: () => [props.coordinates, props.annotation],
  });

  defineExpose({ annotation: instance });
</script>

<template><slot /></template>
