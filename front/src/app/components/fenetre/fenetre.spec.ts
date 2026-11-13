import { Component, signal, Type } from '@angular/core';
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

@Component({
  imports: [Fenetre],
  template: `
    <app-fenetre
      variante="navigateur"
      [titre]="titre()"
      [adresse]="adresse()"
      [decorative]="decorative()"
    >
      @if (contenu()) {
        <p>Contenu projeté</p>
      }
    </app-fenetre>
  `,
})
class HoteNavigateur {
  readonly titre = signal<string | undefined>('scene.ts');
  readonly adresse = signal<string | undefined>('exemple.fr/projets');
  readonly decorative = signal(false);
  readonly contenu = signal(true);
}

@Component({
  imports: [Fenetre],
  template: `
    <app-fenetre
      variante="capture"
      titre="capture-01"
      [decorative]="decorative()"
      [source]="source()"
      [largeur]="largeur()"
      [hauteur]="hauteur()"
      [texteAlternatif]="alternatif()"
    />
  `,
})
class HoteCapture {
  readonly decorative = signal(false);
  readonly source = signal<string | undefined>('/images/essai.png');
  readonly largeur = signal<number | undefined>(1600);
  readonly hauteur = signal<number | undefined>(1000);
  readonly alternatif = signal<string | undefined>('La page d’accueil');
}

