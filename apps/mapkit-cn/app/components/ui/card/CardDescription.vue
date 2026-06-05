<script setup lang="ts">
  import type { HTMLAttributes } from 'vue';
  import { cn } from '@/lib/utils';

  const props = defineProps<{ class?: HTMLAttributes['class'] }>();
</script>

<template>
  <div
    data-slot="card-description"
    :class="cn('text-sm leading-relaxed text-muted-foreground', props.class)"
  >
    <slot></slot>
  </div>
</template>
