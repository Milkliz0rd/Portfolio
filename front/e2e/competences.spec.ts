import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Page } from '@playwright/test';
import { expect, test, type Surveillance } from './support/banc';
import { adresse, ouvertSousLEntete } from './support/lecture';
import { DOSSIER_BUILD, lireFichier, scriptPrincipal } from './support/site';

// La section Compétences (TK-35 ; SC-2.0-12, SC-2.0-13, SC-2.0-05 ; EC-03), dans les six profils,
// sous la surveillance de banc.ts (aucune erreur de console, d'hydratation comprise). Les textes
// attendus sont lus dans le contenu, jamais écrits ici : competences.json, et le contenu de test
// du banc, une catégorie sans compétence que le build de test ajoute aux catégories avant leur
// lecture (e2e/support/competences-du-banc.json, outils/ecrire-configuration.mjs).

interface Competence {
  libelle: string;
  rang: number;
}
interface Categorie extends Competence {
  competences: Competence[];
}
const lire = <T>(...chemin: string[]) =>
  JSON.parse(readFileSync(join(__dirname, ...chemin), 'utf8')) as T;
const contenu = lire<{
  techniques: Categorie[];
  humaines: { competences: Competence[]; recit: string[] };
}>('..', 'src', 'contenu', 'fr', 'competences.json');
const banc = lire<Categorie[]>('support', 'competences-du-banc.json');

const parRang = <T extends Competence>(liste: T[]) => [...liste].sort((a, b) => a.rang - b.rang);
const libelles = (liste: Competence[]) => parRang(liste).map(({ libelle }) => libelle);
/** Les catégories attendues, par rang : celles du contenu qui ont au moins une compétence. */
const CATEGORIES = parRang(contenu.techniques)
  .filter(({ competences }) => competences.length > 0)
  .map(({ libelle, competences }) => ({ libelle, competences: libelles(competences) }));
const HUMAINES = libelles(contenu.humaines.competences);
const VIDES = banc.filter(({ competences }) => competences.length === 0).map((c) => c.libelle);
const LARGEURS = [320, 600, 900, 1200, 1600, 2560];

const section = (page: Page) => page.locator('section#competences');
const categories = (page: Page) => section(page).locator('.competences__categories > li');
const humaines = (page: Page) => section(page).locator('.competences__humaines');
const titre = (page: Page) => section(page).getByRole('heading', { level: 2 });

/**
 * Les boîtes d'éléments de la section, prises ensemble dans la page, en une fois : l'application
 * peut encore faire défiler la page vers l'ancre entre deux mesures séparées.
 */
function boites(page: Page, ...selecteurs: string[]) {
  return page.evaluate(
    (liste) =>
      liste.map((selecteur) => {
        const element = document.querySelector(`#competences ${selecteur}`);
        if (!element) throw new Error(`${selecteur} absent de la section`);
        const { x, y, width, height } = element.getBoundingClientRect();
        return { x, y, droite: x + width, bas: y + height, hauteur: height };
      }),
    selecteurs,
  );
}
const LISTE = '.competences__humaines > ul';
const RECIT = '.competences__humaines > app-carte';

/**
 * Ouvre /#competences, puis la recharge : chaque fois, la section s'ouvre sous l'en-tête, entière.
 * Sans application, le script principal est bloqué à chaque chargement, et chaque abandon déclaré
 * avant lui (banc.ts n'excuse qu'un abandon par déclaration).
 */
async function ouvrirPuisRecharger(page: Page, sansApplication?: Surveillance): Promise<void> {
  const principal = scriptPrincipal();
  if (sansApplication) await page.route(principal, (route) => route.abort());
  for (const moment of ['à l’ouverture', 'au rechargement']) {
    sansApplication?.attendreRequeteAbandonnee(principal);
    await (moment === 'au rechargement' ? page.reload() : page.goto('/#competences'));
    if (!sansApplication) await expect(page.locator('html'), moment).toHaveClass(/\bmv-pret\b/);
    await ouvertSousLEntete(page, 'competences');
    expect(await adresse(page), moment).toBe('/#competences');
    await expect(titre(page), moment).toBeInViewport();
    await expect(categories(page), moment).toHaveCount(CATEGORIES.length);
  }
}

test('compétences : les catégories techniques du contenu par rang, chacune avec ses compétences par rang (SC-2.0-12)', async ({
  page,
}) => {
  await page.goto('/#competences');
  await expect(titre(page)).toHaveText('Compétences');
  await expect(section(page).locator('app-entete-section .etiquette__numero')).toHaveText('02');
  await expect(section(page).getByRole('heading', { level: 3 })).toHaveText([
    'Compétences techniques',
    'Compétences humaines',
  ]);
  await expect(categories(page)).toHaveCount(CATEGORIES.length);
  for (const [rang, { libelle, competences }] of CATEGORIES.entries()) {
    const carte = categories(page).nth(rang);
    await expect(carte.getByRole('heading', { level: 4 })).toHaveText(libelle);
    await expect(carte.getByRole('listitem')).toHaveText(competences);
  }
});

