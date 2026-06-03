export default {
  '*.{js,mjs,cjs,ts,tsx,jsx,vue}': ['oxlint --fix', 'oxfmt'],
  '*.{css,scss}': ['stylelint --fix'],
  '*.{json,md,yml,yaml}': ['oxfmt --no-error-on-unmatched-pattern'],
};
