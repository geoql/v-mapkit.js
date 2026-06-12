import { createHighlighter, type Highlighter } from 'shiki';

/**
 * Languages and themes the example code blocks actually use.
 * Kept deliberately small so the Shiki bundle stays lean.
 */
const LANGS = ['vue', 'typescript', 'bash', 'json'] as const;
export const SHIKI_THEME_LIGHT = 'github-light-default';
export const SHIKI_THEME_DARK = 'github-dark-default';

let highlighterPromise: Promise<Highlighter> | null = null;

/**
 * Lazily create a single shared Shiki highlighter.
 * Highlighting runs at build / SSR time and the resulting HTML is
 * serialized into the payload, so the client never re-runs Shiki.
 */
export function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [SHIKI_THEME_LIGHT, SHIKI_THEME_DARK],
      langs: [...LANGS],
    });
  }
  return highlighterPromise;
}
