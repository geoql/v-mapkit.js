import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';

import { usePointsOfInterestSearch } from '@/composables/use-points-of-interest-search';

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

describe('usePointsOfInterestSearch', () => {
  it('returns the expected shape', () => {
    const p = withComposable(() => usePointsOfInterestSearch());
    expect(typeof p.search).toBe('function');
    expect(p.isSearching.value).toBe(false);
    expect(p.error.value).toBe(null);
  });

  it('resolves a search response and toggles isSearching', async () => {
    const p = withComposable(() => usePointsOfInterestSearch());
    const promise = p.search({
      center: new window.mapkit.Coordinate(37.3, -122.0),
      radius: 1000,
    });
    expect(p.isSearching.value).toBe(true);
    const res = await promise;
    expect(Array.isArray(res.places)).toBe(true);
    expect(p.isSearching.value).toBe(false);
    expect(p.error.value).toBe(null);
  });

  it('captures search errors and rejects', async () => {
    const p = withComposable(() => usePointsOfInterestSearch());
    await expect(
      p.search({
        __error__: true,
      } as unknown as mapkit.PointsOfInterestSearchOptions),
    ).rejects.toThrow('poi search failed');
    expect(p.error.value).toBeInstanceOf(Error);
    expect(p.isSearching.value).toBe(false);
  });
});
