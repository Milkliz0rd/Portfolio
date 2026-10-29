import { Injectable, InjectionToken, inject } from '@angular/core';
import { contenuProfil } from '../../../contenu/contenu-langue';
import type { Profil } from '../../interfaces/contenu';

/** profil.json : celui de la langue du build, ou un contenu de test. */
export const FICHIER_PROFIL = new InjectionToken<Profil>('profil.json', {
  factory: () => contenuProfil,
});

@Injectable({ providedIn: 'root' })
export class LectureProfil {
  readonly profil: Profil = inject(FICHIER_PROFIL);
}
