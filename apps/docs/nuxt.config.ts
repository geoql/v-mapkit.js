export default defineNuxtConfig({
  modules: [
    '@nuxtjs/color-mode',
    '@nuxt/fonts',
    '@nuxt/content',
    'shadcn-nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
    [
      '@nuxtjs/plausible',
      {
        domain: 'v-mapkit.geoql.in',
        apiHost: 'https://analytics.geoql.in',
        autoOutboundTracking: true,
      },
    ],
  ],

  devtools: { enabled: false },

  css: ['~/assets/css/main.css'],

  fonts: {
    families: [
      { name: 'Geist', provider: 'google', weights: [300, 400, 500, 600, 700] },
      { name: 'Geist Mono', provider: 'google', weights: [400, 500] },
    ],
  },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'dark',
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'v-mapkit — Vue 3 components for Apple MapKit JS',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Vue 3 components for Apple MapKit JS — annotations, overlays, clustering, Look Around, and services.',
        },
        { name: 'theme-color', content: '#000000', media: '(prefers-color-scheme: dark)' },
        { name: 'theme-color', content: '#ffffff', media: '(prefers-color-scheme: light)' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },

  runtimeConfig: {
    public: {
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL || 'https://v-mapkit.geoql.in',
    },
  },

  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            light: 'material-theme-lighter',
            default: 'material-theme',
            dark: 'material-theme-palenight',
          },
          langs: ['bash', 'json', 'js', 'ts', 'html', 'css', 'vue', 'shell', 'md', 'yaml'],
        },
      },
    },
    database: {
      type: 'd1',
      bindingName: 'DB',
    },
  },

  compatibilityDate: '2026-05-26',

  nitro: {
    preset: 'cloudflare-pages',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
      wrangler: {
        name: 'v-mapkit-docs',
        compatibility_date: '2026-05-26',
        compatibility_flags: ['nodejs_compat'],
        d1_databases: [
          {
            binding: 'DB',
            database_name: 'v-mapkit-docs-db',
            database_id: '91205837-d9d7-4c94-9076-d06a2651adb9',
          },
        ],
      },
    },
    rollupConfig: {
      output: {
        generatedCode: {
          constBindings: true,
        },
      },
    },
    replace: {
      'process.stdout': 'undefined',
    },
  },

  shadcn: {
    prefix: '',
    componentDir: './app/components/ui',
  },

  postcss: {
    plugins: {},
  },
});
