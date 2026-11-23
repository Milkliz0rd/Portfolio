import { isPlatformBrowser, ViewportScroller } from '@angular/common';
import {
  ApplicationConfig,
  DOCUMENT,
  inject,
  PLATFORM_ID,
  provideBrowserGlobalErrorListeners,
  provideEnvironmentInitializer,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withI18nSupport } from '@angular/platform-browser';
import { cibleDe, NavigationService } from './services/navigation/navigation';

/**
 * Le défilement que demande le routeur, selon le tableau de PF-06. Le routeur d'Angular 22
 * (RouterScroller) rend lui-même, avec « instant », la position mémorisée au retour ou à l'avance
 * dans l'historique ; sinon il demande l'ancre de l'adresse (scrollToAnchor) ou le haut de la page
 * (scrollToPosition), sans comportement, que html { scroll-behavior: smooth } rendrait doux. Les deux
 * méthodes sont remplacées, et chaque défilement donne son comportement : doux sur la page principale
 * seulement, quand le chemin est le sien avant et après la navigation (services/navigation garde
 * le chemin de la dernière navigation finie), hors historique et hors animations réduites ; d'un
 * coup partout ailleurs. Vers un élément, scrollIntoView, qui applique le scroll-padding-top de
 * html : l'ancre s'ouvre sous l'en-tête, jamais par coordonnées. Une ancre qui ne nomme rien ramène
 * en haut, d'un coup, et quitte l'adresse. Remplacées dans le navigateur seulement : au pré-rendu,
 * rien ne défile ; seules les méthodes remplacées lisent window et document, jamais l'initialiseur
 * à son exécution.
 */
function defilementDuRouteur(): void {
  if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
  const defilement = inject(ViewportScroller);
  const navigation = inject(NavigationService);
  const document = inject(DOCUMENT);
  const versPosition = defilement.scrollToPosition.bind(defilement);

  // Le choix des animations est lu à chaque défilement, jamais au démarrage.
  const comportement = (): ScrollBehavior =>
    navigation.resteSurPrincipale() &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'smooth'
      : 'instant';

  defilement.scrollToPosition = (position, options) =>
    versPosition(position, options ?? { behavior: comportement() });

  // La recherche de la méthode remplacée : l'id, puis le nom ; puis le focus, sans défilement, pour
  // que la navigation au clavier reparte de l'élément.
  defilement.scrollToAnchor = (ancre, options) => {
    const cible = cibleDe(document, ancre);
    if (cible) {
      cible.scrollIntoView({ block: 'start', behavior: options?.behavior ?? comportement() });
      cible.focus({ preventScroll: true });
    } else {
      // L'adresse perd son ancre une fois la page chargée, si aucune autre navigation n'a suivi.
      versPosition([0, 0], { behavior: 'instant' });
      navigation.quitterLAncre();
    }
  };
}

/** Le routeur : restauration de la position, défilement vers les ancres, selon le tableau de PF-06. */
export const routeur = [
  provideRouter(
    routes,
    withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
  ),
  provideEnvironmentInitializer(defilementDuRouteur),
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    ...routeur,
    provideClientHydration(withI18nSupport()),
  ],
};
