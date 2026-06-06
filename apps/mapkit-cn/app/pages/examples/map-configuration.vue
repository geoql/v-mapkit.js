<script setup lang="ts">
  import { VMap } from '@geoql/v-mapkit.js';
  import { Button } from '@/components/ui/button';
  import { centerMap, places } from '~/composables/useMapDemo';

  definePageMeta({ layout: 'example' });
  useHead({ title: 'Map Configuration · mapkit-cn' });

  const { token } = useMapkitToken();

  const colorScheme = ref<'light' | 'dark'>('dark');
  const distances = ref<'automatic' | 'metric' | 'imperial'>('metric');
  const tintColor = ref('#0a84ff');
  const padded = ref(false);

  const padding = computed(() =>
    padded.value
      ? { top: 40, right: 40, bottom: 40, left: 40 }
      : { top: 0, right: 0, bottom: 0, left: 0 },
  );

  const tints = ['#0a84ff', '#ff375f', '#30d158', '#ff9f0a', '#bf5af2'];

  const colorStyle = (c: string) => ({ backgroundColor: c });

  function onMap(map: unknown): void {
    centerMap(map as never, places.goldenGate, 0.08);
  }

  const code = `<template>
  <VMap
    :access-token="token"
    :color-scheme="colorScheme"      <!-- 'light' | 'dark' -->
    :distances="distances"           <!-- 'automatic' | 'metric' | 'imperial' -->
    :tint-color="tintColor"          <!-- any CSS color -->
    :padding="{ top: 40, right: 40, bottom: 40, left: 40 }"
  />
</template>`;
</script>

<template>
  <ExampleCard
    title="Map Configuration"
    description="VMap exposes reactive configuration props that update the live map in place: color scheme, distance units, edge padding, and tint color for selected controls. Tweak them below."
  >
    <ExampleMapContainer>
      <VMap
        :access-token="token"
        :color-scheme="colorScheme"
        :distances="distances"
        :tint-color="tintColor"
        :padding="padding"
        :shows-zoom-control="true"
        @map="onMap"
      />
    </ExampleMapContainer>

    <template #controls>
      <div class="flex flex-col gap-4">
        <div class="flex flex-wrap items-center gap-2">
          <span class="w-24 text-xs font-medium text-muted-foreground">
            Color scheme
          </span>
          <Button
            v-for="value in (['light', 'dark'] as const)"
            :key="value"
            :variant="colorScheme === value ? 'default' : 'outline'"
            size="sm"
            class="capitalize"
            @click="colorScheme = value"
          >
            {{ value }}
          </Button>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <span class="w-24 text-xs font-medium text-muted-foreground">
            Distances
          </span>
          <Button
            v-for="value in (['automatic', 'metric', 'imperial'] as const)"
            :key="value"
            :variant="distances === value ? 'default' : 'outline'"
            size="sm"
            class="capitalize"
            @click="distances = value"
          >
            {{ value }}
          </Button>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <span class="w-24 text-xs font-medium text-muted-foreground">
            Tint color
          </span>
          <button
            v-for="color in tints"
            :key="color"
            type="button"
            class="size-7 rounded-full border-2 transition-transform hover:scale-110"
            :class="
              tintColor === color
                ? 'border-foreground'
                : 'border-transparent'
            "
            :style="colorStyle(color)"
            :aria-label="color"
            @click="tintColor = color"
          ></button>
        </div>

        <div class="flex items-center gap-2">
          <span class="w-24 text-xs font-medium text-muted-foreground">
            Padding
          </span>
          <Button
            :variant="padded ? 'default' : 'outline'"
            size="sm"
            @click="padded = !padded"
          >
            {{ padded ? 'Padded 40px' : 'No padding' }}
          </Button>
        </div>
      </div>
    </template>

    <template #code>
      <ExampleCodeBlock :code="code" filename="MapConfiguration.vue" />
    </template>
  </ExampleCard>
</template>
