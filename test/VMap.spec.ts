import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import type { Mock } from 'vitest';
import { nextTick } from 'vue';

import VMap from '@/components/VMap.vue';

type TestMap = {
  destroy: Mock;
  addEventListener: Mock;
  removeEventListener: Mock;
  listeners: Record<string, Array<unknown>>;
};

function handlerCount(m: TestMap): number {
  return Object.values(m.listeners).reduce((n, l) => n + l.length, 0);
}

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

  it('destroys the map on unmount without error and emits map-destroyed', async () => {
    const wrapper = mount(VMap, { props: { accessToken: 't' } });
    await nextTick();
    await nextTick();
    const created = wrapper.emitted('map')![0][0] as unknown as TestMap;
    expect(created.destroy).not.toHaveBeenCalled();

    expect(() => wrapper.unmount()).not.toThrow();

    expect(created.destroy).toHaveBeenCalledTimes(1);
    expect(wrapper.emitted('map-destroyed')).toBeTruthy();
  });

  it('removes all event listeners on unmount', async () => {
    const wrapper = mount(VMap, { props: { accessToken: 't' } });
    await nextTick();
    await nextTick();
    const created = wrapper.emitted('map')![0][0] as unknown as TestMap;

    const attached = handlerCount(created);
    expect(attached).toBeGreaterThan(0);

    wrapper.unmount();

    expect(created.removeEventListener).toHaveBeenCalledTimes(attached);
    expect(created.destroy).toHaveBeenCalledTimes(1);
    expect(Object.keys(created.listeners)).toHaveLength(0);
  });

  it('shares a single memoized loader yet yields distinct working maps', async () => {
    const a = mount(VMap, { props: { accessToken: 't1' } });
    const b = mount(VMap, { props: { accessToken: 't2' } });
    await nextTick();
    await nextTick();
    const mapA = a.emitted('map')![0][0];
    const mapB = b.emitted('map')![0][0];
    expect(mapA).toBeInstanceOf(window.mapkit.Map);
    expect(mapB).toBeInstanceOf(window.mapkit.Map);
    expect(mapA).not.toBe(mapB);
    expect(a.emitted('map-loaded')![0][0]).toBe(true);
    expect(b.emitted('map-loaded')![0][0]).toBe(true);
  });
});
