import type { Page } from '@playwright/test';
import { expect, test, type Surveillance } from './support/banc';
import { adresse, ouvertSousLEntete, positionsIntermediaires } from './support/lecture';
import { PAGES_ERREUR, pagesDuBuild, scriptPrincipal } from './support/site';

// Le menu replié (TK-29, CO-07, PF-06, SC-2.0-04, SC-2.0-09), sous la surveillance de banc.ts. Il
// n'existe que sous 1200 px : ses tests tournent dans les trois profils téléphone, en émulation.
// Fermer sans choisir ne doit pas déplacer la lecture : le bouton y est actionné sans le clic de
// Playwright, qui peut faire défiler la page avant de cliquer (constat de navigation.spec.ts).
test.skip(({ viewport }) => !viewport || viewport.width >= 1200, 'menu replié : sous 1200 px');

const SECTIONS = [
  ['Parcours', 'parcours'],
  ['Compétences', 'competences'],
  ['Expérience', 'experience'],
  ['Méthode', 'methode'],
  ['Projets', 'projets'],
] as const;
const ADRESSES = ['/', '/#parcours', '/#competences', '/#experience', '/#methode', '/#projets'];
const ADRESSE_INCONNUE = PAGES_ERREUR[0].adresse;
const PAGES = pagesDuBuild();
const FICHE = PAGES.find((page) => page.startsWith('/projets/'));
if (!FICHE) throw new Error('Aucune fiche de projet dans le build');

const menu = (page: Page) => page.locator('details.menu-replie');
const bouton = (page: Page) => menu(page).locator('summary');
const panneau = (page: Page) =>
  page.getByRole('navigation', { name: 'Sections du site, menu', exact: true });
const entree = (page: Page, nom: string) =>
  panneau(page).getByRole('link', { name: nom, exact: true });
const contact = (page: Page) =>
  page.getByRole('banner').getByRole('link', { name: 'Contact', exact: true });
const ouvert = (page: Page) => menu(page).evaluate((m: HTMLDetailsElement) => m.open);
const historique = (page: Page) => page.evaluate(() => history.length);
const position = (page: Page) => page.evaluate(() => scrollY);
const allerA = (page: Page, id: string) =>
  page.evaluate((id) => document.getElementById(id)?.scrollIntoView({ behavior: 'instant' }), id);
/** Les entrées signalées du menu : libellé et aria-current. */
const signalees = (page: Page) =>
  menu(page)
    .locator('a[aria-current]')
    .evaluateAll((liens) =>
      liens.map((l) => [l.textContent?.trim(), l.getAttribute('aria-current')]),
    );

/** Ouvre la page, déclarée en 404 si besoin, et attend le démarrage de l'application (mv-pret). */
async function ouvrir(page: Page, depart: string, surveillance: Surveillance): Promise<void> {
  if (depart === ADRESSE_INCONNUE) surveillance.attendreReponseEnErreur(depart, 404);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(depart);
  await expect(page.locator('html')).toHaveClass(/\bmv-pret\b/);
}

test('menu : sur la page principale, une entrée ferme le panneau et défile jusqu’à sa section, sans étape d’historique', async ({
  page,
  surveillance,
}) => {
  await ouvrir(page, '/', surveillance);
  const etapes = await historique(page);
  for (const [nom, id] of SECTIONS) {
    await bouton(page).click();
    await entree(page, nom).click();
    await expect.poll(() => ouvert(page)).toBe(false);
    await ouvertSousLEntete(page, id);
    await expect.poll(() => adresse(page)).toBe(`/#${id}`);
    expect(await signalees(page)).toEqual([[nom, 'location']]);
  }
  await allerA(page, 'experience');
  await bouton(page).click();
  await entree(page, 'Accueil').click();
  await expect.poll(() => position(page)).toBe(0);
  await expect.poll(() => adresse(page)).toBe('/');
  expect(await signalees(page)).toEqual([['Accueil', 'location']]);
  expect(await historique(page)).toBe(etapes);
});

test('menu : l’entrée courante porte son repère, fond et barre de 3 px, sans trait ni nom de transition', async ({
  page,
  surveillance,
}) => {
  await ouvrir(page, '/', surveillance);
  const lien = menu(page).locator('a[aria-current]');
  await expect(lien).toHaveCount(1);
  const styles = await lien.evaluate((a) => {
    const repere = a.querySelector('.menu-replie__repere');
    return {
      trait: getComputedStyle(a, '::after').content,
      barre: repere && getComputedStyle(repere, '::before').width,
      transition:
        repere && (getComputedStyle(repere).getPropertyValue('view-transition-name') || 'none'),
    };
  });
  expect(styles).toEqual({ trait: 'none', barre: '3px', transition: 'none' });
});

