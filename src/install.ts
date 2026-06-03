import type { App, Plugin } from 'vue';

import VImageAnnotation from './components/annotations/VImageAnnotation.vue';
import VMarkerAnnotation from './components/annotations/VMarkerAnnotation.vue';
import VCircleOverlay from './components/overlays/VCircleOverlay.vue';
import VPolygonOverlay from './components/overlays/VPolygonOverlay.vue';
import VPolylineOverlay from './components/overlays/VPolylineOverlay.vue';
import VTileOverlay from './components/overlays/VTileOverlay.vue';
import VMap from './components/VMap.vue';

const install: Plugin['install'] = (app: App) => {
  app.component('VMap', VMap);
  app.component('VMarkerAnnotation', VMarkerAnnotation);
  app.component('VImageAnnotation', VImageAnnotation);
  app.component('VCircleOverlay', VCircleOverlay);
  app.component('VPolygonOverlay', VPolygonOverlay);
  app.component('VPolylineOverlay', VPolylineOverlay);
  app.component('VTileOverlay', VTileOverlay);
};

export default install;
