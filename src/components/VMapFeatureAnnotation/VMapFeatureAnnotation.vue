<script setup lang="ts">
  import { provide, type Ref } from 'vue';

  import { useMapChild } from '../../composables/useMapChild';
  import { MapKitAnnotationKey } from '../../symbols';

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

  provide(MapKitAnnotationKey, instance as Ref<mapkit.Annotation | undefined>);

  defineExpose({ annotation: instance });
</script>

<template><slot /></template>
