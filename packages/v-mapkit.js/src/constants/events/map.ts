type MapEvents = keyof mapkit.MapEvents<string>;

/** MapKit map display events (region, rotation, scroll, zoom, type changes). */
export const mapDisplayEvents: MapEvents[] = [
  'region-change-start',
  'region-change-end',
  'rotation-start',
  'rotation-end',
  'scroll-start',
  'scroll-end',
  'zoom-start',
  'zoom-end',
  'map-type-change',
];

/** MapKit user location events. */
export const mapUserLocationEvents: MapEvents[] = [
  'user-location-change',
  'user-location-error',
];

/** MapKit user interaction events (gestures). */
export const mapInteractionEvents: MapEvents[] = [
  'single-tap',
  'double-tap',
  'long-press',
];
