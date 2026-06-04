<script setup lang="ts">
  import { inject, onBeforeUnmount, ref, watch, type Ref } from 'vue';

  import { MapKitAnnotationKey } from '../../symbols';

  const props = defineProps<{
    /**
     * The annotation to attach the callout delegate to. Optional: when omitted
     * the parent annotation component's instance is injected automatically.
     */
    annotation?: mapkit.Annotation;
    /** Optional left/right accessory elements rendered alongside the content. */
    accessory?: { left?: HTMLElement; right?: HTMLElement };
  }>();

  /** Container that holds the rendered slot content handed to MapKit. */
  const content = ref<HTMLDivElement>();

  const injected = inject(MapKitAnnotationKey, undefined) as
    | Ref<mapkit.Annotation | undefined>
    | undefined;

  let attached: mapkit.Annotation | undefined;

  const buildDelegate = (): mapkit.AnnotationCalloutDelegate => {
    const delegate: mapkit.AnnotationCalloutDelegate = {
      calloutContentForAnnotation: () =>
        content.value ?? document.createElement('div'),
    };
    if (props.accessory?.left) {
      delegate.calloutLeftAccessoryForAnnotation = () =>
        props.accessory!.left as HTMLElement;
    }
    if (props.accessory?.right) {
      delegate.calloutRightAccessoryForAnnotation = () =>
        props.accessory!.right as HTMLElement;
    }
    return delegate;
  };

  const detach = () => {
    if (!attached) return;
    attached.callout = undefined;
    attached.calloutEnabled = false;
    attached = undefined;
  };

  const attach = (annotation: mapkit.Annotation | undefined) => {
    if (annotation === attached) {
      if (annotation) annotation.callout = buildDelegate();
      return;
    }
    detach();
    if (!annotation) return;
    annotation.callout = buildDelegate();
    annotation.calloutEnabled = true;
    attached = annotation;
  };

  watch(
    [() => props.annotation, () => injected?.value, () => props.accessory],
    () => attach(props.annotation ?? injected?.value),
    { immediate: true, flush: 'post' },
  );

  onBeforeUnmount(detach);

  defineExpose({ content });
</script>

<template>
  <div ref="content" class="v-mapkit-annotation-callout">
    <slot />
  </div>
</template>
