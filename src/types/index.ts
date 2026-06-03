export interface VMapProps {
  accessToken: string;
  version?: string;
  language?: string;
  initOptions?: mapkit.MapKitInitOptions;
  mapOptions?: mapkit.MapConstructorOptions;
}

export interface MarkerAnnotationProps {
  coordinates: [number, number];
  annotation?: mapkit.MarkerAnnotationConstructorOptions;
}

export interface ImageAnnotationProps {
  coordinates: [number, number];
  annotation: mapkit.ImageAnnotationConstructorOptions;
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
