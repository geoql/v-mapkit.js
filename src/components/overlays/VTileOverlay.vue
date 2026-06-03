<script setup lang="ts">
import { useMapChild } from '../../composables/useMapChild';

const props = defineProps<{
  url: mapkit.URLTemplateCallback | string;
  options?: mapkit.TileOverlayConstructorOptions;
}>();

const instance = useMapChild<mapkit.TileOverlay>({
  create: (mk, map) => {
    const o = new mk.TileOverlay(props.url, props.options ?? {});
    map.addTileOverlay(o);
    return o;
  },
  remove: (map, o) => map.removeTileOverlay(o),
  watchSources: () => [props.url, props.options],
});

defineExpose({ overlay: instance });
</script>

<template><slot /></template>
