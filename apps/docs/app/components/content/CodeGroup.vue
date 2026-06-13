<script setup lang="ts">
  import { Comment } from 'vue';

  const activeTab = ref(0);
  const slots = useSlots();

  const tabs = computed(() => {
    const defaultSlot = slots.default?.();
    if (!defaultSlot) return [];
    return defaultSlot
      .filter((node) => node.type !== Comment)
      .map((node, index) => ({
        index,
        label:
          (node.props as Record<string, string> | null)?.filename ??
          (node.props as Record<string, string> | null)?.language ??
          `Tab ${index + 1}`,
        node,
      }));
  });
</script>

<template>
  <div class="not-prose my-6 overflow-hidden rounded-lg border border-border">
    <div
      v-if="tabs.length > 1"
      class="flex border-b border-border bg-muted/30"
    >
      <button
        v-for="tab in tabs"
        :key="tab.index"
        :class="[
          'px-4 py-2 font-mono text-xs transition-colors',
          activeTab === tab.index
            ? 'border-b-2 border-primary text-foreground'
            : 'text-muted-foreground hover:text-foreground',
        ]"
        @click="activeTab = tab.index"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="[&_pre]:my-0 [&_pre]:rounded-none [&_pre]:border-0">
      <template v-for="(tab, i) in tabs" :key="i">
        <div v-show="activeTab === i">
          <component :is="tab.node" />
        </div>
      </template>
    </div>
  </div>
</template>
