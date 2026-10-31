import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type TailleIndicateur = 'texte' | 'bouton' | 'grand';

/**
 * Indicateur d'activité de la charte (CO-15) : un anneau de la couleur du texte environnant, un
 * quart plein et le reste à 28 %, qui tourne tant que l'attente dure et reste fixe quand le
 * visiteur réduit les animations. Décoratif : le texte voisin dit ce qu'on attend.
 */
@Component({
  selector: 'app-indicateur-activite',
  templateUrl: './indicateur-activite.html',
  styleUrl: './indicateur-activite.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'indicateur-activite',
    '[class.indicateur-activite--bouton]': "taille() === 'bouton'",
    '[class.indicateur-activite--grand]': "taille() === 'grand'",
    'aria-hidden': 'true',
  },
})
export class IndicateurActivite {
  /** Dans un texte (par défaut), dans un bouton (couleur-texte-sur-accent) ou grand (32 px). */
  readonly taille = input<TailleIndicateur>('texte');
}
