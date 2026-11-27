import { Location } from '@angular/common';
import { provideLocationMocks, SpyLocation } from '@angular/common/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import type { Capture, Projet as ProjetDuContenu } from '../../interfaces/contenu';
import { FICHIERS_PROJETS } from '../../services/contenu/projets';
import { capturesAffichees, Projet } from './projet';

const texte = (element: Element | null | undefined) =>
  element?.textContent?.replace(/\s+/g, ' ').trim();
const FLECHE_GAUCHE = 'M19 12H5M11 6l-6 6 6 6';

const capture = (n: number): Capture => ({
  fichier: `capture-0${n}.webp`,
  alternatif: `Capture ${n}`,
  largeur: 1280,
  hauteur: 800,
});
const projet = (identifiant: string, autres: Partial<ProjetDuContenu> = {}): ProjetDuContenu => ({
  identifiant,
  titre: `Projet ${identifiant}`,
  description: ['La démarche', 'L’architecture'],
  descriptionCourte: 'Description courte',
  rang: 1,
  captures: [],
  ...autres,
});

// Quatre projets de test : complet (SC-2.0-16), sans lien (SC-2.0-17), sans capture (SC-2.0-18),
// et un dont chaque capture est encore en emplacement, par son fichier, une dimension ou une autre
// marque « [… — …] » (choix 1 de W22).
const PROJETS = [
  projet('complet', { captures: [capture(1), capture(2)], lienCode: 'https://example.org/c' }),
  projet('sans-lien', { captures: [capture(1)] }),
  projet('sans-capture', { lienCode: 'https://example.org/s' }),
  projet('emplacement', {
    captures: [
      { ...capture(1), fichier: '[C-05 — capture 1]', largeur: '[C-05 — capture 1]' },
      { ...capture(2), hauteur: '[C-05 — capture 2]' },
      { ...capture(3), fichier: '[capture à fournir — A-12]' },
    ],
    lienCode: 'https://example.org/e',
  }),
];

/** La fiche à cette adresse, dans le vrai routeur, avec un historique simulé (SpyLocation). */
async function ouvrir(adresse: string) {
  TestBed.configureTestingModule({
    providers: [
      provideRouter([
        { path: '', children: [] },
        { path: 'projets/:id', component: Projet },
      ]),
      provideLocationMocks(),
      { provide: FICHIERS_PROJETS, useValue: PROJETS },
    ],
  });
  const harness = await RouterTestingHarness.create();
  const fiche = await harness.navigateByUrl(adresse, Projet);
  return { harness, fiche, element: harness.routeNativeElement! };
}

/** Les blocs de la fiche dans l'ordre du document : titre, description, captures, code, retour. */
const blocs = (element: HTMLElement) =>
  [...element.querySelectorAll('h1, .projet__suite > *')].map((bloc) =>
    bloc.localName === 'h1' ? 'titre' : bloc.className.replace(/^projet__/, ''),
  );

