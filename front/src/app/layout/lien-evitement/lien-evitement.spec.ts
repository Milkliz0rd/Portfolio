import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LienEvitement } from './lien-evitement';

@Component({
  imports: [LienEvitement],
  template: `<app-lien-evitement cible="contenu" />
    <main id="contenu" tabindex="-1"></main>`,
})
class Hote {}

// jsdom n'a pas scrollIntoView : le test le pose sur le seul contenu principal de son hôte.
async function rendre() {
  const fixture = TestBed.createComponent(Hote);
  await fixture.whenStable();
  const page = fixture.nativeElement as HTMLElement;
  const contenu = page.querySelector('main')!;
  const defilements: unknown[] = [];
  contenu.scrollIntoView = (options) => defilements.push(options);
  return { lien: page.querySelector('a')!, contenu, defilements };
}

/**
 * Clique le lien et rend vrai si la page a empêché le navigateur de suivre l'ancre. L'écoute du
 * document, qui passe après celle du lien, l'empêche ensuite de toute façon : jsdom suivrait
 * l'ancre, et changerait l'adresse de tous les tests.
 */
function cliquer(lien: HTMLAnchorElement, touches: MouseEventInit = {}): boolean {
  let empeche = false;
  const relever = (clic: Event) => {
    empeche = clic.defaultPrevented;
    clic.preventDefault();
  };
  document.addEventListener('click', relever);
  lien.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, ...touches }));
  document.removeEventListener('click', relever);
  return empeche;
}

describe('LienEvitement', () => {
  afterEach(() => vi.restoreAllMocks());

  it('mène au contenu principal par une ancre, qui sert sans script', async () => {
    const { lien } = await rendre();
    expect(lien.textContent?.trim()).toBe('Aller au contenu');
    expect(lien.getAttribute('href')).toBe('#contenu');
  });

  it('fait défiler le contenu principal et lui donne le focus, sans toucher l’adresse ni l’historique', async () => {
    const { lien, contenu, defilements } = await rendre();
    const [adresse, etapes] = [location.href, history.length];
    const historique = [vi.spyOn(history, 'pushState'), vi.spyOn(history, 'replaceState')];
    expect(cliquer(lien)).toBe(true);
    expect(defilements).toEqual([{ block: 'start' }]);
    expect(document.activeElement).toBe(contenu);
    expect([location.href, history.length]).toEqual([adresse, etapes]);
    for (const espion of historique) expect(espion).not.toHaveBeenCalled();
  });

  it('laisse au navigateur un clic avec une touche de modification', async () => {
    const { lien, defilements } = await rendre();
    expect(cliquer(lien, { ctrlKey: true })).toBe(false);
    expect(defilements).toEqual([]);
  });
});
