import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DateFrise, DateOuEmplacement, EtapeFrise, formaterPeriode, Frise } from './frise';

const d = (annee: number | string, mois?: number): DateFrise => ({ annee, mois });

describe('formaterPeriode', () => {
  it.each<[string, DateOuEmplacement, DateOuEmplacement, string]>([
    ['mois à un chiffre', d(2023, 3), d(2023, 11), '03/2023\u00a0– 11/2023'],
    ['mois puis année seule', d(2025, 9), d(2028), '09/2025\u00a0– 2028'],
    ['deux années seules', d(2025), d(2028), '2025–2028'],
    ['deux emplacements', '[C-01 — début]', '[C-01 — fin]', '[C-01 — début]\u00a0– [C-01 — fin]'],
    ['partie en emplacement', d('[C-01]', 1), d(2026, 12), '01/[C-01]\u00a0– 12/2026'],
  ])('écrit un début et une fin, en français : %s', (_cas, debut, fin, attendu) => {
    expect(formaterPeriode(debut, fin, 'fr')).toBe(attendu);
  });

  it('suit la langue donnée, sans format écrit en dur', () => {
    expect(formaterPeriode(d(2023, 3), d(2028), 'ja')).toBe('2023/03\u00a0– 2028年');
    expect(formaterPeriode(d(2023, 3), d(2024, 7), 'sv')).toBe('2023-03\u00a0– 2024-07');
  });

  it('ne lit jamais la date du jour', () => {
    // Horloge factice, rendue dans tous les cas : Vitest tourne sans isolation (#169).
    vi.useFakeTimers({ toFake: ['Date'] });
    try {
      vi.setSystemTime(Date.UTC(2020, 0, 1));
      const avant = formaterPeriode(d(2023, 3), d(2028), 'fr');
      vi.setSystemTime(Date.UTC(2035, 5, 15));
      expect(formaterPeriode(d(2023, 3), d(2028), 'fr')).toBe(avant);
    } finally {
      vi.useRealTimers();
    }
  });

  it('refuse un mois hors de 1 à 12', () => {
    expect(() => formaterPeriode(d(2025, 13), d(2026), 'fr')).toThrow(RangeError);
    expect(() => formaterPeriode(d(2025), d(2026, 0), 'fr')).toThrow(RangeError);
  });
});

const ETAPES: readonly EtapeFrise[] = [
  { intitule: 'Étape A', debut: d(2019, 9), fin: d(2021, 6), etat: 'accomplie' },
  { intitule: 'Étape B', detail: 'Détail', debut: d(2021, 9), fin: d(2024, 7), etat: 'accomplie' },
  { intitule: 'Étape C', debut: d(2025, 9), fin: d(2028), etat: 'mise-en-avant' },
  { intitule: 'Étape D', debut: '[C-01 — début]', fin: '[C-01 — fin]', etat: 'prevue' },
];

