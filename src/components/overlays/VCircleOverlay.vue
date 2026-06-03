<script setup lang="ts">
import { useMapChild } from '../../composables/useMapChild';

const props = defineProps<{
  coordinates: [number, number];
  radius?: number;
  style?: mapkit.StyleConstructorOptions;
}>();

const instance = useMapChild<mapkit.CircleOverlay>({
  create: (mk, map) => {
    const coord = new mk.Coordinate(props.coordinates[0], props.coordinates[1]);
    const style = new mk.Style(props.style ?? {});
    const o = new mk.CircleOverlay(coord, props.radius ?? 1, { style });
    map.addOverlay(o);
    return o;
  },
  remove: (map, o) => map.removeOverlay(o),
  watchSources: () => [props.coordinates, props.radius, props.style],
});

defineExpose({ overlay: instance });
</script>

<template><slot /></template>
