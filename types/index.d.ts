import '@types/apple-mapkit-js';
import {
  AllowedComponentProps,
  ComponentCustomProps,
  DefineComponent,
  VNodeProps,
} from 'vue';

type MapInitOptions = mapkit.MapKitInitOptions;
type MapOptions = mapkit.MapConstructorOptions;

export interface VMapProps {
  version: string;
  language: string;
  accessToken: string;
  initOptions: MapInitOptions;
  mapOptions: MapOptions;
}

export type VMapComponentProps = AllowedComponentProps &
  ComponentCustomProps &
  VNodeProps &
  VMapProps;

export const VMap: DefineComponent<VMapComponentProps, {}, any>;
