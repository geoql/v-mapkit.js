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
  ],
  plugins: ['prettier', 'vue'],
  // add your custom rules here
  rules: {},
};
