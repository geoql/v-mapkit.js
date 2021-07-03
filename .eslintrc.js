module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 6,
    sourceType: 'module',
  },
  extends: [
    'prettier',
    'plugin:prettier/recommended',
    'plugin:vue/vue3-essential',
    'plugin:jsdoc/recommended',
  ],
  plugins: ['prettier', 'vue', 'jsdoc'],
  // add your custom rules here
  rules: {},
};
