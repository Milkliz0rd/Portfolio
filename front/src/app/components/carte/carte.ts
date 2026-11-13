import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  inject,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icone } from '../icone/icone';
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
 *
 * Avec un lien, une adresse du site posée par routerLink, la carte devient interactive : un seul
 * lien, dans le titre, dont le texte est le titre, étendu à toute la carte. Ce lien du routeur
 * reçoit aussi fragment et replaceUrl, sous leurs noms : une carte de l'accueil mène à sa section
 * (lien « / », fragment « parcours ») en remplaçant l'entrée courante de l'historique, sans en
 * ajouter une (PF-06). Sans lien, ni ancre ni remplacement : le rendu échoue. L'action du pied
 * (« Voir la fiche » et sa flèche) est dessinée par la carte, décorative : masquée aux lecteurs
 * d'écran, sans lien ni clic propre, pour ne pas annoncer deux fois la même destination. Les
 * calques d'ombre et de lueur, décoratifs et vides, attendent le mouvement (MV-06). Une carte
 * interactive ne se pose jamais sur un halo (charte, section 8).
 */
@Component({
  selector: 'app-carte',
  imports: [Icone, NgTemplateOutlet, RouterLink],
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
    '[class.carte--interactive]': '!!lien()',
  },
})
export class Carte {
  readonly variante = input<VarianteCarte>('verre');
  /** Le titre, écrit et marqué pour la traduction par la page. */
  readonly titre = input.required<string>();
  /** Le niveau du titre dans la hiérarchie de la page : h2, h3 ou h4. */
  readonly niveauTitre = input.required<NiveauTitreCarte>();
  /** Une adresse du site (« / », « /contact ») : la carte devient interactive. */
  readonly lien = input<string>();
  /** L'ancre visée à cette adresse (« parcours »), comme le fragment d'un lien du routeur. */
  readonly fragment = input<string>();
  /** Remplace l'entrée courante de l'historique au lieu d'en ajouter une, comme replaceUrl. */
  readonly replaceUrl = input(false, { transform: booleanAttribute });
  /** Le libellé de l'action du pied, décorative, écrit et marqué pour la traduction par la page. */
  readonly action = input<string>();

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

  // Une ancre ou un remplacement d'adresse sans lien ne mènerait nulle part : le rendu échoue.
  protected readonly lienAffiche = computed(() => {
    const lien = this.lien();
    if (!lien && (this.fragment() !== undefined || this.replaceUrl())) {
      throw new Error(
        'Une carte sans lien ne prend ni fragment ni replaceUrl : entrée « lien » (CO-05).',
      );
    }
    return lien;
  });

  // Une action sans lien promettrait une destination que rien ne porte : le rendu échoue.
  protected readonly actionAffichee = computed(() => {
    const action = this.action()?.trim();
    if (action && !this.lien()) {
      throw new Error('Une action de carte exige son lien : entrée « lien » (CO-05).');
    }
    return action;
  });
}
