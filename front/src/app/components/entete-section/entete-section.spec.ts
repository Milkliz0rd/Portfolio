import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EnteteSection, NiveauEnteteSection } from './entete-section';

@Component({
  imports: [EnteteSection],
  template: `
    <app-entete-section numero="02" etiquette="Section" [niveau]="niveau()" [centre]="centre()">
      Le titre
      @if (avecChapo()) {
        <ng-template #chapo>Le chapô de la section.</ng-template>
      }
    </app-entete-section>
  `,
})
class Hote {
  readonly niveau = signal<NiveauEnteteSection>(2);
  readonly centre = signal(false);
  readonly avecChapo = signal(true);
}

function rendre(niveau: NiveauEnteteSection = 2, { centre = false, avecChapo = true } = {}) {
  const fixture = TestBed.createComponent(Hote);
  fixture.componentInstance.niveau.set(niveau);
  fixture.componentInstance.centre.set(centre);
  fixture.componentInstance.avecChapo.set(avecChapo);
  fixture.detectChanges();
  return (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('app-entete-section')!;
}

const TITRES = 'h1, h2, h3, h4, h5, h6, [role="heading"]';
const texte = (element: Element | null | undefined) =>
  element?.textContent?.replace(/\s+/g, ' ').trim();

describe('EnteteSection', () => {
  it.each([2, 3] as const)('fait du titre un vrai h%i, seul titre de l’en-tête', (niveau) => {
    const titres = rendre(niveau).querySelectorAll(TITRES);
    expect([...titres].map((titre) => titre.localName)).toEqual([`h${niveau}`]);
    expect(titres[0].classList).toContain('entete-section__titre');
    expect(texte(titres[0])).toBe('Le titre');
  });

  it('pose l’étiquette numérotée avant le titre et hors de lui', () => {
    const entete = rendre();
    const etiquette = entete.querySelector('app-etiquette')!;
    expect(entete.firstElementChild).toBe(etiquette);
    expect(etiquette.classList).toContain('etiquette--numerotee');
    expect(texte(etiquette.querySelector('.etiquette__numero'))).toBe('02');
    expect(texte(etiquette.querySelector('.etiquette__texte'))).toBe('Section');
    expect(etiquette.closest(TITRES)).toBeNull();
    expect(entete.querySelector(TITRES)?.querySelector('app-etiquette')).toBeNull();
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
    const vides = [...entete.querySelectorAll('*')].filter(
      (element) => !element.textContent?.trim() && element.getAttribute('aria-hidden') !== 'true',
    );
    expect(vides).toEqual([]);
  });

  it('se centre sur demande, aligné à gauche par défaut', () => {
    expect(rendre().classList).not.toContain('entete-section--centre');
    expect(rendre(2, { centre: true }).classList).toContain('entete-section--centre');
  });

  it('reste statique : ni lien, ni bouton, ni focus', () => {
    expect(rendre().querySelector('a, button, input, [tabindex]')).toBeNull();
  });
});
