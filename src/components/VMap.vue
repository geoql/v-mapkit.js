<script setup lang="ts">
import { onBeforeUnmount, onMounted, provide, ref, shallowRef } from 'vue';

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
  'region-change-start': [event: unknown];
  'region-change-end': [event: unknown];
  'rotation-start': [event: unknown];
  'rotation-end': [event: unknown];
  'scroll-start': [event: unknown];
  'scroll-end': [event: unknown];
  'zoom-start': [event: unknown];
  'zoom-end': [event: unknown];
  'map-type-change': [event: unknown];
  select: [event: unknown];
  deselect: [event: unknown];
  'drag-start': [event: unknown];
  dragging: [event: unknown];
  'drag-end': [event: unknown];
  'user-location-change': [event: unknown];
  'user-location-error': [event: unknown];
  'single-tap': [event: unknown];
  'double-tap': [event: unknown];
  'long-press': [event: unknown];
}>();

const root = ref<HTMLDivElement>();
const mapkitGlobal = shallowRef<typeof mapkit>();
const map = shallowRef<mapkit.Map>();
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

// Vue types `emit` as an intersection of per-event call signatures, so calling
// it with a union-typed event name is rejected (TS2769). Narrow it once to a
// single signature whose name is the real `MapEvents` key union (not `never`).
const emitMapEvent = emit as (
  name: keyof mapkit.MapEvents<string>,
  event: unknown,
) => void;

const handlers: Array<{
  name: keyof mapkit.MapEvents<string>;
  fn: (e: unknown) => void;
}> = [];

let isUnmounted = false;
let inflight: mapkit.Map | undefined;

onBeforeUnmount(() => {
  isUnmounted = true;
  const m = map.value ?? inflight;
  if (m) {
    for (const { name, fn } of handlers) m.removeEventListener?.(name, fn);
    m.destroy();
    emit('map-destroyed', true);
  }
});

onMounted(async () => {
  try {
    const mk = await loadMapKit(props.version);
    if (isUnmounted) return;
    mapkitGlobal.value = mk;
    initMapKit(mk, props.accessToken, {
      language: props.language,
      ...props.initOptions,
    });
    emit('map-initialized', true);

    const created = new mk.Map(root.value!, props.mapOptions);
    inflight = created;
    if (isUnmounted) {
      created.destroy();
      return;
    }
    map.value = created;
    ready.value = true;
    emit('map-loaded', true);
    emit('map', created);

    for (const name of allEvents) {
      const fn = (event: unknown) => emitMapEvent(name, event);
      created.addEventListener(name, fn);
      handlers.push({ name, fn });
    }
  } catch {
    if (!isUnmounted) emit('map-loaded', false);
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
