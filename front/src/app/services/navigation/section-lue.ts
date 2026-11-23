/** Le seuil de la section lue : 40 % de la hauteur de la fenêtre, comme l'étape active du récit. */
export const SEUIL_SECTION_LUE = 0.4;

/**
 * La section lue de la page principale (PF-06), d'après le haut de chacune de ses sections dans la
 * fenêtre (getBoundingClientRect), dans l'ordre du document : la dernière dont le haut a passé
 * 40 % de la hauteur de la fenêtre, -1 (l'accueil) avant la première. Quand la page ne peut plus
 * défiler vers le bas (il reste moins d'un pixel : les positions sont fractionnaires), la dernière
 * dont le haut est dans la fenêtre, donc au-dessus de son bord bas : sur un écran haut, la dernière
 * section, que suit le seul pied de page, ne passerait jamais le seuil.
 */
export function sectionLue(hauts: readonly number[], hauteur: number, reste: number): number {
  const passee =
    reste < 1
      ? (haut: number) => haut < hauteur
      : (haut: number) => haut <= SEUIL_SECTION_LUE * hauteur;
  let lue = -1;
  hauts.forEach((haut, indice) => {
    if (passee(haut)) lue = indice;
  });
  return lue;
}
