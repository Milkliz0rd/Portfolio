import { Location } from '@angular/common';
import { provideLocationMocks, SpyLocation } from '@angular/common/testing';
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, provideRouter, Router } from '@angular/router';
import { filter, firstValueFrom } from 'rxjs';
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

// Une carte interactive de l'accueil : un lien vers une section de la page principale, sans étape
// d'historique, et l'action décorative du pied.
@Component({
  imports: [Carte, Etiquette, Pastille],
  template: `
    <app-carte
      [variante]="variante()"
      titre="Parcours"
      [niveauTitre]="3"
      [lien]="lien()"
      [fragment]="fragment()"
      [replaceUrl]="replaceUrl()"
      [action]="action()"
    >
      <app-etiquette>Section</app-etiquette>
      La phrase d’orientation.
      @if (avecPastille()) {
        <app-pastille variante="succes">Validé</app-pastille>
      }
    </app-carte>
  `,
})
class HoteInteractif {
  readonly variante = signal<VarianteCarte>('pleine');
  readonly lien = signal<string | undefined>('/');
  readonly fragment = signal<string | undefined>('parcours');
  readonly replaceUrl = signal(true);
  readonly action = signal<string | undefined>('Voir le parcours');
  readonly avecPastille = signal(false);
}

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

describe('Carte interactive', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  interface OptionsInteractive {
    variante?: VarianteCarte;
    lien?: string;
    fragment?: string;
    replaceUrl?: boolean;
    action?: string;
    avecPastille?: boolean;
  }

  function rendreInteractive(options: OptionsInteractive = {}): HTMLElement {
    const fixture = TestBed.createComponent(HoteInteractif);
    const hote = fixture.componentInstance;
    hote.variante.set(options.variante ?? 'pleine');
    hote.lien.set('lien' in options ? options.lien : '/');
    hote.fragment.set('fragment' in options ? options.fragment : 'parcours');
    hote.replaceUrl.set(options.replaceUrl ?? true);
    hote.action.set('action' in options ? options.action : 'Voir le parcours');
    hote.avecPastille.set(options.avecPastille ?? false);
    fixture.detectChanges();
    return (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('app-carte')!;
  }

  const FOCALISABLES = 'a[href], button, input, select, textarea, [tabindex]';

  it.each(['verre', 'pleine'] as const)(
    'n’a qu’un lien, dans le titre, dont le texte est le titre (%s)',
    (variante) => {
      const carte = rendreInteractive({ variante });
      const liens = carte.querySelectorAll('a');
      expect(liens).toHaveLength(1);
      expect(carte.querySelectorAll(FOCALISABLES)).toHaveLength(1);
      const [lien] = liens;
      expect(lien.getAttribute('href')).toBe('/#parcours');
      expect(lien.classList).toContain('carte__lien');
      expect(lien.parentElement?.localName).toBe('h3');
      expect(texte(lien)).toBe('Parcours');
      expect(texte(carte.querySelector(TITRES))).toBe('Parcours');
      expect(carte.classList).toContain('carte--interactive');
    },
  );

  it('dessine l’action du pied, décorative : masquée, sans lien ni bouton', () => {
    const carte = rendreInteractive();
    const action = carte.querySelector('.carte__pied > .carte__action')!;
    expect(action.localName).toBe('span');
    expect(action.getAttribute('aria-hidden')).toBe('true');
    expect(texte(action)).toBe('Voir le parcours');
    expect(action.closest('a, button')).toBeNull();
    expect(action.querySelector(FOCALISABLES)).toBeNull();
    expect(action.hasAttribute('tabindex')).toBe(false);
    expect(action.lastElementChild?.localName).toBe('app-icone');
    expect(action.querySelector('path')?.getAttribute('d')).toBe('M5 12h14M13 6l6 6-6 6');
  });

  it('range les pastilles du pied avant l’action', () => {
    const pied = rendreInteractive({ avecPastille: true }).querySelector('.carte__pied')!;
    expect([...pied.children].map((enfant) => enfant.localName)).toEqual(['app-pastille', 'span']);
  });

  it('rend les calques d’ombre et de lueur, vides, décoratifs et sous le contenu', () => {
    const carte = rendreInteractive();
    const [ombre, lueur] = [...carte.children];
    expect(ombre.classList).toContain('carte__ombre');
    expect(lueur.classList).toContain('carte__lueur');
    for (const calque of [ombre, lueur]) {
      expect(calque.getAttribute('aria-hidden')).toBe('true');
      expect(calque.childNodes).toHaveLength(0);
    }
    expect([...carte.children].slice(2).map((enfant) => enfant.localName)).toEqual([
      'app-etiquette',
      'h3',
      'div',
      'div',
    ]);
  });

  // Une carte qui n'a ni lien, ni ancre, ni remplacement d'adresse.
  const STATIQUE = { lien: undefined, fragment: undefined, replaceUrl: false };

  it('reste statique sans lien : ni calque, ni action, ni lien', () => {
    const carte = rendreInteractive({ ...STATIQUE, action: undefined });
    expect(carte.classList).not.toContain('carte--interactive');
    expect(carte.querySelector('a, .carte__ombre, .carte__lueur, .carte__action')).toBeNull();
    expect(carte.querySelector('.carte__pied')).toBeNull();
  });

  it('n’ouvre pas de pied pour un lien sans action ni pastille', () => {
    const carte = rendreInteractive({ action: undefined });
    expect(carte.querySelectorAll('a')).toHaveLength(1);
    expect(carte.querySelector('.carte__pied')).toBeNull();
    expect(vides(carte)).toEqual([]);
  });

  it('refuse une action sans lien', () => {
    expect(() => rendreInteractive(STATIQUE)).toThrow(/exige son lien/);
  });

  it.each([{ fragment: 'parcours' }, { replaceUrl: true }])(
    'refuse une ancre ou un remplacement d’adresse sans lien (%o)',
    (options) => {
      expect(() => rendreInteractive({ ...STATIQUE, action: undefined, ...options })).toThrow(
        /ni fragment ni replaceUrl/,
      );
    },
  );

  it('mène à l’adresse seule, sans ancre ni remplacement', () => {
    const carte = rendreInteractive({ lien: '/contact', fragment: undefined, replaceUrl: false });
    expect(carte.querySelector('a')?.getAttribute('href')).toBe('/contact');
  });
});

