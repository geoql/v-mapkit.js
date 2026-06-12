<script setup lang="ts">
  import type { PrimitiveProps } from 'reka-ui';
  import type { HTMLAttributes } from 'vue';
  import { cn } from '@/lib/utils';
  import { Primitive } from 'reka-ui';
  import { type BadgeVariants, badgeVariants } from '.';

  interface Props extends PrimitiveProps {
    variant?: BadgeVariants['variant'];
    class?: HTMLAttributes['class'];
  }

  const props = withDefaults(defineProps<Props>(), {
    as: 'span',
  });
</script>

<template>
  <Primitive
    data-slot="badge"
    :as="as"
    :as-child="asChild"
    :class="cn(badgeVariants({ variant }), props.class)"
  >
    <slot></slot>
  </Primitive>
</template>
