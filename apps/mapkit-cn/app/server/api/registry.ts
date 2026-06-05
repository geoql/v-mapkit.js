export default defineEventHandler(() => {
  return [
    {
      name: 'v-map',
      type: 'registry:ui',
      description: 'Apple MapKit JS map component for Vue 3',
    },
    {
      name: 'v-marker-annotation',
      type: 'registry:ui',
      description: 'Marker annotation component for v-map',
    },
  ];
});
