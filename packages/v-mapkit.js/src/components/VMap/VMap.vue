<script setup lang="ts">
  import {
    onBeforeUnmount,
    onMounted,
    provide,
    ref,
    shallowRef,
    watch,
  } from 'vue';

  import { initMapKit, loadMapKit } from '../../composables/useMapKit';
  import {
    MapKitGlobalKey,
    MapKitInstanceKey,
    MapKitReadyKey,
  } from '../../symbols';
  import {
    annotationEvents,
    mapDisplayEvents,
    mapInteractionEvents,
    mapUserLocationEvents,
    overlayEvents,
  } from '../../constants/events';

  const props = withDefaults(
    defineProps<{
      accessToken: string;
      version?: string;
      language?: string;
      initOptions?: mapkit.MapKitInitOptions;
      mapOptions?: mapkit.MapConstructorOptions;
      clusterAnnotation?: (cluster: mapkit.Annotation) => mapkit.Annotation;
      colorScheme?: 'light' | 'dark';
      distances?: 'automatic' | 'metric' | 'imperial';
      padding?: mapkit.Padding;
      tintColor?: string;
      pointOfInterestFilter?: mapkit.PointOfInterestFilter;
      showsPointsOfInterest?: boolean;
      cameraBoundary?: mapkit.CameraBoundary;
      cameraDistance?: number;
      cameraZoomRange?: mapkit.CameraZoomRange;
      selectableMapFeatures?: mapkit.SelectableMapFeature[];
      showsCompass?: 'adaptive' | 'hidden';
      showsZoomControl?: boolean;
      showsScale?: 'adaptive' | 'hidden';
      showsMapTypeControl?: boolean;
      showsUserLocationControl?: boolean;
      showsUserLocation?: boolean;
      tracksUserLocation?: boolean;
    }>(),
    {
      version: '5.x.x',
      language: 'en',
      initOptions: () => ({}) as mapkit.MapKitInitOptions,
      mapOptions: () => ({}) as mapkit.MapConstructorOptions,
      showsZoomControl: undefined,
      showsMapTypeControl: undefined,
      showsUserLocationControl: undefined,
      showsUserLocation: undefined,
      tracksUserLocation: undefined,
    },
  );

  const emit = defineEmits<{
    map: [map: mapkit.Map];
    'map-initialized': [ok: boolean];
    'map-loaded': [ok: boolean];
    'map-destroyed': [ok: boolean];
    'region-change-start': [event: unknown];
    'region-change-end': [event: unknown];
    'rotation-start': [event: unknown];
    'rotation-end': [event: unknown];
    'scroll-start': [event: unknown];
    'scroll-end': [event: unknown];
    'zoom-start': [event: unknown];
    'zoom-end': [event: unknown];
    'map-type-change': [event: unknown];
    select: [event: unknown];
    deselect: [event: unknown];
    'drag-start': [event: unknown];
    dragging: [event: unknown];
    'drag-end': [event: unknown];
    'user-location-change': [event: unknown];
    'user-location-error': [event: unknown];
    'single-tap': [event: unknown];
    'double-tap': [event: unknown];
    'long-press': [event: unknown];
  }>();

  const root = ref<HTMLDivElement>();
  const mapkitGlobal = shallowRef<typeof mapkit>();
  const map = shallowRef<mapkit.Map>();
  const ready = ref(false);

  provide(MapKitGlobalKey, mapkitGlobal);
  provide(MapKitInstanceKey, map);
  provide(MapKitReadyKey, ready);

  const allEvents = [
    ...mapDisplayEvents,
    ...mapUserLocationEvents,
    ...mapInteractionEvents,
    ...annotationEvents,
    ...overlayEvents,
  ];

  // Vue types `emit` as an intersection of per-event call signatures, so calling
  // it with a union-typed event name is rejected (TS2769). Narrow it once to a
  // single signature whose name is the real `MapEvents` key union (not `never`).
  const emitMapEvent = emit as (
    name: keyof mapkit.MapEvents<string>,
    event: unknown,
  ) => void;

  const handlers: Array<{
    name: keyof mapkit.MapEvents<string>;
    fn: (e: unknown) => void;
  }> = [];

  const resolveVisibility = (
    mk: typeof mapkit,
    value: 'adaptive' | 'hidden',
  ): string =>
    value === 'hidden'
      ? mk.FeatureVisibility.Hidden
      : mk.FeatureVisibility.Adaptive;

  let isUnmounted = false;
  let inflight: mapkit.Map | undefined;

  onBeforeUnmount(() => {
    isUnmounted = true;
    const m = map.value ?? inflight;
    if (m) {
      for (const { name, fn } of handlers) m.removeEventListener?.(name, fn);
      if (props.clusterAnnotation)
        (m as { annotationForCluster?: unknown }).annotationForCluster =
          undefined;
      m.destroy();
      emit('map-destroyed', true);
    }
  });

  onMounted(async () => {
    try {
      const mk = await loadMapKit(props.version);
      if (isUnmounted) return;
      mapkitGlobal.value = mk;
      initMapKit(mk, props.accessToken, {
        language: props.language,
        ...props.initOptions,
      });
      emit('map-initialized', true);

      const created = new mk.Map(root.value!, props.mapOptions);
      inflight = created;
      if (isUnmounted) {
        created.destroy();
        return;
      }
      if (props.clusterAnnotation) {
        created.annotationForCluster = props.clusterAnnotation;
      }
      if (props.colorScheme) created.colorScheme = props.colorScheme;
      if (props.distances) created.distances = props.distances;
      if (props.padding) created.padding = props.padding;
      if (props.tintColor) created.tintColor = props.tintColor;
      if (props.pointOfInterestFilter)
        created.pointOfInterestFilter = props.pointOfInterestFilter;
      if (props.showsPointsOfInterest !== undefined)
        created.showsPointsOfInterest = props.showsPointsOfInterest;
      if (props.cameraBoundary) created.cameraBoundary = props.cameraBoundary;
      if (props.cameraDistance !== undefined)
        created.cameraDistance = props.cameraDistance;
      if (props.cameraZoomRange)
        created.cameraZoomRange = props.cameraZoomRange;
      if (props.selectableMapFeatures)
        (
          created as unknown as { selectableMapFeatures: unknown[] }
        ).selectableMapFeatures = props.selectableMapFeatures;
      if (props.showsCompass)
        created.showsCompass = resolveVisibility(mk, props.showsCompass);
      if (props.showsZoomControl !== undefined)
        created.showsZoomControl = props.showsZoomControl;
      if (props.showsScale)
        created.showsScale = resolveVisibility(mk, props.showsScale);
      if (props.showsMapTypeControl !== undefined)
        created.showsMapTypeControl = props.showsMapTypeControl;
      if (props.showsUserLocationControl !== undefined)
        created.showsUserLocationControl = props.showsUserLocationControl;
      if (props.showsUserLocation !== undefined)
        created.showsUserLocation = props.showsUserLocation;
      if (props.tracksUserLocation !== undefined)
        created.tracksUserLocation = props.tracksUserLocation;
      map.value = created;
      ready.value = true;
      emit('map-loaded', true);
      emit('map', created);

      for (const name of allEvents) {
        const fn = (event: unknown) => emitMapEvent(name, event);
        created.addEventListener(name, fn);
        handlers.push({ name, fn });
      }
    } catch {
      if (!isUnmounted) emit('map-loaded', false);
    }
  });

  watch(
    () => props.colorScheme,
    (val) => {
      if (val && map.value) map.value.colorScheme = val;
    },
  );
  watch(
    () => props.distances,
    (val) => {
      if (val && map.value) map.value.distances = val;
    },
  );
  watch(
    () => props.padding,
    (val) => {
      if (val && map.value) map.value.padding = val;
    },
  );
  watch(
    () => props.tintColor,
    (val) => {
      if (val && map.value) map.value.tintColor = val;
    },
  );
  watch(
    () => props.pointOfInterestFilter,
    (val) => {
      if (val && map.value) map.value.pointOfInterestFilter = val;
    },
  );
  watch(
    () => props.showsPointsOfInterest,
    (val) => {
      if (val !== undefined && map.value) map.value.showsPointsOfInterest = val;
    },
  );
  watch(
    () => props.cameraBoundary,
    (val) => {
      if (val && map.value) map.value.cameraBoundary = val;
    },
  );
  watch(
    () => props.cameraDistance,
    (val) => {
      if (val !== undefined && map.value) map.value.cameraDistance = val;
    },
  );
  watch(
    () => props.cameraZoomRange,
    (val) => {
      if (val && map.value) map.value.cameraZoomRange = val;
    },
  );
  watch(
    () => props.selectableMapFeatures,
    (val) => {
      if (val && map.value)
        (
          map.value as unknown as { selectableMapFeatures: unknown[] }
        ).selectableMapFeatures = val;
    },
  );
  watch(
    () => props.showsCompass,
    (val) => {
      if (val && map.value && mapkitGlobal.value)
        map.value.showsCompass = resolveVisibility(mapkitGlobal.value, val);
    },
  );
  watch(
    () => props.showsZoomControl,
    (val) => {
      if (val !== undefined && map.value) map.value.showsZoomControl = val;
    },
  );
  watch(
    () => props.showsScale,
    (val) => {
      if (val && map.value && mapkitGlobal.value)
        map.value.showsScale = resolveVisibility(mapkitGlobal.value, val);
    },
  );
  watch(
    () => props.showsMapTypeControl,
    (val) => {
      if (val !== undefined && map.value) map.value.showsMapTypeControl = val;
    },
  );
  watch(
    () => props.showsUserLocationControl,
    (val) => {
      if (val !== undefined && map.value)
        map.value.showsUserLocationControl = val;
    },
  );
  watch(
    () => props.showsUserLocation,
    (val) => {
      if (val !== undefined && map.value) map.value.showsUserLocation = val;
    },
  );
  watch(
    () => props.tracksUserLocation,
    (val) => {
      if (val !== undefined && map.value) map.value.tracksUserLocation = val;
    },
  );

  defineExpose({ map, ready, mapkit: mapkitGlobal });
</script>

<template>
  <div ref="root" class="v-mapkit">
    <slot v-bind="{ ready, map }" />
  </div>
</template>

<style scoped>
  .v-mapkit {
    width: 100%;
    height: 100%;
  }
</style>
