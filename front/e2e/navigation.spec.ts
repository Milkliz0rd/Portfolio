import type { Page } from '@playwright/test';
import { expect, test, type Surveillance } from './support/banc';
import { contenuCache } from './support/contenu-visible';
import { adresse, ouvertSousLEntete, positionsIntermediaires } from './support/lecture';
import { PAGES_ERREUR, pagesDuBuild } from './support/site';

// L'en-tête, la navigation et le lien d'évitement (TK-27, PF-06, SC-2.0-02 à SC-2.0-04), dans les
// six profils, sous la surveillance de banc.ts. La navigation complète n'existe qu'à partir de
// 1200 px : ses tests prennent une fenêtre de 1280 px, téléphones compris ; « Contact » et la
// marque sont aussi éprouvés à la largeur du profil. Le menu replié : menu-replie.spec.ts.

const LARGE = { width: 1280, height: 800 };
const SECTIONS = [
  ['Parcours', 'parcours'],
  ['Compétences', 'competences'],
  ['Expérience', 'experience'],
  ['Méthode', 'methode'],
  ['Projets', 'projets'],
] as const;
const ADRESSE_INCONNUE = PAGES_ERREUR[0].adresse;
const FICHE = ficheDuBuild();
const PAGES_A_PART = [...pagesDuBuild().filter((page) => page !== '/'), ADRESSE_INCONNUE];

const entete = (page: Page) => page.getByRole('banner');
const entree = (page: Page, nom: string) =>
  page.getByRole('navigation', { name: 'Sections du site' }).getByRole('link', { name: nom });
const contact = (page: Page) => entete(page).getByRole('link', { name: 'Contact', exact: true });
const historique = (page: Page) => page.evaluate(() => history.length);
/** Les liens signalés de l'en-tête, hors du menu replié : libellé et aria-current. */
const signales = (page: Page) =>
  entete(page)
    .locator('[aria-current]')
    .evaluateAll((liens) =>
      liens
        .filter((l) => !l.closest('.menu-replie'))
        .map((l) => [l.textContent?.trim(), l.getAttribute('aria-current')]),
    );

/** La fiche d'un projet, la première du build. */
function ficheDuBuild(): string {
  const fiche = pagesDuBuild().find((page) => page.startsWith('/projets/'));
  if (!fiche) throw new Error('Aucune fiche de projet dans le build');
  return fiche;
}

/**
 * Ouvre la page, déclarée en 404 pour l'adresse inconnue, animations permises, et attend que
 * l'application ait démarré (mv-pret).
 */
async function ouvrir(page: Page, depart: string, surveillance: Surveillance): Promise<void> {
  if (depart === ADRESSE_INCONNUE) surveillance.attendreReponseEnErreur(depart, 404);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(depart);
  await expect(page.locator('html')).toHaveClass(/\bmv-pret\b/);
}

test('navigation : sur la page principale, chaque entrée défile jusqu’à sa section, sans étape d’historique', async ({
  page,
  surveillance,
}) => {
  await page.setViewportSize(LARGE);
  await ouvrir(page, '/', surveillance);
  const etapes = await historique(page);
  for (const [nom, id] of SECTIONS) {
    await entree(page, nom).click();
    await ouvertSousLEntete(page, id);
    await expect(entree(page, nom)).toHaveAttribute('aria-current', 'location');
    await expect.poll(() => adresse(page)).toBe(`/#${id}`);
  }
  for (const lien of [entree(page, 'Accueil'), entete(page).locator('.entete__marque')]) {
    await page.evaluate(() => scrollTo({ top: 1500, behavior: 'instant' }));
    await lien.click();
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
    await expect(entree(page, 'Accueil')).toHaveAttribute('aria-current', 'location');
    await expect.poll(() => adresse(page)).toBe('/');
  }
  expect(await historique(page)).toBe(etapes);
});

