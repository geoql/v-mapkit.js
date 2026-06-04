import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';

import { useDirections } from '@/composables/useDirections';

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

describe('useDirections', () => {
  it('returns the expected shape', () => {
    const d = withComposable(() => useDirections());
    expect(typeof d.route).toBe('function');
    expect(d.isRouting.value).toBe(false);
    expect(d.error.value).toBe(null);
  });

  it('resolves a route response and toggles isRouting', async () => {
    const d = withComposable(() => useDirections());
    const promise = d.route('Cupertino', 'San Francisco');
    expect(d.isRouting.value).toBe(true);
    const res = await promise;
    expect(Array.isArray(res.routes)).toBe(true);
    expect(d.isRouting.value).toBe(false);
    expect(d.error.value).toBe(null);
  });

  it('forwards options into the request', async () => {
    const d = withComposable(() => useDirections());
    const res = await d.route('A', 'B', { requestsAlternateRoutes: true });
    expect(res.request.origin).toBe('A');
    expect(res.request.destination).toBe('B');
    expect(res.request.requestsAlternateRoutes).toBe(true);
  });

  it('captures route errors and rejects', async () => {
    const d = withComposable(() => useDirections());
    await expect(d.route('__error__', 'B')).rejects.toThrow('route failed');
    expect(d.error.value).toBeInstanceOf(Error);
    expect(d.isRouting.value).toBe(false);
  });
});
