import {
  getHighlighter,
  SHIKI_THEME_DARK,
  SHIKI_THEME_LIGHT,
} from '~/composables/useShiki';

/** Small stable string hash (djb2) for deriving useAsyncData keys. */
function djb2(input: string): string {
  let h = 5381;
  for (let i = 0; i < input.length; i += 1) {
    h = (h * 33) ^ input.charCodeAt(i);
  }
  return (h >>> 0).toString(36);
}

/**
 * Highlight a code string at SSR / prerender time and serialize the HTML
 * into the payload, so the browser never loads Shiki. Returns `null` on
 * failure, letting callers fall back to plain escaped text.
 */
export function useHighlightedCode(
  code: MaybeRefOrGetter<string>,
  language: MaybeRefOrGetter<string>,
) {
  const trimmed = computed(() => toValue(code).trim());
  const lang = computed(() => toValue(language));

  const { data: highlighted } = useAsyncData(
    () => `code-${djb2(trimmed.value + lang.value)}`,
    async () => {
      try {
        const highlighter = await getHighlighter();
        return highlighter.codeToHtml(trimmed.value, {
          lang: lang.value,
          themes: { light: SHIKI_THEME_LIGHT, dark: SHIKI_THEME_DARK },
          defaultColor: false,
        });
      } catch {
        return null;
      }
    },
    { watch: [trimmed, lang] },
  );

  return { trimmed, highlighted };
}
