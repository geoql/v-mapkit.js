/**
 * Apple-inspired design tokens for mapkit-cn.
 *
 * Single source of truth mirrors the CSS custom properties declared in
 * `app/assets/css/main.css`. Use these for JS-driven styling, canvas/map
 * theming, chart palettes, or anywhere a CSS variable cannot reach.
 *
 * Direction: Apple (clean, minimal, generous whitespace). Geist substitutes
 * for SF Pro; Apple blue (#0071e3) is the single strategic accent.
 */

export interface ColorScale {
  readonly light: string;
  readonly dark: string;
}

export interface DesignTokens {
  readonly font: {
    readonly sans: string;
    readonly mono: string;
    readonly display: string;
  };
  readonly fontWeight: Record<
    'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'heavy',
    number
  >;
  readonly fontSize: Record<
    | 'xs'
    | 'sm'
    | 'base'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl'
    | '7xl',
    string
  >;
  readonly tracking: Record<'tighter' | 'tight' | 'normal', string>;
  readonly color: Record<string, ColorScale>;
  readonly radius: Record<'sm' | 'md' | 'lg' | 'xl' | '2xl', string>;
  readonly shadow: Record<
    '2xs' | 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl',
    ColorScale
  >;
  readonly spacing: Record<
    'px' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'section',
    string
  >;
  readonly ease: Record<'apple' | 'appleInOut' | 'standard', string>;
  readonly duration: Record<'fast' | 'base' | 'slow' | 'slower', string>;
}

export const designTokens: DesignTokens = {
  font: {
    sans: "'Geist', ui-sans-serif, system-ui, -apple-system, sans-serif",
    mono: "'Geist Mono', 'JetBrains Mono', ui-monospace, monospace",
    display: "'Geist', ui-sans-serif, system-ui, -apple-system, sans-serif",
  },

  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    heavy: 800,
  },

  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.5rem',
    '5xl': '3.25rem',
    '6xl': '4rem',
    '7xl': '5rem',
  },

  tracking: {
    tighter: '-0.03em',
    tight: '-0.02em',
    normal: '-0.01em',
  },

  color: {
    background: { light: 'oklch(1 0 0)', dark: 'oklch(0.15 0.003 286)' },
    foreground: {
      light: 'oklch(0.21 0.004 286)',
      dark: 'oklch(0.97 0.002 286)',
    },
    card: { light: 'oklch(0.985 0.001 286)', dark: 'oklch(0.19 0.004 286)' },
    primary: { light: 'oklch(0.585 0.185 252)', dark: 'oklch(0.64 0.19 252)' },
    primaryForeground: { light: 'oklch(1 0 0)', dark: 'oklch(1 0 0)' },
    muted: { light: 'oklch(0.967 0.002 286)', dark: 'oklch(0.24 0.005 286)' },
    mutedForeground: {
      light: 'oklch(0.52 0.006 286)',
      dark: 'oklch(0.65 0.005 286)',
    },
    border: { light: 'oklch(0.92 0.002 286)', dark: 'oklch(0.27 0.004 286)' },
    destructive: { light: 'oklch(0.63 0.23 27)', dark: 'oklch(0.68 0.21 25)' },
    success: { light: 'oklch(0.74 0.18 150)', dark: 'oklch(0.76 0.18 150)' },
    warning: { light: 'oklch(0.76 0.17 65)', dark: 'oklch(0.8 0.16 70)' },
  },

  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1.125rem',
    '2xl': '1.5rem',
  },

  shadow: {
    '2xs': {
      light: '0 1px 2px 0 oklch(0.21 0.004 286 / 0.04)',
      dark: '0 1px 2px 0 oklch(0 0 0 / 0.2)',
    },
    xs: {
      light: '0 1px 3px 0 oklch(0.21 0.004 286 / 0.06)',
      dark: '0 1px 3px 0 oklch(0 0 0 / 0.28)',
    },
    sm: {
      light:
        '0 1px 2px 0 oklch(0.21 0.004 286 / 0.05), 0 1px 3px 0 oklch(0.21 0.004 286 / 0.06)',
      dark: '0 1px 2px 0 oklch(0 0 0 / 0.3), 0 1px 3px 0 oklch(0 0 0 / 0.36)',
    },
    base: {
      light:
        '0 2px 4px -1px oklch(0.21 0.004 286 / 0.06), 0 4px 12px -2px oklch(0.21 0.004 286 / 0.08)',
      dark: '0 2px 4px -1px oklch(0 0 0 / 0.3), 0 4px 12px -2px oklch(0 0 0 / 0.4)',
    },
    md: {
      light:
        '0 4px 8px -2px oklch(0.21 0.004 286 / 0.06), 0 8px 24px -4px oklch(0.21 0.004 286 / 0.1)',
      dark: '0 4px 8px -2px oklch(0 0 0 / 0.34), 0 8px 24px -4px oklch(0 0 0 / 0.46)',
    },
    lg: {
      light:
        '0 8px 16px -4px oklch(0.21 0.004 286 / 0.08), 0 16px 40px -8px oklch(0.21 0.004 286 / 0.12)',
      dark: '0 8px 16px -4px oklch(0 0 0 / 0.4), 0 16px 40px -8px oklch(0 0 0 / 0.52)',
    },
    xl: {
      light:
        '0 12px 24px -6px oklch(0.21 0.004 286 / 0.1), 0 24px 56px -12px oklch(0.21 0.004 286 / 0.16)',
      dark: '0 12px 24px -6px oklch(0 0 0 / 0.46), 0 24px 56px -12px oklch(0 0 0 / 0.6)',
    },
  },

  spacing: {
    px: '1px',
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    section: '7.5rem',
  },

  ease: {
    apple: 'cubic-bezier(0.28, 0.11, 0.32, 1)',
    appleInOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
    standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  duration: {
    fast: '150ms',
    base: '250ms',
    slow: '400ms',
    slower: '600ms',
  },
} as const;

export type DesignTokenColor = keyof typeof designTokens.color;
export type DesignTokenShadow = keyof typeof designTokens.shadow;

export default designTokens;
