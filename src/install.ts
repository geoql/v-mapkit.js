import type { App, Plugin } from 'vue';

import VImageAnnotation from './components/VImageAnnotation';
import VMarkerAnnotation from './components/VMarkerAnnotation';
import VCircleOverlay from './components/VCircleOverlay';
import VPolygonOverlay from './components/VPolygonOverlay';
import VPolylineOverlay from './components/VPolylineOverlay';
import VTileOverlay from './components/VTileOverlay';
import VMap from './components/VMap';

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
