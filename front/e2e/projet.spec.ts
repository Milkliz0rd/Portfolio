import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Page } from '@playwright/test';
import { expect, test } from './support/banc';
import { contenuCache } from './support/contenu-visible';
import { adresse, ouvertSousLEntete, positionsIntermediaires } from './support/lecture';
import { demarree, retenirLeDocument, sansApplication } from './support/page-a-part';
import { ORIGINE } from './support/site';

// La fiche d'un projet (TK-37, EC-07 ; SC-2.0-03, SC-2.0-05, SC-2.0-06, SC-2.0-16, SC-2.0-32), dans
// les six profils, sous la surveillance de banc.ts : aucune requête hors du site (le code source
// n'est pas suivi, ses attributs sont éprouvés), aucune erreur de console, image absente comprise.
// Le portfolio, lu dans son fichier de contenu, et le projet complet du contenu de test
// (e2e/support/projets-du-banc.json), dont la capture n'existe que dans le build de test.

interface ProjetLu {
  identifiant: string;
  titre: string;
  description: string[];
  captures: { fichier: string; alternatif: string; largeur: unknown; hauteur: unknown }[];
  lienCode?: string;
}
const lire = <T>(...chemin: string[]) =>
  JSON.parse(readFileSync(join(__dirname, ...chemin), 'utf8')) as T;
const PORTFOLIO = lire<ProjetLu>('..', 'src', 'contenu', 'fr', 'projets', 'portfolio.json');
const PROFIL = lire<{ liens: { github: string } }>('..', 'src', 'contenu', 'fr', 'profil.json');
const [BANC] = lire<ProjetLu[]>('support', 'projets-du-banc.json');
const fiche = ({ identifiant }: ProjetLu) => `/projets/${identifiant}`;
// Choix 1 de W22 : une capture encore en emplacement, par la marque du contrôle du contenu sur son
// fichier, ou par une dimension qui n'est pas un nombre, ne s'affiche pas.
const MARQUE = /\[(?:C-\d+[^\]]*|[^\][]*\s—\s[^\][]*)\]/;
const fournies = ({ captures }: ProjetLu) =>
  captures.filter(
    (c) =>
      !MARQUE.test(c.fichier) && typeof c.largeur === 'number' && typeof c.hauteur === 'number',
  );

const main = (page: Page) => page.getByRole('main');
const titre = (page: Page) => main(page).getByRole('heading', { level: 1 });
const code = (page: Page) =>
  main(page).getByRole('link', { name: 'Voir le code source (nouvel onglet)', exact: true });
const retour = (page: Page) =>
  main(page).getByRole('link', { name: 'Retour à la liste des projets', exact: true });
/** Les entrées signalées de l'en-tête, navigation complète et menu replié : libellé et valeur. */
const signalees = (page: Page) =>
  page
    .getByRole('banner')
    .locator('[aria-current]')
    .evaluateAll((liens) => [
      ...new Set(liens.map((l) => `${l.textContent?.trim()} ${l.getAttribute('aria-current')}`)),
    ]);
const paragraphes = (page: Page) =>
  main(page).locator('.projet__description > p').allTextContents();

/** Ce que la fiche du portfolio donne, l'application démarrée ou non. */
async function verifierLePortfolio(page: Page): Promise<void> {
  await expect(titre(page)).toHaveText(PORTFOLIO.titre);
  expect(await paragraphes(page)).toEqual(PORTFOLIO.description);
  await expect(retour(page)).toHaveAttribute('href', '/#projets');
  expect(await signalees(page)).toEqual(['Projets page']);
}

test('fiche : /projets/portfolio ouverte directement puis rechargée, son titre, « Projets » signalé', async ({
  page,
}) => {
  await retenirLeDocument(page);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const ouvrir of [() => page.goto(fiche(PORTFOLIO)), () => page.reload()]) {
    const reponse = await ouvrir();
    expect(reponse?.status()).toBe(200);
    // Sans passer par l'accueil : le document servi est la fiche, sans redirection.
    expect(reponse?.request().redirectedFrom()).toBeNull();
    await demarree(page, 'app-projet');
    await verifierLePortfolio(page);
    expect(await adresse(page)).toBe(fiche(PORTFOLIO));
    expect(await contenuCache(page)).toEqual([]);
  }
});

test('fiche : avant le démarrage, le même contenu, « Projets » signalé', async ({
  page,
  surveillance,
}) => {
  await sansApplication(page, surveillance);
  expect((await page.goto(fiche(PORTFOLIO)))?.status()).toBe(200);
  await verifierLePortfolio(page);
  await expect(code(page)).toHaveAttribute('target', '_blank');
});

