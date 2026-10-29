import { Injectable, InjectionToken, inject } from '@angular/core';
import { contenuAccueil } from '../../../contenu/contenu-langue';
import type { Accueil } from '../../interfaces/contenu';

/** accueil.json : celui de la langue du build, ou un contenu de test. */
export const FICHIER_ACCUEIL = new InjectionToken<Accueil>('accueil.json', {
  factory: () => contenuAccueil,
});

@Injectable({ providedIn: 'root' })
export class LectureAccueil {
  readonly accueil: Accueil = inject(FICHIER_ACCUEIL);
}
