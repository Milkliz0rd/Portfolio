import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EnteteSection, NiveauEnteteSection } from './entete-section';

@Component({
  imports: [EnteteSection],
  template: `
    <app-entete-section
      [numero]="numero()"
      etiquette="Section"
      [niveau]="niveau()"
      [bloc]="bloc()"
      [centre]="centre()"
    >
      Le titre
      @if (avecChapo()) {
        <ng-template #chapo>Le chapô de la section.</ng-template>
      }
    </app-entete-section>
  `,
})
class Hote {
  readonly numero = signal<string | undefined>('02');
  readonly niveau = signal<NiveauEnteteSection>(2);
  readonly bloc = signal(false);
  readonly centre = signal(false);
  readonly avecChapo = signal(true);
}

interface Options {
  numero?: string;
  bloc?: boolean;
  centre?: boolean;
  avecChapo?: boolean;
}

function rendre(
  niveau: NiveauEnteteSection = 2,
  { numero = '02', bloc = false, centre = false, avecChapo = true }: Options = {},
) {
  const fixture = TestBed.createComponent(Hote);
  const hote = fixture.componentInstance;
  hote.numero.set(numero || undefined);
  hote.niveau.set(niveau);
  hote.bloc.set(bloc);
  hote.centre.set(centre);
  hote.avecChapo.set(avecChapo);
  fixture.detectChanges();
  return (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('app-entete-section')!;
}

const TITRES = 'h1, h2, h3, h4, h5, h6, [role="heading"]';
const texte = (element: Element | null | undefined) =>
  element?.textContent?.replace(/\s+/g, ' ').trim();
// Les éléments sans texte qui ne sont pas des décors masqués aux lecteurs d'écran.
const vides = (racine: Element) =>
  [...racine.querySelectorAll('*')].filter(
    (element) => !element.textContent?.trim() && element.getAttribute('aria-hidden') !== 'true',
  );
// jsdom ne calcule pas la mise en page, mais il applique la feuille du composant et résout var() :
// la taille calculée du titre dit quelle règle l'emporte. Les feuilles globales ne sont pas
// chargées : les deux tailles sont posées sur html le temps du test, à leur valeur grand écran.
const TAILLES = { '--taille-titre-1': '72px', '--taille-titre-2': '48px' };
const taille = (entete: HTMLElement) =>
  getComputedStyle(entete.querySelector('.entete-section__titre')!).fontSize;

describe('EnteteSection', () => {
  it.each([1, 2, 3] as const)('fait du titre un vrai h%i, seul titre de l’en-tête', (niveau) => {
    const titres = rendre(niveau).querySelectorAll(TITRES);
    expect([...titres].map((titre) => titre.localName)).toEqual([`h${niveau}`]);
    expect(titres[0].classList).toContain('entete-section__titre');
    expect(texte(titres[0])).toBe('Le titre');
  });

  it('pose l’étiquette numérotée et son filet avant le titre et hors de lui', () => {
    const entete = rendre();
    const etiquette = entete.querySelector('app-etiquette')!;
    expect(entete.firstElementChild).toBe(etiquette);
    expect(etiquette.classList).toContain('etiquette--numerotee');
    expect(texte(etiquette.querySelector('.etiquette__numero'))).toBe('02');
    expect(etiquette.querySelectorAll('.etiquette__trait')).toHaveLength(1);
    expect(texte(etiquette.querySelector('.etiquette__texte'))).toBe('Section');
    expect(etiquette.closest(TITRES)).toBeNull();
    expect(entete.querySelector(TITRES)?.querySelector('app-etiquette')).toBeNull();
  });

  it('sans numéro, pose une étiquette sans numéro ni filet, sans rien de vide à leur place', () => {
    const entete = rendre(1, { numero: '' });
    const etiquette = entete.querySelector('app-etiquette')!;
    expect(entete.firstElementChild).toBe(etiquette);
    expect(etiquette.classList).not.toContain('etiquette--numerotee');
    expect(etiquette.classList).toContain('etiquette--accent');
    expect(etiquette.querySelector('.etiquette__numero, .etiquette__trait')).toBeNull();
    expect([...etiquette.children].map((enfant) => enfant.className)).toEqual(['etiquette__texte']);
    expect(texte(etiquette)).toBe('Section');
    expect(etiquette.closest(TITRES)).toBeNull();
    expect(vides(entete)).toEqual([]);
  });

  it('place le chapô sous le titre, dans un paragraphe', () => {
    const entete = rendre();
    const chapo = entete.querySelector('.entete-section__chapo');
    expect(chapo?.localName).toBe('p');
    expect(texte(chapo)).toBe('Le chapô de la section.');
    expect(entete.lastElementChild).toBe(chapo);
    expect(texte(entete.querySelector(TITRES))).toBe('Le titre');
  });

  it('ne laisse aucun élément vide quand le chapô manque', () => {
    const entete = rendre(3, { avecChapo: false });
    expect(entete.querySelector('.entete-section__chapo, p')).toBeNull();
    expect([...entete.children].map((enfant) => enfant.localName)).toEqual(['app-etiquette', 'h3']);
    expect(vides(entete)).toEqual([]);
  });

  describe('taille du titre', () => {
    // Vitest tourne sans isolation (#169) : les propriétés posées sur html sont retirées après.
    const html = document.documentElement;
    beforeEach(() => {
      for (const [nom, valeur] of Object.entries(TAILLES)) html.style.setProperty(nom, valeur);
    });
    afterEach(() => {
      for (const nom of Object.keys(TAILLES)) html.style.removeProperty(nom);
    });

    it.each([1, 2, 3] as const)(
      'met un titre de section ou de page à part en h%i à taille-titre-1, par défaut',
      (niveau) => {
        const entete = rendre(niveau);
        expect(entete.classList).not.toContain('entete-section--bloc');
        expect(taille(entete)).toBe('72px');
      },
    );

    it.each([2, 3] as const)('met un titre de bloc en h%i à taille-titre-2', (niveau) => {
      const entete = rendre(niveau, { bloc: true });
      expect(entete.classList).toContain('entete-section--bloc');
      expect(taille(entete)).toBe('48px');
    });
  });

  it('se centre sur demande, aligné à gauche par défaut', () => {
    expect(rendre().classList).not.toContain('entete-section--centre');
    expect(rendre(2, { centre: true }).classList).toContain('entete-section--centre');
  });

  it('reste statique : ni lien, ni bouton, ni focus', () => {
    expect(rendre().querySelector('a, button, input, [tabindex]')).toBeNull();
  });
});
