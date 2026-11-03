import { delaiCascade, lireDureeMs, modeArrivee } from './calculs';

// Les valeurs de la charte (section 6, MV-01) : delai-cascade vaut 70 ms.
const DELAI_CASCADE = 70;

describe('delaiCascade', () => {
  it('fait partir le premier élément à 120 ms, puis 70 ms d’écart par élément', () => {
    expect(delaiCascade(0, DELAI_CASCADE)).toBe(120);
    expect(delaiCascade(1, DELAI_CASCADE)).toBe(190);
  });

  it('fait partir le sixième à 470 ms, et les suivants avec lui', () => {
    expect(delaiCascade(5, DELAI_CASCADE)).toBe(470);
    expect(delaiCascade(6, DELAI_CASCADE)).toBe(470);
    expect(delaiCascade(12, DELAI_CASCADE)).toBe(470);
  });
});

describe('lireDureeMs', () => {
  it('lit une durée en millisecondes, celle de la source', () => {
    expect(lireDureeMs('240ms', 0)).toBe(240);
    expect(lireDureeMs('70ms', 0)).toBe(70);
  });

  it('lit une durée en secondes, celle que le minifieur écrit dans la feuille compilée', () => {
    expect(lireDureeMs('.24s', 0)).toBe(240);
    expect(lireDureeMs('0.07s', 0)).toBe(70);
    expect(lireDureeMs('8s', 0)).toBe(8000);
    expect(lireDureeMs(' 1.2s ', 0)).toBe(1200);
  });

  it('rend le repli pour une valeur illisible ou absente', () => {
    expect(lireDureeMs('soixante-dix', 70)).toBe(70);
    expect(lireDureeMs('70px', 70)).toBe(70);
    expect(lireDureeMs('-70ms', 70)).toBe(70);
    expect(lireDureeMs('', 70)).toBe(70);
  });
});

describe('modeArrivee', () => {
  it('est immédiat au retour ou à l’avance dans l’historique', () => {
    expect(modeArrivee('back_forward')).toBe('immediat');
    expect(modeArrivee('popstate')).toBe('immediat');
  });

  it('est animé sinon', () => {
    for (const origine of ['navigate', 'reload', 'prerender', 'imperative', 'hashchange']) {
      expect(modeArrivee(origine), origine).toBe('anime');
    }
    expect(modeArrivee(undefined)).toBe('anime');
  });
});
