import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IndicateurActivite, TailleIndicateur } from './indicateur-activite';

const TAILLES: TailleIndicateur[] = ['texte', 'bouton', 'grand'];

@Component({
  imports: [IndicateurActivite],
  template: `<p>Chargement <app-indicateur-activite [taille]="taille()" /></p>`,
})
class Hote {
  readonly taille = signal<TailleIndicateur>('texte');
}

function rendre(taille?: TailleIndicateur): HTMLElement {
  const fixture = TestBed.createComponent(Hote);
  if (taille) {
    fixture.componentInstance.taille.set(taille);
  }
  fixture.detectChanges();
  return (fixture.nativeElement as HTMLElement).querySelector('app-indicateur-activite')!;
}

const taillesPortees = (indicateur: HTMLElement) =>
  [...indicateur.classList].filter((classe) => classe.startsWith('indicateur-activite--'));

// Les tailles réelles et la rotation se mesurent dans Chrome : jsdom ne calcule ni l'une ni l'autre.
describe('IndicateurActivite', () => {
  it('est un anneau de texte par défaut, sans classe de taille', () => {
    const indicateur = rendre();
    expect(indicateur.classList).toContain('indicateur-activite');
    expect(taillesPortees(indicateur)).toEqual([]);
  });

  it.each(TAILLES.slice(1))('porte la seule classe de la taille « %s »', (taille) => {
    expect(taillesPortees(rendre(taille))).toEqual([`indicateur-activite--${taille}`]);
  });

  it.each(TAILLES)('reste décoratif pour les lecteurs d’écran en taille « %s »', (taille) => {
    const indicateur = rendre(taille);
    expect(indicateur.getAttribute('aria-hidden')).toBe('true');
    expect(indicateur.hasAttribute('role')).toBe(false);
    expect(indicateur.hasAttribute('tabindex')).toBe(false);
    expect(indicateur.querySelector('.indicateur-activite__anneau')).not.toBeNull();
    expect(indicateur.textContent).toBe('');
  });
});
