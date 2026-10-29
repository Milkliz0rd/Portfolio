import { TestBed } from '@angular/core/testing';
import competencesFr from '../../../contenu/fr/competences.json';
import { competencesDeTest } from '../../testing/contenus-de-test';
import { FICHIER_COMPETENCES, LectureCompetences } from './competences';

const lireDeTest = () => {
  TestBed.configureTestingModule({
    providers: [{ provide: FICHIER_COMPETENCES, useValue: competencesDeTest }],
  });
  return TestBed.inject(LectureCompetences).competences;
};

describe('LectureCompetences', () => {
  it('lit les compétences de la langue du build', () => {
    expect(TestBed.inject(LectureCompetences).competences).toEqual(competencesFr);
  });

  it('range les catégories et leurs compétences par rang', () => {
    const { techniques, humaines } = lireDeTest();
    expect(techniques.map((categorie) => categorie.libelle)).toEqual(['Deuxième', 'Troisième']);
    expect(techniques[1].competences.map((competence) => competence.libelle)).toEqual(['B', 'C']);
    expect(humaines.competences.map((competence) => competence.libelle)).toEqual([
      'Rigueur',
      'Écoute',
    ]);
  });

  it('retire une catégorie sans compétence', () => {
    expect(
      lireDeTest().techniques.find((categorie) => categorie.libelle === 'Vide'),
    ).toBeUndefined();
  });
});
