import { createGlobalState } from '@vueuse/core';
import { shallowRef } from 'vue';

export const useGlobalState = createGlobalState(() => {
  return {
    // MapKit
    mapkit: shallowRef({} as typeof window.mapkit),
    // Map
    mapInit: false as boolean,
    mapLoad: false as boolean,
    map: shallowRef({} as mapkit.Map),
    // Geocoder
    geocoderLoad: false as boolean,
    geocoder: shallowRef({} as mapkit.Geocoder),
    // Search
    searchLoad: false as boolean,
    search: shallowRef({} as mapkit.Search),
  };
});
