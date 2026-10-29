import { Injectable, InjectionToken, inject } from '@angular/core';
import { contenuParcours } from '../../../contenu/contenu-langue';
import { ETATS_ETAPE, TYPES_ETAPE } from '../../interfaces/contenu';
import type { Brut, EtapeParcours, Parcours } from '../../interfaces/contenu';
import { valeurFermee } from './lecture/lecture';

/** parcours.json : celui de la langue du build, ou un contenu de test. */
export const FICHIER_PARCOURS = new InjectionToken<Brut<Parcours>>('parcours.json', {
  factory: () => contenuParcours,
});

/** Les étapes typées, toujours dans l'ordre reconversion, bac+3, master (MF-07). */
function lire(fichier: Brut<Parcours>): Parcours {
  const etapes = fichier.etapes.map((etape, i) => ({
    ...etape,
    type: valeurFermee(TYPES_ETAPE, etape.type, `parcours.json, etapes[${i}].type`),
    etat: valeurFermee(ETATS_ETAPE, etape.etat, `parcours.json, etapes[${i}].etat`),
  }));
  const ordre = (etape: EtapeParcours) => TYPES_ETAPE.indexOf(etape.type);
  return { ...fichier, etapes: etapes.sort((a, b) => ordre(a) - ordre(b)) };
}

@Injectable({ providedIn: 'root' })
export class LectureParcours {
  readonly parcours: Parcours = lire(inject(FICHIER_PARCOURS));
}
