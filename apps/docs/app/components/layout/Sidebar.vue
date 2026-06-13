<script setup lang="ts">
  const { sections, sidebarOpen, closeSidebar, isActive } = useDocsNavigation();
  const route = useRoute();

  watch(
    () => route.path,
    () => closeSidebar(),
  );
</script>

<template>
  <div
    v-if="sidebarOpen"
    class="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm lg:hidden"
    @click="closeSidebar()"
  />

  <aside
    :class="[
      'fixed top-14 bottom-0 z-40 w-64 overflow-y-auto border-r border-border/60 bg-background px-4 py-6',
      'transition-transform duration-200 lg:translate-x-0',
      sidebarOpen ? 'translate-x-0' : '-translate-x-full',
    ]"
  >
    <nav class="space-y-6">
      <div v-for="section in sections" :key="section.path">
        <p
          class="mb-2 px-3 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground"
        >
          {{ section.title }}
        </p>
        <ul class="space-y-0.5">
          <li v-for="item in section.children" :key="item.path">
            <NuxtLink
              :to="item.path"
              :class="[
                'block rounded-md px-3 py-1.5 text-sm transition-colors',
                isActive(item.path)
                  ? 'bg-primary/10 font-medium text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              ]"
            >
              {{ item.title }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>
  </aside>
</template>
