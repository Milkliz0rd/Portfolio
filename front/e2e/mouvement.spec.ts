import type { Page } from '@playwright/test';
import { expect, test } from './support/banc';
import { contenuCache } from './support/contenu-visible';
import { PAGES_ERREUR, pagesDuBuild, scriptPrincipal } from './support/site';

// Socle du mouvement (TK-23, PF-04) : aucune animation ne cache jamais le contenu. Sans JavaScript
// et avec les animations réduites, sur chaque page du build et chaque page d'erreur ; script
// principal bloqué ou en erreur, et animations permises, sur « / ». Joués dans les six profils,
// sous la surveillance de banc.ts.

/** Le repli du petit script de tête (src/index.html) : sans mv-pret, mv-actif part après 3 s. */
const REPLI_MS = 3000;
// Marge du repli, comptée depuis le début de la navigation : le minuteur ne part qu'à l'exécution
// du script de tête, la réponse du serveur local reçue, et sous la charge du banc (plusieurs
// navigateurs à la fois) un minuteur peut partir quelques centaines de ms en retard. Une seconde
// couvre les deux, loin d'un repli absent ou allongé.
const MARGE_MS = 1000;
const MESSAGE_ERREUR = 'mouvement : erreur levée par le script principal de remplacement';

const adresses = [
  ...pagesDuBuild().map((adresse) => ({ adresse, statut: 200 })),
  ...PAGES_ERREUR.map(({ adresse }) => ({ adresse, statut: 404 })),
];

interface Journal {
  /** Instant (ms depuis le début de la navigation) de la première pose de chaque classe mv-*. */
  poses: Record<string, number>;
  /** Instant du premier retrait de mv-actif, null s'il n'a jamais été retiré. */
  retraitActif: number | null;
}

/** Relève, dès la création du document et avant tout script de la page, les classes mv-* de html. */
async function suivreClasses(page: Page): Promise<() => Promise<Journal>> {
  await page.addInitScript(() => {
    const journal: Journal = { poses: {}, retraitActif: null };
    Object.assign(window, { journalMouvement: journal });
    new MutationObserver(() => {
      const classes = document.documentElement.classList;
      const instant = performance.now();
      for (const classe of classes) if (classe.startsWith('mv-')) journal.poses[classe] ??= instant;
      if (journal.poses['mv-actif'] !== undefined && !classes.contains('mv-actif')) {
        journal.retraitActif ??= instant;
      }
    }).observe(document, { attributes: true, attributeFilter: ['class'], subtree: true });
  });
  return () =>
    page.evaluate(() => (window as unknown as { journalMouvement: Journal }).journalMouvement);
}

function defilement(page: Page): Promise<string> {
  return page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
}

/** Script principal bloqué ou en erreur : mv-actif posé au départ, puis retiré par le repli. */
async function constaterRepli(page: Page, journal: () => Promise<Journal>): Promise<void> {
  expect((await journal()).poses['mv-actif'], 'mv-actif posé par le script de tête').toBeDefined();
  await expect
    .poll(async () => (await journal()).retraitActif, {
      message: `mv-actif retiré par le repli`,
      timeout: REPLI_MS + MARGE_MS,
    })
    .not.toBeNull();
  const { retraitActif, poses } = await journal();
  expect(retraitActif, 'retrait au plus 3 s (et la marge) après l’arrivée').toBeLessThanOrEqual(
    REPLI_MS + MARGE_MS,
  );
  expect(poses['mv-pret'], 'mv-pret jamais posé').toBeUndefined();
  await expect(page.locator('html')).not.toHaveClass(/\bmv-(actif|pret)\b/);
  expect(await contenuCache(page), 'contenu caché').toEqual([]);
}

test.describe(() => {
  test.use({ javaScriptEnabled: false });

  for (const { adresse, statut } of adresses) {
    test(`mouvement : sans JavaScript ${adresse}`, async ({ page, surveillance }) => {
      if (statut === 404) surveillance.attendreReponseEnErreur(adresse, 404);
      const reponse = await page.goto(adresse);
      expect(reponse?.status(), `statut de ${adresse}`).toBe(statut);
      await expect(page.locator('html')).not.toHaveClass(/\bmv-actif\b/);
      expect(await contenuCache(page), 'contenu caché').toEqual([]);
    });
  }
});

test('mouvement : script principal bloqué', async ({ page, surveillance }) => {
  const principal = scriptPrincipal();
  surveillance.attendreRequeteAbandonnee(principal);
  const journal = await suivreClasses(page);
  await page.route(principal, (route) => route.abort());
  const abandon = page.waitForEvent('requestfailed', (requete) => requete.url() === principal);
  await page.goto('/');
  await abandon;
  await constaterRepli(page, journal);
});

test('mouvement : script principal en erreur', async ({ page, surveillance }) => {
  const principal = scriptPrincipal();
  surveillance.attendreErreurDePage(MESSAGE_ERREUR);
  const journal = await suivreClasses(page);
  const corps = `throw new Error(${JSON.stringify(MESSAGE_ERREUR)});`;
  await page.route(principal, (route) =>
    route.fulfill({ contentType: 'text/javascript', body: corps }),
  );
  const erreur = page.waitForEvent('pageerror');
  await page.goto('/');
  expect((await erreur).message, 'erreur levée par le script de remplacement').toBe(MESSAGE_ERREUR);
  await constaterRepli(page, journal);
});

for (const { adresse, statut } of adresses) {
  test(`mouvement : animations réduites ${adresse}`, async ({ page, surveillance }) => {
    if (statut === 404) surveillance.attendreReponseEnErreur(adresse, 404);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const journal = await suivreClasses(page);
    await page.goto(adresse);
    expect((await journal()).poses['mv-actif'], 'mv-actif jamais posé').toBeUndefined();
    expect(await defilement(page), 'défilement doux coupé').toBe('auto');
    expect(await contenuCache(page), 'contenu caché').toEqual([]);
  });
}

test('mouvement : animations permises', async ({ page, surveillance }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const journal = await suivreClasses(page);
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/\bmv-pret\b/);
  await expect(page.locator('html')).toHaveClass(/\bmv-actif\b/);
  expect(await defilement(page), 'défilement doux').toBe('smooth');
  // Le repli passé, mv-pret garde mv-actif.
  await page.waitForFunction((instant) => performance.now() > instant, REPLI_MS + MARGE_MS);
  expect((await journal()).retraitActif, 'mv-actif gardé après le repli').toBeNull();
  expect(await contenuCache(page), 'contenu caché').toEqual([]);
  expect(surveillance.violations(), 'violations de la politique de sécurité').toEqual([]);
});

test('mouvement : animations permises, pause mémorisée', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.addInitScript(() => localStorage.setItem('mv-pause', '1'));
  const journal = await suivreClasses(page);
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/\bmv-pret\b/);
  const { poses } = await journal();
  // Posée par le script de tête, avant le premier affichage, donc avant que l'application démarre.
  expect(poses['mv-pause'], 'mv-pause posée par le script de tête').toBeLessThan(
    poses['mv-pret'] ?? 0,
  );
});

test('mouvement : animations permises, stockage local indisponible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new DOMException('stockage indisponible', 'SecurityError');
    };
  });
  await page.goto('/');
  // Aucune erreur non rattrapée (surveillance) : le mouvement démarre, sans pause.
  await expect(page.locator('html')).toHaveClass(/\bmv-pret\b/);
  await expect(page.locator('html')).not.toHaveClass(/\bmv-pause\b/);
});
