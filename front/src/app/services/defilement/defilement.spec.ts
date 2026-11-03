import { TestBed } from '@angular/core/testing';
import { DefilementService } from './defilement';

let images: FrameRequestCallback[] = [];

function imageSuivante(): void {
  const enAttente = images;
  images = [];
  enAttente.forEach((rappel) => rappel(0));
}

/** Les écouteurs de défilement et de redimensionnement posés puis retirés sur la fenêtre. */
function compterEcouteurs() {
  const poses = vi.spyOn(window, 'addEventListener');
  const retires = vi.spyOn(window, 'removeEventListener');
  const nombre = (espion: typeof poses, type: string) =>
    espion.mock.calls.filter(([nom]) => nom === type).length;
  return {
    poses: (type: string) => nombre(poses, type),
    retires: (type: string) => nombre(retires, type),
    options: () => poses.mock.calls.map(([, , options]) => options),
  };
}

describe('DefilementService', () => {
  beforeEach(() => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((rappel) => {
      images.push(rappel);
      return images.length;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    images = [];
  });

  it('pose un seul écouteur passif, au premier abonné, pour tous les abonnés', () => {
    const ecouteurs = compterEcouteurs();
    const defilement = TestBed.inject(DefilementService);
    expect(ecouteurs.poses('scroll')).toBe(0);
    defilement.abonner(() => undefined);
    defilement.abonner(() => undefined);
    expect([ecouteurs.poses('scroll'), ecouteurs.poses('resize')]).toEqual([1, 1]);
    expect(ecouteurs.options()).toEqual([{ passive: true }, { passive: true }]);
  });

  it('retire l’écouteur au départ du dernier abonné, et le repose au suivant', () => {
    const ecouteurs = compterEcouteurs();
    const defilement = TestBed.inject(DefilementService);
    const premier = defilement.abonner(() => undefined);
    const second = defilement.abonner(() => undefined);
    premier();
    premier();
    expect(ecouteurs.retires('scroll')).toBe(0);
    second();
    expect([ecouteurs.retires('scroll'), ecouteurs.retires('resize')]).toEqual([1, 1]);
    defilement.abonner(() => undefined);
    expect(ecouteurs.poses('scroll')).toBe(2);
  });

  it('appelle chaque abonné au plus une fois par image', () => {
    const defilement = TestBed.inject(DefilementService);
    const appel = vi.fn();
    const autre = vi.fn();
    defilement.abonner(appel);
    defilement.abonner(autre);
    window.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('resize'));
    expect(appel).not.toHaveBeenCalled();
    imageSuivante();
    expect([appel.mock.calls.length, autre.mock.calls.length]).toEqual([1, 1]);
    window.dispatchEvent(new Event('scroll'));
    imageSuivante();
    expect(appel).toHaveBeenCalledTimes(2);
  });

  it('n’appelle plus un abonné parti, ni l’image en attente du dernier', () => {
    const defilement = TestBed.inject(DefilementService);
    const annuler = vi.spyOn(window, 'cancelAnimationFrame');
    const appel = vi.fn();
    const desabonner = defilement.abonner(appel);
    window.dispatchEvent(new Event('scroll'));
    const demandee = images.length;
    desabonner();
    expect(annuler).toHaveBeenCalledExactlyOnceWith(demandee);
    // L'image annulée ne compte plus ; un défilement après le départ n'en demande aucune.
    images = [];
    window.dispatchEvent(new Event('scroll'));
    expect(images).toEqual([]);
    expect(appel).not.toHaveBeenCalled();
  });
});
