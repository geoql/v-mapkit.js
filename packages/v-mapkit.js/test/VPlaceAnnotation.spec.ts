import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { h, nextTick } from 'vue';

import VMap from '@/components/VMap';
import VPlaceAnnotation from '@/components/VPlaceAnnotation';

const fakePlace = {
  name: 'Apple Park',
  coordinate: { latitude: 37.3349, longitude: -122.009 },
  formattedAddress: 'One Apple Park Way, Cupertino, CA',
  region: {} as mapkit.CoordinateRegion,
  countryCode: 'US',
} as unknown as mapkit.Place;

describe('VPlaceAnnotation', () => {
  it('adds a PlaceAnnotation to the map and exposes it', async () => {
    const wrapper = mount(VMap, {
      props: { accessToken: 't' },
      slots: { default: () => h(VPlaceAnnotation, { place: fakePlace }) },
      global: {
        components: { VPlaceAnnotation },
      },
    });
    await nextTick();
    await nextTick();
    const map = wrapper.emitted('map')![0][0] as unknown as {
      annotations: Array<{ place: mapkit.Place }>;
    };
    expect(map.annotations).toHaveLength(1);
    expect(map.annotations[0].place).toBe(fakePlace);
    expect(map.annotations[0]).toBeInstanceOf(window.mapkit.PlaceAnnotation);
  });

  it('removes the annotation on unmount', async () => {
    const wrapper = mount(VMap, {
      props: { accessToken: 't' },
      slots: { default: () => h(VPlaceAnnotation, { place: fakePlace }) },
      global: { components: { VPlaceAnnotation } },
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
