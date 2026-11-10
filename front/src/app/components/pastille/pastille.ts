import {
  AfterViewInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  InjectionToken,
  input,
  Signal,
} from '@angular/core';

export type VariantePastille =
  'neutre' | 'accent' | 'secondaire' | 'succes' | 'attention' | 'erreur' | 'contour';

/**
 * Vrai quand le composant qui le fournit pose son contenu sur du verre : la carte en verre (CO-05)
 * le fournit par providers, que voit aussi le contenu projeté par la page. Toute pastille qu'il
 * contient se rend alors en variante contour (CO-03).
 */
export const SURFACE_EN_VERRE = new InjectionToken<Signal<boolean>>('surface en verre');

/**
 * Pastille de la charte (CO-03) : qualifie un élément par un état ou une catégorie, en un ou deux
 * mots projetés par la page. Le point, de la couleur du texte, est décoratif : le mot porte le sens,
 * et une pastille sans mot lève une erreur au rendu. Statique, sans survol ni focus : une pastille
 * cliquable deviendrait un bouton ou un lien.
 *
 * Sur du verre (carte CO-05) comme sur le halo d'un arrière-plan d'ambiance (CO-13), seule la
 * variante contour est permise ; la neutre et les teintées se posent sur un fond uni, couleur-fond
 * ou couleur-surface. Posée sur le verre, une teintée tomberait à 3.60:1 (charte, section 8). Dans
 * une carte en verre (SURFACE_EN_VERRE), la pastille prend d'office la variante contour, quelle que
 * soit sa variante ; sur le halo d'une ambiance, la règle reste à tenir par la page.
 */
@Component({
  selector: 'app-pastille',
  templateUrl: './pastille.html',
  styleUrl: './pastille.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'pastille',
    '[class.pastille--neutre]': "varianteAffichee() === 'neutre'",
    '[class.pastille--accent]': "varianteAffichee() === 'accent'",
    '[class.pastille--secondaire]': "varianteAffichee() === 'secondaire'",
    '[class.pastille--succes]': "varianteAffichee() === 'succes'",
    '[class.pastille--attention]': "varianteAffichee() === 'attention'",
    '[class.pastille--erreur]': "varianteAffichee() === 'erreur'",
    '[class.pastille--contour]': "varianteAffichee() === 'contour'",
    '[class.pastille--lumineuse]': 'lumineuse()',
  },
})
export class Pastille implements AfterViewInit {
  readonly variante = input<VariantePastille>('neutre');
  /** Le point rayonne, quelle que soit la variante. */
  readonly lumineuse = input(false, { transform: booleanAttribute });

  /** La variante rendue : contour sur le verre, sinon celle que demande la page. */
  protected readonly varianteAffichee = computed((): VariantePastille =>
    this.surVerre?.() ? 'contour' : this.variante(),
  );

  private readonly surVerre = inject(SURFACE_EN_VERRE, { optional: true });
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  // Le mot projeté est écrit quand la vue est prête : au pré-rendu, une pastille muette fait
  // échouer le build (app.config.server.ts).
  ngAfterViewInit(): void {
    if (!this.element.textContent?.trim()) {
      throw new Error('Une pastille porte toujours un mot : jamais de pastille muette (CO-03).');
    }
  }
}
