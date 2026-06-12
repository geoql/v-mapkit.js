<script setup lang="ts">
  import { computed, inject } from 'vue';

  import { MapKitGlobalKey, MapKitInstanceKey } from '../../symbols';
  import type { ControlPosition } from '../../types';

  const props = withDefaults(
    defineProps<{
      position?: ControlPosition;
      mapTypes?: Array<{ type: mapkit.MapType; label: string }>;
    }>(),
    { position: 'top-right', mapTypes: undefined },
  );

  const mk = inject(MapKitGlobalKey);
  const map = inject(MapKitInstanceKey);

  const defaults = computed<Array<{ type: mapkit.MapType; label: string }>>(
    () => [
      { type: 'standard', label: 'Standard' },
      { type: 'satellite', label: 'Satellite' },
      { type: 'hybrid', label: 'Hybrid' },
      { type: 'mutedStandard', label: 'Muted' },
    ],
  );

  const options = computed(() => props.mapTypes ?? defaults.value);

  const onChange = (event: Event) => {
    const value = (event.target as HTMLSelectElement).value as mapkit.MapType;
    if (map?.value && mk?.value) map.value.mapType = value;
  };
</script>

<template>
  <div
    :class="[
      'v-mapkit-control',
      'v-mapkit-control-layer-switcher',
      `v-mapkit-control--${position}`,
    ]"
  >
    <select aria-label="Map type" @change="onChange">
      <option v-for="opt in options" :key="opt.type" :value="opt.type">
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>

<style scoped>
  .v-mapkit-control {
    position: absolute;
    z-index: 10;
    padding: 4px;
    border-radius: 6px;
    background: rgb(255 255 255 / 90%);
    box-shadow: 0 1px 4px rgb(0 0 0 / 25%);
  }

  .v-mapkit-control select {
    border: none;
    background: transparent;
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
