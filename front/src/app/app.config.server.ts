import {
  ApplicationConfig,
  ErrorHandler,
  isDevMode,
  mergeApplicationConfig,
  Provider,
} from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

/**
 * Gestionnaire d'erreurs fatal du rendu serveur : il relance l'erreur au lieu de seulement l'écrire
 * au journal. Au pré-rendu, le build échoue alors sans écrire aucune page, au lieu de réussir avec
 * une page tronquée.
 */
export class ErreurDeRenduFatale implements ErrorHandler {
  handleError(erreur: unknown): never {
    throw erreur;
  }
}

/**
 * Le gestionnaire d'erreurs du rendu serveur selon le mode : fatal en production, donc pour
 * `npm run build` ; celui par défaut en développement, où le serveur survit ainsi à une page fautive
 * et écrit l'erreur dans son journal.
 */
export function gestionnaireErreursDeRendu(developpement = isDevMode()): Provider[] {
  return developpement ? [] : [{ provide: ErrorHandler, useClass: ErreurDeRenduFatale }];
}

const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering(withRoutes(serverRoutes)), ...gestionnaireErreursDeRendu()],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
