import type { Page } from '@playwright/test';
import { expect, test } from './support/banc';
import { contenuCache } from './support/contenu-visible';
import { adresse } from './support/lecture';
import {
  demarree,
  navigationVisible,
  retenirLeDocument,
  sansApplication,
  signalees,
} from './support/page-a-part';

// Les mentions légales (TK-31, EC-10, SC-2.0-05, SC-2.0-29), dans les six profils, sous la
// surveillance de banc.ts : aucune erreur de console, d'hydratation comprise. Le build de test y
// ajoute un contenu de test (e2e/support/mentions-legales-du-banc.json), dont le lien mène à
// /#competence, une ancre qui ne nomme rien (V-11, depuis une autre page).

const ADRESSE = '/mentions-legales';
const valeur = (page: Page, cle: string) =>
  page
    .locator('main .liste-cle-valeur__paire')
    .filter({ has: page.locator('dt', { hasText: cle }) });

/** Ce que les mentions légales donnent, l'application démarrée ou non. */
async function verifierLesMentions(page: Page): Promise<void> {
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Mentions légales');
  await expect(valeur(page, 'Éditeur').locator('dd')).toHaveText('Alexandre Morozoff');
  const contact = valeur(page, 'Contact').getByRole('link', { name: 'formulaire de contact' });
  await expect(contact).toHaveAttribute('href', '/contact');
  await expect(valeur(page, 'Hébergement des pages').locator('dd')).toContainText('Cloudflare');
  await expect(valeur(page, 'Hébergement du formulaire').locator('dd')).toContainText('Render');
  // Ni adresse ni téléphone personnels, ni adresse électronique.
  const texte = await page.getByRole('main').innerText();
  expect(texte).not.toMatch(/\d{2}[\s.]?\d{2}[\s.]?\d{2}[\s.]?\d{2}|@/);
  expect(texte).not.toMatch(/\b(rue|avenue|boulevard|impasse|allée)\b/i);
  // Le cadre commun : la navigation, le pied et son lien vers cette page ; aucune entrée signalée.
  expect(await navigationVisible(page)).toBe(true);
  const pied = page.getByRole('contentinfo');
  await expect(pied.getByRole('link', { name: 'Mentions légales' })).toHaveAttribute(
    'href',
    ADRESSE,
  );
  expect(await signalees(page)).toBe(0);
}

test('mentions légales : ouvertes directement puis rechargées, l’éditeur, le contact et les hébergeurs', async ({
  page,
}) => {
  await retenirLeDocument(page);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const ouvrir of [() => page.goto(ADRESSE), () => page.reload()]) {
    const reponse = await ouvrir();
    expect(reponse?.status(), `statut de ${ADRESSE}`).toBe(200);
    await demarree(page, 'app-mentions-legales');
    await verifierLesMentions(page);
    expect(await adresse(page)).toBe(ADRESSE);
    expect(await contenuCache(page)).toEqual([]);
  }
});

test('mentions légales : avant le démarrage, le même contenu, aucune entrée signalée', async ({
  page,
  surveillance,
}) => {
  await sansApplication(page, surveillance);
  const reponse = await page.goto(ADRESSE);
  expect(reponse?.status()).toBe(200);
  await verifierLesMentions(page);
});

test('mentions légales : vers /#competence, une ancre qui ne nomme rien, la page principale s’ouvre en haut, à /', async ({
  page,
}) => {
  await retenirLeDocument(page);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(ADRESSE);
  await demarree(page, 'app-mentions-legales');
  const lien = page.getByRole('main').locator('a[href="/#competence"]');
  await expect(lien).toHaveCount(1);
  // La page défile loin du haut et le reste d'une page à l'autre (html ne change pas) : arrivée
  // en haut, c'est le routeur qui l'y a mise. Le document est marqué : le même après le clic, la
  // navigation est celle du routeur, jamais une navigation native vers le fragment.
  await page.evaluate(() => {
    document.documentElement.style.setProperty('min-block-size', '800vh');
    scrollTo({ top: 2000, behavior: 'instant' });
    Object.assign(window, { documentDuDepart: true });
  });
  const etapes = await page.evaluate(() => history.length);
  await lien.dispatchEvent('click');
  await expect.poll(() => adresse(page)).toBe('/');
  await expect(page.locator('#parcours')).toBeAttached();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  expect(await page.evaluate(() => 'documentDuDepart' in window)).toBe(true);
  expect(await page.evaluate(() => history.length)).toBe(etapes + 1);
});
