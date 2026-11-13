import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, RouterLink } from '@angular/router';
import { CourantLien, Lien, VarianteLien } from './lien';

const VARIANTES: VarianteLien[] = ['texte', 'discret', 'action', 'navigation', 'externe'];

@Component({
  imports: [Lien, RouterLink],
  template: `
    <a appLien [variante]="variante()" [courant]="courant()" routerLink="/contact">
      Voir la fiche
    </a>
    <a appLien variante="externe" href="https://example.org/profil">Profil externe</a>
  `,
})
class Hote {
  readonly variante = signal<VarianteLien>('texte');
  readonly courant = signal<CourantLien | undefined>(undefined);
}

// Le premier lien, de la variante demandée, mène à une page du site ; le second hors du site.
function rendre(variante: VarianteLien = 'texte', courant?: CourantLien): HTMLAnchorElement[] {
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
    expect(lien.getAttribute('href')).toBe('/contact');
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

  it.each(['page', 'location'] as const)(
    'signale l’entrée courante par aria-current="%s", et elle seule',
    (courant) => {
      const [lien, externe] = rendre('navigation', courant);
      expect(lien.getAttribute('aria-current')).toBe(courant);
      expect(externe.hasAttribute('aria-current')).toBe(false);
    },
  );

  it.each(VARIANTES)('ne pose aucun aria-current sans entrée courante (%s)', (variante) => {
    const liens = rendre(variante);
    expect(liens.map((lien) => lien.hasAttribute('aria-current'))).toEqual([false, false]);
  });

  it('retire aria-current quand le lien cesse d’être l’entrée courante', () => {
    const fixture = TestBed.createComponent(Hote);
    fixture.componentInstance.variante.set('navigation');
    fixture.componentInstance.courant.set('location');
    fixture.detectChanges();
    const lien = (fixture.nativeElement as HTMLElement).querySelector('a')!;
    expect(lien.getAttribute('aria-current')).toBe('location');
    fixture.componentInstance.courant.set('page');
    fixture.detectChanges();
    expect(lien.getAttribute('aria-current')).toBe('page');
    fixture.componentInstance.courant.set(undefined);
    fixture.detectChanges();
    expect(lien.hasAttribute('aria-current')).toBe(false);
  });
});

// jsdom charge la feuille du composant mais pas les jetons de _jetons.scss : il ne calcule ni la
// couleur ni le ::after d'une règle faite de var(). Il dit en revanche quels sélecteurs un élément
// vérifie : on compare les règles qui touchent le lien et son ::after, pas les pixels peints.
function regles(lien: HTMLElement): string[] {
  return [...document.styleSheets]
    .flatMap((feuille) => [...feuille.cssRules])
    .filter((regle) => regle instanceof CSSStyleRule)
    .flatMap((regle) => {
      const vises = regle.selectorText
        .split(',')
        .map((selecteur) => selecteur.trim())
        .filter((selecteur) => lien.matches(selecteur.replace(/::after$/, '')));
      if (!vises.length) {
        return [];
      }
      const cible = vises.every((selecteur) => selecteur.endsWith('::after')) ? '::after ' : '';
      return [cible + regle.style.cssText];
    });
}

describe('Lien de navigation courant', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  it('donne la même couleur et le même trait à la page affichée et à la section lue', () => {
    const [page] = rendre('navigation', 'page');
    const [location] = rendre('navigation', 'location');
    const auRepos = regles(rendre('navigation')[0]);
    expect(regles(location)).toEqual(regles(page));
    const propres = regles(page).filter((regle) => !auRepos.includes(regle));
    expect(propres).toHaveLength(2);
    expect(propres[0]).toBe('color: var(--couleur-texte);');
    expect(propres[1]).toMatch(/^::after content: "";/);
    expect(propres[1]).toContain('height: var(--epaisseur-trait-courant);');
    expect(propres[1]).toContain('background: var(--couleur-accent);');
  });

  it.each(['true', 'false', 'step'])(
    'ne donne ni la couleur ni le trait à aria-current="%s"',
    (valeur) => {
      const [lien] = rendre('navigation');
      const auRepos = regles(lien);
      lien.setAttribute('aria-current', valeur);
      expect(regles(lien)).toEqual(auRepos);
    },
  );
});
