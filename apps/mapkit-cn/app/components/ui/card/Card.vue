<script setup lang="ts">
  import type { HTMLAttributes } from 'vue';
  import { cn } from '@/lib/utils';

  const props = defineProps<{ class?: HTMLAttributes['class'] }>();
</script>

<template>
  <div
    data-slot="card"
    :class="
      cn(
        'flex flex-col gap-6 rounded-2xl border border-border/70 bg-card py-6 text-card-foreground shadow-sm transition-shadow duration-300 ease-[cubic-bezier(0.28,0.11,0.32,1)]',
        props.class,
      )
    "
  >
    <slot></slot>
  </div>
</template>
