<script setup lang="ts">
  import type { ControlPosition } from '../../types';

  withDefaults(
    defineProps<{
      position?: ControlPosition;
    }>(),
    { position: 'bottom-right' },
  );
</script>

<template>
  <div
    :class="[
      'v-mapkit-control',
      'v-mapkit-control-legend',
      `v-mapkit-control--${position}`,
    ]"
  >
    <slot />
  </div>
</template>

<style scoped>
  .v-mapkit-control {
    position: absolute;
    z-index: 10;
    padding: 8px 12px;
    border-radius: 6px;
    background: rgb(255 255 255 / 90%);
    box-shadow: 0 1px 4px rgb(0 0 0 / 25%);
    font-size: 12px;
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
