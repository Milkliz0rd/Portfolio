import { TestBed } from '@angular/core/testing';
import parcoursFr from '../../../contenu/fr/parcours.json';
import type { Brut, Parcours } from '../../interfaces/contenu';
import { parcoursDeTest } from '../../testing/contenus-de-test';
import { FICHIER_PARCOURS, LectureParcours } from './parcours';

const lire = (fichier: Brut<Parcours>) => {
  TestBed.configureTestingModule({ providers: [{ provide: FICHIER_PARCOURS, useValue: fichier }] });
  return TestBed.inject(LectureParcours).parcours;
};
const premiereEtape = parcoursDeTest.etapes[0];

describe('LectureParcours', () => {
  it('lit le parcours de la langue du build', () => {
    expect(TestBed.inject(LectureParcours).parcours.etapes).toEqual(parcoursFr.etapes);
  });

  it('range les étapes dans l’ordre reconversion, bac+3, master', () => {
    expect(lire(parcoursDeTest).etapes.map((etape) => etape.type)).toEqual([
      'reconversion',
      'bac+3',
      'master',
    ]);
  });

  it('accepte une étape sans établissement et une date sans mois', () => {
    const reconversion = lire(parcoursDeTest).etapes[0];
    expect(reconversion.etablissement).toBeUndefined();
    expect(reconversion.debut).toEqual({ annee: 2021 });
  });

  it('refuse un type d’étape inconnu', () => {
    const etapes = [{ ...premiereEtape, type: 'doctorat' }];
    expect(() => lire({ ...parcoursDeTest, etapes })).toThrow(
      'parcours.json, etapes[0].type : « doctorat » inconnu',
    );
  });

  it('refuse un état inconnu', () => {
    const etapes = [{ ...premiereEtape, etat: 'en-cours' }];
    expect(() => lire({ ...parcoursDeTest, etapes })).toThrow(
      'etapes[0].etat : « en-cours » inconnu',
    );
  });
});
