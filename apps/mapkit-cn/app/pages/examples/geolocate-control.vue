<script setup lang="ts">
  import { VControlGeolocate, VMap } from '@geoql/v-mapkit.js';
  import { centerMap, places } from '~/composables/useMapDemo';

  definePageMeta({ layout: 'example' });
  useHead({ title: 'Geolocate Control · mapkit-cn' });

  const { token } = useMapkitToken();

  const status = ref('Click the ◎ button to locate yourself.');

  function onLocate(position: GeolocationPosition): void {
    const { latitude, longitude } = position.coords;
    status.value = `Located: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  }

  function onError(err: GeolocationPositionError): void {
    status.value = `Error: ${err.message}`;
  }

  function onMap(map: unknown): void {
    centerMap(map as never, places.sanFrancisco, 0.2);
  }

  const code = `<script setup lang="ts">
  import { VMap, VControlGeolocate } from '@geoql/v-mapkit.js';

  function onLocate(position) {
    console.log(position.coords.latitude, position.coords.longitude);
  }
<\x2Fscript>

<template>
  <VMap :access-token="token">
    <VControlGeolocate
      position="top-right"
      :track-user-location="false"
      @locate="onLocate"
      @error="(e) => console.warn(e)"
    />
  </VMap>
</template>`;
</script>

<template>
  <ExampleCard
    title="Geolocate Control"
    description="VControlGeolocate centers the map on the visitor's location using the browser Geolocation API. It emits locate with the position and error if permission is denied. Set track-user-location to follow movement."
  >
    <ExampleMapContainer>
      <VMap :access-token="token" color-scheme="light" @map="onMap">
        <VControlGeolocate
          position="top-right"
          :track-user-location="false"
          @locate="onLocate"
          @error="onError"
        />
      </VMap>
    </ExampleMapContainer>

    <template #controls>
      <p
        class="rounded-lg bg-secondary/50 px-3 py-2 font-mono text-xs text-muted-foreground"
      >
        {{ status }}
      </p>
    </template>

    <template #code>
      <ExampleCodeBlock :code="code" filename="GeolocateControl.vue" />
    </template>
  </ExampleCard>
</template>
