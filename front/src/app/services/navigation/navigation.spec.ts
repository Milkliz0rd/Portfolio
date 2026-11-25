import { Location } from '@angular/common';
import { provideLocationMocks, SpyLocation } from '@angular/common/testing';
import { TransferState } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { contenuProjets } from '../../../contenu/contenu-langue';
import { routes } from '../../app.routes';
import { type Entree, NavigationService, PAGE_PRERENDUE, SECTIONS } from './navigation';

// services/navigation (PF-06) avec le vrai routeur et les vraies routes : la page principale y
// inscrit ses cinq sections. jsdom ne calcule aucune mise en page : le test pose une page de six
// écrans de 1000 px (l'accueil, puis une section par écran), le haut de chaque section dans la
// fenêtre selon le défilement, et joue lui-même les images. Tout ce qu'il pose hors de lui est
// rétabli après chaque test (Vitest tourne sans isolation).

const ENTREES: Entree[] = ['accueil', ...SECTIONS, 'contact'];
const HAUTEUR = 1000;
/** L'état que le routeur a posé dans l'entrée d'historique. */
const ETAT = { navigationId: 4 };

let images: FrameRequestCallback[] = [];
let retablir: (() => unknown)[] = [];
let mesures = 0;

/** Pose une propriété sur `cible` et garde de quoi rétablir celle d'avant, ou son absence. */
function poser(cible: object, propriete: string, valeur: unknown): void {
  const avant = Object.getOwnPropertyDescriptor(cible, propriete);
  Object.defineProperty(cible, propriete, { configurable: true, writable: true, value: valeur });
  retablir.push(() =>
    avant
      ? Object.defineProperty(cible, propriete, avant)
      : Reflect.deleteProperty(cible, propriete),
  );
}

/** Fait défiler la page jusqu'à `y`, puis joue l'image que le défilement a demandée. */
function defiler(y: number): void {
  poser(window, 'scrollY', y);
  window.dispatchEvent(new Event('scroll'));
  const enAttente = images;
  images = [];
  enAttente.forEach((rappel) => rappel(0));
}

/**
 * Relève les réécritures de l'adresse, que reçoit l'historique simulé du routeur (SpyLocation),
 * comme le navigateur ; le vrai history garde son adresse, son état seul posé puis rétabli.
 */
function suivreLHistorique() {
  const [adresse, etat] = [location.href, history.state as unknown];
  history.replaceState(ETAT, '', adresse);
  retablir.push(() => history.replaceState(etat, '', adresse));
  const lieu = TestBed.inject(Location) as SpyLocation;
  const remplacements = vi
    .spyOn(history, 'replaceState')
    .mockImplementation((etat, _titre, adresse) => lieu.replaceState(String(adresse), '', etat));
  return { remplacements, ajouts: vi.spyOn(history, 'pushState') };
}

const adresses = (espion: ReturnType<typeof suivreLHistorique>['remplacements']) =>
  espion.mock.calls.map(([, , adresse]) => adresse);

/** Les entrées signalées et la valeur de leur aria-current ; les autres n'en ont pas. */
function signalees(navigation: NavigationService) {
  return Object.fromEntries(
    ENTREES.flatMap((entree) => {
      const courant = navigation.courant(entree);
      return courant === undefined ? [] : [[entree, courant]];
    }),
  );
}

