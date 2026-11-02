import { defineConfig, devices } from '@playwright/test';
import { ORIGINE } from './e2e/support/site';

// Banc de bout en bout et d'accessibilité (TK-21, Étape 12) : le build de test pré-rendu, servi
// par wrangler dev avec les règles de l'hébergeur (PF-08), dans les trois moteurs, en profil
// ordinateur et en profil téléphone. « npm run e2e » construit ce build puis lance ce banc.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  // Aucune nouvelle tentative, ni en local ni dans la CI : un test instable est un défaut.
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    // L'origine du build de test (PF-07) : la politique 'self' et le contrôle des requêtes la
    // comparent telle quelle, localhost et non 127.0.0.1.
    baseURL: ORIGINE,
    trace: 'retain-on-failure',
  },
  // Le serveur sert le build existant, il ne le construit jamais. Un serveur déjà présent sur
  // le port fait échouer le banc, au lieu de lui faire tester un autre build.
  webServer: {
    command: 'npm run serveur-local',
    url: `${ORIGINE}/`,
    reuseExistingServer: false,
    gracefulShutdown: { signal: 'SIGTERM', timeout: 5000 },
  },
  projects: [
    { name: 'chromium-ordinateur', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox-ordinateur', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit-ordinateur', use: { ...devices['Desktop Safari'] } },
    { name: 'chromium-telephone', use: { ...devices['Pixel 7'] } },
    { name: 'webkit-telephone', use: { ...devices['iPhone 15'] } },
    // Firefox ne prend pas en charge isMobile : la taille d'un téléphone, par la seule fenêtre.
    {
      name: 'firefox-telephone',
      use: { ...devices['Desktop Firefox'], viewport: { width: 390, height: 844 } },
    },
  ],
});
