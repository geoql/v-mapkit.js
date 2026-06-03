<script setup lang="ts">
import { markRaw, onBeforeUnmount, onMounted, provide, ref } from 'vue';

import { initMapKit, loadMapKit } from '../composables/useMapKit';
import { MapKitGlobalKey, MapKitInstanceKey, MapKitReadyKey } from '../symbols';
import {
  mapAnnotationOverlayEvents,
  mapDisplayEvents,
  mapInteractionEvents,
  mapUserLocationEvents,
} from '../utils/events';

const props = withDefaults(
  defineProps<{
    accessToken: string;
    version?: string;
    language?: string;
    initOptions?: mapkit.MapKitInitOptions;
    mapOptions?: mapkit.MapConstructorOptions;
  }>(),
  {
    version: '5.x.x',
    language: 'en',
    initOptions: () => ({}) as mapkit.MapKitInitOptions,
    mapOptions: () => ({}) as mapkit.MapConstructorOptions,
  },
);

const emit = defineEmits<{
  map: [map: mapkit.Map];
  'map-initialized': [ok: boolean];
  'map-loaded': [ok: boolean];
  'map-destroyed': [ok: boolean];
  'region-change-start': [e: unknown];
  'region-change-end': [e: unknown];
  'single-tap': [e: unknown];
  'double-tap': [e: unknown];
  'long-press': [e: unknown];
  select: [e: unknown];
  deselect: [e: unknown];
  'user-location-change': [e: unknown];
  'user-location-error': [e: unknown];
}>();

const root = ref<HTMLDivElement>();
const mapkitGlobal = ref<typeof mapkit>();
const map = ref<mapkit.Map>();
const ready = ref(false);

provide(MapKitGlobalKey, mapkitGlobal);
provide(MapKitInstanceKey, map);
provide(MapKitReadyKey, ready);

const allEvents = [
  ...mapDisplayEvents,
  ...mapAnnotationOverlayEvents,
  ...mapUserLocationEvents,
  ...mapInteractionEvents,
];

onMounted(async () => {
  const mk = await loadMapKit(props.version);
  mapkitGlobal.value = markRaw(mk);
  initMapKit(mk, props.accessToken, props.initOptions);
  emit('map-initialized', true);

  map.value = markRaw(new mk.Map(root.value!, props.mapOptions));
  ready.value = true;
  emit('map-loaded', true);
  emit('map', map.value);

  for (const name of allEvents) {
    map.value.addEventListener(name, (event: unknown) => {
      emit(name as never, event as never);
    });
  }
});

onBeforeUnmount(() => {
  if (map.value) {
    map.value.destroy();
    emit('map-destroyed', true);
  }
});

defineExpose({ map, ready, mapkit: mapkitGlobal });
</script>

<template>
  <div ref="root" class="v-mapkit">
    <slot v-bind="{ ready, map }" />
  </div>
</template>

<style scoped>
.v-mapkit {
  width: 100%;
  height: 100%;
}
</style>
