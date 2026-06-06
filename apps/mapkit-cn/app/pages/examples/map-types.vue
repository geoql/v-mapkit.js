<script setup lang="ts">
  import { VMap } from 'v-mapkit.js';
  import { Button } from '@/components/ui/button';
  import { centerMap, places } from '~/composables/useMapDemo';

  definePageMeta({ layout: 'example' });
  useHead({ title: 'Map Types · mapkit-cn' });

  const { token } = useMapkitToken();

  const mapTypes = [
    { id: 'standard', label: 'Standard' },
    { id: 'mutedStandard', label: 'Muted' },
    { id: 'hybrid', label: 'Hybrid' },
    { id: 'satellite', label: 'Satellite' },
  ] as const;

  const active = ref<(typeof mapTypes)[number]['id']>('standard');
  const mapRef = ref<{ map?: { mapType: string } } | undefined>();

  function applyType(): void {
    const map = mapRef.value?.map;
    if (map) map.mapType = active.value;
  }

  function onMap(map: unknown): void {
    centerMap(map as never, places.sanFrancisco, 0.12);
    applyType();
  }

  watch(active, applyType);

  const code = `<script setup lang="ts">
  import { ref } from 'vue';
  import { VMap } from 'v-mapkit.js';

  const mapRef = ref();
  const active = ref('satellite');

  watch(active, () => {
    if (mapRef.value?.map) mapRef.value.map.mapType = active.value;
  });
<\x2Fscript>

<template>
  <VMap ref="mapRef" :access-token="token" />
  <!-- mapType: 'standard' | 'mutedStandard' | 'hybrid' | 'satellite' -->
</template>`;
</script>

<template>
  <ExampleCard
    title="Map Types"
    description="MapKit ships four base styles. Set map.mapType on the live instance to switch between Standard, Muted, Hybrid, and Satellite. The map instance is exposed through a template ref."
  >
    <ExampleMapContainer>
      <VMap
        ref="mapRef"
        :access-token="token"
        color-scheme="light"
        @map="onMap"
      />
    </ExampleMapContainer>

    <template #controls>
      <div class="flex flex-wrap gap-2">
        <Button
          v-for="type in mapTypes"
          :key="type.id"
          :variant="active === type.id ? 'default' : 'outline'"
          size="sm"
          @click="active = type.id"
        >
          {{ type.label }}
        </Button>
      </div>
    </template>

    <template #code>
      <ExampleCodeBlock :code="code" filename="MapTypes.vue" />
    </template>
  </ExampleCard>
</template>
