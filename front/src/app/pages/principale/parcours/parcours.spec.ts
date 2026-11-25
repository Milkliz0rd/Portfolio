import { TestBed } from '@angular/core/testing';
import parcoursFr from '../../../../contenu/fr/parcours.json';
import { formaterPeriode } from '../../../components/frise/frise';
import type { Brut, Parcours as ContenuParcours } from '../../../interfaces/contenu';
import { FICHIER_PARCOURS } from '../../../services/contenu/parcours';
import { parcoursDeTest } from '../../../testing/contenus-de-test';
import { Parcours } from './parcours';

// Un contenu de test, autre que celui du build, ses étapes dans le désordre (master, reconversion,
// bac+3) : chaque texte de la section en vient, et la section les montre dans l'ordre.
const CONTENU_DE_TEST: Brut<ContenuParcours> = {
  ...parcoursDeTest,
  introduction: 'Introduction de test.',
  orientation: ['Premier paragraphe d’orientation.', 'Second paragraphe, qui cite le master.'],
};

function rendre(fichier?: Brut<ContenuParcours>): HTMLElement {
  if (fichier) {
    TestBed.configureTestingModule({
      providers: [{ provide: FICHIER_PARCOURS, useValue: fichier }],
    });
  }
  const fixture = TestBed.createComponent(Parcours);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

const tous = (hote: Element, selecteur: string) => [...hote.querySelectorAll(selecteur)];
const texte = (element: Element | null | undefined) =>
  element?.textContent?.replace(/\s+/g, ' ').trim();
const precede = (a: Node, b: Node) =>
  (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
/** Le texte visible de l'élément, sans son texte masqué (l'annonce de l'étape mise en avant). */
function texteVisible(element: Element | null): string | undefined {
  const copie = element?.cloneNode(true) as Element | undefined;
  copie?.querySelector('.masque-visuellement')?.remove();
  return texte(copie);
}
/** Chaque étape de la frise : sa période exacte (espaces insécables comprises), son intitulé. */
const etapes = (section: Element) =>
  tous(section, '.frise__etape').map((etape) => ({
    periode: etape.querySelector('.frise__periode')?.textContent,
    intitule: texteVisible(etape.querySelector('.frise__intitule')),
    detail: texte(etape.querySelector('.frise__detail')),
  }));

describe('Parcours', () => {
  it('lit dans l’ordre l’en-tête numéroté 01, le titre, l’introduction, l’orientation, puis la frise', () => {
    const section = rendre(CONTENU_DE_TEST);
    const etiquette = section.querySelector('app-entete-section .etiquette--numerotee');
    expect(texte(etiquette?.querySelector('.etiquette__numero'))).toBe('01');
    expect(texte(etiquette?.querySelector('.etiquette__texte'))).toBe('Parcours');
    const lus = [
      etiquette,
      section.querySelector('h2'),
      section.querySelector('.entete-section__chapo'),
      section.querySelector('.parcours__orientation .etiquette--accent'),
      ...tous(section, '.parcours__texte p'),
      section.querySelector('app-frise ol'),
    ];
    expect(lus.slice(1, -1).map(texte)).toEqual([
      'Parcours',
      'Introduction de test.',
      'Orientation',
      'Premier paragraphe d’orientation.',
      'Second paragraphe, qui cite le master.',
    ]);
    lus.reduce((precedent, element) => {
      expect(precede(precedent!, element!)).toBe(true);
      return element;
    });
  });

  it('n’a qu’un titre, de niveau 2, à la taille titre-1, dont le texte porte l’id titre-parcours', () => {
    const section = rendre();
    const titres = tous(section, 'h1, h2, h3, h4, h5, h6, [role="heading"]');
    expect(titres.map((titre) => [titre.localName, texte(titre)])).toEqual([['h2', 'Parcours']]);
    expect(titres[0].classList).toContain('entete-section__titre');
    expect(section.querySelector('app-entete-section')?.classList).not.toContain(
      'entete-section--bloc',
    );
    const nomme = section.querySelector('#titre-parcours');
    expect(nomme?.closest('h2')).toBe(titres[0]);
    expect(texte(nomme)).toBe('Parcours');
  });

  it('pose les trois étapes dans l’ordre reconversion, bac+3, master, même rangées autrement', () => {
    const section = rendre(CONTENU_DE_TEST);
    expect(etapes(section).map(({ intitule }) => intitule)).toEqual([
      'Reconversion',
      'Licence',
      'Master',
    ]);
    expect(section.querySelector('app-frise ol')?.getAttribute('aria-label')).toBe(
      'Étapes du parcours',
    );
  });

  it('donne au bac+3 son type et son établissement, et aux autres étapes aucun détail', () => {
    expect(etapes(rendre(CONTENU_DE_TEST)).map(({ detail }) => detail)).toEqual([
      undefined,
      'Bac+3 · École',
      undefined,
    ]);
  });

  it('écrit chaque période depuis le contenu, avec un début et une fin, selon la langue', () => {
    expect(etapes(rendre(CONTENU_DE_TEST)).map(({ periode }) => periode)).toEqual([
      '2021–2022',
      '2022–2025',
      '09/2025\u00a0– 2028',
    ]);
  });

  it('rend tels quels les emplacements de C-01 du build : aucune date inventée ni laissée vide', () => {
    const lues = etapes(rendre()).map(({ periode }) => periode);
    const attendues = parcoursFr.etapes.map(({ debut, fin }) => formaterPeriode(debut, fin, 'fr'));
    expect(lues).toEqual(attendues);
    for (const { debut, fin } of parcoursFr.etapes) {
      for (const date of [debut, fin].filter((d) => typeof d === 'string')) {
        expect(lues.join(' ')).toContain(date);
      }
    }
    expect(lues.every((periode) => /\S\u00a0?–\s?\S/.test(periode ?? ''))).toBe(true);
  });

  it('reprend l’état de chaque étape du contenu, la mise en avant annoncée par un texte', () => {
    const section = rendre(CONTENU_DE_TEST);
    const etats = tous(section, '.frise__etape').map((etape) =>
      ['accomplie', 'mise-en-avant', 'prevue'].find((etat) =>
        etape.classList.contains(`frise__etape--${etat}`),
      ),
    );
    expect(etats).toEqual(['accomplie', 'mise-en-avant', 'prevue']);
    expect(texte(section.querySelector('.frise__etape--mise-en-avant .masque-visuellement'))).toBe(
      '(étape mise en avant)',
    );
  });

  it('ne lit jamais la date du jour', () => {
    // Horloge factice, rendue dans tous les cas : Vitest tourne sans isolation (#169).
    vi.useFakeTimers({ toFake: ['Date'] });
    try {
      vi.setSystemTime(Date.UTC(2010, 0, 1));
      const avant = rendre(CONTENU_DE_TEST).innerHTML;
      vi.setSystemTime(Date.UTC(2045, 5, 15));
      expect(rendre().innerHTML).toBe(avant);
    } finally {
      vi.useRealTimers();
    }
  });

  it('n’anime rien : aucune classe ni directive du mouvement', () => {
    const section = rendre();
    const animes = [section, ...section.querySelectorAll('*')].filter(
      (e) =>
        [...e.classList].some((classe) => classe.startsWith('mv-')) ||
        [...e.attributes].some(({ name }) => /^(appmv|data-mv)/i.test(name)),
    );
    expect(animes).toEqual([]);
  });

  it.each([
    ['de la langue du build', undefined],
    ['de test', CONTENU_DE_TEST],
  ])('ne dit aucune date ni durée relative (contenu %s)', (_, fichier) => {
    expect(texte(rendre(fichier))).not.toMatch(
      /\b\d+\s*(ans?|mois|années?)\b|actuellement|en cours|depuis \d|il y a|en ce moment|aujourd[’']hui|cette année/i,
    );
  });
});
