export default defineNuxtConfig({
  extends: ['docus'],

  modules: [
    [
      '@nuxtjs/plausible',
      {
        domain: 'v-mapkit.geoql.in',
        apiHost: 'https://analytics.geoql.in',
        autoOutboundTracking: true,
      },
    ],
  ],

  site: {
    name: 'v-mapkit.js',
    description: 'Vue 3 components for Apple MapKit JS',
    url: 'https://v-mapkit.geoql.in',
  },

  content: {
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

  llms: {
    domain: 'v-mapkit.geoql.in',
  },
});
