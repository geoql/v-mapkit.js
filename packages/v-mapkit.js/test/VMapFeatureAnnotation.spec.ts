import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { h, nextTick } from 'vue';

import VMap from '@/components/VMap';
import VMapFeatureAnnotation from '@/components/VMapFeatureAnnotation';

const fakeFeature = {
  pointOfInterestCategory: 'Museum',
  mapFeatureType: 'Building',
} as unknown as mapkit.MapFeature;

describe('VMapFeatureAnnotation', () => {
  it('adds a MapFeatureAnnotation to the map and exposes it', async () => {
    const wrapper = mount(VMap, {
      props: { accessToken: 't' },
      slots: {
        default: () => h(VMapFeatureAnnotation, { feature: fakeFeature }),
      },
      global: { components: { VMapFeatureAnnotation } },
    });
    await nextTick();
    await nextTick();
    const map = wrapper.emitted('map')![0][0] as unknown as {
      annotations: Array<{ feature: mapkit.MapFeature }>;
    };
    expect(map.annotations).toHaveLength(1);
    expect(map.annotations[0].feature).toBe(fakeFeature);
    expect(map.annotations[0]).toBeInstanceOf(
      window.mapkit.MapFeatureAnnotation,
    );
  });

  it('removes the annotation on unmount', async () => {
    const wrapper = mount(VMap, {
      props: { accessToken: 't' },
      slots: {
        default: () => h(VMapFeatureAnnotation, { feature: fakeFeature }),
      },
      global: { components: { VMapFeatureAnnotation } },
    });
    await nextTick();
    await nextTick();
    const map = wrapper.emitted('map')![0][0] as unknown as {
      annotations: unknown[];
    };
    expect(map.annotations).toHaveLength(1);
    wrapper.unmount();
  });
});
