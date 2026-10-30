import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, RouterLink } from '@angular/router';
import { Lien, VarianteLien } from './lien';

const VARIANTES: VarianteLien[] = ['texte', 'discret', 'action', 'navigation', 'externe'];

@Component({
  imports: [Lien, RouterLink],
  template: `
    <a appLien [variante]="variante()" [courant]="courant()" routerLink="/parcours">
      Voir la fiche
    </a>
    <a appLien variante="externe" href="https://example.org/profil">Profil externe</a>
  `,
})
class Hote {
  readonly variante = signal<VarianteLien>('texte');
  readonly courant = signal(false);
}

// Le premier lien, de la variante demandée, mène à une page du site ; le second hors du site.
function rendre(variante: VarianteLien = 'texte', courant = false): HTMLAnchorElement[] {
  const fixture = TestBed.createComponent(Hote);
  fixture.componentInstance.variante.set(variante);
  fixture.componentInstance.courant.set(courant);
  fixture.detectChanges();
  return [...(fixture.nativeElement as HTMLElement).querySelectorAll('a')];
}

const variantesPortees = (lien: HTMLElement) =>
  [...lien.classList].filter((classe) => classe.startsWith('lien--'));
const texte = (lien: HTMLElement) => lien.textContent?.replace(/\s+/g, ' ').trim();

describe('Lien', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  it.each(VARIANTES)('reste un lien natif du routeur, de la seule variante « %s »', (variante) => {
    const [lien] = rendre(variante);
    expect(lien.localName).toBe('a');
    expect(lien.getAttribute('href')).toBe('/parcours');
    expect(lien.classList).toContain('lien');
    expect(variantesPortees(lien)).toEqual([`lien--${variante}`]);
  });

  it.each(VARIANTES.filter((variante) => variante !== 'externe'))(
    'ouvre « %s » dans l’onglet courant, sans icône ni texte ajouté',
    (variante) => {
      const [lien] = rendre(variante);
      expect(lien.hasAttribute('target')).toBe(false);
      expect(lien.hasAttribute('rel')).toBe(false);
      if (variante !== 'action') {
        expect(lien.querySelector('svg')).toBeNull();
      }
      expect(texte(lien)).toBe('Voir la fiche');
    },
  );

  it('porte la flèche après le texte du lien d’action, décorative', () => {
    const [lien] = rendre('action');
    const icones = lien.querySelectorAll('app-icone');
    expect(icones).toHaveLength(1);
    expect(lien.lastElementChild).toBe(icones[0]);
    expect(icones[0].querySelector('path')?.getAttribute('d')).toBe('M5 12h14M13 6l6 6-6 6');
    expect(icones[0].querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('ouvre le lien externe dans un nouvel onglet, sans lien vers la page d’origine', () => {
    const [, lien] = rendre();
    expect(lien.getAttribute('target')).toBe('_blank');
    expect(lien.getAttribute('rel')?.split(' ').sort()).toEqual(['noopener', 'noreferrer']);
  });

  it('annonce le lien externe par la flèche oblique, décorative, et un texte masqué', () => {
    const [, lien] = rendre();
    const svg = lien.querySelector('app-icone svg');
    expect(svg?.querySelector('path')?.getAttribute('d')).toBe('M9 5h10v10M19 5 6 18');
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    expect(lien.querySelector('.masque-visuellement')?.textContent?.trim()).toBe('(nouvel onglet)');
    expect(texte(lien)).toBe('Profil externe (nouvel onglet)');
  });

  it('signale la page courante par aria-current, et elle seule', () => {
    const [courant, externe] = rendre('navigation', true);
    expect(courant.getAttribute('aria-current')).toBe('page');
    expect(externe.hasAttribute('aria-current')).toBe(false);
    expect(rendre('navigation')[0].hasAttribute('aria-current')).toBe(false);
  });
});
