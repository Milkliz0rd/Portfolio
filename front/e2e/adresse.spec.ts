import type { Page } from '@playwright/test';
import { expect, test, type Surveillance } from './support/banc';
import { adresse, ouvertSousLEntete } from './support/lecture';
import { scriptPrincipal } from './support/site';

// Les ancres de la page principale à l'ouverture et au rechargement (TK-27, PF-06, SC-2.0-05,
// V-11), avant et après le démarrage de l'application, dans les six profils, sous la surveillance
// de banc.ts (aucune erreur de console). Le suivi de la lecture est dans navigation.spec.ts.

/** Bloque le script principal : la page reste le document pré-rendu, sans application. */
async function sansApplication(page: Page, surveillance: Surveillance): Promise<void> {
  const principal = scriptPrincipal();
  surveillance.attendreRequeteAbandonnee(principal);
  await page.route(principal, (route) => route.abort());
}

test('adresse : une section ouverte directement, puis rechargée, s’ouvre sous l’en-tête', async ({
  page,
}) => {
  await page.goto('/#methode');
  await ouvertSousLEntete(page, 'methode');
  await expect.poll(() => adresse(page)).toBe('/#methode');
  await page.reload();
  await ouvertSousLEntete(page, 'methode');
  await expect.poll(() => adresse(page)).toBe('/#methode');
});

test('adresse : l’ancre d’un élément intérieur s’ouvre sur lui, puis devient celle de sa section', async ({
  page,
}) => {
  await page.goto('/#titre-competences');
  await ouvertSousLEntete(page, 'titre-competences');
  await expect.poll(() => adresse(page)).toBe('/#competences');
});

test('adresse : une ancre qui ne nomme rien s’ouvre en haut et quitte l’adresse', async ({
  page,
}) => {
  await page.goto('/#competence');
  await expect.poll(() => adresse(page)).toBe('/');
  expect(await page.evaluate(() => scrollY)).toBe(0);
});

test('adresse : avant le démarrage, une section s’ouvre sous l’en-tête', async ({
  page,
  surveillance,
}) => {
  await sansApplication(page, surveillance);
  await page.goto('/#methode');
  await ouvertSousLEntete(page, 'methode');
  expect(await adresse(page)).toBe('/#methode');
});

test('adresse : avant le démarrage, une ancre qui ne nomme rien laisse la page en haut', async ({
  page,
  surveillance,
}) => {
  await sansApplication(page, surveillance);
  await page.goto('/#competence');
  expect(await page.evaluate(() => scrollY)).toBe(0);
  // Sans application, l'ancre reste dans l'adresse (PF-06, « Sans script »).
  expect(await adresse(page)).toBe('/#competence');
});