function rendre(etapes = ETAPES, entrees: Record<string, string> = {}): HTMLElement {
  const fixture = TestBed.createComponent(Frise);
  fixture.componentRef.setInput('etapes', etapes);
  Object.entries(entrees).forEach(([nom, valeur]) => fixture.componentRef.setInput(nom, valeur));
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

const tous = (hote: Element, selecteur: string) => [...hote.querySelectorAll(selecteur)];
const texte = (element: Element | null) => element?.textContent?.replace(/\s+/g, ' ').trim();
// Le texte exact de chaque période, espaces insécables comprises.
const periodes = (hote: Element) => tous(hote, '.frise__periode').map((p) => p.textContent);

describe('Frise', () => {
  it('est une liste ordonnée, une étape par élément, dans l’ordre reçu', () => {
    for (const etapes of [ETAPES, [...ETAPES].reverse()]) {
      const liste = rendre(etapes).querySelector('ol')!;
      expect([...liste.children].map((e) => e.localName)).toEqual(etapes.map(() => 'li'));
      const intitules = tous(liste, '.frise__intitule').map((i) => i.firstChild?.textContent);
      expect(intitules.map((i) => i?.trim())).toEqual(etapes.map((etape) => etape.intitule));
    }
  });

  it('rend un point décoratif, la période, l’intitulé et le détail donné, sans interaction', () => {
    const [a, b] = tous(rendre(), 'li');
    const parties = (etape: Element) => [...etape.children].map((p) => p.className.slice(7));
    expect(parties(a)).toEqual(['point', 'periode', 'intitule']);
    expect(parties(b)).toEqual(['point', 'periode', 'intitule', 'detail']);
    expect(texte(b.querySelector('.frise__detail'))).toBe('Détail');
    for (const point of tous(rendre(), '.frise__point')) {
      expect([point.getAttribute('aria-hidden'), point.textContent]).toEqual(['true', '']);
    }
    expect(rendre().querySelector('a, button, input, [tabindex]')).toBeNull();
  });

  it('écrit chaque période depuis ses dates, dans la langue de l’application', () => {
    expect(periodes(rendre())).toEqual([
      '09/2019\u00a0– 06/2021',
      '09/2021\u00a0– 07/2024',
      '09/2025\u00a0– 2028',
      '[C-01 — début]\u00a0– [C-01 — fin]',
    ]);
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [{ provide: LOCALE_ID, useValue: 'ja' }] });
    expect(periodes(rendre())[0]).toBe('2019/09\u00a0– 2021/06');
  });

  it('porte l’état de chaque étape, accomplie, mise en avant ou prévue, par sa seule classe', () => {
    const etats = tous(rendre(), 'li').map((etape) =>
      [...etape.classList].filter((classe) => classe.startsWith('frise__etape--')),
    );
    expect(etats.map(([etat]) => etat.slice(14))).toEqual(ETAPES.map((etape) => etape.etat));
    expect(etats.every((classes) => classes.length === 1)).toBe(true);
  });

  it('annonce l’étape mise en avant, et elle seule, par un texte masqué dans son intitulé', () => {
    const masques = tous(rendre(), '.masque-visuellement');
    expect(masques).toHaveLength(1);
    expect(texte(masques[0])).toBe('(étape mise en avant)');
    expect(masques[0].closest('li')?.classList).toContain('frise__etape--mise-en-avant');
    expect(texte(masques[0].parentElement)).toBe('Étape C (étape mise en avant)');
  });

  it('refuse plus d’une étape mise en avant', () => {
    expect(() => rendre([ETAPES[2], ETAPES[2]])).toThrow(/une étape au plus/);
  });

  it('arrête le trait à l’étape mise en avant, et n’en trace aucun sans étape à atteindre', () => {
    const liste = rendre().querySelector('ol')!;
    expect(liste.classList).toContain('frise__liste--trace');
    expect(liste.style.getPropertyValue('--etape-avant')).toBe('3');
    const accomplies = ETAPES.map((etape) => ({ ...etape, etat: 'accomplie' as const }));
    for (const etapes of [accomplies, [ETAPES[2], ETAPES[0]]]) {
      expect(rendre(etapes).querySelector('ol')?.classList).not.toContain('frise__liste--trace');
    }
  });

  // jsdom applique la feuille du composant et résout var() ; les couleurs, posées sur html le
  // temps du test, sont retirées ensuite : Vitest tourne sans isolation (#169).
  it('écrit chaque texte d’une couleur pleine de la charte, selon l’état : aucun n’est grisé', () => {
    const noms = ['texte', 'texte-secondaire', 'texte-discret', 'accent'];
    const [fort, secondaire, discret, accent] = noms.map((_, n) => `rgb(${n + 1}, 0, 0)`);
    const html = document.documentElement;
    try {
      noms.forEach((nom, n) => html.style.setProperty(`--couleur-${nom}`, `rgb(${n + 1}, 0, 0)`));
      const couleur = (etape: Element, partie: string) =>
        getComputedStyle(etape.querySelector(`.frise__${partie}`)!).color;
      const etapes = tous(rendre(), 'li');
      expect(etapes.map((e) => [couleur(e, 'periode'), couleur(e, 'intitule')])).toEqual([
        [discret, fort],
        [discret, fort],
        [accent, fort],
        [discret, secondaire],
      ]);
      expect(couleur(etapes[1], 'detail')).toBe(secondaire);
    } finally {
      noms.forEach((nom) => html.style.removeProperty(`--couleur-${nom}`));
    }
  });

  it('nomme la liste par son libellé, s’il est donné, et ne rend rien sans étape', () => {
    expect(rendre().querySelector('ol')?.hasAttribute('aria-label')).toBe(false);
    const liste = rendre(ETAPES, { libelle: 'Étapes' }).querySelector('ol');
    expect(liste?.getAttribute('aria-label')).toBe('Étapes');
    expect(rendre([]).children).toHaveLength(0);
  });
});
