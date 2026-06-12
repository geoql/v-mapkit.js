<script setup lang="ts">
  import { inject } from 'vue';

  import { MapKitGlobalKey, MapKitInstanceKey } from '../../symbols';
  import type { ControlPosition } from '../../types';

  const props = withDefaults(
    defineProps<{
      position?: ControlPosition;
      trackUserLocation?: boolean;
    }>(),
    { position: 'top-right', trackUserLocation: false },
  );

  const emit = defineEmits<{
    locate: [position: GeolocationPosition];
    error: [error: GeolocationPositionError];
  }>();

  const mk = inject(MapKitGlobalKey);
  const map = inject(MapKitInstanceKey);

  const center = (geo: GeolocationPosition) => {
    emit('locate', geo);
    if (!mk?.value || !map?.value) return;
    const coordinate = new mk.value.Coordinate(
      geo.coords.latitude,
      geo.coords.longitude,
    );
    map.value.setCenterAnimated(coordinate, true);
  };

  const locate = () => {
    const geolocation = navigator.geolocation;
    if (!geolocation) return;
    if (props.trackUserLocation) {
      geolocation.watchPosition(center, (e) => emit('error', e));
    } else {
      geolocation.getCurrentPosition(center, (e) => emit('error', e));
    }
  };
</script>

<template>
  <button
    type="button"
    :class="[
      'v-mapkit-control',
      'v-mapkit-control-geolocate',
      `v-mapkit-control--${position}`,
    ]"
    aria-label="Center on my location"
    @click="locate"
  >
    <slot>◎</slot>
  </button>
</template>

<style scoped>
  .v-mapkit-control {
    position: absolute;
    z-index: 10;
    padding: 6px 10px;
    border: none;
    border-radius: 6px;
    background: rgb(255 255 255 / 90%);
    box-shadow: 0 1px 4px rgb(0 0 0 / 25%);
    cursor: pointer;
  }

  .v-mapkit-control--top-left {
    inset: 8px auto auto 8px;
  }

  .v-mapkit-control--top-right {
    inset: 8px 8px auto auto;
  }

  .v-mapkit-control--bottom-left {
    inset: auto auto 8px 8px;
  }

  .v-mapkit-control--bottom-right {
    inset: auto 8px 8px auto;
  }
</style>
