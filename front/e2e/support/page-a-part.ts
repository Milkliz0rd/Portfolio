import { expect, type Page } from '@playwright/test';
import type { Surveillance } from './banc';
import { scriptPrincipal } from './site';

// Les pages à part sans entrée signalée (TK-31) : les mentions légales et la page introuvable,
// vues du navigateur, avant et après le démarrage de l'application.

declare global {
  interface Window {
    /** Le titre de niveau 1 du document servi, retenu avant tout script de l'application. */
    titreServi?: Element | null;
  }
}

/** Retient le titre de niveau 1 du document servi, dès qu'il est lu, avant le démarrage. */
export async function retenirLeDocument(page: Page): Promise<void> {
  await page.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      window.titreServi = document.querySelector('main h1');
    });
  });
}

/**
 * Attend que l'application ait démarré (mv-pret, animations permises) et que la page de la route,
 * son hôte, ait été hydratée : Angular retire alors son attribut ngh. Le titre est encore celui du
 * document servi, le même élément, au même texte : rien n'a été rendu à nouveau.
 */
export async function demarree(page: Page, hote: string): Promise<void> {
  await expect(page.locator('html')).toHaveClass(/\bmv-pret\b/);
  await expect(page.locator(hote)).toBeAttached();
  await expect(page.locator(hote)).not.toHaveAttribute('ngh');
  expect(await page.evaluate(() => document.querySelector('main h1') === window.titreServi)).toBe(
    true,
  );
}

/** Bloque le script principal : la page reste le document servi, sans application. */
export async function sansApplication(page: Page, surveillance: Surveillance): Promise<void> {
  const principal = scriptPrincipal();
  surveillance.attendreRequeteAbandonnee(principal);
  await page.route(principal, (route) => route.abort());
}

/** Les entrées signalées de l'en-tête, navigation complète et menu replié compris. */
export function signalees(page: Page): Promise<number> {
  return page.getByRole('banner').locator('[aria-current]').count();
}

/** La navigation du site visible : la navigation complète, ou le bouton du menu replié. */
export async function navigationVisible(page: Page): Promise<boolean> {
  const complete = page.getByRole('navigation', { name: 'Sections du site', exact: true });
  const menu = page.locator('details.menu-replie > summary');
  return (await complete.isVisible()) || (await menu.isVisible());
}
