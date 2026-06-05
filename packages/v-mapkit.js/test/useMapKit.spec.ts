import { describe, expect, it } from 'vitest';

import { loadMapKit } from '@/composables/useMapKit';

describe('loadMapKit', () => {
  it('resolves the existing window.mapkit if already present', async () => {
    const mk = await loadMapKit('5.x.x');
    expect(mk).toBe(window.mapkit);
    expect(typeof mk.Map).toBe('function');
  });
});
