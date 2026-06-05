<script setup lang="ts">
  import { Badge } from '@/components/ui/badge';
  import { allExamples, exampleGroups } from '~/lib/examples';

  useHead({ title: 'Examples · mapkit-cn' });

  const total = allExamples.length;
</script>

<template>
  <div class="container py-14 sm:py-20">
    <!-- Header -->
    <header class="mb-12 flex flex-col items-start gap-4">
      <Badge variant="primary" class="gap-1.5 px-3 py-1 font-mono">
        <span class="size-1.5 rounded-full bg-primary"></span>
        {{ total }} examples
      </Badge>
      <h1
        class="text-balance text-4xl font-bold tracking-[-0.03em] sm:text-5xl"
      >
        Examples
      </h1>
      <p
        class="max-w-xl text-balance text-lg font-light leading-relaxed text-muted-foreground"
      >
        Every v-mapkit.js component and composable, demonstrated with live maps
        and copy-paste source. Set your MapKit token once and explore.
      </p>
    </header>

    <!-- Groups -->
    <div class="flex flex-col gap-14">
      <section
        v-for="group in exampleGroups"
        :key="group.title"
        class="scroll-mt-20"
      >
        <div class="mb-5 flex items-baseline justify-between gap-4">
          <h2 class="text-xl font-semibold tracking-tight">
            {{ group.title }}
          </h2>
          <p class="hidden text-sm text-muted-foreground sm:block">
            {{ group.description }}
          </p>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ExampleGalleryCard
            v-for="example in group.examples"
            :key="example.slug"
            :example="example"
          />
        </div>
      </section>
    </div>
  </div>
</template>
