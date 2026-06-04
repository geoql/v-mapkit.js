import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';

import { useSearch } from '@/composables/useSearch';

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

describe('useSearch', () => {
  it('returns the expected shape', () => {
    const s = withComposable(() => useSearch());
    expect(typeof s.search).toBe('function');
    expect(typeof s.autocomplete).toBe('function');
    expect(s.isSearching.value).toBe(false);
    expect(s.error.value).toBe(null);
  });

  it('resolves a search response and toggles isSearching', async () => {
    const s = withComposable(() => useSearch());
    const promise = s.search('coffee');
    expect(s.isSearching.value).toBe(true);
    const res = await promise;
    expect(res.query).toBe('coffee');
    expect(Array.isArray(res.places)).toBe(true);
    expect(s.isSearching.value).toBe(false);
    expect(s.error.value).toBe(null);
  });

  it('resolves an autocomplete response', async () => {
    const s = withComposable(() => useSearch());
    const res = await s.autocomplete('cof');
    expect(res.query).toBe('cof');
    expect(Array.isArray(res.results)).toBe(true);
  });

  it('captures search errors and rejects', async () => {
    const s = withComposable(() => useSearch());
    await expect(s.search('__error__')).rejects.toThrow('search failed');
    expect(s.error.value).toBeInstanceOf(Error);
    expect(s.isSearching.value).toBe(false);
  });

  it('captures autocomplete errors and rejects', async () => {
    const s = withComposable(() => useSearch());
    await expect(s.autocomplete('__error__')).rejects.toThrow(
      'autocomplete failed',
    );
    expect(s.error.value).toBeInstanceOf(Error);
  });
});
