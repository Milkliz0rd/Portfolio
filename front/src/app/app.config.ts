import { isPlatformBrowser, Location, ViewportScroller } from '@angular/common';
import {
  ApplicationConfig,
  DOCUMENT,
  inject,
  PLATFORM_ID,
  provideBrowserGlobalErrorListeners,
  provideEnvironmentInitializer,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  NavigationEnd,
  NavigationSkipped,
  NavigationStart,
  provideRouter,
  Router,
  withInMemoryScrolling,
} from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withI18nSupport } from '@angular/platform-browser';

/** Le chemin de la page principale. */
const PRINCIPALE = '/';

/** Le chemin d'une adresse du routeur, sans sa requête ni son ancre. */
const cheminDe = (adresse: string) => adresse.split(/[?#]/, 1)[0];

/**
 * Le défilement que demande le routeur, selon le tableau de PF-06. Le routeur d'Angular 22
 * (RouterScroller) rend lui-même, avec « instant », la position mémorisée au retour ou à l'avance
 * dans l'historique ; sinon il demande l'ancre de l'adresse (scrollToAnchor) ou le haut de la page
 * (scrollToPosition), sans comportement, que html { scroll-behavior: smooth } rendrait doux. Les deux
 * méthodes sont remplacées, et chaque défilement donne son comportement : doux sur la page principale
 * seulement, quand le chemin est le sien avant et après la navigation, hors historique et hors
 * animations réduites ; d'un coup partout ailleurs. Vers un élément, scrollIntoView, qui applique le
 * scroll-padding-top de html : l'ancre s'ouvre sous l'en-tête, jamais par coordonnées. Une ancre qui
 * ne nomme rien ramène en haut, d'un coup, et quitte l'adresse. Remplacées dans le navigateur
 * seulement : au pré-rendu, rien ne défile ; seules les méthodes remplacées lisent window et
 * document, jamais l'initialiseur à son exécution.
 */
function defilementDuRouteur(): void {
  if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
  const defilement = inject(ViewportScroller);
  const routeur = inject(Router);
  const adresses = inject(Location);
  const document = inject(DOCUMENT);
  const versPosition = defilement.scrollToPosition.bind(defilement);

  // Le chemin avant et après la dernière navigation finie ; une navigation ignorée parce que
  // l'adresse est la même défile aussi, sur le même chemin. historique : retour ou avance.
  let avant: string | undefined;
  let apres: string | undefined;
  let historique = false;
  routeur.events.subscribe((evenement) => {
    if (evenement instanceof NavigationStart) {
      historique = evenement.navigationTrigger === 'popstate';
    } else if (evenement instanceof NavigationEnd) {
      [avant, apres] = [apres, cheminDe(evenement.urlAfterRedirects)];
    } else if (evenement instanceof NavigationSkipped) {
      [avant, historique] = [apres, false];
    }
  });

  // Le choix des animations est lu à chaque défilement, jamais au démarrage.
  const comportement = (): ScrollBehavior =>
    !historique &&
    avant === PRINCIPALE &&
    apres === PRINCIPALE &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'smooth'
      : 'instant';

  // L'adresse perd son ancre, l'état que le routeur a posé dans l'historique gardé ; jamais avant
  // la fin du chargement, tant que le navigateur peut encore défiler vers l'ancre (règle de moment
  // de PF-06), et plus du tout si une autre navigation a suivi.
  const quitterLAncre = (): void => {
    const adresse = routeur.url;
    const reecrire = () => {
      if (routeur.url !== adresse) return;
      const sansAncre = adresses.prepareExternalUrl(adresse.split('#', 1)[0]);
      history.replaceState(history.state, '', sansAncre);
    };
    if (document.readyState === 'complete') reecrire();
    else window.addEventListener('load', reecrire, { once: true });
  };

  defilement.scrollToPosition = (position, options) =>
    versPosition(position, options ?? { behavior: comportement() });

  // La recherche de la méthode remplacée : l'id, puis le nom ; puis le focus, sans défilement, pour
  // que la navigation au clavier reparte de l'élément.
  defilement.scrollToAnchor = (ancre, options) => {
    const cible = document.getElementById(ancre) ?? document.getElementsByName(ancre).item(0);
    if (cible) {
      cible.scrollIntoView({ block: 'start', behavior: options?.behavior ?? comportement() });
      cible.focus({ preventScroll: true });
    } else {
      versPosition([0, 0], { behavior: 'instant' });
      quitterLAncre();
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
