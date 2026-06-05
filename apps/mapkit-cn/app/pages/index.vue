<script setup lang="ts">
  import { VMap, VMarkerAnnotation } from '@geoql/v-mapkit.js';
  import { Badge } from '@/components/ui/badge';
  import { Button } from '@/components/ui/button';
  import { allExamples } from '~/lib/examples';
  import { centerMap, places } from '~/composables/useMapDemo';

  const config = useRuntimeConfig();
  const version = config.public.library.version;
  const { token } = useMapkitToken();

  const componentCount = 18;
  const composableCount = 4;
  const exampleCount = allExamples.length;

  const heroPins: Array<{ at: [number, number]; title: string }> = [
    { at: places.applePark, title: 'Apple Park' },
    { at: [37.3318, -122.0312], title: 'Cupertino' },
    { at: [37.3382, -121.8863], title: 'San Jose' },
  ];

  const highlights = [
    {
      icon: 'lucide:blocks',
      value: `${componentCount} components`,
      label: 'Maps, annotations, overlays, controls',
    },
    {
      icon: 'simple-icons:apple',
      value: 'Apple MapKit JS',
      label: 'The real Apple Maps engine',
    },
    {
      icon: 'simple-icons:vuedotjs',
      value: 'Vue 3',
      label: 'Composition API & <script setup>',
    },
    {
      icon: 'simple-icons:typescript',
      value: 'TypeScript',
      label: 'Fully typed props & composables',
    },
  ];

  const quickStart = `<script setup lang="ts">
  import { VMap, VMarkerAnnotation } from '@geoql/v-mapkit.js';
<\/script>

<template>
  <VMap :access-token="token" color-scheme="dark">
    <VMarkerAnnotation
      :coordinates="[37.3349, -122.009]"
      :annotation="{ title: 'Apple Park' }"
    />
  </VMap>
</template>`;

  function onHeroMap(map: unknown): void {
    centerMap(map as never, places.cupertino, 0.16);
  }
</script>

<template>
  <!-- ───────────────────────── Hero ───────────────────────── -->
  <section
    class="container grid min-h-[calc(100dvh-3rem)] items-center gap-12 py-16 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:py-0"
  >
    <!-- Copy -->
    <div class="flex flex-col items-start gap-7">
      <Badge variant="primary" class="gap-1.5 px-3 py-1 font-mono">
        <span class="size-1.5 rounded-full bg-primary"></span>
        v{{ version }}
      </Badge>

      <h1
        class="text-balance text-5xl font-bold leading-[1.02] tracking-[-0.03em] sm:text-6xl lg:text-7xl"
      >
        Beautiful Apple<br />
        Maps for <span class="text-primary">Vue.</span>
      </h1>

      <p
        class="max-w-md text-balance text-lg font-light leading-relaxed text-muted-foreground sm:text-xl"
      >
        Theme-aware MapKit JS components for Vue 3. Drop them in, style them
        with Tailwind, ship them with shadcn-vue.
      </p>

      <div class="flex flex-wrap items-center gap-3 pt-1">
        <Button as-child size="lg">
          <NuxtLink to="/examples">
            Browse examples
            <Icon name="lucide:arrow-right" class="size-4" />
          </NuxtLink>
        </Button>
        <Button as-child variant="outline" size="lg">
          <a
            href="https://github.com/geoql/v-mapkit.js"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="simple-icons:github" class="size-4" />
            View on GitHub
          </a>
        </Button>
      </div>

      <div
        class="flex items-center gap-5 pt-1 font-mono text-xs text-muted-foreground"
      >
        <span class="tabular-nums">{{ componentCount }} components</span>
        <span class="text-border">·</span>
        <span class="tabular-nums">{{ composableCount }} composables</span>
        <span class="text-border">·</span>
        <span class="tabular-nums">{{ exampleCount }} examples</span>
      </div>
    </div>

    <!-- Live map — the product showing itself -->
    <div
      class="relative h-[24rem] w-full overflow-hidden rounded-2xl border border-border bg-card shadow-lg sm:h-[30rem] lg:h-[34rem]"
    >
      <ClientOnly>
        <template v-if="token">
          <div class="demo-map-container absolute inset-0">
            <VMap
              :access-token="token"
              color-scheme="dark"
              :shows-zoom-control="true"
              :shows-compass="'hidden'"
              @map="onHeroMap"
            >
              <VMarkerAnnotation
                v-for="pin in heroPins"
                :key="pin.title"
                :coordinates="pin.at"
                :annotation="{ title: pin.title, color: '#0a84ff' }"
              />
            </VMap>
          </div>
        </template>

        <template v-else>
          <div
            class="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-secondary/30 px-6 text-center"
          >
            <span
              class="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary"
            >
              <Icon name="lucide:map-pin" class="size-5" />
            </span>
            <div class="space-y-1.5">
              <p class="text-sm font-medium text-foreground">
                See it live
              </p>
              <p class="mx-auto max-w-xs text-[0.8125rem] text-muted-foreground">
                Add your MapKit token to render a real Apple map right here.
              </p>
            </div>
            <ExampleTokenDialog />
          </div>
        </template>

        <template #fallback>
          <div
            class="absolute inset-0 flex items-center justify-center bg-secondary/30"
          >
            <Icon
              name="lucide:loader-circle"
              class="size-5 animate-spin text-muted-foreground"
            />
          </div>
        </template>
      </ClientOnly>
    </div>
  </section>

  <!-- ──────────────────── Feature highlights ──────────────────── -->
  <section class="border-t border-border/60 bg-card/30">
    <div class="container py-16 sm:py-20">
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="item in highlights"
          :key="item.value"
          class="flex flex-col gap-3"
        >
          <span
            class="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
          >
            <Icon :name="item.icon" class="size-5" />
          </span>
          <div class="space-y-1">
            <p class="text-base font-semibold tracking-tight text-foreground">
              {{ item.value }}
            </p>
            <p class="text-sm leading-relaxed text-muted-foreground">
              {{ item.label }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ──────────────────────── Quick start ──────────────────────── -->
  <section class="container py-16 sm:py-24">
    <div class="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
      <div class="space-y-5">
        <p
          class="font-mono text-xs font-semibold uppercase tracking-wider text-primary"
        >
          Quick start
        </p>
        <h2
          class="text-balance text-3xl font-bold tracking-tight sm:text-4xl"
        >
          A map in five lines.
        </h2>
        <p
          class="max-w-md text-[0.9375rem] leading-relaxed text-muted-foreground"
        >
          Import the components you need and pass your MapKit token. No
          wrappers, no boilerplate — annotations and overlays are just child
          components.
        </p>
        <div class="flex flex-wrap items-center gap-3 pt-1">
          <Button as-child variant="secondary">
            <NuxtLink to="/examples">
              Explore all {{ exampleCount }} examples
              <Icon name="lucide:arrow-right" class="size-4" />
            </NuxtLink>
          </Button>
        </div>
      </div>

      <ExampleCodeBlock :code="quickStart" filename="App.vue" />
    </div>
  </section>
</template>
