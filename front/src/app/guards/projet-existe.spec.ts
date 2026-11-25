import { Location } from '@angular/common';
import { provideLocationMocks, SpyLocation } from '@angular/common/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, UrlSegment, type CanMatchFn } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../app.routes';
import { FICHIERS_PROJETS } from '../services/contenu/projets';
import { NavigationService } from '../services/navigation/navigation';
import { projetsDeTest } from '../testing/contenus-de-test';
import { projetExiste } from './projet-existe';

// La garde avec des projets de test (« complet », « dernier », « sans-lien »), puis dans le vrai
// routeur, sur les vraies routes, avec un historique simulé (SpyLocation).
describe('projetExiste', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        provideLocationMocks(),
        { provide: FICHIERS_PROJETS, useValue: projetsDeTest },
      ],
    }),
  );
  // La page introuvable pose sa consigne dans le document partagé (Vitest sans isolation).
  afterEach(() => {
    for (const consigne of document.head.querySelectorAll('meta[name="robots"]')) consigne.remove();
  });

  const garder = (...chemins: string[]) =>
    TestBed.runInInjectionContext(() =>
      projetExiste(
        {},
        chemins.map((chemin) => new UrlSegment(chemin, {})),
        {} as Parameters<CanMatchFn>[2],
      ),
    );

  it('ne laisse correspondre que l’identifiant d’un projet des fichiers de contenu', () => {
    expect(projetsDeTest.map(({ identifiant }) => garder('projets', identifiant))).toEqual([
      true,
      true,
      true,
    ]);
    expect([garder('projets', 'inconnu'), garder('projets', 'Complet'), garder('projets')]).toEqual(
      [false, false, false],
    );
  });

  /** Le chemin de la route que le routeur a choisie. */
  const routeChoisie = () =>
    TestBed.inject(Router).routerState.snapshot.root.firstChild?.routeConfig?.path;

  it('mène un projet existant à sa fiche, « Projets » signalé', async () => {
    const navigation = TestBed.inject(NavigationService);
    await RouterTestingHarness.create('/projets/complet');
    expect(routeChoisie()).toBe('projets/:id');
    expect(navigation.entree()).toBe('projets');
  });

  it('laisse un identifiant inconnu à la page introuvable, sans entrée signalée ni redirection', async () => {
    const navigation = TestBed.inject(NavigationService);
    const historique = TestBed.inject(Location) as SpyLocation;
    const harness = await RouterTestingHarness.create();
    const avant = historique.urlChanges.length;
    await harness.navigateByUrl('/projets/identifiant-inconnu');
    expect(routeChoisie()).toBe('**');
    expect(navigation.entree()).toBeUndefined();
    expect(TestBed.inject(Router).url).toBe('/projets/identifiant-inconnu');
    expect(historique.urlChanges.slice(avant)).toEqual(['/projets/identifiant-inconnu']);
  });
});
