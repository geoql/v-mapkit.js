import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';

import VMap from '@/components/VMap.vue';

describe('VMap', () => {
  it('initializes a map, emits map-loaded, and provides a real map instance', async () => {
    const wrapper = mount(VMap, {
      props: { accessToken: 'fake.jwt.token' },
    });
    await nextTick();
    await nextTick();
    expect(wrapper.emitted('map-loaded')).toBeTruthy();
    const mapEvents = wrapper.emitted('map');
    expect(mapEvents).toBeTruthy();
    expect(mapEvents![0][0]).toBeInstanceOf(window.mapkit.Map);
  });

  it('supports two independent maps on the same page', async () => {
    const a = mount(VMap, { props: { accessToken: 't1' } });
    const b = mount(VMap, { props: { accessToken: 't2' } });
    await nextTick();
    await nextTick();
    const mapA = a.emitted('map')![0][0];
    const mapB = b.emitted('map')![0][0];
    expect(mapA).not.toBe(mapB);
  });
});
