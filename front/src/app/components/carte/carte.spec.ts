import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Etiquette } from '../etiquette/etiquette';
import { Pastille, VariantePastille } from '../pastille/pastille';
import { Carte, NiveauTitreCarte, VarianteCarte } from './carte';

@Component({
  imports: [Carte, Etiquette, Pastille],
  template: `
    <app-carte [variante]="variante()" titre="Le titre" [niveauTitre]="niveau()">
      @if (avecEtiquette()) {
        <app-etiquette>Catégorie</app-etiquette>
      }
      Le texte de la carte.
      @for (mot of pied(); track mot) {
        <app-pastille [variante]="variantePastille()">{{ mot }}</app-pastille>
      }
    </app-carte>
  `,
})
class Hote {
  readonly variante = signal<VarianteCarte>('verre');
  readonly niveau = signal<NiveauTitreCarte>(3);
  readonly avecEtiquette = signal(true);
  readonly pied = signal(['Angular', 'Java']);
  readonly variantePastille = signal<VariantePastille>('succes');
}

// Des pastilles dans le texte, et non au premier niveau : elles n'entrent pas dans le pied.
@Component({
  imports: [Carte, Pastille],
  template: `
    <app-carte titre="Compétences" [niveauTitre]="3">
      <ul>
        <li><app-pastille variante="accent">Angular</app-pastille></li>
      </ul>
    </app-carte>
    <app-carte variante="pleine" titre="Compétences" [niveauTitre]="3">
      <ul>
        <li><app-pastille variante="accent">Angular</app-pastille></li>
      </ul>
    </app-carte>
  `,
})
class HoteTexte {}

interface Options {
  niveau?: NiveauTitreCarte;
  avecEtiquette?: boolean;
  pied?: string[];
  variantePastille?: VariantePastille;
}

function monter(variante: VarianteCarte = 'verre', options: Options = {}) {
  const fixture = TestBed.createComponent(Hote);
  const hote = fixture.componentInstance;
  hote.variante.set(variante);
  hote.niveau.set(options.niveau ?? 3);
  hote.avecEtiquette.set(options.avecEtiquette ?? true);
  hote.pied.set(options.pied ?? ['Angular', 'Java']);
  hote.variantePastille.set(options.variantePastille ?? 'succes');
  fixture.detectChanges();
  const carte = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('app-carte')!;
  return { fixture, carte };
}

const rendre = (variante?: VarianteCarte, options?: Options) => monter(variante, options).carte;

const TITRES = 'h1, h2, h3, h4, h5, h6, [role="heading"]';
const texte = (element: Element | null | undefined) =>
  element?.textContent?.replace(/\s+/g, ' ').trim();
const variantes = (element: Element, bloc: string) =>
  [...element.classList].filter((classe) => classe.startsWith(`${bloc}--`));
const variantesPastilles = (carte: HTMLElement) =>
  [...carte.querySelectorAll('app-pastille')].map((pastille) => variantes(pastille, 'pastille'));
// Un élément sans texte ni dessin, hors des décors masqués : une zone vide de la carte.
const vides = (carte: HTMLElement) =>
  [...carte.querySelectorAll('*')].filter(
    (element) =>
      !element.textContent?.trim() &&
      !element.querySelector('svg') &&
      !element.closest('[aria-hidden="true"], svg'),
  );

