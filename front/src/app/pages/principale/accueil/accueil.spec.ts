import type { Provider } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import type { Accueil as ContenuAccueil, Profil } from '../../../interfaces/contenu';
import { FICHIER_ACCUEIL } from '../../../services/contenu/accueil';
import { FICHIER_EXPERIENCE } from '../../../services/contenu/experience';
import { FICHIER_PROFIL } from '../../../services/contenu/profil';
import { experienceDeTest } from '../../../testing/contenus-de-test';
import { Accueil } from './accueil';

// Un contenu de test, autre que celui du build : chaque texte de l'accueil en vient.
const PROFIL: Profil = {
  nom: 'Nom de test',
  intitule: 'Intitulé de test',
  liens: { github: 'https://example.org/github', linkedin: 'https://example.org/linkedin' },
};
const ACCUEIL: ContenuAccueil = {
  presentation: ['Première phrase.', 'Seconde phrase.'],
  orientations: {
    parcours: 'Vers le parcours',
    competences: 'Vers les compétences',
    experience: 'Vers l’expérience',
    methode: 'Vers la méthode',
    projets: 'Vers les projets',
  },
};
const CONTENU_DE_TEST: Provider[] = [
  { provide: FICHIER_PROFIL, useValue: PROFIL },
  { provide: FICHIER_ACCUEIL, useValue: ACCUEIL },
  {
    provide: FICHIER_EXPERIENCE,
    useValue: { ...experienceDeTest, periode: { debut: 2031, fin: 2034 } },
  },
];

function rendre(providers: Provider[] = []): HTMLElement {
  TestBed.configureTestingModule({ providers: [provideRouter([]), ...providers] });
  const fixture = TestBed.createComponent(Accueil);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

const texte = (element: Element | null | undefined) =>
  element?.textContent?.replace(/\s+/g, ' ').trim();
const precede = (a: Node, b: Node) =>
  (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;

/** Le texte de l'accueil hors de la fenêtre « profil.ts ». */
function texteHorsFenetre(accueil: HTMLElement): string {
  const copie = accueil.cloneNode(true) as HTMLElement;
  copie.querySelector('app-profil-code')?.remove();
  return texte(copie) ?? '';
}

describe('Accueil', () => {
  it('lit dans l’ordre le nom, l’intitulé, la présentation, le contact, puis les cartes', () => {
    const accueil = rendre(CONTENU_DE_TEST);
    expect(accueil.querySelectorAll('h1')).toHaveLength(1);
    const lus = [
      accueil.querySelector('h1'),
      accueil.querySelector('.accueil__intitule'),
      ...accueil.querySelectorAll('.accueil__presentation'),
      accueil.querySelector('a[href="/contact"]'),
    ];
    expect(lus.map(texte)).toEqual([
      'Nom de test',
      'Intitulé de test',
      'Première phrase.',
      'Seconde phrase.',
      'Écrire un message',
    ]);
    const cartes = [...accueil.querySelectorAll('app-carte')];
    expect(cartes).toHaveLength(5);
    [...lus, ...cartes].reduce((precedent, element) => {
      expect(precede(precedent!, element!)).toBe(true);
      return element;
    });
  });

  it('met en avant un seul bouton, un lien vers le contact', () => {
    const primaires = [...rendre().querySelectorAll('.bouton--primaire')];
    expect(primaires.map((b) => [b.localName, b.getAttribute('href'), texte(b)])).toEqual([
      ['a', '/contact', 'Écrire un message'],
    ]);
  });

  it('n’a ni ancre ni numéro, et chaque région est nommée par son titre', () => {
    const accueil = rendre();
    const regions = [...accueil.querySelectorAll('section')];
    expect(regions.map((region) => region.id)).toEqual(['', '']);
    expect(
      regions.map((region) => region.querySelector(`#${region.getAttribute('aria-labelledby')}`)),
    ).toEqual([accueil.querySelector('h1'), accueil.querySelector('h2')]);
    const numerotees = [...accueil.querySelectorAll('.etiquette--numerotee')];
    expect(numerotees.filter((e) => !e.closest('app-cartes-sections'))).toEqual([]);
  });

  it('pose l’ouverture sur l’ambiance d’accueil, et les cartes pleines hors d’elle', () => {
    const accueil = rendre();
    const ambiances = [...accueil.querySelectorAll('app-ambiance')];
    expect(ambiances.map((a) => a.classList.contains('ambiance--accueil'))).toEqual([true]);
    expect(ambiances[0].contains(accueil.querySelector('h1'))).toBe(true);
    expect(ambiances[0].contains(accueil.querySelector('app-profil-code'))).toBe(true);
    const cartes = [...accueil.querySelectorAll('app-carte')];
    expect(cartes.filter((carte) => carte.closest('app-ambiance'))).toEqual([]);
    expect(cartes.every((carte) => carte.classList.contains('carte--pleine'))).toBe(true);
  });

  // Le recouvrement de PF-05 : une information propre à la fenêtre la rendrait non décorative.
  it.each([
    ['de la langue du build', []],
    ['de test', CONTENU_DE_TEST],
  ])(
    'ne montre dans « profil.ts » que ce que l’accueil affiche déjà (contenu %s)',
    (_, providers) => {
      const accueil = rendre(providers);
      const valeurs = [
        ...accueil.querySelectorAll('app-profil-code .fenetre__segment--chaine'),
      ].map((segment) => JSON.parse(segment.textContent ?? '') as string);
      expect(valeurs).toHaveLength(4);
      const lisible = texteHorsFenetre(accueil);
      expect(valeurs.filter((valeur) => !lisible.includes(valeur))).toEqual([]);
    },
  );

  it('n’anime rien : aucune classe ni directive du mouvement', () => {
    const accueil = rendre();
    const animes = [accueil, ...accueil.querySelectorAll('*')].filter(
      (e) =>
        [...e.classList].some((classe) => classe.startsWith('mv-')) ||
        [...e.attributes].some(({ name }) => /^(appmv|data-mv)/i.test(name)),
    );
    expect(animes).toEqual([]);
  });

  it('ne dit aucun âge ni rien qui se périme', () => {
    expect(texte(rendre())).not.toMatch(
      /\b\d+\s*ans\b|actuellement|depuis \d|il y a|en ce moment|aujourd[’']hui|cette année/i,
    );
  });
});
