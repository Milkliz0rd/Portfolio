import { ErrorHandler, isDevMode } from '@angular/core';

// Le module serveur est chargé dans le test, jamais en tête de fichier : à son chargement,
// provideServerRendering() pose globalThis.ngServerMode = true. Les fichiers de test partagent leur
// environnement (Vitest sans isolation), et ce mode laissé en place ferait taire, dans les fichiers
// joués ensuite, tous les afterNextRender, dont le démarrage du mouvement (app.spec.ts).
type ModuleServeur = typeof import('./app.config.server');
type Global = typeof globalThis & { ngServerMode?: boolean };
const global = globalThis as Global;

describe('Gestionnaire d’erreurs du rendu serveur', () => {
  let serveur: ModuleServeur;
  let modeAvant: boolean | undefined;

  beforeAll(async () => {
    modeAvant = global.ngServerMode;
    serveur = await import('./app.config.server');
  });

  afterAll(() => {
    if (modeAvant === undefined) delete global.ngServerMode;
    else global.ngServerMode = modeAvant;
  });

  it('relance l’erreur reçue elle-même, au lieu de la taire', () => {
    const erreur = new Error('Erreur au rendu');
    let relancee: unknown;
    try {
      new serveur.ErreurDeRenduFatale().handleError(erreur);
    } catch (e) {
      relancee = e;
    }
    expect(relancee).toBe(erreur);
  });

  it('est fatal hors développement, pour le build', () => {
    expect(serveur.gestionnaireErreursDeRendu(false)).toEqual([
      { provide: ErrorHandler, useClass: serveur.ErreurDeRenduFatale },
    ]);
  });

  it('laisse le gestionnaire par défaut au serveur de développement', () => {
    expect(serveur.gestionnaireErreursDeRendu(true)).toEqual([]);
  });

  it('ne fournit pas le gestionnaire fatal en mode développement', () => {
    // Les tests tournent en mode développement ; la branche de production ne se prouve que par un
    // build avec une page fautive.
    expect(isDevMode()).toBe(true);
    expect(serveur.config.providers).not.toContainEqual({
      provide: ErrorHandler,
      useClass: serveur.ErreurDeRenduFatale,
    });
  });
});
