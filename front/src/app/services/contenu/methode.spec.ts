import { TestBed } from '@angular/core/testing';
import methodeFr from '../../../contenu/fr/methode.json';
import type { Brut, Methode } from '../../interfaces/contenu';
import { methodeDeTest } from '../../testing/contenus-de-test';
import { FICHIER_METHODE, LectureMethode } from './methode';

const lire = (fichier: Brut<Methode>) => {
  TestBed.configureTestingModule({ providers: [{ provide: FICHIER_METHODE, useValue: fichier }] });
  return TestBed.inject(LectureMethode).methode;
};

describe('LectureMethode', () => {
  it('lit les quatre étapes de démonstration de la langue du build', () => {
    expect(TestBed.inject(LectureMethode).methode).toEqual(methodeFr);
    expect(methodeFr.etapes).toHaveLength(4);
  });

  it('garde les étapes dans l’ordre du fichier', () => {
    expect(lire(methodeDeTest).etapes.map((etape) => etape.intitule)).toEqual(['Une', 'Deux']);
  });

  it('refuse une clé d’illustration inconnue', () => {
    const etapes = [{ ...methodeDeTest.etapes[0], illustration: 'photo' }];
    expect(() => lire({ ...methodeDeTest, etapes })).toThrow(
      'methode.json, etapes[0].illustration : « photo » inconnu',
    );
  });
});
