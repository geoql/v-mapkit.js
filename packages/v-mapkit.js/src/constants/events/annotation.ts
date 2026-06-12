type AnnotationEvents = keyof mapkit.MapEvents<string>;

/** MapKit annotation selection events fired on the parent map. */
export const annotationEvents: AnnotationEvents[] = ['select', 'deselect'];
