import { Injectable, InjectionToken, inject } from '@angular/core';
import { contenuCompetences } from '../../../contenu/contenu-langue';
import type { Competences } from '../../interfaces/contenu';
import { parRang } from './lecture/lecture';

/** competences.json : celui de la langue du build, ou un contenu de test. */
export const FICHIER_COMPETENCES = new InjectionToken<Competences>('competences.json', {
  factory: () => contenuCompetences,
});

/** Catégories et compétences par rang ; une catégorie sans compétence est retirée. */
function lire(fichier: Competences): Competences {
  const techniques = parRang(fichier.techniques)
    .map((categorie) => ({ ...categorie, competences: parRang(categorie.competences) }))
    .filter((categorie) => categorie.competences.length > 0);
  const humaines = { ...fichier.humaines, competences: parRang(fichier.humaines.competences) };
  return { techniques, humaines };
}

@Injectable({ providedIn: 'root' })
export class LectureCompetences {
  readonly competences: Competences = lire(inject(FICHIER_COMPETENCES));
}
