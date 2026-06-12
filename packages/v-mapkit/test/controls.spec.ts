import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { h, nextTick } from 'vue';

import VMap from '@/components/VMap';
import VControlFullscreen from '@/components/VControlFullscreen';
import VControlGeolocate from '@/components/VControlGeolocate';
import VControlLayerSwitcher from '@/components/VControlLayerSwitcher';
import VControlLegend from '@/components/VControlLegend';

type FakeMap = {
  mapType?: string;
  showsCompass?: string;
  showsZoomControl?: boolean;
  showsScale?: string;
  showsMapTypeControl?: boolean;
  showsUserLocationControl?: boolean;
  showsUserLocation?: boolean;
  tracksUserLocation?: boolean;
  center?: { latitude: number; longitude: number };
  setCenterAnimated: ReturnType<typeof vi.fn>;
};

async function mountWithSlot(
  child: ReturnType<typeof h>,
  mapProps: Record<string, unknown> = {},
) {
  const wrapper = mount(VMap, {
    props: { accessToken: 't', ...mapProps },
    slots: { default: () => child },
  });
  await nextTick();
  await nextTick();
  const map = wrapper.emitted('map')![0][0] as unknown as FakeMap;
  return { wrapper, map };
}

describe('VMap control property toggles', () => {
  it('applies showsCompass as a FeatureVisibility constant on mount', async () => {
    const { map } = await mountWithSlot(h('div'), { showsCompass: 'hidden' });
    expect(map.showsCompass).toBe('hidden');
  });

  it('applies showsScale as a FeatureVisibility constant on mount', async () => {
    const { map } = await mountWithSlot(h('div'), { showsScale: 'adaptive' });
    expect(map.showsScale).toBe('adaptive');
  });

  it('applies boolean control toggles on mount', async () => {
    const { map } = await mountWithSlot(h('div'), {
      showsZoomControl: false,
      showsMapTypeControl: true,
      showsUserLocationControl: true,
      showsUserLocation: true,
      tracksUserLocation: false,
    });
    expect(map.showsZoomControl).toBe(false);
    expect(map.showsMapTypeControl).toBe(true);
    expect(map.showsUserLocationControl).toBe(true);
    expect(map.showsUserLocation).toBe(true);
    expect(map.tracksUserLocation).toBe(false);
  });

  it('updates showsCompass reactively when the prop changes', async () => {
    const { wrapper, map } = await mountWithSlot(h('div'), {
      showsCompass: 'adaptive',
    });
    expect(map.showsCompass).toBe('adaptive');
    await wrapper.setProps({ showsCompass: 'hidden' });
    await nextTick();
    expect(map.showsCompass).toBe('hidden');
  });

  it('updates showsZoomControl reactively including flipping to false', async () => {
    const { wrapper, map } = await mountWithSlot(h('div'), {
      showsZoomControl: true,
    });
    expect(map.showsZoomControl).toBe(true);
    await wrapper.setProps({ showsZoomControl: false });
    await nextTick();
    expect(map.showsZoomControl).toBe(false);
  });

  it('does not assign control props when unset (backward compat)', async () => {
    const { map } = await mountWithSlot(h('div'));
    expect(map.showsCompass).toBeUndefined();
    expect(map.showsZoomControl).toBeUndefined();
    expect(map.tracksUserLocation).toBeUndefined();
  });
});

describe('VControlFullscreen', () => {
  beforeEach(() => {
    (
      Element.prototype as unknown as { requestFullscreen: () => Promise<void> }
    ).requestFullscreen = vi.fn(() => Promise.resolve());
    (
      document as unknown as { exitFullscreen: () => Promise<void> }
    ).exitFullscreen = vi.fn(() => Promise.resolve());
  });

  it('renders a button positioned on the map', async () => {
    const { wrapper } = await mountWithSlot(
      h(VControlFullscreen, { position: 'top-right' }),
    );
    const btn = wrapper.find('.v-mapkit-control-fullscreen');
    expect(btn.exists()).toBe(true);
    expect(btn.classes()).toContain('v-mapkit-control--top-right');
  });

  it('requests fullscreen on the map container when clicked', async () => {
    const { wrapper } = await mountWithSlot(h(VControlFullscreen));
    const container = wrapper.element as HTMLElement;
    const request = vi.fn(() => Promise.resolve());
    (
      container as unknown as { requestFullscreen: () => Promise<void> }
    ).requestFullscreen = request;
    await wrapper.find('.v-mapkit-control-fullscreen').trigger('click');
    expect(request).toHaveBeenCalledTimes(1);
  });

  it('exits fullscreen when clicked while already fullscreen', async () => {
    const { wrapper } = await mountWithSlot(h(VControlFullscreen));
    const container = wrapper.element as HTMLElement;
    Object.defineProperty(document, 'fullscreenElement', {
      value: container,
      configurable: true,
    });
    await wrapper.find('.v-mapkit-control-fullscreen').trigger('click');
    expect(
      (document as unknown as { exitFullscreen: ReturnType<typeof vi.fn> })
        .exitFullscreen,
    ).toHaveBeenCalledTimes(1);
    Object.defineProperty(document, 'fullscreenElement', {
      value: null,
      configurable: true,
    });
  });
});

