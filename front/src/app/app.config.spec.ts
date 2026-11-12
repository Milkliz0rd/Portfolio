import { Location } from '@angular/common';
import { provideLocationMocks } from '@angular/common/testing';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, Scroll } from '@angular/router';
import { filter, firstValueFrom } from 'rxjs';
import { App } from './app';
import { routeur } from './app.config';

// Le défilement du routeur (PF-04), avec le vrai routeur, ses vraies routes et sa configuration :
// la feuille rend doux, sous no-preference, tout défilement demandé sans comportement. Les pages
// provisoires n'ont aucun lien interne : le test navigue lui-même et relève ce que reçoit
// window.scrollTo. L'ancre visée est posée dans le document, hors des pages provisoires.
describe('Défilement du routeur', () => {
  let defilements: ScrollToOptions[] = [];
  let router: Router;

  /** Les options de chaque défilement demandé par une navigation, une fois son défilement joué. */
  async function defilementsDe(navigation: () => unknown): Promise<ScrollToOptions[]> {
    defilements = [];
    const defile = firstValueFrom(router.events.pipe(filter((e) => e instanceof Scroll)));
    navigation();
    await defile;
    return defilements;
  }

  /** Simule la position verticale de la page, que le routeur mémorise avant de la quitter. */
  function positionVerticale(y: number): void {
    Object.defineProperty(window, 'scrollY', { configurable: true, value: y });
  }

  beforeEach(async () => {
    vi.spyOn(window, 'scrollTo').mockImplementation((options?: ScrollToOptions | number) => {
      defilements.push(options as ScrollToOptions);
    });
    TestBed.configureTestingModule({ providers: [routeur, provideLocationMocks()] });
    const ancre = document.createElement('div');
    ancre.id = 'suite';
    ancre.getBoundingClientRect = () => ({ top: 640, left: 0 }) as DOMRect;
    document.body.append(document.createElement('app-root'), ancre);
    router = TestBed.inject(Router);
    // Le démarrage de l'application lance la première navigation et le défilement du routeur.
    await defilementsDe(() => TestBed.inject(ApplicationRef).bootstrap(App));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    positionVerticale(0);
    document.body.replaceChildren();
  });

  it('remonte en haut d’un coup à chaque navigation en avant, puis défile doucement vers une ancre', async () => {
    expect(await defilementsDe(() => router.navigateByUrl('/contact'))).toStrictEqual([
      { behavior: 'instant', left: 0, top: 0 },
    ]);
    // Aucun comportement demandé : celui de la feuille, doux sous no-preference.
    expect(await defilementsDe(() => router.navigateByUrl('/contact#suite'))).toStrictEqual([
      { left: 0, top: 640 },
    ]);
  });

  it('restaure d’un coup la position au retour arrière', async () => {
    await defilementsDe(() => router.navigateByUrl('/contact'));
    positionVerticale(480);
    await defilementsDe(() => router.navigateByUrl('/mentions-legales'));
    expect(await defilementsDe(() => TestBed.inject(Location).back())).toStrictEqual([
      { behavior: 'instant', left: 0, top: 480 },
    ]);
  });
});
