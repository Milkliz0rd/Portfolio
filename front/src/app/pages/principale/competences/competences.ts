import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Carte } from '../../../components/carte/carte';
import { EnteteSection } from '../../../components/entete-section/entete-section';
import { Etiquette } from '../../../components/etiquette/etiquette';
import { Pastille } from '../../../components/pastille/pastille';
import { LectureCompetences } from '../../../services/contenu/competences';

/**
 * La section Compétences de la page principale (EC-03, MF-09, MF-10), dans l'élément section de
 * la page, à l'ancre competences. Dans l'ordre de lecture : l'en-tête de section numéroté 02, titre
 * seul de niveau 2, sans chapô (choix C5) ; les compétences techniques, une carte pleine par
 * catégorie, catégories et compétences par rang, seulement celles du contenu (C-02) ; les
 * compétences humaines, en pastilles posées directement sous le titre de leur bloc, sans carte, à
 * gauche de la carte du récit de reconversion (C-07) à partir de 900 px, au-dessus d'elle en deçà
 * (choix 6). LectureCompetences range par rang et retire une catégorie sans compétence (PF-02).
 * Aucun niveau (A-06) : une compétence n'est que son libellé. Les titres des blocs et de la carte
 * du récit sont ceux de la maquette, marqués pour la traduction. Statique : la cascade viendra
 * avec le mouvement (TK-48).
 */
@Component({
  selector: 'app-competences',
  imports: [Carte, EnteteSection, Etiquette, Pastille],
  templateUrl: './competences.html',
  styleUrl: './competences.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Competences {
  protected readonly competences = inject(LectureCompetences).competences;
}
