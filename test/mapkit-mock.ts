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
class FakePlaceAnnotation {
  constructor(
    public place: unknown,
    public options: Record<string, unknown> = {},
  ) {}
}
class FakeMapFeatureAnnotation {
  constructor(
    public feature: unknown,
    public options: Record<string, unknown> = {},
  ) {}
}
class FakeAnnotation {
  coordinate: FakeCoordinate;
  element: Element;
  options: Record<string, unknown>;
  factory: (
    coordinate: FakeCoordinate,
    options: Record<string, unknown>,
  ) => Element;
  constructor(
    coordinate: FakeCoordinate,
    factory: (
      coordinate: FakeCoordinate,
      options: Record<string, unknown>,
    ) => Element,
    options: Record<string, unknown> = {},
  ) {
    this.coordinate = coordinate;
    this.factory = factory;
    this.options = options;
    this.element = factory(coordinate, options);
  }
}
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

class FakeLookAround {
  shown: unknown[] = [];
  destroyed = false;
  private listeners: Record<string, Array<(e: unknown) => void>> = {};
  constructor(
    public parent: Element,
    public options: Record<string, unknown> = {},
  ) {}
  show = vi.fn((place: unknown) => {
    this.shown.push(place);
    if ((place as { __error__?: boolean })?.__error__) {
      this.fireEvent('error', new Error('look around unavailable'));
    } else {
      this.fireEvent('load', { place });
    }
  });
  addEventListener = vi.fn((e: string, cb: (ev: unknown) => void) => {
    (this.listeners[e] ??= []).push(cb);
  });
  removeEventListener = vi.fn((e: string, cb: (ev: unknown) => void) => {
    this.listeners[e] = (this.listeners[e] ?? []).filter((h) => h !== cb);
  });
  fireEvent(e: string, payload: unknown) {
    (this.listeners[e] ?? []).forEach((cb) => cb(payload));
  }
  destroy = vi.fn(() => {
    this.destroyed = true;
    this.listeners = {};
  });
}
class FakeLookAroundPreview extends FakeLookAround {}

type Cb = (error: Error | null, data: unknown) => void;

class FakeSearch {
  constructor(public options: Record<string, unknown> = {}) {}
  search = vi.fn(
    (query: unknown, callback: Cb, _options?: Record<string, unknown>) => {
      queueMicrotask(() => {
        if (query === '__error__') {
          callback(new Error('search failed'), null);
        } else {
          callback(null, { query, boundingRegion: {}, places: [] });
        }
      });
      return 1;
    },
  );
  autocomplete = vi.fn(
    (query: unknown, callback: Cb, _options?: Record<string, unknown>) => {
      queueMicrotask(() => {
        if (query === '__error__') {
          callback(new Error('autocomplete failed'), null);
        } else {
          callback(null, { query, results: [] });
        }
      });
    },
  );
  cancel = vi.fn(() => true);
}

class FakeGeocoder {
  constructor(public options: Record<string, unknown> = {}) {}
  lookup = vi.fn(
    (place: unknown, callback: Cb, _options?: Record<string, unknown>) => {
      queueMicrotask(() => {
        if (place === '__error__') {
          callback(new Error('geocode failed'), null);
        } else {
          callback(null, { results: [] });
        }
      });
      return 1;
    },
  );
  reverseLookup = vi.fn(
    (
      coordinate: { latitude?: number } | unknown,
      callback: Cb,
      _options?: Record<string, unknown>,
    ) => {
      queueMicrotask(() => {
        if ((coordinate as { latitude?: number })?.latitude === 999) {
          callback(new Error('reverse geocode failed'), null);
        } else {
          callback(null, { results: [] });
        }
      });
      return 1;
    },
  );
  cancel = vi.fn(() => true);
}

class FakeDirections {
  constructor(public options: Record<string, unknown> = {}) {}
  route = vi.fn((request: { origin?: unknown }, callback: Cb) => {
    queueMicrotask(() => {
      if (request?.origin === '__error__') {
        callback(new Error('route failed'), null);
      } else {
        callback(null, { request, routes: [] });
      }
    });
    return 1;
  });
  eta = vi.fn((request: unknown, callback: Cb) => {
    queueMicrotask(() => callback(null, { request, etas: [] }));
    return 1;
  });
  cancel = vi.fn(() => true);
}

class FakePointsOfInterestSearch {
  constructor(public options: Record<string, unknown> = {}) {}
  search = vi.fn((callback: Cb, options?: Record<string, unknown>) => {
    const merged = { ...this.options, ...options };
    queueMicrotask(() => {
      if (merged.__error__) {
        callback(new Error('poi search failed'), null);
      } else {
        callback(null, { places: [] });
      }
    });
    return 1;
  });
  cancel = vi.fn(() => true);
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
  removeEventListener = vi.fn((e: string, cb: (ev: unknown) => void) => {
    this.listeners[e] = (this.listeners[e] ?? []).filter((h) => h !== cb);
  });
  fireEvent(e: string, payload: unknown) {
    (this.listeners[e] ?? []).forEach((cb) => cb(payload));
  }
  destroy = vi.fn(() => {
    this.destroyed = true;
    this.listeners = {};
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
    PlaceAnnotation: FakePlaceAnnotation,
    MapFeatureAnnotation: FakeMapFeatureAnnotation,
    Annotation: FakeAnnotation,
    CircleOverlay: FakeCircleOverlay,
    PolygonOverlay: FakePolygonOverlay,
    PolylineOverlay: FakePolylineOverlay,
    TileOverlay: FakeTileOverlay,
    Style: FakeStyle,
    LookAround: FakeLookAround,
    LookAroundPreview: FakeLookAroundPreview,
    Search: FakeSearch,
    Geocoder: FakeGeocoder,
    Directions: FakeDirections,
    PointsOfInterestSearch: FakePointsOfInterestSearch,
  };
  (globalThis as unknown as { mapkit: unknown }).mapkit = mapkit;
  (window as unknown as { mapkit: unknown }).mapkit = mapkit;
  return mapkit;
}
