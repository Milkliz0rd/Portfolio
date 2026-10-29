import { Injectable, InjectionToken, inject } from '@angular/core';
import { contenuExperience } from '../../../contenu/contenu-langue';
import { CLES_VOLET } from '../../interfaces/contenu';
import type { Brut, Experience } from '../../interfaces/contenu';
import { valeurFermee } from './lecture/lecture';

/** experience.json : celui de la langue du build, ou un contenu de test. */
export const FICHIER_EXPERIENCE = new InjectionToken<Brut<Experience>>('experience.json', {
  factory: () => contenuExperience,
});

/** L'alternance typée : chaque volet porte une clé connue. */
function lire(fichier: Brut<Experience>): Experience {
  const volets = fichier.volets.map((volet, i) => ({
    ...volet,
    cle: valeurFermee(CLES_VOLET, volet.cle, `experience.json, volets[${i}].cle`),
  }));
  return { ...fichier, volets };
}

@Injectable({ providedIn: 'root' })
export class LectureExperience {
  readonly experience: Experience = lire(inject(FICHIER_EXPERIENCE));
}
