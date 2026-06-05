/**
 * Shared MapKit JS token state.
 *
 * Resolution order:
 *   1. localStorage override (`mapkit-cn:token`) — set by the user via the UI
 *   2. runtime config `public.mapkitToken` — build-time default
 *
 * The localStorage hydration happens once in `plugins/mapkit-token.client.ts`.
 * This composable just reads/writes the shared `useState` value.
 */
export const MAPKIT_TOKEN_STORAGE_KEY = 'mapkit-cn:token';

export function useMapkitToken() {
  const config = useRuntimeConfig();
  const fallback = (config.public.mapkitToken as string) || '';

  const token = useState<string>('mapkit-token', () => fallback);

  function setToken(value: string): void {
    const next = value.trim();
    token.value = next;

    if (import.meta.client) {
      if (next) {
        localStorage.setItem(MAPKIT_TOKEN_STORAGE_KEY, next);
      } else {
        localStorage.removeItem(MAPKIT_TOKEN_STORAGE_KEY);
      }
    }
  }

  function clearToken(): void {
    setToken('');
  }

  const hasToken = computed(() => token.value.trim().length > 0);

  return { token, hasToken, setToken, clearToken };
}
