import { Location } from '@angular/common';
import { SpyLocation, provideLocationMocks } from '@angular/common/testing';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router, provideRouter } from '@angular/router';
import { filter, firstValueFrom } from 'rxjs';
import { MouvementService } from './mouvement';

@Component({ template: '' })
class Vide {}

const html = document.documentElement;
let images: FrameRequestCallback[] = [];

/** Joue l'image suivante : les rappels de requestAnimationFrame en attente. */
function imageSuivante(): void {
  const enAttente = images;
  images = [];
  enAttente.forEach((rappel) => rappel(0));
}

/** Simule le type de navigation du premier chargement (PerformanceNavigationTiming). */
function typeDeNavigation(type: string): void {
  Object.defineProperty(performance, 'getEntriesByType', {
    configurable: true,
    value: (nom: string) => (nom === 'navigation' ? [{ type }] : []),
  });
}

function demarrer(): MouvementService {
  const mouvement = TestBed.inject(MouvementService);
  mouvement.demarrer();
  return mouvement;
}

function finDeNavigation(): Promise<unknown> {
  const router = TestBed.inject(Router);
  return firstValueFrom(router.events.pipe(filter((e) => e instanceof NavigationEnd)));
}

describe('MouvementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: Vide },
          { path: 'autre', component: Vide },
        ]),
        provideLocationMocks(),
      ],
    });
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((rappel) => {
      images.push(rappel);
      return images.length;
    });
    typeDeNavigation('navigate');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    Reflect.deleteProperty(performance, 'getEntriesByType');
    html.removeAttribute('class');
    html.removeAttribute('style');
    localStorage.clear();
    images = [];
  });

  describe('sans mv-actif (animations réduites, ou repli des 3 s déjà joué)', () => {
    it('reste inactif et ne pose aucune classe', () => {
      localStorage.setItem('mv-pause', '1');
      const mouvement = demarrer();
      expect(mouvement.actif()).toBe(false);
      expect(mouvement.enPause()).toBe(false);
      expect(html.className).toBe('');
    });
  });

  describe('sous mv-actif', () => {
    beforeEach(() => html.classList.add('mv-actif'));

    it('devient actif et pose mv-pret', () => {
      const mouvement = demarrer();
      expect(mouvement.actif()).toBe(true);
      expect(html.classList.contains('mv-pret')).toBe(true);
      expect(mouvement.modeArrivee()).toBe('anime');
      expect(html.classList.contains('mv-immediat')).toBe(false);
    });

    it('lit les jetons de durée, en secondes comme en millisecondes', () => {
      html.style.setProperty('--delai-cascade', '.08s');
      expect(demarrer().duree('delai-cascade')).toBe(80);
    });

    it('garde la valeur de la charte pour un jeton illisible', () => {
      html.style.setProperty('--delai-cascade', 'illisible');
      expect(demarrer().duree('delai-cascade')).toBe(70);
    });

    it('relit la pause mémorisée', () => {
      localStorage.setItem('mv-pause', '1');
      const mouvement = demarrer();
      expect(mouvement.enPause()).toBe(true);
      expect(html.classList.contains('mv-pause')).toBe(true);
    });

    it('démarre sans pause ni erreur quand le stockage local est indisponible', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new DOMException('indisponible', 'SecurityError');
      });
      const mouvement = demarrer();
      expect(mouvement.enPause()).toBe(false);
      expect(html.classList.contains('mv-pret')).toBe(true);
    });

    it('bascule la pause, sur html et dans le stockage local', () => {
      const mouvement = demarrer();
      mouvement.basculerPause();
      expect([mouvement.enPause(), html.classList.contains('mv-pause')]).toEqual([true, true]);
      expect(localStorage.getItem('mv-pause')).toBe('1');
      mouvement.basculerPause();
      expect([mouvement.enPause(), html.classList.contains('mv-pause')]).toEqual([false, false]);
      expect(localStorage.getItem('mv-pause')).toBe('0');
    });

    it('bascule la pause sans erreur quand le stockage local est indisponible', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('indisponible', 'QuotaExceededError');
      });
      const mouvement = demarrer();
      mouvement.basculerPause();
      expect(mouvement.enPause()).toBe(true);
    });

    it('arrive en mode immédiat après un retour arrière, mv-immediat le temps de deux images', () => {
      typeDeNavigation('back_forward');
      const mouvement = demarrer();
      expect(mouvement.modeArrivee()).toBe('immediat');
      expect(html.classList.contains('mv-immediat')).toBe(true);
      imageSuivante();
      expect(html.classList.contains('mv-immediat')).toBe(true);
      imageSuivante();
      expect(html.classList.contains('mv-immediat')).toBe(false);
      expect(html.classList.contains('mv-pret')).toBe(true);
    });

    it('passe en mode immédiat sur une navigation du routeur déclenchée par popstate', async () => {
      // La navigation du démarrage, qui branche aussi le routeur sur l'historique.
      const router = TestBed.inject(Router);
      const demarrage = finDeNavigation();
      router.initialNavigation();
      await demarrage;
      const mouvement = demarrer();
      await router.navigateByUrl('/autre');
      expect(mouvement.modeArrivee()).toBe('anime');

      const retour = finDeNavigation();
      (TestBed.inject(Location) as SpyLocation).simulateUrlPop('/');
      await retour;
      expect(mouvement.modeArrivee()).toBe('immediat');
      expect(html.classList.contains('mv-immediat')).toBe(true);
      imageSuivante();
      imageSuivante();
      expect(html.classList.contains('mv-immediat')).toBe(false);

      await router.navigateByUrl('/autre');
      expect(mouvement.modeArrivee()).toBe('anime');
      expect(html.classList.contains('mv-immediat')).toBe(false);
    });

    it('passe en mode immédiat pour une page rendue par le cache du navigateur', () => {
      const mouvement = demarrer();
      window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: false }));
      expect(mouvement.modeArrivee()).toBe('anime');
      window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
      expect(mouvement.modeArrivee()).toBe('immediat');
      expect(html.classList.contains('mv-immediat')).toBe(true);
    });
  });
});
