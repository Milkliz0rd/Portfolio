import { Location } from '@angular/common';
import { provideLocationMocks, SpyLocation } from '@angular/common/testing';
import { Component, type Provider } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, provideRouter, Router } from '@angular/router';
import { filter, firstValueFrom } from 'rxjs';
import experienceFr from '../../../contenu/fr/experience.json';
import type { Accueil } from '../../interfaces/contenu';
import { FICHIER_ACCUEIL } from '../../services/contenu/accueil';
import { FICHIER_EXPERIENCE } from '../../services/contenu/experience';
import { experienceDeTest } from '../../testing/contenus-de-test';
import { CartesSections } from './cartes-sections';

// Un contenu de test : une phrase d'orientation par section, et une autre période que celle du
// contenu réel, pour voir que la carte « Expérience » la tire de experience.json.
const ACCUEIL: Accueil = {
  presentation: ['Présentation de test'],
  orientations: {
    parcours: 'Vers le parcours',
    competences: 'Vers les compétences',
    experience: 'Vers l’expérience',
    methode: 'Vers la méthode',
    projets: 'Vers les projets',
  },
};
const CONTENU_DE_TEST: Provider[] = [
  { provide: FICHIER_ACCUEIL, useValue: ACCUEIL },
  {
    provide: FICHIER_EXPERIENCE,
    useValue: { ...experienceDeTest, periode: { debut: 2031, fin: 2034 } },
  },
];
const ANCRES = ['parcours', 'competences', 'experience', 'methode', 'projets'];

function rendre(providers: Provider[] = []): HTMLElement[] {
  TestBed.configureTestingModule({ providers: [provideRouter([]), ...providers] });
  const fixture = TestBed.createComponent(CartesSections);
  fixture.detectChanges();
  return [...(fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('app-carte')];
}

const texte = (element: Element | null | undefined) =>
  element?.textContent?.replace(/\s+/g, ' ').trim();

describe('CartesSections', () => {
  it('pose une carte pleine par section, dans l’ordre, titrée, numérotée et orientée', () => {
    const cartes = rendre(CONTENU_DE_TEST);
    expect(
      cartes.map((carte) => [
        texte(carte.querySelector('h3')),
        texte(carte.querySelector('.etiquette--numerotee .etiquette__numero')),
        texte(carte.querySelector('.etiquette--numerotee .etiquette__texte')),
        texte(carte.querySelector('.carte__texte')),
      ]),
    ).toEqual([
      ['Parcours', '01', 'Section', 'Vers le parcours'],
      ['Compétences', '02', 'Section', 'Vers les compétences'],
      [
        'Expérience',
        '03',
        'Section',
        'Alternance chez Entreprise de test, 2031–2034. Vers l’expérience',
      ],
      ['Méthode de travail', '04', 'Section', 'Vers la méthode'],
      ['Projets', '05', 'Section', 'Vers les projets'],
    ]);
    for (const carte of cartes) {
      expect(carte.classList).toContain('carte--pleine');
      expect(carte.classList).toContain('carte--interactive');
    }
  });

  it('ouvre la carte « Expérience » sur l’alternance de experience.json', () => {
    const { entreprise, periode } = experienceFr;
    const alternance = `Alternance chez ${entreprise}, ${periode.debut}–${periode.fin}.`;
    const cartes = rendre();
    const carte = cartes[ANCRES.indexOf('experience')];
    expect(texte(carte.querySelector('.carte__texte strong'))).toBe(alternance);
    expect(texte(carte.querySelector('.carte__texte'))?.startsWith(alternance)).toBe(true);
    // Les autres cartes ne la répètent pas.
    expect(cartes.filter((c) => c.querySelector('strong'))).toEqual([carte]);
  });

  it('n’a qu’un lien par carte, porté par son titre, vers / et l’ancre de sa section', () => {
    const cartes = rendre();
    expect(
      cartes.map((carte) => {
        const liens = carte.querySelectorAll('a');
        return [liens.length, liens[0].closest('h3') !== null, liens[0].getAttribute('href')];
      }),
    ).toEqual(ANCRES.map((ancre) => [1, true, `/#${ancre}`]));
  });

  it('a pour action du pied « Voir la section », décorative', () => {
    for (const carte of rendre()) {
      const action = carte.querySelector('.carte__action');
      expect([texte(action), action?.getAttribute('aria-hidden')]).toEqual([
        'Voir la section',
        'true',
      ]);
    }
  });
});

@Component({ template: '' })
class PageVide {}

// Le vrai routeur, sur un historique simulé (SpyLocation) : chaque changement d'adresse y est noté,
// « replace: … » quand l'entrée courante est remplacée, l'adresse seule quand une entrée s'ajoute.
describe('CartesSections dans le routeur', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: '', component: PageVide }]), provideLocationMocks()],
    }),
  );

  it('mène chaque carte à l’ancre de sa section sans étape d’historique (replaceUrl)', async () => {
    const routeur = TestBed.inject(Router);
    const historique = TestBed.inject(Location) as SpyLocation;
    await routeur.navigateByUrl('/');
    const fixture = TestBed.createComponent(CartesSections);
    fixture.detectChanges();
    const avant = historique.urlChanges.length;
    for (const lien of (fixture.nativeElement as HTMLElement).querySelectorAll('a')) {
      const fin = firstValueFrom(routeur.events.pipe(filter((e) => e instanceof NavigationEnd)));
      lien.click();
      await fin;
    }
    expect(historique.urlChanges.slice(avant)).toEqual(
      ANCRES.map((ancre) => `replace: /#${ancre}`),
    );
  });
});
