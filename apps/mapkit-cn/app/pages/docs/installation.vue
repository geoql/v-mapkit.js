<script setup lang="ts">
useHead({ title: "Installation - mapkit-cn" });
</script>

<template>
  <div class="container py-12">
    <h1 class="text-4xl font-bold tracking-tight">Installation</h1>
    <p class="mt-4 text-lg text-muted-foreground">Install and configure @geoql/v-mapkit.js in your Vue 3 project.</p>
    <div class="prose mt-12 max-w-none dark:prose-invert">
      <h2>pnpm</h2>
      <pre><code>pnpm add @geoql/v-mapkit.js</code></pre>
      <h2>npm</h2>
      <pre><code>npm install @geoql/v-mapkit.js</code></pre>
      <h2>Import CSS</h2>
      <p>Import the library styles in your app entry point:</p>
      <pre v-pre><code>import "@geoql/v-mapkit.js/style.css";</code></pre>
      <h2>MapKit JWT Token</h2>
      <p>You need an Apple Developer Program membership ($99/yr) and a MapKit JS private key. Generate a JWT using the Maps ID and Key ID from your Apple Developer account.</p>
      <p>See the Apple Developer documentation for details on generating MapKit JS tokens.</p>
    </div>
  </div>
</template>
