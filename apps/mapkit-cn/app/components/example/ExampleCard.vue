<script setup lang="ts">
  defineProps<{
    title: string;
    description: string;
  }>();
</script>

<template>
  <section class="space-y-5">
    <header class="space-y-1.5">
      <h2 class="text-2xl font-semibold tracking-tight text-foreground">
        {{ title }}
      </h2>
      <p class="max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">
        {{ description }}
      </p>
    </header>

    <!-- Live demo -->
    <slot></slot>

    <!-- Optional controls strip (sliders, toggles, inputs). -->
    <div v-if="$slots.controls">
      <slot name="controls"></slot>
    </div>

    <!-- Source snippet -->
    <div v-if="$slots.code" class="pt-1">
      <slot name="code"></slot>
    </div>
  </section>
</template>
