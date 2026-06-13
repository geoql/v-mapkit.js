<script setup lang="ts">
  import { type HTMLAttributes, computed } from 'vue';
  import { cva, type VariantProps } from 'class-variance-authority';
  import { cn } from '~/lib/utils';

  const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    {
      variants: {
        variant: {
          default:
            'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
          outline:
            'border border-input bg-background shadow-2xs hover:bg-accent hover:text-accent-foreground',
          secondary:
            'bg-secondary text-secondary-foreground shadow-2xs hover:bg-secondary/80',
          ghost: 'hover:bg-accent hover:text-accent-foreground',
          link: 'text-primary underline-offset-4 hover:underline',
        },
        size: {
          default: 'h-9 px-4 py-2',
          sm: 'h-8 rounded-md px-3 text-xs',
          lg: 'h-11 rounded-lg px-8',
          icon: 'size-9',
        },
      },
      defaultVariants: { variant: 'default', size: 'default' },
    },
  );

  type ButtonVariants = VariantProps<typeof buttonVariants>;

  const props = withDefaults(
    defineProps<{
      variant?: NonNullable<ButtonVariants['variant']>;
      size?: NonNullable<ButtonVariants['size']>;
      class?: HTMLAttributes['class'];
      as?: string;
    }>(),
    { variant: 'default', size: 'default', class: undefined, as: 'button' },
  );

  const classes = computed(() =>
    cn(buttonVariants({ variant: props.variant, size: props.size }), props.class),
  );
</script>

<template>
  <component :is="as" :class="classes">
    <slot />
  </component>
</template>
