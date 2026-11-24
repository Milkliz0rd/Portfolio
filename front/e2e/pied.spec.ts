import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Page } from '@playwright/test';
import { expect, test, type Surveillance } from './support/banc';
import { contenuCache } from './support/contenu-visible';
import { ORIGINE, PAGES_ERREUR, pagesDuBuild } from './support/site';

// Le pied de page (TK-30, CO-08 ; SC-2.0-27, SC-2.0-29), dans les six profils, sous la
// surveillance de banc.ts, qui bloque toute requête hors du site : les liens des profils sont
// éprouvés par leurs attributs, sans être suivis. Sur la page principale, le contact, les mentions
// légales, une fiche et une adresse inconnue, une fois l'application démarrée, puis sans script
// (le pied du pré-rendu).

/** Les adresses des profils, lues dans le contenu (profil.json), jamais écrites ici. */
const { liens } = JSON.parse(
  readFileSync(join(__dirname, '..', 'src', 'contenu', 'fr', 'profil.json'), 'utf8'),
) as { liens: { github: string; linkedin: string } };
const PROFILS = [
  ['GitHub', liens.github],
  ['LinkedIn', liens.linkedin],
] as const;
// En test, origineSite vaut l'origine du serveur local (PF-07) : ORIGINE, que exigerBuildDeTest,
// appelé par pagesDuBuild, vérifie dans le build. La signature en porte le nom de domaine.
const DOMAINE = new URL(ORIGINE).hostname.replace(/^www\./, '');
const ADRESSE_INCONNUE = PAGES_ERREUR[0].adresse;
const PAGES = ['/', '/contact', '/mentions-legales', ficheDuBuild(), ADRESSE_INCONNUE];

const pied = (page: Page) =>
  page.getByRole('contentinfo', { name: 'Pied de page du site', exact: true });
const mentions = (page: Page) =>
  pied(page).getByRole('link', { name: 'Mentions légales', exact: true });
const hauteursDesLiens = (page: Page) =>
  pied(page)
    .getByRole('link')
    .evaluateAll((liens) => liens.map((lien) => lien.getBoundingClientRect().height));

/** La fiche d'un projet, la première du build. */
function ficheDuBuild(): string {
  const fiche = pagesDuBuild().find((page) => page.startsWith('/projets/'));
  if (!fiche) throw new Error('Aucune fiche de projet dans le build');
  return fiche;
}

async function ouvrir(page: Page, adresse: string, surveillance: Surveillance): Promise<void> {
  if (adresse === ADRESSE_INCONNUE) surveillance.attendreReponseEnErreur(adresse, 404);
  await page.goto(adresse);
}

/** Ce que porte le pied de toute page, avant comme après le démarrage de l'application. */
async function verifierPied(page: Page): Promise<void> {
  for (const [nom, cible] of PROFILS) {
    const lien = pied(page).getByRole('link', { name: `${nom} (nouvel onglet)`, exact: true });
    await expect(lien, `cible de ${nom}`).toHaveAttribute('href', cible);
    await expect(lien, `${nom} dans un nouvel onglet`).toHaveAttribute('target', '_blank');
    const rel = (await lien.getAttribute('rel'))?.split(' ').sort();
    expect(rel, `${nom} sans accès à la page d’origine`).toEqual(['noopener', 'noreferrer']);
  }
  // SC-2.0-27 : aucun lien vers X, ni dans le pied ni ailleurs sur la page.
  const hotes = await page
    .locator('a[href]')
    .evaluateAll((liens) =>
      liens.map((lien) => new URL((lien as HTMLAnchorElement).href).hostname),
    );
  expect(
    hotes.filter((hote) => /(^|\.)(x|twitter)\.com$/.test(hote)),
    'lien vers X',
  ).toEqual([]);
  await expect(mentions(page)).toHaveAttribute('href', '/mentions-legales');
  expect(await mentions(page).getAttribute('target'), 'mentions dans l’onglet courant').toBeNull();
  // La signature : le nom de domaine du site, sans année ni symbole de droit d'auteur (MF-18).
  await expect(pied(page).locator('.pied__signature')).toHaveText(DOMAINE);
  expect(await pied(page).textContent(), 'année ou symbole').not.toMatch(
    /\b(1[89]|2\d)\d{2}\b|\u00a9/,
  );
  const hauteurs = await hauteursDesLiens(page);
  expect(hauteurs).toHaveLength(3);
  expect(
    hauteurs.filter((hauteur) => hauteur < 44),
    'lien de moins de 44 px',
  ).toEqual([]);
}

