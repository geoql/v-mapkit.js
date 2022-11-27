<script lang="ts">
  import { tryOnMounted, tryOnUnmounted } from '@vueuse/core';
  import {
    h,
    reactive,
    defineComponent,
    type PropType,
    type SetupContext,
  } from 'vue';
  import type { GeocoderOptions, SearchOptions, VMapProps } from '~/types';
  import {
    mapAnnotationOverlayEvents,
    mapDisplayEvents,
    mapInteractionEvents,
    mapUserLocationEvents,
  } from '../utils/events';
  import { loadMapKit } from '../utils/helpers';
  import { useGlobalState } from '../utils/store';

  export default defineComponent({
    name: 'VMap',
    props: {
      version: {
        type: String as PropType<string>,
        required: false,
        default: '5.x.x',
        description: 'The version of mapkit.js to be map-loaded',
      },
      language: {
        type: String as PropType<string>,
        required: false,
        default: 'en',
        description: 'The language maps to be map-loaded in',
      },
      accessToken: {
        type: String as PropType<string>,
        required: true,
        default: '',
        description: 'The JWT required for loading the mapkit library',
      },
      initOptions: {
        type: Object as PropType<mapkit.MapKitInitOptions>,
        required: false,
        default: () => {
          return {};
        },
        description: 'The init options of loading map',
      },
      mapOptions: {
        type: Object as PropType<mapkit.MapConstructorOptions>,
        required: false,
        default: () => {
          return {};
        },
      },
      geocoderOptions: {
        type: Object as PropType<GeocoderOptions>,
        required: false,
        default: () => {
          return {
            enabled: false,
          };
        },
      },
      searchOptions: {
        type: Object as PropType<SearchOptions>,
        required: false,
        default: () => {
          return {
            enabled: false,
          };
        },
      },
    },
    emits: [
      'map',
      'map-initialized',
      'map-loaded',
      'map-destroyed',
      'geocoder-loaded',
      'search-loaded',
    ],
    setup(props: VMapProps, { slots, emit }: SetupContext) {
      // Use global state
      const state = useGlobalState();
      // MapKit related stuff
      let mapkit: typeof window.mapkit = reactive({} as typeof window.mapkit);
      // Emit init values
      emit('map-initialized', state.ui.init);
      emit('map-loaded', state.ui.load);
      emit('geocoder-loaded', state.ui.geocoderLoad);
      emit('search-loaded', state.ui.searchLoad);

      /**
       * Mounted Lifecycle Hook ♻️
       */
      tryOnMounted(async () => {
        try {
          mapkit = await loadMapKit(props.version);
          state.mapkit.value = mapkit;
        } catch (error: unknown) {
          throw new Error(error as string);
        }
        if (!state.ui.init) {
          try {
            await initMap();
          } catch (error: unknown) {
            throw new Error(error as string);
          }
          if (state.ui.init && !state.ui.load) {
            try {
              await loadMap();
              // Listen to events on Map
              listenMapEvents();
            } catch (error: unknown) {
              throw new Error(error as string);
            }
            if (props.geocoderOptions.enabled) {
              try {
                await loadGeocoder();
              } catch (error: unknown) {
                throw new Error(error as string);
              }
            }
            if (props.searchOptions.enabled) {
              try {
                await loadSearch();
              } catch (error: unknown) {
                throw new Error(error as string);
              }
            }
          }
        }
      });
      /**
       * Destroy the map
       */
      tryOnUnmounted(() => {
        if (state.map.value instanceof mapkit.Map) {
          state.map.value.destroy();
          emit('map-destroyed', true);
        }
      });

      /**
       * Initialize the map
       *
       * @returns {Promise<string>} - Returns a string promise
       */
      async function initMap(): Promise<string> {
        return new Promise((resolve, reject) => {
          const options: mapkit.MapKitInitOptions = {
            authorizationCallback: (done: (e: string) => void) => {
              done(props.accessToken);
            },
          };
          mapkit.init({ ...options, ...props.initOptions });
          // Else, resolve:
          state.ui.init = true;
          resolve('Map Initialized');
          emit('map-initialized', state.ui.init);
          // Listen in case of error:
          mapkit.addEventListener('error', (e) => {
            state.ui.init = false;
            reject(`Failed to initialize Map: ${e}`);
          });
        });
      }

      /**
       * Load the map
       *
       * @returns {Promise<string>} - Returns a string promise
       */
      async function loadMap(): Promise<string> {
        return new Promise((resolve, reject) => {
          state.map.value = new mapkit.Map('map', {
            ...props.mapOptions,
          });
          if (state.map.value instanceof mapkit.Map) {
            state.ui.load = true;
            resolve('Map Loaded');
          } else {
            state.ui.load = false;
            reject('Failed to load Map');
          }
          emit('map-loaded', state.ui.load);
          emit('map', state.map.value);
        });
      }

      /**
       * Loads the GeoCoder
       *
       * @returns {Promise<string>} - Returns a string promise
       */
      async function loadGeocoder(): Promise<string> {
        return new Promise((resolve, reject) => {
          state.geocoder.value = new mapkit.Geocoder(
            props.geocoderOptions.options,
          );
          if (state.geocoder.value instanceof mapkit.Geocoder) {
            state.ui.geocoderLoad = true;
            resolve('Geocoder Loaded');
          } else {
            state.ui.geocoderLoad = false;
            reject('Failed to load Geocoder');
          }
          emit('geocoder-loaded', state.ui.geocoderLoad);
        });
      }

      /**
       * Loads the Search
       *
       * @returns {Promise<string>} - Returns a string promise
       */
      async function loadSearch(): Promise<string> {
        return new Promise((resolve, reject) => {
          state.search.value = new mapkit.Search(props.searchOptions.options);
          if (state.search.value instanceof mapkit.Search) {
            state.ui.searchLoad = true;
            resolve('Search Loaded');
          } else {
            state.ui.searchLoad = false;
            reject('Failed to load Search');
          }
          emit('search-loaded', state.ui.searchLoad);
        });
      }

      /**
       * Listen to Map events
       *
       * @returns {void}
       */
      function listenMapEvents(): void {
        // // Map Display Events
        displayEvents();
        // Annotation and Overlay Events
        annotationOverlayEvents();
        // User Location Events
        userLocationEvents();
        // Map Interaction Events
        interactionEvents();
      }

      /**
       * Listen to Display events
       *
       * @returns {void}
       */
      function displayEvents(): void {
        mapDisplayEvents.forEach((e) => {
          state.map.value.addEventListener(e, (event) => {
            console.log(`Map Display Event ${e}`, event);
          });
        });
      }
      /**
       * Listen to map interaction events
       *
       * @returns {void}
       */
      function interactionEvents(): void {
        mapInteractionEvents.forEach((e) => {
          state.map.value.addEventListener(e, (event) => {
            console.log(`Map Interaction Event ${e}`, event);
          });
        });
      }
      /**
       * Listen to map annotation events
       *
       * @returns {void}
       */
      function annotationOverlayEvents(): void {
        mapAnnotationOverlayEvents.forEach((e) => {
          state.map.value.addEventListener(e, (event) => {
            console.log(`Map Annotation & Overlay Event ${e}`, event);
          });
        });
      }
      /**
       * Listen to map user location events
       *
       * @returns {void}
       */
      function userLocationEvents(): void {
        mapUserLocationEvents.forEach((e) => {
          state.map.value.addEventListener(e, (event) => {
            console.log(`Map User Location Event ${e}`, event);
          });
        });
      }

      return () =>
        h('div', { id: 'map' }, slots && slots.default ? slots.default() : {});
    },
  });
</script>

<style>
  #map {
    height: 100% !important;
    width: 100% !important;
  }
</style>
