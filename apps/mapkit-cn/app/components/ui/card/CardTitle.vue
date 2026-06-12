<script setup lang="ts">
  import type { HTMLAttributes } from 'vue';
  import { cn } from '@/lib/utils';

  const props = defineProps<{ class?: HTMLAttributes['class'] }>();
</script>

<template>
  <div
    data-slot="card-title"
    :class="
      cn('font-semibold leading-none tracking-tight', props.class)
    "
  >
    <slot></slot>
  </div>
</template>
