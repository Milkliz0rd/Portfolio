import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Locator, Page } from '@playwright/test';
import { expect, test } from './support/banc';
import { adresse, ouvertSousLEntete } from './support/lecture';
import { scriptPrincipal } from './support/site';

// La section Parcours (TK-34 ; SC-2.0-05, SC-2.0-10, SC-2.0-11 ; MF-07, MF-08, MF-18), dans les
// six profils, sous la surveillance de banc.ts (aucune erreur de console, d'hydratation comprise).
// Les textes et les dates attendus sont lus dans parcours.json, jamais écrits ici : tant que C-01,
// C-09 et C-10 manquent, ce sont leurs emplacements étiquetés, que la section montre tels quels.

type DateParcours = string | { annee: number | string; mois?: number | string };
interface Etape {
  type: string;
  intitule: string;
  etablissement?: string;
  debut: DateParcours;
  fin: DateParcours;
  etat: string;
}
const CONTENU = join(__dirname, '..', 'src', 'contenu', 'fr', 'parcours.json');
const parcours = JSON.parse(readFileSync(CONTENU, 'utf8')) as {
  introduction: string;
  orientation: string[];
  etapes: Etape[];
};
/** Les étapes dans l'ordre que la section doit montrer, quel que soit celui du fichier (MF-07). */
const ETAPES = ['reconversion', 'bac+3', 'master'].map((type) => {
  const etape = parcours.etapes.find((candidate) => candidate.type === type);
  if (!etape) throw new Error(`parcours.json sans étape « ${type} »`);
  return etape;
});

/** Une date du contenu telle que la frise l'écrit en français (PF-03) ; l'emplacement tel quel. */
function date(valeur: DateParcours): string {
  if (typeof valeur === 'string') return valeur;
  const { annee, mois } = valeur;
  return mois === undefined ? `${annee}` : `${String(mois).padStart(2, '0')}/${annee}`;
}
const echapper = (texte: string) => texte.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** La période d'une étape : son début puis sa fin, tels que le contenu les donne, et un tiret. */
const periode = ({ debut, fin }: Etape) =>
  new RegExp(`^${echapper(date(debut))}\\s?–\\s?${echapper(date(fin))}$`);
// Une date ou une durée relative (SC-2.0-10, MF-18) ; « depuis la restauration » n'en est pas une.
const RELATIF =
  /\b\d+\s*(ans?|mois|années?)\b|actuellement|en cours|depuis \d|il y a|en ce moment|aujourd[’']hui|cette année/i;
const LARGEURS = [320, 600, 899, 900, 1200, 1600, 2560];

const region = (page: Page) => page.getByRole('region', { name: 'Parcours', exact: true });
const frise = (page: Page) => region(page).getByRole('list', { name: 'Étapes du parcours' });
const etapes = (page: Page) => frise(page).getByRole('listitem');

/**
 * Chaque étape affichée : sa période exacte (espaces insécables comprises), son intitulé, son
 * détail. Les étapes sont prises dans section#parcours par un sélecteur CSS : evaluateAll sur une
 * région trouvée par son nom fait planter la page dans Firefox (Playwright 1.65.1, constaté).
 */
function lireEtapes(page: Page) {
  return page.locator('section#parcours app-frise li').evaluateAll((items) =>
    items.map((item) => {
      // Le texte visible : sans le texte masqué qui annonce l'étape mise en avant, retiré du texte
      // lu, sans toucher au document.
      const visible = (selecteur: string) => {
        const element = item.querySelector(selecteur);
        const masque = element?.querySelector('.masque-visuellement')?.textContent ?? '';
        return element?.textContent?.replace(masque, '').replace(/\s+/g, ' ').trim();
      };
      return {
        periode: item.querySelector('.frise__periode')?.textContent,
        intitule: visible('.frise__intitule'),
        detail: visible('.frise__detail'),
      };
    }),
  );
}

/**
 * La boîte de l'élément dans le document, en une seule lecture : la page peut encore défiler vers
 * l'ancre entre deux mesures, et une boîte prise dans la fenêtre bougerait avec elle.
 */
function boite(element: Locator) {
  return element.evaluate((cible) => {
    const { left, top, width, height } = cible.getBoundingClientRect();
    return { x: left + scrollX, y: top + scrollY, width, height };
  });
}

test('parcours : les trois étapes dans l’ordre reconversion, bac+3, master, chacune datée par le contenu (SC-2.0-10)', async ({
  page,
}) => {
  await page.goto('/#parcours');
  await expect(etapes(page)).toHaveCount(3);
  for (const etape of await etapes(page).all()) await expect(etape).toBeVisible();
  const lues = await lireEtapes(page);
  expect(lues.map(({ intitule }) => intitule)).toEqual(ETAPES.map(({ intitule }) => intitule));
  expect(lues[0].intitule).toMatch(/reconversion/i);
  expect(lues[2].intitule).toMatch(/master/i);
  // Aucune date inventée ni laissée vide : un début et une fin, exactement ceux du contenu.
  ETAPES.forEach((etape, rang) => {
    expect(date(etape.debut).trim(), `début de ${etape.type}`).not.toBe('');
    expect(date(etape.fin).trim(), `fin de ${etape.type}`).not.toBe('');
    expect(lues[rang].periode, etape.type).toMatch(periode(etape));
  });
  // Le bac+3 : son intitulé, puis son établissement en détail ; les autres sans détail.
  expect(ETAPES[1].etablissement?.trim()).toBeTruthy();
  expect(
    lues.map(({ detail }) => detail?.includes(ETAPES[1].etablissement ?? '') ?? false),
  ).toEqual([false, true, false]);
  expect(await region(page).innerText()).not.toMatch(RELATIF);
});

test('parcours : l’en-tête 01, le titre, l’introduction, puis l’orientation qui cite le master, avant la frise (SC-2.0-11)', async ({
  page,
}) => {
  await page.goto('/#parcours');
  // La section est l'élément section#parcours de la page, nommé par son seul titre, de niveau 2.
  const zone = region(page);
  await expect(zone).toHaveAttribute('id', 'parcours');
  await expect(zone.getByRole('heading')).toHaveCount(1);
  const titre = zone.getByRole('heading', { level: 2, name: 'Parcours', exact: true });
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  const etiquette = zone.locator('.etiquette--numerotee');
  await expect(etiquette).toHaveText(/^\s*01\s*Parcours\s*$/);
  // Dans l'ordre de lecture, de haut en bas : chacun sous le précédent.
  const lus = [
    etiquette,
    titre,
    zone.getByText(parcours.introduction, { exact: true }),
    zone.getByText('Orientation', { exact: true }),
    ...parcours.orientation.map((paragraphe) => zone.getByText(paragraphe, { exact: true })),
    frise(page),
  ];
  let bas = -Infinity;
  for (const element of lus) {
    await expect(element).toBeVisible();
    const { y, height } = await boite(element);
    expect(y, element.toString()).toBeGreaterThanOrEqual(bas);
    bas = y + height;
  }
  // L'orientation vers l'architecture logicielle cite le master, l'une des étapes de la frise.
  const orientation = parcours.orientation.join(' ');
  expect(orientation).toMatch(/architecture/i);
  expect(orientation).toMatch(/master/i);
  await expect(etapes(page).nth(2)).toContainText(ETAPES[2].intitule);
  if (ETAPES[2].etat === 'mise-en-avant') {
    await expect(etapes(page).nth(2)).toContainText('(étape mise en avant)');
  }
});

test('parcours : /#parcours ouvert directement, puis rechargé, s’ouvre sur la section, sous l’en-tête (SC-2.0-05)', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const moment of ['à l’ouverture', 'au rechargement']) {
    await (moment === 'à l’ouverture' ? page.goto('/#parcours') : page.reload());
    // L'application a démarré : la section est celle qu'elle a rendue, pas seulement le pré-rendu.
    await expect(page.locator('html'), moment).toHaveClass(/\bmv-pret\b/);
    await ouvertSousLEntete(page, 'parcours');
    await expect.poll(() => adresse(page), { message: moment }).toBe('/#parcours');
    await expect(region(page).getByRole('heading', { level: 2 }), moment).toBeInViewport();
    await expect(etapes(page), moment).toHaveCount(3);
  }
});

