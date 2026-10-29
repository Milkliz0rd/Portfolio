import { TestBed } from '@angular/core/testing';
import experienceFr from '../../../contenu/fr/experience.json';
import { experienceDeTest } from '../../testing/contenus-de-test';
import { FICHIER_EXPERIENCE, LectureExperience } from './experience';

describe('LectureExperience', () => {
  it('lit l’alternance de la langue du build', () => {
    expect(TestBed.inject(LectureExperience).experience).toEqual(experienceFr);
  });

  it('refuse une clé de volet inconnue', () => {
    const volets = [{ ...experienceDeTest.volets[0], cle: 'devops' }];
    TestBed.configureTestingModule({
      providers: [{ provide: FICHIER_EXPERIENCE, useValue: { ...experienceDeTest, volets } }],
    });
    expect(() => TestBed.inject(LectureExperience)).toThrow('volets[0].cle : « devops » inconnu');
  });
});
