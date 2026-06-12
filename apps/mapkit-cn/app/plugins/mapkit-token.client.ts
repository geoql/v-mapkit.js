import { MAPKIT_TOKEN_STORAGE_KEY } from '~/composables/useMapkitToken';

/**
 * Hydrate the shared MapKit token from localStorage on the client, once.
 * Falls back to the build-time runtime-config token when nothing is stored.
 */
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const fallback = (config.public.mapkitToken as string) || '';
  const token = useState<string>('mapkit-token', () => fallback);

  try {
    const stored = localStorage.getItem(MAPKIT_TOKEN_STORAGE_KEY);
    if (stored) {
      token.value = stored;
    }
  } catch {
    // localStorage unavailable (private mode / disabled) — keep fallback.
  }
});
