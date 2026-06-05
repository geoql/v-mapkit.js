import { inject, ref, type Ref } from 'vue';

import { MapKitGlobalKey } from '../symbols';

export interface UseSearchReturn {
  /** Perform a place search for the given query. */
  search: (
    query: string,
    options?: mapkit.SearchOptions,
  ) => Promise<mapkit.SearchResponse>;
  /** Retrieve autocomplete suggestions for the given query. */
  autocomplete: (
    query: string,
    options?: mapkit.SearchAutocompleteOptions,
  ) => Promise<mapkit.SearchAutocompleteResponse>;
  /** Whether a search or autocomplete request is in flight. */
  isSearching: Ref<boolean>;
  /** The last error thrown by a request, or `null`. */
  error: Ref<Error | null>;
}

/**
 * Wraps `mapkit.Search` to provide promise-based place search and autocomplete.
 *
 * Resolves the `mapkit` global from the nearest `<VMap>` (via `MapKitGlobalKey`)
 * and falls back to `window.mapkit` so it can be used outside a map context.
 *
 * @example
 * const { search, isSearching, error } = useSearch();
 * const response = await search('coffee');
 */
export function useSearch(): UseSearchReturn {
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
    query: string,
    options?: mapkit.SearchOptions,
  ): Promise<mapkit.SearchResponse> {
    isSearching.value = true;
    error.value = null;
    return new Promise<mapkit.SearchResponse>((resolve, reject) => {
      try {
        const mk = resolveMapKit();
        const service = new mk.Search();
        service.search(
          query,
          (err, data) => {
            isSearching.value = false;
            if (err) {
              error.value = err;
              reject(err);
            } else {
              resolve(data as mapkit.SearchResponse);
            }
          },
          options,
        );
      } catch (err) {
        isSearching.value = false;
        error.value = err as Error;
        reject(err);
      }
    });
  }

  function autocomplete(
    query: string,
    options?: mapkit.SearchAutocompleteOptions,
  ): Promise<mapkit.SearchAutocompleteResponse> {
    isSearching.value = true;
    error.value = null;
    return new Promise<mapkit.SearchAutocompleteResponse>((resolve, reject) => {
      try {
        const mk = resolveMapKit();
        const service = new mk.Search();
        service.autocomplete(
          query,
          (err, data) => {
            isSearching.value = false;
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
        isSearching.value = false;
        error.value = err as Error;
        reject(err);
      }
    });
  }

  return { search, autocomplete, isSearching, error };
}
