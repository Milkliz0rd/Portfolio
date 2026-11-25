import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Locator, Page } from '@playwright/test';
import { expect, test } from './support/banc';
import { adresse, ouvertSousLEntete } from './support/lecture';

// La section Accueil (TK-33 ; SC-2.0-01, SC-2.0-02, SC-2.0-05 ; PF-05, PF-06), dans les six
// profils, sous la surveillance de banc.ts (aucune erreur de console, d'hydratation comprise). Les
// textes attendus sont lus dans le contenu, jamais écrits ici : le nom et l'intitulé (profil.json),
// la présentation et les orientations (accueil.json), l'entreprise et la période de l'alternance
// (experience.json).

const CONTENU = join(__dirname, '..', 'src', 'contenu', 'fr');
const lire = <T>(fichier: string) => JSON.parse(readFileSync(join(CONTENU, fichier), 'utf8')) as T;
const profil = lire<{ nom: string; intitule: string }>('profil.json');
const accueil = lire<{ presentation: string[]; orientations: Record<string, string> }>(
  'accueil.json',
);
const { entreprise, periode } = lire<{
  entreprise: string;
  periode: { debut: number; fin: number };
}>('experience.json');
/** L'ouverture de la carte « Expérience », formée comme son libellé, années seules. */
const ALTERNANCE = `Alternance chez ${entreprise}, ${periode.debut}–${periode.fin}.`;

const CARTES = [
  ['Parcours', 'parcours'],
  ['Compétences', 'competences'],
  ['Expérience', 'experience'],
  ['Méthode de travail', 'methode'],
  ['Projets', 'projets'],
] as const;
const LARGEURS = [320, 600, 900, 1200, 1600, 2560];

// L'arbre d'accessibilité de l'accueil, nœud pour nœud (deep-equal : aucun nœud de plus, à aucun
// niveau) : les deux régions, nommées par leur titre, sans rien de la fenêtre « profil.ts ». Les
// textes du contenu y entrent entre guillemets (JSON est du YAML valide).
const texte = (valeur: string) => JSON.stringify(valeur);
const INSTANTANE = [
  '- /children: deep-equal',
  `- region ${texte(profil.nom)}:`,
  '  - text: Portfolio',
  `  - heading ${texte(profil.nom)} [level=1]`,
  `  - paragraph: ${texte(profil.intitule)}`,
  ...accueil.presentation.map((paragraphe) => `  - paragraph: ${texte(paragraphe)}`),
  '  - link "Écrire un message":',
  '    - /url: /contact',
  '- region "Parcourir le profil":',
  '  - text: Sections',
  '  - heading "Parcourir le profil" [level=2]',
  '  - list:',
  ...CARTES.flatMap(([nom, id], rang) => [
    '    - listitem:',
    `      - text: 0${rang + 1} Section`,
    `      - heading ${texte(nom)} [level=3]:`,
    `        - link ${texte(nom)}:`,
    `          - /url: /#${id}`,
    ...(id === 'experience' ? [`      - strong: ${texte(ALTERNANCE)}`] : []),
    `      - text: ${texte(accueil.orientations[id])}`,
  ]),
].join('\n');

const cartes = (page: Page) => page.locator('app-cartes-sections');
const carte = (page: Page, titre: string) =>
  cartes(page).getByRole('link', { name: titre, exact: true });
const contact = (page: Page) =>
  page.locator('app-accueil').getByRole('link', { name: 'Écrire un message' });
const historique = (page: Page) => page.evaluate(() => history.length);

/** La boîte de l'élément dans la fenêtre ; une erreur claire s'il n'est pas affiché. */
async function boite(element: Locator) {
  const cadre = await element.boundingBox();
  if (!cadre) throw new Error(`${element.toString()} sans boîte`);
  return cadre;
}

/** Ouvre la page principale, animations permises, et attend que l'application ait démarré. */
async function ouvrir(page: Page): Promise<void> {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/\bmv-pret\b/);
}

test('accueil : à l’arrivée, le nom, l’intitulé, la présentation et une carte par section', async ({
  page,
}) => {
  await page.goto('/');
  const titre = page.getByRole('heading', { level: 1 });
  await expect(titre).toHaveCount(1);
  await expect(titre).toHaveText(profil.nom);
  await expect(titre).toBeInViewport();
  const ouverture = page.getByRole('region', { name: profil.nom });
  await expect(ouverture.getByText(profil.intitule, { exact: true })).toBeVisible();
  for (const paragraphe of accueil.presentation) {
    await expect(ouverture.getByText(paragraphe, { exact: true })).toBeVisible();
  }
  for (const [nom] of CARTES) {
    await expect(carte(page, nom)).toBeVisible();
  }
  await expect(cartes(page).getByText(ALTERNANCE, { exact: true })).toBeVisible();
  expect(await page.locator('main').innerText()).not.toMatch(/\b\d+\s*ans\b/i);
});

