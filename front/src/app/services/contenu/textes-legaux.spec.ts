import { TestBed } from '@angular/core/testing';
import textesLegauxFr from '../../../contenu/fr/textes-legaux.json';
import { textesLegauxDeTest } from '../../testing/contenus-de-test';
import { FICHIER_TEXTES_LEGAUX, LectureTextesLegaux } from './textes-legaux';

describe('LectureTextesLegaux', () => {
  it('lit les textes légaux de la langue du build', () => {
    expect(TestBed.inject(LectureTextesLegaux).textesLegaux).toEqual(textesLegauxFr);
  });

  it('accepte un segment sans lien', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: FICHIER_TEXTES_LEGAUX, useValue: textesLegauxDeTest }],
    });
    const [segment] =
      TestBed.inject(LectureTextesLegaux).textesLegaux.informationDonnees[0].paragraphes[0];
    expect(segment).toEqual({ texte: 'Sans lien' });
    expect(segment.lien).toBeUndefined();
  });
});
