import {
  AllowedComponentProps,
  ComponentCustomProps,
  DefineComponent,
  VNodeProps,
} from 'vue';

type MapInitOptions = mapkit.MapKitInitOptions;
type MapOptions = mapkit.MapConstructorOptions;

export type GeocoderOptions = {
  enabled: boolean;
  options?: mapkit.GeocoderConstructorOptions;
};
export type SearchOptions = {
  enabled: boolean;
  options?: mapkit.SearchConstructorOptions;
};

export interface VMapProps {
  version: string;
  language: string;
  accessToken: string;
  initOptions: MapInitOptions;
  mapOptions: MapOptions;
  geocoderOptions: GeocoderOptions;
  searchOptions: SearchOptions;
}

type VMapComponentProps = AllowedComponentProps &
  ComponentCustomProps &
  VNodeProps &
  VMapProps;

export const VMap: DefineComponent<VMapComponentProps>;
