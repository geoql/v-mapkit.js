import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';

import VMap from '@/components/VMap';

type FakeMap = {
  colorScheme?: string;
  distances?: string;
  padding?: unknown;
  tintColor?: string;
  pointOfInterestFilter?: unknown;
  showsPointsOfInterest?: boolean;
  cameraBoundary?: unknown;
  cameraDistance?: number;
  cameraZoomRange?: unknown;
  selectableMapFeatures?: unknown[];
};

async function mountAndGetMap(props: Record<string, unknown> = {}) {
  const wrapper = mount(VMap, {
    props: { accessToken: 't', ...props },
  });
  await nextTick();
  await nextTick();
  const mapEvents = wrapper.emitted('map');
  expect(mapEvents).toBeTruthy();
  return { wrapper, map: mapEvents![0][0] as unknown as FakeMap };
}

describe('VMap configuration props', () => {
  it('mounts without any configuration props (props are optional)', async () => {
    const { map } = await mountAndGetMap();
    expect(map).toBeDefined();
    expect(map.colorScheme).toBeUndefined();
    expect(map.distances).toBeUndefined();
    expect(map.tintColor).toBeUndefined();
    expect(map.cameraDistance).toBeUndefined();
  });

  it('applies colorScheme on mount', async () => {
    const { map } = await mountAndGetMap({ colorScheme: 'dark' });
    expect(map.colorScheme).toBe('dark');
  });

  it('applies distances on mount', async () => {
    const { map } = await mountAndGetMap({ distances: 'imperial' });
    expect(map.distances).toBe('imperial');
  });

  it('applies padding on mount', async () => {
    const padding = { top: 10, right: 20, bottom: 30, left: 40 };
    const { map } = await mountAndGetMap({ padding });
    expect(map.padding).toEqual(padding);
  });

  it('applies tintColor on mount', async () => {
    const { map } = await mountAndGetMap({ tintColor: '#ff00ff' });
    expect(map.tintColor).toBe('#ff00ff');
  });

  it('applies pointOfInterestFilter on mount', async () => {
    const filter = { __kind: 'poi-filter' };
    const { map } = await mountAndGetMap({ pointOfInterestFilter: filter });
    expect(map.pointOfInterestFilter).toEqual(filter);
  });

  it('applies showsPointsOfInterest=false on mount', async () => {
    const { map } = await mountAndGetMap({ showsPointsOfInterest: false });
    expect(map.showsPointsOfInterest).toBe(false);
  });

  it('applies cameraBoundary on mount', async () => {
    const boundary = { region: { __kind: 'region' } };
    const { map } = await mountAndGetMap({ cameraBoundary: boundary });
    expect(map.cameraBoundary).toEqual(boundary);
  });

  it('applies cameraDistance=0 on mount (falsy-but-defined)', async () => {
    const { map } = await mountAndGetMap({ cameraDistance: 0 });
    expect(map.cameraDistance).toBe(0);
  });

  it('applies cameraZoomRange on mount', async () => {
    const range = { __kind: 'range' };
    const { map } = await mountAndGetMap({ cameraZoomRange: range });
    expect(map.cameraZoomRange).toEqual(range);
  });

  it('applies selectableMapFeatures on mount', async () => {
    const features = ['pointOfInterest', 'building'];
    const { map } = await mountAndGetMap({ selectableMapFeatures: features });
    expect(map.selectableMapFeatures).toEqual(features);
  });

  it('updates colorScheme reactively when prop changes', async () => {
    const { wrapper, map } = await mountAndGetMap({ colorScheme: 'light' });
    expect(map.colorScheme).toBe('light');
    await wrapper.setProps({ colorScheme: 'dark' });
    await nextTick();
    expect(map.colorScheme).toBe('dark');
  });

  it('updates distances reactively when prop changes', async () => {
    const { wrapper, map } = await mountAndGetMap({ distances: 'metric' });
    await wrapper.setProps({ distances: 'imperial' });
    await nextTick();
    expect(map.distances).toBe('imperial');
  });

  it('updates padding reactively when prop changes', async () => {
    const initial = { top: 1, right: 1, bottom: 1, left: 1 };
    const next = { top: 50, right: 50, bottom: 50, left: 50 };
    const { wrapper, map } = await mountAndGetMap({ padding: initial });
    expect(map.padding).toEqual(initial);
    await wrapper.setProps({ padding: next });
    await nextTick();
    expect(map.padding).toEqual(next);
  });

  it('updates tintColor reactively when prop changes', async () => {
    const { wrapper, map } = await mountAndGetMap({ tintColor: '#000' });
    await wrapper.setProps({ tintColor: '#fff' });
    await nextTick();
    expect(map.tintColor).toBe('#fff');
  });

  it('updates pointOfInterestFilter reactively when prop changes', async () => {
    const a = { __kind: 'a' };
    const b = { __kind: 'b' };
    const { wrapper, map } = await mountAndGetMap({
      pointOfInterestFilter: a,
    });
    expect(map.pointOfInterestFilter).toEqual(a);
    await wrapper.setProps({ pointOfInterestFilter: b });
    await nextTick();
    expect(map.pointOfInterestFilter).toEqual(b);
  });

  it('updates showsPointsOfInterest reactively including flipping to false', async () => {
    const { wrapper, map } = await mountAndGetMap({
      showsPointsOfInterest: true,
    });
    expect(map.showsPointsOfInterest).toBe(true);
    await wrapper.setProps({ showsPointsOfInterest: false });
    await nextTick();
    expect(map.showsPointsOfInterest).toBe(false);
  });

  it('updates cameraBoundary reactively when prop changes', async () => {
    const a = { region: { id: 1 } };
    const b = { mapRect: { id: 2 } };
    const { wrapper, map } = await mountAndGetMap({ cameraBoundary: a });
    expect(map.cameraBoundary).toEqual(a);
    await wrapper.setProps({ cameraBoundary: b });
    await nextTick();
    expect(map.cameraBoundary).toEqual(b);
  });

  it('updates cameraDistance reactively when prop changes', async () => {
    const { wrapper, map } = await mountAndGetMap({ cameraDistance: 100 });
    await wrapper.setProps({ cameraDistance: 250 });
    await nextTick();
    expect(map.cameraDistance).toBe(250);
  });

  it('updates cameraZoomRange reactively when prop changes', async () => {
    const a = { min: 0, max: 100 };
    const b = { min: 50, max: 500 };
    const { wrapper, map } = await mountAndGetMap({ cameraZoomRange: a });
    expect(map.cameraZoomRange).toEqual(a);
    await wrapper.setProps({ cameraZoomRange: b });
    await nextTick();
    expect(map.cameraZoomRange).toEqual(b);
  });

  it('updates selectableMapFeatures reactively when prop changes', async () => {
    const a = ['pointOfInterest'];
    const b = ['building', 'terrain'];
    const { wrapper, map } = await mountAndGetMap({
      selectableMapFeatures: a,
    });
    expect(map.selectableMapFeatures).toEqual(a);
    await wrapper.setProps({ selectableMapFeatures: b });
    await nextTick();
    expect(map.selectableMapFeatures).toEqual(b);
  });

  it('does not assign colorScheme when prop is unset (backward compat)', async () => {
    const { map } = await mountAndGetMap({ distances: 'metric' });
    expect(map.colorScheme).toBeUndefined();
    expect(map.distances).toBe('metric');
  });
});