test('menu : depuis une page à part, une entrée mène d’un coup à la page principale, à sa section', async ({
  page,
  surveillance,
}) => {
  for (const depart of [FICHE, ADRESSE_INCONNUE]) {
    await ouvrir(page, depart, surveillance);
    const etapes = await historique(page);
    await bouton(page).click();
    const intermediaires = await positionsIntermediaires(page, async () => {
      await entree(page, 'Méthode').click();
      await expect.poll(() => adresse(page)).toBe('/#methode');
      await ouvertSousLEntete(page, 'methode');
    });
    expect(intermediaires, `${depart} : d’un coup`).toEqual([]);
    expect([await ouvert(page), await historique(page)]).toEqual([false, etapes + 1]);
  }
});

test('menu : refermé par son bouton ou par Échap, il laisse la lecture en place ; Échap rend le focus au bouton', async ({
  page,
  surveillance,
}) => {
  await ouvrir(page, '/', surveillance);
  await allerA(page, 'competences');
  await expect.poll(() => adresse(page)).toBe('/#competences');
  const avant = await position(page);
  await bouton(page).dispatchEvent('click');
  await expect.poll(() => ouvert(page)).toBe(true);
  await bouton(page).dispatchEvent('click');
  await expect.poll(() => ouvert(page)).toBe(false);
  expect(await position(page)).toBe(avant);
  await bouton(page).dispatchEvent('click');
  await entree(page, 'Projets').focus();
  await page.keyboard.press('Escape');
  await expect.poll(() => ouvert(page)).toBe(false);
  await expect(bouton(page)).toBeFocused();
  expect([await position(page), await adresse(page)]).toEqual([avant, '/#competences']);
});

test('menu : un clic hors du panneau le ferme sans déplacer la lecture, et le clic suit son cours', async ({
  page,
  surveillance,
}) => {
  await ouvrir(page, '/', surveillance);
  await allerA(page, 'experience');
  await expect.poll(() => adresse(page)).toBe('/#experience');
  const avant = await position(page);
  await bouton(page).dispatchEvent('click');
  await expect.poll(() => ouvert(page)).toBe(true);
  // Au bas de la fenêtre, sous le panneau, sur le contenu de la section.
  const { width, height } = page.viewportSize() ?? { width: 0, height: 0 };
  await page.mouse.click(width / 2, height - 20);
  await expect.poll(() => ouvert(page)).toBe(false);
  expect(await position(page)).toBe(avant);
  await bouton(page).dispatchEvent('click');
  await contact(page).click();
  await expect.poll(() => adresse(page)).toBe('/contact');
  expect(await ouvert(page)).toBe(false);
});

