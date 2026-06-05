/**
 * Small helpers shared across example pages.
 *
 * `center`/`region` are not VMap props — they must be applied through the
 * MapKit instance once it is ready (the `@map` event). These helpers use the
 * global `window.mapkit`, which exists by the time `@map` fires.
 */

type AnyMap = {
  region: unknown;
  center: unknown;
  setRegionAnimated?: (region: unknown, animate?: boolean) => void;
  setCenterAnimated?: (center: unknown, animate?: boolean) => void;
};

function mapkitGlobal(): typeof mapkit | undefined {
  return (globalThis as unknown as { mapkit?: typeof mapkit }).mapkit;
}

/** A handful of well-known demo coordinates as `[lat, lng]`. */
export const places = {
  applePark: [37.3349, -122.00902] as [number, number],
  sanFrancisco: [37.7749, -122.4194] as [number, number],
  goldenGate: [37.8199, -122.4783] as [number, number],
  newYork: [40.7128, -74.006] as [number, number],
  london: [51.5074, -0.1278] as [number, number],
  tokyo: [35.6762, 139.6503] as [number, number],
  cupertino: [37.3318, -122.0312] as [number, number],
};

/** Build a `mapkit.Coordinate` from a `[lat, lng]` tuple. */
export function toCoordinate([lat, lng]: [number, number]) {
  const mk = mapkitGlobal();
  if (!mk) return undefined;
  return new mk.Coordinate(lat, lng);
}

/**
 * Center a ready map on a coordinate with a given span (in degrees).
 * Call this inside the VMap `@map` handler.
 */
export function centerMap(
  map: AnyMap,
  [lat, lng]: [number, number],
  span = 0.08,
): void {
  const mk = mapkitGlobal();
  if (!mk) return;

  const region = new mk.CoordinateRegion(
    new mk.Coordinate(lat, lng),
    new mk.CoordinateSpan(span, span),
  );

  if (typeof map.setRegionAnimated === 'function') {
    map.setRegionAnimated(region, false);
  } else {
    map.region = region;
  }
}
