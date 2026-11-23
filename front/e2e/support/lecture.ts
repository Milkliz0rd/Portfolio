import { expect, type Page } from '@playwright/test';

// La lecture de la page principale (TK-27, PF-06) vue du navigateur : l'adresse affichée, la place
// d'un élément sous l'en-tête. Le défilement doux prend du temps : on attend une position ou une
// adresse, jamais un délai.

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
