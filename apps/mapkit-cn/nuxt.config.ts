import libraryPkg from '../../packages/v-mapkit.js/package.json' with { type: 'json' };

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/color-mode',
    '@nuxt/icon',
    '@nuxt/fonts',
    'shadcn-nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
  ],

  devtools: { enabled: true },

  fonts: {
    families: [
      { name: 'Geist', provider: 'google', weights: [300, 400, 500, 700, 800] },
      { name: 'Geist Mono', provider: 'google', weights: [400, 500, 700] },
    ],
    defaults: {
      weights: [400, 700],
      styles: ['normal'],
      subsets: ['latin'],
    },
    experimental: {
      processCSSVariables: false,
    },
  },

  app: {
    head: {
      title: 'mapkit-cn - Beautiful Apple Maps for Vue',
      meta: [
        {
          name: 'description',
          content:
            'Beautiful Apple MapKit components for Vue. Built on v-mapkit.js, styled with Tailwind CSS, works with shadcn-vue.',
        },
        { name: 'theme-color', content: '#000000' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },

  css: [
    'v-mapkit.js/style.css',
    '~/assets/css/main.css',
  ],

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'dark',
  },

  runtimeConfig: {
    public: {
      mapkitToken: '',
      library: {
        version: libraryPkg.version,
      },
    },
  },

  compatibilityDate: '2025-01-06',

  vite: {
    optimizeDeps: {
      exclude: ['v-mapkit.js'],
      include: [
        'class-variance-authority',
        'clsx',
        'reka-ui',
        'tailwind-merge',
      ],
    },
  },

  postcss: {
    plugins: {},
  },

  shadcn: {
    prefix: '',
    componentDir: './app/components/ui',
  },
});
