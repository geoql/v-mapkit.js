import type { NavSection } from '~/types';

export function useDocsNavigation() {
  const route = useRoute();

  const sections: NavSection[] = [
    {
      title: 'Guide',
      path: '/guide',
      children: [
        { title: 'Getting Started', path: '/guide/getting-started' },
        { title: 'Configuration', path: '/guide/configuration' },
        { title: 'Examples', path: '/guide/examples' },
      ],
    },
    {
      title: 'Components',
      path: '/components',
      children: [
        { title: 'VMap', path: '/components/map' },
        { title: 'Annotations', path: '/components/annotations' },
        { title: 'Overlays', path: '/components/overlays' },
        { title: 'Look Around', path: '/components/look-around' },
        { title: 'Clustering', path: '/components/clustering' },
        { title: 'Controls', path: '/components/controls' },
      ],
    },
    {
      title: 'Services',
      path: '/services',
      children: [
        { title: 'Search', path: '/services/search' },
        { title: 'Geocoding', path: '/services/geocoding' },
        { title: 'Directions', path: '/services/directions' },
      ],
    },
  ];

  const sidebarOpen = useState('docs-sidebar-open', () => false);

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value;
  }

  function closeSidebar() {
    sidebarOpen.value = false;
  }

  const isActive = computed(() => (path: string) => route.path === path);
  const isInSection = computed(
    () => (sectionPath: string) => route.path.startsWith(sectionPath),
  );

  return {
    sections,
    sidebarOpen,
    toggleSidebar,
    closeSidebar,
    isActive,
    isInSection,
  };
}
