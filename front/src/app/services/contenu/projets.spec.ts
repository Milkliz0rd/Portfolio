import { TestBed } from '@angular/core/testing';
import portfolioFr from '../../../contenu/fr/projets/portfolio.json';
import { projetsDeTest } from '../../testing/contenus-de-test';
import { FICHIERS_PROJETS, LectureProjets } from './projets';

const lireDeTest = () => {
  TestBed.configureTestingModule({
    providers: [{ provide: FICHIERS_PROJETS, useValue: projetsDeTest }],
  });
  return TestBed.inject(LectureProjets);
};

describe('LectureProjets', () => {
  it('lit les projets de la langue du build, dont le portfolio', () => {
    expect(TestBed.inject(LectureProjets).trouver('portfolio')).toEqual(portfolioFr);
  });

  it('range les projets par rang', () => {
    const identifiants = lireDeTest().projets.map((projet) => projet.identifiant);
    expect(identifiants).toEqual(['sans-lien', 'complet', 'dernier']);
  });

  it('accepte un projet sans lien, sans vignette et sans capture', () => {
    const projet = lireDeTest().trouver('sans-lien');
    expect(projet?.lienCode).toBeUndefined();
    expect(projet?.vignette).toBeUndefined();
    expect(projet?.captures).toEqual([]);
  });

  it('ne trouve aucun projet pour un identifiant absent', () => {
    expect(lireDeTest().trouver('inconnu')).toBeUndefined();
  });
});
