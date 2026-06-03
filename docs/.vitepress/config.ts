import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'v-mapkit.js',
  description: 'Apple MapKit JS for Vue 3',
  themeConfig: {
    nav: [{ text: 'Guide', link: '/guide/getting-started' }],
    sidebar: [
      {
        text: 'Guide',
        items: [{ text: 'Getting Started', link: '/guide/getting-started' }],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/geoql/v-mapkit.js' },
    ],
  },
});
