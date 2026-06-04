import { inject, ref, type Ref } from 'vue';

import { MapKitGlobalKey } from '../symbols';

export type DirectionsPoint = string | mapkit.Coordinate | mapkit.Place;

export type RouteOptions = Omit<
  mapkit.DirectionsRequest,
  'origin' | 'destination'
>;

export interface UseDirectionsReturn {
  /** Retrieve routes and travel time between an origin and destination. */
  route: (
    origin: DirectionsPoint,
    destination: DirectionsPoint,
    options?: RouteOptions,
  ) => Promise<mapkit.DirectionsResponse>;
  /** Whether a routing request is in flight. */
  isRouting: Ref<boolean>;
  /** The last error thrown by a request, or `null`. */
  error: Ref<Error | null>;
}

/**
 * Wraps `mapkit.Directions` to provide promise-based routing.
 *
 * Resolves the `mapkit` global from the nearest `<VMap>` (via `MapKitGlobalKey`)
 * and falls back to `window.mapkit` so it can be used outside a map context.
 *
 * @example
 * const { route, isRouting } = useDirections();
 * const { routes } = await route('Cupertino', 'San Francisco', {
 *   transportType: mapkit.Directions.Transport.Walking,
 * });
 */
export function useDirections(): UseDirectionsReturn {
  const injected = inject(MapKitGlobalKey, undefined);
  const isRouting = ref(false);
  const error = ref<Error | null>(null);

  function resolveMapKit(): typeof mapkit {
    const mk = injected?.value ?? window.mapkit;
    if (!mk) {
      throw new Error('MapKit JS is not initialized; call useMapKit first');
    }
    return mk;
  }

  function route(
    origin: DirectionsPoint,
    destination: DirectionsPoint,
    options?: RouteOptions,
  ): Promise<mapkit.DirectionsResponse> {
    isRouting.value = true;
    error.value = null;
    return new Promise<mapkit.DirectionsResponse>((resolve, reject) => {
      try {
        const mk = resolveMapKit();
        const service = new mk.Directions();
        service.route({ ...options, origin, destination }, (err, data) => {
          isRouting.value = false;
          if (err) {
            error.value = err;
            reject(err);
          } else {
            resolve(data);
          }
        });
      } catch (err) {
        isRouting.value = false;
        error.value = err as Error;
        reject(err);
      }
    });
  }

  return { route, isRouting, error };
}
