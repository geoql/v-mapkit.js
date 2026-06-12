/**
 * Module augmentation for MapKit JS classes that are not yet covered by
 * `@types/apple-mapkit-js-browser` at the time of writing.
 *
 * `PlaceAnnotation`, `MapFeatureAnnotation`, `LookAround`, and
 * `LookAroundPreview` exist in the MapKit JS runtime but are missing from
 * the upstream type definitions. This file restores type safety for
 * consumers without leaking `any` into the production code.
 *
 * `CameraBoundary` and `SelectableMapFeature` are also added because the
 * upstream types only expose `CameraBoundaryDescription` (the literal
 * shape) and do not name the selectable feature type at all.
 *
 * See: https://developer.apple.com/documentation/mapkitjs/placeannotation
 * See: https://developer.apple.com/documentation/mapkitjs/mapfeatureannotation
 * See: https://developer.apple.com/documentation/mapkitjs/lookaround
 * See: https://developer.apple.com/documentation/mapkitjs/lookaroundpreview
 * See: https://developer.apple.com/documentation/mapkitjs/selectablemapfeature
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

    /**
     * The upstream types model `cameraBoundary` as `CameraBoundaryDescription`,
     * a plain object literal. Alias it as `CameraBoundary` so consumers can
     * refer to it as a value (matching Apple's documentation name).
     *
     * See: https://developer.apple.com/documentation/mapkitjs/cameraboundary
     */
    type CameraBoundary = CameraBoundaryDescription;

    /**
     * Map features that can be made selectable on a map.
     *
     * The upstream type definitions do not export this name; we declare it
     * here as a string literal union matching Apple's documentation.
     *
     * See: https://developer.apple.com/documentation/mapkitjs/selectablemapfeature
     */
    type SelectableMapFeature = 'pointOfInterest' | 'building' | 'terrain';

    /**
     * The type of data displayed by a map view (`map.mapType`).
     *
     * The upstream type definitions model `mapType` as a bare `string` and do
     * not export a named union for the values of `mapkit.Map.MapTypes`. Declare
     * it here so consumers can refer to it as a type.
     *
     * See: https://developer.apple.com/documentation/mapkitjs/map/maptypes
     */
    type MapType = 'standard' | 'hybrid' | 'satellite' | 'mutedStandard';
  }
}

export {};
