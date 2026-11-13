import { Location } from '@angular/common';
import { provideLocationMocks } from '@angular/common/testing';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, Scroll } from '@angular/router';
import { filter, firstValueFrom } from 'rxjs';
import { App } from './app';
import { routeur } from './app.config';

// Le défilement du routeur (PF-06, tableau de défilement), avec le vrai routeur, ses vraies routes et
// sa configuration, l'application démarrée : la page principale rend ses cinq sections à leurs
// ancres. Le test navigue lui-même et relève chaque défilement : window.scrollTo vers une position,
// scrollIntoView puis focus vers un élément. jsdom n'a ni scrollIntoView ni matchMedia : le test les
// pose, puis les retire, comme tout ce qu'il change hors de lui (Vitest tourne sans isolation), dont
// history.scrollRestoration, que le routeur règle et que jsdom ne connaît pas.
// L'adresse du routeur vit dans son Location simulé ; celle que réécrit l'initialiseur, dans le vrai
// window.history de jsdom, que le test relit.

type Defilement = [string, unknown];

const nom = (element: Element) => `#${element.id || element.getAttribute('name')}`;
const versHaut = (behavior: ScrollBehavior, top = 0): Defilement[] => [
  ['fenêtre', { behavior, left: 0, top }],
];
const versElement = (ancre: string, behavior: ScrollBehavior): Defilement[] => [
  [`#${ancre}`, { block: 'start', behavior }],
  [`focus #${ancre}`, { preventScroll: true }],
];

/** Rend de quoi rétablir une propriété de `cible` telle qu'elle est, ou son absence. */
function garder(cible: object, propriete: string): () => void {
  const avant = Object.getOwnPropertyDescriptor(cible, propriete);
  return () =>
    avant
      ? Object.defineProperty(cible, propriete, avant)
      : Reflect.deleteProperty(cible, propriete);
}

/** Pose une propriété sur `cible` et rend de quoi rétablir celle d'avant, ou son absence. */
function poser(cible: object, propriete: string, valeur: unknown): () => void {
  const retablir = garder(cible, propriete);
  Object.defineProperty(cible, propriete, { configurable: true, writable: true, value: valeur });
  return retablir;
}

