import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';

import VLookAroundPreview from '@/components/VLookAroundPreview';

const fakePlace = {
  name: 'Apple Park',
  coordinate: { latitude: 37.3349, longitude: -122.009 },
} as unknown as mapkit.Place;

describe('VLookAroundPreview', () => {
  it('mounts and creates a LookAroundPreview instance attached to its container', async () => {
    const wrapper = mount(VLookAroundPreview, { props: { place: fakePlace } });
    await nextTick();
    const instance = (
      wrapper.vm as unknown as { instance: mapkit.LookAroundPreview }
    ).instance;
    expect(instance).toBeInstanceOf(window.mapkit.LookAroundPreview);
    expect((instance as unknown as { parent: Element }).parent).toBe(
      wrapper.element,
    );
  });

  it('calls show() with the place and emits load', async () => {
    const wrapper = mount(VLookAroundPreview, { props: { place: fakePlace } });
    await nextTick();
    const instance = (
      wrapper.vm as unknown as {
        instance: { show: ReturnType<typeof vi.fn>; shown: unknown[] };
      }
    ).instance;
    expect(instance.show).toHaveBeenCalledTimes(1);
    expect((instance.shown[0] as { name: string }).name).toBe('Apple Park');
    expect(wrapper.emitted('load')).toBeTruthy();
  });

  it('emits error when the preview is unavailable for the place', async () => {
    const errorPlace = { __error__: true } as unknown as mapkit.Place;
    const wrapper = mount(VLookAroundPreview, {
      props: { place: errorPlace },
    });
    await nextTick();
    expect(wrapper.emitted('error')).toBeTruthy();
    expect(wrapper.emitted('load')).toBeFalsy();
  });

  it('destroys the instance and removes listeners on unmount', async () => {
    const wrapper = mount(VLookAroundPreview, { props: { place: fakePlace } });
    await nextTick();
    const instance = (
      wrapper.vm as unknown as {
        instance: {
          destroy: ReturnType<typeof vi.fn>;
          removeEventListener: ReturnType<typeof vi.fn>;
        };
      }
    ).instance;
    wrapper.unmount();
    expect(instance.destroy).toHaveBeenCalledTimes(1);
    expect(instance.removeEventListener).toHaveBeenCalled();
  });
});
