import { inject, onBeforeUnmount, ref, watch, type Ref } from 'vue';

import { MapKitGlobalKey, MapKitInstanceKey, MapKitReadyKey } from '../symbols';
import type { UseMapChildOptions } from '../types';

/**
 * Shared lifecycle for declarative map child components (annotations, overlays).
 * Creates the instance once the parent map is ready, reacts to prop changes,
 * and removes the instance on unmount.
 */
export function useMapChild<T>(
  options: UseMapChildOptions<T>,
): Ref<T | undefined> {
  const mk = inject(MapKitGlobalKey);
  const map = inject(MapKitInstanceKey);
  const ready = inject(MapKitReadyKey);

  if (!mk || !map || !ready) {
    throw new Error('Map child components must be used inside a <VMap>');
  }

  const instance = ref<T>() as Ref<T | undefined>;

  watch(
    [map, ready, options.watchSources],
    () => {
      if (!map.value || !mk.value || !ready.value) return;

      if (instance.value) {
        if (options.update) {
          options.update(mk.value, map.value, instance.value);
          return;
        }
        options.remove(map.value, instance.value);
      }
      instance.value = options.create(mk.value, map.value);
    },
    { immediate: true, deep: true, flush: 'post' },
  );

  onBeforeUnmount(() => {
    if (instance.value && map.value) {
      options.remove(map.value, instance.value);
    }
  });

  return instance;
}
