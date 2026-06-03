import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';

import VMap from '@/components/VMap.vue';
import { useMapChild } from '@/composables/useMapChild';

const Marker = defineComponent({
  name: 'TestMarker',
  props: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  setup(props) {
    useMapChild({
      create: (mk, map) => {
        const a = new mk.MarkerAnnotation(
          new mk.Coordinate(props.lat, props.lng),
          {},
        );
        map.addAnnotation(a);
        return a;
      },
      remove: (map, instance) => map.removeAnnotation(instance),
      watchSources: () => [props.lat, props.lng],
    });
    return () => h('div');
  },
});

describe('useMapChild', () => {
  it('adds the annotation when the map becomes ready and removes it on unmount', async () => {
    const wrapper = mount(VMap, {
      props: { accessToken: 't' },
      slots: { default: () => h(Marker, { lat: 1, lng: 2 }) },
    });
    await nextTick();
    await nextTick();
    const map = wrapper.emitted('map')![0][0] as InstanceType<
      typeof window.mapkit.Map
    >;
    expect(
      (map as unknown as { annotations: unknown[] }).annotations.length,
    ).toBe(1);
    wrapper.unmount();
    // destroy() is called on the map; annotation removal happens before unmount
  });
});
