import { App as Application, Plugin } from 'vue';
import { ImageAnnotation, MarkerAnnotation } from './components/annotations';
import {
  CircleOverlay,
  PolygonOverlay,
  PolylineOverlay,
  TileOverlay,
} from './components/overlays';
import VMap from './components/VMap.vue';
import { setVueInstance } from './utils/config/index';

let installed: boolean = false;

const install: Exclude<Plugin['install'], undefined> = (
  instance: Application,
) => {
  if (!installed) {
    setVueInstance(instance);
    instance.component('VMap', VMap);
    instance.component('ImageAnnotation', ImageAnnotation);
    instance.component('MarkerAnnotation', MarkerAnnotation);
    instance.component('CircleOverlay', CircleOverlay);
    instance.component('PolygonOverlay', PolygonOverlay);
    instance.component('PolylineOverlay', PolylineOverlay);
    instance.component('TileOverlay', TileOverlay);
    installed = true;
  }
};

export default install;