test('compétences : les compétences humaines en pastilles sous leur titre, sans carte, puis le récit (SC-2.0-13)', async ({
  page,
}) => {
  await page.goto('/#competences');
  const pastilles = humaines(page).locator(':scope > ul > li');
  await expect(pastilles).toHaveText(HUMAINES);
  await expect(humaines(page).locator('app-carte app-pastille')).toHaveCount(0);
  const recit = humaines(page).locator(':scope > app-carte');
  await expect(recit.getByRole('heading', { level: 4 })).toHaveText('Depuis la restauration');
  await expect(recit.locator('p')).toHaveText(contenu.humaines.recit);
  const [bloc, liste] = await boites(page, '.competences__bloc--humaines > h3', LISTE);
  expect(liste.y).toBeGreaterThanOrEqual(bloc.bas);
});

test('compétences : /#competences ouvert directement, puis rechargé, s’ouvre sous l’en-tête', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await ouvrirPuisRecharger(page);
});

test('compétences : avant le démarrage, /#competences ouvert puis rechargé s’ouvre sous l’en-tête', async ({
  page,
  surveillance,
}) => {
  await ouvrirPuisRecharger(page, surveillance);
});

test('compétences : la catégorie vide du banc, dans le build de test, n’est pas affichée', async ({
  page,
}) => {
  // Le build de test la porte bien : elle est écrite dans l'un de ses scripts.
  expect(VIDES).toHaveLength(1);
  const scripts = readdirSync(DOSSIER_BUILD).filter((fichier) => fichier.endsWith('.js'));
  expect(scripts.filter((fichier) => lireFichier(fichier).includes(VIDES[0]))).toHaveLength(1);
  await page.goto('/#competences');
  await expect(categories(page)).toHaveCount(CATEGORIES.length);
  await expect(section(page).getByText(VIDES[0])).toHaveCount(0);
  for (const carte of await categories(page).all()) {
    await expect(carte.locator('app-pastille').first()).toBeVisible();
  }
});

test('compétences : le récit sous les pastilles humaines jusqu’à 899 px, à leur droite dès 900 px', async ({
  page,
}) => {
  await page.goto('/#competences');
  await page.setViewportSize({ width: 899, height: 800 });
  let [liste, recit] = await boites(page, LISTE, RECIT);
  expect(recit.y).toBeGreaterThanOrEqual(liste.bas);
  await page.setViewportSize({ width: 900, height: 800 });
  [liste, recit] = await boites(page, LISTE, RECIT);
  expect(recit.x).toBeGreaterThanOrEqual(liste.droite);
  expect(Math.abs(recit.y - liste.y)).toBeLessThan(1);
});

test('compétences : aucun niveau, ni note, ni pourcentage, ni mesure', async ({ page }) => {
  await page.goto('/#competences');
  const mesures = 'progress, meter, [role="progressbar"], [role="meter"], [role="slider"]';
  await expect(section(page).locator(`${mesures}, [aria-valuenow]`)).toHaveCount(0);
  // Chaque élément d'une liste de compétences n'est que sa pastille, qui n'est que son libellé.
  const elements = section(page).locator('.competences__pastilles > li');
  await expect(elements).toHaveText([...CATEGORIES.flatMap((c) => c.competences), ...HUMAINES]);
  const enfants = await elements.evaluateAll((liste) =>
    liste.map((element) => [...element.children].map((enfant) => enfant.localName).join(' ')),
  );
  expect(new Set(enfants)).toEqual(new Set(['app-pastille']));
  expect(await section(page).textContent()).not.toMatch(/%|★/);
});

test('compétences : une compétence longue passe à la ligne, sans défilement horizontal de 320 à 2560 px', async ({
  page,
}) => {
  await page.goto('/#competences');
  const [longue, voisine] = [`${LISTE} > li:first-child`, `${LISTE} > li:nth-child(2)`];
  // Un seul mot, plus long que la ligne à toutes les largeurs, écrit dans la page.
  await section(page)
    .locator(`${longue} .pastille__mot`)
    .evaluate((mot) => {
      mot.textContent = 'interopérabilité'.repeat(8);
    });
  for (const largeur of LARGEURS) {
    await page.setViewportSize({ width: largeur, height: 800 });
    const [p, l, v] = await boites(
      page,
      `${longue} app-pastille`,
      LISTE,
      `${voisine} app-pastille`,
    );
    expect(p.droite, `${largeur} px`).toBeLessThanOrEqual(l.droite + 0.5);
    expect(p.hauteur, `${largeur} px`).toBeGreaterThan(v.hauteur);
    const { contenu, visible } = await page.evaluate(() => ({
      contenu: document.documentElement.scrollWidth,
      visible: document.documentElement.clientWidth,
    }));
    expect(contenu, `défilement horizontal à ${largeur} px`).toBeLessThanOrEqual(visible);
  }
});
