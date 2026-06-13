import type { NavSection } from '~/types';

export function useDocsNavigation() {
  const route = useRoute();

  const sections: NavSection[] = [
    {
      title: 'Guide',
      path: '/guide',
      children: [{ title: 'Getting Started', path: '/guide/getting-started' }],
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
