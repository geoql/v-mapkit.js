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
 * See: https://developer.apple.com/documentation/mapkitjs/lookaround
 * See: https://developer.apple.com/documentation/mapkitjs/lookaroundpreview
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

    /** Configuration options for an interactive Look Around view. */
    interface LookAroundOptions {
      showsDialogControls?: boolean;
      showsRoadLabels?: boolean;
    }

    /** Configuration options for a static Look Around preview. */
    interface LookAroundPreviewOptions {
      showsDialogControls?: boolean;
    }

    /**
     * An interactive 360° street-level view rendered into a DOM element.
     * Cross-browser where WebGL is available.
     */
    class LookAround {
      constructor(parent: Element, options?: LookAroundOptions);
      show(place: Place): void;
      addEventListener(type: string, listener: (event: unknown) => void): void;
      removeEventListener(
        type: string,
        listener: (event: unknown) => void,
      ): void;
      destroy?(): void;
    }

    /** A static, non-interactive Look Around preview rendered into a DOM element. */
    class LookAroundPreview {
      constructor(parent: Element, options?: LookAroundPreviewOptions);
      show(place: Place): void;
      addEventListener(type: string, listener: (event: unknown) => void): void;
      removeEventListener(
        type: string,
        listener: (event: unknown) => void,
      ): void;
      destroy?(): void;
    }
  }
}

export {};