@Component({ template: '' })
class PageVide {}

// Le vrai routeur, sur un historique simulé (SpyLocation) : chaque changement d'adresse y est noté,
// « replace: … » quand l'entrée courante est remplacée, l'adresse seule quand une entrée s'ajoute.
describe('Carte interactive dans le routeur', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: PageVide },
          { path: 'contact', component: PageVide },
        ]),
        provideLocationMocks(),
      ],
    }),
  );

  // Ouvre la page principale, pose la carte, la suit jusqu'au bout de la navigation, et rend les
  // changements d'adresse que ce clic a faits.
  async function cliquer(replaceUrl: boolean) {
    const routeur = TestBed.inject(Router);
    const historique = TestBed.inject(Location) as SpyLocation;
    await routeur.navigateByUrl('/');
    const fixture = TestBed.createComponent(HoteInteractif);
    fixture.componentInstance.replaceUrl.set(replaceUrl);
    fixture.detectChanges();
    const lien = (fixture.nativeElement as HTMLElement).querySelector('a')!;
    const avant = historique.urlChanges.length;
    const fin = firstValueFrom(routeur.events.pipe(filter((e) => e instanceof NavigationEnd)));
    lien.click();
    await fin;
    return { lien, routeur, changements: historique.urlChanges.slice(avant) };
  }

  it('mène à l’ancre de sa section en remplaçant l’entrée courante de l’historique', async () => {
    const { lien, routeur, changements } = await cliquer(true);
    expect(lien.getAttribute('href')).toBe('/#parcours');
    expect(routeur.url).toBe('/#parcours');
    expect(changements).toEqual(['replace: /#parcours']);
  });

  it('ajoute une entrée d’historique sans replaceUrl, comme un lien ordinaire', async () => {
    const { routeur, changements } = await cliquer(false);
    expect(routeur.url).toBe('/#parcours');
    expect(changements).toEqual(['/#parcours']);
  });
});