describe('Projet', () => {
  it('porte le seul titre de niveau 1, le titre du projet, sous l’étiquette « Projets » sans numéro', async () => {
    const { element } = await ouvrir('/projets/complet');
    expect([...element.querySelectorAll('h1')].map(texte)).toEqual(['Projet complet']);
    const entete = element.querySelector('app-entete-section')!;
    expect(entete.querySelector('h1')).not.toBeNull();
    expect(entete.classList).not.toContain('entete-section--bloc');
    expect(texte(entete.querySelector('app-etiquette.etiquette--accent'))).toBe('Projets');
    expect(element.querySelector('.etiquette--numerotee')).toBeNull();
    const paragraphes = element.querySelectorAll('.projet__description > p');
    expect([...paragraphes].map(texte)).toEqual(['La démarche', 'L’architecture']);
  });

  it.each([
    ['complet', ['titre', 'description', 'captures', 'actions', 'retour']],
    ['sans-lien', ['titre', 'description', 'captures', 'retour']],
    ['sans-capture', ['titre', 'description', 'actions', 'retour']],
    ['emplacement', ['titre', 'description', 'actions', 'retour']],
  ])('donne pour le projet « %s », dans l’ordre, %j', async (identifiant, attendus) => {
    const { element } = await ouvrir(`/projets/${identifiant}`);
    expect(blocs(element)).toEqual(attendus);
  });

  it('montre chaque capture en fenêtre capture : WebP du dossier du projet, dimensions, texte alternatif, à la demande', async () => {
    const { element } = await ouvrir('/projets/complet');
    expect(texte(element.querySelector('.projet__captures > h2'))).toBe('Captures');
    const fenetres = [...element.querySelectorAll('.projet__grille > li > app-fenetre')];
    const titres = fenetres.map((fenetre) => texte(fenetre.querySelector('.fenetre__titre')));
    expect(titres).toEqual(['capture-01', 'capture-02']);
    const image = fenetres[0].querySelector('img')!;
    expect(
      ['src', 'width', 'height', 'alt', 'loading'].map((nom) => image.getAttribute(nom)),
    ).toEqual(['/images/projets/complet/capture-01.webp', '1280', '800', 'Capture 1', 'lazy']);
  });

  it('mène au code source par un bouton primaire, dans un nouvel onglet (SC-2.0-16)', async () => {
    const { element } = await ouvrir('/projets/complet');
    const bouton = element.querySelector<HTMLAnchorElement>('.projet__actions > a')!;
    expect(bouton.classList).toContain('bouton--primaire');
    expect(bouton.getAttribute('href')).toBe('https://example.org/c');
    expect(bouton.getAttribute('target')).toBe('_blank');
    expect(bouton.getAttribute('rel')?.split(' ').sort()).toEqual(['noopener', 'noreferrer']);
    expect(texte(bouton)).toBe('Voir le code source (nouvel onglet)');
  });

  it('sans lien vers le code source, n’affiche ni lien ni bouton de code source (SC-2.0-17)', async () => {
    const { element } = await ouvrir('/projets/sans-lien');
    expect(element.querySelector('.bouton, [target]')).toBeNull();
    expect(element.querySelectorAll('a')).toHaveLength(1);
  });

  // SC-2.0-18, et le choix 1 : une capture en emplacement, comme s'il n'y en avait aucune.
  it.each(['sans-capture', 'emplacement'])(
    'n’affiche pour « %s » aucune zone de captures : ni titre, ni grille, ni fenêtre, ni image',
    async (identifiant) => {
      const { element } = await ouvrir(`/projets/${identifiant}`);
      expect(element.querySelector('h2, ul, app-fenetre, figure, img')).toBeNull();
      expect(texte(element)).not.toMatch(/Captures|\[/);
    },
  );

  it('ramène à la section des projets par un lien d’action retour, la flèche gauche avant le texte', async () => {
    const { element } = await ouvrir('/projets/complet');
    const retour = element.querySelector<HTMLAnchorElement>('.projet__retour > a')!;
    expect(retour.getAttribute('href')).toBe('/#projets');
    expect(retour.classList).toContain('lien--retour');
    expect(retour.classList).toContain('lien--action');
    // Choix C7 : la flèche gauche, seule icône du lien, avant le texte.
    expect(retour.firstElementChild?.querySelector('path')?.getAttribute('d')).toBe(FLECHE_GAUCHE);
    expect(retour.querySelectorAll('app-icone')).toHaveLength(1);
    expect(texte(retour)).toBe('Retour à la liste des projets');
  });

  it('revient par une navigation ordinaire du routeur vers /#projets, qui ajoute une étape', async () => {
    const { harness, element } = await ouvrir('/projets/complet');
    const historique = TestBed.inject(Location) as SpyLocation;
    const avant = historique.urlChanges.length;
    element.querySelector<HTMLAnchorElement>('.projet__retour > a')!.click();
    await harness.fixture.whenStable();
    const routeur = TestBed.inject(Router);
    expect([routeur.url, routeur.parseUrl(routeur.url).fragment]).toEqual(['/#projets', 'projets']);
    expect(historique.urlChanges.slice(avant)).toEqual(['/#projets']);
  });

  it('suit l’identifiant de l’adresse : la même fiche passe d’un projet à l’autre', async () => {
    const { harness, fiche, element } = await ouvrir('/projets/complet');
    expect(await harness.navigateByUrl('/projets/sans-capture', Projet)).toBe(fiche);
    expect(texte(element.querySelector('h1'))).toBe('Projet sans-capture');
    expect(element.querySelector('app-fenetre')).toBeNull();
  });
});

describe('capturesAffichees', () => {
  it.each([
    ['son fichier', { fichier: '[C-05 — capture 1]' }],
    ['une autre marque sur son fichier', { fichier: '[capture à fournir — A-12]' }],
    ['sa largeur', { largeur: '[C-05 — capture 1]' }],
    ['sa hauteur', { hauteur: '[C-05 — capture 1]' }],
  ])(
    'écarte une capture en emplacement par %s, et garde les autres dans leur ordre',
    (_, champ) => {
      const captures = [capture(1), { ...capture(2), ...champ }, capture(3)];
      const titres = capturesAffichees(projet('essai', { captures })).map(({ titre }) => titre);
      expect(titres).toEqual(['capture-01', 'capture-03']);
    },
  );

  it('garde une capture fournie, même si son texte alternatif est encore un emplacement', () => {
    const captures = [{ ...capture(1), alternatif: '[C-05 — alternatif]' }];
    const [{ source, alternatif }] = capturesAffichees(projet('essai', { captures }));
    expect([source, alternatif]).toEqual([
      '/images/projets/essai/capture-01.webp',
      '[C-05 — alternatif]',
    ]);
  });
});
