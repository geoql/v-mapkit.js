import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

import pkg from './package.json' with { type: 'json' };

const dirname = fileURLToPath(new URL('.', import.meta.url));

const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * (c) ${new Date().getFullYear()} ${pkg.author.name}
 * @license ${pkg.license}
 */`;

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(dirname, 'src'),
      '~': resolve(dirname, '.'),
    },
  },
  plugins: [vue()],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: true,
    lib: {
      entry: resolve(dirname, 'src/index.ts'),
      name: 'VMapkit',
      formats: ['es', 'umd', 'cjs'],
      fileName: (format) =>
        format === 'es'
          ? 'v-mapkit.mjs'
          : format === 'cjs'
            ? 'v-mapkit.cjs'
            : 'v-mapkit.umd.cjs',
      cssFileName: 'style',
    },
    rollupOptions: {
      external: ['vue', '@vueuse/core'],
      output: {
        exports: 'named',
        banner,
        globals: { vue: 'Vue', '@vueuse/core': 'VueUse' },
      },
    },
  },
});
