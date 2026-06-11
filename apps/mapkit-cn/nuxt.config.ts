import libraryPkg from '../../packages/v-mapkit.js/package.json' with { type: 'json' };

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/color-mode',
    '@nuxt/icon',
    '@nuxt/fonts',
    'shadcn-nuxt',
    '@vueuse/nuxt',
    'nuxt-og-image',
    '@nuxtjs/tailwindcss',
    [
      '@nuxtjs/plausible',
      {
        domain: 'mapkit-cn.geoql.in',
        apiHost: 'https://analytics.geoql.in',
        autoOutboundTracking: true,
      },
    ],
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

  site: {
    name: 'mapkit-cn',
    description: 'Beautiful Apple MapKit components for Vue',
    url: 'https://mapkit-cn.geoql.in',
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
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

  compatibilityDate: '2026-05-26',

  nitro: {
    preset: 'cloudflare-pages',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
      wrangler: {
        name: 'mapkit-cn',
        compatibility_date: '2026-05-26',
        compatibility_flags: ['nodejs_compat'],
      },
    },
  },

  ogImage: {
    // Generate all OG images at build time; skip per-request cache storage
    // during prerender to reduce the Cloudflare Pages worker bundle.
    runtimeCacheStorage: false,
  },

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
