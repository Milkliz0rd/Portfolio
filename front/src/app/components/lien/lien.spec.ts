import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, RouterLink } from '@angular/router';
import { CourantLien, Lien, VarianteLien } from './lien';

const VARIANTES: VarianteLien[] = ['texte', 'discret', 'action', 'navigation'];
const FLECHE = 'M5 12h14M13 6l6 6-6 6';
const FLECHE_OBLIQUE = 'M9 5h10v10M19 5 6 18';
const FLECHE_GAUCHE = 'M19 12H5M11 6l-6 6 6 6';

@Component({
  imports: [Lien, RouterLink],
  template: `
    <a
      appLien
      [variante]="variante()"
      [courant]="courant()"
      [retour]="retour()"
      routerLink="/contact"
    >
      Voir la fiche
    </a>
    <a
      appLien
      [variante]="variante()"
      [externe]="externe()"
      [retour]="retour()"
      href="https://example.org/profil"
    >
      Profil externe
    </a>
  `,
})
class Hote {
  readonly variante = signal<VarianteLien>('texte');
  readonly courant = signal<CourantLien | undefined>(undefined);
  readonly externe = signal(true);
  readonly retour = signal(false);
}

/** Les entrées posées par le seul attribut : externe dans le pied de page, retour sur la fiche. */
@Component({
  imports: [Lien, RouterLink],
  template: `
    <a appLien variante="discret" externe href="https://example.org/profil">Profil</a>
    <a appLien variante="action" retour routerLink="/">Retour à la liste</a>
  `,
})
class HoteAttribut {}

// Le premier lien, de la variante demandée, mène à une page du site ; le second, de la même
// variante et externe, hors du site.
function rendre(
  variante: VarianteLien = 'texte',
  courant?: CourantLien,
  retour = false,
): HTMLAnchorElement[] {
  const fixture = TestBed.createComponent(Hote);
  fixture.componentInstance.variante.set(variante);
  fixture.componentInstance.courant.set(courant);
  fixture.componentInstance.retour.set(retour);
  fixture.detectChanges();
  return [...(fixture.nativeElement as HTMLElement).querySelectorAll('a')];
}

const variantesPortees = (lien: HTMLElement) =>
  [...lien.classList].filter((classe) => classe.startsWith('lien--'));
