import { expect, type Page } from '@playwright/test';

// La lecture de la page principale (TK-27, PF-06) vue du navigateur : l'adresse affichée, la place
// d'un élément sous l'en-tête, les positions prises pendant un défilement. Le défilement doux prend
// du temps : on attend une position ou une adresse, jamais un délai.

/** L'adresse affichée : chemin, requête et ancre. */
export function adresse(page: Page): Promise<string> {
  return page.evaluate(() => `${location.pathname}${location.search}${location.hash}`);
}

/** L'écart, en px arrondis, entre le haut de l'élément et sa place sous l'en-tête. */
function ecartSousLEntete(page: Page, id: string): Promise<number> {
  return page.evaluate((id) => {
    const haut = document.getElementById(id)?.getBoundingClientRect().top ?? NaN;
    const decalage = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
    return Math.round(haut - decalage);
  }, id);
}

/** Attend que l'élément soit ouvert sous l'en-tête, à scroll-padding-top du haut de la fenêtre. */
export async function ouvertSousLEntete(page: Page, id: string): Promise<void> {
  await expect.poll(() => ecartSousLEntete(page, id), { message: `#${id} sous l'en-tête` }).toBe(0);
}

/**
 * Les positions verticales que la page prend, image par image, pendant l'action, qui attend
 * elle-même l'arrivée, puis jusqu'à ce que la page reste immobile cinq images de suite, sans la
 * première ni la dernière : vide pour un défilement d'un coup, non vide pour un défilement doux.
 */
export async function positionsIntermediaires(
  page: Page,
  action: () => Promise<unknown>,
): Promise<number[]> {
  await page.evaluate(() => {
    const positions = [Math.round(scrollY)];
    Object.assign(window, { positionsPrises: positions });
    const prendre = () => {
      positions.push(Math.round(scrollY));
      requestAnimationFrame(prendre);
    };
    requestAnimationFrame(prendre);
  });
  await action();
  const prises = () =>
    page.evaluate(() => (window as unknown as { positionsPrises: number[] }).positionsPrises);
  await expect
    .poll(async () => new Set((await prises()).slice(-5)).size, { message: 'page immobile' })
    .toBe(1);
  const positions = await prises();
  const [depart, arrivee] = [positions[0], positions.at(-1)];
  return [...new Set(positions)].filter((y) => y !== depart && y !== arrivee);
}
