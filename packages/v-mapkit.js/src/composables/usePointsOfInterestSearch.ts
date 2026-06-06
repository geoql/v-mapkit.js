import { inject, ref } from 'vue';

import { MapKitGlobalKey } from '../symbols';
import type { UsePointsOfInterestSearchReturn } from '../types';

/**
 * Wraps `mapkit.PointsOfInterestSearch` to provide promise-based POI search.
 *
 * Resolves the `mapkit` global from the nearest `<VMap>` (via `MapKitGlobalKey`)
 * and falls back to `window.mapkit` so it can be used outside a map context.
 *
 * @example
 * const { search } = usePointsOfInterestSearch();
 * const { places } = await search({
 *   center: new mapkit.Coordinate(37.3, -122.0),
 *   radius: 1000,
 * });
 */
export function usePointsOfInterestSearch(): UsePointsOfInterestSearchReturn {
  const injected = inject(MapKitGlobalKey, undefined);
  const isSearching = ref(false);
  const error = ref<Error | null>(null);

  function resolveMapKit(): typeof mapkit {
    const mk = injected?.value ?? window.mapkit;
    if (!mk) {
      throw new Error('MapKit JS is not initialized; call useMapKit first');
    }
    return mk;
  }

  function search(
    options: mapkit.PointsOfInterestSearchOptions,
  ): Promise<mapkit.PointsOfInterestSearchResponse> {
    isSearching.value = true;
    error.value = null;
    return new Promise<mapkit.PointsOfInterestSearchResponse>(
      (resolve, reject) => {
        try {
          const mk = resolveMapKit();
          const service = new mk.PointsOfInterestSearch(options);
          service.search((err, data) => {
            isSearching.value = false;
            if (err) {
              error.value = err;
              reject(err);
            } else {
              resolve(data);
            }
          }, options);
        } catch (err) {
          isSearching.value = false;
          error.value = err as Error;
          reject(err);
        }
      },
    );
  }

  return { search, isSearching, error };
}
