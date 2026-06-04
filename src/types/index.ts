export interface VMapProps {
  accessToken: string;
  version?: string;
  language?: string;
  initOptions?: mapkit.MapKitInitOptions;
  mapOptions?: mapkit.MapConstructorOptions;
  clusterAnnotation?: (cluster: mapkit.Annotation) => mapkit.Annotation;
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
