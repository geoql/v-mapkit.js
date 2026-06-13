<script setup lang="ts">
  import { Map } from 'lucide-vue-next';

  const year = new Date().getFullYear();
</script>

<template>
  <footer class="border-t border-border/60 bg-card/30">
    <div
      class="flex flex-col gap-3 px-6 py-6 sm:flex-row sm:items-center sm:justify-between lg:px-8"
    >
      <div class="flex items-center gap-2.5">
        <Map class="size-4 text-muted-foreground" />
        <span class="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          &copy; {{ year }} GeoQL · Built on v-mapkit
        </span>
      </div>
      <div class="flex items-center gap-4">
        <a
          href="https://mapkit-cn.geoql.in"
          target="_blank"
          rel="noopener noreferrer"
          class="font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
        >
          Examples
        </a>
        <a
          href="https://github.com/geoql/v-mapkit"
          target="_blank"
          rel="noopener noreferrer"
          class="font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
        >
          GitHub
        </a>
        <a
          href="https://www.npmjs.com/package/@geoql/v-mapkit"
          target="_blank"
          rel="noopener noreferrer"
          class="font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
        >
          npm
        </a>
      </div>
    </div>
  </footer>
</template>
