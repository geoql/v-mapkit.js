<script setup lang="ts">
  useHead({
    title: 'Component Registry - mapkit-cn',
  });

  const { data: registry } = await useFetch('/api/registry');
</script>

<template>
  <div class="container py-12">
    <h1 class="text-4xl font-bold tracking-tight">Component Registry</h1>
    <p class="mt-4 text-muted-foreground">
      Install components using the shadcn-vue CLI.
    </p>

    <div class="mt-12 grid gap-6">
      <div
        v-for="component in registry"
        :key="component.name"
        class="rounded-lg border p-6"
      >
        <h3 class="text-xl font-semibold">{{ component.name }}</h3>
        <p class="mt-2 text-sm text-muted-foreground">
          {{ component.description }}
        </p>
        <div class="mt-4">
          <code class="rounded bg-muted px-3 py-1.5 text-sm">
            npx shadcn-vue add {{ component.name }}
          </code>
        </div>
      </div>
    </div>
  </div>
</template>
