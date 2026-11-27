import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Page } from '@playwright/test';
import { expect, test } from './support/banc';
import { adresse, ouvertSousLEntete } from './support/lecture';
import { scriptPrincipal } from './support/site';

// La section Expérience (TK-36 ; SC-2.0-05, SC-2.0-14 ; EC-04 ; MF-11, MF-18), dans les six
// profils, sous la surveillance de banc.ts (aucune erreur de console, d'hydratation comprise). Les
// textes attendus sont lus dans experience.json, jamais écrits ici : le nom de l'entreprise, la
// période, les volets (leurs emplacements étiquetés tant que C-08 manque) et la mention.

interface Volet {
  cle: string;
  intitule: string;
  description: string[];
}
const CONTENU = join(__dirname, '..', 'src', 'contenu', 'fr', 'experience.json');
const experience = JSON.parse(readFileSync(CONTENU, 'utf8')) as {
  entreprise: string;
  periode: { debut: number; fin: number };
  volets: Volet[];
  mentionConfidentialite: string;
};
/** La période telle que formaterPeriode l'écrit entre deux années seules (PF-03). */
const PERIODE = `${experience.periode.debut}–${experience.periode.fin}`;
// Une date ou une durée relative, une formulation au présent (MF-18), comme le contrôle du contenu :
// « depuis » suivi d'une date seulement.
const RELATIF =
  /\b\d+\s*(ans?|mois|années?)\b|actuellement|en cours|depuis \d|il y a|en ce moment|aujourd[’']hui|cette année/i;
/** Tout ce que la section dit, dans l'ordre de lecture : le contenu et les libellés de la maquette. */
const TEXTES = [
  '03',
  'Expérience',
  'Expérience',
  'Alternance',
  experience.entreprise,
  'Période',
  PERIODE,
  'Le rôle, en trois volets',
  ...experience.volets.flatMap(({ intitule, description }, rang) => [
    `0${rang + 1}`,
    'Volet',
    intitule,
    ...description,
  ]),
  'Projets d’entreprise',
  experience.mentionConfidentialite,
];
const LARGEURS = [320, 599, 600, 1199, 1200, 1600, 2560];

const region = (page: Page) => page.getByRole('region', { name: 'Expérience', exact: true });
const volets = (page: Page) => page.locator('section#experience .experience__volets > li');

/**
 * Les textes, les faits et les boîtes de la section, pris par un sélecteur CSS en une seule
 * lecture : evaluateAll sur une région trouvée par son nom fait planter la page dans Firefox
 * (Playwright 1.65.1, constaté par parcours.spec.ts), et la page peut encore défiler entre deux.
 */
function lireSection(page: Page) {
  return page.locator('section#experience').evaluate((section) => {
    const textes: string[] = [];
    const parcours = document.createTreeWalker(section, NodeFilter.SHOW_TEXT);
    for (let noeud = parcours.nextNode(); noeud; noeud = parcours.nextNode()) {
      const morceau = noeud.textContent?.trim();
      if (morceau) textes.push(morceau);
    }
    const lire = (selecteur: string) =>
      [...section.querySelectorAll(selecteur)].map((e) => e.textContent?.trim());
    const boite = (element: Element | null) => {
      const { left, top, right, bottom } = element!.getBoundingClientRect();
      return { x: left, y: top, droite: right, bas: bottom };
    };
    const visible = document.documentElement.clientWidth;
    return {
      textes,
      cles: lire('app-liste-cle-valeur dt'),
      valeurs: lire('app-liste-cle-valeur dd'),
      policePeriode: getComputedStyle(section.querySelector('dd.liste-cle-valeur__valeur--date')!)
        .fontFamily,
      policeMono: getComputedStyle(document.documentElement).getPropertyValue('--police-mono'),
      titre: boite(section.querySelector('h2')),
      liste: boite(section.querySelector('app-liste-cle-valeur')),
      ambiance: boite(section.querySelector('app-ambiance')),
      cartes: [...section.querySelectorAll('app-carte')].map(boite),
      // Les calques de l'ambiance débordent de l'ouverture par dessin, qui les rogne.
      hors: [section, ...section.querySelectorAll('*:not(.ambiance__calque)')]
        .filter((element) => {
          const { left, right, width } = element.getBoundingClientRect();
          return width > 0 && (left < -0.5 || right > visible + 0.5);
        })
        .map((element) => `${element.localName}.${element.className}`),
      contenu: document.documentElement.scrollWidth,
      visible,
    };
  });
}

test('expérience : le rôle en trois volets, l’alternance datée, sans rien nommer d’autre que le contenu (SC-2.0-14)', async ({
  page,
}) => {
  await page.goto('/#experience');
  // La section est l'élément section#experience de la page, nommée par son seul titre, de niveau 2.
  const zone = region(page);
  await expect(zone).toHaveAttribute('id', 'experience');
  await expect(page.locator('app-principale > section#experience > app-experience')).toHaveCount(1);
  await expect(zone.getByRole('heading', { level: 2 })).toHaveText('Expérience');
  await expect(zone.locator('.etiquette--numerotee').first()).toHaveText(/^\s*03\s*Expérience\s*$/);
  // Trois volets, application, backend, appui DevOps, chacun visible avec son texte.
  expect(experience.volets.map(({ cle }) => cle)).toEqual([
    'application',
    'backend',
    'appui-devops',
  ]);
  await expect(volets(page)).toHaveCount(3);
  for (const [rang, { intitule, description }] of experience.volets.entries()) {
    const volet = volets(page).nth(rang);
    await expect(volet).toBeVisible();
    await expect(volet.getByRole('heading', { level: 4 })).toHaveText(intitule);
    await expect(volet.locator('p')).toHaveText(description);
  }
  // L'alternance, une période datée : l'entreprise et la période du contenu, en chasse fixe.
  const lu = await lireSection(page);
  expect(lu.cles).toEqual(['Alternance', 'Période']);
  expect(lu.valeurs).toEqual([experience.entreprise, PERIODE]);
  const mono = lu.policeMono.split(',')[0].replace(/["']/g, '').trim();
  expect(mono).not.toBe('');
  expect(lu.policePeriode).toContain(mono);
  // La mention, dans un message d'information, sous les volets.
  const mention = zone.getByRole('status');
  await expect(mention).toContainText('Projets d’entreprise');
  await expect(mention.getByText(experience.mentionConfidentialite, { exact: true })).toBeVisible();
  // Rien d'autre que le contenu et ses libellés : aucun projet, client, outil, dépôt ni collègue ;
  // aucun lien, aucune fenêtre, rien au présent.
  expect(lu.textes).toEqual(TEXTES);
  await expect(zone.getByRole('link')).toHaveCount(0);
  await expect(zone.locator('app-fenetre')).toHaveCount(0);
  expect(await zone.innerText()).not.toMatch(RELATIF);
});

test('expérience : /#experience ouvert directement, puis rechargé, s’ouvre sur la section, sous l’en-tête (SC-2.0-05)', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const moment of ['à l’ouverture', 'au rechargement']) {
    await (moment === 'à l’ouverture' ? page.goto('/#experience') : page.reload());
    // L'application a démarré : la section est celle qu'elle a rendue, pas seulement le pré-rendu.
    await expect(page.locator('html'), moment).toHaveClass(/\bmv-pret\b/);
    await ouvertSousLEntete(page, 'experience');
    await expect.poll(() => adresse(page), { message: moment }).toBe('/#experience');
    await expect(region(page).getByRole('heading', { level: 2 }), moment).toBeInViewport();
    await expect(volets(page), moment).toHaveCount(3);
  }
});

test('expérience : avant le démarrage, /#experience ouvert puis rechargé, la section pré-rendue sous l’en-tête', async ({
  page,
  surveillance,
}) => {
  // Le script principal bloqué : la page reste le document pré-rendu, sans application.
  const principal = scriptPrincipal();
  await page.route(principal, (route) => route.abort());
  for (const moment of ['à l’ouverture', 'au rechargement']) {
    surveillance.attendreRequeteAbandonnee(principal);
    await (moment === 'à l’ouverture' ? page.goto('/#experience') : page.reload());
    await ouvertSousLEntete(page, 'experience');
    expect(await adresse(page), moment).toBe('/#experience');
    await expect(region(page).getByRole('heading', { level: 2 }), moment).toBeInViewport();
    expect((await lireSection(page)).valeurs, moment).toEqual([experience.entreprise, PERIODE]);
    await expect(volets(page), moment).toHaveCount(3);
    await expect(page.locator('html'), moment).not.toHaveClass(/\bmv-pret\b/);
  }
});

test('expérience : de 320 à 2560 px, rien ne déborde ; la liste sous le titre, les cartes hors du halo, l’une sous l’autre sous 600 px, côte à côte dès 1200 px', async ({
  page,
}) => {
  await page.goto('/#experience');
  await expect(volets(page)).toHaveCount(3);
  for (const largeur of LARGEURS) {
    await page.setViewportSize({ width: largeur, height: 800 });
    const { hors, contenu, visible, titre, liste, ambiance, cartes } = await lireSection(page);
    expect(hors, `hors de la fenêtre à ${largeur} px`).toEqual([]);
    expect(contenu, `défilement horizontal à ${largeur} px`).toBeLessThanOrEqual(visible);
    expect(liste.y, `${largeur} px`).toBeGreaterThanOrEqual(titre.bas);
    expect(liste.bas, `${largeur} px`).toBeLessThanOrEqual(ambiance.bas);
    for (const [rang, carte] of cartes.entries()) {
      expect(carte.y, `${largeur} px`).toBeGreaterThanOrEqual(ambiance.bas);
      if (rang === 0) continue;
      const avant = cartes[rang - 1];
      if (largeur < 600) {
        expect(carte.y, `${largeur} px`).toBeGreaterThanOrEqual(avant.bas);
      } else if (largeur >= 1200) {
        expect(carte.y, `${largeur} px`).toBeCloseTo(avant.y, 0);
        expect(carte.x, `${largeur} px`).toBeGreaterThanOrEqual(avant.droite);
      }
    }
  }
});
