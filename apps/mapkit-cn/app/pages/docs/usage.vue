<script setup lang="ts">
useHead({ title: "Usage - mapkit-cn" });
</script>

<template>
  <div class="container py-12">
    <h1 class="text-4xl font-bold tracking-tight">Usage</h1>
    <p class="mt-4 text-lg text-muted-foreground">Learn how to use v-mapkit.js components in your Vue 3 app.</p>
    <div class="prose mt-12 max-w-none dark:prose-invert">
      <h2>Basic Map</h2>
      <pre v-pre><code>&lt;script setup&gt;
import { VMap } from "@geoql/v-mapkit.js";
import "@geoql/v-mapkit.js/style.css";
&lt;/script&gt;

&lt;template&gt;
  &lt;VMap
    :options="{ token: \"YOUR_TOKEN\" }"
    :center="[37.7749, -122.4194]"
    :zoom="12"
  /&gt;
&lt;/template&gt;</code></pre>
      <h2>Adding Annotations</h2>
      <pre v-pre><code>&lt;VMap :options="{ token }" :center="[37.7749, -122.4194]" :zoom="12"&gt;
  &lt;VMarkerAnnotation :coordinates="[37.7749, -122.4194]" /&gt;
&lt;/VMap&gt;</code></pre>
      <h2>Adding Overlays</h2>
      <pre v-pre><code>&lt;VMap :options="{ token }" :center="[37.7749, -122.4194]" :zoom="12"&gt;
  &lt;VCircleOverlay :center="[37.7749, -122.4194]" :radius="500" /&gt;
&lt;/VMap&gt;</code></pre>
    </div>
  </div>
</template>
