<template>
  <div id="map"></div>
</template>

<script lang="ts">
  /* eslint-disable no-undef */
  import { defineComponent, onMounted, PropType, reactive } from 'vue';
  import { loadMapKit } from './helpers';

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
      let init = false;
      let mapkit: typeof window.mapkit = reactive({} as typeof window.mapkit);
      const state = reactive({
        map: {} as mapkit.Map,
        options: {} as mapkit.MapConstructorOptions,
      });

      onMounted(async () => {
        mapkit = await loadMapKit(props.version);
        if (!init) {
          const options: mapkit.MapKitInitOptions = {
            authorizationCallback: (done: (e: string) => void) => {
              done(props.accessToken);
            },
          };
          mapkit.init({ ...options, ...props.initOptions });
          init = true;
          state.map = new mapkit.Map('map', {
            ...props.mapOptions,
            colorScheme: 'dark',
            isZoomEnabled: true,
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
    width: 100vw !important;
    height: 100vh !important;
  }
  .absolute {
    position: absolute;
  }
</style>
