<script setup lang="ts">
  import { provide, type Ref } from 'vue';

  import { useMapChild } from '../../composables/use-map-child';
  import { MapKitAnnotationKey } from '../../symbols';

  const props = defineProps<{
    place: mapkit.Place;
    annotation?: mapkit.AnnotationConstructorOptions;
    clusteringIdentifier?: string;
  }>();

  const instance = useMapChild<mapkit.PlaceAnnotation>({
    create: (mk, map) => {
      const a = new mk.PlaceAnnotation(props.place, props.annotation ?? {});
      if (props.clusteringIdentifier != null) {
        a.clusteringIdentifier = props.clusteringIdentifier;
      }
      map.addAnnotation(a);
      return a;
    },
    remove: (map, a) => map.removeAnnotation(a),
    watchSources: () => [
      props.place,
      props.annotation,
      props.clusteringIdentifier,
    ],
  });

  provide(MapKitAnnotationKey, instance as Ref<mapkit.Annotation | undefined>);

  defineExpose({ annotation: instance });
</script>

<template><slot /></template>
