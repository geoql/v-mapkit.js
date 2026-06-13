<script setup lang="ts">
  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'v-mapkit Docs',
          url: 'https://v-mapkit.geoql.in',
          description: 'Vue 3 components for Apple MapKit JS.',
          author: {
            '@type': 'Organization',
            name: 'GeoQL',
            url: 'https://github.com/geoql',
          },
        }),
      },
    ],
  });
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