describe('NavigationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes), provideLocationMocks()] });
    poser(window, 'innerHeight', HAUTEUR);
    poser(window, 'scrollY', 0);
    poser(document.documentElement, 'scrollHeight', 6 * HAUTEUR);
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: Element,
    ) {
      const rang = SECTIONS.indexOf(this.id as (typeof SECTIONS)[number]);
      mesures++;
      return { top: (rang + 1) * HAUTEUR - window.scrollY } as DOMRect;
    });
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((rappel) => images.push(rappel));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    for (const annuler of retablir.reverse()) annuler();
    [images, retablir, mesures] = [[], [], 0];
  });

  it.each([
    ['/', { accueil: 'location' }, true],
    ['/contact', { contact: 'page' }, false],
    [`/projets/${contenuProjets[0].identifiant}`, { projets: 'page' }, false],
    ['/mentions-legales', {}, false],
    ['/404', {}, false],
    ['/projets/404', {}, false],
    ['/une-adresse-inconnue', {}, false],
  ])('sur %s, signale %o, jamais par null', async (adresse, attendu, principale) => {
    const navigation = TestBed.inject(NavigationService);
    await RouterTestingHarness.create(adresse);
    expect(signalees(navigation)).toEqual(attendu);
    expect(ENTREES.map((entree) => navigation.courant(entree))).not.toContain(null);
    expect(navigation.surPrincipale()).toBe(principale);
  });

  it('suit la section lue sur la page principale, au plus une fois par image', async () => {
    const ecoute = vi.spyOn(window, 'addEventListener');
    const navigation = TestBed.inject(NavigationService);
    await RouterTestingHarness.create('/');
    expect(navigation.entree()).toBe('accueil');
    defiler(HAUTEUR - 401);
    expect(navigation.entree()).toBe('accueil');
    defiler(HAUTEUR - 400);
    expect(signalees(navigation)).toEqual({ parcours: 'location' });
    defiler(3 * HAUTEUR + 100);
    expect(navigation.entree()).toBe('experience');
    // Au bout de la page, la dernière section dont le haut est dans la fenêtre.
    poser(document.documentElement, 'scrollHeight', 5.5 * HAUTEUR);
    defiler(4.5 * HAUTEUR);
    expect(navigation.entree()).toBe('projets');
    // Plusieurs défilements dans la même image : un seul calcul, par un seul écouteur.
    const avant = mesures;
    window.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('scroll'));
    defiler(0);
    expect(mesures - avant, 'cinq sections mesurées une fois').toBe(5);
    expect(ecoute.mock.calls.filter(([type]) => type === 'scroll')).toHaveLength(1);
    expect(navigation.entree()).toBe('accueil');
  });

  it('quitte le suivi et revient à l’accueil quand la page principale part', async () => {
    const retrait = vi.spyOn(window, 'removeEventListener');
    const navigation = TestBed.inject(NavigationService);
    const harnais = await RouterTestingHarness.create('/');
    defiler(2 * HAUTEUR);
    expect(navigation.entree()).toBe('competences');
    harnais.fixture.destroy();
    expect(retrait.mock.calls.filter(([type]) => type === 'scroll')).toHaveLength(1);
    expect(navigation.entree()).toBe('accueil');
    defiler(3 * HAUTEUR);
    expect(navigation.entree()).toBe('accueil');
  });

  it('garde la page signalée par le pré-rendu jusqu’à la première navigation finie', async () => {
    TestBed.inject(TransferState).set(PAGE_PRERENDUE, { principale: false, section: 'contact' });
    const navigation = TestBed.inject(NavigationService);
    expect(signalees(navigation)).toEqual({ contact: 'page' });
    await RouterTestingHarness.create('/mentions-legales');
    expect(signalees(navigation)).toEqual({});
    // La page signalée est transmise au navigateur avec le document pré-rendu.
    expect(TestBed.inject(TransferState).get(PAGE_PRERENDUE, null)).toEqual({
      principale: false,
      section: undefined,
    });
  });

  it('retire l’écouteur de fin de chargement encore en attente quand l’application part', () => {
    vi.spyOn(document, 'readyState', 'get').mockReturnValue('loading');
    const retrait = vi.spyOn(window, 'removeEventListener');
    TestBed.inject(NavigationService).quitterLAncre();
    expect(retrait).not.toHaveBeenCalled();
    TestBed.resetTestingModule();
    expect(retrait.mock.calls.filter(([type]) => type === 'load')).toHaveLength(1);
  });

  it('garde l’adresse sur la section lue une fois la page chargée, sans étape d’historique', async () => {
    const chargement = vi.spyOn(document, 'readyState', 'get').mockReturnValue('loading');
    const navigation = TestBed.inject(NavigationService);
    await RouterTestingHarness.create('/');
    const { remplacements, ajouts } = suivreLHistorique();
    navigation.demarrer();
    defiler(HAUTEUR);
    expect(navigation.entree()).toBe('parcours');
    expect(remplacements, 'rien avant la fin du chargement').not.toHaveBeenCalled();
    chargement.mockReturnValue('complete');
    window.dispatchEvent(new Event('load'));
    defiler(3 * HAUTEUR);
    defiler(3 * HAUTEUR + 100);
    defiler(0);
    // Une réécriture par changement de section, rien quand l'adresse est déjà la bonne.
    expect(remplacements.mock.calls).toEqual([
      [ETAT, '', '/#parcours'],
      [ETAT, '', '/#experience'],
      [ETAT, '', '/'],
    ]);
    expect(ajouts).not.toHaveBeenCalled();
  });

  it('ne touche jamais l’adresse hors de la page principale', async () => {
    const navigation = TestBed.inject(NavigationService);
    await RouterTestingHarness.create('/contact');
    const { remplacements } = suivreLHistorique();
    navigation.demarrer();
    // Retirée après le test : l'inscription garde l'écouteur du DefilementService sur window.
    retablir.push(
      navigation.inscrire(
        SECTIONS.map((id) => Object.assign(document.createElement('section'), { id })),
      ),
    );
    defiler(2 * HAUTEUR);
    expect(remplacements).not.toHaveBeenCalled();
  });

  it.each([
    ['/contact#competence', '/contact'],
    ['/mentions-legales?vue=1#comp%C3%A9tence', '/mentions-legales?vue=1'],
    ['/#competence', '/'],
  ])('ôte à l’ouverture de %s l’ancre qui ne nomme rien', async (ouverte, attendue) => {
    const navigation = TestBed.inject(NavigationService);
    await RouterTestingHarness.create(ouverte);
    const { remplacements } = suivreLHistorique();
    navigation.demarrer();
    expect(adresses(remplacements)).toEqual([attendue]);
  });

  it('garde à l’ouverture l’ancre d’un élément, et donne celle de sa section sur la page principale', async () => {
    const suite = Object.assign(document.createElement('div'), { id: 'suite' });
    document.body.append(suite);
    retablir.push(() => suite.remove());
    const navigation = TestBed.inject(NavigationService);
    await RouterTestingHarness.create('/contact#suite');
    const { remplacements } = suivreLHistorique();
    navigation.demarrer();
    expect(remplacements).not.toHaveBeenCalled();
  });

  it('donne à l’adresse la section d’un élément intérieur juste après l’ouverture', async () => {
    const navigation = TestBed.inject(NavigationService);
    // Le navigateur a ouvert la page sur le titre des compétences.
    poser(window, 'scrollY', 2 * HAUTEUR);
    await RouterTestingHarness.create('/#titre-competences');
    const { remplacements } = suivreLHistorique();
    navigation.demarrer();
    expect(adresses(remplacements)).toEqual(['/#competences']);
  });

  it('attend que le navigateur ait ouvert l’ancre d’une section pour y faire suivre l’adresse', async () => {
    const navigation = TestBed.inject(NavigationService);
    await RouterTestingHarness.create('/#methode');
    const { remplacements } = suivreLHistorique();
    // La page est encore en haut : l'accueil y serait lu, et l'ancre perdue avant d'être ouverte.
    navigation.demarrer();
    defiler(4 * HAUTEUR);
    expect(remplacements).not.toHaveBeenCalled();
    defiler(3 * HAUTEUR);
    expect(adresses(remplacements)).toEqual(['/#experience']);
  });

  it.each(['reload', 'back_forward'])(
    'ouvre d’un coup l’élément de l’ancre après une ouverture de type %s',
    async (type) => {
      poser(performance, 'getEntriesByType', () => [{ type }]);
      const defilements: unknown[] = [];
      poser(Element.prototype, 'scrollIntoView', function (this: Element, options: unknown) {
        defilements.push([this.id, options]);
        poser(window, 'scrollY', 4 * HAUTEUR);
      });
      const navigation = TestBed.inject(NavigationService);
      await RouterTestingHarness.create('/#methode');
      const { remplacements } = suivreLHistorique();
      navigation.demarrer();
      expect(defilements).toEqual([['methode', { block: 'start', behavior: 'instant' }]]);
      expect(remplacements).not.toHaveBeenCalled();
    },
  );
});
