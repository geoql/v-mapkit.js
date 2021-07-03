/**
 * Loads the mapkit library
 * from CDN
 *
 * @param {string} v – version of mapkit.js
 * @returns {Promise} - Adds mapkit to window
 */
const loadMapKit = async (v: string): Promise<typeof window.mapkit> => {
  return new Promise((resolve, reject) => {
    const src = `https://cdn.apple-mapkit.com/mk/${v}/mapkit.js`;
    if (window.mapkit) {
      return resolve(window.mapkit);
    }
    const script = document.createElement('script');
    script.onload = () => resolve(window.mapkit);
    script.onerror = (error) => reject(error);
    document.body.appendChild(script);
    script.src = src;
  });
};

export { loadMapKit };
