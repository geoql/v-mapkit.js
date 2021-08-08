type MapEvents = keyof mapkit.MapEvents<string>;

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

export const mapAnnotationOverlayEvents: MapEvents[] = [
  'select',
  'deselect',
  'drag-start',
  'dragging',
  'drag-end',
];

export const mapUserLocationEvents: MapEvents[] = [
  'user-location-change',
  'user-location-error',
];

export const mapInteractionEvents: MapEvents[] = [
  'single-tap',
  'double-tap',
  'long-press',
];
