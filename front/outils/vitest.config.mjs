// Tests des outils et des fichiers de styles (PF-01), lancés par « npm run test:outils » :
// Vitest dans Node, sans le build d'Angular. La racine reste front/, pour que le cache de
// Vitest aille dans node_modules/ ; le rapport en arbre nomme chaque test dans les journaux.
import { join } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: join(import.meta.dirname, '..'),
  test: {
    include: ['outils/tests/**/*.test.mjs'],
    environment: 'node',
    reporters: ['tree'],
  },
});
