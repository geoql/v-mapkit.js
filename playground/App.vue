<script setup lang="ts">
const token = import.meta.env.VITE_MAPKIT_TOKEN ?? '';
</script>

<template>
  <div style="height: 100vh">
    <p v-if="!token">Set VITE_MAPKIT_TOKEN in .env to render a map.</p>
    <p v-else>Playground ready — map components wired in Task 11.</p>
  </div>
</template>
