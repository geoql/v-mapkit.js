<script setup lang="ts">
  import { useMapChild } from '../../composables/useMapChild';

  const props = defineProps<{
    place: mapkit.Place;
    annotation?: mapkit.AnnotationConstructorOptions;
  }>();

  const instance = useMapChild<mapkit.PlaceAnnotation>({
    create: (mk, map) => {
      const a = new mk.PlaceAnnotation(props.place, props.annotation ?? {});
      map.addAnnotation(a);
      return a;
    },
    remove: (map, a) => map.removeAnnotation(a),
    watchSources: () => [props.place, props.annotation],
  });

  defineExpose({ annotation: instance });
</script>

<template><slot /></template>
