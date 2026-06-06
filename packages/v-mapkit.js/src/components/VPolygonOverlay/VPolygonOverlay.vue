<script setup lang="ts">
  import { useMapChild } from '../../composables/use-map-child';

  const props = defineProps<{
    coordinates: [number, number][];
    style?: mapkit.StyleConstructorOptions;
  }>();

  const instance = useMapChild<mapkit.PolygonOverlay>({
    create: (mk, map) => {
      const points = props.coordinates.map(
        (c) => new mk.Coordinate(c[0], c[1]),
      );
      const style = new mk.Style(props.style ?? {});
      const o = new mk.PolygonOverlay(points, { style });
      map.addOverlay(o);
      return o;
    },
    remove: (map, o) => map.removeOverlay(o),
    watchSources: () => [props.coordinates, props.style],
  });

  defineExpose({ overlay: instance });
</script>

<template><slot /></template>