test('parcours : avant le démarrage, /#parcours ouvert puis rechargé, la section pré-rendue sous l’en-tête', async ({
  page,
  surveillance,
}) => {
  // Le script principal bloqué : la page reste le document pré-rendu, sans application.
  const principal = scriptPrincipal();
  await page.route(principal, (route) => route.abort());
  for (const moment of ['à l’ouverture', 'au rechargement']) {
    surveillance.attendreRequeteAbandonnee(principal);
    await (moment === 'à l’ouverture' ? page.goto('/#parcours') : page.reload());
    await ouvertSousLEntete(page, 'parcours');
    expect(await adresse(page), moment).toBe('/#parcours');
    await expect(region(page).getByRole('heading', { level: 2 }), moment).toBeInViewport();
    await expect(frise(page).locator('.frise__periode'), moment).toHaveText(ETAPES.map(periode));
    await expect(page.locator('html'), moment).not.toHaveClass(/\bmv-pret\b/);
  }
});

test('parcours : de 320 à 2560 px, rien ne déborde ; les étapes l’une sous l’autre sous 900 px, côte à côte au-delà, la période en tête', async ({
  page,
}) => {
  await page.goto('/#parcours');
  // Les trois étapes sont bien dans la section : sans elles, les mesures ne porteraient sur rien.
  await expect(etapes(page)).toHaveCount(3);
  for (const largeur of LARGEURS) {
    await page.setViewportSize({ width: largeur, height: 800 });
    const { contenu, visible, hors } = await page
      .locator('section#parcours')
      .evaluate((section) => {
        const visible = document.documentElement.clientWidth;
        const hors = [section, ...section.querySelectorAll('*')]
          .filter((element) => {
            const { left, right, width } = element.getBoundingClientRect();
            return width > 0 && (left < -0.5 || right > visible + 0.5);
          })
          .map((element) => `${element.localName}.${element.className}`);
        return { contenu: document.documentElement.scrollWidth, visible, hors };
      });
    expect(hors, `hors de la fenêtre à ${largeur} px`).toEqual([]);
    expect(contenu, `défilement horizontal à ${largeur} px`).toBeLessThanOrEqual(visible);
    const boites = await Promise.all((await etapes(page).all()).map(boite));
    for (let rang = 1; rang < boites.length; rang++) {
      const [avant, apres] = [boites[rang - 1], boites[rang]];
      if (largeur < 900) {
        expect(apres.y, `${largeur} px`).toBeGreaterThanOrEqual(avant.y + avant.height);
      } else {
        expect(apres.y, `${largeur} px`).toBeCloseTo(avant.y, 0);
        expect(apres.x, `${largeur} px`).toBeGreaterThanOrEqual(avant.x + avant.width);
      }
    }
    for (const etape of await etapes(page).all()) {
      const [enTete, intitule] = [
        etape.locator('.frise__periode'),
        etape.locator('.frise__intitule'),
      ];
      expect((await boite(enTete)).y, `${largeur} px`).toBeLessThan((await boite(intitule)).y);
    }
  }
});
