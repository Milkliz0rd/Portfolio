import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type VarianteAmbiance = 'accueil' | 'section' | 'sobre';

/**
 * Arrière-plan d'ambiance de la charte (CO-13) : la lumière d'une section, sans interaction. L'hôte
 * est la boîte de la section qu'il éclaire ; la page y projette son contenu, posé au-dessus des
 * calques. Chaque calque est un élément rendu par le modèle, décoratif (aria-hidden), qui porte un
 * seul jeton : la trame, le halo d'accent (accueil et section), le halo secondaire, en coin opposé
 * (accueil), puis le voile bas, qui atteint couleur-fond pleine au bord bas de la section. Les
 * halos débordent de la section, qui les rogne ; rien n'est fixé à la fenêtre : les halos défilent
 * avec leur section. Fixe ici : la respiration des halos vient avec le mouvement (MV-04).
 *
 *   <app-ambiance variante="section">
 *     <section aria-labelledby="titre-page">…</section>
 *   </app-ambiance>
 *
 * Une carte interactive ne se pose jamais sur un halo, et une pastille posée sur un halo prend la
 * variante contour : la page s'en charge (charte, section 8).
 */
@Component({
  selector: 'app-ambiance',
  templateUrl: './ambiance.html',
  styleUrl: './ambiance.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ambiance',
    '[class.ambiance--accueil]': "variante() === 'accueil'",
    '[class.ambiance--section]': "variante() === 'section'",
    '[class.ambiance--sobre]': "variante() === 'sobre'",
  },
})
export class Ambiance {
  /** Accueil : deux halos et la trame ; section : un halo et la trame ; sobre : la trame seule. */
  readonly variante = input.required<VarianteAmbiance>();
}
