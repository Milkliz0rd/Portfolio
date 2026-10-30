import { TestBed } from '@angular/core/testing';
import { ListeCleValeur, PaireCleValeur, VarianteListeCleValeur } from './liste-cle-valeur';

const PAIRES: PaireCleValeur[] = [
  { cle: 'Rôle', valeur: 'Développeur' },
  { cle: 'Période', valeur: '2024 – 2026', date: true },
  { cle: 'Absente' },
  { cle: 'Nulle', valeur: null },
  { cle: 'Vide', valeur: '' },
  { cle: 'Espaces', valeur: '   ' },
  { cle: 'Pile', valeur: 'Angular, Spring Boot' },
];

function rendre(paires = PAIRES, variante?: VarianteListeCleValeur): HTMLElement {
  const fixture = TestBed.createComponent(ListeCleValeur);
  fixture.componentRef.setInput('paires', paires);
  if (variante) {
    fixture.componentRef.setInput('variante', variante);
  }
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

const texte = (element: Element) => element.textContent?.replace(/\s+/g, ' ').trim();

describe('ListeCleValeur', () => {
  it('est une liste de définitions, une paire par div, une clé puis sa valeur', () => {
    const liste = rendre().querySelector('dl')!;
    for (const paire of liste.children) {
      expect(paire.localName).toBe('div');
      expect([...paire.children].map((enfant) => enfant.localName)).toEqual(['dt', 'dd']);
    }
    expect(liste.querySelectorAll('dt')).toHaveLength(liste.querySelectorAll('dd').length);
  });

  it('retire toute paire dont la valeur manque, nulle ou vide après retrait des espaces', () => {
    const liste = rendre().querySelector('dl')!;
    expect([...liste.querySelectorAll('dt')].map(texte)).toEqual(['Rôle', 'Période', 'Pile']);
    expect([...liste.querySelectorAll('dd')].map(texte)).toEqual([
      'Développeur',
      '2024 – 2026',
      'Angular, Spring Boot',
    ]);
  });

  it('ne rend aucune liste quand aucune paire n’a de valeur', () => {
    const hote = rendre([{ cle: 'Absente' }, { cle: 'Vide', valeur: ' ' }]);
    expect(hote.querySelector('dl')).toBeNull();
    expect(hote.children).toHaveLength(0);
  });

  it('annonce chaque clé par une étiquette discrète', () => {
    for (const cle of rendre().querySelectorAll('dt')) {
      const etiquette = cle.querySelector('app-etiquette');
      expect(etiquette?.classList).toContain('etiquette--discrete');
      expect(cle.children).toHaveLength(1);
    }
  });

  it('écrit la seule valeur de date ou de période en chasse fixe', () => {
    const dates = [...rendre().querySelectorAll('dd.liste-cle-valeur__valeur--date')];
    expect(dates.map(texte)).toEqual(['2024 – 2026']);
  });

  it.each(['en-ligne', 'tableau'] as const)('porte la seule classe de « %s »', (variante) => {
    const classes = [...rendre(PAIRES, variante).classList];
    expect(classes).toContain('liste-cle-valeur');
    expect(classes.filter((classe) => classe.startsWith('liste-cle-valeur--'))).toEqual([
      `liste-cle-valeur--${variante}`,
    ]);
  });

  it('est en ligne par défaut, et statique', () => {
    const hote = rendre();
    expect(hote.classList).toContain('liste-cle-valeur--en-ligne');
    expect(hote.querySelector('a, button, input, [tabindex]')).toBeNull();
  });
});
