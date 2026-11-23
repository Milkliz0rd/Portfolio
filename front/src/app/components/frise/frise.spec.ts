import { DateFrise, DateOuEmplacement, formaterPeriode } from './frise';

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
