import type { App, Plugin } from 'vue';

import VImageAnnotation from './components/VImageAnnotation';
import VMarkerAnnotation from './components/VMarkerAnnotation';
import VPlaceAnnotation from './components/VPlaceAnnotation';
import VCustomAnnotation from './components/VCustomAnnotation';
import VMapFeatureAnnotation from './components/VMapFeatureAnnotation';
import VCircleOverlay from './components/VCircleOverlay';
import VPolygonOverlay from './components/VPolygonOverlay';
import VPolylineOverlay from './components/VPolylineOverlay';
import VTileOverlay from './components/VTileOverlay';
import VMap from './components/VMap';

const install: Plugin['install'] = (app: App) => {
  app.component('VMap', VMap);
  app.component('VMarkerAnnotation', VMarkerAnnotation);
  app.component('VImageAnnotation', VImageAnnotation);
  app.component('VPlaceAnnotation', VPlaceAnnotation);
  app.component('VCustomAnnotation', VCustomAnnotation);
  app.component('VMapFeatureAnnotation', VMapFeatureAnnotation);
  app.component('VCircleOverlay', VCircleOverlay);
  app.component('VPolygonOverlay', VPolygonOverlay);
  app.component('VPolylineOverlay', VPolylineOverlay);
  app.component('VTileOverlay', VTileOverlay);
};

export default install;
