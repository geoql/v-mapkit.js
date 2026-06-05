import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { h, nextTick } from 'vue';

import VCustomAnnotation from '@/components/VCustomAnnotation';
import VMap from '@/components/VMap';

const buildElement = (): HTMLElement => document.createElement('div');

describe('VCustomAnnotation', () => {
  it('adds a custom Annotation to the map and exposes it', async () => {
    const wrapper = mount(VMap, {
      props: { accessToken: 't' },
      slots: {
        default: () =>
          h(VCustomAnnotation, {
            coordinates: [37.3349, -122.009],
            element: buildElement,
          }),
      },
      global: { components: { VCustomAnnotation } },
    });
    await nextTick();
    await nextTick();
    const map = wrapper.emitted('map')![0][0] as unknown as {
      annotations: Array<{
        coordinate: { latitude: number; longitude: number };
      }>;
    };
    expect(map.annotations).toHaveLength(1);
    expect(map.annotations[0]).toBeInstanceOf(window.mapkit.Annotation);
    expect(map.annotations[0].coordinate.latitude).toBe(37.3349);
    expect(map.annotations[0].coordinate.longitude).toBe(-122.009);
  });

  it('invokes the element factory to produce the DOM element', async () => {
    const factory = vi.fn(buildElement);
    const wrapper = mount(VMap, {
      props: { accessToken: 't' },
      slots: {
        default: () =>
          h(VCustomAnnotation, {
            coordinates: [0, 0],
            element: factory,
          }),
      },
      global: { components: { VCustomAnnotation } },
    });
    await nextTick();
    await nextTick();
    const map = wrapper.emitted('map')![0][0] as unknown as {
      annotations: Array<{ element: HTMLElement }>;
    };
    expect(factory).toHaveBeenCalled();
    expect(map.annotations[0].element).toBeInstanceOf(HTMLElement);
  });

  it('removes the annotation on unmount', async () => {
    const wrapper = mount(VMap, {
      props: { accessToken: 't' },
      slots: {
        default: () =>
          h(VCustomAnnotation, {
            coordinates: [0, 0],
            element: buildElement,
          }),
      },
      global: { components: { VCustomAnnotation } },
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
