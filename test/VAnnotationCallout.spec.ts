import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';

import VAnnotationCallout from '@/components/VAnnotationCallout';
import VMarkerAnnotation from '@/components/VMarkerAnnotation';
import VMap from '@/components/VMap';

type CalloutAnnotation = mapkit.Annotation & {
  callout?: mapkit.AnnotationCalloutDelegate;
  calloutEnabled?: boolean;
};

const mountWithCallout = (calloutProps: Record<string, unknown> = {}) =>
  mount(VMap, {
    props: { accessToken: 't' },
    slots: {
      default: () =>
        h(
          VMarkerAnnotation,
          { coordinates: [37.3349, -122.009] },
          {
            default: () =>
              h(VAnnotationCallout, calloutProps, {
                default: () => h('div', { class: 'callout-body' }, 'Hello'),
              }),
          },
        ),
    },
    global: { components: { VMarkerAnnotation, VAnnotationCallout } },
  });

const getAnnotation = (
  wrapper: ReturnType<typeof mountWithCallout>,
): CalloutAnnotation => {
  const map = wrapper.emitted('map')![0][0] as unknown as {
    annotations: CalloutAnnotation[];
  };
  return map.annotations[0];
};

describe('VAnnotationCallout', () => {
  it('sets a callout delegate on the parent annotation', async () => {
    const wrapper = mountWithCallout();
    await nextTick();
    await nextTick();
    const annotation = getAnnotation(wrapper);
    expect(annotation.callout).toBeTruthy();
    expect(typeof annotation.callout!.calloutContentForAnnotation).toBe(
      'function',
    );
  });

  it('enables the callout on the parent annotation', async () => {
    const wrapper = mountWithCallout();
    await nextTick();
    await nextTick();
    const annotation = getAnnotation(wrapper);
    expect(annotation.calloutEnabled).toBe(true);
  });

  it('returns the slot content from calloutContentForAnnotation', async () => {
    const wrapper = mountWithCallout();
    await nextTick();
    await nextTick();
    const annotation = getAnnotation(wrapper);
    const content =
      annotation.callout!.calloutContentForAnnotation!(annotation);
    expect(content).toBeInstanceOf(HTMLElement);
    expect(
      (content as HTMLElement).querySelector('.callout-body'),
    ).toBeTruthy();
    expect((content as HTMLElement).textContent).toContain('Hello');
  });

  it('returns left and right accessories when provided', async () => {
    const left = document.createElement('span');
    left.className = 'left-accessory';
    const right = document.createElement('span');
    right.className = 'right-accessory';
    const wrapper = mountWithCallout({ accessory: { left, right } });
    await nextTick();
    await nextTick();
    const annotation = getAnnotation(wrapper);
    expect(
      annotation.callout!.calloutLeftAccessoryForAnnotation!(annotation),
    ).toBe(left);
    expect(
      annotation.callout!.calloutRightAccessoryForAnnotation!(annotation),
    ).toBe(right);
  });

  it('does not define accessory methods when no accessories are provided', async () => {
    const wrapper = mountWithCallout();
    await nextTick();
    await nextTick();
    const annotation = getAnnotation(wrapper);
    expect(
      annotation.callout!.calloutLeftAccessoryForAnnotation,
    ).toBeUndefined();
    expect(
      annotation.callout!.calloutRightAccessoryForAnnotation,
    ).toBeUndefined();
  });

  it('accepts an annotation passed explicitly via prop', async () => {
    const explicit = {
      coordinate: { latitude: 0, longitude: 0 },
    } as unknown as CalloutAnnotation;
    const Host = defineComponent({
      components: { VAnnotationCallout },
      setup() {
        return () =>
          h(
            VAnnotationCallout,
            { annotation: explicit },
            { default: () => h('div', 'Body') },
          );
      },
    });
    mount(Host);
    await nextTick();
    expect(explicit.callout).toBeTruthy();
    expect(explicit.calloutEnabled).toBe(true);
  });

  it('clears the callout delegate on unmount', async () => {
    const wrapper = mountWithCallout();
    await nextTick();
    await nextTick();
    const annotation = getAnnotation(wrapper);
    expect(annotation.callout).toBeTruthy();
    wrapper.unmount();
    expect(annotation.callout).toBeUndefined();
    expect(annotation.calloutEnabled).toBe(false);
  });
});
