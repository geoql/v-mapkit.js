/**
 * Module augmentation for MapKit JS classes that are not yet covered by
 * `@types/apple-mapkit-js-browser` at the time of writing.
 *
 * Both `PlaceAnnotation` and `MapFeatureAnnotation` exist in the MapKit JS
 * runtime but are missing from the upstream type definitions. This file
 * restores type safety for consumers without leaking `any` into the
 * production code.
 *
 * See: https://developer.apple.com/documentation/mapkitjs/placeannotation
 * See: https://developer.apple.com/documentation/mapkitjs/mapfeatureannotation
 */
declare global {
  namespace mapkit {
    class PlaceAnnotation extends Annotation {
      constructor(place: Place, options?: AnnotationConstructorOptions);
      place: Place;
    }

    class MapFeatureAnnotation extends Annotation {
      constructor(feature: MapFeature, options?: AnnotationConstructorOptions);
      feature: MapFeature;
    }

    interface MapFeature {
      pointOfInterestCategory?: string;
      readonly mapFeatureType: string;
    }
  }
}

export {};
