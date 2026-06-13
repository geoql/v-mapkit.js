<script setup lang="ts">
  import { Pencil, CircleDot, ArrowLeft, ArrowRight, FileText } from 'lucide-vue-next';
  import type { NavItem } from '~/types';

  defineProps<{
    prev: NavItem | null;
    next: NavItem | null;
    editUrl: string;
    issueUrl: string;
  }>();
</script>

<template>
  <footer class="mt-16 pt-8">
    <div class="flex items-center justify-center gap-2 text-sm">
      <div class="h-px flex-1 bg-border/50" />
      <a
        :href="editUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-card/50 px-3 py-1.5 text-muted-foreground backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
      >
        <Pencil class="size-3.5" />
        Edit
      </a>
      <a
        :href="issueUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-card/50 px-3 py-1.5 text-muted-foreground backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
      >
        <CircleDot class="size-3.5" />
        Report
      </a>
      <div class="h-px flex-1 bg-border/50" />
    </div>

    <div v-if="prev || next" class="mt-6 grid grid-cols-2 gap-4">
      <NuxtLink
        v-if="prev"
        :to="prev.path"
        :aria-label="`Previous: ${prev.title}`"
        class="group flex flex-col rounded-xl border border-border/60 bg-card/50 p-5 shadow-2xs transition-all hover:border-primary/30 hover:shadow-md"
      >
        <span class="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <ArrowLeft class="size-3.5 transition-transform group-hover:-translate-x-1 group-hover:text-primary" />
          Previous
        </span>
        <span class="flex items-center gap-3">
          <span class="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/50 transition-colors group-hover:border-primary/30 group-hover:bg-primary/10">
            <FileText class="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
          </span>
          <span class="text-base font-semibold tracking-tight transition-colors group-hover:text-primary">{{ prev.title }}</span>
        </span>
      </NuxtLink>
      <div v-else />

      <NuxtLink
        v-if="next"
        :to="next.path"
        :aria-label="`Next: ${next.title}`"
        class="group flex flex-col items-end rounded-xl border border-border/60 bg-card/50 p-5 text-right shadow-2xs transition-all hover:border-primary/30 hover:shadow-md"
      >
        <span class="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Next
          <ArrowRight class="size-3.5 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </span>
        <span class="flex items-center gap-3">
          <span class="text-base font-semibold tracking-tight transition-colors group-hover:text-primary">{{ next.title }}</span>
          <span class="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/50 transition-colors group-hover:border-primary/30 group-hover:bg-primary/10">
            <FileText class="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
          </span>
        </span>
      </NuxtLink>
    </div>
  </footer>
</template>
