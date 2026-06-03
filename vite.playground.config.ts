import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

const dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  root: resolve(dirname, 'playground'),
  resolve: {
    alias: { '@': resolve(dirname, 'src'), '~': resolve(dirname, '.') },
  },
  plugins: [vue()],
});
