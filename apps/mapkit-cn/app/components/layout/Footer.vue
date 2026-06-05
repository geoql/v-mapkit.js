<script setup lang="ts">
  const config = useRuntimeConfig();
  const version = config.public.library.version;
  const year = new Date().getFullYear();

  const linkGroups = [
    {
      title: 'Library',
      links: [
        { label: 'Components', to: '/registry' },
        { label: 'Examples', to: '/examples' },
        { label: 'Documentation', to: '/docs' },
      ],
    },
    {
      title: 'Resources',
      links: [
        {
          label: 'MapKit JS',
          href: 'https://developer.apple.com/maps/mapkitjs/',
        },
        { label: 'shadcn-vue', href: 'https://www.shadcn-vue.com/' },
        { label: 'Tailwind CSS', href: 'https://tailwindcss.com/' },
      ],
    },
    {
      title: 'Project',
      links: [
        { label: 'GitHub', href: 'https://github.com/geoql/v-mapkit.js' },
        {
          label: 'Issues',
          href: 'https://github.com/geoql/v-mapkit.js/issues',
        },
        {
          label: 'npm',
          href: 'https://www.npmjs.com/package/@geoql/v-mapkit.js',
        },
      ],
    },
  ];
</script>

<template>
  <footer class="border-t border-border/60 bg-card/30">
    <div class="container py-16">
      <div class="grid gap-12 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div class="flex flex-col gap-3">
          <NuxtLink
            to="/"
            class="flex items-center gap-2 text-foreground"
            aria-label="mapkit-cn home"
          >
            <Icon name="lucide:map" class="size-[18px] text-primary" />
            <span class="text-[0.9375rem] font-semibold tracking-tight">
              mapkit<span class="text-muted-foreground">-cn</span>
            </span>
          </NuxtLink>
          <p class="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Beautiful Apple MapKit components for Vue 3. Copy, style, ship.
          </p>
        </div>

        <div
          v-for="group in linkGroups"
          :key="group.title"
          class="flex flex-col gap-3"
        >
          <h3
            class="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            {{ group.title }}
          </h3>
          <ul class="flex flex-col gap-2.5">
            <li v-for="link in group.links" :key="link.label">
              <NuxtLink
                v-if="link.to"
                :to="link.to"
                class="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                {{ link.label }}
              </NuxtLink>
              <a
                v-else
                :href="link.href"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="mt-12 flex flex-col gap-3 border-t border-border/60 pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between"
      >
        <p>© {{ year }} mapkit-cn. Built on @geoql/v-mapkit.js.</p>
        <p class="font-mono text-xs">
          v{{ version }}
        </p>
      </div>
    </div>
  </footer>
</template>
