<template>
  <div class="overflow-hidden rounded-xl border border-border bg-card shadow-lg">
    <!-- Apple-style window chrome -->
    <div class="flex items-center gap-2 border-b border-border/70 px-4 py-3">
      <span class="size-3 rounded-full bg-destructive/80" />
      <span class="size-3 rounded-full bg-warning/80" />
      <span class="size-3 rounded-full bg-success/80" />
      <span class="ml-3 font-mono text-xs text-muted-foreground">App.vue</span>
    </div>

    <!-- Code sample — semantic tokens only, single primary accent -->
    <pre class="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed"><code><span class="text-muted-foreground">&lt;script setup lang="ts"&gt;</span>
  <span class="text-muted-foreground">import</span> { <span class="text-primary">VMap</span>, <span class="text-primary">VMarkerAnnotation</span> }
    <span class="text-muted-foreground">from</span> <span class="text-foreground">'@geoql/v-mapkit'</span>
<span class="text-muted-foreground">&lt;/script&gt;</span>

<span class="text-muted-foreground">&lt;template&gt;</span>
  <span class="text-muted-foreground">&lt;</span><span class="text-primary">VMap</span> <span class="text-foreground/70">:access-token</span>=<span class="text-foreground">"token"</span><span class="text-muted-foreground">&gt;</span>
    <span class="text-muted-foreground">&lt;</span><span class="text-primary">VMarkerAnnotation</span>
      <span class="text-foreground/70">:coordinates</span>=<span class="text-foreground">"[37.33, -122.00]"</span>
    <span class="text-muted-foreground">/&gt;</span>
  <span class="text-muted-foreground">&lt;/</span><span class="text-primary">VMap</span><span class="text-muted-foreground">&gt;</span>
<span class="text-muted-foreground">&lt;/template&gt;</span></code></pre>
  </div>
</template>