describe('Défilement du routeur', () => {
  const [adresseDuDocument, etatDuDocument] = [location.href, history.state as unknown];
  let defilements: Defilement[] = [];
  let reduit = false;
  let retablir: (() => unknown)[] = [];
  let router: Router;

  /** Chaque défilement demandé par une navigation, une fois son défilement joué. */
  async function defilementsDe(navigation: () => unknown): Promise<Defilement[]> {
    defilements = [];
    const defile = firstValueFrom(router.events.pipe(filter((e) => e instanceof Scroll)));
    navigation();
    await defile;
    return defilements;
  }

  const aller = (adresse: string) => defilementsDe(() => router.navigateByUrl(adresse));

  /** Simule la position verticale de la page, que le routeur mémorise avant de la quitter. */
  const positionVerticale = (y: number) => retablir.push(poser(window, 'scrollY', y));

  beforeEach(async () => {
    reduit = false;
    retablir = [
      poser(Element.prototype, 'scrollIntoView', function (this: Element, options: unknown) {
        defilements.push([nom(this), options]);
      }),
      poser(window, 'matchMedia', (requete: string) => ({
        matches: reduit && requete === '(prefers-reduced-motion: reduce)',
      })),
      garder(history, 'scrollRestoration'),
    ];
    vi.spyOn(window, 'scrollTo').mockImplementation((options?: ScrollToOptions | number) => {
      defilements.push(['fenêtre', options]);
    });
    vi.spyOn(HTMLElement.prototype, 'focus').mockImplementation(function (
      this: HTMLElement,
      options?: FocusOptions,
    ) {
      defilements.push([`focus ${nom(this)}`, options]);
    });
    TestBed.configureTestingModule({ providers: [routeur, provideLocationMocks()] });
    // Deux éléments que nomme une ancre, hors de la page principale : par l'id, puis par le nom.
    const suite = document.createElement('div');
    suite.id = 'suite';
    const repere = document.createElement('a');
    repere.setAttribute('name', 'repere');
    document.body.append(document.createElement('app-root'), suite, repere);
    router = TestBed.inject(Router);
    // Le démarrage de l'application lance la première navigation, vers la page principale.
    await defilementsDe(() => TestBed.inject(ApplicationRef).bootstrap(App));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    for (const annuler of retablir.reverse()) annuler();
    history.replaceState(etatDuDocument, '', adresseDuDocument);
    document.body.replaceChildren();
  });

  it('va en haut d’un coup vers une autre page sans ancre, depuis la page principale ou vers elle', async () => {
    expect(await aller('/contact')).toStrictEqual(versHaut('instant'));
    expect(await aller('/mentions-legales')).toStrictEqual(versHaut('instant'));
    expect(await aller('/')).toStrictEqual(versHaut('instant'));
  });

  it('va d’un coup sur l’élément d’une ancre vers une autre page, puis lui donne le focus', async () => {
    expect(await aller('/contact#suite')).toStrictEqual(versElement('suite', 'instant'));
    expect(await aller('/mentions-legales#repere')).toStrictEqual(versElement('repere', 'instant'));
    expect(await aller('/#competences')).toStrictEqual(versElement('competences', 'instant'));
  });

  it('défile doucement sur la page principale, vers ses sections comme vers son haut', async () => {
    expect(await aller('/#parcours')).toStrictEqual(versElement('parcours', 'smooth'));
    expect(await aller('/#projets')).toStrictEqual(versElement('projets', 'smooth'));
    // La même adresse : le routeur ignore la navigation, mais demande encore le défilement.
    expect(await aller('/#projets')).toStrictEqual(versElement('projets', 'smooth'));
    expect(await aller('/')).toStrictEqual(versHaut('smooth'));
  });

  it('défile d’un coup sur la page principale quand les animations sont réduites, lues à chaque fois', async () => {
    expect(await aller('/#methode')).toStrictEqual(versElement('methode', 'smooth'));
    reduit = true;
    expect(await aller('/#experience')).toStrictEqual(versElement('experience', 'instant'));
    expect(await aller('/')).toStrictEqual(versHaut('instant'));
  });

  it('rend d’un coup la position mémorisée au retour et à l’avance, sur toute page', async () => {
    const lieu = TestBed.inject(Location);
    positionVerticale(300);
    await aller('/#parcours');
    positionVerticale(900);
    expect(await defilementsDe(() => lieu.back())).toStrictEqual(versHaut('instant', 300));
    expect(await defilementsDe(() => lieu.forward())).toStrictEqual(versHaut('instant', 900));
    await aller('/contact');
    positionVerticale(480);
    await aller('/mentions-legales');
    expect(await defilementsDe(() => lieu.back())).toStrictEqual(versHaut('instant', 480));
  });

  it('va d’un coup en haut au retour sans position mémorisée, comme après un rechargement', async () => {
    // Une entrée d'historique dont le routeur n'a pas mémorisé la position.
    TestBed.inject(Location).replaceState('/', '', { navigationId: 99 });
    await aller('/#parcours');
    expect(await defilementsDe(() => TestBed.inject(Location).back())).toStrictEqual(
      versHaut('instant'),
    );
  });

  it('va en haut d’un coup vers une ancre qui ne nomme rien, puis l’ôte de l’adresse une fois la page chargée', async () => {
    await aller('/mentions-legales');
    // L'adresse et l'état que le routeur aurait écrits dans le navigateur : son Location est simulé.
    history.replaceState({ navigationId: 7 }, '', '/contact#competence');
    const chargement = vi.spyOn(document, 'readyState', 'get').mockReturnValue('loading');
    const remplacer = vi.spyOn(history, 'replaceState');
    expect(await aller('/contact#competence')).toStrictEqual(versHaut('instant'));
    expect(remplacer).not.toHaveBeenCalled();
    chargement.mockReturnValue('complete');
    window.dispatchEvent(new Event('load'));
    expect(remplacer).toHaveBeenCalledExactlyOnceWith({ navigationId: 7 }, '', '/contact');
    expect([location.pathname, location.hash, history.state]).toStrictEqual([
      '/contact',
      '',
      { navigationId: 7 },
    ]);
  });

  it('ôte aussitôt l’ancre qui ne nomme rien d’une page chargée, depuis la page principale aussi, requête gardée', async () => {
    history.replaceState({ navigationId: 3 }, '', '/?vue=1#competence');
    const remplacer = vi.spyOn(history, 'replaceState');
    expect(await aller('/?vue=1#competence')).toStrictEqual(versHaut('instant'));
    expect(remplacer).toHaveBeenCalledExactlyOnceWith({ navigationId: 3 }, '', '/?vue=1');
  });

  it('ne réécrit plus l’adresse si une autre navigation a suivi avant la fin du chargement', async () => {
    const chargement = vi.spyOn(document, 'readyState', 'get').mockReturnValue('loading');
    const remplacer = vi.spyOn(history, 'replaceState');
    await aller('/contact#competence');
    await aller('/mentions-legales');
    chargement.mockReturnValue('complete');
    window.dispatchEvent(new Event('load'));
    expect(remplacer).not.toHaveBeenCalled();
  });
});
