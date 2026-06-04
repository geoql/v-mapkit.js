<script setup lang="ts">
  import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue';

  const props = defineProps<{
    place: mapkit.Place;
    options?: mapkit.LookAroundPreviewOptions;
  }>();

  const emit = defineEmits<{
    load: [event: unknown];
    error: [event: unknown];
  }>();

  const root = ref<HTMLDivElement>();
  const instance = shallowRef<mapkit.LookAroundPreview>();

  const onLoad = (event: unknown) => emit('load', event);
  const onError = (event: unknown) => emit('error', event);

  onMounted(() => {
    const mk = window.mapkit;
    if (!mk || !root.value) {
      emit('error', new Error('MapKit JS is not available'));
      return;
    }
    const created = new mk.LookAroundPreview(root.value, props.options ?? {});
    created.addEventListener('load', onLoad);
    created.addEventListener('error', onError);
    created.show(props.place);
    instance.value = created;
  });

  watch(
    () => props.place,
    (place) => instance.value?.show(place),
  );

  onBeforeUnmount(() => {
    const created = instance.value;
    if (!created) return;
    created.removeEventListener('load', onLoad);
    created.removeEventListener('error', onError);
    created.destroy?.();
    instance.value = undefined;
  });

  defineExpose({ instance });
</script>

<template>
  <div ref="root" class="v-mapkit-look-around-preview" />
</template>

<style scoped>
  .v-mapkit-look-around-preview {
    width: 100%;
    height: 100%;
  }
</style>
