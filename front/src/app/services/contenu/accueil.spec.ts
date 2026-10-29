import { TestBed } from '@angular/core/testing';
import accueilFr from '../../../contenu/fr/accueil.json';
import { LectureAccueil } from './accueil';

describe('LectureAccueil', () => {
  it('lit l’accueil de la langue du build', () => {
    expect(TestBed.inject(LectureAccueil).accueil).toEqual(accueilFr);
  });
});