test('menu : à 320 px, aucune entrée coupée ni défilement horizontal ; le panneau de 320 px dès 600 px', async ({
  page,
  surveillance,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await ouvrir(page, '/', surveillance);
  const marque = page.getByRole('banner').locator('.entete__marque');
  for (const element of [marque, contact(page), bouton(page)]) {
    await expect(element).toBeInViewport({ ratio: 1 });
  }
  await bouton(page).click();
  const entrees = await panneau(page)
    .getByRole('link')
    .evaluateAll((liens) =>
      liens.map((l) => {
        const { left, right, height } = l.getBoundingClientRect();
        return left >= 0 && right <= 320 && height >= 44 && l.scrollWidth <= l.clientWidth;
      }),
    );
  expect(entrees).toEqual(Array(6).fill(true));
  const cadre = await panneau(page).boundingBox();
  expect([cadre?.x, 320 - (cadre?.x ?? 0) - (cadre?.width ?? 0)]).toEqual([16, 16]);
  const { contenu, visible } = await page.evaluate(() => ({
    contenu: document.documentElement.scrollWidth,
    visible: document.documentElement.clientWidth,
  }));
  expect(contenu).toBeLessThanOrEqual(visible);
  await page.setViewportSize({ width: 700, height: 640 });
  const large = await panneau(page).boundingBox();
  expect([large?.width, (large?.x ?? 0) + (large?.width ?? 0)]).toEqual([320, 700 - 24]);
});

test('menu : sur un écran bas, le panneau tient dans la fenêtre et défile seul ; chaque entrée reste atteignable', async ({
  page,
  surveillance,
}) => {
  // Un téléphone couché, puis un écran de 1280 × 1024 zoomé à 400 % (WCAG 1.4.10).
  for (const [largeur, hauteur] of [
    [844, 340],
    [320, 256],
  ] as const) {
    await page.setViewportSize({ width: largeur, height: hauteur });
    await ouvrir(page, '/', surveillance);
    await bouton(page).dispatchEvent('click');
    await expect.poll(() => ouvert(page)).toBe(true);
    const cadre = await panneau(page).boundingBox();
    expect((cadre?.y ?? 0) + (cadre?.height ?? 0)).toBeLessThanOrEqual(hauteur);
    for (const nom of ['Accueil', ...SECTIONS.map(([libelle]) => libelle)]) {
      await entree(page, nom).scrollIntoViewIfNeeded();
      await expect(entree(page, nom)).toBeInViewport({ ratio: 1 });
    }
    expect(await position(page)).toBe(0);
  }
});

test('menu : présent sur chaque page, adresse inconnue comprise, « Contact » à côté, hors du menu', async ({
  page,
  surveillance,
}) => {
  // L'entrée signalée de chaque page : l'accueil en haut de la page principale, « Projets » sur une
  // fiche, aucune ailleurs (« Contact » n'est pas dans le menu).
  const attendues = (depart: string) =>
    depart === '/'
      ? [['Accueil', 'location']]
      : depart.startsWith('/projets/')
        ? [['Projets', 'page']]
        : [];
  for (const depart of PAGES) {
    await page.goto(depart);
    await expect(bouton(page), depart).toBeVisible();
    await expect(contact(page), depart).toBeVisible();
    expect(await contact(page).evaluate((c) => c.closest('details') === null), depart).toBe(true);
    expect(await signalees(page), depart).toEqual(attendues(depart));
  }
  // Sur les pages d'erreur, le menu et « Contact », et aucune entrée signalée une fois
  // l'application démarrée : la garde des fiches (TK-31) rend /projets/identifiant-inconnu à la
  // page introuvable, sans section.
  for (const { adresse: depart } of PAGES_ERREUR) {
    surveillance.attendreReponseEnErreur(depart, 404);
    await page.goto(depart);
    await expect(page.locator('html'), depart).toHaveClass(/\bmv-pret\b/);
    await expect(bouton(page), depart).toBeVisible();
    await expect(contact(page), depart).toBeVisible();
    expect(await signalees(page), depart).toEqual([]);
  }
});

test('menu : sans script, il s’ouvre et se ferme par son bouton, et ses liens sont de vrais liens', async ({
  page,
  surveillance,
}) => {
  const principal = scriptPrincipal();
  surveillance.attendreRequeteAbandonnee(principal);
  await page.route(principal, (route) => route.abort());
  await page.goto('/');
  await bouton(page).click();
  await expect(panneau(page)).toBeVisible();
  const liens = panneau(page).getByRole('link');
  expect(await liens.evaluateAll((ls) => ls.map((l) => l.getAttribute('href')))).toEqual(ADRESSES);
  await bouton(page).click();
  await expect(panneau(page)).toBeHidden();
  await bouton(page).click();
  await entree(page, 'Méthode').click();
  await ouvertSousLEntete(page, 'methode');
  expect(await adresse(page)).toBe('/#methode');
});

test('menu : ouvert avant le démarrage, il le reste après, sans erreur, et Échap le ferme', async ({
  page,
}) => {
  // Le panneau s'ouvre dès que l'analyse du document le rencontre, avant le script principal, qui
  // ne s'exécute qu'après l'analyse : WebKit ne peint rien tant que ce script attend, et un clic
  // y serait impossible. La page note que l'application n'avait pas démarré (mv-pret) à ce moment.
  await page.addInitScript(() => {
    new MutationObserver((_, observateur) => {
      const menu = document.querySelector('details.menu-replie');
      if (!(menu instanceof HTMLDetailsElement)) return;
      observateur.disconnect();
      menu.open = true;
      const demarree = document.documentElement.classList.contains('mv-pret');
      Object.assign(window, { ouvertAvantDemarrage: !demarree });
    }).observe(document, { childList: true, subtree: true });
  });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/\bmv-pret\b/);
  expect(
    await page.evaluate(() => (window as { ouvertAvantDemarrage?: boolean }).ouvertAvantDemarrage),
  ).toBe(true);
  expect(await ouvert(page)).toBe(true);
  await page.keyboard.press('Escape');
  await expect.poll(() => ouvert(page)).toBe(false);
});
