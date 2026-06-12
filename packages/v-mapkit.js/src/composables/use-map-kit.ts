/**
 * Loads the MapKit JS library from Apple's CDN exactly once.
 *
 * @param version - mapkit.js version (e.g. '5.x.x')
 * @returns the global `mapkit` object
 */
let loadPromise: Promise<typeof mapkit> | null = null;

export function loadMapKit(version: string): Promise<typeof mapkit> {
  if (window.mapkit) return Promise.resolve(window.mapkit);
  if (loadPromise) return loadPromise;
  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://cdn.apple-mapkit.com/mk/${version}/mapkit.js`;
    script.crossOrigin = 'anonymous';
    script.onload = () => resolve(window.mapkit);
    script.onerror = () => {
      loadPromise = null; // allow retry after transient failure
      reject(new Error('Failed to load MapKit JS from Apple CDN'));
    };
    document.head.appendChild(script);
  });
  return loadPromise;
}

/**
 * Initializes MapKit with a JWT authorization callback.
 *
 * @param mk - the mapkit global
 * @param token - JWT access token
 * @param initOptions - extra MapKit init options
 */
export function initMapKit(
  mk: typeof mapkit,
  token: string,
  initOptions: mapkit.MapKitInitOptions = {} as mapkit.MapKitInitOptions,
): void {
  mk.init({
    ...initOptions,
    authorizationCallback: (done) => done(token),
  });
}
