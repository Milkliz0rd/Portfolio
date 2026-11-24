import { Location } from '@angular/common';
import { provideLocationMocks, SpyLocation } from '@angular/common/testing';
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, provideRouter, Router } from '@angular/router';
import { filter, firstValueFrom } from 'rxjs';
import type { CourantLien } from '../../components/lien/lien';
import { LectureProfil } from '../../services/contenu/profil';
import { type Entree, NavigationService } from '../../services/navigation/navigation';
import { Entete } from './entete';

/** L'entrée signalée, posée par le test à la place de services/navigation. */
class NavigationFactice {
  readonly surPrincipale = signal(true);
  readonly signalee = signal<[Entree, CourantLien] | undefined>(['accueil', 'location']);

  courant(entree: Entree): CourantLien | undefined {
    const [signalee, courant] = this.signalee() ?? [];
    return signalee === entree ? courant : undefined;
  }
}

@Component({ template: '' })
class PageVide {}

const LIBELLES = ['Accueil', 'Parcours', 'Compétences', 'Expérience', 'Méthode', 'Projets'];
const ADRESSES = ['/', '/#parcours', '/#competences', '/#experience', '/#methode', '/#projets'];

async function rendre() {
  const fixture = TestBed.createComponent(Entete);
  await fixture.whenStable();
  const entete = fixture.nativeElement as HTMLElement;
  const navigation = TestBed.inject(NavigationService) as unknown as NavigationFactice;
  return {
    entete,
    navigation,
    entrees: [...entete.querySelectorAll<HTMLAnchorElement>('.entete__navigation a')],
    contact: entete.querySelector<HTMLAnchorElement>('.entete__contact')!,
    stable: () => fixture.whenStable(),
  };
}

/**
 * L'aria-current de chaque lien qui en porte un, et le libellé des liens qui portent le repère,
 * hors du menu replié, qui a son propre test.
 */
function signalement(entete: HTMLElement) {
  const liens = [...entete.querySelectorAll('a')].filter(
    (lien) => !lien.closest('app-menu-replie'),
  );
  const texte = (lien: Element) => lien.textContent?.trim();
  return {
    courants: liens.flatMap((lien) => {
      const courant = lien.getAttribute('aria-current');
      return courant ? [[texte(lien), courant]] : [];
    }),
    reperes: liens.filter((lien) => lien.querySelector('.entete__repere')).map(texte),
  };
}

describe('Entete', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: PageVide },
          { path: 'contact', component: PageVide },
        ]),
        provideLocationMocks(),
        { provide: NavigationService, useClass: NavigationFactice },
      ],
    }),
  );

  it('porte la marque, la navigation et « Contact », en vrais liens', async () => {
    const { entete, entrees, contact } = await rendre();
    const marque = entete.querySelector('.entete__marque')!;
    expect(marque.getAttribute('href')).toBe('/');
    expect(marque.querySelector('.entete__nom')?.textContent).toBe(
      TestBed.inject(LectureProfil).profil.nom,
    );
    const monogramme = marque.querySelector('.entete__monogramme')!;
    expect([monogramme.textContent, monogramme.getAttribute('aria-hidden')]).toEqual([
      'AM',
      'true',
    ]);
    expect(entrees.map((lien) => lien.textContent?.trim())).toEqual(LIBELLES);
    expect(entrees.map((lien) => lien.getAttribute('href'))).toEqual(ADRESSES);
    expect(contact.textContent?.trim()).toBe('Contact');
    expect(contact.getAttribute('href')).toBe('/contact');
    expect([...contact.classList]).toEqual(
      expect.arrayContaining(['bouton--primaire', 'bouton--compact']),
    );
  });

  it('nomme sa région et sa navigation ; « Contact » n’est pas dans la navigation', async () => {
    const { entete, contact } = await rendre();
    expect(entete.querySelector('header')?.getAttribute('aria-label')).toBe('En-tête du site');
    expect(entete.querySelector('nav')?.getAttribute('aria-label')).toBe('Sections du site');
    expect(contact.closest('nav')).toBeNull();
  });

  it('porte le menu replié après « Contact », qui reste hors du menu, avec les mêmes entrées', async () => {
    const { entete, entrees, contact } = await rendre();
    const menu = entete.querySelector('app-menu-replie')!;
    expect(contact.nextElementSibling).toBe(menu);
    expect(menu.contains(contact)).toBe(false);
    const decrire = (lien: HTMLAnchorElement) => [
      lien.textContent?.trim(),
      lien.getAttribute('href'),
    ];
    expect([...menu.querySelectorAll('a')].map(decrire)).toEqual(entrees.map(decrire));
  });

  it.each<[[Entree, CourantLien] | undefined, string[][], string[]]>([
    [['accueil', 'location'], [['Accueil', 'location']], ['Accueil']],
    [['methode', 'location'], [['Méthode', 'location']], ['Méthode']],
    [['projets', 'page'], [['Projets', 'page']], ['Projets']],
    [['contact', 'page'], [['Contact', 'page']], ['Contact']],
    [undefined, [], []],
  ])('signale %j par son attribut et le seul repère', async (signalee, courants, reperes) => {
    const { entete, navigation, stable } = await rendre();
    navigation.signalee.set(signalee);
    await stable();
    expect(signalement(entete)).toEqual({ courants, reperes });
  });

  describe('dans le routeur', () => {
    // L'historique simulé (SpyLocation) note « replace: … » quand l'entrée courante est remplacée,
    // l'adresse seule quand une entrée s'ajoute.
    async function cliquer(lien: HTMLAnchorElement): Promise<string[]> {
      const historique = TestBed.inject(Location) as SpyLocation;
      const avant = historique.urlChanges.length;
      const routeur = TestBed.inject(Router);
      const fin = firstValueFrom(routeur.events.pipe(filter((e) => e instanceof NavigationEnd)));
      lien.click();
      await fin;
      return historique.urlChanges.slice(avant);
    }

    it('remplace l’entrée d’historique depuis la page principale, sur ses liens vers elle seuls', async () => {
      const { entete, entrees, contact } = await rendre();
      expect(await cliquer(entrees[4])).toEqual(['replace: /#methode']);
      expect(await cliquer(entete.querySelector('.entete__marque')!)).toEqual(['replace: /']);
      expect(await cliquer(contact)).toEqual(['/contact']);
    });

    it('ajoute une étape d’historique depuis une page à part', async () => {
      const { entete, entrees, navigation, stable } = await rendre();
      navigation.surPrincipale.set(false);
      await stable();
      expect(await cliquer(entrees[1])).toEqual(['/#parcours']);
      expect(await cliquer(entete.querySelector('.entete__marque')!)).toEqual(['/']);
    });
  });
});
