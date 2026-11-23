import { sectionLue } from './section-lue';

// Une fenêtre de 1000 px de haut : le seuil est à 400 px de son haut. Cinq sections dont le haut
// est donné dans la fenêtre, dans l'ordre du document ; 2000 px restent à défiler, sauf au bout.
const HAUTEUR = 1000;
const LOIN_DU_BOUT = 2000;

describe('sectionLue', () => {
  it('rend l’accueil (-1) avant la première section', () => {
    expect(sectionLue([600, 1600, 2600, 3600, 4600], HAUTEUR, LOIN_DU_BOUT)).toBe(-1);
    expect(sectionLue([], HAUTEUR, LOIN_DU_BOUT)).toBe(-1);
  });

  it('compte une section dès que son haut atteint 40 % de la fenêtre, pas avant', () => {
    expect(sectionLue([400, 1400, 2400, 3400, 4400], HAUTEUR, LOIN_DU_BOUT)).toBe(0);
    expect(sectionLue([401, 1401, 2401, 3401, 4401], HAUTEUR, LOIN_DU_BOUT)).toBe(-1);
    // À 45 %, le haut n'a pas encore passé le seuil.
    expect(sectionLue([-1000, 450, 1450, 2450, 3450], HAUTEUR, LOIN_DU_BOUT)).toBe(0);
  });

  it('rend la dernière section passée, entre deux sections', () => {
    expect(sectionLue([-2500, -1500, -500, 350, 1350], HAUTEUR, LOIN_DU_BOUT)).toBe(3);
    expect(sectionLue([-2500, -1500, -500, 500, 1500], HAUTEUR, LOIN_DU_BOUT)).toBe(2);
  });

  it('rend au bout de la page la dernière section dont le haut est dans la fenêtre, sur un écran haut', () => {
    // Écran de 2560 px : les deux dernières sections, courtes, n'atteignent jamais le seuil.
    const hauts = [-3000, -1500, 200, 1400, 2100];
    expect(sectionLue(hauts, 2560, 0)).toBe(4);
    expect(sectionLue(hauts, 2560, 300)).toBe(2);
    // Il reste moins d'un pixel : c'est le bout de la page.
    expect(sectionLue(hauts, 2560, 0.5)).toBe(4);
    // Un haut sur le bord bas de la fenêtre n'y est pas.
    expect(sectionLue([-3000, -1500, 200, 1400, 2560], 2560, 0)).toBe(3);
  });
});
