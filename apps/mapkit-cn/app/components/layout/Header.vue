<script setup lang="ts">
  import { Button } from '@/components/ui/button';

  const colorMode = useColorMode();
  function toggleTheme(): void {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
  }
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-border/60 bg-background/72 backdrop-blur-[20px] backdrop-saturate-150 supports-[backdrop-filter]:bg-background/60"
  >
    <div class="container flex h-12 items-center justify-between gap-6">
      <NuxtLink
        to="/"
        class="group flex items-center gap-2 text-foreground transition-opacity duration-200 hover:opacity-70"
        aria-label="mapkit-cn home"
      >
        <Icon name="lucide:map" class="size-[18px] text-primary" />
        <span class="text-[0.9375rem] font-semibold tracking-tight">
          mapkit<span class="text-muted-foreground">-cn</span>
        </span>
      </NuxtLink>
      <div class="flex items-center gap-1">
        <Button
          as="a"
          href="https://github.com/geoql/v-mapkit.js"
          target="_blank"
          rel="noopener noreferrer"
          variant="ghost"
          size="icon"
          class="size-9 text-muted-foreground hover:text-foreground"
          aria-label="GitHub repository"
        >
          <Icon name="simple-icons:github" class="size-[18px]" />
        </Button>
        <ClientOnly>
          <Button
            variant="ghost"
            size="icon"
            class="size-9 text-muted-foreground hover:text-foreground"
            aria-label="Toggle color theme"
            @click="toggleTheme"
          >
            <Icon
              :name="colorMode.value === 'dark' ? 'lucide:sun' : 'lucide:moon'"
              class="size-[18px]"
            />
          </Button>
          <template #fallback>
            <span class="size-9"></span>
          </template>
        </ClientOnly>
      </div>
    </div>
  </header>
</template>