for (const adresse of PAGES) {
  test(`pied : ${adresse}, les profils dans un nouvel onglet, aucun lien vers X, les mentions légales`, async ({
    page,
    surveillance,
  }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await ouvrir(page, adresse, surveillance);
    await expect(page.locator('html')).toHaveClass(/\bmv-pret\b/);
    await verifierPied(page);
    expect(await contenuCache(page), 'contenu caché').toEqual([]);
    // SC-2.0-29 : depuis toute page, le lien mène aux mentions légales.
    await mentions(page).click();
    await expect(page).toHaveURL(`${ORIGINE}/mentions-legales`);
  });
}

test.describe(() => {
  test.use({ javaScriptEnabled: false });

  for (const adresse of PAGES) {
    test(`pied : sans script, ${adresse} porte le même pied, pré-rendu`, async ({
      page,
      surveillance,
    }) => {
      await ouvrir(page, adresse, surveillance);
      await verifierPied(page);
    });
  }
});

test('pied : sur téléphone, la marque, les profils, la signature et les mentions l’un sous l’autre ; chaque rangée aux deux extrémités dès 600 px', async ({
  page,
}) => {
  await page.goto('/');
  const boites = () =>
    page
      .locator('.pied__marque, .pied__liens, .pied__signature, .pied__actions')
      .evaluateAll((elements) =>
        elements.map((element) => {
          const { top, bottom, left, right } = element.getBoundingClientRect();
          return { top, bottom, left, right };
        }),
      );
  for (const largeur of [320, 599]) {
    await page.setViewportSize({ width: largeur, height: 800 });
    const [marque, profils, signature, actions] = await boites();
    expect(profils.top, `${largeur} px : profils sous la marque`).toBeGreaterThanOrEqual(
      marque.bottom,
    );
    expect(signature.top, `${largeur} px : signature sous les profils`).toBeGreaterThanOrEqual(
      profils.bottom,
    );
    expect(actions.top, `${largeur} px : actions sous la signature`).toBeGreaterThanOrEqual(
      signature.bottom,
    );
    for (const boite of [profils, signature, actions])
      expect(boite.left).toBeCloseTo(marque.left, 0);
    const hauteurs = await hauteursDesLiens(page);
    expect(
      hauteurs.filter((hauteur) => hauteur < 44),
      `${largeur} px : moins de 44 px`,
    ).toEqual([]);
  }
  for (const largeur of [600, 1280]) {
    await page.setViewportSize({ width: largeur, height: 800 });
    const [marque, profils, signature, actions] = await boites();
    for (const [gauche, droite] of [
      [marque, profils],
      [signature, actions],
    ]) {
      expect(droite.top, `${largeur} px : une seule ligne`).toBeLessThan(gauche.bottom);
      expect(droite.left, `${largeur} px : à droite`).toBeGreaterThan(gauche.right);
    }
    expect(signature.left, `${largeur} px : bord gauche`).toBeCloseTo(marque.left, 0);
    expect(actions.right, `${largeur} px : bord droit`).toBeCloseTo(profils.right, 0);
  }
});

test('pied : sur une page courte, en bas de la fenêtre, sans défilement', async ({
  page,
  surveillance,
}) => {
  // La page de contact provisoire est plus courte que la fenêtre d'un téléphone.
  await page.setViewportSize({ width: 390, height: 844 });
  await ouvrir(page, '/contact', surveillance);
  const cadre = await pied(page).boundingBox();
  expect(Math.round((cadre?.y ?? 0) + (cadre?.height ?? 0))).toBe(844);
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(844);
});
