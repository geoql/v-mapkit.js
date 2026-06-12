<script setup lang="ts">
  import {
    PopoverContent,
    PopoverPortal,
    PopoverRoot,
    PopoverTrigger,
  } from 'reka-ui';
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
</script>

<template>
  <PopoverRoot v-model:open="open">
    <PopoverTrigger as-child>
      <Button :variant="hasToken ? 'outline' : 'default'" size="sm">
        <Icon
          :name="hasToken ? 'lucide:key-round' : 'lucide:key'"
          class="size-3.5"
        />
        {{ hasToken ? 'Token set' : 'Set MapKit token' }}
      </Button>
    </PopoverTrigger>

    <PopoverPortal>
      <PopoverContent
        :side-offset="8"
        align="center"
        class="z-[100] w-80 rounded-xl border border-border bg-popover p-4 text-left shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
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
            <Button v-if="hasToken" variant="ghost" size="sm" @click="reset">
              Clear
            </Button>
            <Button size="sm" :disabled="!draft.trim()" @click="save">
              Save
            </Button>
          </div>
        </div>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
