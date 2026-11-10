import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  inject,
  input,
} from '@angular/core';
import { Pastille, SURFACE_EN_VERRE } from '../pastille/pastille';

export type VarianteCarte = 'verre' | 'pleine';
export type NiveauTitreCarte = 2 | 3 | 4;

/**
 * Carte de la charte (CO-05) : regroupe un contenu autonome (un projet, une compétence, un fait).
 * En verre sur un fond d'ambiance, pleine sur un fond uni. Le titre, écrit et marqué pour la
 * traduction par la page, est un vrai titre h2, h3 ou h4 de la hiérarchie de la page, à la taille
 * titre-3. La page projette le reste : une étiquette (app-etiquette) facultative, au-dessus du
 * titre ; le texte, en dessous ; des pastilles (app-pastille), facultatives, rangées dans le pied.
 * Sans étiquette ni pastille, rien n'est rendu à leur place : la carte se resserre.
 *
 *   <app-carte variante="pleine" titre="Parcours" i18n-titre="@@accueil.parcours" [niveauTitre]="3">
 *     <app-etiquette i18n="@@accueil.section">Section</app-etiquette>
 *     <ng-container i18n="@@accueil.parcours-texte">La phrase d'orientation.</ng-container>
 *     <app-pastille variante="accent" i18n="@@accueil.nouveau">Nouveau</app-pastille>
 *   </app-carte>
 *
 * Toute pastille posée dans une carte en verre, au pied ou dans le texte, se rend en variante
 * contour (CO-03) : la carte fournit SURFACE_EN_VERRE à son contenu.
 */
@Component({
  selector: 'app-carte',
  imports: [NgTemplateOutlet],
  templateUrl: './carte.html',
  styleUrl: './carte.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Par providers, et non viewProviders : le contenu projeté par la page le voit aussi.
  providers: [
    {
      provide: SURFACE_EN_VERRE,
      useFactory: () => {
        const carte = inject(Carte);
        return computed(() => carte.variante() === 'verre');
      },
    },
  ],
  host: {
    class: 'carte',
    '[class.carte--verre]': "variante() === 'verre'",
    '[class.carte--pleine]': "variante() === 'pleine'",
  },
})
export class Carte {
  readonly variante = input<VarianteCarte>('verre');
  /** Le titre, écrit et marqué pour la traduction par la page. */
  readonly titre = input.required<string>();
  /** Le niveau du titre dans la hiérarchie de la page : h2, h3 ou h4. */
  readonly niveauTitre = input.required<NiveauTitreCarte>();

  /** Les pastilles projetées au premier niveau : elles forment le pied. */
  protected readonly pastilles = contentChildren(Pastille);

  // Une carte sans titre n'annoncerait rien : au pré-rendu, le build échoue (app.config.server.ts).
  protected readonly titreAffiche = computed(() => {
    const titre = this.titre().trim();
    if (!titre) {
      throw new Error('Une carte porte toujours un titre : entrée « titre » (CO-05).');
    }
    return titre;
  });
}
