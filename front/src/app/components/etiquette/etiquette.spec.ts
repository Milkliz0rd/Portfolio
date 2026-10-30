import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Etiquette, VarianteEtiquette } from './etiquette';

const VARIANTES: VarianteEtiquette[] = ['discrete', 'accent', 'numerotee', 'puce'];

@Component({
  imports: [Etiquette],
  template: `<app-etiquette [variante]="variante()" numero="02">Section</app-etiquette>`,
})
class Hote {
  readonly variante = signal<VarianteEtiquette>('discrete');
}

function rendre(variante: VarianteEtiquette = 'discrete'): HTMLElement {
  const fixture = TestBed.createComponent(Hote);
  fixture.componentInstance.variante.set(variante);
  fixture.detectChanges();
  return (fixture.nativeElement as HTMLElement).querySelector('app-etiquette')!;
}

const variantesPortees = (etiquette: HTMLElement) =>
  [...etiquette.classList].filter((classe) => classe.startsWith('etiquette--'));
const enfants = (etiquette: HTMLElement) =>
  [...etiquette.children].map((enfant) => enfant.className);

describe('Etiquette', () => {
  it('est discrète par défaut ; discrète et accent ne portent que le texte', () => {
    const etiquette = rendre();
    expect(etiquette.classList).toContain('etiquette');
    expect(variantesPortees(etiquette)).toEqual(['etiquette--discrete']);
    expect(enfants(etiquette)).toEqual(['etiquette__texte']);
    expect(etiquette.textContent?.trim()).toBe('Section');
    expect(enfants(rendre('accent'))).toEqual(['etiquette__texte']);
  });

  it.each(VARIANTES)('porte la seule classe de la variante « %s »', (variante) => {
    expect(variantesPortees(rendre(variante))).toEqual([`etiquette--${variante}`]);
  });

  it('numérote : le numéro, puis le trait, élément à part et décoratif, puis le texte', () => {
    const etiquette = rendre('numerotee');
    expect(enfants(etiquette)).toEqual([
      'etiquette__numero',
      'etiquette__trait',
      'etiquette__texte',
    ]);
    expect(etiquette.querySelector('.etiquette__numero')?.textContent).toBe('02');
    const trait = etiquette.querySelector('.etiquette__trait')!;
    expect(trait.getAttribute('aria-hidden')).toBe('true');
    expect(trait.childNodes).toHaveLength(0);
    // Aucun texte propre au composant : le tiret de « 02 — Section » est le trait.
    expect(etiquette.textContent).toBe('02Section');
  });

  it('pose la puce lumineuse avant le texte, décorative', () => {
    const etiquette = rendre('puce');
    expect(enfants(etiquette)).toEqual(['etiquette__puce', 'etiquette__texte']);
    const puce = etiquette.querySelector('.etiquette__puce')!;
    expect(puce.getAttribute('aria-hidden')).toBe('true');
    expect(puce.childNodes).toHaveLength(0);
  });

  it('reste statique : ni rôle, ni focus, ni lien, ni bouton', () => {
    for (const variante of VARIANTES) {
      const etiquette = rendre(variante);
      expect(etiquette.hasAttribute('role')).toBe(false);
      expect(etiquette.hasAttribute('tabindex')).toBe(false);
      expect(etiquette.querySelector('a, button, input, [tabindex]')).toBeNull();
    }
  });

  it('refuse une étiquette numérotée sans numéro', () => {
    const fixture = TestBed.createComponent(Etiquette);
    fixture.componentRef.setInput('variante', 'numerotee');
    expect(() => fixture.detectChanges()).toThrow(/exige son numéro/);
  });
});
