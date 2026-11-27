import { defineConfig, devices } from '@playwright/test';
import { ORIGINE } from './support/site';

// Banc de bout en bout et d'accessibilité (TK-21, Étape 12) : le build de test pré-rendu, servi
// par wrangler dev avec les règles de l'hébergeur (PF-08), dans les trois moteurs, en profil
// ordinateur et en profil téléphone. « npm run e2e » construit ce build puis lance ce banc.
export default defineConfig({
  // Les chemins relatifs se lisent depuis e2e/, le dossier de cette configuration. Les sorties,
  // test-results/ et playwright-report/, restent à la racine de front/ : Playwright les place
  // près du package.json le plus proche.
  testDir: '.',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  // Un test instable est un défaut. En local, aucune nouvelle tentative : il s'y voit tout de
  // suite. Dans la CI, deux : un test qui ne passe qu'à une reprise ne bloque plus la fusion, mais
  // il est marqué instable (flaky) dans le journal et, par le rapporteur github, sur la page de la
  // PR ; il se corrige dans la vague où il apparaît.
  retries: process.env['CI'] ? 2 : 0,
  reporter: process.env['CI']
    ? [['list'], ['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
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
    // Lancé depuis front/, où sont package.json et wrangler.jsonc.
    cwd: '..',
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
