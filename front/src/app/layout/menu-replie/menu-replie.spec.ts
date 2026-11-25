import { Location } from '@angular/common';
import { provideLocationMocks, SpyLocation } from '@angular/common/testing';
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, provideRouter, Router } from '@angular/router';
import { filter, firstValueFrom } from 'rxjs';
import type { CourantLien } from '../../components/lien/lien';
import { type Entree, NavigationService } from '../../services/navigation/navigation';
import { entreesNavigation } from '../entete/entrees';
import { MenuReplie } from './menu-replie';

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

const ADRESSES = ['/', '/#parcours', '/#competences', '/#experience', '/#methode', '/#projets'];

async function rendre() {
  const fixture = TestBed.createComponent(MenuReplie);
  await fixture.whenStable();
  const hote = fixture.nativeElement as HTMLElement;
  return {
    fixture,
    menu: hote.querySelector('details')!,
    bouton: hote.querySelector('summary')!,
    panneau: hote.querySelector('nav')!,
    liens: [...hote.querySelectorAll<HTMLAnchorElement>('nav a')],
    navigation: TestBed.inject(NavigationService) as unknown as NavigationFactice,
    stable: () => fixture.whenStable(),
  };
}

describe('MenuReplie', () => {
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

  it('est un details fermé, dont le résumé est le bouton « Menu », qui commande le panneau', async () => {
    const { menu, bouton, panneau } = await rendre();
    expect(menu.open).toBe(false);
    expect(bouton.parentElement).toBe(menu);
    expect(bouton.querySelector('.masque-visuellement')?.textContent).toBe('Menu');
    expect(bouton.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(2);
    expect(panneau.id).not.toBe('');
    expect(bouton.getAttribute('aria-controls')).toBe(panneau.id);
    expect(panneau.getAttribute('aria-label')).toBe('Sections du site, menu');
    expect([panneau.getAttribute('role'), panneau.getAttribute('aria-modal')]).toEqual([
      null,
      null,
    ]);
  });

  it('liste les entrées de la navigation complète, en vrais liens', async () => {
    const { liens } = await rendre();
    const libelles = entreesNavigation().map((entree) => entree.libelle);
    expect(liens.map((lien) => lien.textContent?.trim())).toEqual(libelles);
    expect(liens.map((lien) => lien.getAttribute('href'))).toEqual(ADRESSES);
  });

  it.each<[[Entree, CourantLien] | undefined, string[][]]>([
    [['accueil', 'location'], [['Accueil', 'location']]],
    [['methode', 'location'], [['Méthode', 'location']]],
    [['projets', 'page'], [['Projets', 'page']]],
    [['contact', 'page'], []],
    [undefined, []],
  ])('signale %j par son attribut et le seul repère', async (signalee, courants) => {
    const { liens, navigation, stable } = await rendre();
    navigation.signalee.set(signalee);
    await stable();
    const texte = (lien: Element) => lien.textContent?.trim();
    expect(
      liens.flatMap((lien) => {
        const courant = lien.getAttribute('aria-current');
        return courant ? [[texte(lien), courant]] : [];
      }),
    ).toEqual(courants);
    const reperes = liens.filter((lien) => lien.querySelector('.menu-replie__repere'));
    expect(reperes.map(texte)).toEqual(courants.map(([libelle]) => libelle));
  });

  it('garde ouvert un panneau ouvert, d’un rendu à l’autre (open n’est jamais lié)', async () => {
    const { menu, navigation, stable } = await rendre();
    menu.open = true;
    navigation.signalee.set(['parcours', 'location']);
    await stable();
    expect(menu.open).toBe(true);
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

    it('remplace l’entrée d’historique depuis la page principale', async () => {
      const { liens } = await rendre();
      expect(await cliquer(liens[4])).toEqual(['replace: /#methode']);
      expect(await cliquer(liens[0])).toEqual(['replace: /']);
    });

    it('ajoute une étape d’historique depuis une page à part', async () => {
      const { liens, navigation, stable } = await rendre();
      navigation.surPrincipale.set(false);
      await stable();
      expect(await cliquer(liens[1])).toEqual(['/#parcours']);
    });
  });
});
