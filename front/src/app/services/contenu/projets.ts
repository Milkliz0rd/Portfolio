import { Injectable, InjectionToken, inject } from '@angular/core';
import { contenuProjets } from '../../../contenu/contenu-langue';
import type { Projet } from '../../interfaces/contenu';
import { parRang } from './lecture/lecture';

/** Les projets de l'index généré pour la langue du build, ou des contenus de test. */
export const FICHIERS_PROJETS = new InjectionToken<readonly Projet[]>('projets/*.json', {
  factory: () => contenuProjets,
});

@Injectable({ providedIn: 'root' })
export class LectureProjets {
  /** Par rang croissant : un projet ajouté prend sa place sans toucher aux autres (MF-14). */
  readonly projets: readonly Projet[] = parRang(inject(FICHIERS_PROJETS));

  /** Le projet de cet identifiant, ou undefined s'il n'existe pas. */
  trouver(identifiant: string): Projet | undefined {
    return this.projets.find((projet) => projet.identifiant === identifiant);
  }
}
