import { inject, ref } from 'vue';

import { MapKitGlobalKey } from '../symbols';
import type { UseGeocoderReturn } from '../types';

/**
 * Wraps `mapkit.Geocoder` to provide promise-based forward and reverse
 * geocoding.
 *
 * Resolves the `mapkit` global from the nearest `<VMap>` (via `MapKitGlobalKey`)
 * and falls back to `window.mapkit` so it can be used outside a map context.
 *
 * @example
 * const { geocode, reverseGeocode } = useGeocoder();
 * const { results } = await geocode('1 Infinite Loop, Cupertino');
 */
export function useGeocoder(): UseGeocoderReturn {
  const injected = inject(MapKitGlobalKey, undefined);
  const isGeocoding = ref(false);
  const error = ref<Error | null>(null);

  function resolveMapKit(): typeof mapkit {
    const mk = injected?.value ?? window.mapkit;
    if (!mk) {
      throw new Error('MapKit JS is not initialized; call useMapKit first');
    }
    return mk;
  }

  function geocode(
    query: string,
    options?: mapkit.GeocoderLookupOptions,
  ): Promise<mapkit.GeocoderResponse> {
    isGeocoding.value = true;
    error.value = null;
    return new Promise<mapkit.GeocoderResponse>((resolve, reject) => {
      try {
        const mk = resolveMapKit();
        const service = new mk.Geocoder();
        service.lookup(
          query,
          (err, data) => {
            isGeocoding.value = false;
            if (err) {
              error.value = err;
              reject(err);
            } else {
              resolve(data);
            }
          },
          options,
        );
      } catch (err) {
        isGeocoding.value = false;
        error.value = err as Error;
        reject(err);
      }
    });
  }

  function reverseGeocode(
    coordinate: mapkit.Coordinate,
    options?: Pick<mapkit.GeocoderConstructorOptions, 'language'>,
  ): Promise<mapkit.GeocoderResponse> {
    isGeocoding.value = true;
    error.value = null;
    return new Promise<mapkit.GeocoderResponse>((resolve, reject) => {
      try {
        const mk = resolveMapKit();
        const service = new mk.Geocoder();
        service.reverseLookup(
          coordinate,
          (err, data) => {
            isGeocoding.value = false;
            if (err) {
              error.value = err;
              reject(err);
            } else {
              resolve(data);
            }
          },
          options,
        );
      } catch (err) {
        isGeocoding.value = false;
        error.value = err as Error;
        reject(err);
      }
    });
  }

  return { geocode, reverseGeocode, isGeocoding, error };
}
