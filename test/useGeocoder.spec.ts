import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';

import { useGeocoder } from '@/composables/useGeocoder';

function withComposable<T>(composable: () => T): T {
  let result!: T;
  mount(
    defineComponent({
      setup() {
        result = composable();
        return () => h('div');
      },
    }),
  );
  return result;
}

describe('useGeocoder', () => {
  it('returns the expected shape', () => {
    const g = withComposable(() => useGeocoder());
    expect(typeof g.geocode).toBe('function');
    expect(typeof g.reverseGeocode).toBe('function');
    expect(g.isGeocoding.value).toBe(false);
    expect(g.error.value).toBe(null);
  });

  it('resolves a forward geocode and toggles isGeocoding', async () => {
    const g = withComposable(() => useGeocoder());
    const promise = g.geocode('1 Infinite Loop');
    expect(g.isGeocoding.value).toBe(true);
    const res = await promise;
    expect(Array.isArray(res.results)).toBe(true);
    expect(g.isGeocoding.value).toBe(false);
    expect(g.error.value).toBe(null);
  });

  it('resolves a reverse geocode', async () => {
    const g = withComposable(() => useGeocoder());
    const res = await g.reverseGeocode(
      new window.mapkit.Coordinate(37.3, -122.0),
    );
    expect(Array.isArray(res.results)).toBe(true);
  });

  it('captures geocode errors and rejects', async () => {
    const g = withComposable(() => useGeocoder());
    await expect(g.geocode('__error__')).rejects.toThrow('geocode failed');
    expect(g.error.value).toBeInstanceOf(Error);
    expect(g.isGeocoding.value).toBe(false);
  });

  it('captures reverse geocode errors and rejects', async () => {
    const g = withComposable(() => useGeocoder());
    await expect(
      g.reverseGeocode(new window.mapkit.Coordinate(999, 999)),
    ).rejects.toThrow('reverse geocode failed');
    expect(g.error.value).toBeInstanceOf(Error);
  });
});
