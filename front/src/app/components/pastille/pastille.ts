import {
  AfterViewInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
} from '@angular/core';

export type VariantePastille =
  'neutre' | 'accent' | 'secondaire' | 'succes' | 'attention' | 'erreur' | 'contour';

/**
 * Pastille de la charte (CO-03) : qualifie un élément par un état ou une catégorie, en un ou deux
 * mots projetés par la page. Le point, de la couleur du texte, est décoratif : le mot porte le sens,
 * et une pastille sans mot lève une erreur au rendu. Statique, sans survol ni focus : une pastille
 * cliquable deviendrait un bouton ou un lien.
 *
 * Sur du verre (carte CO-05) comme sur le halo d'un arrière-plan d'ambiance (CO-13), seule la
 * variante contour est permise ; la neutre et les teintées se posent sur un fond uni, couleur-fond
 * ou couleur-surface. Posée sur le verre, une teintée tomberait à 3.60:1 (charte, section 8).
 */
@Component({
  selector: 'app-pastille',
  templateUrl: './pastille.html',
  styleUrl: './pastille.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'pastille',
    '[class.pastille--neutre]': "variante() === 'neutre'",
    '[class.pastille--accent]': "variante() === 'accent'",
    '[class.pastille--secondaire]': "variante() === 'secondaire'",
    '[class.pastille--succes]': "variante() === 'succes'",
    '[class.pastille--attention]': "variante() === 'attention'",
    '[class.pastille--erreur]': "variante() === 'erreur'",
    '[class.pastille--contour]': "variante() === 'contour'",
    '[class.pastille--lumineuse]': 'lumineuse()',
  },
})
export class Pastille implements AfterViewInit {
  readonly variante = input<VariantePastille>('neutre');
  /** Le point rayonne, quelle que soit la variante. */
  readonly lumineuse = input(false, { transform: booleanAttribute });

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  // Le mot projeté est écrit quand la vue est prête. Au pré-rendu, l'erreur s'écrit dans le
  // journal du build sans l'arrêter, et la pastille muette part vide dans la page pré-rendue.
  ngAfterViewInit(): void {
    if (!this.element.textContent?.trim()) {
      throw new Error('Une pastille porte toujours un mot : jamais de pastille muette (CO-03).');
    }
  }
}
