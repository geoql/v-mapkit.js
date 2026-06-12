<script setup lang="ts">
  import { ref } from 'vue';

  import type { ControlPosition } from '../../types';

  withDefaults(
    defineProps<{
      position?: ControlPosition;
    }>(),
    { position: 'top-right' },
  );

  const root = ref<HTMLButtonElement>();

  const container = (): HTMLElement =>
    (root.value?.closest('.v-mapkit') as HTMLElement | null) ??
    document.documentElement;

  const toggle = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      container().requestFullscreen?.();
    }
  };
</script>

<template>
  <button
    ref="root"
    type="button"
    :class="[
      'v-mapkit-control',
      'v-mapkit-control-fullscreen',
      `v-mapkit-control--${position}`,
    ]"
    aria-label="Toggle fullscreen"
    @click="toggle"
  >
    <slot>⛶</slot>
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
