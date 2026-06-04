export default {
  '*.{js,mjs,cjs,ts,tsx,jsx,vue}': ['vp lint --fix'],
  '*.{css,scss}': ['stylelint --fix'],
  '*.{json,md,yml,yaml}': ['vp fmt'],
};
