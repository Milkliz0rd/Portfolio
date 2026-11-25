import { provideLocationMocks } from '@angular/common/testing';
import { PLATFORM_ID, TransferState } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, type Routes } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Erreur, VARIANTE_SERVIE, varianteDeLAdresse } from './erreur';

const ROUTES: Routes = [
  { path: 'projets/404', component: Erreur, data: { variante: 'projet-inexistant' } },
  { path: '404', component: Erreur, data: { variante: 'adresse-inconnue' } },
  { path: '**', component: Erreur },
];

const texte = (element: Element) => element.textContent?.replace(/\s+/g, ' ').trim();
const consignes = () => [...document.head.querySelectorAll('meta[name="robots"]')];

/** Ouvre l'adresse sur les routes d'erreur et rend la page, avec le harnais pour la quitter. */
async function ouvrir(adresse: string, plateforme?: string) {
  TestBed.configureTestingModule({
    providers: [
      provideRouter(ROUTES),
      provideLocationMocks(),
      ...(plateforme ? [{ provide: PLATFORM_ID, useValue: plateforme }] : []),
    ],
  });
  const harness = await RouterTestingHarness.create();
  const page = await harness.navigateByUrl(adresse, Erreur);
  return { harness, page, element: harness.routeNativeElement! };
}

/** Les retours de la page : libellé et adresse. */
const retours = (element: HTMLElement) =>
  [...element.querySelectorAll('a')].map((lien) => [texte(lien), lien.getAttribute('href')]);

const ACCUEIL = ['Revenir à l’accueil', '/'];
const PROJETS = ['Voir la liste des projets', '/#projets'];

describe('Erreur', () => {
  // La consigne vit dans le document partagé par les tests (Vitest sans isolation) : rien ne reste.
  afterEach(() => {
    consignes().forEach((consigne) => consigne.remove());
  });

  it('dit que la page n’existe pas : le « 404 » décoratif, un seul titre de niveau 1, la phrase', async () => {
    const { element } = await ouvrir('/une-adresse-inconnue');
    const affiche = element.querySelector('p.affiche')!;
    expect([texte(affiche), affiche.getAttribute('aria-hidden')]).toEqual(['404', 'true']);
    expect([...element.querySelectorAll('h1')].map(texte)).toEqual(['Cette page n’existe pas']);
    expect(texte(element.querySelector('.erreur__chapo')!)).toBe(
      'L’adresse demandée ne correspond à aucune page du site.',
    );
    expect(element.querySelector('app-ambiance')?.classList).toContain('ambiance--accueil');
  });

  it.each([
    ['/projets/404', [ACCUEIL, PROJETS]],
    ['/404', [ACCUEIL]],
  ])('prend la variante des données de la route sur %s', async (adresse, attendus) => {
    expect(retours((await ouvrir(adresse)).element)).toEqual(attendus);
  });

  it('suit l’adresse quand le routeur garde la page d’une adresse inconnue à l’autre', async () => {
    const { harness } = await ouvrir('/projets/identifiant-inconnu');
    const page = await harness.navigateByUrl('/une-adresse-inconnue', Erreur);
    expect(retours(harness.routeNativeElement!)).toEqual([ACCUEIL]);
    expect(await harness.navigateByUrl('/projets/autre', Erreur)).toBe(page);
    expect(retours(harness.routeNativeElement!)).toEqual([ACCUEIL, PROJETS]);
  });

  it.each([
    ['/projets/identifiant-inconnu', [ACCUEIL, PROJETS]],
    ['/projets/un/deux', [ACCUEIL, PROJETS]],
    ['/projets', [ACCUEIL]],
    ['/parcours', [ACCUEIL]],
    ['/une/adresse', [ACCUEIL]],
  ])('prend, sans données, la variante de l’adresse sur %s', async (adresse, attendus) => {
    expect(retours((await ouvrir(adresse)).element)).toEqual(attendus);
  });

  it('donne au « projet inexistant » ses deux retours, primaire puis secondaire, flèche après le texte', async () => {
    const { element } = await ouvrir('/projets/404');
    const [accueil, projets] = element.querySelectorAll('a');
    expect(accueil.classList).toContain('bouton--primaire');
    expect(projets.classList).toContain('bouton--secondaire');
    for (const lien of [accueil, projets]) {
      expect(lien.querySelector('.bouton__contenu')?.lastElementChild?.localName).toBe('app-icone');
    }
  });

  it('pose la consigne de non-indexation tant qu’elle est affichée, une seule fois', async () => {
    const { harness } = await ouvrir('/une-adresse-inconnue');
    expect(consignes().map((consigne) => consigne.getAttribute('content'))).toEqual(['noindex']);
    await harness.navigateByUrl('/404', Erreur);
    expect(consignes()).toHaveLength(1);
    TestBed.resetTestingModule();
    expect(consignes()).toEqual([]);
  });

  it('reprend au démarrage la variante du document servi, une fois, puis lit l’adresse', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(ROUTES), provideLocationMocks()] });
    const transfert = TestBed.inject(TransferState);
    transfert.set(VARIANTE_SERVIE, 'projet-inexistant');
    const harness = await RouterTestingHarness.create();
    // /projets/, barre finale comprise, reçoit projets/404.html ; le routeur la lit /projets.
    await harness.navigateByUrl('/projets', Erreur);
    expect(retours(harness.routeNativeElement!)).toEqual([ACCUEIL, PROJETS]);
    expect(transfert.hasKey(VARIANTE_SERVIE)).toBe(false);
    await harness.navigateByUrl('/autre', Erreur);
    expect(retours(harness.routeNativeElement!)).toEqual([ACCUEIL]);
  });

  it('transmet au navigateur, au pré-rendu, la variante de son document', async () => {
    await ouvrir('/projets/404', 'server');
    expect(TestBed.inject(TransferState).get(VARIANTE_SERVIE, null)).toBe('projet-inexistant');
  });
});

describe('varianteDeLAdresse', () => {
  it.each([
    [['projets', 'identifiant-inconnu'], 'projet-inexistant'],
    [['projets', 'un', 'deux'], 'projet-inexistant'],
    [['projets'], 'adresse-inconnue'],
    [['Projets', 'x'], 'adresse-inconnue'],
    [['parcours'], 'adresse-inconnue'],
    [[], 'adresse-inconnue'],
  ] as const)('lit %o en « %s », comme l’hébergeur', (segments, attendue) => {
    expect(varianteDeLAdresse(segments)).toBe(attendue);
  });
});
