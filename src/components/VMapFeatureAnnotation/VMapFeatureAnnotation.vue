<script setup lang="ts">
  import { useMapChild } from '../../composables/useMapChild';

  const props = defineProps<{
    feature: mapkit.MapFeature;
    annotation?: mapkit.AnnotationConstructorOptions;
  }>();

  const instance = useMapChild<mapkit.MapFeatureAnnotation>({
    create: (mk, map) => {
      const a = new mk.MapFeatureAnnotation(
        props.feature,
        props.annotation ?? {},
      );
      map.addAnnotation(a);
      return a;
    },
    remove: (map, a) => map.removeAnnotation(a),
    watchSources: () => [props.feature, props.annotation],
  });

  defineExpose({ annotation: instance });
</script>

<template><slot /></template>
