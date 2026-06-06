import type { Ref } from 'vue';

export interface VMapProps {
  accessToken: string;
  version?: string;
  language?: string;
  initOptions?: mapkit.MapKitInitOptions;
  mapOptions?: mapkit.MapConstructorOptions;
  clusterAnnotation?: (cluster: mapkit.Annotation) => mapkit.Annotation;
  colorScheme?: 'light' | 'dark';
  distances?: 'automatic' | 'metric' | 'imperial';
  padding?: mapkit.Padding;
  tintColor?: string;
  pointOfInterestFilter?: mapkit.PointOfInterestFilter;
  showsPointsOfInterest?: boolean;
  cameraBoundary?: mapkit.CameraBoundary;
  cameraDistance?: number;
  cameraZoomRange?: mapkit.CameraZoomRange;
  selectableMapFeatures?: mapkit.SelectableMapFeature[];
  showsCompass?: 'adaptive' | 'hidden';
  showsZoomControl?: boolean;
  showsScale?: 'adaptive' | 'hidden';
  showsMapTypeControl?: boolean;
  showsUserLocationControl?: boolean;
  showsUserLocation?: boolean;
  tracksUserLocation?: boolean;
}

export type ControlPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export interface ControlFullscreenProps {
  position?: ControlPosition;
}

export interface ControlGeolocateProps {
  position?: ControlPosition;
  trackUserLocation?: boolean;
}

export interface ControlLayerSwitcherProps {
  position?: ControlPosition;
  mapTypes?: Array<{ type: mapkit.MapType; label: string }>;
}

export interface ControlLegendProps {
  position?: ControlPosition;
}

export interface MarkerAnnotationProps {
  coordinates: [number, number];
  annotation?: mapkit.MarkerAnnotationConstructorOptions;
  clusteringIdentifier?: string;
}

export interface ImageAnnotationProps {
  coordinates: [number, number];
  annotation: mapkit.ImageAnnotationConstructorOptions;
  clusteringIdentifier?: string;
}

export interface CircleOverlayProps {
  coordinates: [number, number];
  radius?: number;
  style?: mapkit.StyleConstructorOptions;
}

export interface PolygonOverlayProps {
  coordinates: [number, number][];
  style?: mapkit.StyleConstructorOptions;
}

export type PolylineOverlayProps = PolygonOverlayProps;

export interface TileOverlayProps {
  url: mapkit.URLTemplateCallback | string;
  options?: mapkit.TileOverlayConstructorOptions;
}

export interface PlaceAnnotationProps {
  place: mapkit.Place;
  annotation?: mapkit.AnnotationConstructorOptions;
  clusteringIdentifier?: string;
}

export interface MapFeatureAnnotationProps {
  feature: mapkit.MapFeature;
  annotation?: mapkit.AnnotationConstructorOptions;
  clusteringIdentifier?: string;
}

export interface CustomAnnotationProps {
  coordinates: [number, number];
  element: () => HTMLElement;
  annotation?: mapkit.AnnotationConstructorOptions;
  clusteringIdentifier?: string;
}

export interface ClusterAnnotationProps {
  cluster: mapkit.Annotation;
  annotation?: mapkit.MarkerAnnotationConstructorOptions;
}

export interface UseMapChildOptions<T> {
  /** Create the underlying MapKit instance and attach it to the map. */
  create: (mk: typeof mapkit, map: mapkit.Map) => T;
  /** Detach the instance from the map. */
  remove: (map: mapkit.Map, instance: T) => void;
  /** Reactive sources whose change triggers a recreate. */
  watchSources: () => unknown[];
  /** Optional in-place update; if omitted, the instance is recreated on change. */
  update?: (mk: typeof mapkit, map: mapkit.Map, instance: T) => void;
}

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

export interface UseGeocoderReturn {
  /** Convert an address string to geographic coordinates. */
  geocode: (
    query: string,
    options?: mapkit.GeocoderLookupOptions,
  ) => Promise<mapkit.GeocoderResponse>;
  /** Convert a geographic coordinate to a human-readable address. */
  reverseGeocode: (
    coordinate: mapkit.Coordinate,
    options?: Pick<mapkit.GeocoderConstructorOptions, 'language'>,
  ) => Promise<mapkit.GeocoderResponse>;
  /** Whether a geocode or reverse-geocode request is in flight. */
  isGeocoding: Ref<boolean>;
  /** The last error thrown by a request, or `null`. */
  error: Ref<Error | null>;
}

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

export interface UsePointsOfInterestSearchReturn {
  /** Fetch points of interest constrained by the given options. */
  search: (
    options: mapkit.PointsOfInterestSearchOptions,
  ) => Promise<mapkit.PointsOfInterestSearchResponse>;
  /** Whether a search request is in flight. */
  isSearching: Ref<boolean>;
  /** The last error thrown by a request, or `null`. */
  error: Ref<Error | null>;
}

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
