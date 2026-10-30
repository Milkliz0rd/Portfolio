import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type VarianteEtiquette = 'discrete' | 'accent' | 'numerotee' | 'puce';

/**
 * Étiquette de la charte (CO-04) : annonce, date ou range un contenu, dans un texte court projeté
 * par la page, en police-mono et capitales espacées, à 12 px au moins. Discrète pour les
 * métadonnées et les clés, accent en sur-titre. Numérotée, « 02 — Section » : le numéro en accent,
 * puis un trait de 24 px, élément à part que le mouvement étirera (MV-05). À puce lumineuse : un
 * point d'accent de 7 px qui rayonne. Trait et puce sont décoratifs. Statique.
 */
@Component({
  selector: 'app-etiquette',
  templateUrl: './etiquette.html',
  styleUrl: './etiquette.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'etiquette',
    '[class.etiquette--discrete]': "variante() === 'discrete'",
    '[class.etiquette--accent]': "variante() === 'accent'",
    '[class.etiquette--numerotee]': "variante() === 'numerotee'",
    '[class.etiquette--puce]': "variante() === 'puce'",
  },
})
export class Etiquette {
  readonly variante = input<VarianteEtiquette>('discrete');
  /** Le numéro de la variante numérotée, écrit par la page : « 02 ». */
  readonly numero = input<string>();

  protected readonly numeroAffiche = computed(() => {
    const numero = this.numero()?.trim();
    if (this.variante() === 'numerotee' && !numero) {
      throw new Error('Une étiquette numérotée exige son numéro : entrée « numero ».');
    }
    return numero;
  });
}