describe('Carte', () => {
  it('est en verre par défaut', () => {
    const fixture = TestBed.createComponent(Carte);
    fixture.componentRef.setInput('titre', 'Le titre');
    fixture.componentRef.setInput('niveauTitre', 3);
    fixture.detectChanges();
    expect(variantes(fixture.nativeElement as HTMLElement, 'carte')).toEqual(['carte--verre']);
  });

  it.each(['verre', 'pleine'] as const)(
    'porte la seule classe de la variante « %s »',
    (variante) => {
      const carte = rendre(variante);
      expect(carte.classList).toContain('carte');
      expect(variantes(carte, 'carte')).toEqual([`carte--${variante}`]);
    },
  );

  it.each([2, 3, 4] as const)('fait du titre un vrai h%i, seul titre de la carte', (niveau) => {
    const titres = rendre('pleine', { niveau }).querySelectorAll(TITRES);
    expect([...titres].map((titre) => titre.localName)).toEqual([`h${niveau}`]);
    expect(titres[0].classList).toContain('carte__titre');
    expect(texte(titres[0])).toBe('Le titre');
  });

  it('range l’étiquette, le titre, le texte puis le pied, dans cet ordre', () => {
    const carte = rendre();
    expect(
      [...carte.children].map((enfant) => enfant.localName + '.' + enfant.classList[0]),
    ).toEqual([
      'app-etiquette.etiquette',
      'h3.carte__titre',
      'div.carte__texte',
      'div.carte__pied',
    ]);
    expect(texte(carte.querySelector('.carte__texte'))).toBe('Le texte de la carte.');
    const pied = carte.querySelector('.carte__pied')!;
    expect([...pied.children].map((enfant) => `${enfant.localName} ${texte(enfant)}`)).toEqual([
      'app-pastille Angular',
      'app-pastille Java',
    ]);
  });

  it.each(['verre', 'pleine'] as const)(
    'se resserre sans étiquette ni pied : aucun élément vide (%s)',
    (variante) => {
      const carte = rendre(variante, { avecEtiquette: false, pied: [] });
      expect([...carte.children].map((enfant) => enfant.localName)).toEqual(['h3', 'div']);
      expect(carte.querySelector('app-etiquette, .carte__pied, app-pastille')).toBeNull();
      expect(vides(carte)).toEqual([]);
    },
  );

  it('ne laisse aucun élément vide avec tout son contenu', () => {
    expect(vides(rendre())).toEqual([]);
  });

  it.each(['neutre', 'accent', 'succes', 'erreur', 'contour'] as const)(
    'rend en contour une pastille « %s » posée sur le verre',
    (variantePastille) => {
      const carte = rendre('verre', { variantePastille });
      expect(variantesPastilles(carte)).toEqual([['pastille--contour'], ['pastille--contour']]);
    },
  );

  it.each(['neutre', 'accent', 'succes', 'erreur', 'contour'] as const)(
    'garde à une pastille « %s » sa variante sur la carte pleine',
    (variantePastille) => {
      const carte = rendre('pleine', { variantePastille });
      const attendue = [`pastille--${variantePastille}`];
      expect(variantesPastilles(carte)).toEqual([attendue, attendue]);
    },
  );

  it('suit le passage de la carte du verre au plein, et retour', () => {
    const { fixture, carte } = monter('verre');
    expect(variantesPastilles(carte)[0]).toEqual(['pastille--contour']);
    fixture.componentInstance.variante.set('pleine');
    fixture.detectChanges();
    expect(variantesPastilles(carte)[0]).toEqual(['pastille--succes']);
    fixture.componentInstance.variante.set('verre');
    fixture.detectChanges();
    expect(variantesPastilles(carte)[0]).toEqual(['pastille--contour']);
  });

  it('rend en contour une pastille du texte sur le verre, et la laisse hors du pied', () => {
    const fixture = TestBed.createComponent(HoteTexte);
    fixture.detectChanges();
    const [verre, pleine] = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>(
      'app-carte',
    );
    expect(variantesPastilles(verre)).toEqual([['pastille--contour']]);
    expect(variantesPastilles(pleine)).toEqual([['pastille--accent']]);
    expect(verre.querySelector('.carte__pied')).toBeNull();
    expect(verre.querySelector('.carte__texte app-pastille')).not.toBeNull();
  });

  it('reste statique sans lien : ni lien, ni bouton, ni focus', () => {
    expect(rendre().querySelector('a, button, input, [tabindex]')).toBeNull();
  });

  it('refuse une carte sans titre', () => {
    const fixture = TestBed.createComponent(Carte);
    fixture.componentRef.setInput('titre', '  ');
    fixture.componentRef.setInput('niveauTitre', 3);
    expect(() => fixture.detectChanges()).toThrow(/porte toujours un titre/);
  });
});
