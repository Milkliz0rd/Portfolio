// Fonctions pures du mouvement (PF-04), testées avec les valeurs de la charte. Les motifs y
// ajoutent les leurs (inversion de courbe, minutage de l'écriture, progression de la frise…).
import { DEPART_CASCADE_MS, ELEMENTS_PAR_CASCADE, type ModeArrivee } from './reglages';

/**
 * Le délai, en ms, de l'élément de rang `rang` (0 pour le premier) d'une cascade (MV-01) : le
 * premier à 120 ms, puis `ecartMs` de plus par élément, six au plus ; les suivants partent avec
 * le sixième.
 */
export function delaiCascade(rang: number, ecartMs: number): number {
  return DEPART_CASCADE_MS + Math.min(rang, ELEMENTS_PAR_CASCADE - 1) * ecartMs;
}

const DUREE = /^(\d+(?:\.\d+)?|\.\d+)(ms|s)$/i;

/**
 * Une durée CSS en ms, en millisecondes (« 240ms ») comme en secondes (« .24s ») : le minifieur
 * réécrit les jetons de la feuille compilée en secondes. `repliMs` pour une valeur illisible.
 */
export function lireDureeMs(valeur: string, repliMs: number): number {
  const [, nombre, unite] = DUREE.exec(valeur.trim()) ?? [];
  if (nombre === undefined || unite === undefined) return repliMs;
  return Math.round(Number(nombre) * (unite.toLowerCase() === 's' ? 1000 : 1));
}

/**
 * Le mode d'arrivée d'une page selon son origine : immédiat au retour ou à l'avance dans
 * l'historique, type de navigation « back_forward » au premier chargement
 * (PerformanceNavigationTiming) ou déclencheur « popstate » d'une navigation du routeur.
 */
export function modeArrivee(origine: string | undefined): ModeArrivee {
  return origine === 'back_forward' || origine === 'popstate' ? 'immediat' : 'anime';
}