test('navigation : le retour arrière quitte la page principale au lieu de remonter ses sections', async ({
  page,
  surveillance,
}) => {
  await page.setViewportSize(LARGE);
  await ouvrir(page, '/contact', surveillance);
  await entree(page, 'Parcours').click();
  await ouvertSousLEntete(page, 'parcours');
  await entree(page, 'Projets').click();
  await ouvertSousLEntete(page, 'projets');
  await page.evaluate(() => scrollBy({ top: -1200, behavior: 'instant' }));
  await expect.poll(() => adresse(page)).toBe('/#experience');
  await page.goBack();
  await expect.poll(() => adresse(page)).toBe('/contact');
  await expect(contact(page)).toHaveAttribute('aria-current', 'page');
});

test('navigation : l’entrée signalée suit la lecture, la dernière section au bout d’un écran de 2560 px', async ({
  page,
  surveillance,
}) => {
  await page.setViewportSize({ width: 1280, height: 2560 });
  await ouvrir(page, '/', surveillance);
  expect(await signales(page)).toEqual([['Accueil', 'location']]);
  await page.evaluate(() =>
    document.getElementById('experience')?.scrollIntoView({ behavior: 'instant' }),
  );
  await expect(entree(page, 'Expérience')).toHaveAttribute('aria-current', 'location');
  await expect.poll(() => adresse(page)).toBe('/#experience');
  await page.evaluate(() =>
    scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }),
  );
  await expect(entree(page, 'Projets')).toHaveAttribute('aria-current', 'location');
  await expect.poll(() => adresse(page)).toBe('/#projets');
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await expect(entree(page, 'Accueil')).toHaveAttribute('aria-current', 'location');
  await expect.poll(() => adresse(page)).toBe('/');
  expect(await signales(page)).toHaveLength(1);
});

for (const depart of PAGES_A_PART) {
  test(`navigation : depuis ${depart}, chaque entrée mène d’un coup à sa section, « Contact » au contact`, async ({
    page,
    surveillance,
  }) => {
    await page.setViewportSize(LARGE);
    await ouvrir(page, depart, surveillance);
    for (const [nom, id] of [['Accueil', ''], ...SECTIONS] as const) {
      const intermediaires = await positionsIntermediaires(page, async () => {
        await entree(page, nom).click();
        await expect.poll(() => adresse(page)).toBe(id ? `/#${id}` : '/');
        if (id) await ouvertSousLEntete(page, id);
      });
      expect(intermediaires, `${nom} d’un coup`).toEqual([]);
      await page.goBack();
      await expect.poll(() => adresse(page)).toBe(depart);
    }
    await contact(page).click();
    await expect.poll(() => adresse(page)).toBe('/contact');
  });
}

test('navigation : la page signalée, « Projets » sur une fiche, « Contact » sur le contact, aucune ailleurs', async ({
  page,
  surveillance,
}) => {
  const attendus = [
    [FICHE, [['Projets', 'page']]],
    ['/contact', [['Contact', 'page']]],
    ['/mentions-legales', []],
    [ADRESSE_INCONNUE, []],
  ] as const;
  for (const [depart, signalees] of attendus) {
    await ouvrir(page, depart, surveillance);
    expect(await signales(page), depart).toEqual(signalees);
  }
});

test('navigation : « Contact » en un clic depuis la page principale et une fiche, à la largeur du profil', async ({
  page,
  surveillance,
}) => {
  for (const depart of ['/', FICHE]) {
    await ouvrir(page, depart, surveillance);
    await contact(page).click();
    await expect.poll(() => adresse(page)).toBe('/contact');
  }
});

test('navigation : le retour en haut, vers une autre page, se fait d’un coup', async ({
  page,
  surveillance,
}) => {
  await ouvrir(page, '/', surveillance);
  await page.evaluate(() =>
    document.getElementById('methode')?.scrollIntoView({ behavior: 'instant' }),
  );
  // La page de contact provisoire est plus courte que la fenêtre : la page y retomberait en haut
  // d'elle-même, et un retour doux passerait inaperçu. Le document reste donc plus haut que la
  // fenêtre pendant le test ; html ne change pas d'une page à l'autre.
  await page.evaluate(() => document.documentElement.style.setProperty('min-block-size', '800vh'));
  // Le clic est envoyé tel quel : avant un clic, Playwright peut faire défiler la page jusqu'à
  // l'élément, ce qui, dans WebKit, décale de quelques pixels une page déjà immobile.
  const intermediaires = await positionsIntermediaires(page, async () => {
    await contact(page).dispatchEvent('click');
    await expect.poll(() => adresse(page)).toBe('/contact');
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  });
  expect(intermediaires).toEqual([]);
});

