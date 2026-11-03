// Réglages du mouvement (PF-04) : les valeurs que la charte fixe sans en faire un jeton CSS, et les
// jetons de durée que MouvementService lit dans la feuille de style. Un motif qui a besoin d'un
// autre jeton l'ajoute à JETONS_DUREE, avec sa valeur de la charte (section 3.8) en repli.

/** Départ du premier élément d'une cascade (MV-01), en millisecondes. */
export const DEPART_CASCADE_MS = 120;

/** Éléments au plus par cascade : les suivants partent avec le dernier d'entre eux (MV-01). */
export const ELEMENTS_PAR_CASCADE = 6;

/** Les jetons de durée lus au démarrage, et leur valeur de la charte, en ms, si la lecture échoue. */
export const JETONS_DUREE = {
  'delai-cascade': 70,
} as const;

export type JetonDuree = keyof typeof JETONS_DUREE;

/** anime : les motifs jouent leur entrée ; immediat : tout est posé dans son état final. */
export type ModeArrivee = 'anime' | 'immediat';

/** La clé du stockage local qui mémorise la pause des animations, relue aussi par le script de tête. */
export const CLE_PAUSE = 'mv-pause';

/** Les classes que le mouvement pose sur l'élément html. */
export const CLASSES = {
  actif: 'mv-actif',
  pret: 'mv-pret',
  pause: 'mv-pause',
  immediat: 'mv-immediat',
} as const;