const texte = (lien: HTMLElement) => lien.textContent?.replace(/\s+/g, ' ').trim();
/** L'icône du lien précède-t-elle son texte ? Le texte projeté est un nœud de texte, pas un élément. */
const iconeAvantLeTexte = (lien: HTMLElement) => {
  const texteDuLien = [...lien.childNodes].find(
    (noeud) => noeud.nodeType === Node.TEXT_NODE && noeud.textContent?.trim(),
  )!;
  const suit = lien.querySelector('app-icone')!.compareDocumentPosition(texteDuLien);
  return (suit & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
};
const traces = (lien: HTMLElement) =>
  [...lien.querySelectorAll('app-icone svg')].map((svg) => [
    svg.querySelector('path')?.getAttribute('d'),
    svg.getAttribute('aria-hidden'),
  ]);

describe('Lien', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  it.each(VARIANTES)('reste un lien natif du routeur, de la seule variante « %s »', (variante) => {
    const [lien] = rendre(variante);
    expect(lien.localName).toBe('a');
    expect(lien.getAttribute('href')).toBe('/contact');
    expect(lien.classList).toContain('lien');
    expect(variantesPortees(lien)).toEqual([`lien--${variante}`]);
  });

  it.each(VARIANTES)(
    'ouvre « %s » dans l’onglet courant, sans icône ni texte ajouté',
    (variante) => {
      const [lien] = rendre(variante);
      expect(lien.hasAttribute('target')).toBe(false);
      expect(lien.hasAttribute('rel')).toBe(false);
      if (variante !== 'action') {
        expect(lien.querySelector('svg')).toBeNull();
      }
      expect(lien.querySelector('.masque-visuellement')).toBeNull();
      expect(texte(lien)).toBe('Voir la fiche');
    },
  );

  it('porte la flèche après le texte du lien d’action, décorative', () => {
    const [lien] = rendre('action');
    const icones = lien.querySelectorAll('app-icone');
    expect(icones).toHaveLength(1);
    expect(lien.lastElementChild).toBe(icones[0]);
    expect(traces(lien)).toEqual([[FLECHE, 'true']]);
  });

  it.each(VARIANTES)(
    'ouvre « %s » externe dans un nouvel onglet, sans lien vers la page d’origine, dans sa variante',
    (variante) => {
      const [, lien] = rendre(variante);
      expect(lien.getAttribute('href')).toBe('https://example.org/profil');
      expect(lien.getAttribute('target')).toBe('_blank');
      expect(lien.getAttribute('rel')?.split(' ').sort()).toEqual(['noopener', 'noreferrer']);
      expect(variantesPortees(lien)).toEqual([`lien--${variante}`, 'lien--externe']);
    },
  );

  // CO-02 donne une seule icône par lien : l'externe d'action n'a que la flèche oblique.
  it.each(VARIANTES)(
    'annonce « %s » externe par la seule flèche oblique, décorative, et un texte masqué',
    (variante) => {
      const [, lien] = rendre(variante);
      expect(traces(lien)).toEqual([[FLECHE_OBLIQUE, 'true']]);
      const masque = lien.querySelector('.masque-visuellement');
      expect(masque?.textContent?.trim()).toBe('(nouvel onglet)');
      expect(lien.lastElementChild).toBe(masque);
      // Le nom accessible : le texte, puis l'annonce ; la flèche, aria-hidden, n'en fait pas partie.
      expect(texte(lien)).toBe('Profil externe (nouvel onglet)');
    },
  );

  it('se dit externe ou retour par le seul attribut, sans valeur : <a appLien externe>', () => {
    const fixture = TestBed.createComponent(HoteAttribut);
    fixture.detectChanges();
    const [lien, retour] = (fixture.nativeElement as HTMLElement).querySelectorAll('a');
    expect(variantesPortees(lien)).toEqual(['lien--discret', 'lien--externe']);
    expect(lien.getAttribute('target')).toBe('_blank');
    expect(texte(lien)).toBe('Profil (nouvel onglet)');
    expect(variantesPortees(retour)).toEqual(['lien--action', 'lien--retour']);
    expect(traces(retour)).toEqual([[FLECHE_GAUCHE, 'true']]);
    expect(iconeAvantLeTexte(retour)).toBe(true);
  });

  // Choix C7 : la flèche gauche avant le texte, la seule icône du lien, quelle que soit la variante.
  it.each(VARIANTES)(
    'porte sur un retour « %s » la seule flèche gauche, décorative, avant le texte',
    (variante) => {
      const [lien] = rendre(variante, undefined, true);
      expect(variantesPortees(lien)).toEqual([`lien--${variante}`, 'lien--retour']);
      expect(traces(lien)).toEqual([[FLECHE_GAUCHE, 'true']]);
      expect(iconeAvantLeTexte(lien)).toBe(true);
      expect(lien.querySelector('app-icone')?.classList).toContain('lien__icone--retour');
      expect(lien.hasAttribute('target')).toBe(false);
      expect(texte(lien)).toBe('Voir la fiche');
    },
  );

  it('rend au lien d’action sa flèche après le texte quand retour repasse à faux', () => {
    const fixture = TestBed.createComponent(Hote);
    fixture.componentInstance.variante.set('action');
    fixture.componentInstance.retour.set(true);
    fixture.detectChanges();
    const lien = (fixture.nativeElement as HTMLElement).querySelector('a')!;
    expect(traces(lien)).toEqual([[FLECHE_GAUCHE, 'true']]);
    fixture.componentInstance.retour.set(false);
    fixture.detectChanges();
    expect(variantesPortees(lien)).toEqual(['lien--action']);
    expect(traces(lien)).toEqual([[FLECHE, 'true']]);
    expect(iconeAvantLeTexte(lien)).toBe(false);
  });

  it('ne garde à un retour externe que la flèche oblique et le texte masqué', () => {
    const [, lien] = rendre('action', undefined, true);
    expect(variantesPortees(lien)).toEqual(['lien--action', 'lien--externe', 'lien--retour']);
    expect(traces(lien)).toEqual([[FLECHE_OBLIQUE, 'true']]);
    expect(texte(lien)).toBe('Profil externe (nouvel onglet)');
  });

  it('retire le nouvel onglet, la flèche oblique et le texte masqué quand externe repasse à faux', () => {
    const fixture = TestBed.createComponent(Hote);
    fixture.detectChanges();
    const lien = (fixture.nativeElement as HTMLElement).querySelectorAll('a')[1];
    expect(lien.getAttribute('target')).toBe('_blank');
    fixture.componentInstance.externe.set(false);
    fixture.detectChanges();
    expect(['target', 'rel'].map((nom) => lien.hasAttribute(nom))).toEqual([false, false]);
    expect(variantesPortees(lien)).toEqual(['lien--texte']);
    expect(lien.querySelector('svg')).toBeNull();
    expect(texte(lien)).toBe('Profil externe');
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
// vérifie : on compare les règles qui touchent le lien et son ::after, pas les pixels peints. Au
// survol, :hover est retiré des sélecteurs, que jsdom ne vérifie jamais.
function regles(lien: HTMLElement, survol = false): string[] {
  return [...document.styleSheets]
    .flatMap((feuille) => [...feuille.cssRules])
    .filter((regle) => regle instanceof CSSStyleRule)
    .flatMap((regle) => {
      const vises = regle.selectorText
        .split(',')
        .map((selecteur) => selecteur.trim())
        .filter((selecteur) =>
          lien.matches(
            (survol ? selecteur.replaceAll(':hover', '') : selecteur).replace(/::after$/, ''),
          ),
        );
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

describe('Lien externe : l’aspect de sa variante', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  it.each(VARIANTES)('« %s » externe a les règles de « %s », au repos et au survol', (variante) => {
    const [interne, externe] = rendre(variante);
    expect(regles(externe)).toEqual(regles(interne));
    expect(regles(externe, true)).toEqual(regles(interne, true));
    // Le survol de la variante s'applique bien : il ajoute au moins une règle.
    expect(regles(externe, true).length).toBeGreaterThan(regles(externe).length);
  });
});
