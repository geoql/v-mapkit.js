import { createGlobalState } from '@vueuse/core';
import { reactive, shallowRef } from 'vue';

export const useGlobalState = createGlobalState(() => {
  return {
    mapkit: shallowRef({} as typeof window.mapkit),
    ui: reactive({
      init: false as boolean,
      load: false as boolean,
      geocoderLoad: false as boolean,
      searchLoad: false as boolean,
    }),
    map: shallowRef({} as mapkit.Map),
    geocoder: shallowRef({} as mapkit.Geocoder),
    search: shallowRef({} as mapkit.Search),
  };
});
