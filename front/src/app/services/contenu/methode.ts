import { Injectable, InjectionToken, inject } from '@angular/core';
import { contenuMethode } from '../../../contenu/contenu-langue';
import { CLES_ILLUSTRATION } from '../../interfaces/contenu';
import type { Brut, Methode } from '../../interfaces/contenu';
import { valeurFermee } from './lecture/lecture';

/** methode.json : celui de la langue du build, ou un contenu de test. */
export const FICHIER_METHODE = new InjectionToken<Brut<Methode>>('methode.json', {
  factory: () => contenuMethode,
});

/** Les étapes, dans l'ordre du fichier, chacune avec une clé du registre des illustrations. */
function lire(fichier: Brut<Methode>): Methode {
  const etapes = fichier.etapes.map((etape, i) => {
    const champ = `methode.json, etapes[${i}].illustration`;
    return { ...etape, illustration: valeurFermee(CLES_ILLUSTRATION, etape.illustration, champ) };
  });
  return { ...fichier, etapes };
}

@Injectable({ providedIn: 'root' })
export class LectureMethode {
  readonly methode: Methode = lire(inject(FICHIER_METHODE));
}
