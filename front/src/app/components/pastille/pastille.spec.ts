import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Pastille, VariantePastille } from './pastille';

const VARIANTES: VariantePastille[] = [
  'neutre',
  'accent',
  'secondaire',
  'succes',
  'attention',
  'erreur',
  'contour',
];

@Component({
  imports: [Pastille],
  template: `<app-pastille [variante]="variante()" [lumineuse]="lumineuse()">Validé</app-pastille>`,
})
class Hote {
  readonly variante = signal<VariantePastille>('neutre');
  readonly lumineuse = signal(false);
}

function rendre(variante: VariantePastille = 'neutre', lumineuse = false): HTMLElement {
  const fixture = TestBed.createComponent(Hote);
  fixture.componentInstance.variante.set(variante);
  fixture.componentInstance.lumineuse.set(lumineuse);
  fixture.detectChanges();
  return (fixture.nativeElement as HTMLElement).querySelector('app-pastille')!;
}

const variantesPortees = (pastille: HTMLElement) =>
  [...pastille.classList].filter((classe) => /^pastille--(?!lumineuse)/.test(classe));

describe('Pastille', () => {
  it('est neutre par défaut, et son point ne rayonne pas', () => {
    const pastille = rendre();
    expect(pastille.classList).toContain('pastille');
    expect(variantesPortees(pastille)).toEqual(['pastille--neutre']);
    expect(pastille.classList).not.toContain('pastille--lumineuse');
  });

  it.each(VARIANTES)('porte la seule classe de la variante « %s »', (variante) => {
    expect(variantesPortees(rendre(variante))).toEqual([`pastille--${variante}`]);
  });

  it.each(VARIANTES)('fait rayonner le point de la variante « %s »', (variante) => {
    const pastille = rendre(variante, true);
    expect(pastille.classList).toContain('pastille--lumineuse');
    expect(variantesPortees(pastille)).toEqual([`pastille--${variante}`]);
  });

  it('porte le sens par le mot, le point restant décoratif', () => {
    const pastille = rendre('succes');
    const [point, mot] = [...pastille.children];
    expect(point.classList).toContain('pastille__point');
    expect(point.getAttribute('aria-hidden')).toBe('true');
    expect(point.childNodes).toHaveLength(0);
    expect(mot.classList).toContain('pastille__mot');
    expect(mot.textContent).toBe('Validé');
    expect(pastille.textContent?.trim()).toBe('Validé');
  });

  it('reste statique : ni rôle, ni focus, ni lien, ni bouton', () => {
    const pastille = rendre('accent', true);
    expect(pastille.hasAttribute('role')).toBe(false);
    expect(pastille.hasAttribute('tabindex')).toBe(false);
    expect(pastille.querySelector('a, button, input, [tabindex]')).toBeNull();
  });

  it('refuse une pastille muette', () => {
    const fixture = TestBed.createComponent(Pastille);
    expect(() => fixture.detectChanges()).toThrow(/pastille muette/);
  });
});