test('navigation : le lien d’évitement, premier élément focalisable, mène au contenu principal', async ({
  page,
  surveillance,
}) => {
  await ouvrir(page, '/contact', surveillance);
  const premier = await page.evaluate(
    () => document.querySelector('a[href], button, [tabindex]:not([tabindex="-1"])')?.textContent,
  );
  expect(premier?.trim()).toBe('Aller au contenu');
  const lien = page.getByRole('link', { name: 'Aller au contenu' });
  await expect(lien).not.toBeInViewport();
  const [avant, etapes] = [await adresse(page), await historique(page)];
  await lien.focus();
  await expect(lien).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe('contenu');
  expect([await adresse(page), await historique(page)]).toEqual([avant, etapes]);
});

test('navigation : l’en-tête collant, à 92 %, à 74 % avec flou dès 900 px, jamais dans une arrivée', async ({
  page,
  surveillance,
}) => {
  await page.setViewportSize(LARGE);
  await ouvrir(page, '/', surveillance);
  const fond = () =>
    page
      .locator('.entete')
      .evaluate((e) => [
        getComputedStyle(e, '::before').opacity,
        getComputedStyle(e).backdropFilter,
      ]);
  expect(await fond()).toEqual(['0.74', 'blur(14px)']);
  await page.setViewportSize({ width: 899, height: 800 });
  expect(await fond()).toEqual(['0.92', 'none']);
  // Aucun élément de l'en-tête n'est caché, décalé ou rattaché au mouvement, dès l'arrivée.
  const arrivee = await entete(page).evaluate((racine: Element) =>
    [racine, ...racine.querySelectorAll('*')].flatMap((e): string[] => {
      const { opacity, transform } = getComputedStyle(e);
      const mouvement = [...e.classList].some((c) => c.startsWith('mv-'));
      return opacity === '1' && transform === 'none' && !mouvement ? [] : [e.localName];
    }),
  );
  expect(arrivee).toEqual([]);
  await page.evaluate(() => scrollTo({ top: 2000, behavior: 'instant' }));
  expect(await entete(page).evaluate((e) => e.getBoundingClientRect().top)).toBe(0);
});

test('navigation : à 320 px, le monogramme dans une cible de 44 px, le nom annoncé, « Contact » visible', async ({
  page,
  surveillance,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await ouvrir(page, '/', surveillance);
  const marque = entete(page).locator('.entete__marque');
  const nom = (await marque.locator('.entete__nom').textContent()) ?? '';
  await expect(marque).toHaveAccessibleName(nom);
  const boite = await marque.boundingBox();
  expect([boite?.width, boite?.height].map((c) => (c ?? 0) >= 44)).toEqual([true, true]);
  await expect(contact(page)).toBeInViewport();
  const { contenu, visible } = await page.evaluate(() => ({
    contenu: document.documentElement.scrollWidth,
    visible: document.documentElement.clientWidth,
  }));
  expect(contenu).toBeLessThanOrEqual(visible);
});

test.describe(() => {
  test.use({ javaScriptEnabled: false });

  test('navigation : sans script, les liens mènent aux sections et l’accueil reste signalé', async ({
    page,
  }) => {
    await page.setViewportSize(LARGE);
    await page.goto('/');
    expect(await signales(page)).toEqual([['Accueil', 'location']]);
    await expect(entree(page, 'Méthode')).toHaveAttribute('href', '/#methode');
    await entree(page, 'Méthode').click();
    await ouvertSousLEntete(page, 'methode');
    expect(await adresse(page)).toBe('/#methode');
    expect(await contenuCache(page), 'contenu caché à 1280 px').toEqual([]);
    await page.setViewportSize({ width: 320, height: 640 });
    expect(await contenuCache(page), 'contenu caché à 320 px').toEqual([]);
  });
});
