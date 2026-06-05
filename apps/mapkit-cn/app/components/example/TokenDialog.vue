<script setup lang="ts">
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';

  const { token, hasToken, setToken, clearToken } = useMapkitToken();

  const open = ref(false);
  const draft = ref('');

  watch(open, (isOpen) => {
    if (isOpen) draft.value = token.value;
  });

  function save(): void {
    setToken(draft.value);
    open.value = false;
  }

  function reset(): void {
    clearToken();
    draft.value = '';
  }

  function onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') open.value = false;
  }
</script>

<template>
  <div class="relative" @keydown="onKeydown">
    <Button
      :variant="hasToken ? 'outline' : 'default'"
      size="sm"
      @click="open = !open"
    >
      <Icon
        :name="hasToken ? 'lucide:key-round' : 'lucide:key'"
        class="size-3.5"
      />
      {{ hasToken ? 'Token set' : 'Set MapKit token' }}
    </Button>

    <Transition
      enter-active-class="transition duration-200 ease-[cubic-bezier(0.28,0.11,0.32,1)]"
      enter-from-class="opacity-0 translate-y-1 scale-[0.98]"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 translate-y-1 scale-[0.98]"
    >
      <div
        v-if="open"
        class="absolute left-1/2 top-[calc(100%+0.5rem)] z-50 w-80 -translate-x-1/2 rounded-xl border border-border bg-popover p-4 text-left shadow-lg"
      >
        <div class="mb-3 space-y-1">
          <h3 class="text-sm font-semibold text-foreground">
            Apple MapKit JS token
          </h3>
          <p class="text-xs leading-relaxed text-muted-foreground">
            Paste a JWT signed with your MapKit JS key. Stored in
            <code class="font-mono">localStorage</code>, never sent anywhere.
          </p>
        </div>

        <Input
          v-model="draft"
          type="password"
          placeholder="eyJhbGciOiJFUzI1NiIs…"
          autocomplete="off"
          class="font-mono text-xs"
          @keydown.enter="save"
        />

        <div class="mt-3 flex items-center justify-between gap-2">
          <a
            href="https://developer.apple.com/documentation/mapkitjs/creating_a_maps_token"
            target="_blank"
            rel="noopener noreferrer"
            class="text-xs text-primary transition-colors hover:underline"
          >
            How to get one
          </a>
          <div class="flex items-center gap-2">
            <Button
              v-if="hasToken"
              variant="ghost"
              size="sm"
              @click="reset"
            >
              Clear
            </Button>
            <Button size="sm" :disabled="!draft.trim()" @click="save">
              Save
            </Button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
