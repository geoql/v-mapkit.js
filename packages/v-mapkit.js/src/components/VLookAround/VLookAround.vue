<script setup lang="ts">
  import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue';

  const props = defineProps<{
    place: mapkit.Place;
    options?: mapkit.LookAroundOptions;
  }>();

  const emit = defineEmits<{
    load: [event: unknown];
    error: [event: unknown];
    close: [event: unknown];
  }>();

  const root = ref<HTMLDivElement>();
  const instance = shallowRef<mapkit.LookAround>();

  const onLoad = (event: unknown) => emit('load', event);
  const onError = (event: unknown) => emit('error', event);
  const onClose = (event: unknown) => emit('close', event);

  onMounted(() => {
    const mk = window.mapkit;
    if (!mk || !root.value) {
      emit('error', new Error('MapKit JS is not available'));
      return;
    }
    const created = new mk.LookAround(root.value, props.options ?? {});
    created.addEventListener('load', onLoad);
    created.addEventListener('error', onError);
    created.addEventListener('close', onClose);
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
    created.removeEventListener('close', onClose);
    created.destroy?.();
    instance.value = undefined;
  });

  defineExpose({ instance });
</script>

<template>
  <div ref="root" class="v-mapkit-look-around" />
</template>

<style scoped>
  .v-mapkit-look-around {
    width: 100%;
    height: 100%;
  }
</style>
