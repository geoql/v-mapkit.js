<script setup lang="ts">
  import type { ExampleMeta } from '~/lib/examples';

  defineProps<{
    example: ExampleMeta;
  }>();
</script>

<template>
  <NuxtLink
    :to="`/examples/${example.slug}`"
    class="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all duration-200 ease-[cubic-bezier(0.28,0.11,0.32,1)] hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  >
    <span
      class="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground"
    >
      <Icon :name="example.icon" class="size-[18px]" />
    </span>

    <div class="space-y-1">
      <h3 class="text-[0.9375rem] font-semibold tracking-tight text-foreground">
        {{ example.title }}
      </h3>
      <p class="text-[0.8125rem] leading-relaxed text-muted-foreground">
        {{ example.description }}
      </p>
    </div>

    <Icon
      name="lucide:arrow-up-right"
      class="absolute right-4 top-5 size-4 text-muted-foreground/0 transition-all duration-200 group-hover:text-muted-foreground"
    />
  </NuxtLink>
</template>
