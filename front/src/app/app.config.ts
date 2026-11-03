import { ViewportScroller } from '@angular/common';
import {
  ApplicationConfig,
  inject,
  provideBrowserGlobalErrorListeners,
  provideEnvironmentInitializer,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withI18nSupport } from '@angular/platform-browser';

/**
 * Le retour en haut de la page à chaque navigation en avant se fait d'un coup (PF-04). Le routeur
 * d'Angular 22 (RouterScroller) demande « instant » pour restaurer la position au retour arrière,
 * mais rien pour ce retour en haut, que html { scroll-behavior: smooth } rendrait doux. Seuls les
 * appels sans comportement deviennent instantanés ; le défilement vers une ancre passe par
 * scrollToAnchor et garde le défilement doux de la feuille.
 */
function retourEnHautInstantane(): void {
  const defilement = inject(ViewportScroller);
  const versPosition = defilement.scrollToPosition.bind(defilement);
  defilement.scrollToPosition = (position, options = { behavior: 'instant' }) =>
    versPosition(position, options);
}

/** Le routeur : restauration de la position, défilement vers les ancres, retour en haut d'un coup. */
export const routeur = [
  provideRouter(
    routes,
    withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
  ),
  provideEnvironmentInitializer(retourEnHautInstantane),
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    ...routeur,
    provideClientHydration(withI18nSupport()),
  ],
};
