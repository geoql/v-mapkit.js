<script setup lang="ts">
  import { Github, Map, Menu, Moon, Sun, X } from 'lucide-vue-next';

  const { sidebarOpen, toggleSidebar } = useDocsNavigation();
  const { isDark, toggle: toggleTheme } = useThemeToggle();
</script>

<template>
  <header
    class="fixed top-0 z-50 w-full border-b border-border/60 bg-background/72 backdrop-blur-[20px] backdrop-saturate-150 supports-[backdrop-filter]:bg-background/60"
  >
    <div class="flex h-14 items-center gap-4 px-4 lg:px-6">
      <button
        class="text-muted-foreground transition-colors hover:text-foreground lg:hidden"
        aria-label="Toggle sidebar"
        @click="toggleSidebar()"
      >
        <Menu v-if="!sidebarOpen" class="size-5" />
        <X v-else class="size-5" />
      </button>

      <NuxtLink
        to="/"
        class="group flex items-center gap-2 text-foreground transition-opacity hover:opacity-70"
        aria-label="v-mapkit home"
      >
        <Map class="size-[18px] text-primary" />
        <span class="text-[0.9375rem] font-semibold tracking-tight">
          v-mapkit
        </span>
        <span
          class="hidden rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:inline"
        >
          docs
        </span>
      </NuxtLink>

      <div class="ml-auto flex items-center gap-1">
        <a
          href="https://mapkit-cn.geoql.in"
          target="_blank"
          rel="noopener noreferrer"
          class="hidden px-3 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground sm:inline-flex sm:items-center"
        >
          Examples
        </a>
        <a
          href="https://github.com/geoql/v-mapkit"
          target="_blank"
          rel="noopener noreferrer"
          class="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="GitHub repository"
        >
          <Github class="size-[18px]" />
        </a>
        <ClientOnly>
          <button
            class="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Toggle color theme"
            @click="toggleTheme"
          >
            <Sun v-if="isDark" class="size-[18px]" />
            <Moon v-else class="size-[18px]" />
          </button>
          <template #fallback>
            <span class="size-9" />
          </template>
        </ClientOnly>
      </div>
    </div>
  </header>
</template>
