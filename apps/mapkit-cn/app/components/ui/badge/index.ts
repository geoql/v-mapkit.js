import { cva, type VariantProps } from 'class-variance-authority';

export { default as Badge } from './Badge.vue';

/**
 * Apple-inspired badge variants — small, pill-shaped category/status tags.
 * Quiet by default; the `primary` variant uses Apple blue sparingly.
 */
export const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring [&>svg]:pointer-events-none [&>svg]:size-3',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-secondary text-secondary-foreground',
        primary:
          'border-transparent bg-primary/10 text-primary dark:bg-primary/15',
        outline: 'border-border text-foreground',
        success:
          'border-transparent bg-success/12 text-success dark:bg-success/18',
        destructive:
          'border-transparent bg-destructive/10 text-destructive dark:bg-destructive/18',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;