describe('VControlGeolocate', () => {
  let getCurrentPosition: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    getCurrentPosition = vi.fn(
      (
        success: (p: {
          coords: { latitude: number; longitude: number };
        }) => void,
      ) => {
        success({ coords: { latitude: 51.5, longitude: -0.12 } });
      },
    );
    Object.defineProperty(globalThis.navigator, 'geolocation', {
      value: { getCurrentPosition, watchPosition: vi.fn() },
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders a button positioned on the map', async () => {
    const { wrapper } = await mountWithSlot(
      h(VControlGeolocate, { position: 'bottom-left' }),
    );
    const btn = wrapper.find('.v-mapkit-control-geolocate');
    expect(btn.exists()).toBe(true);
    expect(btn.classes()).toContain('v-mapkit-control--bottom-left');
  });

  it('centers the map on the current position when clicked', async () => {
    const { wrapper, map } = await mountWithSlot(h(VControlGeolocate));
    await wrapper.find('.v-mapkit-control-geolocate').trigger('click');
    expect(getCurrentPosition).toHaveBeenCalledTimes(1);
    expect(map.setCenterAnimated).toHaveBeenCalledTimes(1);
    const coord = map.setCenterAnimated.mock.calls[0][0] as {
      latitude: number;
      longitude: number;
    };
    expect(coord.latitude).toBe(51.5);
    expect(coord.longitude).toBe(-0.12);
  });

  it('uses watchPosition when trackUserLocation is true', async () => {
    const watchPosition = vi.fn();
    Object.defineProperty(globalThis.navigator, 'geolocation', {
      value: { getCurrentPosition, watchPosition },
      configurable: true,
    });
    const { wrapper } = await mountWithSlot(
      h(VControlGeolocate, { trackUserLocation: true }),
    );
    await wrapper.find('.v-mapkit-control-geolocate').trigger('click');
    expect(watchPosition).toHaveBeenCalledTimes(1);
    expect(getCurrentPosition).not.toHaveBeenCalled();
  });
});

describe('VControlLayerSwitcher', () => {
  it('renders a select positioned on the map with default map types', async () => {
    const { wrapper } = await mountWithSlot(
      h(VControlLayerSwitcher, { position: 'top-left' }),
    );
    const control = wrapper.find('.v-mapkit-control-layer-switcher');
    expect(control.exists()).toBe(true);
    expect(control.classes()).toContain('v-mapkit-control--top-left');
    const options = wrapper.findAll('.v-mapkit-control-layer-switcher option');
    expect(options.length).toBe(4);
  });

  it('switches the map type when an option is selected', async () => {
    const { wrapper, map } = await mountWithSlot(h(VControlLayerSwitcher));
    const select = wrapper.find('.v-mapkit-control-layer-switcher select');
    await select.setValue('satellite');
    expect(map.mapType).toBe('satellite');
  });

  it('renders custom map types when provided', async () => {
    const mapTypes = [
      { type: 'standard' as mapkit.MapType, label: 'Map' },
      { type: 'satellite' as mapkit.MapType, label: 'Aerial' },
    ];
    const { wrapper } = await mountWithSlot(
      h(VControlLayerSwitcher, { mapTypes }),
    );
    const options = wrapper.findAll('.v-mapkit-control-layer-switcher option');
    expect(options.length).toBe(2);
    expect(options[1].text()).toBe('Aerial');
  });
});

describe('VControlLegend', () => {
  it('renders slot content positioned on the map', async () => {
    const { wrapper } = await mountWithSlot(
      h(
        VControlLegend,
        { position: 'bottom-right' },
        { default: () => h('span', { class: 'legend-item' }, 'Roads') },
      ),
    );
    const legend = wrapper.find('.v-mapkit-control-legend');
    expect(legend.exists()).toBe(true);
    expect(legend.classes()).toContain('v-mapkit-control--bottom-right');
    expect(wrapper.find('.legend-item').text()).toBe('Roads');
  });
});
