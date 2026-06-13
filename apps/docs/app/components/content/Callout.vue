<script setup lang="ts">
  import { Info, AlertTriangle, Lightbulb } from 'lucide-vue-next';
  import { computed } from 'vue';

  const props = withDefaults(
    defineProps<{ type?: 'info' | 'warning' | 'tip' }>(),
    { type: 'info' },
  );

  const config = computed(() => {
    switch (props.type) {
      case 'warning':
        return {
          icon: AlertTriangle,
          cls: 'border-warning/30 bg-warning/5',
          label: 'Warning',
          color: 'text-warning',
        };
      case 'tip':
        return {
          icon: Lightbulb,
          cls: 'border-success/30 bg-success/5',
          label: 'Tip',
          color: 'text-success',
        };
      default:
        return {
          icon: Info,
          cls: 'border-primary/30 bg-primary/5',
          label: 'Info',
          color: 'text-primary',
        };
    }
  });
</script>

<template>
  <div :class="['my-6 rounded-lg border-l-2 p-4', config.cls]">
    <div class="mb-1 flex items-center gap-2">
      <component :is="config.icon" :class="['size-4', config.color]" />
      <span
        :class="[
          'font-mono text-xs font-medium uppercase tracking-wider',
          config.color,
        ]"
      >
        {{ config.label }}
      </span>
    </div>
    <div class="text-sm leading-relaxed text-muted-foreground [&_p]:mb-0">
      <slot />
    </div>
  </div>
</template>
