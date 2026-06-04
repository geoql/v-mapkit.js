type OverlayEvents = keyof mapkit.MapEvents<string>;

/**
 * MapKit drag events fired on the parent map when an annotation or overlay
 * is dragged.
 */
export const overlayEvents: OverlayEvents[] = [
  'drag-start',
  'dragging',
  'drag-end',
];
