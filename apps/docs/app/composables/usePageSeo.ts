export function usePageSeo(options: {
  title: string;
  description: string;
  path: string;
}) {
  const config = useRuntimeConfig();
  const baseUrl = config.public.baseUrl || 'https://v-mapkit.geoql.in';
  const canonicalUrl = `${baseUrl}${options.path}`;

  useHead({
    link: [{ rel: 'canonical', href: canonicalUrl }],
  });

  useSeoMeta({
    title: options.title,
    description: options.description,
    ogType: 'website',
    ogUrl: canonicalUrl,
    ogTitle: options.title,
    ogDescription: options.description,
    ogSiteName: 'v-mapkit',
    twitterCard: 'summary_large_image',
    twitterTitle: options.title,
    twitterDescription: options.description,
  });
}
