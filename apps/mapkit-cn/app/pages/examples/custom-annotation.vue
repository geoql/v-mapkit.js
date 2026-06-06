<script setup lang="ts">
  import { VCustomAnnotation, VMap } from 'v-mapkit.js';
  import { centerMap, places } from '~/composables/useMapDemo';

  definePageMeta({ layout: 'example' });
  useHead({ title: 'Custom Annotation · mapkit-cn' });

  const { token } = useMapkitToken();

  const markers: Array<{ at: [number, number]; label: string; price: string }> =
    [
      { at: [51.5074, -0.1278], label: 'Westminster', price: '£420' },
      { at: [51.5155, -0.0922], label: 'The City', price: '£560' },
      { at: [51.5033, -0.1196], label: 'South Bank', price: '£380' },
    ];

  // Factory returning a styled DOM node — VCustomAnnotation mounts whatever you build.
  function buildPriceTag(price: string): () => HTMLElement {
    return () => {
      const el = document.createElement('div');
      el.textContent = price;
      el.style.cssText = [
        'padding:4px 10px',
        'border-radius:9999px',
        'background:#0a84ff',
        'color:white',
        'font:600 13px/1 ui-sans-serif,system-ui',
        'box-shadow:0 2px 8px rgba(0,0,0,0.25)',
        'white-space:nowrap',
        'transform:translateY(-50%)',
      ].join(';');
      return el;
    };
  }

  function onMap(map: unknown): void {
    centerMap(map as never, places.london, 0.06);
  }

  const code = `<script setup lang="ts">
  import { VMap, VCustomAnnotation } from 'v-mapkit.js';

  function buildPriceTag(price) {
    return () => {
      const el = document.createElement('div');
      el.textContent = price;
      el.className = 'price-tag';
      return el;
    };
  }
<\x2Fscript>

<template>
  <VMap :access-token="token">
    <VCustomAnnotation
      :coordinates="[51.5074, -0.1278]"
      :element="buildPriceTag('£420')"
    />
  </VMap>
</template>`;
</script>

<template>
  <ExampleCard
    title="Custom Annotation"
    description="VCustomAnnotation hands you full control: provide an element factory that returns any DOM node and MapKit anchors it to the coordinate. Perfect for price tags, avatars, or live badges."
  >
    <ExampleMapContainer>
      <VMap :access-token="token" color-scheme="dark" @map="onMap">
        <VCustomAnnotation
          v-for="marker in markers"
          :key="marker.label"
          :coordinates="marker.at"
          :element="buildPriceTag(marker.price)"
        />
      </VMap>
    </ExampleMapContainer>

    <template #code>
      <ExampleCodeBlock :code="code" filename="CustomAnnotation.vue" />
    </template>
  </ExampleCard>
</template>
