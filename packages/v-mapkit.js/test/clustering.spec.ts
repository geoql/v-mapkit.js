import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';

import VMap from '@/components/VMap';
import VMarkerAnnotation from '@/components/VMarkerAnnotation';
import VImageAnnotation from '@/components/VImageAnnotation';
import VPlaceAnnotation from '@/components/VPlaceAnnotation';
import VCustomAnnotation from '@/components/VCustomAnnotation';
import VMapFeatureAnnotation from '@/components/VMapFeatureAnnotation';
import VClusterAnnotation from '@/components/VClusterAnnotation';
import { useCluster } from '@/composables/use-cluster';

type TestMap = {
  annotations: Array<{ clusteringIdentifier: string | null }>;
  annotationForCluster?: (cluster: unknown) => unknown;
};

async function mountWithChild(child: ReturnType<typeof h>) {
  const wrapper = mount(VMap, {
    props: { accessToken: 't' },
    slots: { default: () => child },
  });
  await nextTick();
  await nextTick();
  return wrapper;
}

function getMap(wrapper: ReturnType<typeof mount>): TestMap {
  return wrapper.emitted('map')![0][0] as unknown as TestMap;
}

const fakePlace = { name: 'P' } as unknown as mapkit.Place;
const fakeFeature = {
  mapFeatureType: 'Building',
} as unknown as mapkit.MapFeature;
const buildElement = (): HTMLElement => document.createElement('div');

describe('clusteringIdentifier on annotations', () => {
  it('sets clusteringIdentifier on a marker annotation', async () => {
    const wrapper = await mountWithChild(
      h(VMarkerAnnotation, {
        coordinates: [1, 2],
        clusteringIdentifier: 'group-a',
      }),
    );
    const map = getMap(wrapper);
    expect(map.annotations).toHaveLength(1);
    expect(map.annotations[0].clusteringIdentifier).toBe('group-a');
  });

  it('leaves clusteringIdentifier null when prop omitted', async () => {
    const wrapper = await mountWithChild(
      h(VMarkerAnnotation, { coordinates: [1, 2] }),
    );
    const map = getMap(wrapper);
    expect(map.annotations[0].clusteringIdentifier).toBeNull();
  });

  it('sets clusteringIdentifier on an image annotation', async () => {
    const wrapper = await mountWithChild(
      h(VImageAnnotation, {
        coordinates: [1, 2],
        annotation: { url: { 1: 'x.png' } },
        clusteringIdentifier: 'group-b',
      }),
    );
    expect(getMap(wrapper).annotations[0].clusteringIdentifier).toBe('group-b');
  });

  it('sets clusteringIdentifier on a place annotation', async () => {
    const wrapper = await mountWithChild(
      h(VPlaceAnnotation, {
        place: fakePlace,
        clusteringIdentifier: 'group-c',
      }),
    );
    expect(getMap(wrapper).annotations[0].clusteringIdentifier).toBe('group-c');
  });

  it('sets clusteringIdentifier on a custom annotation', async () => {
    const wrapper = await mountWithChild(
      h(VCustomAnnotation, {
        coordinates: [1, 2],
        element: buildElement,
        clusteringIdentifier: 'group-d',
      }),
    );
    expect(getMap(wrapper).annotations[0].clusteringIdentifier).toBe('group-d');
  });

  it('sets clusteringIdentifier on a map feature annotation', async () => {
    const wrapper = await mountWithChild(
      h(VMapFeatureAnnotation, {
        feature: fakeFeature,
        clusteringIdentifier: 'group-e',
      }),
    );
    expect(getMap(wrapper).annotations[0].clusteringIdentifier).toBe('group-e');
  });
});

describe('VClusterAnnotation', () => {
  it('adds a marker annotation representing the cluster', async () => {
    const cluster = {
      coordinate: new window.mapkit.Coordinate(3, 4),
      memberAnnotations: [{}, {}],
      clusteringIdentifier: 'group-a',
    } as unknown as mapkit.Annotation;

    const wrapper = await mountWithChild(
      h(VClusterAnnotation, {
        cluster,
        annotation: { title: '2 places' },
      }),
    );
    const map = getMap(wrapper);
    expect(map.annotations).toHaveLength(1);
    expect(map.annotations[0]).toBeInstanceOf(window.mapkit.MarkerAnnotation);
    expect(map.annotations[0].clusteringIdentifier).toBe('group-a');
    expect(
      (map.annotations[0] as unknown as { memberAnnotations: unknown[] })
        .memberAnnotations,
    ).toHaveLength(2);
  });

  it('removes the cluster annotation on unmount', async () => {
    const cluster = {
      coordinate: new window.mapkit.Coordinate(3, 4),
      memberAnnotations: [],
      clusteringIdentifier: null,
    } as unknown as mapkit.Annotation;
    const wrapper = await mountWithChild(h(VClusterAnnotation, { cluster }));
    expect(getMap(wrapper).annotations).toHaveLength(1);
    wrapper.unmount();
  });
});

describe('useCluster', () => {
  it('sets the annotationForCluster delegate on the map', async () => {
    const createClusterAnnotation = vi.fn(
      (cluster: mapkit.Annotation) => cluster,
    );
    const Child = defineComponent({
      setup() {
        useCluster({ createClusterAnnotation });
        return () => h('div');
      },
    });
    const wrapper = await mountWithChild(h(Child));
    const map = getMap(wrapper);
    expect(typeof map.annotationForCluster).toBe('function');

    const cluster = { memberAnnotations: [] } as unknown as mapkit.Annotation;
    map.annotationForCluster!(cluster);
    expect(createClusterAnnotation).toHaveBeenCalledWith(cluster);
  });

  it('cleanup removes the delegate', async () => {
    let api: ReturnType<typeof useCluster> | undefined;
    const Child = defineComponent({
      setup() {
        api = useCluster({ createClusterAnnotation: (c) => c });
        return () => h('div');
      },
    });
    const wrapper = await mountWithChild(h(Child));
    const map = getMap(wrapper);
    expect(map.annotationForCluster).toBeTypeOf('function');
    api!.cleanup();
    expect(map.annotationForCluster).toBeUndefined();
  });

  it('throws when used outside a VMap', () => {
    const Orphan = defineComponent({
      setup() {
        useCluster({ createClusterAnnotation: (c) => c });
        return () => h('div');
      },
    });
    expect(() => mount(Orphan)).toThrow(/inside a <VMap>/);
  });
});

describe('VMap clusterAnnotation prop', () => {
  it('wires the delegate from the prop onto the map', async () => {
    const clusterAnnotation = vi.fn((c: mapkit.Annotation) => c);
    const wrapper = mount(VMap, {
      props: { accessToken: 't', clusterAnnotation },
    });
    await nextTick();
    await nextTick();
    const map = getMap(wrapper);
    expect(map.annotationForCluster).toBe(clusterAnnotation);
  });

  it('clears the delegate on unmount', async () => {
    const clusterAnnotation = vi.fn((c: mapkit.Annotation) => c);
    const wrapper = mount(VMap, {
      props: { accessToken: 't', clusterAnnotation },
    });
    await nextTick();
    await nextTick();
    const map = getMap(wrapper);
    expect(map.annotationForCluster).toBe(clusterAnnotation);
    wrapper.unmount();
    expect(map.annotationForCluster).toBeUndefined();
  });
});
