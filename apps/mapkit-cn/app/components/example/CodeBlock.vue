<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      code: string;
      language?: string;
      filename?: string;
    }>(),
    {
      language: 'vue',
      filename: '',
    },
  );

  const copied = ref(false);
  let resetTimer: ReturnType<typeof setTimeout> | undefined;

  async function copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(props.code.trim());
      copied.value = true;
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => (copied.value = false), 1600);
    } catch {
      copied.value = false;
    }
  }

  onBeforeUnmount(() => clearTimeout(resetTimer));
</script>

<template>
  <figure
    class="group/code overflow-hidden rounded-xl border border-border bg-card"
  >
    <figcaption
      class="flex items-center justify-between border-b border-border/70 bg-secondary/40 px-4 py-2"
    >
      <span
        class="flex items-center gap-2 font-mono text-xs text-muted-foreground"
      >
        <Icon name="lucide:code-xml" class="size-3.5" />
        {{ filename || `${language} component` }}
      </span>
      <button
        type="button"
        class="flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        :aria-label="copied ? 'Copied' : 'Copy code'"
        @click="copy"
      >
        <Icon
          :name="copied ? 'lucide:check' : 'lucide:copy'"
          class="size-3.5"
          :class="copied ? 'text-success' : ''"
        />
        {{ copied ? 'Copied' : 'Copy' }}
      </button>
    </figcaption>

    <pre
      class="overflow-x-auto px-4 py-4 text-[0.8125rem] leading-relaxed"
    ><code class="font-mono text-foreground/90">{{ code.trim() }}</code></pre>
  </figure>
</template>
