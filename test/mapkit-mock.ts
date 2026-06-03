import { vi } from 'vitest';

class FakeCoordinate {
  constructor(
    public latitude: number,
    public longitude: number,
  ) {}
}

class FakeMarkerAnnotation {
  coordinate: FakeCoordinate;
  options: Record<string, unknown>;
  constructor(
    coordinate: FakeCoordinate,
    options: Record<string, unknown> = {},
  ) {
    this.coordinate = coordinate;
    this.options = options;
  }
}
class FakeImageAnnotation extends FakeMarkerAnnotation {}
class FakeCircleOverlay {
  constructor(
    public coordinate: FakeCoordinate,
    public radius: number,
    public options: Record<string, unknown> = {},
  ) {}
}
class FakePolygonOverlay {
  constructor(
    public points: unknown,
    public options: Record<string, unknown> = {},
  ) {}
}
class FakePolylineOverlay extends FakePolygonOverlay {}
class FakeTileOverlay {
  constructor(
    public urlTemplate: unknown,
    public options: Record<string, unknown> = {},
  ) {}
}
class FakeStyle {
  constructor(public options: Record<string, unknown> = {}) {}
}

class FakeMap {
  annotations: unknown[] = [];
  overlays: unknown[] = [];
  destroyed = false;
  private listeners: Record<string, Array<(e: unknown) => void>> = {};
  constructor(
    public element: unknown,
    public options: Record<string, unknown> = {},
  ) {}
  addAnnotation = vi.fn((a: unknown) => this.annotations.push(a));
  removeAnnotation = vi.fn((a: unknown) => {
    this.annotations = this.annotations.filter((x) => x !== a);
  });
  addOverlay = vi.fn((o: unknown) => this.overlays.push(o));
  removeOverlay = vi.fn((o: unknown) => {
    this.overlays = this.overlays.filter((x) => x !== o);
  });
  addEventListener = vi.fn((e: string, cb: (ev: unknown) => void) => {
    (this.listeners[e] ??= []).push(cb);
  });
  fireEvent(e: string, payload: unknown) {
    (this.listeners[e] ?? []).forEach((cb) => cb(payload));
  }
  destroy = vi.fn(() => {
    this.destroyed = true;
  });
}

export function installMapKitMock() {
  const mapkit = {
    init: vi.fn(),
    addEventListener: vi.fn(),
    Map: FakeMap,
    Coordinate: FakeCoordinate,
    MarkerAnnotation: FakeMarkerAnnotation,
    ImageAnnotation: FakeImageAnnotation,
    CircleOverlay: FakeCircleOverlay,
    PolygonOverlay: FakePolygonOverlay,
    PolylineOverlay: FakePolylineOverlay,
    TileOverlay: FakeTileOverlay,
    Style: FakeStyle,
  };
  (globalThis as unknown as { mapkit: unknown }).mapkit = mapkit;
  (window as unknown as { mapkit: unknown }).mapkit = mapkit;
  return mapkit;
}
