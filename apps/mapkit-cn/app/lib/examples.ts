/**
 * Single source of truth for the examples gallery.
 * Drives: the examples index page, the example-layout sidebar, prev/next nav,
 * and the "View Source" GitHub links.
 */

export interface ExampleMeta {
  slug: string;
  title: string;
  description: string;
  icon: string;
}

export interface ExampleGroup {
  title: string;
  description: string;
  examples: ExampleMeta[];
}

export const exampleGroups: ExampleGroup[] = [
  {
    title: 'Basic Map',
    description: 'Get a map on screen and configure its core appearance.',
    examples: [
      {
        slug: 'basic-map',
        title: 'Basic Map',
        description: 'A minimal map with sensible defaults.',
        icon: 'lucide:map',
      },
      {
        slug: 'map-types',
        title: 'Map Types',
        description: 'Switch between Standard, Satellite, Hybrid, and Muted.',
        icon: 'lucide:layers',
      },
      {
        slug: 'map-configuration',
        title: 'Map Configuration',
        description: 'Color scheme, distances, padding, and tint color.',
        icon: 'lucide:sliders-horizontal',
      },
    ],
  },
  {
    title: 'Annotations',
    description: 'Place points of interest on the map.',
    examples: [
      {
        slug: 'marker-annotation',
        title: 'Marker Annotation',
        description: 'Classic teardrop markers with titles and colors.',
        icon: 'lucide:map-pin',
      },
      {
        slug: 'image-annotation',
        title: 'Image Annotation',
        description: 'Custom image-backed markers at any DPR.',
        icon: 'lucide:image',
      },
      {
        slug: 'place-annotation',
        title: 'Place Annotation',
        description: 'Annotations built from a MapKit Place.',
        icon: 'lucide:building-2',
      },
      {
        slug: 'custom-annotation',
        title: 'Custom Annotation',
        description: 'Render arbitrary DOM as a map annotation.',
        icon: 'lucide:square-dashed',
      },
      {
        slug: 'annotation-callout',
        title: 'Annotation Callout',
        description: 'Custom callout bubbles with rich content.',
        icon: 'lucide:message-square',
      },
    ],
  },
  {
    title: 'Overlays',
    description: 'Draw shapes and custom layers on the map.',
    examples: [
      {
        slug: 'circle-overlay',
        title: 'Circle Overlay',
        description: 'Radius circles for ranges and geofences.',
        icon: 'lucide:circle',
      },
      {
        slug: 'polygon-overlay',
        title: 'Polygon Overlay',
        description: 'Filled regions and area boundaries.',
        icon: 'lucide:pentagon',
      },
      {
        slug: 'polyline-overlay',
        title: 'Polyline Overlay',
        description: 'Routes, paths, and connected lines.',
        icon: 'lucide:spline',
      },
      {
        slug: 'tile-overlay',
        title: 'Tile Overlay',
        description: 'Custom raster tile layers over the base map.',
        icon: 'lucide:grid-3x3',
      },
    ],
  },
  {
    title: 'Controls',
    description: 'Interactive map chrome and UI controls.',
    examples: [
      {
        slug: 'fullscreen-control',
        title: 'Fullscreen Control',
        description: 'Expand the map to fill the viewport.',
        icon: 'lucide:maximize',
      },
      {
        slug: 'geolocate-control',
        title: 'Geolocate Control',
        description: "Center the map on the user's location.",
        icon: 'lucide:locate-fixed',
      },
      {
        slug: 'layer-switcher',
        title: 'Layer Switcher',
        description: 'A dropdown to switch map types.',
        icon: 'lucide:layers-2',
      },
      {
        slug: 'legend',
        title: 'Legend',
        description: 'A positioned legend with custom content.',
        icon: 'lucide:list',
      },
    ],
  },
  {
    title: 'Advanced',
    description: 'Search, geocoding, routing, and clustering.',
    examples: [
      {
        slug: 'clustering',
        title: 'Clustering',
        description: 'Group nearby markers into clusters.',
        icon: 'lucide:group',
      },
      {
        slug: 'search',
        title: 'Search',
        description: 'Place search with live autocomplete.',
        icon: 'lucide:search',
      },
      {
        slug: 'geocoding',
        title: 'Geocoding',
        description: 'Forward and reverse address lookup.',
        icon: 'lucide:milestone',
      },
      {
        slug: 'directions',
        title: 'Directions',
        description: 'Route between two points with a polyline.',
        icon: 'lucide:route',
      },
    ],
  },
  {
    title: 'Special',
    description: 'Look Around immersion and property toggles.',
    examples: [
      {
        slug: 'look-around',
        title: 'Look Around',
        description: 'Interactive street-level 360° imagery.',
        icon: 'lucide:eye',
      },
      {
        slug: 'look-around-preview',
        title: 'Look Around Preview',
        description: 'A static Look Around thumbnail.',
        icon: 'lucide:scan-eye',
      },
      {
        slug: 'property-toggles',
        title: 'Property Toggles',
        description: 'Toggle compass, zoom, scale, and more.',
        icon: 'lucide:toggle-right',
      },
    ],
  },
];

/** Flat, ordered list of every example. */
export const allExamples: ExampleMeta[] = exampleGroups.flatMap(
  (group) => group.examples,
);

export function findExample(slug: string): ExampleMeta | undefined {
  return allExamples.find((example) => example.slug === slug);
}



export const GITHUB_EXAMPLES_BASE =
  'https://github.com/geoql/v-mapkit.js/blob/main/playground/mapkit-cn/app/pages/examples';
