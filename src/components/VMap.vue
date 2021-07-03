<template>
  <div id="map"></div>
</template>

<script lang="ts">
  import {
    defineComponent,
    onMounted,
    PropType,
    ref,
    Ref,
    reactive,
  } from 'vue';
  import { loadMapKit } from '../utils/helpers';

  export default defineComponent({
    name: 'VMap',
    props: {
      version: {
        type: String as PropType<string>,
        required: false,
        default: '5.x.x',
        description: 'The version of mapkit.js to be loaded',
      },
      language: {
        type: String as PropType<string>,
        required: false,
        default: 'en',
        description: 'The language maps to be loaded in',
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
    },
    setup(props) {
      let init: Ref<boolean> = ref(false);
      let mapkit: typeof window.mapkit = reactive({} as typeof window.mapkit);
      const state = reactive({
        map: {} as mapkit.Map,
        options: {} as mapkit.MapConstructorOptions,
      });

      /**
       * Mounted Lifecycle Hook ♻️
       */
      onMounted(async () => {
        try {
          mapkit = await loadMapKit(props.version);
        } catch (error) {
          throw new Error('Failed to load Mapkit');
        }
        if (!init.value) {
          const options: mapkit.MapKitInitOptions = {
            authorizationCallback: (done: (e: string) => void) => {
              done(props.accessToken);
            },
          };
          mapkit.init({ ...options, ...props.initOptions });
          init.value = true;
          state.map = new mapkit.Map('map', {
            ...props.mapOptions,
          });
        }
      });

      return {
        mapkit,
      };
    },
  });
</script>

<style>
  #map {
    width: 100% !important;
    height: 100% !important;
  }
</style>
