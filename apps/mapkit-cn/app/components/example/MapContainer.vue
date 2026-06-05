<script setup lang="ts">
  withDefaults(
    defineProps<{
      /** Container height utility — defaults to a comfortable demo height. */
      height?: string;
    }>(),
    {
      height: 'h-[28rem]',
    },
  );

  const { hasToken } = useMapkitToken();
</script>

<template>
  <div
    class="relative w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm"
    :class="height"
  >
    <!-- Token present: render the map. ClientOnly because MapKit JS needs the DOM + window. -->
    <ClientOnly>
      <template v-if="hasToken">
        <div class="demo-map-container absolute inset-0">
          <slot></slot>
        </div>
      </template>

      <!-- No token: friendly gate that opens the token dialog. -->
      <template v-else>
        <div
          class="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-secondary/30 px-6 text-center"
        >
          <span
            class="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary"
          >
            <Icon name="lucide:key-round" class="size-5" />
          </span>
          <div class="space-y-1.5">
            <p class="text-sm font-medium text-foreground">
              MapKit token required
            </p>
            <p class="mx-auto max-w-xs text-[0.8125rem] text-muted-foreground">
              Add your Apple MapKit JS token to render the live map. It is
              stored locally in your browser only.
            </p>
          </div>
          <ExampleTokenDialog />
        </div>
      </template>

      <!-- SSR / hydration fallback. -->
      <template #fallback>
        <div
          class="absolute inset-0 flex items-center justify-center bg-secondary/30"
        >
          <Icon
            name="lucide:loader-circle"
            class="size-5 animate-spin text-muted-foreground"
          />
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
