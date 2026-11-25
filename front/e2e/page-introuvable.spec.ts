import type { Page } from '@playwright/test';
import { expect, test } from './support/banc';
import { contenuCache } from './support/contenu-visible';
import { adresse, ouvertSousLEntete } from './support/lecture';
import {
  demarree,
  navigationVisible,
  retenirLeDocument,
  sansApplication,
  signalees,
} from './support/page-a-part';

// La page introuvable (TK-31, EC-11, SC-2.0-07, SC-2.0-08), servie en 404 par le serveur local
// avec le 404.html le plus proche, dans les six profils, sous la surveillance de banc.ts : aucune
// erreur de console, d'hydratation comprise. La variante affichée est celle du document servi,
// avant comme après le démarrage : « Voir la liste des projets » en plus pour un projet.

const PROJETS = 'Voir la liste des projets';
/** projets : le document servi doit être celui d'un projet ; undefined, il est relevé. */
const CAS = [
  { cas: 'une adresse inconnue', adresse: '/une-adresse-inconnue', projets: false },
  { cas: 'un projet inexistant', adresse: '/projets/identifiant-inconnu', projets: true },
  { cas: 'les projets sans identifiant', adresse: '/projets', projets: undefined },
  { cas: 'les projets, barre finale comprise', adresse: '/projets/', projets: undefined },
  { cas: 'une page de l’ancienne préversion', adresse: '/parcours', projets: false },
] as const;

const principale = (page: Page) => page.getByRole('main');
const accueil = (page: Page) => principale(page).getByRole('link', { name: 'Revenir à l’accueil' });

/** Le message, les retours de la variante, la navigation, la consigne, aucune entrée signalée. */
async function verifierLaPage(page: Page, projets: boolean): Promise<void> {
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Cette page n’existe pas');
  await expect(
    principale(page).getByText('L’adresse demandée ne correspond à aucune page du site.'),
  ).toBeVisible();
  await expect(accueil(page)).toHaveAttribute('href', '/');
  const liste = principale(page).getByRole('link', { name: PROJETS });
  await expect(liste).toHaveCount(projets ? 1 : 0);
  if (projets) await expect(liste).toHaveAttribute('href', '/#projets');
  await expect(page.locator('head meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  expect(await navigationVisible(page)).toBe(true);
  await expect(page.getByRole('contentinfo')).toBeVisible();
  expect(await signalees(page)).toBe(0);
}

for (const { cas, adresse: demandee, projets } of CAS) {
  test(`page introuvable : ${cas} (${demandee}), en 404, la variante du document servi, une fois démarrée`, async ({
    page,
    surveillance,
  }) => {
    surveillance.attendreReponseEnErreur(demandee, 404);
    await retenirLeDocument(page);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    const reponse = await page.goto(demandee);
    expect(reponse?.status(), `statut de ${demandee}`).toBe(404);
    const servie = (await reponse!.text()).includes(PROJETS);
    if (projets !== undefined) expect(servie, 'variante du document servi').toBe(projets);
    await demarree(page, 'app-erreur');
    await verifierLaPage(page, servie);
    // L'adresse demandée reste affichée ; le routeur ôte seulement la barre finale.
    expect(await adresse(page)).toBe(demandee.replace(/(.)\/$/, '$1'));
    expect(await contenuCache(page)).toEqual([]);
  });

  test(`page introuvable : ${cas} (${demandee}), avant le démarrage, la même page`, async ({
    page,
    surveillance,
  }) => {
    surveillance.attendreReponseEnErreur(demandee, 404);
    await sansApplication(page, surveillance);
    const reponse = await page.goto(demandee);
    expect(reponse?.status()).toBe(404);
    await verifierLaPage(page, (await reponse!.text()).includes(PROJETS));
  });
}

test('page introuvable : le message et le retour à l’accueil se lisent sans défilement', async ({
  page,
  surveillance,
}) => {
  surveillance.attendreReponseEnErreur(CAS[0].adresse, 404);
  await page.goto(CAS[0].adresse);
  await expect(page.getByRole('heading', { level: 1 })).toBeInViewport({ ratio: 1 });
  await expect(accueil(page)).toBeInViewport({ ratio: 1 });
});

test('page introuvable : « Revenir à l’accueil » ouvre la page principale en haut', async ({
  page,
  surveillance,
}) => {
  surveillance.attendreReponseEnErreur(CAS[0].adresse, 404);
  await retenirLeDocument(page);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(CAS[0].adresse);
  await demarree(page, 'app-erreur');
  await accueil(page).click();
  await expect.poll(() => adresse(page)).toBe('/');
  await expect(page.locator('#parcours')).toBeAttached();
  expect(await page.evaluate(() => scrollY)).toBe(0);
});

test('page introuvable : pour un projet inexistant, « Voir la liste des projets » mène à /#projets', async ({
  page,
  surveillance,
}) => {
  surveillance.attendreReponseEnErreur(CAS[1].adresse, 404);
  await retenirLeDocument(page);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(CAS[1].adresse);
  await demarree(page, 'app-erreur');
  await page.evaluate(() => Object.assign(window, { documentDuDepart: true }));
  await principale(page).getByRole('link', { name: PROJETS }).click();
  await expect.poll(() => adresse(page)).toBe('/#projets');
  await ouvertSousLEntete(page, 'projets');
  // Une navigation du routeur : le même document.
  expect(await page.evaluate(() => 'documentDuDepart' in window)).toBe(true);
});
