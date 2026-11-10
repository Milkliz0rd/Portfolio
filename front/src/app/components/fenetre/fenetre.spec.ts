import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Fenetre, LigneCode } from './fenetre';

const PROFIL: LigneCode[] = [
  [
    { texte: 'const', genre: 'mot-cle' },
    { texte: ' profil = {', genre: 'texte' },
  ],
  [
    { texte: '  nom: ', genre: 'texte' },
    { texte: "'Alexandre'", genre: 'chaine' },
    { texte: ',', genre: 'texte' },
  ],
  [],
  [
    { texte: '  ', genre: 'texte' },
    { texte: '// à venir', genre: 'commentaire' },
  ],
  [{ texte: '};', genre: 'texte' }],
];
const EXTRAIT = "const profil = {\n  nom: 'Alexandre',\n\n  // à venir\n};";

@Component({
  imports: [Fenetre],
  template: `<app-fenetre [titre]="titre()" [decorative]="decorative()" [lignes]="lignes()" />`,
})
class Hote {
  readonly titre = signal<string | undefined>('profil.ts');
  readonly decorative = signal(false);
  readonly lignes = signal<readonly LigneCode[]>(PROFIL);
}

function rendre(lignes: readonly LigneCode[] = PROFIL, decorative = false, titre = 'profil.ts') {
  const fixture = TestBed.createComponent(Hote);
  fixture.componentInstance.lignes.set(lignes);
  fixture.componentInstance.decorative.set(decorative);
  fixture.componentInstance.titre.set(titre || undefined);
  fixture.detectChanges();
  const hote = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('app-fenetre')!;
  return { hote, cadre: hote.querySelector<HTMLElement>('.fenetre__cadre') };
}

const focalisables = (element: Element) =>
  element.querySelectorAll('a, button, input, select, textarea, [tabindex]');

describe('Fenetre', () => {
  it('pose une barre à trois points décoratifs, puis le titre', () => {
    const { hote, cadre } = rendre();
    expect(hote.classList).toContain('fenetre');
    const barre = cadre?.querySelector('.fenetre__barre');
    const points = barre?.querySelector('.fenetre__points');
    expect(points?.getAttribute('aria-hidden')).toBe('true');
    expect(points?.querySelectorAll('.fenetre__point')).toHaveLength(3);
    expect(points?.textContent).toBe('');
    expect(barre?.querySelector('.fenetre__titre')?.textContent).toBe('profil.ts');
  });

  it('garde la barre et ses trois points sans titre', () => {
    const { cadre } = rendre(PROFIL, false, '');
    expect(cadre?.querySelectorAll('.fenetre__point')).toHaveLength(3);
    expect(cadre?.querySelector('.fenetre__titre')).toBeNull();
    expect(cadre?.hasAttribute('aria-labelledby')).toBe(false);
  });

  it('rend chaque ligne, dans l’ordre, et colore chaque segment par son genre', () => {
    const { cadre } = rendre();
    const lignes = [...cadre!.querySelectorAll('.fenetre__code > .fenetre__ligne')];
    expect(lignes.map((ligne) => ligne.textContent)).toEqual(EXTRAIT.split('\n'));
    expect(lignes[2].childElementCount).toBe(0);
    const genres = [...lignes[1].children].map((segment) => [
      segment.className,
      segment.textContent,
    ]);
    expect(genres).toEqual([
      ['fenetre__segment--texte', '  nom: '],
      ['fenetre__segment--chaine', "'Alexandre'"],
      ['fenetre__segment--texte', ','],
    ]);
    expect(cadre?.querySelector('.fenetre__segment--mot-cle')?.textContent).toBe('const');
    expect(cadre?.querySelector('.fenetre__segment--commentaire')?.textContent).toBe('// à venir');
  });

  it('non décorative : une figure nommée par sa légende, l’extrait lu en un seul nœud', () => {
    const { cadre } = rendre();
    expect(cadre?.localName).toBe('figure');
    expect(cadre?.hasAttribute('aria-hidden')).toBe(false);
    expect(cadre?.firstElementChild?.localName).toBe('figcaption');
    expect(cadre?.firstElementChild?.textContent).toBe('profil.ts');
    const titre = cadre?.querySelector('.fenetre__titre');
    expect(titre?.id).toMatch(/^fenetre-\d+$/);
    expect(cadre?.getAttribute('aria-labelledby')).toBe(titre?.id);
    const lus = cadre!.querySelectorAll('.masque-visuellement');
    expect(lus).toHaveLength(1);
    expect(lus[0].childNodes).toHaveLength(1);
    expect(lus[0].textContent).toBe(EXTRAIT);
    expect(cadre?.querySelector('.fenetre__code')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('décorative : aria-hidden sur le cadre, sans extrait exposé ni élément focalisable', () => {
    const { hote, cadre } = rendre(PROFIL, true);
    expect(hote.firstElementChild).toBe(cadre);
    expect(cadre?.getAttribute('aria-hidden')).toBe('true');
    expect(cadre?.hasAttribute('aria-labelledby')).toBe(false);
    expect(cadre?.querySelector('.masque-visuellement')).toBeNull();
    expect(focalisables(hote)).toHaveLength(0);
    expect(cadre?.querySelector('.fenetre__segment--mot-cle')?.textContent).toBe('const');
  });

  it('n’ajoute aucun texte à ceux de la page', () => {
    const { hote } = rendre(PROFIL, true);
    expect(hote.textContent).toBe('profil.ts' + EXTRAIT.replace(/\n/g, ''));
    expect(focalisables(rendre().hote)).toHaveLength(0);
  });

  it.each([
    ['sans ligne', []],
    ['dont les lignes sont vides', [[], [{ texte: '', genre: 'texte' }]]],
    ['dont les lignes ne portent que des espaces', [[{ texte: '   ', genre: 'texte' }]]],
  ] as [string, LigneCode[]][])('ne rend rien pour un code %s : aucun cadre', (_cas, lignes) => {
    const { hote } = rendre(lignes);
    expect(hote.childElementCount).toBe(0);
    expect(hote.textContent).toBe('');
  });
});
