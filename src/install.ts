import type { App, Plugin } from 'vue';

import VImageAnnotation from './components/VImageAnnotation';
import VMarkerAnnotation from './components/VMarkerAnnotation';
import VPlaceAnnotation from './components/VPlaceAnnotation';
import VCustomAnnotation from './components/VCustomAnnotation';
import VMapFeatureAnnotation from './components/VMapFeatureAnnotation';
import VClusterAnnotation from './components/VClusterAnnotation';
import VAnnotationCallout from './components/VAnnotationCallout';
import VCircleOverlay from './components/VCircleOverlay';
import VPolygonOverlay from './components/VPolygonOverlay';
import VPolylineOverlay from './components/VPolylineOverlay';
import VTileOverlay from './components/VTileOverlay';
import VLookAround from './components/VLookAround';
import VLookAroundPreview from './components/VLookAroundPreview';
import VControlFullscreen from './components/VControlFullscreen';
import VControlGeolocate from './components/VControlGeolocate';
import VControlLayerSwitcher from './components/VControlLayerSwitcher';
import VControlLegend from './components/VControlLegend';
import VMap from './components/VMap';

const install: Plugin['install'] = (app: App) => {
  app.component('VMap', VMap);
  app.component('VMarkerAnnotation', VMarkerAnnotation);
  app.component('VImageAnnotation', VImageAnnotation);
  app.component('VPlaceAnnotation', VPlaceAnnotation);
  app.component('VCustomAnnotation', VCustomAnnotation);
  app.component('VMapFeatureAnnotation', VMapFeatureAnnotation);
  app.component('VClusterAnnotation', VClusterAnnotation);
  app.component('VAnnotationCallout', VAnnotationCallout);
  app.component('VCircleOverlay', VCircleOverlay);
  app.component('VPolygonOverlay', VPolygonOverlay);
  app.component('VPolylineOverlay', VPolylineOverlay);
  app.component('VTileOverlay', VTileOverlay);
  app.component('VLookAround', VLookAround);
  app.component('VLookAroundPreview', VLookAroundPreview);
  app.component('VControlFullscreen', VControlFullscreen);
  app.component('VControlGeolocate', VControlGeolocate);
  app.component('VControlLayerSwitcher', VControlLayerSwitcher);
  app.component('VControlLegend', VControlLegend);
};

export default install;
