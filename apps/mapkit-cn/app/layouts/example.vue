<script setup lang="ts">
  import { Button } from '@/components/ui/button';
  import {
    exampleGroups,
    findExample,
    GITHUB_EXAMPLES_BASE,
  } from '~/lib/examples';

  const route = useRoute();

  const currentSlug = computed(() => {
    const segments = route.path.split('/').filter(Boolean);
    // /examples/<slug>
    return segments[0] === 'examples' && segments[1] ? segments[1] : '';
  });

  const sourceUrl = computed(() => {
    const example = findExample(currentSlug.value);
    return example
      ? `${GITHUB_EXAMPLES_BASE}/${example.slug}.vue`
      : GITHUB_EXAMPLES_BASE;
  });

  const sidebarOpen = ref(false);
  watch(currentSlug, () => (sidebarOpen.value = false));
</script>

<template>
  <div class="flex min-h-screen flex-col bg-background">
    <a
      href="#example-content"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
    >
      Skip to content
    </a>

    <LayoutHeader />

    <div class="container flex-1">
      <div class="lg:grid lg:grid-cols-[15rem_1fr] lg:gap-10">
        <!-- Sidebar -->
        <aside
          class="hidden lg:block"
          aria-label="Examples navigation"
        >
          <div
            class="sticky top-12 max-h-[calc(100dvh-3rem)] overflow-y-auto py-8 pr-2"
          >
            <NuxtLink
              to="/examples"
              class="mb-5 flex items-center gap-1.5 text-[0.8125rem] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <Icon name="lucide:arrow-left" class="size-3.5" />
              All examples
            </NuxtLink>

            <nav class="flex flex-col gap-6">
              <div
                v-for="group in exampleGroups"
                :key="group.title"
                class="flex flex-col gap-1.5"
              >
                <p
                  class="px-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  {{ group.title }}
                </p>
                <NuxtLink
                  v-for="example in group.examples"
                  :key="example.slug"
                  :to="`/examples/${example.slug}`"
                  class="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[0.8125rem] transition-colors duration-150"
                  :class="
                    currentSlug === example.slug
                      ? 'bg-primary/10 font-medium text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  "
                >
                  <Icon :name="example.icon" class="size-3.5 shrink-0" />
                  {{ example.title }}
                </NuxtLink>
              </div>
            </nav>
          </div>
        </aside>

        <!-- Main -->
        <main id="example-content" class="min-w-0 py-8 lg:py-10">
          <!-- Mobile bar -->
          <div
            class="mb-6 flex items-center justify-between gap-3 lg:justify-end"
          >
            <button
              type="button"
              class="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-[0.8125rem] font-medium text-muted-foreground transition-colors hover:text-foreground lg:hidden"
              @click="sidebarOpen = !sidebarOpen"
            >
              <Icon name="lucide:panel-left" class="size-4" />
              Examples
            </button>

            <Button
              as="a"
              :href="sourceUrl"
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              size="sm"
            >
              <Icon name="simple-icons:github" class="size-3.5" />
              View source
            </Button>
          </div>

          <slot></slot>
        </main>
      </div>
    </div>

    <!-- Mobile sidebar drawer -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm lg:hidden"
        @click="sidebarOpen = false"
      >
        <div
          class="h-full w-72 max-w-[80vw] overflow-y-auto border-r border-border bg-background p-6"
          @click.stop
        >
          <div class="mb-5 flex items-center justify-between">
            <NuxtLink
              to="/examples"
              class="text-sm font-semibold tracking-tight text-foreground"
            >
              All examples
            </NuxtLink>
            <button
              type="button"
              aria-label="Close"
              class="text-muted-foreground hover:text-foreground"
              @click="sidebarOpen = false"
            >
              <Icon name="lucide:x" class="size-5" />
            </button>
          </div>

          <nav class="flex flex-col gap-6">
            <div
              v-for="group in exampleGroups"
              :key="group.title"
              class="flex flex-col gap-1.5"
            >
              <p
                class="px-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {{ group.title }}
              </p>
              <NuxtLink
                v-for="example in group.examples"
                :key="example.slug"
                :to="`/examples/${example.slug}`"
                class="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[0.8125rem] transition-colors"
                :class="
                  currentSlug === example.slug
                    ? 'bg-primary/10 font-medium text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                "
              >
                <Icon :name="example.icon" class="size-3.5 shrink-0" />
                {{ example.title }}
              </NuxtLink>
            </div>
          </nav>
        </div>
      </div>
    </Transition>
  </div>
</template>
