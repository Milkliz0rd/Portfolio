import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { competencesDuBanc } from '../../../../configuration/configuration.genere';
import { Ambiance } from '../../../components/ambiance/ambiance';
import { Carte } from '../../../components/carte/carte';
import { EnteteSection } from '../../../components/entete-section/entete-section';
import { Etiquette } from '../../../components/etiquette/etiquette';
import { Pastille } from '../../../components/pastille/pastille';
import type { Competences as ContenuCompetences } from '../../../interfaces/contenu';
import { FICHIER_COMPETENCES, LectureCompetences } from '../../../services/contenu/competences';

/**
 * Le fichier que lit la section : competences.json, auquel le build de test seul ajoute son
 * contenu de test (configuration.genere.ts), une catégorie sans compétence, avant la lecture :
 * elle passe par le même tri et le même retrait que les catégories du contenu. Ailleurs,
 * competencesDuBanc est vide, et les catégories sont celles du fichier.
 */
export function avecLeBanc(fichier: ContenuCompetences): ContenuCompetences {
  return { ...fichier, techniques: [...fichier.techniques, ...competencesDuBanc] };
}

/**
 * La section Compétences de la page principale (EC-03, MF-09, MF-10), dans l'élément section de
 * la page, à l'ancre competences. Dans l'ordre de lecture : l'en-tête de section numéroté 02, titre
 * seul de niveau 2, sans chapô (choix C5) ; les compétences techniques, une carte pleine par
 * catégorie, catégories et compétences par rang, seulement celles du contenu (C-02) ; les
 * compétences humaines, en pastilles posées directement sous le titre de leur bloc, sans carte, à
 * gauche de la carte du récit de reconversion (C-07) à partir de 900 px, au-dessus d'elle en deçà
 * (choix 6). LectureCompetences range par rang et retire une catégorie sans compétence (PF-02).
 * Aucun niveau (A-06) : une compétence n'est que son libellé. Les titres des blocs et de la carte
 * du récit sont ceux de la maquette, marqués pour la traduction. L'en-tête ouvre la section sur
 * l'arrière-plan d'ambiance d'une section (CO-13), sur toute la largeur de la page ; les blocs
 * suivent sur le fond uni, hors du halo : aucune carte n'est posée sur lui. Statique : la cascade
 * et la respiration du halo viendront avec le mouvement (TK-48, MV-04).
 */
@Component({
  selector: 'app-competences',
  imports: [Ambiance, Carte, EnteteSection, Etiquette, Pastille],
  templateUrl: './competences.html',
  styleUrl: './competences.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Une lecture propre à la section, du fichier augmenté du contenu de test : le service de la
  // racine et le fichier qu'il lit restent ceux de la langue du build.
  providers: [
    LectureCompetences,
    {
      provide: FICHIER_COMPETENCES,
      useFactory: () => avecLeBanc(inject(FICHIER_COMPETENCES, { skipSelf: true })),
    },
  ],
})
export class Competences {
  protected readonly competences = inject(LectureCompetences).competences;
}
