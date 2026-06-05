<script setup lang="ts">
  useHead({
    title: 'FAQ - mapkit-cn',
  });

  const faqs = [
    {
      q: 'What is MapKit JS?',
      a: 'MapKit JS is Apple\'s web-based mapping service that brings Apple Maps to the web. It provides high-quality maps, geocoding, directions, and more.',
    },
    {
      q: 'Do I need an Apple Developer account?',
      a: 'Yes. You need an Apple Developer Program membership ($99/year) to generate MapKit JWT tokens for authentication.',
    },
    {
      q: 'Is MapKit JS free to use?',
      a: 'MapKit JS is included with the Apple Developer Program. There are no additional usage fees for web applications.',
    },
    {
      q: 'Does it work on all browsers?',
      a: 'MapKit JS works on all modern browsers (Chrome, Firefox, Safari, Edge). Some features like Look Around require WebGL support.',
    },
    {
      q: 'Can I use this with Nuxt?',
      a: 'Yes! This showcase app (mapkit-cn) is built with Nuxt 4. The v-mapkit.js library works with both Vue 3 and Nuxt 3/4.',
    },
    {
      q: 'How is this different from MapLibre or Leaflet?',
      a: 'MapKit JS uses Apple\'s map data and rendering, providing a native Apple Maps experience. MapLibre and Leaflet use OpenStreetMap or other tile sources.',
    },
  ];
</script>

<template>
  <div class="container py-12">
    <h1 class="text-4xl font-bold tracking-tight">Frequently Asked Questions</h1>

    <div class="mt-12 space-y-8">
      <div v-for="(faq, index) in faqs" :key="index" class="rounded-lg border p-6">
        <h3 class="text-lg font-semibold">{{ faq.q }}</h3>
        <p class="mt-3 text-muted-foreground">{{ faq.a }}</p>
      </div>
    </div>
  </div>
</template>
