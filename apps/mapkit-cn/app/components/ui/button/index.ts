import { cva, type VariantProps } from 'class-variance-authority';

export { default as Button } from './Button.vue';

/**
 * Apple-inspired button variants.
 * - `default`: solid Apple-blue pill, the single strategic accent.
 * - `secondary`: tinted blue text on faint blue wash — Apple's quiet CTA.
 * - `outline` / `ghost`: restrained neutral controls.
 * Pill radius (`rounded-full`) is Apple's signature CTA shape.
 */
export const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium outline-none transition-all duration-200 ease-[cubic-bezier(0.28,0.11,0.32,1)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-xs hover:brightness-110 active:brightness-95 active:scale-[0.98]',
        secondary:
          'bg-primary/10 text-primary hover:bg-primary/15 active:scale-[0.98] dark:bg-primary/15 dark:hover:bg-primary/20',
        outline:
          'border border-border bg-background hover:bg-accent hover:text-accent-foreground active:scale-[0.98]',
        ghost:
          'hover:bg-accent hover:text-accent-foreground active:scale-[0.98]',
        destructive:
          'bg-destructive text-destructive-foreground shadow-xs hover:brightness-110 active:scale-[0.98]',
        link: 'text-primary underline-offset-4 hover:underline rounded-none',
      },
      size: {
        default: 'h-10 px-5 has-[>svg]:px-4',
        sm: 'h-8 gap-1.5 px-3.5 text-[0.8125rem] has-[>svg]:px-3',
        lg: 'h-12 px-7 text-base has-[>svg]:px-6',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
