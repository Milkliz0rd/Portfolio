import { ErrorHandler, isDevMode } from '@angular/core';
import { config, ErreurDeRenduFatale, gestionnaireErreursDeRendu } from './app.config.server';

describe('Gestionnaire d’erreurs du rendu serveur', () => {
  it('relance l’erreur reçue elle-même, au lieu de la taire', () => {
    const erreur = new Error('Erreur au rendu');
    let relancee: unknown;
    try {
      new ErreurDeRenduFatale().handleError(erreur);
    } catch (e) {
      relancee = e;
    }
    expect(relancee).toBe(erreur);
  });

  it('est fatal hors développement, pour le build', () => {
    expect(gestionnaireErreursDeRendu(false)).toEqual([
      { provide: ErrorHandler, useClass: ErreurDeRenduFatale },
    ]);
  });

  it('laisse le gestionnaire par défaut au serveur de développement', () => {
    expect(gestionnaireErreursDeRendu(true)).toEqual([]);
  });

  it('ne fournit pas le gestionnaire fatal en mode développement', () => {
    // Les tests tournent en mode développement ; la branche de production ne se prouve que par un
    // build avec une page fautive.
    expect(isDevMode()).toBe(true);
    expect(config.providers).not.toContainEqual({
      provide: ErrorHandler,
      useClass: ErreurDeRenduFatale,
    });
  });
});