function monter<T>(type: Type<T>, regler: (hote: T) => void = () => undefined) {
  const fixture = TestBed.createComponent(type);
  regler(fixture.componentInstance);
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

  // jsdom ne sélectionne rien à la souris : il dit seulement quel texte se sélectionne. La copie
  // elle-même (l'extrait une seule fois) se vérifie dans un navigateur.
  it('non décorative : seule la copie colorée se sélectionne, pas l’extrait lu', () => {
    const { hote, cadre } = rendre();
    const selection = (element: Element) => getComputedStyle(element).userSelect;
    expect(selection(cadre!.querySelector('.masque-visuellement')!)).toBe('none');
    const segment = cadre!.querySelector('.fenetre__segment--mot-cle');
    const chaine: string[] = [];
    for (let e = segment; e && e !== hote.parentElement; e = e.parentElement) {
      chaine.push(selection(e));
    }
    expect(chaine).toHaveLength(6);
    expect(chaine).not.toContain('none');
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

describe('Fenetre navigateur', () => {
  it('pose l’adresse factice à la place du titre, et le contenu projeté', () => {
    const { cadre } = monter(HoteNavigateur);
    const adresse = cadre?.querySelector('.fenetre__barre .fenetre__adresse');
    expect(adresse?.textContent).toBe('exemple.fr/projets');
    expect(cadre?.querySelector('.fenetre__titre')).toBeNull();
    expect(cadre?.querySelectorAll('.fenetre__point')).toHaveLength(3);
    expect(cadre?.getAttribute('aria-labelledby')).toBe(adresse?.id);
    const contenu = cadre?.querySelector('.fenetre__contenu');
    expect(contenu?.querySelector('p')?.textContent).toBe('Contenu projeté');
    expect(contenu?.matches(':empty')).toBe(false);
  });

  it('garde le titre dans la barre sans adresse', () => {
    const { cadre } = monter(HoteNavigateur, (hote) => hote.adresse.set(' '));
    expect(cadre?.querySelector('.fenetre__adresse')).toBeNull();
    expect(cadre?.querySelector('.fenetre__titre')?.textContent).toBe('scene.ts');
  });

  it('décorative : aria-hidden sur le cadre, contenu projeté compris', () => {
    const { cadre } = monter(HoteNavigateur, (hote) => hote.decorative.set(true));
    expect(cadre?.getAttribute('aria-hidden')).toBe('true');
    expect(cadre?.hasAttribute('aria-labelledby')).toBe(false);
    expect(cadre?.querySelector('p')?.closest('[aria-hidden="true"]')).toBe(cadre);
  });

  it('sans contenu projeté, laisse vide l’emplacement que la feuille de style masque', () => {
    const { cadre } = monter(HoteNavigateur, (hote) => hote.contenu.set(false));
    const contenu = cadre?.querySelector('.fenetre__contenu');
    expect(contenu?.children).toHaveLength(0);
    expect(contenu?.textContent).toBe('');
    expect(contenu?.matches(':empty')).toBe(true);
    expect(cadre?.matches(':has(> .fenetre__contenu:empty)')).toBe(true);
  });
});

describe('Fenetre capture', () => {
  it('pose l’image aux dimensions déclarées, avec son texte alternatif', () => {
    const { cadre } = monter(HoteCapture);
    expect(cadre?.getAttribute('aria-labelledby')).toBe(
      cadre?.querySelector('.fenetre__titre')?.id,
    );
    const image = cadre?.querySelector('img');
    expect(image?.classList).toContain('fenetre__image');
    expect(image?.previousElementSibling?.localName).toBe('figcaption');
    expect(image?.getAttribute('src')).toBe('/images/essai.png');
    expect(image?.getAttribute('width')).toBe('1600');
    expect(image?.getAttribute('height')).toBe('1000');
    expect(image?.getAttribute('alt')).toBe('La page d’accueil');
    expect(image?.getAttribute('loading')).toBe('lazy');
  });

  it('décorative : aria-hidden sur le cadre et texte alternatif vide', () => {
    const { cadre } = monter(HoteCapture, (hote) => hote.decorative.set(true));
    expect(cadre?.getAttribute('aria-hidden')).toBe('true');
    expect(cadre?.querySelector('img')?.getAttribute('alt')).toBe('');
    expect(focalisables(cadre!)).toHaveLength(0);
  });

  it('décorative, se passe de texte alternatif', () => {
    const { cadre } = monter(HoteCapture, (hote) => {
      hote.decorative.set(true);
      hote.alternatif.set(undefined);
    });
    expect(cadre?.querySelector('img')?.getAttribute('alt')).toBe('');
  });

  it.each([undefined, '', '  '])('ne rend rien sans source (%j) : aucun cadre', (source) => {
    const { hote } = monter(HoteCapture, (hote) => hote.source.set(source));
    expect(hote.childElementCount).toBe(0);
  });

  it.each([undefined, ' '])(
    'refuse une capture non décorative sans texte alternatif (%j)',
    (alt) => {
      expect(() => monter(HoteCapture, (hote) => hote.alternatif.set(alt))).toThrow(
        /texteAlternatif/,
      );
    },
  );

  it('refuse une capture sans dimensions', () => {
    expect(() => monter(HoteCapture, (hote) => hote.hauteur.set(undefined))).toThrow(/dimensions/);
  });
});

// jsdom ne calcule pas la mise en page, mais il applique la feuille du composant : l'affichage
// calculé de l'hôte dit s'il prend une place, ou un écart de grille ou de boîte flexible.
describe('Fenetre dans la mise en page', () => {
  const affichage = (hote: HTMLElement) => getComputedStyle(hote).display;

  it('sans contenu, sort l’hôte de la mise en page, quelle que soit la variante', () => {
    expect(affichage(rendre([]).hote)).toBe('none');
    expect(affichage(monter(HoteCapture, (hote) => hote.source.set(undefined)).hote)).toBe('none');
    expect(affichage(monter(HoteNavigateur, (hote) => hote.contenu.set(false)).hote)).toBe('none');
  });

  it('avec un contenu, garde l’hôte en bloc', () => {
    expect(affichage(rendre().hote)).toBe('block');
    expect(affichage(monter(HoteCapture).hote)).toBe('block');
    expect(affichage(monter(HoteNavigateur).hote)).toBe('block');
  });

  // Les feuilles globales ne sont pas chargées : les deux tailles sont posées sur html le temps
  // du test, puis retirées, car Vitest tourne sans isolation (#169).
  describe('titre et adresse de la barre', () => {
    const TAILLES = { '--taille-code': '14px', '--taille-etiquette': '12px' };
    const html = document.documentElement;
    beforeEach(() => {
      for (const [nom, valeur] of Object.entries(TAILLES)) html.style.setProperty(nom, valeur);
    });
    afterEach(() => {
      for (const nom of Object.keys(TAILLES)) html.style.removeProperty(nom);
    });

    // L'ellipse ne joue que sur une seule ligne, le surplus masqué, et dans une barre flexible
    // seulement si l'élément peut rétrécir sous la largeur de son texte (min-width: 0). La coupure
    // elle-même, qui demande la mise en page, se voit dans un navigateur.
    it.each([
      ['le titre', () => rendre().cadre, '.fenetre__titre'],
      ['l’adresse', () => monter(HoteNavigateur).cadre, '.fenetre__adresse'],
    ])('écrit %s à taille-code (14 px), coupé d’une ellipse', (_nom, cadre, selecteur) => {
      const element = cadre()!.querySelector(selecteur)!;
      const style = getComputedStyle(element);
      expect(style.fontSize).toBe('14px');
      expect([style.textOverflow, style.whiteSpace, style.overflow]).toEqual([
        'ellipsis',
        'nowrap',
        'hidden',
      ]);
      expect(getComputedStyle(element.parentElement!).display).toBe('flex');
      expect(style.minWidth).toMatch(/^0(px)?$/);
    });
  });
});
