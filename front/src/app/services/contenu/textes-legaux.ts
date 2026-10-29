import { Injectable, InjectionToken, inject } from '@angular/core';
import { contenuTextesLegaux } from '../../../contenu/contenu-langue';
import type { TextesLegaux } from '../../interfaces/contenu';

/** textes-legaux.json : celui de la langue du build, ou un contenu de test. */
export const FICHIER_TEXTES_LEGAUX = new InjectionToken<TextesLegaux>('textes-legaux.json', {
  factory: () => contenuTextesLegaux,
});

@Injectable({ providedIn: 'root' })
export class LectureTextesLegaux {
  readonly textesLegaux: TextesLegaux = inject(FICHIER_TEXTES_LEGAUX);
}