test('fiche : les captures du portfolio encore en emplacement ne s’affichent pas, sans requête vers elles', async ({
  page,
}) => {
  const images: string[] = [];
  page.on('request', (requete) => {
    if (requete.resourceType() === 'image') images.push(requete.url());
  });
  await page.goto(fiche(PORTFOLIO));
  await expect(page.locator('html')).toHaveClass(/\bmv-pret\b/);
  await page.evaluate(() => scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
  const attendues = fournies(PORTFOLIO);
  await expect(main(page).locator('app-fenetre img')).toHaveCount(attendues.length);
  if (attendues.length === 0) {
    await expect(main(page).locator('h2, ul, app-fenetre, figure, img')).toHaveCount(0);
  }
  const texte = await main(page).innerText();
  for (const { fichier, alternatif } of PORTFOLIO.captures.filter((c) => !attendues.includes(c))) {
    expect(texte).not.toContain(fichier);
    expect(texte).not.toContain(alternatif);
  }
  const servies = attendues.map(({ fichier }) => `${ORIGINE}/images/projets/portfolio/${fichier}`);
  for (const image of images.filter((i) => i.includes('/images/projets/'))) {
    expect(servies).toContain(image);
  }
});

test('fiche : le code source public du portfolio, en bouton primaire, dans un nouvel onglet', async ({
  page,
}) => {
  // Le code source public du portfolio : un dépôt du profil GitHub du contenu.
  expect(PORTFOLIO.lienCode?.startsWith(`${PROFIL.liens.github}/`)).toBe(true);
  await page.goto(fiche(PORTFOLIO));
  await expect(page.locator('html')).toHaveClass(/\bmv-pret\b/);
  await expect(code(page)).toBeVisible();
  await expect(code(page)).toHaveAttribute('href', PORTFOLIO.lienCode!);
  await expect(code(page)).toHaveAttribute('target', '_blank');
  const rel = (await code(page).getAttribute('rel'))?.split(' ').sort();
  expect(rel).toEqual(['noopener', 'noreferrer']);
  await expect(code(page)).toHaveClass(/\bbouton--primaire\b/);
});

test('fiche : le contact en un clic, par l’en-tête', async ({ page }) => {
  await page.goto(fiche(PORTFOLIO));
  await expect(page.locator('html')).toHaveClass(/\bmv-pret\b/);
  const contact = page.getByRole('banner').getByRole('link', { name: 'Contact', exact: true });
  await expect(contact).toBeVisible();
  await contact.click();
  await expect.poll(() => adresse(page)).toBe('/contact');
});

test('fiche : le retour, flèche avant le texte, mène d’un coup à /#projets, une étape d’historique de plus', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(fiche(PORTFOLIO));
  await expect(page.locator('html')).toHaveClass(/\bmv-pret\b/);
  // Choix C7 : la flèche gauche avant le texte, sur la même ligne.
  const fleche = (await retour(page).locator('app-icone').boundingBox())!;
  const libelle = (await retour(page).locator('span').boundingBox())!;
  expect(fleche.x + fleche.width).toBeLessThanOrEqual(libelle.x);
  expect(Math.abs(fleche.y + fleche.height / 2 - (libelle.y + libelle.height / 2))).toBeLessThan(4);
  // Le document est marqué : le même après le clic, la navigation est celle du routeur.
  await page.evaluate(() => Object.assign(window, { documentDuDepart: true }));
  const etapes = await page.evaluate(() => history.length);
  const intermediaires = await positionsIntermediaires(page, async () => {
    await retour(page).click();
    await expect.poll(() => adresse(page)).toBe('/#projets');
    await ouvertSousLEntete(page, 'projets');
  });
  expect(intermediaires, 'd’un coup').toEqual([]);
  expect(await page.evaluate(() => 'documentDuDepart' in window)).toBe(true);
  expect(await page.evaluate(() => history.length)).toBe(etapes + 1);
  await page.goBack();
  await expect.poll(() => adresse(page)).toBe(fiche(PORTFOLIO));
  await expect(titre(page)).toHaveText(PORTFOLIO.titre);
});

test('fiche : le projet complet du contenu de test, sa capture WebP servie à ses dimensions', async ({
  page,
}) => {
  const [capture] = BANC.captures;
  const source = `/images/projets/${BANC.identifiant}/${capture.fichier}`;
  const reponseImage = page.waitForResponse(`${ORIGINE}${source}`);
  expect((await page.goto(fiche(BANC)))?.status()).toBe(200);
  await expect(titre(page)).toHaveText(BANC.titre);
  // Dans l'ordre : titre, description, captures, code source, retour.
  const blocs = [
    'h1',
    '.projet__description',
    '.projet__captures',
    '.projet__actions',
    '.projet__retour',
  ];
  const hauts = await Promise.all(
    blocs.map(async (bloc) => (await main(page).locator(bloc).boundingBox())!.y),
  );
  expect(hauts).toEqual([...hauts].sort((a, b) => a - b));
  const image = main(page).getByRole('img', { name: capture.alternatif, exact: true });
  await expect(image).toHaveAttribute('src', source);
  await expect(image).toHaveAttribute('loading', 'lazy');
  await expect(image).toHaveAttribute('width', String(capture.largeur));
  await expect(image).toHaveAttribute('height', String(capture.hauteur));
  await image.scrollIntoViewIfNeeded();
  const servie = await reponseImage;
  expect([servie.status(), servie.headers()['content-type']]).toEqual([200, 'image/webp']);
  const naturelles = () =>
    image.evaluate((img: HTMLImageElement) => [img.complete, img.naturalWidth, img.naturalHeight]);
  await expect.poll(naturelles).toEqual([true, capture.largeur, capture.hauteur]);
  await expect(code(page)).toHaveAttribute('href', BANC.lienCode!);
});

test('fiche : aucun défilement horizontal, la capture dans la largeur de l’écran', async ({
  page,
}) => {
  for (const projet of [PORTFOLIO, BANC]) {
    for (const largeur of [320, 900, 2560]) {
      await page.setViewportSize({ width: largeur, height: 800 });
      await page.goto(fiche(projet));
      await expect(page.locator('html')).toHaveClass(/\bmv-pret\b/);
      const [defile, visible] = await page.evaluate(() => [
        document.documentElement.scrollWidth,
        document.documentElement.clientWidth,
      ]);
      expect(defile, `${fiche(projet)} à ${largeur} px`).toBeLessThanOrEqual(visible);
      for (const boite of await main(page)
        .locator('app-fenetre')
        .evaluateAll((fenetres) => fenetres.map((f) => f.getBoundingClientRect().right))) {
        expect(boite).toBeLessThanOrEqual(visible);
      }
    }
  }
});
