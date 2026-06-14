<script setup lang="ts">
  import { ArrowRight, Github, Layers, Map, Eye, Search, Boxes, Code2 } from 'lucide-vue-next';

  definePageMeta({ layout: false });

  usePageSeo({
    title: 'v-mapkit — Vue 3 components for Apple MapKit JS',
    description:
      'Declarative Vue 3 components for Apple MapKit JS. Annotations, overlays, clustering, Look Around, search & geocoding. Fully typed, composable, Nuxt-ready.',
    path: '/',
  });

  defineOgImageComponent('MapkitDocs', {
    title: 'Apple Maps, the Vue way.',
    description: 'Declarative Vue 3 components for Apple MapKit JS.',
  });

  const features = [
    { icon: Map, title: 'Declarative components', description: 'Use VMap, VMarkerAnnotation, and VCircleOverlay instead of imperative MapKit JS calls.' },
    { icon: Layers, title: 'Annotations & overlays', description: 'Markers, custom DOM annotations, circles, polygons, polylines, and tile overlays — all reactive.' },
    { icon: Eye, title: 'Look Around', description: 'Apple-exclusive 360° street-level views with interactive and preview components.' },
    { icon: Search, title: 'MapKit services', description: 'Composables for search, geocoding, directions, and points-of-interest lookups.' },
    { icon: Code2, title: 'Fully typed', description: 'Complete TypeScript definitions and first-class IDE autocomplete throughout.' },
    { icon: Boxes, title: 'Nuxt-ready', description: 'Works seamlessly with Nuxt 4 and SSR via the bundled module.' },
  ];
</script>

<template>
  <div class="min-h-dvh bg-background text-foreground">
    <LayoutHeader />

    <section
      class="relative flex min-h-dvh flex-col justify-center px-6 py-20 md:px-12 lg:px-20"
    >
      <div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div class="flex flex-col">
          <p class="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Apple MapKit JS · Vue 3
          </p>
          <h1
            class="mb-6 text-5xl font-bold tracking-tighter md:text-6xl"
            style="line-height: 1.05"
          >
            Apple Maps, the Vue way.
          </h1>
          <p class="mb-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Declarative components and composables for Apple MapKit JS —
            annotations, overlays, clustering, Look Around, and services. Fully
            typed and Nuxt-ready.
          </p>

          <div class="mb-10 inline-flex w-fit items-center gap-3 rounded-xl border border-border bg-card px-5 py-3 font-mono text-base shadow-sm md:text-lg">
            <span class="select-none text-muted-foreground">$</span>
            <span class="text-foreground">npm i @geoql/v-mapkit</span>
          </div>

          <div class="flex flex-wrap gap-3">
            <NuxtLink
              to="/guide/getting-started"
              class="group inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
            >
              Get started
              <ArrowRight class="size-4 transition-transform group-hover:translate-x-0.5" />
            </NuxtLink>
            <a
              href="https://mapkit-cn.geoql.in"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium text-foreground shadow-2xs transition-colors hover:bg-accent"
            >
              <Github class="size-4" />
              Live examples
            </a>
          </div>
        </div>

        <HeroPreview class="hidden lg:block" />
      </div>
    </section>

    <section class="border-t border-border px-6 py-20 md:px-12 lg:px-20">
      <p class="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Capabilities
      </p>
      <h2 class="mb-12 max-w-2xl text-3xl font-semibold tracking-tight lg:text-4xl">
        Everything Apple MapKit offers — composable.
      </h2>
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="rounded-xl border border-border bg-card p-6 shadow-2xs transition-shadow hover:shadow-md"
        >
          <component :is="feature.icon" class="mb-4 size-5 text-primary" />
          <h3 class="mb-2 text-base font-semibold tracking-tight">{{ feature.title }}</h3>
          <p class="text-sm leading-relaxed text-muted-foreground">{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <LayoutFooter />
  </div>
</template>
