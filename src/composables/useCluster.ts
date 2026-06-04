import { inject, watch } from 'vue';

import { MapKitInstanceKey } from '../symbols';

export interface UseClusterOptions {
  /**
   * Build the annotation used to represent a cluster. Receives the cluster
   * annotation MapKit creates (carrying `memberAnnotations` and the shared
   * `clusteringIdentifier`) and must return the annotation to render in its
   * place.
   */
  createClusterAnnotation: (cluster: mapkit.Annotation) => mapkit.Annotation;
}

export interface UseClusterReturn {
  /** Remove the `annotationForCluster` delegate from the map. */
  cleanup: () => void;
}

/**
 * Wires the parent `<VMap>`'s `annotationForCluster` delegate so clustered
 * annotations can be customized.
 *
 * MapKit groups annotations that share a `clusteringIdentifier` and asks this
 * delegate for the annotation to display in their place.
 *
 * @example
 * const { cleanup } = useCluster({
 *   createClusterAnnotation: (cluster) =>
 *     new mapkit.MarkerAnnotation(cluster.coordinate, {
 *       title: `${cluster.memberAnnotations.length} items`,
 *     }),
 * });
 */
export function useCluster(options: UseClusterOptions): UseClusterReturn {
  const map = inject(MapKitInstanceKey);

  if (!map) {
    throw new Error('useCluster must be used inside a <VMap>');
  }

  const delegate = (cluster: mapkit.Annotation): mapkit.Annotation =>
    options.createClusterAnnotation(cluster);

  const stop = watch(
    map,
    (m) => {
      if (m) m.annotationForCluster = delegate;
    },
    { immediate: true },
  );

  function cleanup(): void {
    stop();
    if (map?.value) {
      (map.value as { annotationForCluster?: unknown }).annotationForCluster =
        undefined;
    }
  }

  return { cleanup };
}
