<script setup lang="ts">
  import { provide, type Ref } from 'vue';

  import { useMapChild } from '../../composables/use-map-child';
  import { MapKitAnnotationKey } from '../../symbols';

  const props = defineProps<{
    cluster: mapkit.Annotation;
    annotation?: mapkit.MarkerAnnotationConstructorOptions;
  }>();

  const instance = useMapChild<mapkit.MarkerAnnotation>({
    create: (mk, map) => {
      const a = new mk.MarkerAnnotation(
        props.cluster.coordinate,
        props.annotation ?? {},
      );
      a.memberAnnotations = props.cluster.memberAnnotations;
      if (props.cluster.clusteringIdentifier != null) {
        a.clusteringIdentifier = props.cluster.clusteringIdentifier;
      }
      map.addAnnotation(a);
      return a;
    },
    remove: (map, a) => map.removeAnnotation(a),
    watchSources: () => [props.cluster, props.annotation],
  });

  provide(MapKitAnnotationKey, instance as Ref<mapkit.Annotation | undefined>);

  defineExpose({ annotation: instance });
</script>

<template><slot /></template>
