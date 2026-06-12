import {
  createHighlighter,
  createJavaScriptRegexEngine,
  type Highlighter,
} from 'shiki';

const LANGS = ['vue', 'typescript', 'bash', 'json'] as const;
export const SHIKI_THEME_LIGHT = 'github-light-default';
export const SHIKI_THEME_DARK = 'github-dark-default';

let highlighterPromise: Promise<Highlighter> | null = null;

/**
 * Lazily create one shared Shiki highlighter using the JavaScript regex
 * engine. The default oniguruma engine needs WASM, which fails to load in
 * the Cloudflare Workers runtime where these pages are SSR'd — the JS
 * engine has no WASM dependency and runs at the edge. Highlighting happens
 * at SSR time and the HTML is serialized into the payload, so the browser
 * never runs Shiki.
 */
export function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [SHIKI_THEME_LIGHT, SHIKI_THEME_DARK],
      langs: [...LANGS],
      engine: createJavaScriptRegexEngine(),
    });
  }
  return highlighterPromise;
}
