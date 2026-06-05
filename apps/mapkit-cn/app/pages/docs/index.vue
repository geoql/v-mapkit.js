<script setup lang="ts">
useHead({
  title: "Getting Started - mapkit-cn",
});
</script>

<template>
  <div class="container py-12">
    <h1 class="text-4xl font-bold tracking-tight">Getting Started</h1>
    <p class="mt-4 text-lg text-muted-foreground">
      Build beautiful maps with Apple MapKit JS and Vue 3.
    </p>

    <div class="prose prose-neutral mt-12 max-w-none dark:prose-invert">
      <h2>Prerequisites</h2>
      <ul>
        <li>Node.js 20 or later</li>
        <li>Vue 3.5 or later</li>
        <li>Apple Developer Program membership (for MapKit JWT token)</li>
      </ul>

      <h2>Installation</h2>
      <p>Install the v-mapkit.js library:</p>
      <pre><code>pnpm add @geoql/v-mapkit.js</code></pre>

      <h2>Quick Start</h2>
      <p>Add a map to your Vue component:</p>
      <pre v-pre><code>&lt;script setup&gt;
import { VMap, VMarkerAnnotation } from '@geoql/v-mapkit.js'
import '@geoql/v-mapkit.js/style.css'
&lt;/script&gt;

&lt;template&gt;
  &lt;VMap
    :options="{ token: 'YOUR_MAPKIT_TOKEN' }"
    :center="[37.7749, -122.4194]"
    :zoom="12"
  &gt;
    &lt;VMarkerAnnotation :coordinates="[37.7749, -122.4194]" /&gt;
  &lt;/VMap&gt;
&lt;/template&gt;</code></pre>

      <h2>Next Steps</h2>
      <ul>
        <li>
          <NuxtLink to="/docs/installation" class="text-primary hover:underline">
            Installation Guide
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/docs/usage" class="text-primary hover:underline">
            Usage Examples
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/examples" class="text-primary hover:underline"> Browse Examples </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>
