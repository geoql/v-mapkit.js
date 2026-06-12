import type { InjectionKey, Ref } from 'vue';

export const MapKitGlobalKey: InjectionKey<Ref<typeof mapkit | undefined>> =
  Symbol('mapkit:global');
export const MapKitInstanceKey: InjectionKey<Ref<mapkit.Map | undefined>> =
  Symbol('mapkit:map');
export const MapKitReadyKey: InjectionKey<Ref<boolean>> =
  Symbol('mapkit:ready');
export const MapKitAnnotationKey: InjectionKey<
  Ref<mapkit.Annotation | undefined>
> = Symbol('mapkit:annotation');
