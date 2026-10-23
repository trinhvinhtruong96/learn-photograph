import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { STAGES } from './src/data/roadmap.js';

const page = (path) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: page('./index.html'),
        ...Object.fromEntries(STAGES.map((s) => [s.id, page(`./stages/${s.id}.html`)])),
      },
    },
  },
  test: { include: ['tests/**/*.test.js'] },
});
