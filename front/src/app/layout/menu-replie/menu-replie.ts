import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  DOCUMENT,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icone } from '../../components/icone/icone';
import { Lien } from '../../components/lien/lien';
import { NavigationService } from '../../services/navigation/navigation';
import { entreesNavigation } from '../entete/entrees';

/**
 * Le menu replié (CO-07), sur details et summary : il s'ouvre et se ferme par son bouton avant le
 * démarrage de l'application et sans script, et ses entrées sont de vrais liens. Le résumé est le
 * bouton icône (trois traits, croix une fois ouvert), au libellé masqué « Menu » ; le navigateur
 * annonce son état, et aria-controls nomme le panneau qu'il commande. Le panneau liste les entrées
 * de la navigation complète (la même liste), mêmes liens du routeur, même replaceUrl sur la page
 * principale, même entrée signalée, qui porte son propre repère (fond et barre), sans nom de
 * transition de vue (PF-04). Ce n'est pas une fenêtre modale : la page reste accessible.
 *
 * Une fois l'application démarrée (décision 3 de W19), Échap ferme le panneau et rend le focus au
 * bouton, un clic hors du panneau le ferme, et choisir une entrée le ferme ; rien d'autre : la
 * lecture ne bouge pas, et le clic reçu suit son cours. L'attribut open n'est jamais lié : un
 * panneau ouvert avant le démarrage le reste après ; le menu le lit et le ferme lui-même.
 */
@Component({
  selector: 'app-menu-replie',
  imports: [RouterLink, Lien, Icone],
  templateUrl: './menu-replie.html',
  styleUrl: './menu-replie.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuReplie {
  protected readonly entrees = entreesNavigation();
  /** L'id du panneau, que nomme l'aria-controls du bouton : un seul menu par page. */
  protected readonly idPanneau = 'menu-replie-panneau';

  protected readonly navigation = inject(NavigationService);
  private readonly menu = viewChild.required<ElementRef<HTMLDetailsElement>>('menu');
  private readonly bouton = viewChild.required<ElementRef<HTMLElement>>('bouton');
  private readonly panneau = viewChild.required<ElementRef<HTMLElement>>('panneau');
  private readonly document = inject(DOCUMENT);
  private readonly destruction = inject(DestroyRef);

  constructor() {
    // Les écouteurs du document vivent dans le navigateur seulement, jamais au pré-rendu, et
    // partent avec le menu.
    afterNextRender(() => {
      const touche = (evenement: KeyboardEvent) => this.surTouche(evenement);
      const clic = (evenement: MouseEvent) => this.surClic(evenement);
      this.document.addEventListener('keydown', touche);
      this.document.addEventListener('click', clic);
      this.destruction.onDestroy(() => {
        this.document.removeEventListener('keydown', touche);
        this.document.removeEventListener('click', clic);
      });
    });
  }

  // Échap ferme le panneau ouvert et rend le focus au bouton, dans l'en-tête collant, sans
  // faire défiler la page.
  private surTouche(evenement: KeyboardEvent): void {
    const menu = this.menu().nativeElement;
    if (evenement.key !== 'Escape' || !menu.open) return;
    menu.open = false;
    this.bouton().nativeElement.focus({ preventScroll: true });
  }

  // Un clic hors du menu le ferme ; dans le panneau, seul le choix d'une entrée le ferme, et le
  // routeur, qui a reçu le clic avant le document, mène à sa cible. Le bouton s'ouvre et se ferme
  // seul (details). Le clic n'est jamais arrêté.
  private surClic(evenement: MouseEvent): void {
    const menu = this.menu().nativeElement;
    const cible = evenement.target as Element | null;
    if (!menu.open) return;
    const choix = !!cible && this.panneau().nativeElement.contains(cible) && !!cible.closest('a');
    if (choix || !menu.contains(cible)) menu.open = false;
  }
}
