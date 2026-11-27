import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Ambiance } from '../../../components/ambiance/ambiance';
import { EnteteSection } from '../../../components/entete-section/entete-section';
import { Etiquette } from '../../../components/etiquette/etiquette';
import { Frise, type EtapeFrise } from '../../../components/frise/frise';
import type { EtapeParcours } from '../../../interfaces/contenu';
import { LectureParcours } from '../../../services/contenu/parcours';

/**
 * Une étape du parcours, telle que la frise la reçoit (CO-09) : son intitulé, son état, écrit dans
 * le contenu, jamais déduit de la date du jour, et son début et sa fin, tels que le contenu les
 * donne. Une date ({ annee, mois }) est formatée par la frise selon la langue (formaterPeriode) ;
 * un emplacement étiqueté (« [C-01 — début] ») y passe tel quel : rien n'est inventé ni laissé
 * vide. Le bac+3 a pour détail son type et son établissement (EC-02) ; les autres n'en ont pas.
 */
function etapeDeFrise(etape: EtapeParcours): EtapeFrise {
  const { type, intitule, etablissement, debut, fin, etat } = etape;
  const detail =
    type === 'bac+3' && etablissement !== undefined
      ? $localize`:@@parcours.detail-bac3:Bac+3 · ${etablissement}:etablissement:`
      : undefined;
  return { intitule, detail, debut, fin, etat };
}

/**
 * La section Parcours de la page principale (EC-02 ; MF-07, MF-08, MF-18), posée par la page dans
 * son élément section#parcours. Dans l'ordre de lecture : l'en-tête de section numéroté 01, son
 * titre de niveau 2 à la taille titre-1 (CO-16, choix 4 et 5) et la phrase d'introduction (C-10) ;
 * le bloc « Orientation », le texte d'orientation vers l'architecture logicielle (C-09) ; la frise
 * des trois étapes, dans l'ordre reconversion, bac+3, master, que garantit LectureParcours, chacune
 * avec sa période (C-01). Tout texte vient de parcours.json. L'en-tête ouvre la section sur
 * l'arrière-plan d'ambiance d'une section (CO-13), sur toute la largeur de la page ; la suite est
 * sur le fond uni, la frise sur le conteneur large (charte, section 5). Statique : la cascade, le
 * tracé de la frise au défilement et la respiration du halo viendront avec le mouvement (TK-48,
 * TK-53, MV-04).
 */
@Component({
  selector: 'app-parcours',
  imports: [Ambiance, EnteteSection, Etiquette, Frise],
  templateUrl: './parcours.html',
  styleUrl: './parcours.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Parcours {
  protected readonly parcours = inject(LectureParcours).parcours;
  protected readonly etapes: readonly EtapeFrise[] = this.parcours.etapes.map(etapeDeFrise);
}