test('accueil : « Écrire un message », seul bouton mis en avant, mène au contact en un clic', async ({
  page,
}) => {
  await ouvrir(page);
  await expect(contact(page)).toBeInViewport();
  await expect(page.locator('app-accueil .bouton--primaire')).toHaveCount(1);
  const etapes = await historique(page);
  await contact(page).click();
  await expect.poll(() => adresse(page)).toBe('/contact');
  expect(await historique(page)).toBe(etapes + 1);
});

test('accueil : chaque carte défile jusqu’à sa section, sous l’en-tête, sans étape d’historique', async ({
  page,
}) => {
  await ouvrir(page);
  const etapes = await historique(page);
  for (const [nom, id] of CARTES) {
    await carte(page, nom).click();
    await ouvertSousLEntete(page, id);
    await expect.poll(() => adresse(page)).toBe(`/#${id}`);
  }
  expect(await historique(page)).toBe(etapes);
});

test('accueil : / ouvert directement, puis rechargé, s’ouvre en haut sur l’accueil', async ({
  page,
}) => {
  await ouvrir(page);
  for (const moment of ['à l’ouverture', 'au rechargement']) {
    if (moment === 'au rechargement') {
      await page.reload();
      await expect(page.locator('html')).toHaveClass(/\bmv-pret\b/);
    }
    await expect(page.getByRole('heading', { level: 1 }), moment).toBeInViewport();
    expect(await page.evaluate(() => scrollY), moment).toBe(0);
    expect(await adresse(page), moment).toBe('/');
    const signales = await page
      .getByRole('banner')
      .locator('[aria-current]')
      .evaluateAll((liens) =>
        liens.map((l) => [l.textContent?.trim(), l.getAttribute('aria-current')]),
      );
    expect(new Set(signales.map((s) => s.join(' '))), moment).toEqual(
      new Set(['Accueil location']),
    );
  }
});

test('accueil : l’arbre d’accessibilité, un seul titre de niveau 1, rien de « profil.ts »', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  // La fenêtre est affichée, et pourtant absente de l'arbre.
  await expect(page.locator('app-profil-code')).toBeVisible();
  await expect(page.locator('app-accueil')).toMatchAriaSnapshot(INSTANTANE);
  expect(await page.locator('body').ariaSnapshot()).not.toMatch(/profil\.ts|export const|as const/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
});

test('accueil : la fenêtre absente sous 600 px, sous le texte jusqu’à 1199 px, à côté dès 1200 px', async ({
  page,
}) => {
  await page.goto('/');
  const [colonne, fenetre] = [page.locator('.accueil__texte'), page.locator('app-profil-code')];
  await page.setViewportSize({ width: 599, height: 800 });
  await expect(fenetre).toHaveCSS('display', 'none');
  for (const largeur of [600, 1199]) {
    await page.setViewportSize({ width: largeur, height: 800 });
    const [t, f] = [await boite(colonne), await boite(fenetre)];
    expect(f.y, `${largeur} px`).toBeGreaterThanOrEqual(t.y + t.height);
  }
  await page.setViewportSize({ width: 1200, height: 800 });
  const [t, f] = [await boite(colonne), await boite(fenetre)];
  expect(f.x).toBeGreaterThanOrEqual(t.x + t.width);
  expect(f.y).toBeLessThan(t.y + t.height);
});

test('accueil : les cartes hors de l’ambiance et de ses halos, et nul défilement horizontal', async ({
  page,
}) => {
  await page.goto('/');
  for (const largeur of LARGEURS) {
    await page.setViewportSize({ width: largeur, height: 800 });
    const ambiance = await boite(page.locator('app-ambiance'));
    for (const element of await cartes(page).locator('app-carte').all()) {
      expect((await boite(element)).y, `${largeur} px`).toBeGreaterThanOrEqual(
        ambiance.y + ambiance.height,
      );
    }
    const { contenu, visible } = await page.evaluate(() => ({
      contenu: document.documentElement.scrollWidth,
      visible: document.documentElement.clientWidth,
    }));
    expect(contenu, `défilement horizontal à ${largeur} px`).toBeLessThanOrEqual(visible);
  }
});

test.describe(() => {
  test.use({ javaScriptEnabled: false });

  test('accueil : sans script, chaque carte mène à sa section, le bouton au contact', async ({
    page,
  }) => {
    await page.goto('/');
    for (const [nom, id] of CARTES) {
      await expect(carte(page, nom)).toHaveAttribute('href', `/#${id}`);
    }
    await expect(contact(page)).toHaveAttribute('href', '/contact');
    await carte(page, 'Méthode de travail').click();
    await ouvertSousLEntete(page, 'methode');
  });
});
