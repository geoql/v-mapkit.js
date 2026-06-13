<script setup lang="ts">
  import { ArrowRight } from 'lucide-vue-next';

  defineProps<{ title?: string; to?: string }>();
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    class="group block rounded-lg border border-border p-4 shadow-2xs transition-all hover:border-primary/30 hover:shadow-sm"
  >
    <h4 class="mb-1.5 text-sm font-semibold tracking-tight group-hover:text-primary">
      {{ title }}
    </h4>
    <div class="text-sm leading-relaxed text-muted-foreground">
      <slot />
    </div>
    <span
      class="mt-3 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground group-hover:text-foreground"
    >
      Read more
      <ArrowRight class="size-3 transition-transform group-hover:translate-x-0.5" />
    </span>
  </NuxtLink>
  <div v-else class="rounded-lg border border-border p-4">
    <h4 class="mb-1.5 text-sm font-semibold tracking-tight">{{ title }}</h4>
    <div class="text-sm leading-relaxed text-muted-foreground">
      <slot />
    </div>
  </div>
</template>
